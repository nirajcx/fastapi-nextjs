from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel
from typing import Optional

app = FastAPI(
    title="My Experimental Backend",
    description="A clean slate FastAPI setup",
    version="1.0.0"
)

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# Example 1: Basic GET Endpoint
# ---------------------------------------------------------
@app.get("/")
def read_root():
    return {"status": "online", "message": "Your clean slate FastAPI server is running!"}

@app.get("/api/hello")
def hello_world():
    return {"message": "Hello World from Python BE!"}

# ---------------------------------------------------------
# Example 2: Path Parameters
# ---------------------------------------------------------
@app.get("/api/users/{user_id}")
def get_user(user_id: int):
    # This endpoint extracts 'user_id' from the URL
    return {"user_id": user_id, "name": f"User {user_id}", "role": "admin"}

# ---------------------------------------------------------
# Example 3: POST Request with JSON Body
# ---------------------------------------------------------
class Item(BaseModel):
    name: str
    description: str | None = None
    price: float

@app.post("/api/items")
def create_item(item: Item):
    # This endpoint receives JSON data conforming to the Item model
    return {"message": "Item created successfully", "item": item}

@app.get("/api/healthcheck")
def health_check():
    return {"message": "OK"}

@app.exception_handler(RequestValidationError)
async def custom_validation_exception_handler(request: Request, exc: RequestValidationError):
    simplified_errors = []
    
    for error in exc.errors():
        field = error["loc"][-1]  # This gets the name of the missing/invalid field
        simplified_errors.append(f"Oops! The field '{field}' is missing or invalid.")

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "message": "We couldn't process your request",
            "errors": simplified_errors
        }
    )


all_todo_data = []

class todo(BaseModel):
    title: str
    description: str
    completed: bool = False

@app.post("/api/addtodo")
def add_todo(todo_item: todo):
    new_todo = todo_item.model_dump()
    
    # Safe ID generation: get the highest existing ID + 1
    if all_todo_data:
        new_todo["id"] = max(t["id"] for t in all_todo_data) + 1
    else:
        new_todo["id"] = 1
        
    all_todo_data.append(new_todo)
    return {"message": "Todo added successfully", "todo": new_todo}


from typing import Optional

@app.get("/api/gettodos")
def get_all_todos():
    return {"message": "All todos fetched successfully", "todos": all_todo_data}

@app.get("/api/gettodos/{todo_id}")
def get_todo(todo_id: int):
    todo = next((t for t in all_todo_data if t["id"] == todo_id), None)
    if not todo:
        return {"message": f"Todo with id {todo_id} not found"}
    return {"message": "Todo fetched successfully", "todo": todo}



@app.delete("/api/deletetodo/{todo_id}")
def delete_todo(todo_id: int):
    global all_todo_data
    all_todo_data = [t for t in all_todo_data if t["id"] != todo_id]
    return {"message": f"Todo with id {todo_id} deleted successfully"}

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None

@app.patch("/api/edittodo/{todo_id}")
def edit_todo(todo_id: int, todo_item: TodoUpdate):
    for t in all_todo_data:
        if t["id"] == todo_id:
            if todo_item.title is not None:
                t["title"] = todo_item.title
            if todo_item.description is not None:
                t["description"] = todo_item.description
            if todo_item.completed is not None:
                t["completed"] = todo_item.completed
            return {"status": "Ok", "modified_data": t}
    return {"message": f"Todo with id {todo_id} not found"}
