var express = require('express');

var router = express.Router();




const secretKey = "$1234";
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));




var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');





var db = require('../connection/db');
var path = require('path');



var db = require('../connection/db');
// Import the LocalStorage class from the node-localstorage package
const { LocalStorage } = require('node-localstorage');

// Create a new instance of LocalStorage
const localStorage = new LocalStorage('./scratch');
var db = require('../connection/db');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('login', { layout: 'empty_layout' });
});

// router.get('/login', function(req, res, next) {
//   res.render('login', { title: 'Express' });
// });

// router.get('/login', function (req, res) {
//   res.render('home')
// });

router.get('/home', function (req, res) {
  res.render('Home');
});






router.get('/dynamic-states', (req, res) => {
  console.log('Inside  state route ');
  const sqlQuery = `SELECT * FROM State`;
  db.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('Error retrieving data from database: ' + error.stack);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    console.log(results);
    res.json(results);
  });
});

var db = require('../connection/db');
var path = require('path');

/* GET home page. */
// router.get('/', (req, res) => {
//   res.render("login", { layout: 'empty' });
// });


router.get('/', (req, res) => {
  res.render('user')
})



const authenticateUser = (req, res, next) => {
  if (req.session.user_visit) {
    // User is already authenticated
    return next();
  }

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized 123' });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.username;
    // req.email=decoded.email;
    req.role_id = decoded.role_id;
    return next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized 456' });
  }

};





router.get('/home', (req, res) => {
  res.render('Home');
})

router.get('/', (req, res) => {
  res.render('login', { layout: 'emptylayout' });
})

router.get('/dashboard', (req, res) => {

  res.render('dashboard');

})



var name;

router.post('/login', (req, res) => {
  // Get the id and password from the request body
  // const id = req.body.user_name;
  // const password = req.body.password;
  const { user_name, password } = req.body;
  console.log(user_name);
  console.log(password);

  // module.exports.user_name = user_name;
  // global.userNAME = user_name;

  // module.exports = { user_name };

  name = user_name;
  console.log('name is ', name);
  // module.exports =  { name }  ;

  localStorage.setItem('username', name);


  name = user_name;
  // module.exports =  { name }  ;

  localStorage.setItem('username', name);




  // Validate the input
  if (!user_name || !password) {
    res.send('Please enter your id and password');
    return;
  }
  // Query the database to get the hash by the id
  db.query('SELECT * FROM User WHERE username = ?', [user_name], (err, result, fields) => {
    if (err) {
      res.send('Database error');
      return;
    }
    // Check if the query returned any row
    if (result.length > 0) {
      // Get the hash from the results
      const user = result[0];
      const hash = user.password;
      var userName = user.username;
      var role_id = user.Role_id;

      // Compare the password with the hash
      bcrypt.compare(password, hash, (err, result) => {
        if (err) {
          res.send('Hashing error');
          return;
        }

        // Result is a boolean indicating if the password and hash match
        if (result) {
          // The password is correct

          // Set the session to indicate the user is logged in
          // req.session.loggedin = true;
          // req.session.visit = 1;


          //  var email= user.email;

          const payload = { userName, role_id };
          console.log(payload);
          console.log(result);
          global.token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

          // Set the exported user_name value

          // module.exports.userName = userName;





          res.redirect('/home');

        } else {
          // The password is wrong
          res.send('Invalid id or password');
        }
      });
    } else {
      // The id does not exist in the database
      res.send('Id not found');
    }
  });
});
function destroyToken() {
  global.token = null; // Clear the token

}

router.get('/logout', (req, res) => {
  destroyToken();
  console.log('value of name is ', name);
  name = null;
  console.log('value of name is ', name);
  res.redirect('/');
});

module.exports = router;

/* GET home page. */
// router.get('/', (req, res) => {
//   res.render("login", { layout: 'empty' });
// });


router.get('/', (req, res) => {
  res.render('user')
})








module.exports = router;











