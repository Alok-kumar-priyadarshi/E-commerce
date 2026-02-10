from datetime import datetime , timedelta
from jose import jwt
from app.core.config import settings


def create_access_token(data : dict):
    to_encode = data.copy()
    
    expire = datetime.utcnow() + timedelta(
        minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    
    to_encode.update({"exp" : expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm = settings.ALGORITHM
    )
    
    print("SETTINGS DICT:", settings.__dict__)
    
    return encoded_jwt

