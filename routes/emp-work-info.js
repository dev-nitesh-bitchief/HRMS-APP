var express= require('express');
var router= express.Router();
var db= require('../connection/db');

router.get('/',(req,res,next)=>{
    // res.send("hello from ework")
db.query('DESC Employee_work_info',(err,result)=>{
    if(err){
        console.log('error');
    }
    return res.json({result});
})
});
module.exports=router;