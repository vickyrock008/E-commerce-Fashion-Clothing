from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db
from ..security import require_admin_user # ✨ Import our security guard

router = APIRouter(prefix="/api/categories", tags=["categories"])

# --- PUBLIC ROUTES (Anyone can see the categories) ---

@router.get("/", response_model=List[schemas.CategoryOut])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    categories = crud.get_categories(db, skip=skip, limit=limit)
    return categories

@router.get("/{category_id}", response_model=schemas.CategoryOut)
def read_category(category_id: int, db: Session = Depends(get_db)):
    db_category = crud.get_category(db, category_id=category_id)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

# --- PROTECTED ADMIN ROUTES ---

@router.post("/", response_model=schemas.CategoryOut, dependencies=[Depends(require_admin_user)])
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    return crud.create_category(db=db, category=category)

@router.put("/{category_id}", response_model=schemas.CategoryOut, dependencies=[Depends(require_admin_user)])
def update_category(category_id: int, category: schemas.CategoryUpdate, db: Session = Depends(get_db)):
    db_category = crud.update_category(db, category_id=category_id, category_update=category)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

@router.delete("/{category_id}", response_model=schemas.CategoryOut, dependencies=[Depends(require_admin_user)])
def delete_category(category_id: int, db: Session = Depends(get_db)):
    # This will fail if products are still in this category, which is a good safety feature!
    db_category = crud.delete_category(db, category_id=category_id)
    if db_category is None:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category
