#!/bin/bash

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/.."

echo "--- 1. Initializing database ---"
bash "$SCRIPT_DIR/init-db.sh"

echo "--- 2. Starting Spring Boot application to create tables ---"
cd "$PROJECT_ROOT/server/pes_be"
mvn spring-boot:run &
APP_PID=$!

echo "--- Waiting for application to start (PID: $APP_PID) ---"
# Wait for a few seconds to ensure the application has time to start and create tables.
# A more robust solution would be to poll the health endpoint.
sleep 30

echo "--- 3. Stopping Spring Boot application ---"
kill $APP_PID
# Wait for the process to be killed
wait $APP_PID 2>/dev/null

echo "--- 4. Running data script to populate tables ---"
cd "$PROJECT_ROOT"
bash "$SCRIPT_DIR/run-data.sh"

echo "--- Full database initialization complete ---"