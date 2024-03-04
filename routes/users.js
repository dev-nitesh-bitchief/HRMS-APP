var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/adduser', function(req, res, next) {
  res.send('add user successfully');
});


router.get('/delete_user', function(req, res, next) {
  res.send('add user successfully');
});


router.get('/update_user', function(req, res, next) {
  res.send('add user successfully');
});

module.exports = router;
