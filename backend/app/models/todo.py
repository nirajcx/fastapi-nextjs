from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class DBTodo(Base):
    """
    SQLAlchemy model representing the 'todos' table in the PostgreSQL database.
    """
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    description = Column(String, nullable=True)
    completed = Column(Boolean, default=False)
