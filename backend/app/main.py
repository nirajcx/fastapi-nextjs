from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from app.utils.exceptions import custom_validation_exception_handler
from app.database import Base, engine
from app.routes import health, todo, users

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Task API",
    description="API for managing tasks and user authentication",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.exception_handler(RequestValidationError)(custom_validation_exception_handler)

app.include_router(health.router)
app.include_router(todo.router)
app.include_router(users.router)
