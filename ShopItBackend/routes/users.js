const express = require('express');

const router = express.Router();
let User = require('../models/user.model');

router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const username = req.body.username;

    const newUser = new User( {"username": username} );

    newUser.save()
        .then(() => res.json("User " + username + " was added!"))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;