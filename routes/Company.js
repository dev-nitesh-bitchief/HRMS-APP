const express = require('express');
const db= require('../connection/db');
const router= express.Router();
const bodyParser = require('body-parser');
const app= express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

router.get('/',(req,res)=>{
    const sql='SELECT * FROM Company';
    db.query(sql,(err,result)=>{
        if (err) {
            console.error('error',err);
            return res.status(500).send('Internal Server error');
        }
        return res.render('Company',({company:result}));
    });
});

router.post('/add',(req,res)=>{
    const {companyName,address,city,state,country,postalCode,phone,email,website,ceo,description,socialMediaLinks,gstin,package,status}=req.body;
    const data =[companyName,address,city,state,country,postalCode,phone,email,website,ceo,description,socialMediaLinks,gstin,package,status];
    const sql='INSERT INTO Company(companyName,address,city,state,country,postalCode,phone,email,website,ceo,description,socialMediaLinks,gstin,package,status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(sql,data,(err,result)=>{
        if (err) {
            console.error('Error',err);
            return res.status(500).send('Internal Server Error');
        }
        return res.redirect('/Company')
    });
});

router.post('/update',(req,res)=>{
    const {id,companyName,address,city,state,country,postalCode,phone,email,website,ceo,description,socialMediaLinks,gstin,package,status} = req.body;
    let sql='UPDATE Company SET ';
    const updateValues=[];
    if (companyName!== undefined) {
        sql += 'companyName = ?, '; 
        updateValues.push(companyName); 
    }
    if (address!== undefined) {
        sql += 'address = ?, '; 
        updateValues.push(address); 
    }
    if (city!== undefined) {
        sql += 'city = ?, '; 
        updateValues.push(city); 
    }
    if (state!== undefined) {
        sql += 'state = ?, '; 
        updateValues.push(state); 
    }
    if (country!== undefined) {
        sql += 'country = ?, '; 
        updateValues.push(country); 
    }
    if (postalCode!== undefined) {
        sql += 'postalCode = ?, '; 
        updateValues.push(postalCode); 
    }
    if (phone!== undefined) {
        sql += 'phone = ?, '; 
        updateValues.push(phone); 
    }
    if (email!== undefined) {
        sql += 'email = ?, '; 
        updateValues.push(email); 
    }
    if (website!== undefined) {
        sql += 'website = ?, '; 
        updateValues.push(website); 
    }
    if (ceo!== undefined) {
        sql += 'ceo = ?, '; 
        updateValues.push(ceo); 
    }
    if (description!== undefined) {
        sql += 'description = ?, '; 
        updateValues.push(description); 
    }
    if (socialMediaLinks!== undefined) {
        sql += 'socialMediaLinks = ?, '; 
        updateValues.push(socialMediaLinks); 
    }
    if (gstin!== undefined) {
        sql += 'gstin = ?, '; 
        updateValues.push(gstin); 
    }
    if (package!== undefined) {
        sql += 'package = ?, '; 
        updateValues.push(package); 
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
        return res.redirect('/Company');
    });
});

router.get('/search',(req,res)=>{
    const {id}= req.body;
    const sql='SELECT * FROM Company WHERE id=?';
    db.query(sql,(err,result)=>{
        if (err) {
            console.error('Error',err);
            return res.status(500).send('Internal Server Error');
        }
        // return res.render('Company');
        return res.status(200).json(result);
    });
});

router.post('/delete',(req,res)=>{
    const {id}= req.body;
    const sql='DELETE FROM Company WHERE id=?';
    db.query(sql,(err,result)=>{
        if (err) {
            console.error('Error',err);
            return res.status(500).send('Internal Server Error');
        }
        return res.redirect('/Company');
    });
});

module.exports=router;