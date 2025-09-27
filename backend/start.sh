#!/bin/sh

# This script will start the Uvicorn server in the background,
# wait for it to initialize, run the database seeder, and
# then bring the server process to the foreground.

# 1. Start the Uvicorn server in the background
echo "--- Starting Uvicorn server in the background ---"
uvicorn app.main:app --host 0.0.0.0 --port 8000 &

# 2. Capture the Process ID (PID) of the background server
UVICORN_PID=$!

# 3. Wait for a few seconds to give the server time to initialize.
# This prevents the seeder from trying to connect before the app is ready.
echo "--- Waiting for server to initialize (5 seconds) ---"
sleep 5

# 4. Run the database seeder now that the server is running
echo "--- Running database seeder ---"
python -m app.seed_products
echo "--- Seeder finished ---"

# 5. Bring the Uvicorn server process to the foreground.
# The 'wait' command will pause the script here and wait for the
# Uvicorn process to exit. This is crucial for keeping the script
# (and any container running it) alive.
echo "--- Server is running. Bringing to foreground. ---"
wait $UVICORN_PID
