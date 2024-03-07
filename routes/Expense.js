var express = require('express');
var router = express.Router();
var db = require('../connection/db');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'bill/.' });
const fs = require('fs');

// router.post('/add', upload.single('bill'), (req, res) => {

//     const { Employee_id, item, purchaseFrom, purchaseDate, Expense_category_id, Payment_method_id, description, amount, submissionDate } = req.body;
//     const bill = req.file;

//     // // Save the uploaded file with filename
//     const fileName = bill ? bill.filename : null;
//     const filePath = path.join(__dirname, 'bill', fileName);
//     // // // Read and write the file to server
//     fs.writeFileSync(filePath, fs.readFileSync(bill.path));

//     const sqlQuery = `INSERT INTO Expense(Employee_id, item, purchaseFrom, purchaseDate, Expense_category_id, Payment_method_id, description, amount,bill, submissionDate) VALUES (?,?,?,?,?,?,?,?,?,?)`

//     var data = [Employee_id, item, purchaseFrom, purchaseDate, Expense_category_id, Payment_method_id, description, amount, fileName, submissionDate];

//     db.query(sqlQuery, data, (err, result) => {
//         if (err) {
//             console.error('Error inserting data:', err);
//             res.status(500).json('Error inserting data');
//             return;
//         }
//         console.log('Data inserted successfully');
//         res.status(200).json('Data inserted successfully');
//         return;
//     });
// });


router.post('/add',(req, res) => {

    const { Employee_id, item, purchaseFrom, purchaseDate, Expense_category_id, Payment_method_id, description, amount, submissionDate } = req.body;

    const sqlQuery = `INSERT INTO Expense(Employee_id, item, purchaseFrom, purchaseDate, Expense_category_id, Payment_method_id, description, amount,submissionDate) VALUES (?,?,?,?,?,?,?,?,?)`

    var data = [Employee_id, item, purchaseFrom, purchaseDate, Expense_category_id, Payment_method_id, description, amount, submissionDate];

    db.query(sqlQuery, data, (err, result) => {
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
    const sql = 'DELETE FROM Expense WHERE id = ?';

    db.query(sql, id, (err, result) => {
        if (err) {
            console.error('Error deleting data:', err);
            res.status(500).json('Error deleted data');
            return;
        }
        console.log('Data deleted successfully');
        res.status(200).json('Data deleted successfully');
        return;

    });
});

router.post('/update', (req, res) => {

    const { Employee_id, item, purchaseFrom, purchaseDate, Expense_category_id, Payment_method_id, description, amount, submissionDate } = req.body;
    const bill = req.file;

    // // Save the uploaded file with filename
    const fileName = bill ? bill.filename : null;
    const filePath = path.join(__dirname, 'bill', fileName);
    // // // Read and write the file to server
    fs.writeFileSync(filePath, fs.readFileSync(bill.path));

    const sqlQuery = `UPDATE Expense SET(Employee_id, item, purchaseFrom, purchaseDate, Expense_category_id, Payment_method_id, description, amount,bill, submissionDate) VALUES (?,?,?,?,?,?,?,?,?,?)`

    var data = [Employee_id, item, purchaseFrom, purchaseDate, Expense_category_id, Payment_method_id, description, amount, fileName, submissionDate];

    db.query(sqlQuery, data, (err, result) => {
        if (err) {
            console.error('Error while updating data:', err);
            res.status(500).json('Error while updating data');
            return;
        }
        console.log('Data Updated successfully');
        res.status(200).json('Data Updated successfully');
        return;
    });
});

router.get('/show', (req, res) => {
    const sqlQuery = `SELECT 
    e.id AS expense_id,
    CONCAT(emp.firstName, ' ', emp.lastName) AS employee_name,
    e.item,
    e.purchaseFrom,
    e.purchaseDate,
    ec.expenseType AS expense_category,
    pm.methodName AS payment_method,
    e.description,
    e.amount,
    e.bill,
    e.submissionDate,
    e.approvalDate,
    e.approvedBy,
    e.approvalStatus,
    e.reimbursementStatus
FROM 
    Expense e
JOIN 
    Payment_method pm ON e.Payment_method_id = pm.id
JOIN 
    Expense_category ec ON e.Expense_category_id = ec.id
JOIN
    Employee emp ON e.Employee_id = emp.id`;

    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.error('Error Fetching data:', err);
            res.status(500).json('Error Fetching data');
            return;
        }
        console.log('Data fetched successfully');
        res.status(200).json(result);
        return;

    });
});

router.get('/show-to-user', (req, res) => {
    const { Employee_id } = req.body;
    const sqlQuery = `SELECT 
CONCAT(emp.firstName, ' ', emp.lastName) AS employee_name,
e.item,
e.purchaseFrom,
e.purchaseDate,
ec.expenseType AS expense_category,
pm.methodName AS payment_method,
e.description,
e.amount,
e.bill,
e.submissionDate,
e.approvalDate,
e.approvedBy,
e.approvalStatus,
e.reimbursementStatus
FROM 
Expense e
JOIN 
Payment_method pm ON e.Payment_method_id = pm.id
JOIN 
Expense_category ec ON e.Expense_category_id = ec.id
JOIN
Employee emp ON e.Employee_id = emp.id
WHERE e.Employee_id = ?`;

    db.query(sqlQuery, Employee_id, (err, result) => {
        if (err) {
            console.error('Error Fetching data:', err);
            res.status(500).json('Error Fetching data');
            return;
        }
        if (result.length === 0) {
            console.log('No data found');
            return res.status(404).json('No data found');
        }
        console.log('Data fetched successfully');
        res.status(200).json(result);
        return;

    });
});

router.get('/show-to-approver', (req, res) => {
    const { Employee_id } = req.body;
    const sqlQuery = `SELECT 
    e.id AS expense_id,
    CONCAT(emp.firstName, ' ', emp.lastName) AS employee_name,
    e.item,
    e.purchaseFrom,
    e.purchaseDate,
    ec.expenseType AS expense_category,
    pm.methodName AS payment_method,
    e.description,
    e.amount,
    e.bill,
    e.submissionDate,
    e.approvalStatus,
    e.reimbursementStatus
FROM 
    Expense e
JOIN 
    Payment_method pm ON e.Payment_method_id = pm.id
JOIN 
    Expense_category ec ON e.Expense_category_id = ec.id
JOIN
    Employee emp ON e.Employee_id = emp.id
    WHERE e.Employee_id = ?`;

    db.query(sqlQuery,Employee_id, (err, result) => {
        if (err) {
            console.error('Error Fetching data:', err);
            res.status(500).json('Error Fetching data');
            return;
        }

        console.log('Data fetched successfully');
        res.status(200).json(result);
        return;

    });
});

module.exports = router;