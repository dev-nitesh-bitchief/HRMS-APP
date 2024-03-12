const express = require('express');
const bodyParser = require('body-parser');
const { register } = require('module');
const bcrypt = require('bcrypt');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const secretKey = "$1234";

var router = express.Router();

var connection = require('../connection/db');

const app = express();


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
}))


// Parse URL-encoded bodies (as sent by HTML forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());




const authorizeUser = (requiredPermission) => {
    return (req, res, next) => {
        const user = req.user;
        const role_id=req.role_id;
        const requiredPermissions = req.path;
        console.log(requiredPermissions);
  
        // Query the database to check if the user has the required roles
        connection.query(
            `SELECT * FROM user
            INNER JOIN roles ON user.roles_id = roles.id
            WHERE user.username = ? AND roles.id = ?`,
            [user, role_id],
            (err, results) => {
                if (err) {
                    console.error('Error querying database: ' + err.stack);
                    res.status(500).send('Internal Server Error');
                    return;
                }
  
                if (results.length > 0) {
                    const permissions_id = results[0].permissions_id.split(',');
                    connection.query(
                        `SELECT permissions.permission_name FROM permissions WHERE id IN (?) `,
                        [permissions_id],
                        (err, permissionsResult) => {
                            if (err) {
                                console.error(err);
                                res.status(500).send('Internal Server Error');
                                return;
                            }
                            
                            let hasPermission = false;
                            permissionsResult.forEach(permission => {
                                console.log(permission.permission_name);
                                if (permission.permission_name === requiredPermissions) {
                                    hasPermission = true;
                                }
                            });

                            if (hasPermission) {
                                next();
                            } else {
                                res.status(403).send('Forbidden 1');
                            }
                        }
                    );
                } else {
                    res.status(403).send('Forbidden 2');
                }
            }
        );
    };
};




const authenticateUser = (req, res, next) => {
    if (req.session.user_visit) {
        // User is already authenticated
        return next();
    }
        // else {
    //     res.status(401).json({ message: 'Unauthorized' });
    // }
    const token=req.headers.authorization;
    console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try{
        const decoded=jwt.verify(token,secretKey);
        req.user=decoded.username;
        req.email=decoded.email;
        req.role_id=decoded.role_id;
        return next();
    }catch(error){
         res.status(401).json({ message: 'Unauthorized' });
    }
    
};


router.get('/', function(req, res, next) {
    res.redirect('/users')
  });


router.post('/', (req, res) => {
    // Implement login logic
    const { username, password } = req.body;
    console.log(username, password);
    connection.query('SELECT * FROM User WHERE username = ?', [username], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const user = results[0];
            // Compare passwords
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) throw err;
                if (result) {
                    // Passwords match, login successful
                    // -------------------------------------------------
                    // req.session.user_visit = 1;
                    var username= user.username;
                    var email= user.email;
                    var role_id=user.roles_id;
                    const payload={username,email,role_id};
                    console.log(payload);
                    console.log(result);
                    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
                    //--------------------------------------------------
                    // res.redirect('/details'); // Redirect to dashboard page
                    // res.status(200).json({token});
                    res.redirect('/users')
                } else {
                    res.send('Invalid username or password');
                }
            });
        } else {
            res.send('Invalid username or password');
        }
    });
});

module.exports = router;
module.exports = authenticateUser;
module.exports = authorizeUser;
