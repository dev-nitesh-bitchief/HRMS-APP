var express = require('express');
var router = express.Router();
var db = require('../connection/db');
const path = require('path');
const multer = require('multer');

const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = "$1234";
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
// Import the LocalStorage class from the node-localstorage package
const { LocalStorage } = require('node-localstorage');
// Create a new instance of LocalStorage
const localStorage = new LocalStorage('./scratch');

var storedVariable = localStorage.getItem('username');
const fileFilter = function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPG, PNG, and PDF files are allowed!'), false);
    }
};
// Define a function to fetch the Employee_id by username
function getEmployeeIdByUsername(username, callback) {
    db.query('SELECT Employee_id FROM User WHERE username = ?', username, (err, result) => {
        if (err) {
            console.error('Error Fetching data:', err);
            callback(err, null);
            return;
        }
        console.log('Data fetched successfully');
        callback(null, result[0].Employee_id);
    });
}
getEmployeeIdByUsername(storedVariable, (err, employee_id) => {
    if (err) {
        // Handle error
        console.error(err);
        return;
    }
    // Now you can use the employeeId variable in any route
    console.log('Employee ID:', employee_id);
    router.get('/', (req, res) => {
        // const Employee_id = 5;
        console.log('Employee id under route ', employee_id);
        console.log('Inside  Expense Route ');
        const sqlQuery = `SELECT 
    CONCAT(emp.firstName, ' ', emp.lastName) AS employee_name,
    e.id,
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

        db.query(sqlQuery, employee_id, (err, result) => {
            if (err) {
                console.error('Error Fetching data:', err);
                res.status(500).json('Error Fetching data');
                return;
            }
            if (result.length === 0) {
                console.log('No data found');
                res.render('expense');
                // return res.status(404).json('No data found');
            }
            result.forEach(row => {
                const purchaseDate = row.purchaseDate;
                const approvalDate = row.approvalDate;
                // Convert the date to a string representation in the desired format
                const dateObject = new Date(purchaseDate);
                // Extract year, month, and day components from the date object
                const year = dateObject.getFullYear();
                // Months are zero-indexed, so add 1 to get the correct month
                const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
                const day = dateObject.getDate().toString().padStart(2, '0');
                row.purchaseDate = `${year}-${month}-${day}`;

                const dateObject2 = new Date(approvalDate);
                // Extract year, month, and day components from the date object
                const year_ = dateObject2.getFullYear();
                // Months are zero-indexed, so add 1 to get the correct month
                const month_ = (dateObject2.getMonth() + 1).toString().padStart(2, '0');
                const day_ = dateObject2.getDate().toString().padStart(2, '0');
                row.approvalDate = `${year_}-${month_}-${day_}`;
            });
            console.log('Data fetched successfully');
            res.render('expense', { data: result });
            // res.status(200).json(result);
            return;
        });
    });

    router.post('/add', upload.single('bill'), (req, res) => {

        var Employee_id = req.body.Employee_id;
        var isEmployee = null;
        const { item, purchaseFrom, purchaseDate, Expense_category_id, Payment_method_id, description, amount } = req.body;
        console.log('Employee id is ', Employee_id);
        console.log('employee_id is ', employee_id);

        if (Employee_id == null) {
            // employee_id is fetch from employee who is logged in right now using local storage
            isEmployee = 1;
            Employee_id = employee_id;
        }
        const bill = req.file;
        if (!bill) {
            console.error('No file uploaded');
            res.status(400).json('No file uploaded');
            return;
        }
        console.log("bill is ", bill);

        var fileName = bill.filename;
        fileName = null;
        fileName = item + ' ' + purchaseDate + ' ' + amount;
        // fileName = `${item}_${purchaseDate}_${amount}_${Date.now()}${path.extname(bill.originalname)}`;
        const filePath = path.join(__dirname, '..', 'bill', fileName);
        // Define file filter function


        fs.writeFile(filePath, fs.readFileSync(bill.path), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                res.status(500).json('Error writing file');
                return;
            }

            const sqlQuery = `INSERT INTO Expense(Employee_id, item, purchaseFrom, purchaseDate, Expense_category_id, Payment_method_id, description, amount, bill) VALUES (?,?,?,?,?,?,?,?,?)`;

            const data = [Employee_id, item, purchaseFrom, purchaseDate, Expense_category_id, Payment_method_id, description, amount, fileName];

            db.query(sqlQuery, data, (err, result) => {
                if (err) {
                    console.error('Error inserting data:', err);
                    res.status(500).json('Error inserting data');
                    return;
                }
                console.log('Data inserted successfully');
                if (isEmployee) {
                    res.redirect('/Expense/show');
                }
                else {
                    res.redirect('/Expense');
                }
                // res.status(200).json('Data inserted successfully');
            });
        });
    });
});

router.get('/type', (req, res) => {
    const sqlQuery = 'SELECT * FROM Expense_category';
    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json('Error inserting data');
            return;
        }
        res.render('expense_type', { data: result });
        // res.status(200).json('Data inserted successfully');
    });
})
router.post('/type-delete', (req, res) => {
    const { id } = req.body;
    console.log("id to be deleted is ", id);
    const sqlQuery = `DELETE FROM Expense_category where id = ${id}`;
    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.error('Error Deleting data:', err);
            res.status(500).json('Error Deleting data');
            return;
        }
        res.redirect('/Expense/type');
        // res.status(200).json('Data inserted successfully');
    });
});
router.post('/type-add', (req, res) => {
    const { expenseType } = req.body;
    console.log(expenseType);
    const sqlQuery = `INSERT INTO  Expense_category (expenseType) VALUES (?)`;
    db.query(sqlQuery, expenseType, (err, result) => {
        if (err) {
            console.error('Error Deleting data:', err);
            res.status(500).json('Error inserting data');
            return;
        }
        res.redirect('/Expense/type');
        // res.status(200).json('Data inserted successfully');
    });
});
router.post('/type-update', (req, res) => {
    const { id_, expenseType } = req.body;
    console.log(id_);
    console.log(expenseType);
    const sqlQuery = `UPDATE Expense_category SET expenseType = ? WHERE id = ?`;
    db.query(sqlQuery, [expenseType, id_], (err, result) => {
        if (err) {
            console.error('Error Deleting data:', err);
            res.status(500).json('Error inserting data');
            return;
        }
        res.redirect('/Expense/type');
        // res.status(200).json('Data inserted successfully');
    });
});

router.get('/payment_method', (req, res) => {
    const sqlQuery = 'SELECT * FROM Payment_method';
    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json('Error inserting data');
            return;
        }
        console.log(result);
        res.render('payment_method', { data: result });
        // res.status(200).json('Data inserted successfully');
    });
});

router.post('/payment_method-delete', (req, res) => {
    const { id } = req.body;
    console.log("id to be deleted is ", id);
    const sqlQuery = `DELETE FROM Payment_method where id = ${id}`;
    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.error('Error Deleting data:', err);
            res.status(500).json('Error Deleting data');
            return;
        }
        res.redirect('/Expense/payment_method');
        // res.status(200).json('Data inserted successfully');
    });
});

router.post('/payment_method-add', (req, res) => {
    const { methodName } = req.body;
    console.log(methodName);
    const sqlQuery = `INSERT INTO Payment_method (methodName) VALUES (?)`;
    db.query(sqlQuery, methodName, (err, result) => {
        if (err) {
            console.error('Error Deleting data:', err);
            res.status(500).json('Error inserting data');
            return;
        }
        res.redirect('/Expense/payment_method');
    });
});

router.post('/payment_method-update', (req, res) => {
    const { id_, methodName } = req.body;
    console.log(id_);
    console.log(methodName);
    const sqlQuery = `UPDATE Payment_method SET methodName = ? WHERE id = ?`;
    db.query(sqlQuery, [methodName, id_], (err, result) => {
        if (err) {
            console.error('Error Deleting data:', err);
            res.status(500).json('Error inserting data');
            return;
        }
        res.redirect('/Expense/payment_method');
    });
});

router.post('/delete', (req, res) => {
    console.log('Requested Body ', req.body);
    const { id } = req.body;
    console.log("Id to be deleted ", id);
    const sql = 'DELETE FROM Expense WHERE id = ?';
    db.query(sql, id, (err, result) => {
        if (err) {
            console.error('Error deleting data:', err);
            res.status(500).json('Error deleted data');
            return;
        }
        console.log('Data deleted successfully');
        res.redirect('/expense');
        return;
    });
});

router.post('/update', (req, res) => {
    const { id_, item, purchaseFrom, Expense_category_id, Payment_method_id, description, amount } = req.body;
    console.log("id under expense update ", id_);
    console.log("item under expense update ", item);
    console.log('Purchase from inside Update', purchaseFrom);

    let sqlQuery = 'UPDATE Expense SET ';
    const updateValues = [];
    if (item !== '') {
        sqlQuery += 'item = ?, ';
        updateValues.push(item);
    }
    if (purchaseFrom !== '') {
        sqlQuery += 'purchaseFrom = ?, ';
        updateValues.push(purchaseFrom);
    }
    if (Expense_category_id !== '') {
        sqlQuery += 'Expense_category_id = ?, ';
        updateValues.push(Expense_category_id);
    }
    if (Payment_method_id !== '') {
        sqlQuery += 'Payment_method_id = ? , ';
        updateValues.push(Payment_method_id);
    }
    if (description !== '') {
        sqlQuery += 'description = ?, ';
        updateValues.push(description);
    }
    if (amount !== '') {
        sqlQuery += 'amount = ?, ';
        updateValues.push(amount);
    }
    // Remove the trailing comma and space
    sqlQuery = sqlQuery.slice(0, -2);
    sqlQuery += ' WHERE id = ?';

    // Add the id value to the updateValues array
    updateValues.push(id_);
    db.query(sqlQuery, updateValues, (err, result) => {
        if (err) {
            console.error('Error while updating data:', err);
            res.status(500).json('Error while updating data');
            return;
        }
        console.log('Data Updated successfully');
        res.redirect('/expense');
        return;
    });
});

router.get('/show', (req, res) => {
    console.log("Inside show to admin route ");

    const sqlQuery = `SELECT 
    e.id AS expense_id,
    CONCAT(emp.firstName, ' ', emp.lastName) AS employee_name,
    e.id,
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
        result.forEach(row => {
            const submissionDate = row.submissionDate;
            const purchaseDate = row.purchaseDate;
            // Convert the date to a string representation in the desired format
            const dateObject = new Date(submissionDate);
            const dateObject2 = new Date(purchaseDate);
            // Extract year, month, and day components from the date object
            const year = dateObject.getFullYear();
            // Months are zero-indexed, so add 1 to get the correct month
            const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
            const day = dateObject.getDate().toString().padStart(2, '0');
            const purchase_year = dateObject2.getFullYear();
            // Months are zero-indexed, so add 1 to get the correct month
            const purchase_month = (dateObject2.getMonth() + 1).toString().padStart(2, '0');
            const purchase_day = dateObject2.getDate().toString().padStart(2, '0');
            row.submissionDate = `${year}-${month}-${day}`;
            row.purchaseDate = `${purchase_year}-${purchase_month}-${purchase_day}`;
        });
        console.log('Data fetched successfully');
        res.render('admin-expense', { data: result });
        // res.status(200).json(result);
        return;
    });
});



