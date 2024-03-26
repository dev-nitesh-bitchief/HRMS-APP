var express = require('express');
var router = express.Router();
var db = require('../connection/db');

//Route for Role-Management:
router.get('/show',(req,res)=>{
    const sql='SELECT *FROM Subscription';
    db.query(sql,(err, result) => {
        if (err) {
            console.error('Error showing data:', err);
            return res.status(500).send('Internal server error');
        }
        return res.status(200).json({ result });
        
    });
});

router.get('/',(req,res)=>{
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
    const {subscriptionPlan_plan_id,start_date,end_date,status}=req.body;
    const data=[subscriptionPlan_plan_id,start_date,end_date,status];
    const sql='INSERT INTO Subscription(subscriptionPlan_plan_id,start_date,end_date,status)VALUES(?,?,?,?)';
    db.query(sql,data,(err,result)=>{
        if (err) {
            console.error('error',err);
            return res.status(500).send("Internal serevr error");
        }
        return res.status(201).json({result});
    });
});

router.post('/update',(req,res)=>{
    const {subscription_id,subscriptionPlan_plan_id,start_date,end_date,status}=req.body;
    let sql='UPDATE Subscription SET ';
    const updateValues = [];
    if (subscriptionPlan_plan_id !== undefined) {
        sql += 'subscriptionPlan_plan_id = ?, ';
        updateValues.push(subscriptionPlan_plan_id);
    }
    if (start_date !== undefined) {
        sql += 'start_date = ?, ';
        updateValues.push(start_date);
    }
    if (end_date!==undefined) {
        sql += 'end_date = ?, ';
        updateValues.push(end_date);
    }
    if (status!==undefined) {
        sql += 'status = ?, ';
        updateValues.push(status);
    }

    // Check if any fields are provided for update
    if (updateValues.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields provided for update' });
    }
    // Remove the trailing comma and space
    sql = sql.slice(0, -2);
    sql += ' WHERE subscription_id = ?';

    // Add the id value to the updateValues array
    updateValues.push(subscription_id);

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
    const {subscription_id}=req.body;
    const sql=`SELECT *FROM Subscription WHERE subscription_id=${subscription_id}`;
    db.query(sql,(err,result)=>{
        if (err) {
            console.error('error',err);
            return res.status(500).send("Internal serevr error");
        }
        return res.status(200).json({result});
    });
});

router.post('/delete',(req,res)=>{
    const {subscription_id}=req.body;
    const sql=`DELETE FROM Subscription WHERE subscription_id=${subscription_id}`;
    db.query(sql,(err,result)=>{
        if (err) {
            console.error('error',err);
            return res.status(500).send("Internal serevr error");
        }
        return res.status(200).json({result});
    });
});

module.exports=router;