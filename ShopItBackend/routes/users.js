const express = require('express');

const router = express.Router();


var jwt = require('jsonwebtoken');

var bcrypt = require('bcryptjs');

var secret_key = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c"

var header = {
  "alg": "HS256",
  "typ": "JWT"
}

let User = require('../models/user.model');

// only allow url encoded
router.use(express.urlencoded({ extended: true }));

// Return all users
router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.post('/login', function(req, res) {

    let username = req.body.username;
    let pwd = req.body.password;


    // callback order is user, err i think? this conflicts with the mongoose docs
    User.findOne({ username: { $eq : username } })
    .then(function(user, err) {
        if (err != null) {
            res.status(500).json("Error: database error " + err)
        } else if (user == null) {
            res.status(401).json("Error: could not find user")
        } else {
            let doc_pwd = user.password;
            bcrypt.compare(pwd, doc_pwd, function(err, result) {
                if (err != null) {
                    res.status(500).json("Error: database error " + err)
                } else {
                    if (!result) {
                        res.status(401).json("Error: password didn't match");
                    } else {

                        let payload = {
                            "exp": Date.now()/1000 + 3600*2,
                            "usr": username
                        };

                        jwt.sign(payload, secret_key, {header: header}, function(err, token) {
                            if (err != null) {
                                res.status(500).json("Error: jwt token error")
                            } else {
                                console.log(token)
                                res.cookie('jwt', token);
                                res.status(200);
                                res.status(200).json("Authentication successful");

                            }
                        });
                    }
                }
            });
        }
    })
});


// Sign up user to database
router.route('/signup').post((req, res) => {
    console.log("sign up post call")
    const { username, password } = req.body;



    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            if (err != null) {
                res.status(500).json("Error: Could not hash password");
            } else {
                let payload = {
                    "exp": Date.now()/1000 + 3600*2,
                    "usr": username
                };

                jwt.sign(payload, secret_key, {header: header}, function(err, token) {
                    if (err != null) {
                        res.status(500).json("Error: jwt token error")
                    } else {
                        console.log(token)
                        res.cookie('jwt', token);

                    }
                });
                const newUser = new User( {"username": username, "password": hash} );
                newUser.save()
                .then(() => res.json("User " + username + " was signed up!"))
                .catch(err => res.status(400).json('Error: ' + err));
            }
        });
    });
});

// might not need this function anymore
// // Add new user to database
// router.route('/add').post((req, res) => {
//     const { username, password, admin } = req.body;

//     const newUser = new User( {"username": username, "admin": admin} );

//     newUser.save()
//         .then(() => res.json("User " + username + " was added!"))
//         .catch(err => res.status(400).json('Error: ' + err));
// });

// Delete user from database
router.route('/delete').delete((req, res) => {
    const username = req.body.username;

    User.findOneAndDelete({ username: { $eq : username } })
        .then(() => res.json(`${username} has been deleted!`))
        .catch(err => res.status(400).json('Error: ', err));
});

module.exports = router;
