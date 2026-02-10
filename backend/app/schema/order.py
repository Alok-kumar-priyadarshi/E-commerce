from pydantic import BaseModel
from typing import List

class OrderItemCreate(BaseModel):
    product_id : int
    quantity: int
    
class OrderCreate(BaseModel):
    items: List[OrderItemCreate]

class OrderItemOut(BaseModel):
    product_id: int
    quantity: int
    price: float
    product_name: str
    
    @classmethod
    def from_orm(cls, obj):
        return cls(
            product_id=obj.product_id,
            quantity=obj.quantity,
            price=obj.price,
            product_name=obj.product.name,
        )
    
    class Config:
        from_attributes = True
        
class OrderOut(BaseModel):
    id: int
    total_amount: float
    status: str
    items: List[OrderItemOut]
    
    class Config:
        from_attributes = True
        
        