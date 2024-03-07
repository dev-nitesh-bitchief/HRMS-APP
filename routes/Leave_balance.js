var express = require('express');
var router = express.Router();

var db = require('../connection/db');





router.post('/add', (req, res) => {
    // const leaveRequestData = req.body;
    const { Employee_id, Leave_type_id, Month_id, totalLeaves, leavesTaken } = req.body;

    var balanceLeaves = totalLeaves - leavesTaken;

    const sql = 'INSERT INTO Leave_balance ( Employee_id , Leave_type_id , Month_id  , totalLeaves , leavesTaken , balanceLeaves) VALUES (?,?,?,?,?,?)';

    var data = [Employee_id, Leave_type_id, Month_id, totalLeaves, leavesTaken, balanceLeaves];


    db.query(sql, data, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json('Error inserting data');
            return;
        }
        console.log('Data inserted successfully');
        res.status(200).json('Data inserted successfully');
        return;
    });
});




router.get('/show', (req, res) => {


    const sql = `SELECT 
    lb.id AS Leave_balance_id,
    e.id AS employee_id,
    CONCAT(e.firstName, ' ', e.lastName) AS employeeName,
    lb.Leave_type_id,
    lt.typeName AS Leave_type_name,
    m.monthName AS Month_name,
    lb.totalLeaves,
    lb.leavesTaken,
    lb.date
FROM 
    Leave_balance AS lb
LEFT JOIN 
    Leave_type AS lt ON lb.Leave_type_id = lt.id
LEFT JOIN 
    Month AS m ON lb.Month_id = m.id
INNER JOIN 
    Employee AS e ON lb.employee_id = e.id`;


    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error Fetching data:', err);
            res.status(500).json('Error Fetching data');
            return;
        }
        console.log('Data fetched successfully');
        res.status(200).json(result);
        return;

    })
});




router.post('/edit', (req, res) => {
    // const id = req.body.id;

    const { id, totalLeaves, leavesTaken } = req.body;



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
    updateValues.push(id);

    db.query(sql, updateValues, (err, result) => {
        if (err) {
            console.error('Error in updating :', err);
            res.status(500).json('Internal Server Error');
            return;
        }
        console.log('leave balance updated successfully');
        res.status(200).json('leave balance updated successfully');
        return;

    });


});



router.post('/delete', (req, res) => {
    const { id } = req.body;
    const sql = 'DELETE FROM Leave_balance WHERE id = ?';

    db.query(sql, id, (err, result) => {
        if (err) {
            console.error('Error deleting data:', err);
            res.status(500).json('Error deleted data');
            return;
        }
        console.log('Data deleted successfully');
        res.status(200).json('Data deleted successfully');
        return;

    })
});



router.post('/search', (req, res) => {
    const { Employee_id } = req.body;


    const sql = `SELECT 
    lb.id AS Leave_balance_id,
    e.id AS employee_id,
    CONCAT(e.firstName, ' ', e.lastName) AS employeeName,
    lb.Leave_type_id,
    lt.typeName AS Leave_type_name,
    m.monthName AS Month_name,
    lb.totalLeaves,
    lb.leavesTaken,
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
        console.log('Data searched successfully');
        res.status(200).json(result);
        return;

    })
});





module.exports = router;