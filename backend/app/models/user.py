from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base

class DBUser(Base):
    """
    SQLAlchemy model representing the 'users' table in the PostgreSQL database.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)

    # One-to-many relationship linking a user to their multiple todos
    todos = relationship("DBTodo", back_populates="owner", cascade="all, delete-orphan")

