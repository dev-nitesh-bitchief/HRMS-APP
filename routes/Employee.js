var express = require('express');
var router = express.Router();
var db = require('../connection/db');

router.post('/add', (req, res) => {

    const { firstName, lastName, gender, dob, phoneNumber, email, bloodGroup, religion, maritalStatus, aadharNumber, panCardNumber, drivingLicenseNumber, fatherName, fatherOccupation, fatherPhoneNumber, motherName, motherOccupation, motherPhoneNumber, currentAddress, permanentAddress, emergencyName, emergencyRelation, emergencyPhoneNumber, emergencyEmail, emergencyAddress, tenthSchoolName, tenthBoardName, tenthYearofGraduation, tenthMarks, twelfthSchoolName, twelfthBoardName, twelfthYearofGraduation, twelfthMarks, ugInstituteName, ugCourseName, ugYearOfGraduation, ugMarks, pgInstituteName, pgCourseName, pgYearOfGraduation, pgMarks, furtherStudies, jobPosition, department, dateOfJoining, previousCompany, previousPositionField, previousReason, bankName, accountNumber, accountHolderName, branchAddress, ifscCode, image, signImage } = req.body;


    const sqlquery = `INSERT INTO Employee(firstName, lastName, gender, dob, phoneNumber, email, bloodGroup, religion, maritalStatus, aadharNumber, panCardNumber, drivingLicenseNumber, fatherName, fatherOccupation, fatherPhoneNumber, motherName, motherOccupation, motherPhoneNumber, currentAddress, permanentAddress, emergencyName, emergencyRelation, emergencyPhoneNumber, emergencyEmail, emergencyAddress, 10thSchoolName, 10thBoardName, 10thYearofGraduation,10thMarks, 12thSchoolName,12thBoardName, 12thYearofGraduation,12thMarks,ugInstituteName,ugCourseName,ugYearOfGraduation,ugMarks,pgInstituteName,pgCourseName,pgYearOfGraduation,pgMarks,furtherStudies,jobPosition,department,dateOfJoining,previousCompany,previousPositionField,previousReason,bankName,accountNumber,accountHolderName,branchAddress,ifscCode,image,signImage) VALUES 
    (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`


    const data = [firstName, lastName, gender, dob, phoneNumber, email, bloodGroup, religion, maritalStatus, aadharNumber, panCardNumber, drivingLicenseNumber, fatherName, fatherOccupation, fatherPhoneNumber, motherName, motherOccupation, motherPhoneNumber, currentAddress, permanentAddress, emergencyName, emergencyRelation, emergencyPhoneNumber, emergencyEmail, emergencyAddress, tenthSchoolName, tenthBoardName, tenthYearofGraduation, tenthMarks, twelfthSchoolName, twelfthBoardName, twelfthYearofGraduation, twelfthMarks, ugInstituteName, ugCourseName, ugYearOfGraduation, ugMarks, pgInstituteName, pgCourseName, pgYearOfGraduation, pgMarks, furtherStudies, jobPosition, department, dateOfJoining, previousCompany, previousPositionField, previousReason, bankName, accountNumber, accountHolderName, branchAddress, ifscCode, image, signImage];


    db.query(sqlquery, data, (err, result) => {
        if (err) {
            console.error('Error Inserting Data', err);
            res.status(500).json('Error Inserting data');
            return;
        }
        console.log('Data Inserted Successfully');
        res.status(200).json('Data Inserted Successfully');
        return;
    });
});

router.post('/delete', (req, res) => {
    const { id } = req.body;
    const sqlquery = `DELETE  FROM Employee WHERE id = ${id}`;

    db.query(sqlquery, (err, result) => {
        if (err) {
            console.error('Error Deleting Data', err);
            res.status(500).json('Error Deleting data');
            return;
        }
        console.log('Data Deleted Successfully');
        res.status(200).json('Data Deleted Successfully');
        return;
    });
});


router.get('/search', (req, res) => {
    const { id } = req.body;
    const sqlquery = `SELECT * FROM Employee WHERE id = ${id}`;

    db.query(sqlquery, (err, result) => {
        if (err) {
            console.error('Error While Searching Data', err);
            res.status(500).json('Error While Searching data');
            return;
        }
        if (result.length === 0) {
            console.log('No data found');
            return res.status(404).json('No data found');
        }

        console.log('Data Search Successfully');
        res.status(200).json(result);
        return;
    });
});

