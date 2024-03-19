var express = require('express');
var router = express.Router();
var connection = require('../connection/db')

router.get('/', function(req, res) {
    res.render('checkinout')
});

module.exports=router;