var express = require('express');
var router = express.Router();
var connection = require('../connection/db')

router.get('/', function(req, res){
    //show all users
   
    connection.query("select * from SalaryType", function(err, result) {
        if (err) {
          console.error('failed: ' + err.stack);
          return;
        }
      
   
      res.status(200).json(result);
   
    });
  
  });

  


router.post('/addsalarytype', function(req, res) {
    const { salary_type } = req.body;
console.log("salary type")
    const sql = "INSERT INTO SalaryType (salary_type) VALUES (?)";
    const values = [salary_type];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding salary type:', err);
            return res.status(500).send('Failed to add salary type');
        }
        console.log('Salary type added successfully');
        res.status(201).json({ result });
    });
});

router.post('/deletesalarytype', function(req, res) {
  const { id } = req.body;
console.log("salary type")
  const sql = "DELETE FROM SalaryType WHERE id = ?";
  const values = [id];

  connection.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error adding salary type:', err);
          return res.status(500).send('Failed to delete salary type');
      }
      console.log('Salary type added successfully');
      res.status(200).json({ result });
  });
});



router.post('/updatesalarytype', function(req, res) {
  const { id, salary_type } = req.body;

  const sql = "UPDATE SalaryType SET salary_type = ? WHERE id = ?";
  const values = [salary_type, id];

  connection.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error updating salary type:', err);
          return res.status(500).send('Failed to update salary type');
      }
      console.log('Salary type updated successfully');
      res.status(200).json({ result });
  });
});



module.exports=router;