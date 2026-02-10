from fastapi import APIRouter , Depends
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.schema.user import UserCreate , UserLogin
from app.services.user_service import create_user , authenticate_user
from app.core.jwt import create_access_token
from fastapi.security import OAuth2PasswordRequestForm
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix = "/auth" , tags = ["Auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@router.post("/register")
def register(user : UserCreate , db : Session = Depends(get_db)):
    return create_user(db , user.email , user.password)

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):

    db_user = authenticate_user(
        db,
        form_data.username,
        form_data.password
    )

    if not db_user:
        return {"error": "Invalid credentials"}

    token = create_access_token(
        {
            "sub": db_user.email,
            "role": db_user.role,
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
    }


@router.get("/me")
def read_current_user(current_user: User = Depends(get_current_user)):
    return {
        "email": current_user.email,
        "role": current_user.role,
    } 
    
    
    
    