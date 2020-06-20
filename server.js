const inquirer = require("inquirer");
const mysql = require("mysql");
const express = require("express");
const Employee = require("../Employee-Registration/lib/Employee");

const connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "PassWord",
  database: "company_asset_db",
});

connection.connect((err) => {
  if (err) throw err;
  // console.log(`Listening on http://localhost:3306`);
  start();
});

const start = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View ALL Employees",
          "View ALL Employees by Departments",
          "View ALL Employees by Manager",
          "Add Employee",
          "Exit",
        ],
        name: "action",
      },
    ])
    .then((answer) => {
      switch (answer) {
        case "View ALL Employees":
          return allEmployees();
        case "View ALL Employees by Departments":
          return byDepartment();
        case "View ALL Employees by Manager":
          return byManager();
        case "Add Employee":
          return insertEmployee();
        case "Remove Employee":
          return dropEmployee();
        case "Update Employee":
          return updateEmployee();
        case "Update Employee Role":
          return updateRole();
        case "Update Employee Manager":
          return updateManager();
        default:
          return connection.end();
      }
    });
};

////// FUNCTIONS \\\\\\
//VIEW ALL EMPLOYEES\\
const allEmployees = () => {
  connection.query("select * from employees", (err, data) => {
    // data.send(employees);
    console.table(data);
  });
};

//VIEW BY DEPARTMENT\\
const byDepartment = () => {
  connection.query(
    "select * from employees where ?",
    { name: data.department },
    (err, data) => {
      console.table(data);
    }
  );
};

//VIEW BY MANAGEMENT\\
const byManager = () => {
  connection.query(
    "select * from employees where ?",
    { name: data.manager },
    (err, data) => {
      console.table(data);
    }
  );
};

//ADD EMPLOYEE
const insertEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What's the Employees first name?",
        name: "first_name",
        validate: confirmEmpty,
      },
      {
        type: "input",
        message: "What's the Employees last name?",
        name: "last_name",
        validate: confirmEmpty,
      },
      {
        type: "list",
        message: "What is there role?",
        choices: [
          "Sales Lead",
          "Salesperson",
          "Lead Engineer",
          "Software Engineer",
          "Account Manager",
          "Accountant",
          "Legal Team Lead",
          "Legal Team",
        ],
        name: "role",
      },
    ])
    .then(() => {
      connection.query(
        "insert into employees set ?",
        {
          first_name: data.first_name,
          last_name: data.last_name,
          role: data.role,
        },
        (err, data) => {
          console.log(
            `${data.first_name} ${data.last_name} was added to Employees Table`
          );
        }
      );
    });
};

/// VALIDATION \\\
const confirmNumber = async (input) => {
  input = parseInt(input);
  if (isNaN(input) || input < 0) {
    return `Expected parameter to be a number greater than zero`;
  } else {
    return true;
  }
};

const confirmEmpty = async (input) => {
  if (input === "") {
    return `Parameter cannot be empty`;
  } else {
    return true;
  }
};
