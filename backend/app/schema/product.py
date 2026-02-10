from pydantic import BaseModel

class ProductBase(BaseModel):
    name: str
    price: float
    description: str | None = None
    image_url: str | None = None
    
    
class ProductCreate(ProductBase):
    pass


class ProductOut(ProductBase):
    id: int

    class Config:
        from_attributes = True
    
    