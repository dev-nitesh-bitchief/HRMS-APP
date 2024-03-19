<!-- 
query for inert salary on backend table name : salaryDetails -->

<!-- 
SELECT SD.id,CONCAT(E.firstname,' ',E.lastname) AS Employee_Name,ST.salary_type AS Salary_Type,SD.amount AS Amount FROM SalaryDetails SD JOIN Employee E ON SD.Employee_id = E.id JOIN SalaryType ST ON SD.SalaryType_id = ST.id; -->






<!-- SELECT e.id AS Employee_id, e.firstname AS Employee_name, s.id AS Salary_id, st.salary_type AS SalaryType, sd.salarytypeAmount AS SalaryAmount

    -> FROM Employee e
    -> JOIN Salary s ON e.id = s.Employee_id
    -> JOIN SalaryDetails sd ON s.id = sd.salary_id
    -> JOIN SalaryType st ON sd.salarytype_id = st.id
    -> ORDER BY e.id, st.id; -->




<!-- update SalaryDetails set salarytypeAmount = "15000" where salary_id = 130 && salarytype_id = 1; -->





















<!-- salary backup -->
<!-- var express = require('express');
var router = express.Router();
var connection = require('../connection/db')

const authenticateUser = require('./login');
router.get('/', function(req, res){
    //show all users
   
    connection.query("SELECT s.id, CONCAT(e.firstname, ' ', e.lastname) AS employee_name,st.salary_type, s.netSalary, s.salaryCycle FROM Salary s JOIN Employee e ON s.Employee_id = e.id JOIN SalaryType st ON s.SalaryType_id = st.id", function(err, result) {
      if (err) throw err;
   
      // res.status(200).render('salary',{ salary:result })
      res.render('salary',{ salary : result })
   
    });
  
  });


router.get('/salarytype', function(req, res){
    //show all users
   
    connection.query("select * from SalaryType", function(err, result) {
        if (err) {
          console.error('failed: ' + err.stack);
          return;
        }
      
   
      res.status(200).json({ result });
   
    });
  
  });




router.post('/addsalary', function(req, res) {
  const { Employee_id, SalaryType, netSalary, salaryCycle, salarytypeAmount } = req.body;

  console.log(req.body);


  console.log('salary type are :' + SalaryType)
  console.log('salary type are :' + salarytypeAmount)
  // Convert SalaryType and salarytypeAmount arrays to comma-separated strings
  const SalaryType_for_salary = Array.isArray(SalaryType) ? SalaryType.join(',') : SalaryType;
  const salarytypeAmountforSD = Array.isArray(salarytypeAmount) ? salarytypeAmount.join(',') : salarytypeAmount;

  console.log(SalaryType_for_salary)
  console.log(salarytypeAmountforSD)

  const sql = "INSERT INTO Salary (Employee_id, SalaryType_id, netSalary, salaryCycle) VALUES (?, ?, ?, ?)";
  const values = [Employee_id, SalaryType_for_salary, netSalary, salaryCycle];

  console.log(Employee_id, SalaryType_for_salary, salarytypeAmountforSD, salaryCycle);

  connection.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error adding salary', err);
          return res.status(500).send('Failed to add salary');
      }

      const salary_id = result.insertId;
      console.log(result.insertId);


      for (let i = 0; i < SalaryType_for_salary.split(',').length; i++) {
        console.log(SalaryType_for_salary.split(',').length)
        console.log(salary_id, SalaryType_for_salary.split(',')[i], salarytypeAmountforSD.split(',')[i])
        const sql = "INSERT INTO SalaryDetails (salary_id, SalaryType_id, salarytypeAmount) VALUES (?, ?, ?)";
        const values = [salary_id, SalaryType_for_salary.split(',')[i], salarytypeAmountforSD.split(',')[i]];
    
        connection.query(sql, values, (error, results, fields) => {
            if (error) {
                console.error('Error adding salary details', error);
                return res.status(500).send('Failed to add salary details');
            }
            console.log('Salary and details added successfully');
          });
        }
        
        return res.redirect('/salary');
  });
});






router.post('/updatesalary', (req, res) => {
  const { id, SalaryType_id, netSalary, salaryCycle } = req.body;

  // Construct the SQL UPDATE query dynamically based on the provided columns
  let sql = 'UPDATE Salary SET ';
  const updateValues = [];

 // SalaryType_id | netSalary | salaryCycle
  if (SalaryType_id !== undefined) {
    sql += 'SalaryType_id = ?, ';
    updateValues.push(SalaryType_id);
  }
  if (netSalary !== undefined) {
    sql += 'netSalary = ?, ';
    updateValues.push(netSalary);
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
    // res.status(200).json({ result });
    res.redirect('/salary')
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
      res.redirect('/salary');
  });
});




module.exports=router; -->
