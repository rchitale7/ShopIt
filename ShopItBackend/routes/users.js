const express = require('express');

const router = express.Router();
let User = require('../models/user.model');

// Return all users
router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Add new user to database
router.route('/add').post((req, res) => {
    const { username, admin } = req.body;

    const newUser = new User( {"username": username, "admin": admin} );

    newUser.save()
        .then(() => res.json("User " + username + " was added!"))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Delete user from database
router.route('/delete').delete((req, res) => {
    const username = req.body.username;

    User.findOneAndDelete({ username: { $eq : username } })
        .then(() => res.json(`${username} has been deleted!`))
        .catch(err => res.status(400).json('Error: ', err));
});

module.exports = router;