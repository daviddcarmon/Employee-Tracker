// const inquirer = require("inquirer");
// let Database = require("./async-db");

// const employeeList = new Database({
//     host: "localhost",
//     port: 3306,
//     user: "root",
//     password: "PassWord",
//     database: "company_asset_db"
//   });
  

// async function getManager() {
//     let query = "SELECT * FROM employees WHERE managerId_FK IS NULL";

//     const data = await employeeList.query(query);
//     let employeeNames = [];
//     for(const employee of data) {
//         employeeNames.push(employee.first_name + " " + employee.last_name);
//     }
//     return employeeNames;
// }

// async function getRoles() {
//     let query = "SELECT title FROM role";
//     const data = await employeeList.query(query);

//     let roles = [];
//     for(const row of data) {
//         roles.push(row.title);
//     }

//     return roles;
// }

// async function getDepartmentNames() {
//     let query = "SELECT department FROM department";
//     const data = await employeeList.query(query);
//     let departments = [];
//     for(const row of data) {
//         departments.push(row.name);
//     }
//     return departments;
// }

// async function getDepartmentId(departmentName) {
//     let query = "SELECT * FROM department WHERE department.name=?";
//     let args = [departmentName];
//     const data = await employeeList.query(query, args);
//     return data[0].id;
// }

// async function getRoleId(roleName) {
//     let query = "SELECT * FROM role WHERE role.title=?";
//     let args = [roleName];
//     const data = await employeeList.query(query, args);
//     return data[0].id;
// }

// async function getEmployeeId(fullName) {
//     let employee = getFirstAndLastName(fullName);

//     let query = 'SELECT id FROM employee WHERE employee.first_name=? AND employee.last_name=?';
//     let args=[employee[0], employee[1]];
//     const data = await employeeList.query(query, args);
//     return data[0].id;
// }

// async function getEmployeeNames() {
//     let query = "SELECT * FROM employee";

//     const data = await employeeList.query(query);
//     let employeeNames = [];
//     for(const employee of data) {
//         employeeNames.push(employee.first_name + " " + employee.last_name);
//     }
//     return employeeNames;
// }

// async function viewAllRoles() {
//     console.log("");
//     // SELECT * FROM role;
//     let query = "SELECT * FROM role";
//     const data = await employeeList.query(query);
//     console.table(data);
//     return data;
// }

// async function viewAllDepartments() {
//     // SELECT * from department;

//     let query = "SELECT * FROM department";
//     const data = await employeeList.query(query);
//     console.table(data);
// }

// async function viewAllEmployees() {
//     console.log("");

//     // SELECT * FROM employee;
//     let query = "SELECT * FROM employee";
//     const data = await employeeList.query(query);
//     console.table(data);
// }

// async function viewAllEmployeesByDepartment() {
//     // View all employees by department
//     // SELECT first_name, last_name, department.name FROM ((employee INNER JOIN role ON role_id = role.id) INNER JOIN department ON department_id = department.id);
//     console.log("");
//     let query = "SELECT first_name, last_name, department.name FROM ((employee INNER JOIN role ON role_id = role.id) INNER JOIN department ON department_id = department.id);";
//     const data = await employeeList.query(query);
//     console.table(data);
// }

// // Will return an array with only two elements in it: 
// // [first_name, last_name]
// function getFirstAndLastName( fullName ) {
//     // If a person has a space in their first name, such as "Mary Kay", 
//     // then first_name needs to ignore that first space. 
//     // Surnames generally do not have spaces in them so count the number
//     // of elements in the array after the split and merge all before the last
//     // element.
//     let employee = fullName.split(" ");
//     if(employee.length == 2) {
//         return employee;
//     }

//     const last_name = employee[employee.length-1];
//     let first_name = " ";
//     for(let i=0; i<employee.length-1; i++) {
//         first_name = first_name + employee[i] + " ";
//     }
//     return [first_name.trim(), last_name];
// }

// async function updateEmployeeRole(employeeInfo) {
//     // Given the name of the role, what is the role id?
//     // Given the full name of the employee, what is their first_name and last_name?
//     // UPDATE employee SET role_id=1 WHERE employee.first_name='Mary Kay' AND employee.last_name='Ash';
//     const roleId = await getRoleId(employeeInfo.role);
//     const employee = getFirstAndLastName(employeeInfo.employeeName);

//     let query = 'UPDATE employee SET role_id=? WHERE employee.first_name=? AND employee.last_name=?';
//     let args=[roleId, employee[0], employee[1]];
//     const data = await employeeList.query(query, args);
//     console.log(`Updated employee ${employee[0]} ${employee[1]} with role ${employeeInfo.role}`);
// }

// async function addEmployee(employeeInfo) {
//     let roleId = await getRoleId(employeeInfo.role);
//     let managerId = await getEmployeeId(employeeInfo.manager);

//     // INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ("Bob", "Hope", 8, 5);
//     let query = "INSERT into employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)";
//     let args = [employeeInfo.first_name, employeeInfo.last_name, roleId, managerId];
//     const data = await employeeList.query(query, args);
//     console.log(`Added employee ${employeeInfo.first_name} ${employeeInfo.last_name}.`);
// }

// async function removeEmployee(employeeInfo) {
//     const employeeName = getFirstAndLastName(employeeInfo.employeeName);
//     // DELETE from employee WHERE first_name="Cyrus" AND last_name="Smith";
//     let query = "DELETE from employee WHERE first_name=? AND last_name=?";
//     let args = [employeeName[0], employeeName[1]];
//     const data = await employeeList.query(query, args);
//     console.log(`Employee removed: ${employeeName[0]} ${employeeName[1]}`);
// }

