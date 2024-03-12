var express = require('express');
var router = express.Router();
var db = require('../connection/db');
const path = require('path');
const multer = require('multer');
const upload = multer({ dest: 'bill/.' });
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
        const { item, purchaseFrom, purchaseDate, Expense_category_id, Payment_method_id, description, amount } = req.body;
        console.log('Employee id is ', Employee_id);
        console.log('employee_id is ', employee_id);
        if (Employee_id == null) {
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
        const filePath = path.join(__dirname, '..', 'bill', fileName);

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
                res.redirect('/expense');
                // res.status(200).json('Data inserted successfully');
            });
        });
    });
});

// router.post('/add', upload.single('bill'), (req, res) => {
//     console.log("Inside add Route ");
//     console.log('Results od requested body ', req.body);

//     const { Employee_id, item, purchaseFrom, purchaseDate, Expense_category_id, Payment_method_id, description, amount } = req.body;
//     const bill = req.file;

//     if (!bill) {
//         console.error('No file uploaded');
//         res.status(400).json('No file uploaded');
//         return;
//     }
//     console.log("bill is ", bill);

//     const fileName = bill.filename;
//     const filePath = path.join(__dirname, '..', 'bill', fileName);

//     fs.writeFile(filePath, fs.readFileSync(bill.path), (err) => {
//         if (err) {
//             console.error('Error writing file:', err);
//             res.status(500).json('Error writing file');
//             return;
//         }

//         const sqlQuery = `INSERT INTO Expense(Employee_id, item, purchaseFrom, purchaseDate, Expense_category_id, Payment_method_id, description, amount, bill) VALUES (?,?,?,?,?,?,?,?,?)`;

//         const data = [Employee_id, item, purchaseFrom, purchaseDate, Expense_category_id, Payment_method_id, description, amount, fileName];

//         db.query(sqlQuery, data, (err, result) => {
//             if (err) {
//                 console.error('Error inserting data:', err);
//                 res.status(500).json('Error inserting data');
//                 return;
//             }
//             console.log('Data inserted successfully');
//             res.redirect('/expense');
//             // res.status(200).json('Data inserted successfully');
//         });
//     });
// });





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


router.post('/approve', (req, res) => {
    // Get the ID of the request to approve from the request body
    const id = req.body.requestId;
    var currentdate = new Date();
    const year = currentdate.getFullYear();
    // Months are zero-indexed, so add 1 to get the correct month
    const month = (currentdate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentdate.getDate().toString().padStart(2, '0');

    currentdate = `${year}-${month}-${day}`;
    console.log('current date is ', currentdate);

    const sqlQuery = `UPDATE Expense SET approvalStatus = 'Approved' , approvedBy = 'Admin', approvalDate = ? WHERE id = ?`;

    db.query(sqlQuery, [currentdate, id], (err, result) => {
        if (err) {
            console.error('Error Updating Request', err);
            res.status(500).json('Error Updating Request');
            return;
        }
        console.log('Status Updated successfully');
        // Render the 'admin-expense' page after the database query completes
        res.render('admin-expense', { data: result });
    });
    res.status(200).json({ message: `Request ${id} has been approved` });
});


router.post('/reject', (req, res) => {
    // Get the ID of the request to approve from the request body
    const id = req.body.requestId;
    var currentdate = new Date();
    const year = currentdate.getFullYear();
    // Months are zero-indexed, so add 1 to get the correct month
    const month = (currentdate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentdate.getDate().toString().padStart(2, '0');

    currentdate = `${year}-${month}-${day}`;

    console.log('current date is ', currentdate);
    console.log("Requested id is ", id);

    const sqlQuery = `UPDATE Expense SET approvalStatus = 'Rejected', approvedBy = 'Admin' , approvalDate = ? WHERE id = ?`;

    db.query(sqlQuery, [currentdate, id], (err, result) => {
        if (err) {
            console.error('Error Updating Request', err);
            res.status(500).json('Error Updating Request');
            return;
        }
        console.log('Satus Updated successfully');
        res.render('admin-expense', { data: result });
    });
    console.log(`Request ${id} has been rejected`);
    // Send a response back to the client
    res.status(200).json({ message: `Request ${id} has been Rejected` });
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

// router.get('/dynamic-options-payment-method', (req, res) => {
//     const sql = 'select * from Payment_method';
//     console.log('Inside Dynamic Payment Method Route');
//     db.query(sql, (error, results) => {
//         if (error) {
//             console.error('Error retrieving data from database: ' + error.stack);
//             res.status(500).json({ error: 'Internal Server Error' });
//             return;
//         }
//         console.log('Result inside dynamic option', results);
//         res.json(results);
//     });
// });

// router.get('/dynamic-options-expense-category', (req, res) => {
//     const sql = 'select * from Expense_category';
//     db.query(sql, (error, results) => {
//         if (error) {
//             console.error('Error retrieving data from database: ' + error.stack);
//             res.status(500).json({ error: 'Internal Server Error' });
//             return;
//         }
//         res.json(results);
//     });
// });

// Route to handle approval action

module.exports = router;



// const authenticateUser = (req, res, next) => {
//     if (req.session.user_visit) {
//         // User is already authenticated
//         return next();
//     }
//     if (!token) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }
//     try {
//         const decoded = jwt.verify(token, secretKey);
//         req.user = decoded.username;
//         req.role_id = decoded.role_id;
//         return next();
//     } catch (error) {
//         res.status(401).json({ message: 'Unauthorized' });
//     }
// };

// router.post('/login',authenticateUser, (req, res) => {
//     // Implement login logic
//     console.log('Inside Login Route');
//     const { username, password } = req.body;

//     // console.log(username, password);
//     db.query('SELECT * FROM User WHERE username = ?', [username], (err, results) => {
//         if (err) throw err;
//         if (results.length > 0) {
//             const user = results[0];
//             // Compare passwords
//             bcrypt.compare(password, user.password, (err, result) => {
//                 if (err) throw err;
//                 if (result) {
//                     var username = user.username;
//                     var role_id = user.role_id;
//                     const payload = { username, role_id };
//                     // console.log(results);
//                     global.token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
//                     res.redirect('/');
//                 } else {
//                     res.send('Invalid username or password');
//                 }
//             });
//         } else {
//             res.send('Invalid username or password');
//         }
//     });
// });


