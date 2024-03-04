var mysql= require('mysql');

const db= mysql.createConnection({
    host:"155.248.241.212",
    user:"hrm",
    password:"India@123",
    database:"HRMS"
});
db.connect((err) => {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
    console.log('Connected to database.');
  });

module.exports=db;