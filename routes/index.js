var express = require('express');
var router = express.Router();
var db= require('../connection/db');
var path = require('path');

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('index')
});

module.exports = router;
