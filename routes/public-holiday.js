var express = require('express');
var router = express.Router();
var db = require('../connection/db');

router.post('/add', (req, res) => {
    const { holidayName,holidayDate,state_id,year_id } = req.body;

    const sqlQuery = `INSERT INTO Holiday_lists(holidayName,holidayDate,state_id,year_id) VALUES (?,?,?,?)`;
    const  data = [holidayName,holidayDate,state_id,year_id];

    db.query(sqlQuery,data,(err,result)=>{
        if (err) {
            console.error('Error Inserting Data', err);
            res.status(500).json('Error Inserting data');
            return;
        }
        console.log('Data Inserted Successfully');
        res.status(200).json('Data Inserted Successfully');
        return;
    });
});

module.exports = router;