router.post('/update', (req, res) => {
    const { id } = req.body;
    const {
        firstName, lastName, gender, dob, phoneNumber, email, bloodGroup, religion, maritalStatus, aadharNumber,
        panCardNumber, drivingLicenseNumber, fatherName, fatherOccupation, fatherPhoneNumber, motherName,
        motherOccupation, motherPhoneNumber, currentAddress, permanentAddress, emergencyName, emergencyRelation,
        emergencyPhoneNumber, emergencyEmail, emergencyAddress, tenthSchoolName, tenthBoardName, tenthYearofGraduation,
        tenthMarks, twelfthSchoolName, twelfthBoardName, twelfthYearofGraduation, twelfthMarks, ugInstituteName,
        ugCourseName, ugYearOfGraduation, ugMarks, pgInstituteName, pgCourseName, pgYearOfGraduation, pgMarks,
        furtherStudies, jobPosition, department, dateOfJoining, previousCompany, previousPositionField, previousReason,
        bankName, accountNumber, accountHolderName, branchAddress, ifscCode, image, signImage
    } = req.body;
    console.log(req.body);

    const sqlQuery = `UPDATE Employee SET 
                        firstName = ?, lastName = ?, gender = ?, dob = ?, phoneNumber = ?, email = ?, bloodGroup = ?,
                        religion = ?, maritalStatus = ?, aadharNumber = ?, panCardNumber = ?, drivingLicenseNumber = ?,
                        fatherName = ?, fatherOccupation = ?, fatherPhoneNumber = ?, motherName = ?, motherOccupation = ?,
                        motherPhoneNumber = ?, currentAddress = ?, permanentAddress = ?, emergencyName = ?, emergencyRelation = ?,
                        emergencyPhoneNumber = ?, emergencyEmail = ?, emergencyAddress = ?, 10thSchoolName = ?, 10thBoardName = ?,
                        10thYearofGraduation = ?, 10thMarks = ?, 12thSchoolName = ?, 12thBoardName = ?, 12thYearofGraduation = ?,
                        12thMarks = ?, ugInstituteName = ?, ugCourseName = ?, ugYearOfGraduation = ?, ugMarks = ?, pgInstituteName = ?,
                        pgCourseName = ?, pgYearOfGraduation = ?, pgMarks = ?, furtherStudies = ?, jobPosition = ?, department = ?,
                        dateOfJoining = ?, previousCompany = ?, previousPositionField = ?, previousReason = ?, bankName = ?, 
                        accountNumber = ?, accountHolderName = ?, branchAddress = ?, ifscCode = ?, image = ?, signImage = ?
                    WHERE id = ?`;

    const data = [
        firstName, lastName, gender, dob, phoneNumber, email, bloodGroup, religion, maritalStatus, aadharNumber,
        panCardNumber, drivingLicenseNumber, fatherName, fatherOccupation, fatherPhoneNumber, motherName,
        motherOccupation, motherPhoneNumber, currentAddress, permanentAddress, emergencyName, emergencyRelation,
        emergencyPhoneNumber, emergencyEmail, emergencyAddress, tenthSchoolName, tenthBoardName, tenthYearofGraduation,
        tenthMarks, twelfthSchoolName, twelfthBoardName, twelfthYearofGraduation, twelfthMarks, ugInstituteName,
        ugCourseName, ugYearOfGraduation, ugMarks, pgInstituteName, pgCourseName, pgYearOfGraduation, pgMarks,
        furtherStudies, jobPosition, department, dateOfJoining, previousCompany, previousPositionField, previousReason,
        bankName, accountNumber, accountHolderName, branchAddress, ifscCode, image, signImage, id // Add the employeeId for WHERE clause
    ];

    db.query(sqlQuery, data, (err, result) => {
        if (err) {
            console.error('Error updating data:', err);
            return res.status(500).json('Error updating data');
        }
        console.log('Data updated successfully', result);
        return res.status(200).json('Data updated successfully');
    });
});


module.exports = router;