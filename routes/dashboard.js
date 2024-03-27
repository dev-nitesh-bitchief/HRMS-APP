var express = require('express');
var router = express.Router();
var db = require('../connection/db');

router.get('/', function (req, res) {
    res.render('dashboard');
  });

// Define API endpoint to retrieve counts
router.get('/counts', (req, res) => {
    // Query to retrieve counts from the database
    const query = `
      SELECT
        (SELECT COUNT(*) FROM Department) AS departmentCount,
        (SELECT COUNT(*) FROM CompanyRecords) AS companyCount,
        (SELECT COUNT(*) FROM Employee_work_info) AS employeeCount,
        (SELECT COUNT(*) FROM Attendance) AS attendanceCount
    `;
    // Execute the query
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      // Send counts as JSON response
      res.json(results[0]);
    });
  });

module.exports=router;