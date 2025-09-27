# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine, Base
from . import models
from .routes import products, checkout, categories, auth, users, orders, contact
from .config import settings
from contextlib import asynccontextmanager
from .seed_products import seed_data
import os # 👈 Import the 'os' module

# --- Lifespan Context Manager for Startup/Shutdown Events ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Seeding data...")
    seed_data()
    print("Seeding complete!")
    yield
    print("Application shutdown complete.")

# Create all database tables
models.Base.metadata.create_all(bind=engine)

# Initialize the FastAPI app
app = FastAPI(title="Fashion clothing API", lifespan=lifespan)

# --- ✨ PATH FIX IS HERE ---
# 1. Get the absolute path to the directory containing main.py
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# 2. Join it with the relative path to your static directory
STATIC_DIR = os.path.join(BASE_DIR, "static")

# 3. Mount the static directory using the new, robust absolute path
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
# --- ✨ END OF PATH FIX ---


# --- CORS CONFIGURATION ---
allowed_origins = [
    settings.FRONTEND_URL,
    "https://outfit-oracle-idx5.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# --- Include Routers ---
app.include_router(products.router)
app.include_router(checkout.router)
# ... (rest of your file remains the same) ...
