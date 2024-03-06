var express = require('express');
var router = express.Router();
var db = require('../connection/db');

//Route for Permission-Management:
router.get('/show',(req,res)=>{
    const sql='SELECT *FROM Permission';
    db.query(sql,(err, result) => {
        if (err) {
            console.error('Error showing data:', err);
            return res.status(500).send('Internal server error');
        }
        return res.status(200).json({ result });
    });
});

router.post('/add',(req,res)=>{
    const {id,permissionName,description}=req.body;
    const data=[id,permissionName,description];
    const sql='INSERT INTO Permission(id,permissionName,description)VALUES(?,?,?)';
    db.query(sql,data,(err,result)=>{
        if (err) {
            console.error('error',err);
            return res.status(500).send("Internal serevr error");
        }
        return res.status(201).json({result});
    });
});

router.post('/update',(req,res)=>{
    const {id,permissionName,description}=req.body;
    let sql='UPDATE Permission SET ';
    const updateValues = [];
    if (permissionName !== undefined) {
        sql += 'permissionName = ?, ';
        updateValues.push(permissionName);
    }
    if (description !== undefined) {
        sql += 'description = ?, ';
        updateValues.push(description);
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
    const sql=`SELECT *FROM Permission WHERE id=${id}`;
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
    const sql=`DELETE FROM Permission WHERE id=${id}`;
    db.query(sql,(err,result)=>{
        if (err) {
            console.error('error',err);
            return res.status(500).send("Internal serevr error");
        }
        return res.status(200).json({result});
    });
});

module.exports=router;