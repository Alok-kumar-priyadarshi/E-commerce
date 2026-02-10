from sqlalchemy.orm import Session , joinedload
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product


def create_order(db: Session, user_id: int, items_data: int):
    total_amount = 0
    order = Order(user_id=user_id, total_amount=0, status="PENDING")
    db.add(order)
    db.flush()

    for item in items_data:
        product = db.query(Product).filter(Product.id == item.product_id).first()

        if not product:
            continue

        item_total = product.price * item.quantity
        total_amount += item_total

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item.quantity,
            price=product.price,
        )

        db.add(order_item)

    order.total_amount = total_amount
    db.commit()
    db.refresh(order)

    return order

def get_user_orders(db: Session, user_id: int):
    orders = (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.product))
        .filter(Order.user_id == user_id)
        .all()
    )

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

    return result



# def get_all_orders(db: Session):
#     orders = (
#         db.query(Order)
#         .options(joinedload(Order.items).joinedload(OrderItem.product))
#         .order_by(Order.id.desc())
#     )

#     result = []

#     for order in orders:
#         order_data = {
#             "id": order.id,
#             "total_amount": order.total_amount,
#             "status": order.status,
#             "items": [],
#         }

#         for item in order.items:
#             order_data["items"].append({
#                 "product_id": item.product_id,
#                 "quantity": item.quantity,
#                 "price": item.price,
#                 "product_name": item.product.name,
#             })

#         result.append(order_data)

#     return result

def get_all_orders(db: Session):
    return (
        db.query(Order)
        .options(joinedload(Order.items).joinedload(OrderItem.product))
        .order_by(Order.id.desc())
    )