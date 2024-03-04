var express = require('express');
var router = express.Router();
var connection = require('../connection/db')
var bcrypt = require('bcrypt')

/* GET users listing. */
router.get('/', function(req, res){
  //show all users
 
  connection.query("select * from User", function (err, result) {
    if (err) throw err;
 
    res.status(200).json({ result });
 
  });

});









router.post('/add-user', function(req, res) {

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











router.post('/update-user', (req, res) => {
  const { Employee_id,username,password,Role_id,status } = req.body;
 

  // Construct the SQL UPDATE query dynamically based on the provided columns
  let sql = 'UPDATE User SET ';
  const updateValues = [];
  if (username !== '') {
    sql += 'username = ?, ';
    updateValues.push(username);
  }
  if (password !== '') {
    sql += 'password = ?, ';
    updateValues.push(password);
  }
  if (Role_id !== '') {
    sql += 'Role_id = ?, ';
    updateValues.push(Role_id);
  }
  if (status !== '') {
    sql += 'status = ?, ';
    updateValues.push(status);
  }
  // Remove the trailing comma and space
  sql = sql.slice(0, -2);
  sql += ' WHERE id = ?';

  // Add the id value to the updateValues array
  updateValues.push(Employee_id);

  con.query(sql, updateValues, (err, result) => {
    if (err) {
      console.error('Error updating user role:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    console.log('User role updated successfully');
    res.redirect('/users');
  });
});







router.post('/delete-user', function (req, res) {
  const { Employee_id } = req.body;

  const data = [Employee_id];
  const sql = "DELETE FROM User WHERE Employee_id = ?";
  connection.query(sql, data, (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).send('Internal Server Error');
    }
    console.log('User deleted successfully');
    res.status(200).json({ result });
  });
});



  module.exports = router;
