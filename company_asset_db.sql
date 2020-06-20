DROP DATABASE IF EXISTS company_asset_db;

CREATE DATABASE company_asset_db;

USE company_asset_db;

-- Create a new table called 'employee' in schema 'company_asset_db'
-- Drop the table if it already exists
-- IF OBJECT_ID('company_asset_db.employee', 'U') IS NOT NULL
-- DROP TABLE company_asset_db.employee
-- GO
-- Create the table in the specified schema
CREATE TABLE employee
(
    employeeId INT NOT NULL AUTO_INCREMENT PRIMARY KEY, -- primary key column,
    first_name varchar(50) NOT NULL, -- NVACHAR can store any Unicode(symblos) data
    last_name varchar(50) NOT NULL
);



-- Create a new table called 'role' in schema 'company_asset_db'
-- Drop the table if it already exists
-- IF OBJECT_ID('company_asset_db.role', 'U') IS NOT NULL
-- DROP TABLE company_asset_db.role
-- 
-- Create the table in the specified schema
CREATE TABLE role
(
    roleId INT NOT NULL AUTO_INCREMENT PRIMARY KEY, -- primary key column,
    tile INT NOT NULL, -- NVACHAR can store any Unicode(symblos) data
    salary INT NOT NULL
);


-- Create a new table called 'department' in schema 'company_asset_db'
-- Drop the table if it already exists
-- IF OBJECT_ID('company_asset_db.department', 'U') IS NOT NULL
-- DROP TABLE company_asset_db.department
-- 
-- Create the table in the specified schema
CREATE TABLE department
(
    departmentId INT NOT NULL AUTO_INCREMENT PRIMARY KEY, -- primary key column,
    tile INT NOT NULL, -- NVACHAR can store any Unicode(symblos) data
    salary DECIMAL(10,2) NOT NULL
);
