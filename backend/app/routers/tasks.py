from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from typing import List, Optional
import time
from datetime import datetime

router = APIRouter()

# Pydantic schemas for data validation and auto-documentation
class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100, examples=["Learn Next.js App Router"])
    description: Optional[str] = Field(None, max_length=500, examples=["Explore Layouts, Pages, and Route Handlers"])
    completed: bool = Field(default=False, description="Completion status of the task")

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    completed: Optional[bool] = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    completed: bool
    created_at: str

# Seed in-memory database
tasks_db = [
    {
        "id": 1,
        "title": "Set up Next.js frontend",
        "description": "Initialize Next.js App Router with Tailwind CSS v4",
        "completed": True,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    },
    {
        "id": 2,
        "title": "Configure FastAPI Python Backend",
        "description": "Create routers, Pydantic models, and set up CORS",
        "completed": True,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    },
    {
        "id": 3,
        "title": "Connect Frontend with Both Backends",
        "description": "Build an interactive UI to switch between Next.js APIs and FastAPI APIs dynamically",
        "completed": False,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
]

# ID counter for auto-incrementing
id_counter = len(tasks_db)

@router.get("/", response_model=List[TaskResponse])
def get_all_tasks():
    """
    Get all tasks from the in-memory database.
    """
    return tasks_db

@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(task_in: TaskCreate):
    """
    Create a new task with input validation using Pydantic.
    """
    global id_counter
    id_counter += 1
    
    new_task = {
        "id": id_counter,
        "title": task_in.title,
        "description": task_in.description,
        "completed": task_in.completed,
        "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    tasks_db.append(new_task)
    return new_task

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_in: TaskUpdate):
    """
    Update an existing task's details.
    """
    for task in tasks_db:
        if task["id"] == task_id:
            if task_in.title is not None:
                task["title"] = task_in.title
            if task_in.description is not None:
                task["description"] = task_in.description
            if task_in.completed is not None:
                task["completed"] = task_in.completed
            return task
            
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Task with ID {task_id} not found."
    )

@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int):
    """
    Delete a task from the in-memory database.
    """
    for index, task in enumerate(tasks_db):
        if task["id"] == task_id:
            tasks_db.pop(index)
            return None
            
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Task with ID {task_id} not found."
    )
