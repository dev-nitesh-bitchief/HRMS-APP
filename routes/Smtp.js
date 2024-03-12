var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../connection/db');
const path = require('path');
const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




    router.get('/show', (req, res) => {

        const sql = 'SELECT *FROM Smtp_configuration';
        db.query(sql, (err, result) => {
            if (err) {
                console.error('error fetching data', err);
                res.status(500).send("Internal server error");
            }
            return res.status(200).json({ result });
        });
    });

    router.post('/add', (req, res) => {
        const { smtpHost, smtpPort, username, password, encryption, fromName, fromEmail } = req.body;
        const data = [smtpHost, smtpPort, username, password, encryption, fromName, fromEmail];
        const sql = 'INSERT INTO Smtp_configuration(smtpHost,smtpPort,username,password,encryption,fromName,fromEmail) VALUES (?,?,?,?,?,?,?)';
        db.query(sql, data, (err, result) => {
            if (err) {
                console.error('faild inserting data', err);
                return res.status(500).send("Internal server error");
            }
            return res.status(201).json({ result });
        });
    });

    router.post('/update', (req, res) => {
        const { id, smtpHost, smtpPort, username, password, encryption, fromName, fromEmail } = req.body;

        console.log(id);


        let sql = 'UPDATE Smtp_configuration SET ';
        const updateValues = [];
        if (smtpHost !== undefined) {
            sql += 'smtpHost =?, ';
            updateValues.push(smtpHost);
        }
        if (smtpPort !== undefined) {
            sql += 'smtpPort =?, ';
            updateValues.push(smtpPort);
        }
        if (username !== undefined) {
            sql += 'username =?, ';
            updateValues.push(username);
        }
        if (password !== undefined) {
            sql += 'password =?, ';
            updateValues.push(password);
        }
        if (encryption !== undefined) {
            sql += 'encryption =?, ';
            updateValues.push(encryption);
        }
        if (fromName !== undefined) {
            sql += 'fromName =?, ';
            updateValues.push(fromName);
        }
        if (fromEmail !== undefined) {
            sql += 'fromEmail =?, ';
            updateValues.push(fromEmail);
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




    router.get('/search', (req, res) => {

        const { id } = req.body;
        const sql = `SELECT *FROM Smtp_configuration WHERE id=${id}`;
        db.query(sql, (err, result) => {
            if (err) {
                console.error('error', err);
                return res.status(500).send("Internal serevr error");
            }
            return res.status(200).json({ result });
        });
    });

    router.post('/delete', (req, res) => {
        const { id } = req.body;
        const sql = `DELETE FROM Smtp_configuration WHERE id=${id}`;
        db.query(sql, (err, result) => {
            if (err) {
                console.error('error', err);
                return res.status(500).send("Internal serevr error");
            }
            return res.status(200).json({ result });
        });
    });

    module.exports = router;