from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
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
    
    # Foreign key linking each Todo to a User
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False, default=1)
    
    # Relationship to DBUser
    owner = relationship("DBUser", back_populates="todos")

