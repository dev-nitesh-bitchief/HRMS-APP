var express = require('express');
var router = express.Router();
var db = require('../connection/db');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(express.urlencoded({ extended: true }));
router.get('/admin', (req, res) => {
    res.render('admin_public_holiday');
});

// router.post('/add', (req, res) => {
//     const { holidayDate, holidayName } = req.body;
//     const permissions = req.body.permissions || [];
//     console.log(holidayDate);
//     console.log(holidayName);
//     console.log(permissions);
//     // const permissions1 = [permissions]
//     // console.log(permissions1);
//     // const date = new Date(holidayDate);
//     // const monthNumber = date.getMonth();
//     // const month_id = monthNumber + 1;
//     // console.log(month_id);
//     const state_id = permissions.join(',');
//     // Insert holiday data into the database
//     const sqlQuery = 'INSERT INTO Holiday_lists (holidayDate,holidayName,state_id) VALUES (?, ?, ?)';
//     db.query(sqlQuery, [holidayDate, holidayName, state_id,], (err, result) => {
//         if (err) {
//             console.error('Error inserting into database: ' + err.stack);
//             res.status(500).send('Internal Server Error');
//             return;
//         }
//         res.status(200).json({ message: 'Data Inserted Successfully', result });
//     });
// });

router.post('/add', (req, res) => {
    const { holidayDate, holidayName, multipleSelect } = req.body;
    const selectedOptions = Array.isArray(multipleSelect) ? multipleSelect : [multipleSelect];
    const date = new Date(holidayDate);
    const monthNumber = date.getMonth();
    const month_id = monthNumber + 1;
    const state_id = selectedOptions ? selectedOptions.join(',') : ' ';

    // Insert holiday data into the database
    const sqlQuery = 'INSERT INTO Holiday_lists (holidayDate, holidayName, state_id , month_id) VALUES (?, ?, ?, ? )';
    db.query(sqlQuery, [holidayDate, holidayName, state_id, month_id], (err, result) => {
        if (err) {
            console.error('Error inserting into database:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.redirect('/holiday/show-to-admin');
    });
});


router.post('/delete', (req, res) => {
    const { id_ } = req.body;
    console.log('id is ', id_);
    const sqlQuery = `DELETE FROM Holiday_lists WHERE id = ${id_}`;
    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.error('Error Deleting Data', err.stack);
            res.status(500).json('Error Deleting data');
            return;
        }
        console.log('Data Deleted Successfully');
        res.redirect('/holiday/show-to-admin');
        return;
    });
});

router.get('/search', (req, res) => {
    const { month_id } = req.body;
    const sqlQuery = `SELECT * FROM Holiday_lists WHERE month_id = ${month_id}`;
    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.error('Error while Searching  Data', err.stack);
            res.status(500).json('Error while Searching data');
            return;
        }
        if (result.length === 0) {
            console.log('No data found');
            return res.status(404).json('No data found');
        }
        console.log('Data Search  Successfully');
        res.status(200).json({ message: 'Data Search Successfully', result });
        return;
    });
});

router.post('/update', (req, res) => {
    const { id_, holidayDate_update, holidayName_update, multipleSelect_update } = req.body;
    const selectedOptions = Array.isArray(multipleSelect_update) ? multipleSelect_update : [multipleSelect_update];
    console.log(id_);
    console.log(holidayDate_update);
    console.log(holidayName_update);
    console.log(multipleSelect_update);
    const date = new Date(holidayDate_update);
    const monthNumber = date.getMonth();
    const month_id = monthNumber + 1;
    console.log(month_id);
    const state_id = selectedOptions ? selectedOptions.join(',') : ' ';
    const sqlQuery = `UPDATE Holiday_lists SET holidayName = ?, holidayDate = ?, state_id = ?, month_id = ? WHERE id = ?`;
    db.query(sqlQuery, [holidayName_update, holidayDate_update, state_id, month_id, id_], (err, result) => {
        if (err) {
            console.error('Error Updating data: ' + err.stack);
            res.status(500).send('Error Updating Data ');
            return;
        }
        res.redirect('/holiday/show-to-admin');
        // res.status(200).json({ message: 'Data Updated Successfully', result });
    });
});

router.get('/show-to-admin', (req, res) => {
    const sqlQuery = `SELECT * FROM Holiday_lists `;
    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.error('Error while Fetching data: ' + err.stack);
            res.status(500).send('Error while fetching data');
            return;
        }
        result.forEach(row => {
            const holidayDate = row.holidayDate;
            // Convert the date to a string representation in the desired format
            const dateObject = new Date(holidayDate);
            // Extract year, month, and day components from the date object
            const year = dateObject.getFullYear();
            // Months are zero-indexed, so add 1 to get the correct month
            const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
            const day = dateObject.getDate().toString().padStart(2, '0');
            row.holidayDate = `${year}-${month}-${day}`;
        });
        res.render('admin_public_holiday', { data: result });
        // res.status(200).json({ message: "Data Fetched Successfully", result });
    });
});


router.get('/', (req, res) => {
    const sqlQuery = `SELECT * FROM Holiday_lists `;
    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.error('Error while Fetching data: ' + err.stack);
            res.status(500).send('Error while fetching data');
            return;
        }
        result.forEach(row => {
            const holidayDate = row.holidayDate;
            // Convert the date to a string representation in the desired format
            const dateObject = new Date(holidayDate);
            // Extract year, month, and day components from the date object
            const year = dateObject.getFullYear();
            // Months are zero-indexed, so add 1 to get the correct month
            const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
            const day = dateObject.getDate().toString().padStart(2, '0');
            row.holidayDate = `${year}-${month}-${day}`;
        });
        console.log('Data fetched successfully');
        res.render('public_holiday', { data: result });;
        // res.status(200).json(result);
        return;
    });
});

module.exports = router;