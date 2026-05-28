from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_ 
from app.schemas.todo import Todo, TodoUpdate, TodoResponse
from app.models.todo import DBTodo
from app.database import get_db
from typing import List

router = APIRouter()

@router.post("/api/addtodo", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def add_todo(todo_item: Todo, db: Session = Depends(get_db)):
    """
    Endpoint to add a new todo.
    Injects the DB session dependency using 'Depends(get_db)'.
    """
    new_todo = DBTodo(
        title=todo_item.title,
        description=todo_item.description,
        completed=todo_item.completed
    )
    db.add(new_todo)
    db.commit()
    db.refresh(new_todo) # Reload attributes from the database (like id)
    return new_todo

@router.get("/api/gettodos")
def get_all_todos(db: Session = Depends(get_db)):
    """
    Endpoint to fetch all todos.
    """
    todos = db.query(DBTodo).order_by(DBTodo.id.asc()).all()
    return {"message": "All todos fetched successfully", "todos": todos}


@router.get("/api/gettodo")
def get_completed_incompleted_todos(completed: bool | None = None, db: Session = Depends(get_db)):
    if completed is None:
        todos = db.query(DBTodo).order_by(DBTodo.id.asc()).all()
    else:
        todos = db.query(DBTodo).filter(DBTodo.completed == completed).order_by(DBTodo.id.asc()).all()
    return {"message": f"Completed filter: {completed}", "todos": todos}



@router.get("/api/gettodo/search")
def get_completed_incompleted_todos(search:str = "", db: Session = Depends(get_db)):
    """
    Endpoint to search todos by title or description.
    Matches if either field contains the search string.
    """
    todos = db.query(DBTodo).filter(or_(DBTodo.description.ilike(f"%{search}%"),DBTodo.title.ilike(f"%{search}%"))).order_by(DBTodo.id.asc()).all()
    return {"message": f"Searched String: {search}", "todos": todos}



@router.get("/api/gettodos/{todo_id}", response_model=TodoResponse)
def get_todo(todo_id: int, db: Session = Depends(get_db)):
    """
    Endpoint to fetch a single todo by its ID.
    """
    todo = db.query(DBTodo).filter(DBTodo.id == todo_id).first()
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Todo with id {todo_id} not found"
        )
    return todo

@router.delete("/api/deletetodo/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    """
    Endpoint to delete a todo.
    """
    todo = db.query(DBTodo).filter(DBTodo.id == todo_id).first()
    if not todo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Todo with id {todo_id} not found"
        )
    db.delete(todo)
    db.commit()
    return {"message": f"Todo with id {todo_id} deleted successfully"}

@router.patch("/api/edittodo/{todo_id}", response_model=TodoResponse)
def edit_todo(todo_id: int, todo_item: TodoUpdate, db: Session = Depends(get_db)):
    """
    Endpoint to partially update a todo.
    """
    todo = db.query(DBTodo).filter(DBTodo.id == todo_id).first()
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
