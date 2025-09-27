# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine, Base
from . import models
from .routes import products, checkout, categories, auth, users, orders, contact
from .config import settings
from contextlib import asynccontextmanager
from .seed_products import seed_data
import os
import traceback

# Lifespan context manager: runs at startup and shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create DB tables if not present
    try:
        Base.metadata.create_all(bind=engine)
        # Attempt to seed sample products (safe-guarded)
        try:
            seed_data()
        except Exception as e:
            # seeding should not crash the app in deployed environments
            print("seed_data() skipped/failed:", e)
    except Exception as e:
        # If database not reachable, print stack and continue (so app still starts for debugging)
        print("Error during startup DB create/seed:", e)
        traceback.print_exc()
    yield
    # (Optional cleanup on shutdown)
    # e.g., close connections, flush caches, etc.


# Create app with lifespan
app = FastAPI(title="Fashion Clothing Backend", lifespan=lifespan)

# -------------------------
# CORS configuration
# -------------------------
# Use FRONTEND_URL from your .env (settings.FRONTEND_URL)
# Accept comma-separated list or a single URL.
def _normalize_frontend_origins(value):
    if not value:
        return []
    if isinstance(value, str) and "," in value:
        return [u.strip() for u in value.split(",") if u.strip()]
    if isinstance(value, str):
        return [value.strip()]
    return list(value)

frontend_origins = _normalize_frontend_origins(getattr(settings, "FRONTEND_URL", None))

# Add common local dev origins so local dev works without changing env.
for dev_origin in ("http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"):
    if dev_origin not in frontend_origins:
        frontend_origins.append(dev_origin)

# If nothing is configured, fall back to allow all (use only for quick debug)
if not frontend_origins:
    # NOTE: For production prefer explicit domain(s). This is safer for quick deploy/debug.
    frontend_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# Static files - serve uploaded images (if folder exists)
# -------------------------
STATIC_DIR = "static"
if os.path.isdir(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
else:
    # ensure directory exists for future uploads (no-op if deploy doesn't need it)
    try:
        os.makedirs(STATIC_DIR, exist_ok=True)
        app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
    except Exception as e:
        print("Could not create/mount static folder:", e)

# -------------------------
# Include routers (preserve existing functionality)
# Note: routers themselves define prefixes (e.g., auth.router uses prefix='/api/auth')
# -------------------------
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(products.router)
app.include_router(categories.router)
app.include_router(checkout.router)
app.include_router(orders.router)
app.include_router(contact.router)


@app.get("/")
def root():
    return {"message": "fashion clothing backend is running."}
