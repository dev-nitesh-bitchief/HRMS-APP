const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const session = require('express-session');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const jwt = require('jsonwebtoken');
const secretKey = "$1234";
// const EventEmitter = require('events');
// const myemitter = new EventEmitter();
// Setting up handlebars.......
const handlebars = require('express-handlebars');
const { randomFill } = require('crypto');
const { createDeflateRaw } = require('zlib');
const { cwd } = require('process');
const { error } = require('console');
app.set('view engine', "handlebars");
app.engine('handlebars', handlebars.engine({
    extname: "handlebars", defaultLayout: "index"
}));

app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: true
}));

const connectionwithdatabase = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Hodal@2111",
    database: "database_1"
});
connectionwithdatabase.connect((err) => {
    if (err) {
        console.warn('error', err)
    }
    console.warn("Connected!");
});

app.use(express.static('styling'));

const authenticateUser = (req, res, next) => {
    if (req.session.user_visit) {
        // User is already authenticated
        return next();
    }
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded.username;
        req.role_id = decoded.role_id;
        return next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }

};
const authorizeUser = () => {
    return (req, res, next) => {
        const user = req.user;
        const role_id = req.role_id;
        // const requiredPermissions = req.path;
        const requiredPermissions = req.path;
        // console.log(requiredPermissions);

        // Query the database to check if the user has the required roles
        connectionwithdatabase.query(
            `SELECT * FROM login_details
            INNER JOIN roles ON login_details.role_id = roles.id
            WHERE login_details.username = ? AND roles.id = ?`,
            [user, role_id],
            (err, results) => {
                console.log(results);
                if (err) {
                    console.error('Error querying database: ' + err.stack);
                    res.status(500).send('Internal Server Error');
                    return;
                }

                if (results.length > 0) {
                    const permissions_id = results[0].permission_id.split(',');
                    // console.log(permissions_id)
                    connectionwithdatabase.query(
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
                                res.status(403).send('Forbidden 123');
                            }
                        }
                    );
                } else {
                    res.status(403).send('Forbidden  456 ');
                }
            }
        );
    };
};



app.get('/', (req, res) => {
    // Send the HTML file as the response
    res.sendFile(path.join(__dirname, 'login.html'));
});


app.get('/home', authenticateUser, (req, res) => {

    res.render('main', { layout: "index" });
});



// Employee  Details Routes 

app.post('/send-data', authenticateUser, (req, res) => {
    console.log('Inside send data route ');
    const { name, email, age, mobile_no, BG, address } = req.body;
    console.log(name);
    console.log(email);
    console.log(age);
    console.log(mobile_no);

    const data = [name, email, age, mobile_no, BG, address];
    const query = "INSERT INTO employee_details(name,email,age,mobile_no,BG,address) VALUES (?,?,?,?,?,?)"
    connectionwithdatabase.query(query, data, (err, result) => {
        if (err) { throw err; }
        console.log('User data stored successfully');
        res.redirect('/employee');
    });
});

app.get('/employee', authenticateUser, authorizeUser(), (req, res) => {

    const query = 'SELECT * FROM employee_details';
    connectionwithdatabase.query(query, (err, rows) => {
        if (err) {
            throw err;
        }
        {
            res.render('employee', { employee_data: rows });
        }
    })
});

app.post('/delete-employee', (req, res) => {
    console.log('Inside Delete Function');
    const { name } = req.body;
    console.log(name);
    const query = `DELETE FROM employee_details where name = ?`
    connectionwithdatabase.query(query, name, (err, results) => {
        if (err) {
            throw err;
        }
        res.redirect('/employee');
    });
});



// User Details Routes 

app.get('/user', authenticateUser, authorizeUser(), (req, res) => {

    const query = 'SELECT * FROM login_details';
    connectionwithdatabase.query(query, (err, rows) => {
        if (err) {
            throw err;
        }
        {
            res.render('user', { user_data: rows });
        }
    });

});

app.post('/delete-user', (req, res) => {
    console.log('Inside Delete Function');
    const { username } = req.body;
    console.log(username);
    const query = `DELETE FROM login_details where username = ?`
    connectionwithdatabase.query(query, username, (err, results) => {
        if (err) {
            throw err;
        }
        res.redirect('/user');
    });
});

