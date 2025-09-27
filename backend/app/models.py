# app/models.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.orm import relationship
from .database import Base
import datetime

from passlib.context import CryptContext
# ✨ FIX: The CryptContext is already configured to use bcrypt via the 'schemes' argument.
# The incorrect .load_path() line has been removed to fix the FileNotFoundError.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Integer, default=1)
    role = Column(String, default="user")
    reset_token = Column(String, unique=True, index=True, nullable=True)
    reset_token_expires = Column(DateTime, nullable=True)
    orders = relationship("Order", back_populates="customer")


class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    slug = Column(String, unique=True, index=True)
    products = relationship("Product", back_populates="category", cascade="all, delete-orphan")

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    slug = Column(String, unique=True, index=True)
    description = Column(Text)
    price = Column(Float)
    image = Column(String, default="")
    stock = Column(Integer, default=0)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="CASCADE"))
    category = relationship("Category", back_populates="products")

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    order_uid = Column(String, unique=True, index=True) 
    
    customer_name = Column(String)
    customer_phone = Column(String)
    customer_address = Column(Text)
    
    total = Column(Float, default=0.0)
    status = Column(String, default="pending")
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    items = relationship("OrderItem", back_populates="order")
    customer_id = Column(Integer, ForeignKey("users.id"))
    customer = relationship("User", back_populates="orders")


class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer)
    product_name = Column(String)
    qty = Column(Integer)
    subtotal = Column(Float)
    order = relationship("Order", back_populates="items")
    
class ContactSubmission(Base):
    __tablename__ = "contact_submissions"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, index=True)
    phone = Column(String, nullable=True)
    message = Column(Text)
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)


def verify_password(plain_password, hashed_password):
    password_bytes = plain_password.encode('utf-8')
    return pwd_context.verify(password_bytes[:72], hashed_password)

def get_password_hash(password):
    password_bytes = password.encode('utf-8')
    return pwd_context.hash(password_bytes[:72])

