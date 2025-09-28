# app/email.py

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pathlib import Path
from datetime import datetime
from .config import settings
from .database import SessionLocal
from . import crud

# --- Email Connection Configuration ---
# FINAL FIX: Based on SendGrid's documentation and previous timeout errors,
# we are now trying port 25, which also supports TLS connections.
conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_FROM,
    MAIL_PORT=25,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True,
    TEMPLATE_FOLDER=Path(__file__).parent / 'templates',
)

fm = FastMail(conf)

# --- Helper function to generate HTML for order items ---
def generate_items_html(items):
    html = ""
    for item in items:
        html += f"""
        <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6;">{item.product_name}</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #dee2e6;">{item.qty}</td>
            <td style="text-align: right; padding: 12px 0; border-bottom: 1px solid #dee2e6;">₹{item.subtotal:.2f}</td>
        </tr>
        """
    return html

# --- General Template Data ---
# This dictionary provides common data to all templates to avoid repetition.
def get_base_template_body():
    return {
        "logo_url": f"{settings.BACKEND_URL}/static/images/logo.png", # Fallback to a hosted image
        "year": datetime.utcnow().year,
        "shop_new_arrivals_link": f"{settings.FRONTEND_URL}/lookbook",
        "continue_shopping_link": f"{settings.FRONTEND_URL}/shop"
    }

# --- Email Sending Functions ---

async def send_password_reset_email(email_to: str, user_name: str, token: str):
    """Sends the password reset email."""
    template_body = get_base_template_body()
    template_body.update({
        "customer_name": user_name,
        "reset_link": f"{settings.FRONTEND_URL}/reset-password?token={token}"
    })
    
    message = MessageSchema(
        subject="Your Password Reset Link for The Outfit Oracle",
        recipients=[email_to],
        template_body=template_body,
        subtype="html"
    )
    try:
        await fm.send_message(message, template_name="password_reset.html")
        print(f"✅ Password reset email sent to {email_to}")
    except Exception as e:
        print(f"❌ Failed to send password reset email. Error: {e}")

async def send_order_confirmation_email(email_to: str, order_id: int):
    """Sends the order confirmation email to the customer."""
    db = SessionLocal()
    try:
        order = crud.get_order_for_email(db, order_id)
        if not order: return

        template_body = get_base_template_body()
        template_body.update({
            "customer_name": order.customer_name,
            "order_id": order.order_uid, # Correct key for the template
            "items_html": generate_items_html(order.items),
            "total": f"{order.total:.2f}",
            "address": order.customer_address,
        })
        
        message = MessageSchema(
            subject="Your The Outfit Oracle Order Confirmation",
            recipients=[email_to],
            template_body=template_body,
            subtype="html"
        )
        await fm.send_message(message, template_name="order_confirmation.html")
        print(f"✅ Order confirmation email sent to {email_to} for order #{order.order_uid}")
    finally:
        db.close()

async def send_order_delivered_email(email_to: str, order_id: int):
    """Sends the order delivered confirmation to the customer."""
    db = SessionLocal()
    try:
        order = crud.get_order_for_email(db, order_id)
        if not order: return

        template_body = get_base_template_body()
        template_body.update({
            "customer_name": order.customer_name,
            "order_id": order.order_uid, # Correct key for the template
        })

        message = MessageSchema(
            subject="Your The Outfit Oracle Order Has Been Delivered!",
            recipients=[email_to],
            template_body=template_body,
            subtype="html"
        )
        await fm.send_message(message, template_name="order_delivered.html")
        print(f"✅ Order delivered email sent to {email_to} for order #{order.order_uid}")
    finally:
        db.close()

async def send_order_cancelled_email(email_to: str, order_id: int):
    """Sends the order cancellation confirmation to the customer."""
    db = SessionLocal()
    try:
        order = crud.get_order_for_email(db, order_id)
        if not order: return

        template_body = get_base_template_body()
        template_body.update({
            "customer_name": order.customer_name,
            "order_id": order.order_uid, # Correct key for the template
        })
        
        message = MessageSchema(
            subject="Your The Outfit Oracle Order Has Been Cancelled",
            recipients=[email_to],
            template_body=template_body,
            subtype="html"
        )
        await fm.send_message(message, template_name="order_cancelled.html")
        print(f"✅ Order cancelled email sent to {email_to} for order #{order.order_uid}")
    finally:
        db.close()

# --- ADMIN NOTIFICATION FUNCTIONS ---

async def send_new_order_admin_notification(order_id: int):
    """Sends a notification to the admin when a new order is placed."""
    db = SessionLocal()
    try:
        order = crud.get_order_for_email(db, order_id)
        if not order: return

        # ✨ MODIFIED: Combined dictionary creation for cleaner code
        template_body = {
            **get_base_template_body(),
            "order_id": order.order_uid,
            "customer_name": order.customer_name,
            "customer_phone": order.customer_phone,
            "address": order.customer_address,
            "items_html": generate_items_html(order.items),
            "total": f"{order.total:.2f}",
            "admin_order_link": f"{settings.FRONTEND_URL}/admin/orders/{order.order_uid}"
        }
        
        message = MessageSchema(
            subject=f"New Order Received! (#{order.order_uid})",
            recipients=[settings.ADMIN_EMAIL],
            template_body=template_body,
            subtype="html"
        )
        await fm.send_message(message, template_name="new_order_admin_notification.html")
        print(f"✅ Admin notification sent for new order #{order.order_uid}")
    finally:
        db.close()
        
async def send_order_cancelled_admin_notification(order_id: int):
    """Sends a notification to the admin when an order is cancelled."""
    db = SessionLocal()
    try:
        order = crud.get_order_for_email(db, order_id)
        if not order: return

        # ✨ MODIFIED: Combined dictionary creation for cleaner code
        template_body = {
            **get_base_template_body(),
            "customer_name": order.customer_name, 
            "order_uid": order.order_uid, 
            "admin_order_link": f"{settings.FRONTEND_URL}/admin/orders/{order.order_uid}"
        }
        
        message = MessageSchema(
            subject=f"Notice: Order #{order.order_uid} has been cancelled",
            recipients=[settings.ADMIN_EMAIL],
            template_body=template_body,
            subtype="html"
        )
        await fm.send_message(message, template_name="order_cancelled_admin_notification.html")
        print(f"✅ Admin cancellation notification sent for order #{order.order_uid}")
    finally:
        db.close()



