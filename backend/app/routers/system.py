from fastapi import APIRouter
import platform
import sys
import time
from datetime import datetime

router = APIRouter()

@router.get("/")
def get_system_info():
    """
    Get detailed system and runtime information from the Python environment.
    """
    return {
        "backend_type": "FastAPI (Python)",
        "python_version": sys.version,
        "platform": platform.platform(),
        "processor": platform.processor(),
        "architecture": platform.architecture()[0],
        "server_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "timestamp": time.time(),
        "framework_details": {
            "name": "FastAPI",
            "speed": "Extremely Fast (Asynchronous)",
            "docs_url": "http://localhost:8000/docs",
            "advantage": "Automatic Swagger UI generation, strict type-safety with Pydantic, and native asyncio."
        }
    }
