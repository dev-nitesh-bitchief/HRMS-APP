var express = require('express');
var router = express.Router();
var connection = require('../connection/db')

router.get('/', function(req, res) {
    const sql = 'SELECT * FROM Attendance';
    connection.query(sql, (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving attendance data');
            return;
        }
        // res.status(200).json(result);
        res.status(200).render('attendance')
    });
});

router.post('/checkin', (req, res) => {
    const { employee_id, checkIn, checkInLatitude, checkInLongitude } = req.body;
    const checkinLocationLink = `https://maps.google.com/maps?q=${checkInLatitude},${checkInLongitude}`;
  
    // Insert check-in data into the database
    const sql = `INSERT INTO Attendance (employee_id, CheckIn, CheckInLatitude, CheckInLongitude, CheckInLocationLink) 
                 VALUES (?, ?, ?, ?, ?)`;
    const values = [employee_id, checkIn, checkInLatitude, checkInLongitude, checkinLocationLink];
  
    connection.query(sql, values, (err, result) => {
      if (err) {
        console.error('Error inserting check-in data:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      console.log('Check-in data recorded successfully');
      res.status(200).json({ message: 'Check-in data recorded successfully' });
    });
  });
  
  // Function to calculate worked hours in hours and minutes
  function calculateWorkedHours(checkIn, checkOut) {
    const diffInMilliseconds = new Date(checkOut) - new Date(checkIn);
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    const hours = Math.floor(diffInHours);
    const minutes = Math.floor((diffInHours - hours) * 60);
    return { hours, minutes };
  }
  
  
  
  
  // API endpoint for check-out
  router.post('/checkout', (req, res) => {
    const { employee_id, checkOut, checkOutLatitude, checkOutLongitude } = req.body;
    const checkoutLocationLink = `https://maps.google.com/maps?q=${checkOutLatitude},${checkOutLongitude}`;
  
    // Retrieve the check-in time from the database
    const getCheckinTimeSql = ` SELECT CheckIn FROM Attendance WHERE employee_id = 2 ORDER BY id DESC LIMIT 1`;
    connection.query(getCheckinTimeSql, [employee_id], (err, rows) => {
      if (err) {
        console.error('Error retrieving check-in time:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      if (rows.length === 0) {
        res.status(404).json({ error: 'Attendance record not found' });
        return;
      }
  
      const checkIn = new Date(rows[0].CheckIn);
      const { hours, minutes } = calculateWorkedHours(checkIn, new Date(checkOut));
      const workedHours = `${hours} hours ${minutes} minutes`;
  
      // Update check-out data and worked hours in the database
   
      const updateSql = `UPDATE Attendance SET CheckOut = ?, CheckOutLatitude = ?, CheckOutLongitude = ?, CheckOutLocationLink = ?, WorkedHours = ? WHERE employee_id = ? ORDER BY id DESC LIMIT 1`;
      const values = [checkOut, checkOutLatitude, checkOutLongitude, checkoutLocationLink, workedHours, employee_id];
  
      connection.query(updateSql, values, (err, result) => {
        if (err) {
          console.error('Error updating check-out data:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
        console.log('Check-out data updated successfully');
        res.status(200).json({ message: 'Check-out data updated successfully' });
      });
    });
  });
  
  

module.exports = router;