var express = require('express');
var router = express.Router();

var db= require('../connection/db');



router.get('/' , (req , res)=>{
    const sql = 'SELECT * FROM Leave_request';
    db.query(sql , (err, result)=>{
        if(err){
            res.status(500).send(err);
        }
        res.json({result});
        console.log('result :' ,result);
    })
    
});

module.exports = router;