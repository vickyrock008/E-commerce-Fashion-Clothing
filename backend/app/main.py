# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine
from . import models
from .routes import products, checkout, categories, auth, users, orders, contact
from .config import settings
from contextlib import asynccontextmanager
from .seed_products import seed_data
import os

# --- Lifespan Context Manager for Startup/Shutdown Events ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting the FastAPI application...")
    # Create all database tables if they don't exist
    print("Creating database tables...")
    models.Base.metadata.create_all(bind=engine)
    print("Database tables checked/created.")
    
    print("Seeding data...")
    seed_data()
    print("Seeding complete!")
    
    print("Application startup complete.")
    yield
    print("Application shutdown complete.")

# Initialize the FastAPI app
app = FastAPI(title="The Outfit Oracle API", lifespan=lifespan)

# --- Static Files Configuration ---
# Use an absolute path to ensure reliability in different environments
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")
# The '/static' path is what the frontend will use to access images
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


# --- CORS (Cross-Origin Resource Sharing) CONFIGURATION ---
# This is crucial for allowing your React frontend to communicate with your FastAPI backend.
allowed_origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173", # Allow local development
    "http://localhost:3000", # Allow local development (alternative port)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# --- Include All API Routers ---
# ✨ FIX: All routers are now included, resolving the 404 errors.
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(checkout.router)
app.include_router(users.router)
app.include_router(orders.router)
app.include_router(contact.router)

# --- Root Endpoint for Health Check ---
@app.get("/", tags=["Health Check"])
def read_root():
    return {"message": "The Outfit Oracle API is running."}
