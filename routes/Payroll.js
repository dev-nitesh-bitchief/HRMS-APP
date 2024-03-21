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





router.post('/salaryDetails', (req, res) => {
    try {
        const { Employee_id, month, year } = req.body;

        const sql = `SELECT e.id AS Employee_id, e.firstname AS Employee_name, s.id AS Salary_id, st.salary_type AS SalaryType, sd.salarytypeAmount AS SalaryAmount
    FROM Employee e
    JOIN Salary s ON e.id = s.Employee_id
    JOIN SalaryDetails sd ON s.id = sd.salary_id
    JOIN SalaryType st ON sd.salarytype_id = st.id
    WHERE Employee_id = ?
    ORDER BY e.id, st.id `;

        const data = [Employee_id];

        db.query(sql, data, async (error, result) => {
            if (error) {
                console.error('Error retrieving data from database: ' + error.stack);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            // console.log(result);

            // res.status(200).json(results);

            const salariesByType = {};

            result.forEach(salary => {
                const { SalaryType, SalaryAmount } = salary;
                salariesByType[SalaryType] = SalaryAmount;
            });

            // console.log(salariesByType);
            // console.log("basic salary:", salariesByType.basic);

            const absent_days = await calculateAbsentDays(Employee_id, year, month);
            console.log('absent days 123', absent_days);

            const monthIndex = (month - 1);
            const daysInMonth = new Date(year, monthIndex, 0).getDate();
            
            const absentDeduction = ((salariesByType.basic / daysInMonth) * absent_days).toFixed(2);
            console.log("absent deduction :", absentDeduction);

            salariesByType.absentDeduction = absentDeduction;
            console.log("Payroll :", salariesByType);

            const array = [salariesByType];


            res.status(200).render('CreatePayroll', { Payroll : array });

            return;
        });


    } catch (error) {
        console.error('Error retrieving data from database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});




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
async function calculateAbsentDays(employeeId, year, month) {
    try {
        const dates = getDatesForMonth(year, month);

        console.log('date length:', dates.length);


        const dayToRemove = 0; // Assuming 0 represents Sunday
        const workingDays = await removeDayFromDate(dates, dayToRemove);


        const holidays = await getHolidays(year, month);
        const attendanceDates = await getAttendanceData(employeeId, year, month);
        const approvedLeaves = await getApprovedLeaves(employeeId, year, month);

        // console.log('Dates:', dates);
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

        // console.log('Absent Days:', absentDays);
        // console.log('Number of Absent Days:', absentDays.length);
        return absentDays.length;


    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the database connection or any other cleanup
    }
}

// Example usage
// const employeeId = 3;
// const year = 2024;
// const month = 3; // March
// calculateAbsentDays(employeeId, year, month);











module.exports = router;