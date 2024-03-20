const express = require('express');
const db= require('../connection/db');
const router= express.Router();
const bodyParser = require('body-parser');
const app= express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

router.get('/',(req,res)=>{
    // const sql='SELECT sp.plan_name, c.companyName, c.status  FROM SubscriptionPlan sp JOIN Company c ON sp.plan_id = c.id';
    const sql='SELECT * FROM CompanyRecords';
    db.query(sql,(err,result)=>{
        if (err) {
            console.error('error',err);
            return res.status(500).send('Internal Server error');
        }
        return res.render('CompanyRecord',({records:result}));
    });
});

router.post('/add',(req,res)=>{
    const {company,package,createDate,status}=req.body;
    const data =[company,package,createDate,status];
    const sql='INSERT INTO CompanyRecords(company,package,createDate,status) VALUES(?,?,?,?)';
    db.query(sql,data,(err,result)=>{
        if (err) {
            console.error('Error',err);
            return res.status(500).send('Internal Server Error');
        }
        return res.redirect('/CompanyRecord')
    });
});

router.post('/update',(req,res)=>{
    const {id,company,package,createDate,status} = req.body;
    let sql='UPDATE CompanyRecords SET ';
    const updateValues=[];
    if (company!== undefined) {
        sql += 'company = ?, '; 
        updateValues.push(company); 
    }
    if (package!== undefined) {
        sql += 'package = ?, '; 
        updateValues.push(package); 
    }
    if (createDate!== undefined) {
        sql += 'createDate = ?, '; 
        updateValues.push(createDate); 
    }
    if (status!== undefined) {
        sql += 'status = ?, '; 
        updateValues.push(status); 
    }
    if (updateValues.length===0){
        return res.status(400).json({ success: false, message: 'No fields provided for update' });
    }
    sql= sql.slice(0,-2);
    sql+= 'where id=?';
    updateValues.push(id);
    db.query(sql,updateValues,(err,result)=>{
        if (err) {
            console.error('Error',err);
            return res.status(500).send('Internal Server Error');
        }
        return res.redirect('/CompanyRecord');
    });
});

router.get('/search',(req,res)=>{
    const {id}= req.body;
    const sql='SELECT * FROM CompanyRecords WHERE id=?';
    db.query(sql,(err,result)=>{
        if (err) {
            console.error('Error',err);
            return res.status(500).send('Internal Server Error');
        }
        return res.redirect('/CompanyRecord');
    });
});

router.post('/delete',(req,res)=>{
    const {id}= req.body;
    const sql='DELETE FROM CompanyRecords WHERE id=?';
    db.query(sql,(err,result)=>{
        if (err) {
            console.error('Error',err);
            return res.status(500).send('Internal Server Error');
        }
        return res.redirect('/CompanyRecord');
    });
});

module.exports=router;