app.post('/edit-user', (req, res) => {
    console.log('Inside Edit Function');
    const { username, role_id } = req.body;
    console.log(username);
    console.log(role_id);
    const query = `UPDATE login_details SET role_id = ${role_id} where username = ?`
    connectionwithdatabase.query(query, username, (err, results) => {
        if (err) {
            throw err;
        }
        res.redirect('/user');
    });
});

// app.get('/roles', authenticateUser, authorizeUser(), (req, res) => {

//     const query = 'SELECT * FROM roles';
//     connectionwithdatabase.query(query, (err, rows) => {
//         if (err) {
//             throw err;
//         }
//         {
//             res.render('roles', { roles: rows });
//         }
//     })
app.get('/roles', authenticateUser, authorizeUser(), (req, res) => {

    const query = `
  SELECT roles.id, roles.role_name, GROUP_CONCAT(permissions.permission_name) AS permissions
  FROM roles
  JOIN permissions ON FIND_IN_SET(permissions.id, roles.permission_id)
  GROUP BY roles.id;
`;

    connectionwithdatabase.query(query, (err, rows) => {
        if (err) {
            throw err;
        }
        {
            res.render('roles', { roles: rows });
        }
    })

})

app.get('/permissions', authenticateUser, authorizeUser(), (req, res) => {

    const query = 'SELECT * FROM permissions';
    connectionwithdatabase.query(query, (err, rows) => {
        if (err) {
            throw err;
        }
        {
            res.render('permissions', { permissions: rows });
        }
    })
})


// Taking Value from new user 

app.post('/new-roles', authenticateUser, (req, res) => {

    const role_name = req.body.role_name;
    const permissions = req.body.permissions || [];
    const query = "INSERT INTO roles(role_name,permission_id) VALUES (?,?)";
    const data = [role_name, `${permissions}`];
    // console.log(data);
    console.log(`${permissions}`);

    connectionwithdatabase.query(query, data, (err, res) => {

        if (err) {

            throw err;
        }
        console.log('Data Inserted Successfully');

    })
    return res.status(200);
    // res.redirect('/roles');

});

// Register Page 
app.get('/new-user', authenticateUser, authorizeUser(), (req, res) => {

    res.render('register', { layout: 'index' });
});


// Route to insert the fill data in database.......
app.post('/register', authenticateUser, function (req, res) {

    const { username, password } = req.body;
    const role_id = req.body.role_id;
    // console.log(role_id);

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            res.send('Hashing error');
            return;
        }
        const data = [username, hash, role_id];
        const sql = "INSERT INTO login_details(username,password,role_id) VALUES (?,?,?)"
        connectionwithdatabase.query(sql, data, (err, result) => {
            if (err) { throw err; }
            console.log('User data stored successfully');
        });
        // alert('New User Insert Successfully');
        res.redirect('/home');
    });
});


// app.post('/login', (req, res) => {
//     // Get the id and password from the request body
//     // const id = req.body.user_name;
//     // const password = req.body.password;
//     const { username, password } = req.body;
//     console.log(username);
//     console.log(password);
//     // Validate the input
//     if (!username || !password) {
//         res.send('Please enter your id and password');
//         return;
//     }
//     // Query the database to get the hash by the id
//     connectionwithdatabase.query('SELECT password FROM login_details WHERE username = ?', [username], (err, results, fields) => {
//         if (err) {
//             res.send('Database error');
//             return;
//         }
//         // Check if the query returned any row
//         if (results.length > 0) {
//             // Get the hash from the results
//             const hash = results[0].password;
//             // Compare the password with the hash
//             bcrypt.compare(password, hash, (err, result) => {
//                 if (err) {
//                     res.send('Hashing error');
//                     return;
//                 }

//                 // Result is a boolean indicating if the password and hash match
//                 if (result) {
//                     // The password is correct
//                     // Set the session to indicate the user is logged in
//                     req.session.loggedin = true;
//                     req.session.visit = 1;
//                     // Redirect the user to the home page
//                     res.redirect('/home');
//                 } else {
//                     // The password is wrong
//                     res.send('Invalid id or password');
//                 }
//             });
//         } else {
//             // The id does not exist in the database
//             res.send('Id not found');
//         }
//     });
// });



app.post('/login', (req, res) => {
    // Implement login logic
    const { username, password } = req.body;
    // console.log(username, password);
    connectionwithdatabase.query('SELECT * FROM login_details WHERE username = ?', [username], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const user = results[0];
            // Compare passwords
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) throw err;
                if (result) {
                    var username = user.username;
                    var role_id = user.role_id;
                    const payload = { username, role_id };
                    // console.log(results);
                    global.token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

                    res.redirect('/home');
                } else {
                    res.send('Invalid username or password');
                }
            });
        } else {
            res.send('Invalid username or password');
        }
    });
});


