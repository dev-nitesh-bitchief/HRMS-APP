var express = require('express');
var router = express.Router();

var db = require('../connection/db');


var logActivity = require('./log_function');
// const authenticateUser = require('./index');

// Import the LocalStorage class from the node-localstorage package
const { LocalStorage } = require('node-localstorage');

// Create a new instance of LocalStorage
const localStorage = new LocalStorage('./scratch');

var storedVariable = localStorage.getItem('username');




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

        const sql = 'SELECT * FROM Leave_policy';

        db.query(sql, (err, result) => {
            if (err) {
                console.error('Error Fetching data:', err);
                res.status(500).json('Error Fetching data');
                return;
            }
            console.log('Data fetched successfully');
            // res.status(200).json(result);

            var IP_address = localStorage.getItem('IP_address');
            var Location = localStorage.getItem('Location');
            var Browser_details = localStorage.getItem('Browser_details');

           


            logActivity(req, res, {
                User_id: userId,
                activityType: "Management access",
                resourceName: "Leave Policies",
                operation: "show",
                databaseTableName: "Leave_policy",
                ipAddress: IP_address,
                location: Location,
                browserDetails: Browser_details
            });


            res.render('LeavePolicy', { data: result });
            return;

        })
    });




    router.post('/add', (req, res) => {
        // const leaveRequestData = req.body;
        const { policyName, description } = req.body;

        const sql = 'INSERT INTO Leave_policy (policyName , description) VALUES (?, ?)';

        var data = [policyName, description];


        db.query(sql, data, (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                res.status(500).json('Error inserting data');
                return;
            }
            console.log('Data inserted successfully');
            res.status(200).json('Data inserted successfully');

            var IP_address = localStorage.getItem('IP_address');
            var Location = localStorage.getItem('Location');
            var Browser_details = localStorage.getItem('Browser_details');


            logActivity(req, res, {
                User_id: userId,
                activityType: "Management access",
                resourceName: "Leave Policies",
                operation: "Add policy",
                databaseTableName: "Leave_policy",
                enteredValues : data,
                ipAddress: IP_address,
                location: Location,
                browserDetails: Browser_details
            });

            res.redirect('/Leave-policy');


            return;
        });
    });

    router.post('/delete', (req, res) => {
        const { id } = req.body;
        const sql = 'DELETE FROM Leave_policy WHERE id = ?';

        db.query(sql, id, (err, result) => {
            if (err) {
                console.error('Error deleting data:', err);
                res.status(500).json('Error deleted data');
                return;
            }
            console.log('Data deleted successfully');
            res.status(200).json('Data deleted successfully');

            var IP_address = localStorage.getItem('IP_address');
            var Location = localStorage.getItem('Location');
            var Browser_details = localStorage.getItem('Browser_details');


            logActivity(req, res, {
                User_id: userId,
                activityType: "Management access",
                resourceName: "Leave Policies",
                operation: "Delete policy",
                databaseTableName: "Leave_policy",
                enteredValues : id,
                ipAddress: IP_address,
                location: Location,
                browserDetails: Browser_details
            });

            res.redirect('/Leave-policy');
            return;

        })
    });






    router.post('/edit', (req, res) => {
        // const id = req.body.id;

        const { id, policyName, description } = req.body;



        // Construct the SQL UPDATE query dynamically based on the provided columns
        let sql = 'UPDATE Leave_policy SET ';
        const updateValues = [];
        if (policyName !== '') {
            sql += ' policyName = ?, ';
            updateValues.push(policyName);
        }
        if (description !== '') {
            sql += 'description = ?, ';
            updateValues.push(description);
        }


        // Remove the trailing comma and space
        sql = sql.slice(0, -2);
        sql += ' WHERE id = ?';

        // Add the id value to the updateValues array
        updateValues.push(id);

        db.query(sql, updateValues, (err, result) => {
            if (err) {
                console.error('Error in updating :', err);
                res.status(500).json('Internal Server Error');
                return;
            }
            console.log('policy updated successfully');
            res.status(200).json('policy updated successfully');

            var IP_address = localStorage.getItem('IP_address');
            var Location = localStorage.getItem('Location');
            var Browser_details = localStorage.getItem('Browser_details');


            logActivity(req, res, {
                User_id: userId,
                activityType: "Management access",
                resourceName: "Leave Policies",
                operation: "Edit policy",
                databaseTableName: "Leave_policy",
                enteredValues : updateValues,
                ipAddress: IP_address,
                location: Location,
                browserDetails: Browser_details
            });

            res.redirect('/Leave-policy');
            return;

        });


    });


    router.post('/search', (req, res) => {
        const { id } = req.body;
        const sql = 'SELECT  id , policyName , description FROM Leave_policy WHERE id = ?';

        db.query(sql, id, (err, result) => {
            if (err) {
                console.error('Error searching data:', err);
                res.status(500).json('Error searching  data');
                return;
            }
            console.log('Data searched successfully');
            res.status(200).json(result);
            return;

        })
    });


});



    module.exports = router;