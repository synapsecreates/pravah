# FILE: backend/app/database/session.py
# PURPOSE: SQLAlchemy 2.0 database engine, session management, and table initializer.
# PHASE: 3 | DEPENDS ON: sqlalchemy | LAST TOUCHED: Phase 3

import os
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Database path: Local SQLite file for reliable offline evaluation and testing
DB_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "pravah.db",
)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")

# Initialize SQLite engine with thread concurrency enabled for FastAPI
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Thread-safe database session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base model class
Base = declarative_base()


# FastAPI dependency providing database session lifecycle management.
# Yields session instance and guarantees clean closure after request completion.
def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Creates all database tables defined in ORM metadata if they do not yet exist.
# Invoked during application startup to guarantee schema availability.
def init_db() -> None:
    Base.metadata.create_all(bind=engine)
