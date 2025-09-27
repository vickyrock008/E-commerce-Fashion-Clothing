# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine, Base
from . import models
from .routes import products, checkout, categories, auth, users, orders, contact
import os
from contextlib import asynccontextmanager
from .seed_products import seed_data

# This line ensures all your tables are created when the app starts
models.Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run seeding function on startup
    print("Seeding data...")
    seed_data()
    print("Seeding complete!")
    yield

app = FastAPI(title="Fashion clothing API", lifespan=lifespan)


# Mount the static directory to serve image files
app.mount("/static", StaticFiles(directory="app/static"), name="static")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all the API routes from your application# app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine, Base
from . import models
from .routes import products, checkout, categories, auth, users, orders, contact
import os
from contextlib import asynccontextmanager
from .seed_products import seed_data

# This line ensures all your tables are created when the app starts
models.Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run seeding function on startup (Preserving existing functionality)
    # NOTE: Since this is synchronous, the ASGI server will block while it runs.
    # This is fine for initial setup but should be moved to a one-off job for production.
    print("Seeding data...")
    seed_data()
    print("Seeding complete!")
    yield

app = FastAPI(title="Fashion clothing API", lifespan=lifespan)


# Mount the static directory to serve image files
app.mount("/static", StaticFiles(directory="app/static"), name="static")


# --- FIX: Explicitly specify allowed origins for robust CORS handling ---
origins = [
    # Your Netlify frontend domain
    "https://theoutfitoracle.netlify.app", 
    # Your Render backend domain (often needed to allow self-requests)
    "https://the-outfit-oracle.onrender.com", 
    # Local development hosts
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:5173",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, # Important for cookie/authorization headers
    allow_methods=["*"],
    allow_headers=["*"],
)
# --- END FIX ---


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
