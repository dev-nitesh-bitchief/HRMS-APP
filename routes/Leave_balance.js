var express = require('express');
var router = express.Router();

var db = require('../connection/db');

var logActivity = require('./log_function');

const { LocalStorage } = require('node-localstorage');

// Create a new instance of LocalStorage
const localStorage = new LocalStorage('./scratch');

// Retrieve the variable from localStorage
const storedVariable = localStorage.getItem('username');



// Define a function to fetch the Employee_id by username
function getEmployeeAndUserIdByUsername(username, callback) {
    db.query('SELECT Employee_id , id FROM User WHERE username = ?', username, (err, result) => {
        if (err) {
            console.error('Error Fetching data:', err);
            callback(err, null);
            return;
        }
        console.log('Data fetched successfully');
        if (result.length > 0) {
            const employeeId = result[0].Employee_id;
            const userId = result[0].id;
            callback(null, employeeId, userId);
        } else {
            callback(null, null, null); // No matching user found
        }
    });
}



getEmployeeAndUserIdByUsername(storedVariable, (err, employeeId, userId) => {
    if (err) {
        // Handle error
        console.error(err);
        return;
    }
    // Now you can use the employeeId  and userIdvariable in any route
    console.log('Employee ID:', employeeId);
    console.log('User ID:', userId);




    router.get('/', (req, res) => {

        const sql = `SELECT 
        lb.id AS Leave_balance_id,
        e.id AS employee_id,
        CONCAT(e.firstName, ' ', e.lastName) AS employeeName,
        lb.Leave_type_id,
        lt.typeName AS Leave_type_name,
        m.monthName AS Month_name,
        lb.totalLeaves,
        lb.leavesTaken,
        lb.expiryDate,
        lb.date
    FROM 
        Leave_balance AS lb
    LEFT JOIN 
        Leave_type AS lt ON lb.Leave_type_id = lt.id
    LEFT JOIN 
        Month AS m ON lb.Month_id = m.id
    INNER JOIN 
        Employee AS e ON lb.employee_id = e.id
        WHERE lb.Employee_id = ?`;


        db.query(sql, employeeId, (err, result) => {
            if (err) {
                console.error('Error searching data:', err);
                res.status(500).json('Error searching  data');
                return;
            }


            result.forEach(row => {
                row.expiryDate = formatDate(row.expiryDate);
            });


            // res.status(200).json(result);

            var IP_address = localStorage.getItem('IP_address');
            var Location = localStorage.getItem('Location');
            var Browser_details = localStorage.getItem('Browser_details');




            logActivity(req, res, {
                User_id: userId,
                activityType: "Management access",
                resourceName: "My leaves",
                operation: "show",
                databaseTableName: "Leave_balance",
                ipAddress: IP_address,
                location: Location,
                browserDetails: Browser_details
            });
            res.render('LeaveBalance', { data: result });
            return;

        })
    });




    router.get('/show', (req, res) => {

        var IP_address = localStorage.getItem('IP_address');
        var Location = localStorage.getItem('Location');
        var Browser_details = localStorage.getItem('Browser_details');




        logActivity(req, res, {
            User_id: userId,
            activityType: "Management access",
            resourceName: "Leave balance",
            operation: "show",
            databaseTableName: "Leave_balance",
            ipAddress: IP_address,
            location: Location,
            browserDetails: Browser_details
        });


        res.render('LeaveBalance_admin');

        return;


    });



    router.post('/add', (req, res) => {
        const { department_id, Employee_id, Leave_type_id, Month_id, expiryDate ,  totalLeaves } = req.body;

        console.log('department id :', department_id);
        console.log('employee id :', Employee_id);

        var IP_address = localStorage.getItem('IP_address');
        var Location = localStorage.getItem('Location');
        var Browser_details = localStorage.getItem('Browser_details');

        if (department_id !== '') {

            // Fetch Employee_ids for the given department_id

            const sqlFetchEmployees = 'SELECT id AS Employee_id FROM Employee WHERE Department_id = ?';
            db.query(sqlFetchEmployees, department_id, (err, employees) => {
                if (err) {
                    console.error('Error fetching employees:', err);
                    res.status(500).json('Error fetching employees');
                    return;
                }

                if (employees.length === 0) {
                    res.status(404).json('No employees found for the given department_id');
                    return;
                }

                // Prepare and execute the insertion query for each Employee_id
                const sqlInsertLeaveBalance = 'INSERT INTO Leave_balance (Employee_id, Leave_type_id, Month_id, totalLeaves , expiryDate , leavesTaken) VALUES (?, ?, ?, ?, ?, ?)';
                let insertionsCompleted = 0;
                employees.forEach(employee => {
                    const { Employee_id } = employee;
                    const data = [Employee_id, Leave_type_id, Month_id, totalLeaves, expiryDate ,0];
                    db.query(sqlInsertLeaveBalance, data, (err, result) => {
                        if (err) {
                            console.error('Error inserting data for Employee_id:', Employee_id, err);
                            res.status(500).json('Error inserting data for some employees');
                            return;
                        }
                        console.log(`Data inserted successfully for Employee_id: ${Employee_id}`);
                        insertionsCompleted++;
                        if (insertionsCompleted === employees.length) {
                            console.log('All data inserted successfully');




                            var newdata = data.join(',');


                            logActivity(req, res, {
                                User_id: userId,
                                activityType: "Management access",
                                resourceName: "Leave balance",
                                operation: "Add",
                                databaseTableName: "Leave_balance",
                                enteredValues: newdata,
                                ipAddress: IP_address,
                                location: Location,
                                browserDetails: Browser_details
                            });

                            res.redirect('/LeaveBalance/show');
                        }
                    });
                });
            });
        }
        else {
            const sql = 'INSERT INTO Leave_balance ( Employee_id , Leave_type_id , Month_id  , totalLeaves , expiryDate , leavesTaken ) VALUES (?,?,?,?,?,?)';

            var data = [Employee_id, Leave_type_id, Month_id, totalLeaves , expiryDate , 0];


            db.query(sql, data, (err, result) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    res.status(500).json('Error inserting data');
                    return;
                }
                console.log('Data inserted successfully for particular employee');
                // res.status(200).json('Data inserted successfully');

                var newdata = data.join(',');


                logActivity(req, res, {
                    User_id: userId,
                    activityType: "Management access",
                    resourceName: "Leave balance",
                    operation: "Add",
                    databaseTableName: "Leave_balance",
                    enteredValues: newdata,
                    ipAddress: IP_address,
                    location: Location,
                    browserDetails: Browser_details
                });

                res.redirect('/LeaveBalance/show');
                return;
            });

        }
    });


    router.post('/search', (req, res) => {
        const { Employee_id } = req.body;


        const sql = `SELECT 
        lb.id AS balance_id,
        e.id AS employee_id,
        CONCAT(e.firstName, ' ', e.lastName) AS employeeName,
        lb.Leave_type_id,
        lt.typeName AS Leave_type_name,
        m.monthName AS Month_name,
        lb.totalLeaves,
        lb.leavesTaken,
        lb.expiryDate,
        lb.date
    FROM 
        Leave_balance AS lb
    LEFT JOIN 
        Leave_type AS lt ON lb.Leave_type_id = lt.id
    LEFT JOIN 
        Month AS m ON lb.Month_id = m.id
    INNER JOIN 
        Employee AS e ON lb.employee_id = e.id
        WHERE lb.Employee_id = ?`;


        db.query(sql, Employee_id, (err, result) => {
            if (err) {
                console.error('Error searching data:', err);
                res.status(500).json('Error searching  data');
                return;
            }
            // console.log('Data searched successfully');
            // res.status(200).json(result);

            result.forEach(row => {
                row.expiryDate = formatDate(row.expiryDate);
            });


            var IP_address = localStorage.getItem('IP_address');
            var Location = localStorage.getItem('Location');
            var Browser_details = localStorage.getItem('Browser_details');




            logActivity(req, res, {
                User_id: userId,
                activityType: "Management access",
                resourceName: "Leave balance",
                operation: "search",
                databaseTableName: "Leave_balance",
                enteredValues:Employee_id,
                ipAddress: IP_address,
                location: Location,
                browserDetails: Browser_details
            });

            res.render('LeaveBalance_admin', { data: result });
            return;

        })
    });



    router.post('/delete', (req, res) => {

        const { balance_Id } = req.body;
        const sql = 'DELETE FROM Leave_balance WHERE id = ?';

        db.query(sql, balance_Id, (err, result) => {
            if (err) {
                console.error('Error deleting data:', err);
                res.status(500).json('Error deleted data');
                return;
            }
            console.log('Data deleted successfully');
            // res.status(200).json('Data deleted successfully');

            var IP_address = localStorage.getItem('IP_address');
            var Location = localStorage.getItem('Location');
            var Browser_details = localStorage.getItem('Browser_details');
    
    
            logActivity(req, res, {
                User_id: userId,
                activityType: "Management access",
                resourceName: "Leave balance",
                operation: "Delete",
                databaseTableName: "Leave_balance",
                enteredValues: balance_Id,
                ipAddress: IP_address,
                location: Location,
                browserDetails: Browser_details
            });

            res.redirect('/LeaveBalance/show');
            return;

        })
    });


    router.post('/edit', (req, res) => {

        const { id_, totalLeaves, leavesTaken } = req.body;


        // Construct the SQL UPDATE query dynamically based on the provided columns
        let sql = 'UPDATE Leave_balance SET ';
        const updateValues = [];
        if (totalLeaves !== '') {
            sql += ' totalLeaves = ?, ';
            updateValues.push(totalLeaves);
        }
        if (leavesTaken !== '') {
            sql += 'leavesTaken  = ?, ';
            updateValues.push(leavesTaken);
        }


        // Remove the trailing comma and space
        sql = sql.slice(0, -2);
        sql += ' WHERE id = ?';

        // Add the id value to the updateValues array
        updateValues.push(id_);

        db.query(sql, updateValues, (err, result) => {
            if (err) {
                console.error('Error in updating :', err);
                res.status(500).json('Internal Server Error');
                return;
            }
            console.log('leave balance updated successfully');
            // res.status(200).json('leave balance updated successfully');

            var IP_address = localStorage.getItem('IP_address');
            var Location = localStorage.getItem('Location');
            var Browser_details = localStorage.getItem('Browser_details');
    
           const values = updateValues.join(',');
    
    
            logActivity(req, res, {
                User_id: userId,
                activityType: "Management access",
                resourceName: "Leave balance",
                operation: "Edit",
                databaseTableName: "Leave_balance",
                enteredValues: values,
                ipAddress: IP_address,
                location: Location,
                browserDetails: Browser_details
            });

            res.redirect('/LeaveBalance/show');
            return;

        });


    });

});


