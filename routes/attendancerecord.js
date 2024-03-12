var express = require('express');
var router = express.Router();
var connection = require('../connection/db')




router.get('/', function(req, res) {
    const sql = "select a.id,CONCAT(e.firstname,' ',e.lastname) AS EmployeeName,a.CheckIn,a.CheckOut,a.CheckInLocationLink,a.CheckOutLocationLink,a.CheckInLatitude,a.CheckInLongitude,a.CheckOutLatitude,a.CheckOutLongitude,a.WorkedHours,a.AttendanceReason from Attendance a join Employee e on a.employee_id = e.id;";
    connection.query(sql, (err, result) => {
        if (err) {
            res.status(500).send('Error retrieving attendance data');
            return;
        }
        // res.status(200).json(result);
        res.status(200).render('attendancerecord',{attendancerecord : result})
    });
});


module.exports = router;