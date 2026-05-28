from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from app.utils.exceptions import custom_validation_exception_handler

from app.database import Base, engine
from app.models import todo as model_todo, user as model_user # Registers the models with SQLAlchemy metadata

# Automatically create tables in the database if they do not exist
Base.metadata.create_all(bind=engine)


from app.routes import health, todo, users

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

app.exception_handler(RequestValidationError)(custom_validation_exception_handler)

app.include_router(health.router)
app.include_router(todo.router)
app.include_router(users.router)


