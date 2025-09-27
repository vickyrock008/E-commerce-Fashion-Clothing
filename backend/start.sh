#!/bin/sh

# This script will first run the database seeder and then start the main application.

echo "--- Running database seeder ---"
python -m app.seed_products

# Now, start the Uvicorn server
echo "--- Starting Uvicorn server ---"
uvicorn app.main:app --host 0.0.0.0 --port 8000
