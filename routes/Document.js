var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../connection/db');
const path= require('path');
const app = express();
const multer = require('multer');
const fs = require('fs');

// Set up Multer for file uploads
const upload = multer({ dest: 'docs/.' });

// Middleware to parse JSON requests
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// show all documnet
router.get('/show', (req, res) => {
    const sql = 'SELECT *FROM Document';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error showing data:', err);
            return res.status(500).send('Internal server error');
        }
        return res.status(200).json({ result });
    });
});

// Create a document
router.post('/add', upload.single('docs'), (req, res) => {
    const { Employee_id, documentName } = req.body;
    const docs = req.file; 

    // Save the uploaded file with filename
    const fileName = docs ? docs.filename : null;
    const filePath = path.join(__dirname, 'docs', fileName);
    // // Read and write the file to server
    fs.writeFileSync(filePath, fs.readFileSync(docs.path));

    const data = [Employee_id, documentName, fileName];
    const sql = 'INSERT INTO Document (Employee_id, documentName, docs) VALUES (?, ?, ?)';
    db.query(sql, data, (err, result) => {
        if (err) {
            console.error('error', err);
            return res.status(500).send("Internal server error");
        }
        return res.status(201).json({ result });
    });
});

//update document
router.post('/update',upload.single('docs'), (req, res) => {
    const { id, Employee_id, documentName } = req.body;
    const docs = req.file; 
    // Save the uploaded file with filename
    const fileName = docs ? docs.filename : null;
    const filePath = path.join(__dirname, 'docs', fileName);
    // // Read and write the file to server
    fs.writeFileSync(filePath, fs.readFileSync(docs.path));

    let sql = 'UPDATE Document SET ';
    const updateValues = [];
    if (Employee_id !== undefined) {
        sql += 'Employee_id = ?, ';
        updateValues.push(Employee_id);
    }
    if (documentName !== undefined) {
        sql += 'documentName = ?, ';
        updateValues.push(documentName);
    }
    if (docs !== undefined) {
        sql += 'docs = ?, ';
        updateValues.push(fileName);
    }
    // Check if any fields are provided for update
    if (updateValues.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields provided for update' });
    }
    // Remove the trailing comma and space
    sql = sql.slice(0, -2);
    sql += ' WHERE id = ?';

    // Add the id value to the updateValues array
    updateValues.push(id);

    // Execute the SQL UPDATE query
    db.query(sql, updateValues, (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            res.status(500).send('Error updating data');
            return;
        }
        return res.status(200).json({ success: true, message: 'Data update successfully', result });
    });
});

// search document
router.get('/search', (req, res) => {
    const { id } = req.body;
    const sql = `SELECT *FROM Document WHERE id=${id}`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('error', err);
            return res.status(500).send("Internal serevr error");
        }
        return res.status(200).json({ result });
    });
});

// delete document
router.post('/delete', (req, res) => {
    const { id } = req.body;
    const sql = `DELETE FROM Document WHERE id=${id}`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('error', err);
            return res.status(500).send("Internal serevr error");
        }
        return res.status(200).json({ result });
    });
});

module.exports = router;