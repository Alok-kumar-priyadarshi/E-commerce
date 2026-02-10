from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.order import Order
from app.models.user import User
from app.models.product import Product

def get_dashboard_stats(db: Session):
    total_revenue = db.query(func.sum(Order.total_amount)).scalar() or 0
    total_orders = db.query(func.count(Order.id)).scalar()
    total_users = db.query(func.count(User.id)).scalar()
    total_products = db.query(func.count(Product.id)).scalar()

    recent_orders = (
        db.query(Order)
        .order_by(Order.id.desc())
        .limit(5)
        .all()
    )
    
    return {
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "total_users": total_users,
        "total_products": total_products,
        "recent_orders": recent_orders,
        
    }