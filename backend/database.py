import os
import json
import logging
from datetime import datetime
from typing import Optional, List
from dotenv import load_dotenv

from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

logger = logging.getLogger("fablestem_database")

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "").strip()

# Normalize postgres:// to postgresql:// (for Neon, Supabase, Render compatibility)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

Base = declarative_base()

class DBUser(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    role = Column(String(50), default="student")
    avatar = Column(String(50), default="🦉")
    grade_or_class = Column(String(100), default="Grade 3")
    xp = Column(Integer, default=150)
    streak = Column(Integer, default=1)
    last_active = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    stories = relationship("DBSavedStory", back_populates="user", cascade="all, delete-orphan")
    quizzes = relationship("DBQuizResult", back_populates="user", cascade="all, delete-orphan")


class DBSavedStory(Base):
    __tablename__ = "saved_stories"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    topic = Column(String(200), nullable=False)
    age_group = Column(String(50), nullable=False)
    language = Column(String(50), default="English")
    title = Column(String(300), nullable=False)
    story_text = Column(Text, nullable=False)
    vocabulary = Column(JSON, nullable=True) # List of dicts {word, meaning}
    choices = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("DBUser", back_populates="stories")


class DBQuizResult(Base):
    __tablename__ = "quiz_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    story_title = Column(String(300), nullable=False)
    topic = Column(String(200), nullable=False)
    age_group = Column(String(50), default="8-10")
    score_percentage = Column(Integer, default=100)
    total_questions = Column(Integer, default=3)
    correct_count = Column(Integer, default=3)
    badge = Column(String(100), default="Star Learner 🌟")
    answers_summary = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("DBUser", back_populates="quizzes")


engine = None
SessionLocal = None
is_db_connected = False

def init_db():
    global engine, SessionLocal, is_db_connected
    if not DATABASE_URL:
        logger.info("ℹ️ DATABASE_URL not set. Running in stateless in-memory mode. PostgreSQL will activate once URL is added.")
        return False

    try:
        logger.info(f"Connecting to PostgreSQL database...")
        # Handle connection arguments for SSL (common in Neon/Supabase/Aiven)
        connect_args = {}
        if "sslmode=require" in DATABASE_URL or "neon.tech" in DATABASE_URL or "supabase" in DATABASE_URL:
            connect_args["sslmode"] = "require"

        engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,
            pool_recycle=300,
            connect_args=connect_args
        )
        Base.metadata.create_all(bind=engine)
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
        is_db_connected = True
        logger.info("✅ PostgreSQL database connected successfully and tables verified!")
        return True
    except Exception as err:
        logger.warning(f"⚠️ Failed to connect to PostgreSQL: {err}. Backend will gracefully continue operating.")
        is_db_connected = False
        return False

def get_db():
    """Dependency for route handlers that need a database session."""
    if not is_db_connected or not SessionLocal:
        yield None
        return
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Auto-initialize on module load
init_db()
