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
        .catch(err => res.status(400).json({msg: 'Error: ' + err}));
});

router.post('/login', function(req, res) {

    let username = req.body.username;
    let pwd = req.body.password;

    // callback order is user, err i think? this conflicts with the mongoose docs
    User.findOne({ username: { $eq : username } })
    .then(function(user, err) {
        if (err != null) {
            res.status(500).json({msg: "Error: database error " + err})
        } else if (user == null) {
            res.status(401).json({msg: "Error: could not find user"})
        } else {
            let doc_pwd = user.password;
            bcrypt.compare(pwd, doc_pwd, function(err, result) {
                if (err != null) {
                    res.status(500).json({msg: "Error: database error " + err})
                } else {
                    if (!result) {
                        res.status(401).json({msg: "Error: password didn't match"});
                    } else {

                        let payload = {
                            "exp": Date.now()/1000 + 3600*2,
                            "usr": username
                        };

                        jwt.sign(payload, secret_key, {header: header}, function(err, token) {
                            if (err != null) {
                                res.status(500).json({msg: "Error: jwt token error"})
                            } else {
                                res.cookie('jwt', token);
                                res.status(200).json({msg: "Authentication successful"});

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
    const { username, password } = req.body;

    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            if (err != null) {
                res.status(500).json({msg: "Error: Could not hash password"});
            } else if (password.length < 5) {
                res.status(400).json({msg: "Error: password must be greater than 5 characters"})
            } else {
                let payload = {
                    "exp": Date.now()/1000 + 3600*2,
                    "usr": username
                };

                jwt.sign(payload, secret_key, {header: header}, function(err, token) {
                    if (err != null) {
                        res.status(500).json({msg: "Error: jwt token error"})
                    } else {
                        res.cookie('jwt', token);

                    }
                });
                const newUser = new User( {"username": username, "password": hash} );
                newUser.save()
                .then(() => res.status(200).json({msg: "User " + username + " was signed up!"}))
                .catch(err => {
                    if (err.name == "MongoError" && err.code == 11000) {
                        res.status(400).json({msg: 'Error: username already exists. Please choose another username.'})
                    } else {
                        res.status(400).json({msg: 'Error: ' + err}) 
                    }
                    
                    
                });
            }
        });
    });
});

module.exports = router;