// async function addDepartment(departmentInfo) {
//     const departmentName = departmentInfo.departmentName;
//     let query = 'INSERT into department (name) VALUES (?)';
//     let args = [departmentName];
//     const data = await employeeList.query(query, args);
//     console.log(`Added department named ${departmentName}`);
// }

// async function addRole(roleInfo) {
//     // INSERT into role (title, salary, department_id) VALUES ("Sales Manager", 100000, 1);
//     const departmentId = await getDepartmentId(roleInfo.departmentName);
//     const salary = roleInfo.salary;
//     const title = roleInfo.roleName;
//     let query = 'INSERT into role (title, salary, department_id) VALUES (?,?,?)';
//     let args = [title, salary, departmentId];
//     const data = await employeeList.query(query, args);
//     console.log(`Added role ${title}`);
// }

// /* 
// End of calls to the database
// */

// async function mainPrompt() {
//     return inquirer
//         .prompt([
//             {
//                 type: "list",
//                 message: "What would you like to do?",
//                 name: "action",
//                 choices: [
//                   "Add department",
//                   "Add employee",
//                   "Add role",
//                   "Remove employee",
//                   "Update employee role",
//                   "View all departments",
//                   "View all employees",
//                   "View all employees by department",
//                   "View all roles",
//                   "Exit"
//                 ]
//             }
//         ])
// }

// async function getAddEmployeeInfo() {
//     const managers = await getManager();
//     const roles = await getRoles();
//     return inquirer
//         .prompt([
//             {
//                 type: "input",
//                 name: "first_name",
//                 message: "What is the employee's first name?"
//             },
//             {
//                 type: "input",
//                 name: "last_name",
//                 message: "What is the employee's last name?"
//             },
//             {
//                 type: "list",
//                 message: "What is the employee's role?",
//                 name: "role",
//                 choices: [
//                     // populate from employeeList
//                     ...roles
//                 ]
//             },
//             {
//                 type: "list",
//                 message: "Who is the employee's manager?",
//                 name: "manager",
//                 choices: [
//                     // populate from employeeList
//                     ...managers
//                 ]
//             }
//         ])
// }

// async function getRemoveEmployeeInfo() {
//     const employees = await getEmployeeNames();
//     return inquirer
//     .prompt([
//         {
//             type: "list",
//             message: "Which employee do you want to remove?",
//             name: "employeeName",
//             choices: [
//                 // populate from employeeList
//                 ...employees
//             ]
//         }
//     ])
// }

// async function getDepartmentInfo() {
//     return inquirer
//     .prompt([
//         {
//             type: "input",
//             message: "What is the name of the new department?",
//             name: "departmentName"
//         }
//     ])
// }

// async function getRoleInfo() {
//     const departments = await getDepartmentNames();
//     return inquirer
//     .prompt([
//         {
//             type: "input",
//             message: "What is the title of the new role?",
//             name: "roleName"
//         },
//         {
//             type: "input",
//             message: "What is the salary of the new role?",
//             name: "salary"
//         },
//         {
//             type: "list",
//             message: "Which department uses this role?",
//             name: "departmentName",
//             choices: [
//                 // populate from employeeList
//                 ...departments
//             ]
//         }
//     ])
// }

// async function getUpdateEmployeeRoleInfo() {
//     const employees = await getEmployeeNames();
//     const roles = await getRoles();
//     return inquirer
//         .prompt([
//             {
//                 type: "list",
//                 message: "Which employee do you want to update?",
//                 name: "employeeName",
//                 choices: [
//                     // populate from employeeList
//                     ...employees
//                 ]
//             },
//             {
//                 type: "list",
//                 message: "What is the employee's new role?",
//                 name: "role",
//                 choices: [
//                     // populate from employeeList
//                     ...roles
//                 ]
//             }
//         ])

// }

// async function main() {
//     let exitLoop = false;
//     while(!exitLoop) {
//         const prompt = await mainPrompt();

//         switch(prompt.action) {
//             case 'Add department': {
//                 const newDepartmentName = await getDepartmentInfo();
//                 await addDepartment(newDepartmentName);
//                 break;
//             }

//             case 'Add employee': {
//                 const newEmployee = await getAddEmployeeInfo();
//                 console.log("add an employee");
//                 console.log(newEmployee);
//                 await addEmployee(newEmployee);
//                 break;
//             }

//             case 'Add role': {
//                 const newRole = await getRoleInfo();
//                 console.log("add a role");
//                 await addRole(newRole);
//                 break;
//             }

//             case 'Remove employee': {
//                 const employee = await getRemoveEmployeeInfo();
//                 await removeEmployee(employee);
//                 break;
//             }
            
//             case 'Update employee role': {
//                 const employee = await getUpdateEmployeeRoleInfo();
//                 await updateEmployeeRole(employee);
//                 break;
//             }

//             case 'View all departments': {
//                 await viewAllDepartments();
//                 break;
//             }

//             case 'View all employees': {
//                 await viewAllEmployees();
//                 break;
//             }

//             case 'View all employees by department': {
//                 await viewAllEmployeesByDepartment();
//                 break;
//             }

//             case 'View all roles': {
//                 await viewAllRoles();
//                 break;
//             }

//             case 'Exit': {
//                 exitLoop = true;
//                 process.exit(0); // successful exit
//                 return;
//             }

//             default:
//                 console.log(`Internal warning. Shouldn't get here. action was ${prompt.action}`);
//         }
//     }
// }

// // Close your database connection when Node exits
// process.on("exit", async function(code) {
//     await employeeList.close();
//     return console.log(`About to exit with code ${code}`);
// });

// main();

let one = ["testOne"];
let two = [];
count()
function count() {
    console.log(one+two)
}