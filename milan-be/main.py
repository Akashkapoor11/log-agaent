from fastapi import FastAPI, Depends, Request
from fastapi.routing import APIRouter
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi.middleware.cors import CORSMiddleware
import traceback
import logging

import models
import schemas
from database import engine, get_db

logging.basicConfig(level=logging.ERROR, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(title="AI Log Intelligence Backend")


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "HTTPException",
            "status_code": exc.status_code,
            "message": str(exc.detail),
            "path": str(request.url),
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "error": "ValidationError",
            "status_code": 422,
            "message": "Request validation failed",
            "details": exc.errors(),
            "path": str(request.url),
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    tb = traceback.format_exc()
    logger.error("Unhandled exception on %s\n%s", request.url, tb)
    return JSONResponse(
        status_code=500,
        content={
            "error": type(exc).__name__,
            "status_code": 500,
            "message": str(exc),
            "traceback": tb,
            "path": str(request.url),
        },
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter(prefix="/milan-aegis")


@router.get("/api/logs/normalized")
def get_normalized_logs(db: Session = Depends(get_db)):
    logs = db.query(models.NormalizedEvent).order_by(models.NormalizedEvent.event_timestamp.desc()).all()
    result = []
    for event in logs:
        nj = event.normalized_json or {}
        source = nj.get('source', event.device or 'Unknown')
        reason = nj.get('reason', '')
        normalized_text = ' '.join(filter(None, [event.event_type, event.login_status, reason]))
        result.append({
            "id": str(event.event_id),
            "timestamp": event.event_timestamp.strftime("%d/%m %H:%M:%S") if event.event_timestamp else "",
            "user": event.user_email or "Unknown",
            "event": (event.event_type or "Unknown").replace('_', ' ').title(),
            "status": event.login_status or "unknown",
            "system": source,
            "ip": str(event.ip_address) if event.ip_address else "",
            "location": event.geo_location or "Unknown",
            "normalizedText": normalized_text,
            "riskScore": float(event.risk_score) if event.risk_score else 0,
            "anomalyFlag": event.anomaly_flag or False,
            "original": nj,
        })
    return result


@router.get("/api/alerts")
def get_alerts(db: Session = Depends(get_db)):
    alerts = db.query(models.AnomalyAlert, models.NormalizedEvent).join(
        models.NormalizedEvent, models.AnomalyAlert.event_id == models.NormalizedEvent.event_id
    ).all()
    result = []
    for alert, event in alerts:
        result.append({
            "id": str(alert.alert_id),
            "timestamp": event.event_timestamp.strftime("%d/%m %H:%M:%S") if event.event_timestamp else alert.created_at.strftime("%d/%m %H:%M:%S"),
            "user": event.user_email,
            "system": event.normalized_json.get('source', 'Unknown') if event.normalized_json else 'Unknown',
            "event": event.event_type,
            "status": alert.alert_status.lower(),
            "riskScore": float(alert.risk_percent) if alert.risk_percent else 0,
            "severity": alert.severity.lower() if alert.severity else 'medium',
            "reason": alert.anomaly_reason,
            "original": event.normalized_json,
            "rowNumber": 1
        })
    return result


@router.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    total_raw = db.query(func.count(models.RawLog.log_id)).scalar() or 0
    normalized_count = db.query(func.count(models.NormalizedEvent.event_id)).scalar() or 0
    duplicates_count = db.query(func.count(models.RawLog.log_id)).filter(models.RawLog.is_duplicate == True).scalar() or 0
    anomalies = db.query(func.count(models.AnomalyAlert.alert_id)).scalar() or 0
    return {
        "totalEvents": total_raw,
        "cleanedRecords": normalized_count,
        "duplicatesRemoved": duplicates_count,
        "anomaliesDetected": anomalies,
    }


@router.get("/api/audit")
def get_audit_logs(db: Session = Depends(get_db)):
    audits = db.query(models.AuditLog).order_by(models.AuditLog.action_timestamp.desc()).all()
    result = []
    for audit in audits:
        meta = audit.metadata_ or {}
        action = audit.action_type or 'process'
        result.append({
            "id": str(audit.audit_id),
            "type": action,
            "title": meta.get('title', action.replace('_', ' ').title()),
            "detail": meta.get('detail', f"Actor: {audit.actor or 'system'}"),
            "timestamp": audit.action_timestamp.strftime("%d/%m %H:%M:%S") if audit.action_timestamp else "",
        })
    return result


app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
