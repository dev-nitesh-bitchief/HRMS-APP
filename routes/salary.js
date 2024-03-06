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
            return res.status(500).send('Failed to add salary');
        }
        console.log('Salary added successfully');
        res.status(200).json({ result });
    });
});


router.post('/updatesalary', (req, res) => {
  const { id, SalaryType_id, salaryAmount, salaryCycle } = req.body;

  // Construct the SQL UPDATE query dynamically based on the provided columns
  let sql = 'UPDATE Salary SET ';
  const updateValues = [];

 // SalaryType_id | salaryAmount | salaryCycle
  if (SalaryType_id !== undefined) {
    sql += 'SalaryType_id = ?, ';
    updateValues.push(SalaryType_id);
  }
  if (salaryAmount !== undefined) {
    sql += 'salaryAmount = ?, ';
    updateValues.push(salaryAmount);
  }
  if (salaryCycle !== undefined) {
    sql += 'salaryCycle = ?, ';
    updateValues.push(salaryCycle);
  }

  // Remove the trailing comma and space
  sql = sql.slice(0, -2);
  sql += ' WHERE id = ?';

  // Add the id value to the updateValues array
  updateValues.push(id);

  connection.query(sql, updateValues, (err, result) => {
    if (err) {
      console.error('Error updating user role:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log('User role updated successfully');
    res.status(200).json({ result });
  });
});


router.post('/deletesalary', function(req, res) {
  const { id } = req.body;
  const sql = "DELETE FROM Salary WHERE id = ?";
  const values = [id];
  
  connection.query(sql, values, (err, result) => {
      if (err) {
          console.error("Error deleting salary:", err);
          return res.status(500).send('Failed to delete salary');
      }
      console.log('Salary deleted successfully');
      res.status(200).json({ result });
  });
});




module.exports=router;
