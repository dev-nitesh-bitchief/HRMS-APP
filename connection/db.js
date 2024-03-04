var mysql= require('mysql');

const db= mysql.createConnection({
    host:"155.248.241.212",
    user:"hrm",
    password:"India@123",
    database:"HRMS"
});
 
db.connect((err)=>{
    if (err) throw err;
    console.log("connected")
});

module.exports=db;