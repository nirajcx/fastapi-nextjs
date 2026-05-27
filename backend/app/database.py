import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Load environment variables from the .env file
load_dotenv()

# Get the database URL from environment variables
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:admin@localhost:5432/postgres")

# Create the SQLAlchemy Engine
# The engine is the core interface to the database, handling the connection pool
engine = create_engine(DATABASE_URL)

# Create a SessionLocal class
# Each instance of SessionLocal will be a database session.
# autocommit=False and autoflush=False ensures transactions are explicitly controlled.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a Declarative Base class
# Our database models will inherit from this Base class to be registered with SQLAlchemy.
Base = declarative_base()

# FastAPI Dependency for managing database session lifecycle
def get_db():
    """
    Dependency function to yield a database session.
    This guarantees that each API request gets its own separate database session,
    and that the session is closed automatically once the request is complete.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
