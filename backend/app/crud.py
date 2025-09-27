# app/crud.py

from sqlalchemy.orm import Session, joinedload
from . import models, schemas
import re
import datetime
import secrets
import os
from sqlalchemy import and_
from sqlalchemy import and_, exc

def get_product(db: Session, product_id: int):
    return db.query(models.Product).filter(models.Product.id == product_id).first()

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()

def search_products(db: Session, query: str):
    """
    Searches for products by matching all keywords in the query.
    Splits the query by spaces and ensures the product's name or description
    contains each of the keywords.
    """
    keywords = query.split()
    if not keywords:
        return []

    search_conditions = []
    for keyword in keywords:
        search_conditions.append(
            models.Product.name.ilike(f"%{keyword}%") |
            models.Product.description.ilike(f"%{keyword}%")
        )
    
    return db.query(models.Product).filter(and_(*search_conditions)).all()

def create_product(db: Session, product: schemas.ProductCreate):
    product_data = product.model_dump()
    
    base_slug = product.name.lower().strip()
    base_slug = re.sub(r'[^\w\s-]', '', base_slug)
    slug = re.sub(r'[\s_-]+', '-', base_slug)
    
    existing_product = db.query(models.Product).filter(models.Product.slug == slug).first()
    
    if existing_product:
        random_suffix = secrets.token_hex(2)
        slug = f"{slug}-{random_suffix}"

    db_product = models.Product(**product_data, slug=slug)
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product_update: dict):
    db_product = get_product(db, product_id)
    if db_product:
        for key, value in product_update.items():
            setattr(db_product, key, value)
        
        if 'name' in product_update:
            base_slug = product_update['name'].lower().strip()
            base_slug = re.sub(r'[^\w\s-]', '', base_slug)
            slug = re.sub(r'[\s_-]+', '-', base_slug)
            
            existing_product = db.query(models.Product).filter(models.Product.slug == slug, models.Product.id != product_id).first()
            if existing_product:
                random_suffix = secrets.token_hex(2)
                slug = f"{slug}-{random_suffix}"
            db_product.slug = slug

        db.commit()
        db.refresh(db_product)
    return db_product

def add_stock_to_product(db: Session, product_id: int, stock_data: schemas.AddStock):
    db_product = get_product(db, product_id)
    if db_product:
        db_product.stock += stock_data.amount
        db.commit()
        db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = get_product(db, product_id)
    if db_product:
        # If the product has an image, delete the image file from the static folder
        if db_product.image:
            # The image path in the DB is like '/static/images/products/xyz.jpg'
            # We need a file system path like 'app/static/images/products/xyz.jpg'
            # The lstrip('/') removes the leading slash, and we prepend 'app/'
            image_path_to_delete = os.path.join('app', db_product.image.lstrip('/'))

            if os.path.exists(image_path_to_delete):
                try:
                    os.remove(image_path_to_delete)
                    print(f"Successfully deleted image file: {image_path_to_delete}")
                except OSError as e:
                    print(f"Error deleting file {image_path_to_delete}: {e.strerror}")
            else:
                print(f"Image file not found at path: {image_path_to_delete}")

        db.delete(db_product)
        db.commit()
    return db_product


def get_category(db: Session, category_id: int):
    return db.query(models.Category).filter(models.Category.id == category_id).first()

def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Category).options(joinedload(models.Category.products)).offset(skip).limit(limit).all()

def create_category(db: Session, category: schemas.CategoryCreate):
    db_category = models.Category(name=category.name, slug=category.slug)
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

def update_category(db: Session, category_id: int, category_update: schemas.CategoryUpdate):
    db_category = get_category(db, category_id)
    if db_category:
        update_data = category_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_category, key, value)
        db.commit()
        db.refresh(db_category)
    return db_category

def delete_category(db: Session, category_id: int):
    """
    Deletes a category. Due to the cascading rules set in the models,
    deleting a category will automatically delete all products associated with it.
    """
    db_category = get_category(db, category_id)
    if db_category:
        db.delete(db_category)
        db.commit()
    return db_category

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_password_reset_token(db: Session, user: models.User):
    token = secrets.token_urlsafe(32)
    expires = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    user.reset_token = token
    user.reset_token_expires = expires
    db.commit()
    db.refresh(user)
    return token

