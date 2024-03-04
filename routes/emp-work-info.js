var express = require('express');
var router = express.Router();
var db = require('../connection/db');

router.get('/show', (req, res, next) => {
    // res.send("hello from ework")
    db.query('SELECT *FROM Employee_work_info', (err, result) => {
        if (err) {
            console.error('Error showing data:', err);
            return res.status(500).send('Internal server error');
        }
        return res.status(200).json({ result });
    })
});

router.post('/add', (req, res) => {
    const { Employee_id, workPhone, manager, coach, approveOff, workLocation, timeZone, language, passportNumber, placeOfBirth, countryOfBirth, visaNumber, visaExpirationDate, workPermitNumber } = req.body;
    const data = [Employee_id, workPhone, manager, coach, approveOff, workLocation, timeZone, language, passportNumber, placeOfBirth, countryOfBirth, visaNumber, visaExpirationDate, workPermitNumber];
    const sql = 'INSERT INTO Employee_work_info(Employee_id,workPhone,manager,coach,approveOff,workLocation,timeZone,language,passportNumber,placeOfBirth,countryOfBirth,visaNumber,visaExpirationDate,workPermitNumber) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(sql, data, (err, result) => {
        if (err) {
            console.error('Error adding fields:', err);
            return res.status(500).send('Internal server error');
        }
        return res.status(201).json({ result });
    })
});

router.post('/update', (req, res) => {
    const { Employee_id, workPhone, manager, coach, approveOff, workLocation, timeZone, language, passportNumber, placeOfBirth, countryOfBirth, visaNumber, visaExpirationDate, workPermitNumber } = req.body;
    // Construct the SQL UPDATE query dynamically based on the provided columns
    let sql = 'UPDATE Employee_work_info SET ';
    const updateValues = [];
    if (workPhone !== '') {
        sql += 'workPhone = ?, ';
        updateValues.push(workPhone);
    }
    if (manager !== '') {
        sql += 'manager = ?, ';
        updateValues.push(manager);
    }
    if (coach !== '') {
        sql += 'coach = ?, ';
        updateValues.push(coach);
    }
    if (approveOff !== '') {
        sql += 'approveOff = ?, ';
        updateValues.push(approveOff);
    }
    if (workLocation !== '') {
        sql += 'workLocation = ?, ';
        updateValues.push(workLocation);
    }
    if (timeZone !== '') {
        sql += 'timeZone = ?, ';
        updateValues.push(timeZone);
    }
    if (language !== '') {
        sql += 'language = ?, ';
        updateValues.push(language);
    }
    if (passportNumber !== '') {
        sql += 'passportNumber = ?, ';
        updateValues.push(passportNumber);
    }
    if (placeOfBirth !== '') {
        sql += 'placeOfBirth = ?, ';
        updateValues.push(placeOfBirth);
    }
    if (countryOfBirth !== '') {
        sql += 'countryOfBirth = ?, ';
        updateValues.push(countryOfBirth);
    }
    if (visaNumber !== '') {
        sql += 'visaNumber = ?, ';
        updateValues.push(visaNumber);
    }
    if (visaExpirationDate !== '') {
        sql += 'visaExpirationDate = ?, ';
        updateValues.push(visaExpirationDate);
    }
    if (workPermitNumber !== '') {
        sql += 'workPermitNumber = ?, ';
        updateValues.push(workPermitNumber);
    }
    // Remove the trailing comma and space
    sql = sql.slice(0, -2);
    sql += ' WHERE id = ?';

    // Add the id value to the updateValues array
    updateValues.push(Employee_id);

    // Execute the SQL UPDATE query
    db.query(sql, updateValues, (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            res.status(500).send('Error updating data');
            return;
        }
        // console.log('Data updated successfully');
        // return res.send('Data updated successfully');
        return res.status(200).json({ success: true, message: 'Data update successfully',result});
    });
});

router.post('/search',(req,res)=>{
    const {Employee_id}=req.body;
    const sql=`SELECT FROM Employee_work_info WHERE Employee_id=${Employee_id}`;
    db.query(sql,(err,result)=>{
        if(err){
            console.error('error fetching data',err);
            res.status(500).send('error fetching data');
            return;
        }
        console.log("data fetched successfully");
        return res.status(200).json({result});
        // return res.render('search',{user: result});
        // res.render('search',{user:result});
        // res.status(200).send({status:true,message:"successfully fetched data"});
    });
});

router.post('/delete',(req,res)=>{
    const {Employee_id}=req.body;
    const sql=`DELETE FROM Employee_work_info WHERE Employee_id=${Employee_id}`;
    db.query(sql,(err,result)=>{
        if(err){
            console.error('error delete data',err);
            res.status(500).send('error delete data');
            return;
        }
        console.log("data delete successfully");
        return res.status(200).json({result});
    });
});
module.exports = router;