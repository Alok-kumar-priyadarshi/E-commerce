from pydantic import BaseModel, EmailStr , Field, field_validator
import re

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., max_length=72)
    
    
    @field_validator("email")
    @classmethod
    def validate_email(cls, email):
        # Extra validation beyond EmailStr
        if not email.endswith("@gmail.com"):
            raise ValueError("Only Gmail addresses are allowed")
        return email
    
    @field_validator("password")
    @classmethod
    def validate_password(cls, password):
        
        if len(password) < 6:
            raise ValueError("Password must be at least 6 characters long")

        if not re.search(r"[A-Z]", password):
            raise ValueError("Password must contain at least one uppercase letter")

        if not re.search(r"[a-z]", password):
            raise ValueError("Password must contain at least one lowercase letter")

        if not re.search(r"[0-9]", password):
            raise ValueError("Password must contain at least one number")

        if not re.search(r'[!@#$%^&*(),.?\":{}|<>]', password):
            raise ValueError("Password must contain at least one special character")

        return password
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=72)

