from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import DBUser
from app.schemas.user import UserCreate, UserResponse, UserLogin
from app.utils.utils import hash_password, verify_password

router = APIRouter(prefix="/api/users", tags=["users"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user.
    Hashed the password using utils and checks for email/username duplicates.
    """
    # Check if username already exists
    existing_username = db.query(DBUser).filter(DBUser.username == user_in.username).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this username already exists."
        )

    # Check if email already exists
    existing_email = db.query(DBUser).filter(DBUser.email == user_in.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists."
        )

    # Create new user
    hashed_pwd = hash_password(user_in.password)
    db_user = DBUser(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed_pwd
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {
        "message": "User created successfully",
        "username": db_user.username,
        "email": db_user.email
    }



@router.get("", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    """
    Fetch all registered users.
    """
    users = db.query(DBUser).all()
    return users

@router.post("/login")
def login(user_credentials: UserLogin, response: Response, db: Session = Depends(get_db)):
    db_user = db.query(DBUser).filter(DBUser.username == user_credentials.username).first()
    
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid Credentials")
    is_correct = verify_password(user_credentials.password, db_user.hashed_password)
    if not is_correct:
        raise HTTPException(status_code=400, detail="Invalid Credentials")
        
    # Set the cookie with user's ID manually (httponly prevents Javascript access, which is secure!)
    response.set_cookie(key="session_user", value=str(db_user.id), httponly=True, samesite="lax")
    
    return {"message": "Login successful!", "user": UserResponse.model_validate(db_user)}

@router.post("/logout")
def logout(response: Response):
    # Deletes the cookie to log the user out
    response.delete_cookie(key="session_user")
    return {"message": "Logout successful!"}

    