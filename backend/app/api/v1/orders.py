from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user, require_admin
from app.models.order import Order
from app.schema.order import OrderCreate, OrderOut
from app.services.order_services import (
    create_order,
    get_user_orders,
    get_all_orders,
)
from sqlalchemy.orm import joinedload
from app.models.order_item import OrderItem

from math import ceil 

router = APIRouter(prefix="/orders",tags=["Orders"])

@router.post("/")
def checkout(
    order: OrderCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    new_order = create_order(db, current_user.id, order.items)

    # Reload with relationships
    new_order = (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.product))
        .filter(Order.id == new_order.id)
        .first()
    )

    result = {
        "id": new_order.id,
        "total_amount": new_order.total_amount,
        "status": new_order.status,
        "items": [
            {
                "product_id": item.product_id,
                "quantity": item.quantity,
                "price": item.price,
                "product_name": item.product.name,
            }
            for item in new_order.items
        ],
    }

    return result

@router.get("/all")
def all_orders(
    page: int = 1,
    limit: int = 10,
    db:Session = Depends(get_db),
    admin_user = Depends(require_admin),
):
    query = get_all_orders(db)
    total = query.count()
    offset = (page-1)*limit
    
    orders = query.offset(offset).limit(limit).all()
    
    result = []

    for order in orders:
        order_data = {
            "id": order.id,
            "total_amount": order.total_amount,
            "status": order.status,
            "items": [],
        }

        for item in order.items:
            order_data["items"].append({
                "product_id": item.product_id,
                "quantity": item.quantity,
                "price": item.price,
                "product_name": item.product.name,
            })

        result.append(order_data)
    
    return {
        "items": result,
        "total": total,
        "page": page,
        "pages": ceil(total / limit),
    }

@router.get("/me" , response_model=list[OrderOut])
def my_orders(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    return get_user_orders(db,current_user.id)


@router.put("/{order_id}/status")
def update_order_status(
    order_id: int,
    new_status: str,
    db: Session = Depends(get_db),
    admin_user = Depends(require_admin),
):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    allowed_statuses = [
        "PENDING",
        "PAID",
        "PACKED",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
    ]

    if new_status not in allowed_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
    order.status = new_status
    db.commit()
    db.refresh(order)

    return {"message": "Status updated", "status": order.status}