const express= require('express');
const router=express.Router();
const db=require('../connection/db');
var bodyParser = require('body-parser');
const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Route for Role-Management:
router.post('/show',(req,res)=>{
    const sql='SELECT *FROM Email_templates';
    db.query(sql,(err, result) => {
        if (err) {
            console.error('Error showing data:', err);
            return res.status(500).send('Internal server error');
        }
        return res.status(200).json({ result });
    });
});

router.post('/add',(req,res)=>{
    const {emailId,subject,text}=req.body;
    console.log(emailId);
    const data=[emailId,subject,text];
    const sql='INSERT INTO Email_templates(emailId,subject,text)VALUES(?,?,?)';
    db.query(sql,data,(err,result)=>{
        if (err) {
            console.error('error',err);
            return res.status(500).send("Internal server error");
        }
        return res.status(201).json({result});
    });
});

router.post('/update',(req,res)=>{
    const {id,emailId,subject,text}=req.body;
    let sql='UPDATE Email_templates SET ';
    const updateValues = [];
    if (emailId !== undefined) {
        sql += 'emailId = ?, ';
        updateValues.push(emailId);
    }
    if (subject !== undefined) {
        sql += 'subject = ?, ';
        updateValues.push(subject);
    }
    if (text !== undefined) {
        sql += 'text = ?, ';
        updateValues.push(text);
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

router.post('/search',(req,res)=>{
    const {id}=req.body;
    const sql=`SELECT *FROM Email_templates WHERE id=${id}`;
    db.query(sql,(err,result)=>{
        if (err) {
            console.error('error',err);
            return res.status(500).send("Internal server error");
        }
        return res.status(200).json({result});
    });
});

router.post('/delete',(req,res)=>{
    const {id}=req.body;
    const sql=`DELETE FROM Email_templates WHERE id=${id}`;
    db.query(sql,(err,result)=>{
        if (err) {
            console.error('error',err);
            return res.status(500).send("Internal server error");
        }
        return res.status(200).json({result});
    });
});

module.exports=router;