def get_user_by_reset_token(db: Session, token: str):
    return db.query(models.User).filter(
        models.User.reset_token == token,
        models.User.reset_token_expires > datetime.datetime.utcnow()
    ).first()

def update_user_password(db: Session, user: models.User, new_password: str):
    user.hashed_password = models.get_password_hash(new_password)
    user.reset_token = None
    user.reset_token_expires = None
    db.commit()
    return user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def get_order_by_uid(db: Session, order_uid: str):
    """Fetches a single order by its unique string identifier (order_uid)."""
    return db.query(models.Order).options(
        joinedload(models.Order.customer),
        joinedload(models.Order.items)
    ).filter(models.Order.order_uid == order_uid).first()


def get_order_for_email(db: Session, order_id: int):
    return db.query(models.Order).options(
        joinedload(models.Order.customer),
        joinedload(models.Order.items)
    ).filter(models.Order.id == order_id).first()

def create_order(db: Session, order_data: schemas.OrderCreate, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user: return None

    total = 0.0
    order_items_to_create = []

    for it in order_data.items:
        prod = get_product(db, it.product_id)
        if not prod or prod.stock < it.qty: return None
        subtotal = prod.price * it.qty
        total += subtotal
        order_items_to_create.append({
            "product_id": prod.id, "product_name": prod.name, "qty": it.qty,
            "subtotal": subtotal, "product_instance": prod,
        })

    date_str = datetime.datetime.utcnow().strftime('%Y%m%d')
    random_str = secrets.token_hex(3).upper()
    unique_order_id = f"ORD-{date_str}-{random_str}"

    order = models.Order(
        order_uid=unique_order_id,
        customer_id=user.id, total=total, customer_name=order_data.customer_name,
        customer_phone=order_data.customer_phone, customer_address=order_data.customer_address
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    for item_data in order_items_to_create:
        item = models.OrderItem(
            order_id=order.id, product_id=item_data["product_id"], product_name=item_data["product_name"],
            qty=item_data["qty"], subtotal=item_data["subtotal"]
        )
        db.add(item)
        product_instance = item_data["product_instance"]
        product_instance.stock -= item_data["qty"]

    db.commit()
    db.refresh(order)
    return order

def get_orders_by_user(db: Session, user_id: int):
    return db.query(models.Order).filter(models.Order.customer_id == user_id).order_by(models.Order.created_at.desc()).all()

def get_all_orders(db: Session, show_archived: bool = False):
    query = db.query(models.Order).options(joinedload(models.Order.customer))
    
    if show_archived:
        query = query.filter(models.Order.is_archived == True)
    else:
        query = query.filter(models.Order.is_archived == False)
        
    return query.order_by(models.Order.created_at.desc()).all()

def update_order_status(db: Session, order_id: int, status_update: schemas.OrderUpdate):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if db_order:
        new_status = status_update.status
        if new_status == "cancelled" and db_order.status != "cancelled":
            for item in db_order.items:
                product = get_product(db, item.product_id)
                if product: product.stock += item.qty
        
        db_order.status = new_status
        
        if new_status in ["delivered", "cancelled"]:
            db_order.is_archived = True
        else:
            db_order.is_archived = False
        
        db.commit()
        db.refresh(db_order)
    return db_order

def cancel_order_by_user(db: Session, order_id: int, user_id: int):
    db_order = db.query(models.Order).filter(
        models.Order.id == order_id,
        models.Order.customer_id == user_id,
        models.Order.status == "pending"
    ).first()
    if not db_order: return None
    for item in db_order.items:
        product = get_product(db, item.product_id)
        if product: product.stock += item.qty
    db_order.status = "cancelled"
    db_order.is_archived = True
    db.commit()
    db.refresh(db_order)
    return db_order

def create_contact_submission(db: Session, submission: schemas.ContactSubmissionCreate):
    db_submission = models.ContactSubmission(**submission.model_dump())
    db.add(db_submission)
    db.commit()
    db.refresh(db_submission)
    return db_submission

def get_contact_submissions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ContactSubmission).order_by(models.ContactSubmission.submitted_at.desc()).offset(skip).limit(limit).all()

def get_or_create_user_from_google(db: Session, email: str, name: str):
    user = get_user_by_email(db, email)
    if not user:
        user = models.User(email=email, name=name, is_active=1, role="user")
        db.add(user)
        db.commit()
        db.refresh(user)
    return user