#!/bin/bash

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/.."

# Docker and Database details
CONTAINER_NAME="mssql-server"
DB_USER="sa"
DB_PASSWORD="Password123!"
DB_NAME="pes_sba"
INIT_SCRIPT="init.sql"
DATA_SCRIPT="data.sql"
CONTAINER_INIT_SCRIPT_PATH="/tmp/$INIT_SCRIPT"
CONTAINER_DATA_SCRIPT_PATH="/tmp/$DATA_SCRIPT"
HOST_INIT_SCRIPT_PATH="$SCRIPT_DIR/$INIT_SCRIPT"
HOST_DATA_SCRIPT_PATH="$SCRIPT_DIR/$DATA_SCRIPT"

echo "--- 1. Initializing database ---"
echo "--- Dropping database $DB_NAME in container $CONTAINER_NAME if it exists ---"
docker exec "$CONTAINER_NAME" /opt/mssql-tools/bin/sqlcmd -S localhost -U "$DB_USER" -P "$DB_PASSWORD" -Q "IF DB_ID('$DB_NAME') IS NOT NULL BEGIN ALTER DATABASE [$DB_NAME] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE [$DB_NAME]; END"

echo "--- Copying $INIT_SCRIPT to container $CONTAINER_NAME ---"
docker cp "$HOST_INIT_SCRIPT_PATH" "$CONTAINER_NAME:$CONTAINER_INIT_SCRIPT_PATH"

echo "--- Running init script to create database $DB_NAME in container $CONTAINER_NAME ---"
docker exec "$CONTAINER_NAME" /opt/mssql-tools/bin/sqlcmd -S localhost -U "$DB_USER" -P "$DB_PASSWORD" -i "$CONTAINER_INIT_SCRIPT_PATH"
echo "--- Database initialization complete ---"


echo "--- 2. Starting Spring Boot application to create tables ---"
cd "$PROJECT_ROOT/server/pes_be"
./mvnw spring-boot:run &
APP_PID=$!

echo "--- Waiting for application to start (PID: $APP_PID) ---"
# Wait for a few seconds to ensure the application has time to start and create tables.
# A more robust solution would be to poll the health endpoint.
sleep 30

echo "--- 3. Running data script to populate tables ---"
echo "--- Copying $DATA_SCRIPT to container $CONTAINER_NAME ---"
docker cp "$HOST_DATA_SCRIPT_PATH" "$CONTAINER_NAME:$CONTAINER_DATA_SCRIPT_PATH"

echo "--- Running data script to populate database $DB_NAME in container $CONTAINER_NAME ---"
docker exec "$CONTAINER_NAME" /opt/mssql-tools/bin/sqlcmd -S localhost -U "$DB_USER" -P "$DB_PASSWORD" -d "$DB_NAME" -i "$CONTAINER_DATA_SCRIPT_PATH"
echo "--- Data population complete ---"


echo "--- 4. Stopping Spring Boot application ---"
if ps -p $APP_PID > /dev/null
then
   echo "Stopping Spring Boot application (PID: $APP_PID)"
   kill $APP_PID
   wait $APP_PID 2>/dev/null
fi


echo "--- Full database initialization complete ---"