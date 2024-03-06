
var express = require('express');
var router = express.Router();

var db = require('../connection/db');

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




router.get('/show', (req, res) => {
    // const sql =  'SELECT * FROM Leave_request';

    const sql = `SELECT 
    lr.id AS Leave_request_id,
    CONCAT(e.firstName, ' ', e.lastName) AS employeeName,
    lt.typeName AS Leave_type_name,
    m.monthName AS Month_name,
    lr.startDate,
    lr.endDate,
    lr.days,
    lr.reason,
    lr.appliedOn,
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
    Employee AS e ON lr.Employee_id = e.id`;



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



router.get('/show-to-user', (req, res) => {
    const { Employee_id } = req.body;
    // const sql = `SELECT Leave_type_id , month_id , startDate , endDate , reason , appliedOn , status , approvedBy , approveDate FROM Leave_request 
    //                 where Employee_id = ?`;

    const sql = `SELECT 
     
     CONCAT(e.firstName, ' ', e.lastName) AS employeeName,
     lt.typeName AS Leave_type_name,
     m.monthName AS Month_name,
     lr.startDate,
     lr.endDate,
     lr.days,
     lr.reason,
     lr.appliedOn,
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

    value = [Employee_id];
    db.query(sql, value, (err, result) => {
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




router.get('/show-to-approver', (req, res) => {
    // const {Employee_id} = req.body;
    // const sql = `SELECT Employee_id ,  Leave_type_id , month_id , startDate , endDate , reason , appliedOn , status  FROM Leave_request `;

    const sql = `SELECT 
    
    CONCAT(e.firstName, ' ', e.lastName) AS employeeName,
    lt.typeName AS Leave_type_name,
    m.monthName AS Month_name,
    lr.startDate,
    lr.endDate,
    lr.days,
    lr.reason,
    lr.appliedOn,
    lr.status
    
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
        console.log('Data fetched successfully');
        res.status(200).json(result);
        return;

    })

})




router.post('/add', (req, res) => {
    // const leaveRequestData = req.body;
    const { Employee_id, Leave_type_id, Month_id, startDate, endDate, reason } = req.body;

    start = startDate;
    end = endDate;
    var days = calculateNumberOfDays(start, end);


    const sql = `INSERT INTO Leave_request 
                (Employee_id, Leave_type_id, Month_id, startDate, endDate, days, reason) 
                VALUES (?, ?, ?, ?, ?, ?, ? )`;

    var data = [Employee_id, Leave_type_id, Month_id, startDate, endDate, days, reason];


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




router.post('/delete', (req, res) => {
    const { id } = req.body;
    const sql = 'DELETE FROM Leave_request WHERE id = ?';

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
})



router.post('/edit', (req, res) => {
    // const id = req.body.id;

    const { id, Leave_type_id, Month_id, startDate, endDate, reason } = req.body;



    // Construct the SQL UPDATE query dynamically based on the provided columns
    let sql = 'UPDATE Leave_request SET ';
    const updateValues = [];
    if (Leave_type_id !== '') {
        sql += ' Leave_type_id = ?, ';
        updateValues.push(Leave_type_id);
    }
    if (Month_id !== '') {
        sql += 'Month_id = ?, ';
        updateValues.push(Month_id);
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
    updateValues.push(id);

    db.query(sql, updateValues, (err, result) => {
        if (err) {
            console.error('Error in updating :', err);
            res.status(500).json('Internal Server Error');
            return;
        }
        console.log('request updated successfully');
        res.status(200).json('Request updated successfully');
        return;

    });


});



module.exports = router;
