var express = require('express');
var router = express.Router();
var db = require('../connection/db');
var path = require('path');
var app = express();

//Route for Permission-Management:
router.get('/',(req,res)=>{
    const sql='SELECT *FROM permission';
    db.query(sql,(err, result) => {
        if (err) {
            console.error('Error showing data:', err);
            return res.status(500).send('Internal server error');
        }
        // return res.status(200).json({ result });
        return res.render('permission',({permissions:result}));
    });
});

router.post('/add',(req,res)=>{
    const {id,permissionName}=req.body;
    const data=[id,permissionName];
    const sql='INSERT INTO permission(id,permissionName)VALUES(?,?)';
    db.query(sql,data,(err,result)=>{
        if (err) {
            console.error('error',err);
            return res.status(500).send("Internal serevr error");
        }
        return res.status(201).json({result});
    });
});

router.post('/update',(req,res)=>{
    const {id,permissionName}=req.body;
    let sql='UPDATE permission SET ';
    const updateValues = [];
    if (permissionName !== undefined) {
        sql += 'permissionName = ?, ';
        updateValues.push(permissionName);
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
        // console.log('Data updated successfully');
        // return res.send('Data updated successfully');
        return res.status(200).json({ success: true, message: 'Data update successfully',result});
    });
});

router.get('/search',(req,res)=>{
    const {id}=req.body;
    const sql=`SELECT *FROM permission WHERE id=${id}`;
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
    const sql=`DELETE FROM permission WHERE id=${id}`;
    db.query(sql,(err,result)=>{
        if (err) {
            console.error('error',err);
            return res.status(500).send("Internal serevr error");
        }
        return res.status(200).json({result});
    });
});

module.exports=router;