# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine, Base
from . import models
from .routes import products, checkout, categories, auth, users, orders, contact
from .config import settings 
# ✨ 1. New Imports for Lifespan and Seeding
from contextlib import asynccontextmanager
from .seed_products import seed_data
import os

# --- Lifespan Context Manager for Startup/Shutdown Events ---
# This function replaces the older @app.on_event("startup") decorator.
@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup Event ---
    # Run seeding function on startup (Preserving existing functionality)
    # NOTE: Since seed_data is synchronous, the ASGI server will block while it runs.
    # This is generally acceptable for initial setup/seeding.
    print("Seeding data...")
    seed_data()
    print("Seeding complete!")
    
    # Yield control to the application to start serving requests
    yield
    
    # --- Shutdown Event (Nothing needed here for this app yet) ---
    print("Application shutdown complete.")


# This line ensures all your tables are created when the app starts
models.Base.metadata.create_all(bind=engine) 

# ✨ 2. Pass the lifespan context manager to the FastAPI app
app = FastAPI(title=" Fashion clothing API", lifespan=lifespan)

# 3. Mount the static directory to serve image files
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# --- CORS CONFIGURATION FIX (Hardened) ---

# 4. Define allowed origins using the FRONTEND_URL from settings
allowed_origins = [
    settings.FRONTEND_URL,
    "*", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins, 
    allow_credentials=True, 
    # ✨ FIX: Explicitly include POST and OPTIONS methods for registration
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allow_headers=["*"],
)

# --- END CORS CONFIGURATION FIX ---

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
