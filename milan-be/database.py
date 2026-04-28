import os
import psycopg2
from sqlalchemy import create_engine, event
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

DB_CON_STR = os.getenv("DB_CON_STR", "").strip()

if not DB_CON_STR:
    raise RuntimeError(
        "DB_CON_STR is missing. "
        "Set it to a PostgreSQL URL or libpq DSN string."
    )

_URL_SCHEMES = ("postgresql://", "postgresql+psycopg2://", "postgresql+asyncpg://")
if any(DB_CON_STR.startswith(s) for s in _URL_SCHEMES):
    engine = create_engine(DB_CON_STR)
else:
    # libpq key=value DSN format
    engine = create_engine(
        "postgresql+psycopg2://",
        creator=lambda: psycopg2.connect(DB_CON_STR)
    )

# Tables are in the 'milan' schema; set search_path on every new connection
# so SQLAlchemy can resolve table names without schema prefix.
@event.listens_for(engine, "connect")
def set_search_path(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("SET search_path TO milan")
    cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
