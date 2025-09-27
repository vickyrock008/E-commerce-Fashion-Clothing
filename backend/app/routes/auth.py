# app/routes/auth.py

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Request
from fastapi.responses import RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from .. import schemas, models, crud
from ..database import get_db
from ..models import get_password_hash, verify_password
from ..security import create_access_token
from ..email import send_password_reset_email
from ..config import settings
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import httpx

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        name=user.name, 
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer", "user": schemas.UserOut.from_orm(user)}

@router.post("/forgot-password")
def forgot_password(
    request: schemas.ForgotPasswordRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    user = crud.get_user_by_email(db, email=request.email)
    if user:
        token = crud.create_password_reset_token(db, user=user)
        background_tasks.add_task(send_password_reset_email, email_to=user.email, user_name=user.name, token=token)
    
    return {"message": "If an account with that email exists, a password reset link has been sent."}


@router.post("/reset-password")
def reset_password(request: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    user = crud.get_user_by_reset_token(db, token=request.token)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    
    crud.update_user_password(db, user=user, new_password=request.new_password)
    return {"message": "Password updated successfully."}

@router.post("/google-login")
async def google_login(token_data: schemas.GoogleToken, db: Session = Depends(get_db)):
    try:
        id_info = id_token.verify_oauth2_token(
            token_data.token, google_requests.Request(), settings.GOOGLE_CLIENT_ID
        )
        email = id_info.get("email")
        name = id_info.get("name")

        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email not found in Google token",
            )

        user = crud.get_or_create_user_from_google(db, email=email, name=name)
        access_token = create_access_token(data={"sub": user.email})

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": schemas.UserOut.from_orm(user),
        }

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token",
        )