var express = require('express');
var router = express.Router();


<<<<<<< HEAD
=======
var db= require('../connection/db');




>>>>>>> 8f1471ffd6f16ab345bd81d7afbe6d96b92d25f0
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



module.exports = router;
