#!/bin/bash

# Run the seeding script to populate the database
# The Python script will be executed with the interpreter in the container's path.
echo "Running the database seeding script..."
python -m app.seed_products

# Start the Uvicorn server
echo "Starting the FastAPI application..."
uvicorn app.main:app --host 0.0.0.0 --port 8000
