const inquirer = require("inquirer");
const mysql = require("mysql");
const express = require("express");
const util = require("util");
const fs = require("fs");
const { resolveAny } = require("dns");
const { allowedNodeEnvironmentFlags } = require("process");
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
          // "Update Employee Role",
          // "Update Employee Manager",
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
    "select first_name as First, last_name as Last, department, title, salary from employees join role on employees.roleID_FK = role.roleId left join department on role.departmentId_FK = department.departmentID",
    (err, data) => {
      if (err) {
        console.log(`Function allEmployees Not Working!!! Contact programmer`);
      }
      // data.send(employees);
      console.table(data);
      start();
    }
  );
};

///VIEW BY DEPARTMENT\\\\
/////TESTED WORKING\\\\\\\
const byDepartment = () => {
  connection.query(
    "select departmentId, department from department",
    (err, data) => {
      if (err) {
        console.log(`Function byDepartment Not Working!!! Contact programmer`);
      }
      let departmentArray = data.map((department) => {
        return `${department.departmentId} ${department.department}`;
      });
      inquirer
        .prompt([
          {
            message: "What Department do you want to view?",
            type: "list",
            choices: departmentArray,
            name: "department",
          },
        ])
        .then((data) => {
          let departmentId = data.department.split(" ");
          connection.query(
            "select first_name as First, last_name as Last, department, title from employees join role on employees.roleID_FK = role.roleId left join department on role.departmentId_FK = department.departmentID where department.departmentId = ?;",
            [departmentId[0]],
            (err, data) => {
              {
                console.log(
                  `Function byDepartment Not Working!!! Contact programmer`
                );
              }
              console.table(data);
              start();
            }
          );
        });
    }
  );
};

////VIEW BY MANAGEMENT\\\
///// TESTED WORKING \\\\\
const byManager = () => {
  connection.query(
    "select * from employees where managerId_FK is null",
    (err, data) => {
      let managersArray = data.map((name) => {
        return `${name.employeeId} ${name.first_name} ${name.last_name}`;
      });
      if (err) {
        console.log(`Function byManager Not Working! Contact programmer.`);
      }
      // console.table(data);
      // console.log(managersArray);
      inquirer
        .prompt([
          {
            type: "list",
            message: "Which Manager would you like view all employees?",
            choices: managersArray,
            name: "manager",
          },
        ])
        .then((data) => {
          let managerId = data.manager.split(" ");
          connection.query(
            "select first_name as First, last_name as Last, department, title from employees join role on employees.roleID_FK = role.roleId left join department on role.departmentId_FK = department.departmentID where managerId_FK = ?;",
            [managerId[0]],
            (err, data) => {
              if (err) {
                console.log(
                  `Funtion byManager Not Working!!!! Contact programmer.`
                );
              }
              console.table(data);
              start();
            }
          );
        });
    }
  );
};

////// ADD EMPLOYEE \\\\\
///// TESTED WORKING \\\\\
/// NEED FIX TO MANAGER \\\
const insertEmployee = () => {
  connection.query("select roleId, title from role;", (err, data) => {
    let roleArray = data.map((name) => {
      // console.log(`${name.roleId} ${name.title}`);
      return `${name.roleId} ${name.title}`;
    });
    // console.log(data);

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
            roleId_FK: parseInt(role[0]), /// need to be the array key not the string roleId_FK: data.role,
          },
          (err, data) => {
            if (err) {
              console.log(`Function Not Working! FIX!!!!!`);
            }
            console.log(
              `${data.first_name} ${data.last_name} was added to Employees Table`
            );
          }
        );
        start();
      });
  });
};

// REMOVE EMPLOYEE \\\\
/// TESTED WORKING \\\\\
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
            if (err) {
              console.log(`Function Not Working! FIX!!!!!`);
            }
            console.log(`${dropId[1]} ${dropId[2]} was removed from database`);
          }
        );
        // console.log(parseInt(dropId[0]));
        start();
      });
  });
};

//UPDATE EMPLOYEE\\
/////TESTED WORKING updateManager(),\\\\\
///// NEED FIX \\\\\
const updateEmployee = () => {
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
        // console.log(data);
        switch (data.action) {
          case "Name":
            return updateName(updateEmp[0]);
          case "Department":
            return updateDepartment(updateEmp[0]);
          case "Manager":
            return updateManager(updateEmp[0]);
          case "Salary":
            return updateSalary(updateEmp[0]);
        }
      });
    // console.log(newArray);
  });
};

///// TESTED WORKING \\\\\
//// EMPLOYEE ID \\\\
const updateName = (employeeId) => {
  // console.log(employeeId);
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
      connection.query(
        "update employees set ? where employeeId = ?",
        [{ first_name: data.firstName, last_name: data.lastName }, employeeId],
        (err) => {
          if (err) {
          }
        }
      );
    });
};

///// TESTED WORKING \\\\\
const updateDepartment = (employeeId) => {
  connection.query("select department from department", (err, data) => {
    if (err) {
      console.log(
        `Function updateDepartment Not Working!!! Contact programmer.`
      );
    }
    let departmentArray = data.map((department) => {
      return department.department;
    });
    inquirer
      .prompt([
        {
          type: "list",
          message: "What department does this employee belong to?",
          choices: departmentArray,
          name: "department",
        },
      ])
      .then((data) => {
        connection.query(
          "update department join role on department.departmentId = role.departmentId_FK join employees on role.roleId = employees.roleId_FK set department = ? where employees.employeeId = ?;",
          [data.department, employeeId],
          (err) => {
            if (err) {
              console.log(
                `Function updateDepartment Not Working!!! Contact programmer.`
              );
            }
          }
        );
      });
  });
};

///// TESTED WORKING \\\\\
const updateManager = (employeeId) => {
  // console.log(employeeId);
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
        // console.log(data);
        if (data.manager === "Add Manager") {
          insertEmployee();
        }
        let managerId = data.manager.split(" ");
        connection.query(
          "update employees set managerId_FK = ? where employeeId = ?",
          [managerId[0], employeeId],
          (err, data) => {
            //   if (err) {
            //     console.log(`note getting to if statement`);
            //   }
          }
        );
        start();
      });
  });
};

///// TESTED WORKING \\\\\
const updateSalary = (employeeId) => {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What this this Employees new Salary?",
        name: "salary",
      },
    ])
    .then((data) => {
      connection.query(
        "update role join employees on role.roleId = employees.roleId_FK set role.salary = ?  where employees.employeeId = ?;",
        [data.salary, employeeId]
      );
    });
};

//// WRITE UPDATE FUNCTIONS \\\\\
// addRole()
// addDepartment()

// addManager() - line 155
const addManager = async (role) => {
  if (role === "Add Manager") {
    insertEmployee();
  }
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
