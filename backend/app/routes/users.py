# app/routes/users.py

# ✨ 1. Import the `asyncio` library
import asyncio
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas, models
from ..database import get_db
# ✨ Import both security functions here
from ..security import get_current_user, require_admin_user
from ..email import send_order_cancelled_email, send_order_cancelled_admin_notification

router = APIRouter(prefix="/api/users", tags=["users"])

# --- PROTECTED ADMIN ROUTE ---
# This route is correctly protected
@router.get("/", response_model=List[schemas.UserOut], dependencies=[Depends(require_admin_user)])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


# --- ROUTES FOR CURRENT LOGGED-IN USER ---
# The response_model is now correctly set to OrderOut
@router.get("/me/orders", response_model=List[schemas.OrderOut])
def get_my_orders(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    orders = crud.get_orders_by_user(db, user_id=current_user.id)
    if not orders:
        return []
    return orders

# ✨ 2. Make this function `async`
@router.put("/me/orders/{order_id}/cancel", response_model=schemas.OrderOut)
async def cancel_my_order(
    order_id: int,
    background_tasks: BackgroundTasks,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cancelled_order = crud.cancel_order_by_user(db, order_id=order_id, user_id=current_user.id)
    if not cancelled_order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found or cannot be cancelled."
        )

    # ✨ 3. Add the two email tasks with a delay in between
    background_tasks.add_task(send_order_cancelled_email, email_to=cancelled_order.customer.email, order_id=cancelled_order.id)
    await asyncio.sleep(5) # Add a 5-second pause
    background_tasks.add_task(send_order_cancelled_admin_notification, order_id=cancelled_order.id)

    return cancelled_order
