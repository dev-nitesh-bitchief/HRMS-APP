
var express = require('express');
var router = express.Router();

var db = require('../connection/db');





router.post('/allocate', (req, res) => {
    const { Employee_id, Leave_type_id, Month_id, leavesQuantity, comments, allocatedBy } = req.body;

    const sql = 'INSERT INTO Leave_allocation (Employee_id, Leave_type_id, leavesQuantity, comments, allocatedBy) VALUES (?,?,?,?,?)';
    const data = [Employee_id, Leave_type_id, leavesQuantity, comments, allocatedBy];

    db.query(sql, data, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json('Error inserting data');
            return;
        }
        console.log('Data inserted successfully');

        // Nested query to update Leave_balance table
        const sql1 = 'UPDATE Leave_balance SET totalLeaves = totalLeaves + ? WHERE Employee_id = ? AND Leave_type_id = ? AND Month_id = ?';
        const data1 = [leavesQuantity, Employee_id, Leave_type_id, Month_id];

        db.query(sql1, data1, (err, result) => {
            if (err) {
                console.error('Error allocating leaves:', err);
                res.status(500).json('Error allocating data');
                return;
            }
            console.log('Leaves updated successfully in balance table');
            res.status(200).json('Leaves updated successfully in balance table');
        });
    });
});



router.get('/show', (req, res) => {
    const sql = `SELECT la.id AS allocation_id , la.Employee_id , CONCAT(e.firstName, ' ', e.lastName) AS employeeName ,  lt.typeName AS leave_type ,  la.leavesQuantity, la.comments, la.allocatedBy, la.date
                 FROM Leave_allocation AS la
                 JOIN Leave_type AS lt ON la.Leave_type_id = lt.id
                 JOIN Employee AS e ON la.Employee_id = e.id`;

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






router.post('/search', (req, res) => {

    const { Employee_id } = req.body;


    const sql = `SELECT la.id AS allocation_id , la.Employee_id , CONCAT(e.firstName, ' ', e.lastName) AS employeeName ,  lt.typeName AS leave_type ,  la.leavesQuantity, la.comments, la.allocatedBy, la.date
    FROM Leave_allocation AS la
    JOIN Leave_type AS lt ON la.Leave_type_id = lt.id
    JOIN Employee AS e ON la.Employee_id = e.id
    WHERE la.Employee_id = ?`;


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



router.post('/delete', (req, res) => {
    const { id } = req.body;
    const sql = 'DELETE FROM Leave_allocation WHERE id = ?';

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




router.post('/edit', (req, res) => {
    // const id = req.body.id;

    const { id, Leave_type_id, leavesQuantity, comments, allocatedBy } = req.body;



    // Construct the SQL UPDATE query dynamically based on the provided columns
    let sql = 'UPDATE Leave_allocation SET ';
    const updateValues = [];
    if (Leave_type_id !== '') {
        sql += ' Leave_type_id = ?, ';
        updateValues.push(Leave_type_id);
    }
    if (leavesQuantity !== '') {
        sql += 'leavesQuantity  = ?, ';
        updateValues.push(leavesQuantity);
    }
    if (comments !== '') {
        sql += 'comments  = ?, ';
        updateValues.push(comments);
    }
    if (allocatedBy !== '') {
        sql += 'allocatedBy  = ?, ';
        updateValues.push(allocatedBy);
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
        console.log('allocation data updated successfully');
        res.status(200).json('allocation data updated successfully');
        return;

    });


});





module.exports = router;