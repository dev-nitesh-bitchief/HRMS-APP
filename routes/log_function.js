


var db = require('../connection/db');


const logActivity = (req, res , activityData) => {
    const { User_id, activityType, resourceName, operation, databaseTableName, previousValues, enteredValues, ipAddress, location, browserDetails } = activityData;
     
    console.log('logactivity : ', activityData);
    console.log('logactivity : ', location);

    const sql = `INSERT INTO Audit_logging (User_id, activityType, resourceName, operation, databaseTableName, previousValues, enteredValues, ipAddress, location, browserDetails) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const data = [User_id, activityType, resourceName, operation, databaseTableName, previousValues, enteredValues, ipAddress, location, browserDetails];

    db.query(sql, data, (err, result) => {
        if (err) {
            console.error('Error executing MySQL query:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        console.log('Log successfully inserted with ID:', result.insertId);
        
    });
};

module.exports = logActivity;