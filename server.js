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
      //   choices: companyListManager,
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
      start();
    });
};

//REMOVE EMPLOYEE
const dropEmployee = () => {
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
  // connection.query("select * from employees", (err, names) => {
  //   let newArray = names.map((name) => {
  //     return name.first_name + " " + name.last_name;
  //   });
  //   console.log(newArray);
  // });
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
      switch (data.action) {
        case "Name":
          return updateName();
        case "Department":
          return updateDepartment();
        case "Manager":
          return updateManager();
        case "Salary":
          return updateSalary();
      }
    });
};

const updateName = () => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is this employees new First Name?",
        name: "firstName",
      },
      {
        type: "input",
        message: "What is this employees new Last Name?",
        name: "lastName",
      },
    ])
    .then((data) => {
      connection.query("update employees set ? where employeeId = ?", [
        { first_name: data.firstName, last_name: data.lastName },
        { employeeId: data.employeeId },
      ]);
    });
};

const updateManager = () => {
  inquirer
    .prompt([
      {
        message: "Who is the Employee's new Manager?",
        type: "list",
        choices: managersArray,
        name: "action",
      },
    ])
    .then((data) => {
      if (data.action === "Add Manager") {
        insertEmployee();
      }
    });
};

//// WRITE UPDATE FUNCTIONS \\\\\
// updateManager();
// updateDepartment();
// updateSalary();

// addManager() - line 155
const addManager = async (role) => {
  if (role === "Add Manager") {
    insertEmployee();
  }
};

// connection.query("update employees set ? where ?", [
//   {
//     first_name: "",
//     last_name: "",
//     roleId_FK: "",
//     managerId_FK: "",
//   },
//   { employeeId: data.employee },
// ]);

//// QUERY FOR USER LIST \\\\
// const companyList = [];
// const companyListManager = [...queryManager, "Add Manager"];
// const employeesArray = [...companyList];
// const managersArray = [...companyListManager];

connection.query("select * from employees", (err, names) => {
  let newEmployees = names.map((name) => {
    return name.first_name + " " + name.last_name;
  });
  console.log(newEmployees);
});

//// MANAGER QUERY \\\\
let managerQuery = []
let query = "select first_name, last_name from employee where managerId_FK is null;";

// connection.query("select first_name, last_name from employee where managerId_FK is null;", (err, names) => {
//   if (err) throw err;
//   let newManager = names.map((name) => {
//     return name.first_name + " " + name.last_name;
//   });
//   console.log(newManager);
// });

// map or filer if managerId_FK is NULL
// let queryManager = () => {
//   let query =
//     "select first_name, last_name from employee where managerId_FK is null;";
//   createConnection.query(query, (err, data) => {
//     if (err) throw err;
//     companyList.concat(data);
//     console.log(data);
//     console.log(`Connected`);
//     names.map((name) => {
//       console.log(name.first_name);
//     });
//   });
// };

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
