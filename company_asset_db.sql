DROP DATABASE IF EXISTS company_asset_db;

CREATE DATABASE company_asset_db;

USE company_asset_db;

-- Create a new table called 'employee' in schema 'company_asset_db'
-- Drop the table if it already exists
-- IF OBJECT_ID('company_asset_db.employee', 'U') IS NOT NULL
-- DROP TABLE company_asset_db.employee
-- GO
-- Create the table in the specified schema
CREATE TABLE employees
(
    employeeId INT NOT NULL AUTO_INCREMENT PRIMARY KEY, -- primary key column,
    first_name varchar(50) NOT NULL, -- NVACHAR can store any Unicode(symblos) data
    last_name varchar(50) NOT NULL
    role.roleId INT FOREIGN KEY
    manager.roleId INT FOREIGN KEY
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
    title INT NOT NULL, -- NVACHAR can store any Unicode(symblos) data
    salary DECIMAL(10,2) NOT NULL
    department.departmentId INT FOREIGN KEY
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
    department VARCHAR(50) NOT NULL, -- NVACHAR can store any Unicode(symblos) data
);


select * from employees;
select * from role;
select * from department;

insert into department (department)
value("Sales Lead"),("Salesperson"),("Lead Engineer"),
("Software Engineer"),("Account Manager"),("Accountant"),
("Legal Team Lead"),("Legal Team");

insert into employees 
set first_name = "david", last_name = "carmona";
