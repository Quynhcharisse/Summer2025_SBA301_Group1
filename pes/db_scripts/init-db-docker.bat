@echo off

set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%.."

set "CONTAINER_NAME=mssql-server"
set "DB_USER=sa"
set "DB_PASSWORD=Password123!"
set "DB_NAME=pes_sba"
set "INIT_SCRIPT=init.sql"
set "DATA_SCRIPT=data.sql"
set "CONTAINER_INIT_SCRIPT_PATH=/tmp/%INIT_SCRIPT%"
set "CONTAINER_DATA_SCRIPT_PATH=/tmp/%DATA_SCRIPT%"
set "HOST_INIT_SCRIPT_PATH=%SCRIPT_DIR%%INIT_SCRIPT%"
set "HOST_DATA_SCRIPT_PATH=%SCRIPT_DIR%%DATA_SCRIPT%"

echo "--- 1. Initializing database ---"
echo "--- Dropping database %DB_NAME% in container %CONTAINER_NAME% if it exists ---"
docker exec "%CONTAINER_NAME%" /opt/mssql-tools/bin/sqlcmd -S localhost -U "%DB_USER%" -P "%DB_PASSWORD%" -Q "IF DB_ID('%DB_NAME%') IS NOT NULL BEGIN ALTER DATABASE [%DB_NAME%] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE [%DB_NAME%]; END"

echo "--- Copying %INIT_SCRIPT% to container %CONTAINER_NAME% ---"
docker cp "%HOST_INIT_SCRIPT_PATH%" "%CONTAINER_NAME%:%CONTAINER_INIT_SCRIPT_PATH%"

echo "--- Running init script to create database %DB_NAME% in container %CONTAINER_NAME% ---"
docker exec "%CONTAINER_NAME%" /opt/mssql-tools/bin/sqlcmd -S localhost -U "%DB_USER%" -P "%DB_PASSWORD%" -i "%CONTAINER_INIT_SCRIPT_PATH%"
echo "--- Database initialization complete ---"


echo "--- 2. Starting Spring Boot application to create tables ---"
cd /d "%PROJECT_ROOT%\server\pes_be"
echo "--- Packaging Spring Boot application ---"
call mvnw.cmd package -DskipTests
echo "--- Starting Spring Boot application from JAR ---"
start "PES_BE" java -jar "target/pes_be-0.0.1-SNAPSHOT.jar"

echo "--- Waiting for application to start ---"
timeout /t 30 /nobreak


echo "--- 3. Running data script to populate tables ---"
echo "--- Copying %DATA_SCRIPT% to container %CONTAINER_NAME% ---"
docker cp "%HOST_DATA_SCRIPT_PATH%" "%CONTAINER_NAME%:%CONTAINER_DATA_SCRIPT_PATH%"

echo "--- Running data script to populate database %DB_NAME% in container %CONTAINER_NAME% ---"
docker exec "%CONTAINER_NAME%" /opt/mssql-tools/bin/sqlcmd -S localhost -U "%DB_USER%" -P "%DB_PASSWORD%" -d "%DB_NAME%" -i "%CONTAINER_DATA_SCRIPT_PATH%"
echo "--- Data population complete ---"


echo "--- 4. Stopping Spring Boot application ---"
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080" ^| findstr "LISTENING"') do (
    echo "Stopping Spring Boot application (PID: %%a)"
    taskkill /F /PID %%a
    goto :after_kill
)
:after_kill


echo "--- Full database initialization complete ---"