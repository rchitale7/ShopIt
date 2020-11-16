const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
let Store = require('../models/store.model');


// Return items for a specific grocery store
router.route('/').get((req, res) => {
    let object_id = req.query.id; 
    Store.findOne({_id: object_id})
    .then(store => res.json(store["items"]))
    .catch(err => res.status(400).json('Error: ' + err));
});


// Add items in bulk
// TODO: add logging 
router.route('/add').post((req, res) => {
    let object_id = req.body.id;
    let docs = req.body.data;
    Store.updateMany({_id: object_id}, {
        $push: {
            items: {
                $each: docs
            }
        }
    }, function(err, response) {
        if (err != null) {
            res.status(400).json('Error: ' + err);
        } else {
            res.json(`"${docs.length}" items were added!`);
        }
    }); 
});   



// TODO: Delete items in bulk
// TODO: add logging
router.route('/delete').delete((req, res) => {
    let object_id = req.body.id;
    let docs = req.body.data
    Store.updateMany({_id: object_id}, { $pull: { items: {_id: { $in: docs } }} }, function(err, response) {
        if (err != null) {
            res.status(400).json('Error: ' + err);
        } else {
            res.json(`"${docs.length}" items were deleted!`);
        }
    }); 
});

module.exports = router;