var express = require('express');
var router = express.Router();

var db = require('../connection/db');




router.post('/add', (req, res) => {
    const { User_id, activityType, resourceName, operation, databaseTableName, previousValues, enteredValues, ipAddress, location, browserDetails } = req.body;

    const sql = `INSERT INTO Audit_logging (User_id, activityType, resourceName, operation, databaseTableName, previousValues, enteredValues, ipAddress, location, browserDetails) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    var data = [User_id, activityType, resourceName, operation, databaseTableName, previousValues, enteredValues, ipAddress, location, browserDetails];

    db.query(sql, data, (err, result) => {
        if (err) {
            // console.error('Error inserting data:', err);
            // res.status(500).json('Error inserting data');
            // return;
            console.error('Error executing MySQL query: ' + err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        // console.log('Data inserted successfully');
        // res.status(200).json('Data inserted successfully');
        // return;

        console.log('Log successfully inserted with ID: ' + result.insertId);
        res.status(200).json({ message: 'Log inserted successfully', logId: result.insertId });

    });
});






router.post('/delete', (req, res) => {
    const { req_id } = req.body;
    const sql = 'DELETE FROM Audit_logging WHERE id = ?';

    db.query(sql, req_id, (err, result) => {
        if (err) {
            console.error('Error deleting data:', err);
            res.status(500).json('Error deleted data');
            return;
        }
        console.log('Data deleted successfully');
        // res.status(200).json('Data deleted successfully');
        res.redirect('/Audit-logging/show');
        return;

    })
});






router.get('/show', (req, res) => {

    const sql = `SELECT a.id, u.username AS Username, a.activityType, a.resourceName, a.operation, a.databaseTableName, a.previousValues, a.enteredValues, a.ipAddress, a.location, a.browserDetails, a.timestamp
                 FROM Audit_logging a
                JOIN User u ON a.User_id = u.id `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error Fetching data:', err);
            res.status(500).json('Error Fetching data');
            return;
        }
       
        // res.status(200).json(result);
        res.render('Audit_logging' ,{data : result});
        return;

    })
});








router.post('/search', (req, res) => {
    const { User_id } = req.body;
    const sql = `SELECT  u.username AS Username, a.activityType, a.resourceName, a.operation, a.databaseTableName, a.previousValues, a.enteredValues, a.ipAddress, a.location, a.browserDetails, a.timestamp
                 FROM Audit_logging a
                JOIN User u ON a.User_id = u.id
                WHERE a.User_id = ? `;

    db.query(sql, User_id, (err, result) => {
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





router.post('/edit', (req, res) => {
    // const id = req.body.id;
    const { id, User_id, activityType, resourceName, operation, databaseTableName, previousValues, enteredValues, ipAddress, location, browserDetails } = req.body;

    sql = `UPDATE Audit_logging
     SET
       User_id = ?,
       activityType = ?,
       resourceName = ?,
       operation = ?,
       databaseTableName = ?,
       previousValues = ?,
       enteredValues = ?,
       ipAddress = ?,
       location = ?,
       browserDetails = ?
     WHERE
       id = ?`;

    data = [User_id, activityType, resourceName, operation, databaseTableName, previousValues, enteredValues, ipAddress, location, browserDetails, id];




    db.query(sql, data, (err, result) => {
        if (err) {
            console.error('Error in updating :', err);
            res.status(500).json('Internal Server Error');
            return;
        }
        console.log('log updated successfully');
        res.status(200).json('log updated successfully');
        return;

    });


});














module.exports = router;