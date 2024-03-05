var express = require('express');
var router = express.Router();
var connection = require('../connection/db')
var bcrypt = require('bcrypt')

/* GET users listing. */
router.get('/', function(req, res){
  //show all users
 
  connection.query("SELECT u.id, CONCAT(e.firstname, ' ', e.lastname) AS employee_name, u.username, u.password, r.roleName AS role_name, u.status, u.creationDate FROM User u JOIN Employee e ON u.Employee_id = e.id JOIN Role r ON u.Role_id = r.id", function (err, result) {
    if (err) throw err;
 
    res.status(200).json({ result });
 
  });

});



router.post('/adduser', function(req, res) {

    const { Employee_id,username,password,Role_id,status } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            res.send('Hashing error');
            return;
        }
        const data = [Employee_id,username,hash,Role_id,status];
        const sql = "INSERT INTO User (Employee_id,username,password,Role_id,status) VALUES (?,?,?,?,?)"
        connection.query(sql, data, (err, result) => {
            if (err) { throw err; }
            console.log('User data stored successfully');
            res.status(200).json({result});
        });
    });
});






router.post('/updateuser', (req, res) => {
  const { id, Employee_id, username, password, Role_id, status } = req.body;

  // Construct the SQL UPDATE query dynamically based on the provided columns
  let sql = 'UPDATE User SET ';
  const updateValues = [];

  if (Employee_id !== undefined) {
    sql += 'Employee_id = ?, ';
    updateValues.push(Employee_id);
  }
  if (username !== undefined) {
    sql += 'username = ?, ';
    updateValues.push(username);
  }
  if (password !== undefined) {
    sql += 'password = ?, ';
    updateValues.push(password);
  }
  if (Role_id !== undefined) {
    sql += 'Role_id = ?, ';
    updateValues.push(Role_id);
  }
  if (status !== undefined) {
    sql += 'status = ?, ';
    updateValues.push(status);
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



router.post('/deleteuser', function (req, res) {
  const { id } = req.body;

  const data = [id];
  const sql = "DELETE FROM User WHERE id = ?";
  connection.query(sql, data, (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).send('Internal Server Error');
    }
    console.log('User deleted successfully');
    res.status(200).json({ result });
  });
});



router.get('/searchuser', (req, res) => {
  const {id} = req.body;

 
  const sql = "SELECT u.id, CONCAT(e.firstname, ' ', e.lastname) AS employee_name, u.username, u.password, r.roleName AS role_name, u.status, u.creationDate FROM User u JOIN Employee e ON u.Employee_id = e.id JOIN Role r ON u.Role_id = r.id WHERE u.id = ?";
  const values = [id];

  connection.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error executing search query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json({ results });
  });
});

  module.exports = router;