function logout(req, res) {

    token = 'NULL';
    res.redirect('/');
}

app.get('/logout', authenticateUser, (req, res) => {
    logout(req, res);
});


app.post('/deleteRow', (req, res) => {
    console.log('Inside Delete Function');
    const { id } = req.body;
    console.log(id);
    const query = `DELETE FROM roles where id = ?`
    connectionwithdatabase.query(query, id, (err, results) => {
        if (err) {
            throw err;
        }
        return res.status(200);
        //res.redirect('/roles');
    });

});

app.post('/delete-permission', (req, res) => {
    console.log('Inside Delete Function');
    const { id } = req.body;
    console.log(id);
    const query = `DELETE FROM permissions where id = ?`
    connectionwithdatabase.query(query, id, (err, results) => {
        if (err) {
            throw err;
        }
        res.redirect('/permissions');
    });
});

app.post('/update-role', (req, res) => {
    // const { id, role_name, permissions } = req.body;

    const id = req.body.id;
    const role_name = req.body.role_name;
    const permissions = req.body.permissions || [];


    // Convert array to string for database storage
    const permissions_id = permissions.join(',');

    // Construct the SQL UPDATE query dynamically based on the provided columns
    let sql = 'UPDATE roles SET ';
    const updateValues = [];
    if (role_name !== '') {
        sql += 'role_name = ?, ';
        updateValues.push(role_name);
    }
    if (permissions_id !== '') {
        sql += 'permission_id = ?, ';
        updateValues.push(permissions_id);
    }
    // Remove the trailing comma and space
    sql = sql.slice(0, -2);
    sql += ' WHERE id = ?';

    // Add the id value to the updateValues array
    updateValues.push(id);

    connectionwithdatabase.query(sql, updateValues, (err, result) => {
        if (err) {
            console.error('Error updating user role:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('User role updated successfully');
        res.redirect('/roles');
        // return res.status(200);
    });
});

app.post('/update-permission', (req, res) => {
    console.log('Inside Update Function');
    const { id, permission_name } = req.body;
    console.log(id, permission_name);
    const query = `UPDATE permissions SET permission_name = ? where id = ?`;

    connectionwithdatabase.query(query, [permission_name, id], (err, results) => {
        if (err) {
            throw err;
        }
        res.redirect('/permissions');
    });
});

app.post('/add-permission', (req, res) => {
    console.log("Inside Add Function");
    const { permission_name } = req.body;
    const query = "INSERT INTO PERMISSIONS (permission_name) VALUES (?)";

    connectionwithdatabase.query(query, permission_name, (err, results) => {
        if (err) {
            throw err;
        }
        res.redirect('/permissions');
    })
})

app.get('/dynamic-permission', (req, res) => {
    const sql = 'select * from permissions';
    connectionwithdatabase.query(sql, (error, results) => {
        if (error) {
            console.error('Error retrieving data from database: ' + error.stack);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        console.log(results);
        res.json(results);
    });
});

app.get('/dynamic-options', (req, res) => {
    const sql = 'select * from roles';
    connectionwithdatabase.query(sql, (error, results) => {
        if (error) {
            console.error('Error retrieving data from database: ' + error.stack);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json(results);
    });
});

app.get('/dynamic-edit/:id', (req, res) => {
    console.log("INSIDE DYNAMIC EDIT FUNCITON")
    const id = req.params.id;
    console.log(id);
    const sql = `select * from roles WHERE id = ?`;
    connectionwithdatabase.query(sql, id, (error, results) => {
        if (error) {
            console.error('Error retrieving data from database: ' + error.stack);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        //es.json(results);
        console.log("result inside edit function ", results);
        return res.json(results);
    });
});

app.get('/roles-edit-prefilled/:id', (req, res) => {
    var id = req.params.id;
    var sql = `select * from roles where id = ?`;

    console.log(`the id is : ${id}`);
    console.log(id);

    connectionwithdatabase.query(sql, id, (error, results) => {
        if (error) {
            console.error('Error retrieving data from database: ' + error.stack);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        console.log('result from roles-edit function ', results);
        res.json(results[0]);
    });
});

app.listen(8000, () => { console.log('Server Started') });



