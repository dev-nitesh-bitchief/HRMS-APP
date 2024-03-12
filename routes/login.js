var express = require('express');
var router = express.Router();
const app = express();
const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({extends:true}))
app.use(bodyParser.json());
var db = require('../connection/db');
var bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render("login", {layout: 'empty'});
});

router.post('/log', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM User WHERE username = ?', [username], (err, results) => {
      if (err) {
        throw err;
      }
      if (results.length > 0) {
        const User = results[0];
        bcrypt.compare(password, User.password, (err, result) => {
          if (err) {
            throw err;
          }
          if (result) {
            return res.status(201).json( results);
          } else {
            res.status(401).send({success: false, message:'Invalid username or password'});
          }
        });
      } else {
        res.status(401).send({success: false, message:'username not found.'});
      }
    });
  });

  router.post('/signout',(req,res)=>{
    res.redirect('/');
  })
module.exports=router;