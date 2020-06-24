const inquirer = require("inquirer");
const mysql = require("mysql");
const express = require("express");
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
      start();
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
  connection.query("select roleId, title from role;", (err, data) => {
    let roleArray = data.map((name) => {
      return `${name.roleId} ${name.title}`;
    });

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
          // can you figure our how to use department TABLE for choices
          choices: roleArray,
          name: "role",
        },
        // {
        //   message: "Who is the Employee's Manager?",
        //   choices: companyListManager,
        //   validate: addManager,
        // },
      ])
      .then((data) => {
        let role = data.role.split(" ");
        connection.query(
          "insert into employees set ?",
          {
            first_name: data.first_name,
            last_name: data.last_name,
            roleId_FK: parseInt(role), /// need to be the array key not the string roleId_FK: data.role,
          },
          (err, data) => {
            console.log(
              `${data.first_name} ${data.last_name} was added to Employees Table`
            );
          }
        );
        start();
      });
  });
};

////// REMOVE EMPLOYEE \\\\\\
const dropEmployee = () => {
  connection.query("select * from employees", (err, names) => {
    let employeesArray = names.map((name) => {
      return `${name.employeeId} ${name.first_name} ${name.last_name}`;
    });
    inquirer
      .prompt([
        {
          type: "list",
          message: "What Employee would you like to remove?",
          choices: employeesArray,
          name: "employee",
        },
      ])
      .then((data) => {
        let dropId = data.employee.split(" ");
        connection.query(
          "delete from employees where ?",
          {
            employeeId: parseInt(dropId[0]),
          },
          (err, data) => {
            console.log(`${dropId[1]} ${dropId[2]} was removed from database`);
          }
        );
        // console.log(parseInt(dropId[0]));
        start();
      });
  });
};

//UPDATE EMPLOYEE\\
///// NEED FIX \\\\\
const updateEmployee = (userid) => {
  connection.query("select * from employees", (err, names) => {
    let employeesArray = names.map((name) => {
      return `${name.employeeId} ${name.first_name} ${name.last_name}`;
    });
    inquirer
      .prompt([
        {
          type: "list",
          message: "What Employee would you like to update?",
          choices: employeesArray,
          name: "employee",
        },
        {
          type: "list",
          message: "What would you like to update on this Employee",
          choices: ["Name", "Department", "Manager", "Salary"],
          name: "action",
          validate: confirmUpdate,
        },
      ])
      .then((data) => {
        let updateEmp = data.employee.split(" ");
        console.log(data);
        switch (data.action) {
          case "Name":
            return updateName();
          case "Department":
            return updateDepartment();
          case "Manager":
            return updateManager(updateEmp[0]);
          case "Salary":
            return updateSalary();
        }
      });
    // console.log(newArray);
  });
};

///// NEED FIX \\\\\
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
        { employeeId: data.employee.split(" ") },
      ]);
    });
};

///// NEED FIX \\\\\
//LOSE EMPLOYEE ID\\\
const updateManager = (userid) => {
  console.log(userid)
  connection.query("select * from employees", (err, names) => {
    
    let managersArray = names.map((name) => {
      return `${name.employeeId} ${name.first_name} ${name.last_name}`;
    });
    let newManager = [...managersArray, "Add Manager"];
    inquirer
      .prompt([
        {
          message: "Who is the Employee's new Manager?",
          type: "list",
          choices: newManager,
          name: "manager",
        },
      ])
      .then((data) => {
        console.log(data);
        let managerId = data.manager.split(" ");
        if (data.manager === "Add Manager") {
          insertEmployee();
        }
        // connection.query("update employee set ? where ? ",{managerId_FK: managerId[0], employeeId: updateEmp[0]})
        console.log(managerId[0]);

        // console.log(updateEmp[0]);
      });
  });
};

//// WRITE UPDATE FUNCTIONS \\\\\
//LOSE EMPLOYEE ID\\\
// updateDepartment();
// updateSalary();

// addManager() - line 155
const addManager = async (role) => {
  if (role === "Add Manager") {
    insertEmployee();
  }
};

connection.query("select * from employees", (err, names) => {
  let newEmployees = names.map((name) => {
    return name.first_name + " " + name.last_name;
  });
  console.log(newEmployees);
});

//// MANAGER QUERY \\\\
//let query = "select first_name, last_name from employee where managerId_FK is null;";

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
