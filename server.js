const inquirer = require("inquirer");
const mysql = require("mysql");
const express = require("express");
const Employee = require("../Employee-Registration/lib/Employee");
const util = require("util");
const fs = require("fs");
const writeFileAsync = util.promisify(fs.writeFile);

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
  // queryManager();
});

const start = () => {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View ALL Employees",
          "View ALL Employees by Manager",
          "View ALL Employees by Departments",
          "Add Employee",
          "Remove Employee",
          "Update Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "Exit",
        ],
        name: "action",
      },
    ])
    .then((answer) => {
      switch (answer.action) {
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
///VIEW ALL EMPLOYEES\\\\
/////TESTED WORKING\\\\\\\
const allEmployees = () => {
  connection.query(
    "SELECT employeeid, first_name, last_name FROM employees",
    (err, data) => {
      if (err) throw err;
      // data.send(employees);
      console.table(data);
      start();
    }
  );
};

//VIEW BY DEPARTMENT\\
const byDepartment = () => {
  connection.query(
    "select * from employees where ? = departmentId_FK",
    { name: data.department },
    (err, data) => {
      console.table(data);
    }
  );
};

//VIEW BY MANAGEMENT\\
const byManager = () => {
  connection.query(
    "select * from employees where ? = employees.managerId_FK",
    { name: data.manager },
    (err, data) => {
      console.table(data);
    }
  );
};

///ADD EMPLOYEE\\
//TESTED WORKING\\
//NEED FIX TO ROLE\
const insertEmployee = () => {
  const companyListManager = [];
  let query = "select first_name, last_name, from employee";

  // connection.query(query, (err, names) => {
  //   if (err) throw err;
  //   companyList.concat(data);

  //   console.log(names);
  //   names.map((name) => {
  //     console.log(name.first_name);
  //   });
  // });

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
      // {
      //   type: "list",
      //   message: "What is there role?",
      //   // can you figure our how to use department TABLE for choices
      //   choices: [
      //     "Accountant",
      //     "Account Manager",
      //     "Lead Engineer",
      //     "Legal Team Lead",
      //     "Legal Team",
      //     "Sales Lead",
      //     "Salesperson",
      //     "Software Engineer",
      //   ],
      //   name: "role",
      // },
      // {
      //   message: "Who is the Employee's Manager?",
      //   choices: companyListManager + ["Add Manager"],
      //   validate: addManager,
      // },
    ])
    .then((data) => {
      connection.query(
        "insert into employees set ?",
        {
          first_name: data.first_name,
          last_name: data.last_name,
          // roleId_FK: data.role, /// need to be the array key not the string
        },
        (err, data) => {
          console.log(
            `${data.first_name} ${data.last_name} was added to Employees Table`
          );
        }
      );
    });
};

//REMOVE EMPLOYEE
const dropEmployee = () => {
  let query = "select first_name, last_name, from employee";
  let companyList = [];
  connection.query(query, (err, names) => {
    if (err) throw err;
    // companyList.concat(data);

    console.log(names);
    // Should this be a for(const name of name)
    names.map((name) => {
      console.log(name.first_name);
      let newName = {};
      newName.push(name.first_name, name.last_name);
      companyList.push(newName);
    });
  });

  inquirer
    .prompt([
      {
        message: "What Employee would you like to remove?",
        choices: companyList,
        name: "employee",
      },
    ])
    .then((data) => {
      connection.query(
        "drop ? from employees",
        { employee: data.employee },
        (err, data) => {
          console.log(`${data.employee} was removed from database`);
        }
      );
    });
};

//UPDATE EMPLOYEE
const updateEmployee = () => {
  inquirer
    .prompt([
      {
        message: "What Employee would you like to update?",
        // choices: employeesArray,
        name: "employee",
      },
      {
        message: "What would you like to update on this Employee",
        choices: ["Name", "Department", "Manager", "Salary"],
        name: "action",
        validate: confirmUpdate,
      },
    ])
    .then((data) => {
      connection.query("update employees set ? where ?", [
        {
          first_name: "",
          last_name: "",
          roleId_FK: "",
          managerId_FK: "",
        },
        { employeeId: data.employee },
      ]);
    });
};

//// WRITE UPDATE FUNCTIONS \\\\\
// updateName();
// updateManager();
// updateDepartment();
// updateSalary();

// addManager() - line 146
const addManager = async (role) => {
  if (role === "Add Manager") {
    insertEmployee();
  }
};

//// QUERY FOR USER LIST \\\\
const companyList = [];
const companyListManager = [];
const employeesArray = [...companyList];
const managersArray = [...companyListManager];

// map
let queryManager = () => {
  createConnection.query(query, (err, data) => {
    if (err) throw err;
    // companyList.concat(data);
    console.log(`Connected`);
    names.map((name) => {
      console.log(name.first_name);
    });
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

const confirmUpdate = async (data) => {
  if (data.action === "Name") {
    updateName();
  }
  if (data.action === "Department") {
    updateDepartment();
  }
  if (data.action === "Manager") {
    updateManager();
  }
  if (data.action === "Salary") {
    updateSalary();
  }
};
