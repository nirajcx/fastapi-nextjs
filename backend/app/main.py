from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import tasks, system

# Initialize FastAPI App
app = FastAPI(
    title="FastAPI Learning Backend",
    description="A high-performance Python backend for the Next.js learning project",
    version="1.0.0"
)

# Set up CORS middleware to allow requests from the Next.js frontend (running on port 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(tasks.router, prefix="/api/tasks", tags=["Tasks"])
app.include_router(system.router, prefix="/api/system", tags=["System"])

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Welcome to the FastAPI Python Backend!",
        "version": "1.0.0",
        "endpoints": [
            {"path": "/api/tasks", "methods": ["GET", "POST"]},
            {"path": "/api/tasks/{id}", "methods": ["PUT", "DELETE"]},
            {"path": "/api/system", "methods": ["GET"]},
            {"path": "/api/hello", "methods": ["GET"]}
        ]
    }

@app.get("/api/hello")
def hello_world():
    return {"message": "Hello World from Python BE!"}
