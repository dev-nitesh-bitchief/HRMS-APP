var express = require('express');
var router = express.Router();

var db = require('../connection/db');



router.get('/show',(req,res)=>{
   
    const sql = 'SELECT * FROM Leave_type';
   
    db.query(sql , (err,result)=>{
        if (err) {
            console.error('Error Fetching data:', err);
            res.status(500).json('Error Fetching data');
            return;
        }
        console.log('Data fetched successfully');
        // res.status(200).json(result);
        res.status(200).render('LeaveType' ,{data : result});
        return;

    })
});





router.post('/add', (req, res) => {                              
    
    const { typeName , description } = req.body;

    const sql = 'INSERT INTO Leave_type (typeName , description) VALUES (?, ?)';

    var data = [typeName , description];


    db.query(sql, data, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json('Error inserting data');
            return;
        }
        console.log('Data inserted successfully');
        // res.status(200).json('Data inserted successfully');
        res.status(200).redirect('/Leave-type/show');
        return;
    });
});



router.post('/delete', (req, res) => {
    const {req_id } = req.body;
    console.log('delete id :',req_id);
    const sql = 'DELETE FROM Leave_type WHERE id = ?';


    db.query(sql, req_id, (err, result) => {
        if (err) {
            console.error('Error deleting data:', err);
            res.status(500).json('Error deleted data');
            return;
        }
        console.log('Data deleted successfully');
        // res.status(200).json('Data deleted successfully');
        res.status(200).redirect('/Leave-type/show');
        return;

    })
});








router.post('/edit', (req, res) => {
    // const id = req.body.id;
    
    const { id , typeName , description } = req.body;

   

    // Construct the SQL UPDATE query dynamically based on the provided columns
    let sql = 'UPDATE Leave_type SET ' ;
    const updateValues = [];
    if (typeName !== '') {
        sql += ' typeName = ?, ';
        updateValues.push(typeName);
    }
    if (description !== '') {
        sql += 'description = ?, ';
        updateValues.push(description);
    }
   

    // Remove the trailing comma and space
    sql = sql.slice(0, -2);
    sql += ' WHERE id = ?';

    // Add the id value to the updateValues array
    updateValues.push(id);

    console.log('updated values :',updateValues);

    db.query(sql, updateValues, (err, result) => {
        if (err) {
            console.error('Error in updating :', err);
            res.status(500).json('Internal Server Error');
            return;
        }
        console.log('Leave type updated successfully');
        // res.status(200).json('Leave type updated successfully');
        res.status(200).redirect('/Leave-type/show');
        return;
        
    });


});



router.post('/search', (req, res) => {
    const { id } = req.body;
    const sql = 'SELECT  id , typeName , description FROM Leave_type WHERE id = ?';

    db.query(sql, id, (err, result) => {
        if (err) {
            console.error('Error searching data:', err);
            res.status(500).json('Error searching  data');
            return;
        }
        console.log('Data searched successfully');
        res.status(200).json(result);
        return;

    })
});







module.exports = router;