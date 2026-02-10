from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import auth
from app.api.v1 import products
from app.api.v1 import orders
from app.api.v1 import dashboard

from app.core.exceptions import (
    http_exception_handler,
    integrity_exception_handler,
    generic_exception_handler,
)
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from app.core.logging_config import setup_logging
from app.core.config import settings

setup_logging(settings.DEBUG)

app = FastAPI(title=settings.APP_NAME)
#  ----- CORS MIDDLEWARE -----
app.add_middleware(
    CORSMiddleware,
    # frontend link
    allow_origins=settings.ALLOWED_ORIGINS, #vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "OK"}

app.include_router(auth.router , prefix="/api/v1")

app.include_router(products.router, prefix="/api/v1")

app.include_router(orders.router, prefix="/api/v1" )

app.include_router(dashboard.router, prefix="/api/v1" )


#  ----- EXCEPTION HANDLERS -----
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(IntegrityError, integrity_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)


