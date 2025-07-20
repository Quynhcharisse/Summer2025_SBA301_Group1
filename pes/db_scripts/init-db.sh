#!/bin/bash

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/.."

# Database details for local MSSQL server
DB_USER="sa"
DB_PASSWORD="12345"
DB_NAME="pes_sba"
SERVER_NAME="localhost"
INIT_SCRIPT="init.sql"
DATA_SCRIPT="data.sql"
HOST_INIT_SCRIPT_PATH="$SCRIPT_DIR/$INIT_SCRIPT"
HOST_DATA_SCRIPT_PATH="$SCRIPT_DIR/$DATA_SCRIPT"

echo "--- 1. Initializing database on local server $SERVER_NAME ---"
echo "--- Dropping database $DB_NAME if it exists ---"
sqlcmd -S "$SERVER_NAME" -U "$DB_USER" -P "$DB_PASSWORD" -Q "IF DB_ID('$DB_NAME') IS NOT NULL BEGIN ALTER DATABASE [$DB_NAME] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE [$DB_NAME]; END"

echo "--- Running init script to create database $DB_NAME ---"
sqlcmd -S "$SERVER_NAME" -U "$DB_USER" -P "$DB_PASSWORD" -i "$HOST_INIT_SCRIPT_PATH"
echo "--- Database initialization complete ---"


echo "--- 2. Starting Spring Boot application to create tables ---"
cd "$PROJECT_ROOT/server/pes_be"
./mvnw spring-boot:run &
APP_PID=$!

echo "--- Waiting for application to start (PID: $APP_PID) ---"
sleep 30

echo "--- 3. Running data script to populate tables ---"
sqlcmd -S "$SERVER_NAME" -U "$DB_USER" -P "$DB_PASSWORD" -d "$DB_NAME" -i "$HOST_DATA_SCRIPT_PATH"
echo "--- Data population complete ---"


echo "--- 4. Stopping Spring Boot application ---"
if ps -p $APP_PID > /dev/null
then
   echo "Stopping Spring Boot application (PID: $APP_PID)"
   kill $APP_PID
   wait $APP_PID 2>/dev/null
fi


echo "--- Full database initialization complete ---"