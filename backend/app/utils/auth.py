from fastapi import Request, HTTPException, status, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import DBUser

def get_current_user(request: Request, db: Session = Depends(get_db)) -> DBUser:
    """
    FastAPI Dependency to retrieve the logged-in user using plain session cookies.
    Reads the 'session_user' cookie, which contains the user's database ID.
    Raises 401 Unauthorized if cookie is missing or invalid.
    """
    user_id_str = request.cookies.get("session_user")
    
    if not user_id_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated. Please login first."
        )
        
    try:
        user_id = int(user_id_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session cookie."
        )

    # Fetch the user from DB
    user = db.query(DBUser).filter(DBUser.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session owner user not found."
        )
        
    return user
