var express = require('express');
var router = express.Router();
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
var db = require('../connection/db');

//Route for Role-Management:
router.get('/show',(req,res)=>{
    const sql='SELECT *FROM Role';
    db.query(sql,(err, result) => {
        if (err) {
            console.error('Error showing data:', err);
            return res.status(500).send('Internal server error');
        }
        return res.status(200).json({ result });
    });
});

router.post('/add', (req, res) => {
    const { id, roleName, permissions } = req.body;
    
    const permissions1=[permissions]
    // Convert array of permissions to comma-separated string
    const Permission_id = permissions1.join(',');

    const data = [id, roleName, Permission_id];
    const sql = 'INSERT INTO Role(id, roleName, Permission_id) VALUES (?, ?, ?)';
    
    db.query(sql, data, (err, result) => {
        if (err) {
            console.error('Error', err);
            return res.status(500).send("Internal server error");
        }
        return res.status(201).json({ result });
    });
});


router.post('/update', (req, res) => {
    const { id, roleName, permissions } = req.body;
    
    const permissions1=[permissions]
    // Convert array of permissions to comma-separated string
    const Permission_id = permissions1.join(',');
    
    // Initialize SQL query string
    let sql = 'UPDATE Role SET ';
    
    // Initialize array to store update values
    const updateValues = [];
    
    // Check if roleName is provided
    if (roleName !== undefined) {
        sql += 'roleName = ?, '; // Append roleName placeholder
        updateValues.push(roleName); // Push roleName value to array
    }
    
    // Check if Permission_id is provided
    if (Permission_id !== undefined) {
        sql += 'Permission_id = ?, '; // Append Permission_id placeholder
        updateValues.push(Permission_id); // Push Permission_id value to array
    }
    
    // Check if any fields are provided for update
    if (updateValues.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields provided for update' });
    }
    
    // Remove the trailing comma and space from the SQL query
    sql = sql.slice(0, -2);
    
    // Append WHERE clause to specify the record to be updated
    sql += ' WHERE id = ?';
    
    // Push id value to the updateValues array
    updateValues.push(id);
    
    // Execute the SQL UPDATE query with the updateValues array
    db.query(sql, updateValues, (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            return res.status(500).send('Error updating data');
        }
        
        // Return success response with updated data
        return res.status(200).json({ success: true, message: 'Data updated successfully', result });
    });
});



router.get('/search',(req,res)=>{
    const {id}=req.body;
    const sql=`SELECT *FROM Role WHERE id=${id}`;
    db.query(sql,(err,result)=>{
        if (err) {
            console.error('error',err);
            return res.status(500).send("Internal serevr error");
        }
        return res.status(200).json({result});
    });
});

router.post('/delete',(req,res)=>{
    const {id}=req.body;
    const sql=`DELETE FROM Role WHERE id=${id}`;
    db.query(sql,(err,result)=>{
        if (err) {
            console.error('error',err);
            return res.status(500).send("Internal serevr error");
        }
        return res.status(200).json({result});
    });
});

module.exports=router;