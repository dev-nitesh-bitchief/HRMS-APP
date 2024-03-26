
var express = require('express');
var db = require('../connection/db');
var logActivity = require('./log_function');



var router = express.Router();
// const authenticateUser = require('./index');

// Import the LocalStorage class from the node-localstorage package
const { LocalStorage } = require('node-localstorage');

// Create a new instance of LocalStorage
const localStorage = new LocalStorage('./scratch');

// Retrieve the variable from localStorage
var storedVariable = localStorage.getItem('username');






router.post('/save-data', (req, res) => {
    const { ipAddress, location, browserDetails } = req.body;

    // Use the received data as needed
    const fullLocation = location.latitude + ',' + location.longitude;


    localStorage.setItem('IP_address', ipAddress);
    localStorage.setItem('Location', fullLocation);
    localStorage.setItem('Browser_details', browserDetails);

    // Optionally, you can store the data in a database or perform other operations here

    res.sendStatus(200); // Send a response back to the client
});




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






    //************************************************************************************************** */







    router.get('/show', (req, res) => {

        const sql = `SELECT 
                   lr.id AS req_id ,
                   CONCAT(e.firstName, ' ', e.lastName) AS employeeName,
                   lt.typeName AS Leave_type_name,
                   m.monthName AS Month_name,
                   lr.startDate,
                   lr.endDate,
                   lr.days,
                   lr.appliedOn,
                   lr.reason,
                   lr.approvedBy,
                   lr.status,
                   lr.approveDate
                  FROM 
                 Leave_request AS lr
             LEFT JOIN 
                 Leave_type AS lt ON lr.Leave_type_id = lt.id
             LEFT JOIN 
                 Month AS m ON lr.Month_id = m.id
             LEFT JOIN 
                 Employee AS e ON lr.Employee_id = e.id
             WHERE   lr.Employee_id = ?`;

        value = [employeeId];
        db.query(sql, value, (err, result) => {
            if (err) {
                console.error('Error Fetching data:', err);
                res.status(500).json('Error Fetching data');
                return;
            }
            result.forEach(row => {
                row.startDate = formatDate(row.startDate);
                row.endDate = formatDate(row.endDate);
                row.appliedOn = formatDateTime(row.appliedOn);
                row.approveDate = formatDateTime(row.approveDate);
            });
            // res.status(200).json(result);

            var IP_address = localStorage.getItem('IP_address');
            var Location = localStorage.getItem('Location');
            var Browser_details = localStorage.getItem('Browser_details');
            logActivity(req, res, {
                User_id: userId,
                activityType: "Management access",
                resourceName: "Apply leave",
                operation: "show",
                databaseTableName: "Leave_request",
                ipAddress: IP_address,
                location: Location,
                browserDetails: Browser_details
            });

            res.render('ApplyLeave', { data: result });
            return;

        });

    });



    router.get('/showApplication', (req, res) => {

        const sql = `SELECT 
    lr.id AS req_id ,
    CONCAT(e.firstName, ' ', e.lastName) AS employeeName,
    lt.typeName AS Leave_type_name,
    m.monthName AS Month_name,
    lr.startDate,
    lr.endDate,
    lr.days,
    lr.reason,
    lr.appliedOn,
    lr.status,
    lr.approveDate
    
FROM 
    Leave_request AS lr
LEFT JOIN 
    Leave_type AS lt ON lr.Leave_type_id = lt.id
LEFT JOIN 
    Month AS m ON lr.Month_id = m.id
LEFT JOIN 
    Employee AS e ON lr.Employee_id = e.id`;

        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error Fetching data:', err);
                res.status(500).json('Error Fetching data');
                return;
            }
            // console.log('Data fetched successfully');
            result.forEach(row => {
                row.startDate = formatDate(row.startDate);
                row.endDate = formatDate(row.endDate);
                row.appliedOn = formatDateTime(row.appliedOn);
                row.approveDate = formatDateTime(row.approveDate);

            });

            // res.status(200).json(result);

            var IP_address = localStorage.getItem('IP_address');
            var Location = localStorage.getItem('Location');
            var Browser_details = localStorage.getItem('Browser_details');

            logActivity(req, res, {
                User_id: userId,
                activityType: "Management access",
                resourceName: "Leave applications",
                operation: "show",
                databaseTableName: "Leave_request",
                ipAddress: IP_address,
                location: Location,
                browserDetails: Browser_details
            });

            console.log('date :', result);

            res.render('LeaveApplication', { data: result });
            return;

        });

    });






    router.post('/add', (req, res) => {


        const { Leave_type_id, Month_id, startDate, endDate, reason } = req.body;

        start = startDate;
        end = endDate;
        var days = calculateNumberOfDays(start, end);


        const sql = `INSERT INTO Leave_request 
            (Employee_id, Leave_type_id, Month_id, startDate, endDate, days, reason) 
            VALUES (?, ?, ?, ?, ?, ?, ? )`;

        var data = [employeeId, Leave_type_id, Month_id, startDate, endDate, days, reason];
        var newdata = data.join(',');


        db.query(sql, data, (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                res.status(500).json('Error inserting data');
                return;
            }

            // res.status(200).json('Data inserted successfully');

            var IP_address = localStorage.getItem('IP_address');
            var Location = localStorage.getItem('Location');
            var Browser_details = localStorage.getItem('Browser_details');


            logActivity(req, res, {
                User_id: userId,
                activityType: "management access",
                resourceName: "Leave",
                operation: "add request ",
                databaseTableName: "Leave_request",
                enteredValues: newdata,
                ipAddress: IP_address,
                location: Location,
                browserDetails: Browser_details
            });

            res.redirect('/Leave/show');


            return;

        });
    });



    router.post('/delete', (req, res) => {
        const { req_id } = req.body;
        const sql = 'DELETE FROM Leave_request WHERE id = ?';

        db.query(sql, req_id, (err, result) => {
            if (err) {
                console.error('Error deleting data:', err);
                res.status(500).json('Error deleted data');
                return;
            }

            // res.status(200).json('Data deleted successfully');

            var IP_address = localStorage.getItem('IP_address');
            var Location = localStorage.getItem('Location');
            var Browser_details = localStorage.getItem('Browser_details');

            logActivity(req, res, {
                User_id: userId,
                activityType: "management",
                resourceName: "Apply leave",
                operation: "Delete",
                databaseTableName: "Leave_request",
                enteredValues: req_id,
                ipAddress: IP_address,
                location: Location,
                browserDetails: Browser_details
            });

            res.redirect('/Leave/show');
            return;

        })
    })



    router.post('/edit', (req, res) => {
        // const id = req.body.id;

        console.log('i am inside edit route');


        const { id_, startDate, endDate, Leave_type, reason } = req.body;

        console.log('reqest id: ', id_);




        // Construct the SQL UPDATE query dynamically based on the provided columns
        let sql = 'UPDATE Leave_request SET ';
        const updateValues = [];
        if (Leave_type !== '') {
            sql += ' Leave_type_id = ?, ';
            updateValues.push(Leave_type);
        }

        if (startDate !== '') {
            sql += 'startDate = ?, ';
            updateValues.push(startDate);
        }

        if (endDate !== '') {
            sql += 'endDate = ?, ';
            updateValues.push(endDate);
        }
        if (reason !== '') {
            sql += 'reason = ?, ';
            updateValues.push(reason);
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

            // res.status(200).json('Request updated successfully');

            var IP_address = localStorage.getItem('IP_address');
            var Location = localStorage.getItem('Location');
            var Browser_details = localStorage.getItem('Browser_details');

            const values = updateValues.join(',');

            logActivity(req, res, {
                User_id: userId,
                activityType: "management",
                resourceName: "Apply leave",
                operation: "Edit",
                databaseTableName: "Leave_request",
                enteredValues: values,
                ipAddress: IP_address,
                location: Location,
                browserDetails: Browser_details
            });

            res.redirect('/Leave/show');
            return;

        });


    });


    //Dropdown options in apply leave form
    router.get('/leaveType-dropdown', (req, res) => {
        const sql = 'SELECT id, typeName FROM Leave_type';

        db.query(sql, (error, results, fields) => {
            if (error) {
                console.error('Error retrieving data from database: ' + error.stack);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            res.json(results);
        });
    });


    //Dropdown options in apply leave form
    router.get('/leaveType-user', (req, res) => {
        const sql = `SELECT lb.id AS balance_id, lb.Employee_id,lt.id AS type_id ,lt.typeName, lb.Month_id, lb.totalLeaves, lb.leavesTaken      
        FROM Leave_balance lb
        INNER JOIN Leave_type lt ON lb.Leave_type_id = lt.id
        WHERE Employee_id = ?`;

        data = [employeeId];

        db.query(sql, data, (error, results) => {
            if (error) {
                console.error('Error retrieving data from database: ' + error.stack);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            console.log("leave type for particular user :", results);
            res.json(results);
        });
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


// Function to format date string in YYYY-MM-DD HH:MM:SS format
function formatDateTime(dateString) {
    if (!dateString) {
        return ''; // Return empty string if dateString is null or undefined
    }

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


function calculateNumberOfDays(startDate, endDate) {
    // Parse the start and end dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Calculate the difference in milliseconds
    const differenceInMilliseconds = end - start;

    // Convert milliseconds to days
    const millisecondsInOneDay = 1000 * 60 * 60 * 24;
    const numberOfDays = Math.floor(differenceInMilliseconds / millisecondsInOneDay) + 1;

    return numberOfDays;
}


// Pseudo-code for fetching request status
router.get('/getRequestStatus', (req, res) => {
    // Assuming you have access to the database
    // Query the database to get the status of each request
    const requestStatuses = {}; // Object to store request statuses

    // Example query
    db.query('SELECT id, status FROM Leave_request', (err, results) => {
        if (err) {
            // Handle error
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        // Store the statuses in the requestStatuses object
        results.forEach(result => {
            requestStatuses[result.id] = result.status;
        });

        // Send the requestStatuses object as JSON response
        res.json(requestStatuses);
    });
});





router.post('/status-approve', (req, res) => {
    const { req_id } = req.body;
    // const approvedBy = 'Your Approver Name'; // Change this to the name of the approver
    const approveDate = new Date().toISOString().slice(0, 10); // Current date as approval date


    // Update the leave request in the database
    const sql = `UPDATE Leave_request 
                             SET  status = 'Approved', approvedBy = 'Admin', approveDate = ? 
                             WHERE id = ?`;

    data = [approveDate, req_id];

    db.query(sql, data, (err, result) => {

        if (err) {
            console.error('Error updating leave request:', err);
            return res.status(500).send('Internal Server Error');
        }

        console.log(`Leave request with ID ${req_id} approved successfully.`);
        // res.status(200).send(`Leave request with ID ${req_id} approved successfully.`);

        res.status(200).json({ success: true });
        return

    });
});



router.post('/status-reject', (req, res) => {
    const { req_id } = req.body;
    // const approvedBy = 'Your Approver Name'; // Change this to the name of the approver
    const approveDate = new Date().toISOString().slice(0, 10); // Current date as approval date



    // Update the leave request in the database
    const sql = `UPDATE Leave_request 
                             SET  status = 'Rejected', approvedBy = ?,  approveDate = ? 
                             WHERE id = ?`;

    data = [ storedVariable ,approveDate, req_id];

    db.query(sql, data, (err, result) => {

        if (err) {
            console.error('Error updating leave request:', err);
            return res.status(500).send('Internal Server Error');
        }

        console.log(`Leave request with ID ${req_id} rejected successfully.`);
        // res.status(200).send(`Leave request with ID ${req_id} approved successfully.`);

        res.status(200).json({ success: true });
        return

    });
});








module.exports = router;
