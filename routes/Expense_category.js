var express = require('express');
var router = express.Router();
var db = require('../connection/db');

router.post('/add', (req, res) => {
    const { expenseType } = req.body;
    const sqlQuery = `INSERT INTO Expense_category (expenseType) VALUES (?)`;
    db.query(sqlQuery, [expenseType], (err, result) => {
        if (err) {
            console.error('Error inserting into database: ' + err.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.status(200).json({ message: 'Data Inserted Successfully', result });
    });
});

router.post('/delete', (req, res) => {
    const { id } = req.body;
    const sqlQuery = `DELETE FROM Expense_category WHERE id = ${id}`;
    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.error('Error while deleting data ' + err.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.status(200).json({ message: 'Data Deleted Successfully', result });
    });
});

router.post('/update', (req, res) => {
    const { id, expenseType } = req.body;
    const sqlQuery = `UPDATE Expense_category SET expenseType = ? WHERE id = ${id}`;
    db.query(sqlQuery, [expenseType], (err, result) => {
        if (err) {
            console.error('Error While Updating data : ' + err.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (result.affectedRows === 0) {
            console.log('No id found');
            return res.status(404).json('No id found');
        }
        res.status(200).json({ message: 'Data Updated Successfully', result });
    });
});

router.post('/show', (req, res) => {
    const sqlQuery = `SELECT * FROM Expense_category`;
    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.error('Error While Fetching data : ' + err.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.status(200).json({ message: 'Data Fetch Successfully', result });
    });
});

router.post('/search', (req, res) => {
    const { id } = req.body;
    const sqlquery = `SELECT * FROM Expense_category WHERE id = ${id}`;

    db.query(sqlquery, (err, result) => {
        if (err) {
            console.error('Error While Searching Data', err);
            res.status(500).json('Error While Searching data');
            return;
        }
        if (result.length === 0) {
            console.log('No data found');
            return res.status(404).json('No data found');
        }
        console.log('Data Search Successfully');
        res.status(200).json(result);
        return;
    });
});

module.exports = router;