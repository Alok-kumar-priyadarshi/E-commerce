# from dotenv import load_dotenv
# import os

# load_dotenv()

# class Settings:
#     DATABASE_URL: str = os.getenv("DATABASE_URL")
#     SECRET_KEY: str = os.getenv("SECRET_KEY", "fallback_secret")
#     ALGORITHM: str = os.getenv("ALGORITHM")
#     ACCESS_TOKEN_EXPIRE_MINUTES:int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

# settings = Settings() # this is the line by which everywhere its used as settings not Settings


from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List


class Settings(BaseSettings):
    # App
    PROJECT_NAME: str = "EcommerceApp"
    APP_NAME: str = "Ecommerce Backend"
    DEBUG: bool = True

    # Security
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Database
    DATABASE_URL: str = Field(..., env="DATABASE_URL")

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://e-commerce-gtna48dy2-alokkp93-4785s-projects.vercel.app",
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
