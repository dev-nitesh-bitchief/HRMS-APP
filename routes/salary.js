var express = require('express');
var router = express.Router();
var connection = require('../connection/db')

const authenticateUser = require('./login');
router.get('/', function (req, res) {
  //show all users

  connection.query("SELECT s.id, CONCAT(e.firstname, ' ', e.lastname) AS employee_name,st.salary_type, s.netSalary, s.salaryCycle FROM Salary s JOIN Employee e ON s.Employee_id = e.id JOIN SalaryType st ON s.SalaryType_id = st.id", function (err, result) {
    if (err) throw err;

    // res.status(200).render('salary',{ salary:result })
    res.render('salary', { salary: result })

  });

});


router.get('/salarytype', function (req, res) {
  //show all users

  connection.query("select * from SalaryType", function (err, result) {
    if (err) {
      console.error('failed: ' + err.stack);
      return;
    }


    res.status(200).json({ result });

  });

});


router.get('/salarytypewithamount', function (req, res) {
  //show all users

  connection.query("select * from SalaryDetails", function (err, result) {
    if (err) {
      console.error('failed: ' + err.stack);
      return;
    }


    res.status(200).json({ result });

  });  

});




router.post('/addsalary', function (req, res) {
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





router.post('/updatesalary', async (req, res) => {
  try {
    const { id, Employee_id, SalaryType, netSalary, salaryCycle, salarytypeAmount } = req.body;

    console.log(req.body);

    console.log('salary type are :' + SalaryType);
    console.log('salary type are :' + salarytypeAmount);

    // Convert SalaryType and salarytypeAmount arrays to comma-separated strings
    const SalaryType_for_salary = Array.isArray(SalaryType) ? SalaryType.join(',') : SalaryType;
    const salarytypeAmountforSD = Array.isArray(salarytypeAmount) ? salarytypeAmount.join(',') : salarytypeAmount;

    console.log(SalaryType_for_salary);
    console.log(salarytypeAmountforSD);

    const updateSalaryQuery = "UPDATE Salary SET SalaryType_id = ?, netSalary = ? WHERE id = ?";
    const updateSalaryValues = [SalaryType_for_salary, netSalary, id];

    console.log(Employee_id, SalaryType, salarytypeAmountforSD, salaryCycle);

    await new Promise((resolve, reject) => {
      connection.query(updateSalaryQuery, updateSalaryValues, (err, result) => {
        if (err) {
          console.error('Error updating salary', err);
          reject('Failed to update salary');
        } else {
          console.log('Salary updated successfully');
          resolve();
        }
      });
    });

    const deleteSalaryDetailsQuery = "DELETE FROM SalaryDetails WHERE salary_id = ?";
    const deleteSalaryDetailsValues = [id];

    await new Promise((resolve, reject) => {
      connection.query(deleteSalaryDetailsQuery, deleteSalaryDetailsValues, (err, result) => {
        if (err) {
          console.error('Error deleting salary details', err);
          reject('Failed to delete salary details');
        } else {
          console.log('Salary details deleted successfully');
          resolve();
        }
      });
    });

    for (let i = 0; i < SalaryType_for_salary.split(',').length; i++) {
      console.log(SalaryType_for_salary.split(',').length);
      console.log(id, SalaryType_for_salary.split(',')[i], salarytypeAmountforSD.split(',')[i]);
      const insertSalaryDetailsQuery = "INSERT INTO SalaryDetails (salary_id, SalaryType_id, salarytypeAmount) VALUES (?, ?, ?)";
      const insertSalaryDetailsValues = [id, SalaryType_for_salary.split(',')[i], salarytypeAmountforSD.split(',')[i]];

      await new Promise((resolve, reject) => {
        connection.query(insertSalaryDetailsQuery, insertSalaryDetailsValues, (err, results, fields) => {
          if (err) {
            console.error('Error adding salary details', err);
            reject('Failed to add salary details');
          } else {
            console.log('Salary details added successfully');
            resolve();
          }
        });
      });
    }

    res.redirect('/salary');
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
});









  router.post('/deletesalary', function (req, res) {
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




  module.exports = router;
