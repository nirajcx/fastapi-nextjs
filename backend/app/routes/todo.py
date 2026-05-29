from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_ 
from app.schemas.todo import Todo, TodoUpdate, TodoResponse
from app.models.todo import DBTodo
from app.database import get_db
from typing import List

from app.models.user import DBUser
from app.utils.auth import get_current_user

router = APIRouter()

@router.post("/api/addtodo", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def add_todo(todo_item: Todo, current_user: DBUser = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Endpoint to add a new todo.
    Owner is automatically assigned using the session cookie.
    """
    new_todo = DBTodo(
        title=todo_item.title,
        description=todo_item.description,
        completed=todo_item.completed,
        owner_id=current_user.id
    )
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo)
    return new_todo

@router.get("/api/gettodos")
def get_all_todos(current_user: DBUser = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Endpoint to fetch all todos for the logged-in user.
    """
    todos = db.query(DBTodo).filter(DBTodo.owner_id == current_user.id).order_by(DBTodo.id.asc()).all()
    return {"message": "All todos fetched successfully", "todos": todos}

@router.get("/api/gettodo")
def get_completed_incompleted_todos(completed: bool | None = None, current_user: DBUser = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Endpoint to fetch completed/incomplete todos for the logged-in user.
    """
    query = db.query(DBTodo).filter(DBTodo.owner_id == current_user.id)
    if completed is not None:
        query = query.filter(DBTodo.completed == completed)
    todos = query.order_by(DBTodo.id.asc()).all()
    return {"message": f"Completed filter: {completed}", "todos": todos}

@router.get("/api/gettodo/search")
def search_todos(search: str = "", current_user: DBUser = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Endpoint to search todos for the logged-in user.
    """
    todos = db.query(DBTodo).filter(
        DBTodo.owner_id == current_user.id,
        or_(DBTodo.description.ilike(f"%{search}%"), DBTodo.title.ilike(f"%{search}%"))
    ).order_by(DBTodo.id.asc()).all()
    return {"message": f"Searched String: '{search}'", "todos": todos}

@router.get("/api/gettodos/{todo_id}", response_model=TodoResponse)
def get_todo(todo_id: int, current_user: DBUser = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Endpoint to fetch a single todo belonging to the logged-in user.
    """
    todo = db.query(DBTodo).filter(DBTodo.id == todo_id, DBTodo.owner_id == current_user.id).first()
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Todo with id {todo_id} not found"
        )
    return todo

@router.delete("/api/deletetodo/{todo_id}")
def delete_todo(todo_id: int, current_user: DBUser = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Endpoint to delete a todo belonging to the logged-in user.
    """
    todo = db.query(DBTodo).filter(DBTodo.id == todo_id, DBTodo.owner_id == current_user.id).first()
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Todo with id {todo_id} not found"
        )
    db.delete(todo)
    db.commit()
    return {"message": f"Todo with id {todo_id} deleted successfully"}

@router.patch("/api/edittodo/{todo_id}", response_model=TodoResponse)
def edit_todo(todo_id: int, todo_item: TodoUpdate, current_user: DBUser = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Endpoint to partially update a todo belonging to the logged-in user.
    """
    todo = db.query(DBTodo).filter(DBTodo.id == todo_id, DBTodo.owner_id == current_user.id).first()
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Todo with id {todo_id} not found"
        )
    
    # Update attributes if they are provided in the payload
    if todo_item.title is not None:
        todo.title = todo_item.title
    if todo_item.description is not None:
        todo.description = todo_item.description
    if todo_item.completed is not None:
        todo.completed = todo_item.completed
        
    db.commit()
    db.refresh(todo)
    return todo


