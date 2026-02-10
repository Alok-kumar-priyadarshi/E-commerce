from pydantic import BaseModel
from typing import List

class RecentOrder(BaseModel):
    id: int
    total_amount: float
    status: str
    
    class Config:
        from_attributes = True
        
        
class DashboardStats(BaseModel):
    total_revenue: float
    total_orders: int
    total_users: int
    total_products: int
    recent_orders: List[RecentOrder]
    