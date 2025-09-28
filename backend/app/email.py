# app/email.py

import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from pathlib import Path
from datetime import datetime
from .config import settings
from .database import SessionLocal
from . import crud

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
def get_base_template_body():
    return {
        "logo_url": f"{settings.BACKEND_URL}/static/images/logo.png",
        "year": datetime.utcnow().year,
        "shop_new_arrivals_link": f"{settings.FRONTEND_URL}/lookbook",
        "continue_shopping_link": f"{settings.FRONTEND_URL}/shop"
    }

# --- Central Email Sending Function ---
async def send_email(to_email: str, subject: str, template_name: str, template_body: dict):
    """
    Constructs and sends an email using the SendGrid Web API.
    """
    # Load the HTML template from the file
    template_path = Path(__file__).parent / 'templates' / template_name
    html_content = template_path.read_text()

    # Replace placeholders with values from template_body
    for key, value in template_body.items():
        html_content = html_content.replace(f"{{{{ {key} }}}}", str(value))
    
    # The | safe filter is Jinja2 specific, so we manually handle the HTML items
    if 'items_html' in template_body:
         html_content = html_content.replace("{{ items_html | safe }}", template_body['items_html'])

    message = Mail(
        from_email=settings.MAIL_FROM,
        to_emails=to_email,
        subject=subject,
        html_content=html_content
    )
    try:
        # Use the MAIL_PASSWORD as the SendGrid API key
        sg = SendGridAPIClient(settings.MAIL_PASSWORD)
        response = await sg.send(message)
        print(f"✅ Email sent to {to_email}. Status code: {response.status_code}")
    except Exception as e:
        print(f"❌ Failed to send email to {to_email}. Error: {e}")

# --- Email Sending Functions ---

async def send_password_reset_email(email_to: str, user_name: str, token: str):
    template_body = get_base_template_body()
    template_body.update({
        "customer_name": user_name,
        "reset_link": f"{settings.FRONTEND_URL}/reset-password?token={token}"
    })
    await send_email(
        to_email=email_to,
        subject="Your Password Reset Link for The Outfit Oracle",
        template_name="password_reset.html",
        template_body=template_body
    )

async def send_order_confirmation_email(email_to: str, order_id: int):
    db = SessionLocal()
    try:
        order = crud.get_order_for_email(db, order_id)
        if not order: return

        template_body = get_base_template_body()
        template_body.update({
            "customer_name": order.customer_name,
            "order_id": order.order_uid,
            "items_html": generate_items_html(order.items),
            "total": f"{order.total:.2f}",
            "address": order.customer_address,
        })
        await send_email(
            to_email=email_to,
            subject="Your The Outfit Oracle Order Confirmation",
            template_name="order_confirmation.html",
            template_body=template_body
        )
    finally:
        db.close()

async def send_order_delivered_email(email_to: str, order_id: int):
    db = SessionLocal()
    try:
        order = crud.get_order_for_email(db, order_id)
        if not order: return

        template_body = get_base_template_body()
        template_body.update({
            "customer_name": order.customer_name,
            "order_id": order.order_uid,
        })
        await send_email(
            to_email=email_to,
            subject="Your The Outfit Oracle Order Has Been Delivered!",
            template_name="order_delivered.html",
            template_body=template_body
        )
    finally:
        db.close()

async def send_order_cancelled_email(email_to: str, order_id: int):
    db = SessionLocal()
    try:
        order = crud.get_order_for_email(db, order_id)
        if not order: return

        template_body = get_base_template_body()
        template_body.update({
            "customer_name": order.customer_name,
            "order_id": order.order_uid,
        })
        await send_email(
            to_email=email_to,
            subject="Your The Outfit Oracle Order Has Been Cancelled",
            template_name="order_cancelled.html",
            template_body=template_body
        )
    finally:
        db.close()

# --- ADMIN NOTIFICATION FUNCTIONS ---

async def send_new_order_admin_notification(order_id: int):
    db = SessionLocal()
    try:
        order = crud.get_order_for_email(db, order_id)
        if not order: return

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
        await send_email(
            to_email=settings.ADMIN_EMAIL,
            subject=f"New Order Received! (#{order.order_uid})",
            template_name="new_order_admin_notification.html",
            template_body=template_body
        )
    finally:
        db.close()
        
async def send_order_cancelled_admin_notification(order_id: int):
    db = SessionLocal()
    try:
        order = crud.get_order_for_email(db, order_id)
        if not order: return

        template_body = {
            **get_base_template_body(),
            "customer_name": order.customer_name, 
            "order_uid": order.order_uid, 
            "admin_order_link": f"{settings.FRONTEND_URL}/admin/orders/{order.order_uid}"
        }
        await send_email(
            to_email=settings.ADMIN_EMAIL,
            subject=f"Notice: Order #{order.order_uid} has been cancelled",
            template_name="order_cancelled_admin_notification.html",
            template_body=template_body
        )
    finally:
        db.close()

