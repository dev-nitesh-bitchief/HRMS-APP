var express = require('express');
const moment = require('moment');
var router = express.Router();


var db = require('../connection/db');



router.get('/create', (req, res) => {

    res.status(200).render('CreatePayroll');
})



router.get('/SalarySlip', (req, res) => {

    const sql = `SELECT
   
    p.id AS Payroll_id,
    e.id AS Employee_id,
    CONCAT(e.firstName, ' ', e.lastName) AS employeeName,
    pc.id AS Payroll_cycle_id,
    m.monthName AS month,
    y.year AS year,
    p.salary,
    s.netSalary,
    p.expenseClaim,
    p.absentDeduction,
    p.netPay,
    p.status,
    p.dateCreated
FROM
    Payroll p
LEFT JOIN
    Employee e ON p.Employee_id = e.id
LEFT JOIN
    Payroll_cycle pc ON p.Payroll_cycle_id = pc.id
LEFT JOIN
    Month m ON p.Month_id = m.id
LEFT JOIN
    Year y ON p.Year_id = y.id
LEFT JOIN
    Salary s ON p.Salary_id = s.id;
 `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error Fetching data:', err);
            res.status(500).json('Error Fetching data');
            return;
        }

        // Format the dateCreated property for each row in the result set
        result.forEach(row => {
            row.dateCreated = formatDate(row.dateCreated);
        });

        function formatDate(dateString) {
            if (!dateString) {
                return ''; // Return empty string if dateString is null or undefined
            }

            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        }


        console.log('Data fetched successfully');
        // res.status(200).json(result);
        res.status(200).render('SalarySlip', { data: result });
        return;

    })

})




router.get('/show', (req, res) => {

    const sql = `SELECT
   
    p.id AS Payroll_id,
    e.id AS Employee_id,
    CONCAT(e.firstName, ' ', e.lastName) AS employeeName,
    pc.id AS Payroll_cycle_id,
    m.monthName AS month,
    p.year,
    s.netSalary,
    p.expenseClaim,
    p.absentDeduction,
    p.netPay,
    p.status,
    p.dateCreated
FROM
    Payroll p
LEFT JOIN
    Employee e ON p.Employee_id = e.id
LEFT JOIN
    Payroll_cycle pc ON p.Payroll_cycle_id = pc.id
LEFT JOIN
    Month m ON p.Month_id = m.id

LEFT JOIN
    Salary s ON p.Salary_id = s.id;
 `;

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error Fetching data:', err);
            res.status(500).json('Error Fetching data');
            return;
        }

        // Format the dateCreated property for each row in the result set
        result.forEach(row => {
            row.dateCreated = formatDate(row.dateCreated);
        });

        function formatDate(dateString) {
            if (!dateString) {
                return ''; // Return empty string if dateString is null or undefined
            }

            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        }


        console.log('Data fetched successfully');
        // res.status(200).json(result);
        res.status(200).render('Payroll', { data: result });
        return;

    })
});





router.post('/add', (req, res) => {
    // const leaveRequestData = req.body;
    const { Employee_id, month, year, salary, expenseClaim, absentDeduction, netPay, status } = req.body;

    const sql = 'INSERT INTO Payroll ( Employee_id, Month_id , Year_id , salary , expenseClaim , absentDeduction , netPay , status ) VALUES(?,?,?,?,?,?,?,?)';

    var data = [Employee_id, month, year, salary, expenseClaim, absentDeduction, netPay, status];

    console.log(data);


    db.query(sql, data, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json('Error inserting data');
            return;
        }
        console.log('Payroll data inserted successfully');
        // res.status(200).json('Payroll data inserted successfully');
        res.status(200).json({ message: 'Payroll added successfully' });


        return;
    });
});





router.post('/delete', (req, res) => {
    const { Payroll_id } = req.body;

    sql = 'DELETE FROM Payroll WHERE id = ?';

    db.query(sql, Payroll_id, (err, result) => {
        if (err) {
            console.error('Error deleting data:', err);
            res.status(500).json('Error deleted data');
            return;
        }
        console.log('Data deleted successfully');
        // res.status(200).json('Data deleted successfully');
        res.status(200).redirect('/Payroll/show');
        return;

    });
});





router.post('/edit', (req, res) => {
    // const id = req.body.id;

    const { id, employee_id, salary_id, department_id, Payroll_cycle_id, refNo, dateFrom, dateTo, presentDays, absentDays, salary_type, totalExpense, net_salary } = req.body;

    sql = `UPDATE Payroll
     SET
       employee_id = ?,
       salary_id = ?,
       department_id = ?,
       Payroll_cycle_id = ?,
       refNo = ?,
       dateFrom = ?,
       dateTo = ?,
       presentDays = ?,
       absentDays = ?,
       salary_type = ?,
       totalExpense = ?,
       net_salary = ?
     WHERE
       id = ?`;

    const data = [employee_id, salary_id, department_id, Payroll_cycle_id, refNo, dateFrom, dateTo, presentDays, absentDays, salary_type, totalExpense, net_salary, id];


    db.query(sql, data, (err, result) => {
        if (err) {
            console.error('Error in updating :', err);
            res.status(500).json('Internal Server Error');
            return;
        }
        console.log('Payroll updated successfully');
        res.status(200).json('Payroll updated successfully');
        return;

    });


});



