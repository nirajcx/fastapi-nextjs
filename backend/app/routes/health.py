from fastapi import APIRouter
import logging

router = APIRouter()
logger = logging.getLogger("uvicorn")

@router.get("/")
def read_root():
    return {"status": "online", "message": "Your clean slate FastAPI server is running!"}

@router.get("/api/hello")
def hello_world():
    print("ttttt")
    logger.info("Hello api hitted") 
    return {"message": "Hello World from Python BE!"}

@router.get("/api/healthcheck")
def health_check():
    return {"message": "OK"}
