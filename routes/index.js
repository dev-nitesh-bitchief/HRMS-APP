var express = require('express');
var router = express.Router();



<<<<<<< HEAD

var db= require('../connection/db');


=======
var db= require('../connection/db');





>>>>>>> 18860c2af9d04f9e6a692b0275f7a4489814fbf4
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



module.exports = router;