router.post('/status-approve', (req, res) => {

    const { req_id } = req.body;
    console.log('req_id is', req_id);
    var currentdate = new Date();
    const year = currentdate.getFullYear();
    // Months are zero-indexed, so add 1 to get the correct month
    const month = (currentdate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentdate.getDate().toString().padStart(2, '0');

    currentdate = `${year}-${month}-${day}`;
    console.log('current date is ', currentdate);

    const sqlQuery = `UPDATE Expense SET approvalStatus = 'Approved' , approvedBy = 'Admin', approvalDate = ? WHERE id = ?`;

    db.query(sqlQuery, [currentdate, req_id], (err, result) => {
        if (err) {
            console.error('Error Updating Request', err);
            res.status(500).json('Error Updating Request');
            return;
        }
        console.log('Status Updated successfully');
        res.status(200).json({ success: true });
        return;
    });


});


router.post('/status-reject', (req, res) => {
    // Get the ID of the request to approve from the request body
    const { req_id } = req.body;
    console.log('id under reject is ', req_id);
    var currentdate = new Date();
    const year = currentdate.getFullYear();
    // Months are zero-indexed, so add 1 to get the correct month
    const month = (currentdate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentdate.getDate().toString().padStart(2, '0');

    currentdate = `${year}-${month}-${day}`;

    console.log('current date is ', currentdate);
    console.log("Requested id is ", req_id);

    const sqlQuery = `UPDATE Expense SET approvalStatus = 'Rejected', approvedBy = 'Admin' , approvalDate = ? WHERE id = ?`;

    db.query(sqlQuery, [currentdate, req_id], (err, result) => {
        if (err) {
            console.error('Error Updating Request', err);
            res.status(500).json('Error Updating Request');
            return;
        }
        console.log('Satus Updated successfully');
        res.status(200).json({ success: true });
        return;
    });
});



router.get('/download/:id', (req, res) => {
    console.log('Inside Download Route');
    const expenseId = req.params.id;
    const sqlQuery = 'SELECT bill FROM Expense WHERE id = ?';
    db.query(sqlQuery, [expenseId], (err, results) => {
        if (err) {
            console.error('Error fetching Bill filename:', err);
            return res.status(500).send('Error fetching bill ');
        }

        // Check if a profile image exists for the user
        if (results.length === 0 || !results[0].bill) {
            return res.status(404).send('bill not found');
        }

        const billName = results[0].bill;
        const billPath = path.join(__dirname, '..', 'bill', billName);

        // Check if the file exists
        if (!fs.existsSync(billPath)) {
            return res.status(404).send('Bill not found');
        }

        // Serve the profile image file for download with its original filename
        res.download(billPath, billName);
    });
});


// Route to handle approval action
router.get('/dynamic-employee-field', (req, res) => {
    const sql = `SELECT id,CONCAT(firstName, ' ', lastName) AS employeeName
    FROM Employee`;
    db.query(sql, (error, results) => {
        if (error) {
            console.error('Error retrieving data from database: ' + error.stack);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        console.log("result inside employee dynamic ", results);
        res.json(results);
    });
});
router.get('/dynamic-options-payment_method', (req, res) => {
    const sql = 'select * from Payment_method';
    db.query(sql, (error, results) => {
        if (error) {
            console.error('Error retrieving data from database: ' + error.stack);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

router.get('/dynamic-options-expense-category', (req, res) => {
    const sql = 'select * from Expense_category';
    db.query(sql, (error, results) => {
        if (error) {
            console.error('Error retrieving data from database: ' + error.stack);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});
// Pseudo-code for fetching request status

router.get('/getRequestStatus', (req, res) => {
    // Assuming you have access to the database
    // Query the database to get the status of each request
    const requestStatuses = {}; // Object to store request statuses

    // Example query
    db.query('SELECT id, approvalStatus FROM Expense', (err, results) => {
        console.log('Inside request status');
        if (err) {
            // Handle error
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        // Store the statuses in the requestStatuses object
        results.forEach(result => {
            requestStatuses[result.id] = result.approvalStatus;
        });
        // Send the requestStatuses object as JSON response
        console.log(requestStatuses);
        res.json(requestStatuses);
    });
});
const upload = multer({ dest: 'bill/.', fileFilter: fileFilter });

module.exports = router;


// router.get('/show-to-approver', (req, res) => {
//     const { Employee_id } = req.body;
//     const sqlQuery = `SELECT
//     e.id AS expense_id,
//     CONCAT(emp.firstName, ' ', emp.lastName) AS employee_name,
//     e.item,
//     e.purchaseFrom,
//     e.purchaseDate,
//     ec.expenseType AS expense_category,
//     pm.methodName AS payment_method,
//     e.description,
//     e.amount,
//     e.bill,
//     e.submissionDate,
//     e.approvalStatus,
//     e.reimbursementStatus
// FROM
//     Expense e
// JOIN
//     Payment_method pm ON e.Payment_method_id = pm.id
// JOIN
//     Expense_category ec ON e.Expense_category_id = ec.id
// JOIN
//     Employee emp ON e.Employee_id = emp.id
//     WHERE e.Employee_id = ?`;

//     db.query(sqlQuery, Employee_id, (err, result) => {
//         if (err) {
//             console.error('Error Fetching data:', err);
//             res.status(500).json('Error Fetching data');
//             return;
//         }
//         console.log('Data fetched successfully');
//         res.status(200).json(result);
//         return;
//     });
// });
