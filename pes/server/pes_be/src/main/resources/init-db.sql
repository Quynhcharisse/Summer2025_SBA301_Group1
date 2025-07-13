-- This script creates the database if it does not already exist.
-- To use this script, run it against your SQL server before starting the application for the first time.
-- Example using sqlcmd: sqlcmd -S localhost -U sa -P <YourPassword> -i init-db.sql
--
-- The application will automatically create the tables when it starts, as configured in application.properties
-- with `spring.jpa.hibernate.ddl-auto=update`.

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'pes_sba')
BEGIN
    CREATE DATABASE pes_sba;
END;