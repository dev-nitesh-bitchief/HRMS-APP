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
    const { holidayDate, holidayName, permissions } = req.body;
    console.log('Received data:', holidayDate, holidayName, permissions);

    // Handle permissions array appropriately
    const state_id = permissions ? permissions.join(',') : '';

    // Insert holiday data into the database
    const sqlQuery = 'INSERT INTO Holiday_lists (holidayDate, holidayName, state_id) VALUES (?, ?, ?)';
    db.query(sqlQuery, [holidayDate, holidayName, state_id], (err, result) => {
        if (err) {
            console.error('Error inserting into database:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({ message: 'Data Inserted Successfully', result });
    });
});

router.post('/delete', (req, res) => {
    const { id } = req.body;
    const sqlQuery = `DELETE FROM Holiday_lists WHERE id = ${id}`;
    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.error('Error Deleting Data', err.stack);
            res.status(500).json('Error Deleting data');
            return;
        }
        console.log('Data Deleted Successfully');
        res.status(200).json({ message: 'Data Deleted Successfully', result });
        return;
    });
});

router.post('/search', (req, res) => {
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
    const { id, stateIds, holidayName, holidayDate } = req.body;
    const date = new Date(holidayDate);
    const monthNumber = date.getMonth();
    const month_id = monthNumber + 1;
    console.log(month_id);
    const state_id = stateIds.join(',');
    const sqlQuery = `UPDATE Holiday_lists SET holidayName = ?, holidayDate = ?, state_id = ?, month_id = ? WHERE id = ${id}`;
    db.query(sqlQuery, [holidayName, holidayDate, state_id, month_id], (err, result) => {
        if (err) {
            console.error('Error Updating data: ' + err.stack);
            res.status(500).send('Error Updating Data ');
            return;
        }
        res.status(200).json({ message: 'Data Updated Successfully', result });
    });
});

router.post('/show', (req, res) => {
    const sqlQuery = `SELECT * FROM Holiday_lists `;
    db.query(sqlQuery, (err, result) => {
        if (err) {
            console.error('Error while Fetching data: ' + err.stack);
            res.status(500).send('Error while fetching data');
            return;
        }
        res.status(200).json({ message: "Data Fetched Successfully", result });
    });
});


module.exports = router;