//Dropdown options for employee in add leave balance ( admin )
router.post('/salary', (req, res) => {

    const { Employee_id } = req.body;

    const sql = "SELECT netSalary FROM Salary where Employee_id = ?";


    db.query(sql, Employee_id, (error, results) => {
        if (error) {
            console.error('Error retrieving data from database: ' + error.stack);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        res.status(200).json(results);
    });
});


router.post('/presentDays', (req, res) => {
    const { Employee_id, month, year } = req.body;

    const sql = `SELECT COUNT(DISTINCT DATE(CheckIn)) AS total_present_days
    FROM Attendance
    WHERE Employee_id = ?
      AND YEAR(CheckIn) = ?
      AND MONTH(CheckIn) = ?`;

    const data = [Employee_id, year, month];

    db.query(sql, data, (error, results) => {
        if (error) {
            console.error('Error retrieving data from database: ' + error.stack);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        res.status(200).json(results);
    });
})









function getDatesForMonth(year, month) {
    const daysInMonth = moment(`${year}-${month}`, 'YYYY-MM').daysInMonth();
    const dates = [];

    for (let i = 1; i <= daysInMonth; i++) {
        const date = moment(`${year}-${month}-${i}`, 'YYYY-MM-DD');
        dates.push(date.format('YYYY-MM-DD'));
    }

    return dates;
}




// Function to filter out weekends start from 0 = sunday.
function removeDayFromDate(dates, dayToRemove) {
    return dates.filter(date => moment(date).day() !== dayToRemove);
}





function getHolidays(year, month) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT holidayDate FROM Holiday_lists WHERE month_id = ?';
        db.query(query, [month], (err, results) => {
            if (err) {
                reject(err);
            } else {
                const holidays = results.map(row => {
                    const holidayDate = new Date(row.holidayDate);
                    // Adjust month value by subtracting 1
                    return new Date(holidayDate.getFullYear(), holidayDate.getMonth(), holidayDate.getDate());
                });
                resolve(holidays);
               
            }
        });
    });
}





// Function to fetch attendance data for the employee
function getAttendanceData(employeeId, year, month) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT DISTINCT DATE(CheckIn) AS checkInDate FROM Attendance WHERE Employee_id = ? AND YEAR(CheckIn) = ? AND MONTH(CheckIn) = ?';
        db.query(query, [employeeId, year, month], (err, results) => {
            if (err) {
                reject(err);
            } else {
                const attendanceDates = results.map(row => new Date(row.checkInDate));
                resolve(attendanceDates);
            }

        });

    });
}



// Function to fetch approved leave dates for the employee
function getApprovedLeaves(employeeId, year, month) {
    return new Promise((resolve, reject) => {
        const query = `SELECT startDate, endDate 
                       FROM Leave_request 
                       WHERE Employee_id = ? 
                         AND status = 'Approved' 
                         AND MONTH(startDate) = ? 
                         AND YEAR(startDate) = ?`;
        db.query(query, [employeeId, month, year], (err, results) => {
            if (err) {
                reject(err);
            } else {
                const leaves = [];
                for (const row of results) {
                    const start = new Date(row.startDate);
                    const end = new Date(row.endDate);
                    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
                        leaves.push(new Date(date));
                    }
                }
                resolve(leaves);

            }
        });
    });
}


// Main function to calculate absent days
// async function calculateAbsentDays(employeeId, year, month) {
//     try {
//         const dates = getDatesForMonth(year, month);
//         const workingDays = filterWeekends(dates);
//         const holidays = await getHolidays(year, month);
//         const attendanceDates = await getAttendanceData(employeeId, year, month);
//         const approvedLeaves = await getApprovedLeaves(employeeId, year, month);

//         console.log('Apprved leaves inside :', approvedLeaves);
//         console.log('Holidays :', holidays);

//         const absentDays = workingDays.filter(date => !holidays.includes(date) && !attendanceDates.includes(date) && !approvedLeaves.includes(date));

//         console.log('Absent days:', absentDays);
//         console.log('Number of absent days:', absentDays.length);
//     } catch (error) {
//         console.error('Error:', error);
//     } finally {
//         // Close the database connection
//         // db.end();
//     }
// }


// Main function to calculate absent days
async function calculateAbsentDays(employeeId, year, month) {
    try {
        const dates = getDatesForMonth(year, month);

        console.log('date length:', dates.length);
       

        const dayToRemove = 0; // Assuming 0 represents Sunday
        const workingDays = await  removeDayFromDate(dates, dayToRemove);
        

        const holidays = await getHolidays(year, month);
        const attendanceDates = await getAttendanceData(employeeId, year, month);
        const approvedLeaves = await getApprovedLeaves(employeeId, year, month);
        
        console.log('Dates:', dates);
        console.log("Working Days (Excluding Sundays):", workingDays.length);
        console.log('Holidays:', holidays.length);
        console.log('Attendance Dates:', attendanceDates.length);
        console.log('Approved Leaves:', approvedLeaves.length);

        // Convert dates to ISO strings for comparison
        const holidayStrings = holidays.map(date => date.toISOString().split('T')[0]);
        const attendanceDateStrings = attendanceDates.map(date => date.toISOString().split('T')[0]);
        const approvedLeaveStrings = approvedLeaves.map(date => date.toISOString().split('T')[0]);

        const absentDays = workingDays.filter(date => {
            const dateString = date;
            return !holidayStrings.includes(dateString) &&
                !attendanceDateStrings.includes(dateString) &&
                !approvedLeaveStrings.includes(dateString);
        });

        console.log('Absent Days:', absentDays);
        console.log('Number of Absent Days:', absentDays.length);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the database connection or any other cleanup
    }
}

// Example usage
const employeeId = 3;
const year = 2024;
const month = 3; // March
calculateAbsentDays(employeeId, year, month);









module.exports = router;