var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../connection/db');
const path= require('path');
const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

router.get('/',(req,res)=>{
    const sql= "SELECT * FROM Feedback";
    db.query(sql,(err,result)=>{
        if (err) {
            console.error('Error showing data:', err);
            return res.status(500).send('Internal server error');
        }
        // return res.status(200).json({ result });
        return res.render('feedback');
    });
});

router.post('/add',(req,res)=>{
    const {Employee_id,feedbackType,feedbackDate,feedbackDescription,feedbackMethod}=req.body;
    const data=[Employee_id,feedbackType,feedbackDate,feedbackDescription,feedbackMethod];
    const sql='INSERT INTO Feedback(Employee_id,feedbackType,feedbackDate,feedbackDescription,feedbackMethod) VALUES(?,?,?,?,?)';
    db.query(sql,data,(err,result)=>{
        if (err) {
            console.error('error', err);
            return res.status(500).send("Internal server error");
        }
        // return res.status(201).json( result );
        return res.redirect('/feedback');
    });
});

router.post('/update',(req,res)=>{
    const {id,Employee_id,feedbackType,feedbackDate,feedbackDescription,feedbackMethod}=req.body;
    let sql= "UPDATE Feedback SET ";
    const updateValues=[];
    if (Employee_id !== undefined) {
        sql += 'Employee_id = ?, ';
        updateValues.push(Employee_id);
    }
    if (feedbackType !== undefined) {
        sql += 'feedbackType = ?, ';
        updateValues.push(feedbackType);
    }
    if (feedbackDate !== undefined) {
        sql += 'feedbackDate = ?, ';
        updateValues.push(feedbackDate);
    }
    if (feedbackDescription !== undefined) {
        sql += 'feedbackDescription = ?, ';
        updateValues.push(feedbackDescription);
    }
    if (feedbackMethod !== undefined) {
        sql += 'feedbackMethod = ?, ';
        updateValues.push(feedbackMethod);
    }
    
    // Check if any fields are provided for update
    if (updateValues.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields provided for update' });
    }
    // Remove the trailing comma and space
    sql = sql.slice(0, -2);
    sql += ' WHERE id = ?';

    // Add the id value to the updateValues array
    updateValues.push(id);

    // Execute the SQL UPDATE query
    db.query(sql, updateValues, (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            res.status(500).send('Error updating data');
            return;
        }
        return res.status(200).json({ success: true, message: 'Data update successfully',result});
    });
});

router.get('/search',(req,res)=>{
    const {id}=req.body;
    const sql=`SELECT *FROM Feedback WHERE id=${id}`;
    db.query(sql,(err,result)=>{
        if (err) {
            console.error('error',err);
            return res.status(500).send("Internal serevr error");
        }
        return res.status(200).json({result});
    });
});

router.post('/delete',(req,res)=>{
    const {id}=req.body;
    const sql=`DELETE FROM Feedback WHERE id=${id}`;
    db.query(sql,(err,result)=>{
        if (err) {
            console.error('error',err);
            return res.status(500).send("Internal serevr error");
        }
        return res.status(200).json({result});
    });
});

module.exports=router;