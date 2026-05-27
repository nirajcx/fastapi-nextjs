from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

async def custom_validation_exception_handler(request: Request, exc: RequestValidationError):
    simplified_errors = []
    
    for error in exc.errors():
        field = error["loc"][-1]
        simplified_errors.append(f"Oops! The field '{field}' is missing or invalid.")

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "message": "We couldn't process your request",
            "errors": simplified_errors
        }
    )
