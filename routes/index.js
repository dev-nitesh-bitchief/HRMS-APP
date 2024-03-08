var express = require('express');
var router = express.Router();




var db= require('../connection/db');









/* GET home page. */

router.get('/', function(req, res, next) {
  res.redirect('/users')
});




module.exports = router;
