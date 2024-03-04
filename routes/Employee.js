var express= require('express');
var router= express.Router();
var db= require('../connection/db');

router.get('/',(req,res)=>{
    const sqlquery = 'SELECT * FROM Employee';
    db.query(sqlquery,(err,results)=>{
        if(err){
            throw err;
        }
        {
            res.json({results});
            console.log('Result is ' , results);

        }
})
})

module.exports = router;