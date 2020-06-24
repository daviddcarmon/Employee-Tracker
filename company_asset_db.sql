DROP DATABASE IF EXISTS company_asset_db;

CREATE DATABASE company_asset_db;

USE company_asset_db;

-- Create a new table called 'department' in schema 'company_asset_db'
-- Drop the table if it already exists
-- IF OBJECT_ID('company_asset_db.department', 'U') IS NOT NULL
-- DROP TABLE company_asset_db.department
-- 
-- Create the table in the specified schema
CREATE TABLE department
(
    departmentId INT NOT NULL AUTO_INCREMENT PRIMARY KEY, -- primary key column,
    department VARCHAR(50) NOT NULL -- NVACHAR can store any Unicode(symblos) data
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
    title VARCHAR(50) NOT NULL, -- NVACHAR can store any Unicode(symblos) data
    salary DECIMAL(10,2) NOT NULL,
    departmentId_FK INT,
    FOREIGN KEY (departmentId_FK) REFERENCES department(departmentId)
);

-- Create a new table called 'employee' in schema 'company_asset_db'
-- Drop the table if it already exists
-- IF OBJECT_ID('company_asset_db.employee', 'U') IS NOT NULL
-- DROP TABLE company_asset_db.employee
-- GO
-- Create the table in the specified schema
CREATE TABLE employees
(
    employeeId INT NOT NULL AUTO_INCREMENT PRIMARY KEY, -- primary key column,
    first_name VARCHAR(50) NOT NULL, -- NVACHAR can store any Unicode(symblos) data
    last_name VARCHAR(50) NOT NULL,
    roleId_FK INT,
    managerId_FK INT,
    FOREIGN KEY (roleId_FK)  REFERENCES role(roleId)
    -- CONSTRAINT FK_roleId FOREIGN KEY (roleId) REFERENCES role(roleId),
    -- FOREIGN KEY (managerId_FK) REFERENCES employees(roleId)
);


select * from employees;
select * from role;
select * from department;

-- ADDING LIST OF DEPARTMENT FOR STARTER CODE AND TESTING
insert into department (department)
value("Accountant"),("Account Manager"),
("Lead Engineer"),("Legal Team Lead"),("Legal Team"),
("Software Engineer"),("Sales Lead"),("Salesperson");

-- ADDING LIST OF EMPLOYEE FOR STARTER CODE AND TESTING
insert into employees 
set first_name = "John", last_name = "Smith", roleId_FK = 1;
insert into employees 
set first_name = "Anon", last_name = "Wayne", roleId_FK = 2, managerId_FK = 1;
insert into employees 
set first_name = "Blake", last_name = "Taylor", roleId_FK = 3;
insert into employees 
set first_name = "Anh", last_name = "Tai", roleId_FK = 4;
insert into employees 
set first_name = "Charlie", last_name = "Thomas", roleId_FK = 5, managerId_FK = 4;
insert into employees 
set first_name = "Jane", last_name = "Mondie", roleId_FK = 6;
insert into employees 
set first_name = "Pete", last_name = "Lee", roleId_FK = 7, managerId_FK = 6;

-- JOINING ALL TABLES THAT CONTAIN VALUES(INNER JOIN)
select * from employees
join department on employees.roleID_FK = department.departmentId
join role on employees.roleId_FK = role.roleID;

select * from employees where 1 = employees.roleId_FK

-- SELECTING EMPLOYEES THAT HAVE A MANAGER
select first_name, last_name from employee where managerId_FK is null;