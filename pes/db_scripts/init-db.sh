#!/bin/bash

# Docker and Database details
CONTAINER_NAME="mssql-server"
DB_USER="sa"
DB_PASSWORD="Password123!"
DB_NAME="pes_sba"
INIT_SCRIPT="init-db.sql"
CONTAINER_SCRIPT_PATH="/tmp/$INIT_SCRIPT"

# Full path to the init script on the host
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOST_SCRIPT_PATH="$SCRIPT_DIR/$INIT_SCRIPT"

echo "--- Dropping database $DB_NAME in container $CONTAINER_NAME if it exists ---"
docker exec "$CONTAINER_NAME" /opt/mssql-tools/bin/sqlcmd -S localhost -U "$DB_USER" -P "$DB_PASSWORD" -Q "IF DB_ID('$DB_NAME') IS NOT NULL DROP DATABASE $DB_NAME"

echo "--- Copying $INIT_SCRIPT to container $CONTAINER_NAME ---"
docker cp "$HOST_SCRIPT_PATH" "$CONTAINER_NAME:$CONTAINER_SCRIPT_PATH"

echo "--- Running init script to create database $DB_NAME in container $CONTAINER_NAME ---"
docker exec "$CONTAINER_NAME" /opt/mssql-tools/bin/sqlcmd -S localhost -U "$DB_USER" -P "$DB_PASSWORD" -i "$CONTAINER_SCRIPT_PATH"

echo "--- Database initialization complete ---"