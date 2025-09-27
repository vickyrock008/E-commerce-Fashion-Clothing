#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# 1. Start the Uvicorn server in the background
echo "--- Starting Uvicorn server in the background ---"
uvicorn app.main:app --host 0.0.0.0 --port 8000 &

# 2. Capture the Process ID (PID)
UVICORN_PID=$!

# 3. Poll the health-check endpoint until the server is ready
echo "--- Waiting for server to become available ---"
# Note: You need a health check endpoint (e.g., /health) in your app
until curl -s -f http://localhost:8000/health > /dev/null; do
    echo "Server is not available yet. Retrying in 2 seconds..."
    sleep 2
done

echo "--- Server is up and running! ---"

# 4. Run the database seeder
echo "--- Running database seeder ---"
python -m app.seed_products
echo "--- Seeder finished successfully ---"

# 5. Bring the Uvicorn server process to the foreground
echo "--- Server is running. Bringing to foreground. ---"
wait $UVICORN_PID
