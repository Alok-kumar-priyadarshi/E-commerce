from sqlalchemy.orm import Session
from app.models.product import Product

def create_product(db: Session, name: str, price: float, description: str = None, image_url: str = None):
    product = Product(
        name=name,
        price=price,
        description=description,
        image_url=image_url,
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product

def get_products(db:Session):
    return db.query(Product).all()

def delete_product(db:Session , product_id : int):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        return None
    
    db.delete(product)
    db.commit()

    return product