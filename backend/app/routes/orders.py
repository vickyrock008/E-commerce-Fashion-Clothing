# app/routes/orders.py

# ✨ 1. Import the `asyncio` library
import asyncio
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from .. import crud, schemas
from ..database import get_db
from ..security import require_admin_user
# Import the new admin cancellation email function
from ..email import send_order_delivered_email, send_order_cancelled_email, send_order_cancelled_admin_notification

router = APIRouter(prefix="/api/orders", tags=["orders"])

@router.get("/", response_model=List[schemas.OrderOut], dependencies=[Depends(require_admin_user)])
def list_all_orders(show_archived: bool = False, db: Session = Depends(get_db)):
    orders = crud.get_all_orders(db, show_archived=show_archived)
    return orders

@router.get("/{order_uid}", response_model=schemas.OrderOut, dependencies=[Depends(require_admin_user)])
def get_order_by_uid(order_uid: str, db: Session = Depends(get_db)):
    order = crud.get_order_by_uid(db, order_uid=order_uid)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


# ✨ 2. Make this function `async`
@router.put("/{order_id}", response_model=schemas.OrderOut, dependencies=[Depends(require_admin_user)])
async def update_order(
    order_id: int, 
    status_update: schemas.OrderUpdate, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db)
):
    updated_order = crud.update_order_status(db, order_id=order_id, status_update=status_update)
    if updated_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Send email based on the new status
    if updated_order.status == "delivered":
        background_tasks.add_task(send_order_delivered_email, email_to=updated_order.customer.email, order_id=updated_order.id)
    elif updated_order.status == "cancelled":
        # ✨ 3. Add the two email tasks with a delay in between
        # Send email to the customer
        background_tasks.add_task(send_order_cancelled_email, email_to=updated_order.customer.email, order_id=updated_order.id)
        await asyncio.sleep(5) # Add a 5-second pause
        # ALSO send notification to the admin
        background_tasks.add_task(send_order_cancelled_admin_notification, order_id=updated_order.id)
        
    return updated_order
