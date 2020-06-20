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
  console.log(`Listening on http://localhost:3306`);
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
          return byManager;
        default:
          return;
      }
    });
};

////// FUNCTIONS \\\\\\
//VIEW ALL EMPLOYEES\\
const allEmployees = () => {
  connection.query("select * from employees", (err, data) => {
    allEmployees.map();
  });
};
