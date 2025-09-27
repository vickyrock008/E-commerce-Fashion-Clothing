# app/routes/checkout.py

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import asyncio # ✨ 1. Import the asyncio library for proper delays

from ..database import get_db
from .. import schemas, crud
from ..email import send_order_confirmation_email, send_new_order_admin_notification

router = APIRouter(prefix="/api/checkout", tags=["checkout"])

# ✨ 2. This is the new, reliable helper function for the admin email
async def send_admin_notification_with_delay(order_id: int):
    """
    Waits for a safe amount of time before sending the admin notification email
    to avoid hitting the Mailtrap rate limit.
    """
    print("--- Waiting 10 seconds before sending admin email... ---")
    await asyncio.sleep(10) # A generous 10-second non-blocking delay
    await send_new_order_admin_notification(order_id=order_id)


# ✨ FIX: Keeping only one definition of the checkout function.
@router.post("/")
def checkout(order: schemas.OrderCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    created = crud.create_order(db, order_data=order, user_id=order.user_id)
    if not created:
        # A common reason for this error is a lack of product stock, or invalid user_id
        raise HTTPException(status_code=400, detail="Could not create order. Check user ID and product stock.")
    
    # Task 1: Send the customer confirmation email immediately. 
    background_tasks.add_task(send_order_confirmation_email, email_to=created.customer.email, order_id=created.id)
    
    # Task 2: Send the admin notification using our new, delayed function.
    background_tasks.add_task(send_admin_notification_with_delay, order_id=created.id)
    
    # Return the new professional ID in the response
    return {"order_uid": created.order_uid, "total": created.total, "status": created.status}
