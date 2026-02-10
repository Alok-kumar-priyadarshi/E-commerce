from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, get_current_user, require_admin
from app.models.product import Product
from app.schema import product
from app.schema.product import ProductCreate, ProductOut
from app.services.product_service import (
    create_product,
    get_products,
    delete_product,
)
from math import ceil


from sqlalchemy import or_


router = APIRouter(prefix="/products" , tags = ["Products"])


@router.get("/")
def read_products(
    page: int = 1,
    limit: int = 6,
    search: str | None = None,
    sort: str | None = None,
    max_price: float | None = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    query = db.query(Product)

    # Filters
    if search and search.strip() != "":
        query = query.filter(
            Product.name.ilike(f"%{search.strip()}%")
        )

    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    if sort == "low":
        query = query.order_by(Product.price.asc())

    if sort == "high":
        query = query.order_by(Product.price.desc())

    total = query.count()

    # Pagination logic
    offset = (page - 1) * limit
    products = query.offset(offset).limit(limit).all()

    return {
        "items": products,
        "total": total,
        "page": page,
        "pages": ceil(total / limit),
    }

    
@router.post("/", response_model=ProductOut)
def create_product_route(
    product: ProductCreate,
    db: Session = Depends(get_db),
    admin_user = Depends(require_admin),
):
    return create_product(
        db,
        product.name,
        product.price,
        product.description,
        product.image_url,
    )
@router.delete("/{product_id}")
def delete_product_route(
    product_id: int,
    db: Session = Depends(get_db),
    admin_user = Depends(require_admin),
):
    deleted = delete_product(db, product_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Product not found")

    return {"message": "Product deleted"}

@router.get("/{product_id}", response_model=ProductOut)
def get_single_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    product = db.query(Product).filter(Product.id == product_id).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product



