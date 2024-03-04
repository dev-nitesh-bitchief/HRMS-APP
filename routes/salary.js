var express = require('express');
var router = express.Router();
var connection = require('../connection/db')

router.get('/', function(req, res){
    //show all users
   
    connection.query("SELECT s.id, CONCAT(e.firstname, ' ', e.lastname) AS employee_name, st.salary_type, s.salaryAmount, s.salaryCycle FROM Salary s JOIN Employee e ON s.Employee_id = e.id JOIN SalaryType st ON s.SalaryType_id = st.id", function(err, result) {
      if (err) throw err;
   
      res.status(200).json({ result });
   
    });
  
  });


router.post('/addsalary', function(req, res) {
    const {Employee_id,SalaryType_id,salaryAmount,salaryCycle } = req.body;
    const sql = "INSERT INTO Salary (Employee_id,SalaryType_id,salaryAmount,salaryCycle) VALUES (?,?,?,?)";
    const values = [Employee_id,SalaryType_id,salaryAmount,salaryCycle];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding salary', err);
            return res.status(500).send('Failed to add salary type');
        }
        console.log('Salary added successfully');
        res.status(200).json({ result });
    });
});

module.exports=router;
