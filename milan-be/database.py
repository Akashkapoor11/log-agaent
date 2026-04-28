import os
import re
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv
import logging

load_dotenv()
logger = logging.getLogger(__name__)

def _to_url(conn: str) -> str:
    if any(conn.startswith(s) for s in ("postgresql://", "postgresql+psycopg2://")):
        return conn
    kv = dict(re.findall(r'(\w+)\s*=\s*(\S+)', conn))
    host = kv.get("host", "localhost")
    port = kv.get("port", "5432")
    user = kv.get("user", "postgres")
    password = kv.get("password", "").replace("#", "%23")
    dbname = kv.get("dbname", "postgres")
    return f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{dbname}?sslmode=require"

DB_CON_STR = os.getenv("DB_CON_STR", "").strip()

if DB_CON_STR:
    url = _to_url(DB_CON_STR)
    engine = create_engine(url)
    logger.info("Using PostgreSQL database")
else:
    engine = create_engine("sqlite:///./milan.db", connect_args={"check_same_thread": False})
    logger.warning("DB_CON_STR not set — using SQLite fallback")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
