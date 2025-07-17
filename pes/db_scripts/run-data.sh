#!/bin/bash

# Docker and Database details
CONTAINER_NAME="mssql-server"
DB_USER="sa"
DB_PASSWORD="Password123!"
DB_NAME="pes_sba"
DATA_SCRIPT="data.sql"
CONTAINER_SCRIPT_PATH="/tmp/$DATA_SCRIPT"

# Full path to the data script on the host
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOST_SCRIPT_PATH="$SCRIPT_DIR/$DATA_SCRIPT"

echo "--- Copying $DATA_SCRIPT to container $CONTAINER_NAME ---"
docker cp "$HOST_SCRIPT_PATH" "$CONTAINER_NAME:$CONTAINER_SCRIPT_PATH"

echo "--- Running data script to populate database $DB_NAME in container $CONTAINER_NAME ---"
docker exec "$CONTAINER_NAME" /opt/mssql-tools/bin/sqlcmd -S localhost -U "$DB_USER" -P "$DB_PASSWORD" -d "$DB_NAME" -i "$CONTAINER_SCRIPT_PATH"

echo "--- Data population complete ---"