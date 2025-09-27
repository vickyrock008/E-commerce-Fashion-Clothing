# app/routes/products.py

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, schemas, models
from ..database import get_db
from ..security import require_admin_user
import shutil
import uuid
import os

# Create a directory for images if it doesn't exist
UPLOADS_DIR = "static/images/products"
os.makedirs(UPLOADS_DIR, exist_ok=True)


router = APIRouter(prefix="/api/products", tags=["products"])

# --- Public Routes ---
@router.get("/search", response_model=List[schemas.ProductOut])
def search_for_products(query: Optional[str] = None, db: Session = Depends(get_db)):
    if not query:
        return []
    products = crud.search_products(db, query=query)
    return products

@router.get("/", response_model=List[schemas.ProductOut])
def list_products(db: Session = Depends(get_db)):
    products = crud.get_products(db)
    return products

@router.get("/{product_id}", response_model=schemas.ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = crud.get_product(db, product_id=product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# --- PROTECTED ADMIN ROUTES ---

@router.post("/", response_model=schemas.ProductOut, dependencies=[Depends(require_admin_user)])
def create_product(
    db: Session = Depends(get_db),
    name: str = Form(...),
    price: float = Form(...),
    stock: int = Form(...),
    description: Optional[str] = Form(None),
    category_id: int = Form(...),
    image: UploadFile = File(...)
):
    file_extension = image.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    image_path = os.path.join(UPLOADS_DIR, unique_filename)
    
    try:
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
    finally:
        image.file.close()

    image_url = f"/static/images/products/{unique_filename}"
    
    product_schema = schemas.ProductCreate(
        name=name,
        price=price,
        stock=stock,
        description=description,
        category_id=category_id,
        image=image_url
    )
    
    return crud.create_product(db=db, product=product_schema)

@router.put("/{product_id}", response_model=schemas.ProductOut, dependencies=[Depends(require_admin_user)])
def update_product(
    product_id: int,
    db: Session = Depends(get_db),
    name: str = Form(...),
    price: float = Form(...),
    stock: int = Form(...),
    description: Optional[str] = Form(None),
    category_id: int = Form(...),
    image: Optional[UploadFile] = File(None) # Image is now optional
):
    # First, get the existing product
    db_product = crud.get_product(db, product_id=product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Prepare the data for update
    update_data = {
        "name": name,
        "price": price,
        "stock": stock,
        "description": description,
        "category_id": category_id,
    }

    # If a new image was uploaded, save it and update the image URL
    if image:
        # Before saving the new image, delete the old one if it exists
        if db_product.image:
            old_image_path = db_product.image.lstrip('/')
            if os.path.exists(old_image_path):
                os.remove(old_image_path)

        file_extension = image.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        image_path = os.path.join(UPLOADS_DIR, unique_filename)
        
        try:
            with open(image_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
        finally:
            image.file.close()
        
        # Add the new image URL to our update data
        update_data["image"] = f"/static/images/products/{unique_filename}"

    # Pass the dictionary of changes to the CRUD function
    return crud.update_product(db=db, product_id=product_id, product_update=update_data)


@router.post("/{product_id}/add_stock", response_model=schemas.ProductOut, dependencies=[Depends(require_admin_user)])
def add_stock(product_id: int, stock_data: schemas.AddStock, db: Session = Depends(get_db)):
    db_product = crud.add_stock_to_product(db, product_id=product_id, stock_data=stock_data)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.delete("/{product_id}", response_model=schemas.ProductOut, dependencies=[Depends(require_admin_user)])
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_product = crud.delete_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product