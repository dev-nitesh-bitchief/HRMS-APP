var express = require('express');
var router = express.Router();

var db = require('../connection/db');




router.post('/add', (req, res) => {
    // const leaveRequestData = req.body;
    const { employee_id, salary_id, department_id, Payroll_cycle_id, refNo, dateFrom, dateTo, presentDays, absentDays, salary_type, totalExpense, net_salary } = req.body;



    const sql = 'INSERT INTO Payroll ( employee_id, salary_id, department_id, Payroll_cycle_id, refNo, dateFrom, dateTo, presentDays, absentDays, salary_type, totalExpense, net_salary ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)';

    var data = [employee_id, salary_id, department_id, Payroll_cycle_id, refNo, dateFrom, dateTo, presentDays, absentDays, salary_type, totalExpense, net_salary];


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
    p.id,
    CONCAT(e.firstName, ' ', e.lastName) AS employeeName,
   
    d.departmentName,
    pc.days,
    p.refNo,
    p.dateFrom,
    p.dateTo,
    p.presentDays,
    p.absentDays,
    p.salary_type,
    s.salaryAmount,
    p.totalExpense,
    p.net_salary,
    p.dateCreated
FROM 
    Payroll p
LEFT JOIN 
    Employee e ON p.employee_id = e.id
LEFT JOIN 
    Salary s ON p.salary_id = s.id
LEFT JOIN 
    Department d ON p.department_id = d.id
LEFT JOIN 
    Payroll_cycle pc ON p.Payroll_cycle_id = pc.id `;

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


router.post('/delete', (req, res) => {
    const { id } = req.body;

    sql = 'DELETE FROM Payroll WHERE id = ?';

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





router.post('/edit', (req, res) => {
    // const id = req.body.id;

    const { id, employee_id, salary_id, department_id, Payroll_cycle_id, refNo, dateFrom, dateTo, presentDays, absentDays, salary_type, totalExpense, net_salary } = req.body;

    sql = `UPDATE Payroll
     SET
       employee_id = ?,
       salary_id = ?,
       department_id = ?,
       Payroll_cycle_id = ?,
       refNo = ?,
       dateFrom = ?,
       dateTo = ?,
       presentDays = ?,
       absentDays = ?,
       salary_type = ?,
       totalExpense = ?,
       net_salary = ?
     WHERE
       id = ?`;

    data = [employee_id, salary_id, department_id, Payroll_cycle_id, refNo, dateFrom, dateTo, presentDays, absentDays, salary_type, totalExpense, net_salary, id];


    db.query(sql, data, (err, result) => {
        if (err) {
            console.error('Error in updating :', err);
            res.status(500).json('Internal Server Error');
            return;
        }
        console.log('Payroll updated successfully');
        res.status(200).json('Payroll updated successfully');
        return;

    });


});









module.exports = router;