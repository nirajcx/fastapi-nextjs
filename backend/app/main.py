from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

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
