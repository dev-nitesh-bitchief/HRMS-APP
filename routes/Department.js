var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../connection/db');
const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

router.get('/',(req,res)=>{
    const sql='SELECT *FROM Department';
    db.query(sql,(err,result)=>{
        if (err){
            console.error('error',err);
            return res.status(500).send('Internal server error');
        }
        return res.render('Department',({department:result}));
    });
});

router.post('/add',(req,res)=>{
    const {departmentName,headOfDepartment,description,status}=req.body;
    const data=[departmentName,headOfDepartment,description,status];
    const sql='INSERT INTO Department(departmentName,headOfDepartment,description,status) VALUES(?,?,?,?)';
    db.query(sql,data,(err,result)=>{
        if (err) {
            console.error('error',err);
            return res.send(500).json({message:'Internal server error'});
        }
        return res.redirect('/Department');
    });
});

router.post('/update',(req,res)=>{
    const {id,departmentName,headOfDepartment,description,status}=req.body;
    let sql='UPDATE Department SET ';
    let updateValues=[];
    if (departmentName !== undefined) {
        sql += 'departmentName = ?, '; 
        updateValues.push(departmentName); 
    }
    // if (Company_Id !== undefined) {
    //     sql += 'Company_Id = ?, '; 
    //     updateValues.push(Company_Id); 
    // }
    if (headOfDepartment !== undefined) {
        sql += 'headOfDepartment = ?, '; 
        updateValues.push(headOfDepartment); 
    }
    if (description !== undefined) {
        sql += 'description = ?, '; 
        updateValues.push(description); 
    }
    if (status !== undefined) {
        sql += 'status = ?, '; 
        updateValues.push(status); 
    }
    // Check if any fields are provided for update
    if (updateValues.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields provided for update' });
    }
     // Remove the trailing comma and space from the SQL query
     sql = sql.slice(0, -2);
    
     // Append WHERE clause to specify the record to be updated
     sql += ' WHERE id = ?';
     
     // Push id value to the updateValues array
     updateValues.push(id);
     db.query(sql,updateValues,(err,result)=>{
        if (err) {
            console.error('error',err);
            return res.status(500).send('Internal server error')
        }
        return res.redirect('/Department');
     });
});

router.get('/search',(req,res)=>{
    const {id}=req.body;
    console.log(id)
    const sql=`SELECT * FROM Department WHERE id=${id}`;
    db.query(sql,(err,result)=>{
        if (err) {
            console.error('error',err);
            return res.status(500).send("Internal serevr error");
        }
        return res.status(200).json(result);
        // return res.send(result);
    });
});

router.post('/delete',(req,res)=>{
    const {id}=req.body;
    const sql=`DELETE FROM Department WHERE id=${id}`;
    db.query(sql,(err,result)=>{
        if (err) {
            console.error('error',err);
            return res.status(500).send("Internal serevr error");
        }
        return res.redirect('/Department');
    });
});


module.exports=router;