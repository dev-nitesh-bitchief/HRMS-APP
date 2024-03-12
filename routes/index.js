var express = require('express');
var router = express.Router();
var db= require('../connection/db');
var path = require('path');

/* GET home page. */
// router.get('/', (req, res) => {
//   res.render("login", { layout: 'empty' });
// });

router.get('/',(req,res)=>{
  res.render('user')
})


module.exports = router;
