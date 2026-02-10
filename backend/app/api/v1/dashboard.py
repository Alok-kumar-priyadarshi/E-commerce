from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_admin
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.product import Product
from app.models.order_item import OrderItem
from app.models.user import User
from app.schema.dashboard import DashboardStats
from app.services.dashboard_service import get_dashboard_stats


router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

# @router.get("/" , response_model=DashboardStats)
# def dashboard(
#     db: Session = Depends(get_db),
#     admin_user = Depends(require_admin),
# ):
#     return get_dashboard_stats(db)


@router.get("/")
def dashboard(
    db: Session = Depends(get_db),
    admin_user=Depends(require_admin),
):
    total_revenue = db.query(func.sum(Order.total_amount)).scalar() or 0
    total_orders = db.query(Order).count()
    total_users = db.query(User).count()
    total_products = db.query(Product).count()

    # Orders by status
    status_data = (
        db.query(Order.status, func.count(Order.id)).group_by(Order.status).all()
    )

    orders_by_status = [
        {"status": status, "count": count} for status, count in status_data
    ]

    # Top products
    top_products_data = (
        db.query(Product.name, func.sum(OrderItem.quantity).label("total_sold"))
        .join(OrderItem, OrderItem.product_id == Product.id)
        .group_by(Product.name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(5)
        .all()
    )

    top_products = [
        {"name": name, "total_sold": total_sold}
        for name, total_sold in top_products_data
    ]

    recent_orders_data = (db.query(Order).order_by(Order.id.desc()).limit(5).all())

    recent_orders = [
        {
            "id": order.id,
            "total_amount": order.total_amount,
            "status": order.status,
        }
        for order in recent_orders_data
    ]

    return {
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "total_users": total_users,
        "total_products": total_products,
        "orders_by_status": orders_by_status,
        "top_products": top_products,
        "recent_orders": recent_orders,
    }
