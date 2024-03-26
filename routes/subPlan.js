var express = require('express');
var router = express.Router();
var db = require('../connection/db');


router.get('/',(req,res)=>{
    const sql='SELECT *FROM SubscriptionPlan';
    db.query(sql,(err, result) => {
        if (err) {
            console.error('Error showing data:', err);
            return res.status(500).send('Internal server error');
        }
        // return res.status(200).json({ result });
        return res.render('subPlan',({plans:result}));
    });
});

router.get('/show',(req,res)=>{
    const sql='SELECT *FROM SubscriptionPlan';
    db.query(sql,(err, result) => {
        if (err) {
            console.error('Error showing data:', err);
            return res.status(500).send('Internal server error');
        }
        // return res.status(200).json({ result });
        return res.render('addSubscription',({plan:result}));
    });
});

router.post('/add',(req,res)=>{
    const {plan_name,description,price,features,duration}=req.body;
    const data=[plan_name,description,price,features,duration];
    const sql='INSERT INTO SubscriptionPlan(plan_name,description,price,features,duration)VALUES(?,?,?,?,?)';
    db.query(sql,data,(err,result)=>{
        if (err) {
            console.error('error',err);
            return res.status(500).send("Internal serevr error");
        }
        return res.status(201).json({result});
    });
});

router.post('/update',(req,res)=>{
    const {plan_id,plan_name,description,price,features,duration}=req.body;
    let sql='UPDATE SubscriptionPlan SET ';
    const updateValues = [];
    if (plan_name !== undefined) {
        sql += 'plan_name = ?, ';
        updateValues.push(plan_name);
    }
    if (description !== undefined) {
        sql += 'description = ?, ';
        updateValues.push(description);
    }
    if (price!==undefined) {
        sql += 'price = ?, ';
        updateValues.push(price);
    }
    if (features!==undefined) {
        sql += 'features = ?, ';
        updateValues.push(features);
    }
    if (duration!==undefined) {
        sql += 'duration = ?, ';
        updateValues.push(duration);
    }

    // Check if any fields are provided for update
    if (updateValues.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields provided for update' });
    }
    // Remove the trailing comma and space
    sql = sql.slice(0, -2);
    sql += ' WHERE plan_id = ?';

    // Add the id value to the updateValues array
    updateValues.push(plan_id);

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

router.get('/search',(req,res)=>{
    const {plan_id}=req.body;
    const sql=`SELECT *FROM SubscriptionPlan WHERE plan_id=${plan_id}`;
    db.query(sql,(err,result)=>{
        if (err) {
            console.error('error',err);
            return res.status(500).send("Internal serevr error");
        }
        return res.status(200).json({result});
    });
});

router.post('/delete',(req,res)=>{
    const {plan_id}=req.body;
    const sql=`DELETE FROM SubscriptionPlan WHERE plan_id=${plan_id}`;
    db.query(sql,(err,result)=>{
        if (err) {
            console.error('error',err);
            return res.status(500).send("Internal serevr error");
        }
        return res.status(200).json({result});
    });
});

module.exports=router;