//Dropdown options for employee in add leave balance ( admin )
router.get('/employee', (req, res) => {

    const sql = "SELECT id , CONCAT(firstName, ' ', lastName) AS fullName FROM Employee";

    db.query(sql, (error, results, fields) => {
        if (error) {
            console.error('Error retrieving data from database: ' + error.stack);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});


//Dropdown options for month in add leave balance ( admin )
router.get('/month', (req, res) => {

    const sql = "SELECT id , monthName FROM Month";

    db.query(sql, (error, results, fields) => {
        if (error) {
            console.error('Error retrieving data from database: ' + error.stack);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});


//Dropdown options for month in add leave balance ( admin )
router.get('/year', (req, res) => {

    const sql = "SELECT id , year FROM Year";

    db.query(sql, (error, results, fields) => {
        if (error) {
            console.error('Error retrieving data from database: ' + error.stack);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});


//Dropdown options for department in add leave balance ( admin )
router.get('/department', (req, res) => {

    const sql = "SELECT id , departmentName FROM Department";

    db.query(sql, (error, results, fields) => {
        if (error) {
            console.error('Error retrieving data from database: ' + error.stack);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.json(results);
    });
});


// Function to format date string in YYYY-MM-DD format
function formatDate(dateString) {
    if (!dateString) {
        return ''; // Return empty string if dateString is null or undefined
    }

    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}


module.exports = router;