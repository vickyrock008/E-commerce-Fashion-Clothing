# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# ✨ 1. Import StaticFiles
from fastapi.staticfiles import StaticFiles
from .database import engine, Base
from . import models
from .routes import products, checkout, categories, auth, users, orders, contact
import os

# This line ensures all your tables are created when the app starts
models.Base.metadata.create_all(bind=engine) 

app = FastAPI(title=" Fashion clothing API")

# ✨ 2. Mount the static directory to serve image files
# This makes any file inside the 'static' folder available at the '/static' URL
# The corrected line in app/main.py
app.mount("/static", StaticFiles(directory="app/static"), name="static")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all the API routes from your application
app.include_router(products.router)
app.include_router(checkout.router)
app.include_router(categories.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(orders.router)
app.include_router(contact.router)

@app.get('/')
def root():
    return {"message": "fashion clothing backend is running."}

@app.get("/health", status_code=status.HTTP_200_OK)
def health_check():
    """Simple endpoint to confirm the API is running."""
    return {"status": "ok"}
