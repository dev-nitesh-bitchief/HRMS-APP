var express= require('express');
var router= express.Router();
var db= require('../connection/db');

router.get('/',(req,res,next)=>{
    res.send("hello from ework")
});

module.exports=router;