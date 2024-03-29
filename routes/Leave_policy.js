var express = require('express');
var router = express.Router();

const multer = require('multer');
const fs = require('fs');
const path = require('path');

var db = require('../connection/db');


var logActivity = require('./log_function');
// const authenticateUser = require('./index');


const { LocalStorage } = require('node-localstorage');

const localStorage = new LocalStorage('./scratch');

var storedVariable = localStorage.getItem('username');  


router.use('/pdf_file', express.static(path.join(__dirname, '..', 'Leave_policy')));



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




    router.get('/show', (req, res) => {

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

  


    router.get('/show_admin', (req, res) => {

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


            res.render('LeavePolicy_admin', { data: result });
            return;

        })
    });

   

    const upload = multer({ dest: 'Leave_policy/' });

    router.post('/add',upload.single('policyFile'), (req, res) => {
        // const leaveRequestData = req.body;
        const { policyName, description } = req.body;

        


        const policyFile = req.file;

        if (!policyFile) {
            console.error('No file uploaded');
            res.status(400).json('No file uploaded');
            return;
        }
    
        console.log("bill is ", policyFile);
    
        var fileName = policyFile.filename;
        fileName = policyName + '.pdf';
    
        const filePath = path.join(__dirname, '..', 'Leave_policy', fileName);
    
        fs.writeFile(filePath, fs.readFileSync(policyFile.path), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                res.status(500).json('Error writing file');
                return;
            }

            const sql = 'INSERT INTO Leave_policy (policyName , description , policyFile) VALUES (?, ?,?)';

            var data = [policyName, description, fileName];


            db.query(sql, data, (err, result) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    res.status(500).json('Error inserting data');
                    return;
                }
                console.log('Data inserted successfully');


                var IP_address = localStorage.getItem('IP_address');
                var Location = localStorage.getItem('Location');
                var Browser_details = localStorage.getItem('Browser_details');

                const newdata = data.join(',');


                logActivity(req, res, {
                    User_id: userId,
                    activityType: "Management access",
                    resourceName: "Leave Policies",
                    operation: "Add policy",
                    databaseTableName: "Leave_policy",
                    enteredValues: newdata,
                    ipAddress: IP_address,
                    location: Location,
                    browserDetails: Browser_details
                });

                // res.status(200).json('Data inserted successfully');

                res.status(200).redirect('/LeavePolicy/show_admin');


                return;
            });
        });

    });


    router.post('/delete', (req, res) => {
        const { policy_id } = req.body;
        const sql = 'DELETE FROM Leave_policy WHERE id = ?';

        data = [policy_id] ;

        console.log('policy id :' , policy_id);
        

        db.query(sql, data , (err, result) => {
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

           
            const newdata = data.join(',');

            logActivity(req, res, {
                User_id: userId,
                activityType: "Management access",
                resourceName: "Leave Policies",
                operation: "Delete policy",
                databaseTableName: "Leave_policy",
                enteredValues: newdata,
                ipAddress: IP_address,
                location: Location,
                browserDetails: Browser_details
            });

            res.status(200).redirect('/LeavePolicy/show_admin');
            return;

        });
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
           

            var IP_address = localStorage.getItem('IP_address');
            var Location = localStorage.getItem('Location');
            var Browser_details = localStorage.getItem('Browser_details');

            const newdata = updateValues.join(',');


            logActivity(req, res, {
                User_id: userId,
                activityType: "Management access",
                resourceName: "Leave Policies",
                operation: "Edit policy",
                databaseTableName: "Leave_policy",
                enteredValues: newdata ,
                ipAddress: IP_address,
                location: Location,
                browserDetails: Browser_details
            });
            
             // res.status(200).json('policy updated successfully');
            res.redirect('/LeavePolicy/show_admin');
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