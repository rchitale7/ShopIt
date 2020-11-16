const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
let Store = require('../models/store.model');



<<<<<<< HEAD
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
=======


// Return items for a specific grocery store
// if no grocery store is specified, returns all items
router.route('/').get((req, res) => {
    let store = req.query.store;
    console.log(store)
    if (store != null) {
        Item.find({storeID: { $eq : store }})
        .then(items => res.json(items))
        .catch(err => res.status(400).json('Error: ' + err));
    } else {
        Item.find()
        .then(items => res.json(items))
        .catch(err => res.status(400).json('Error: ' + err));
    }
});


// Add items in bulk
// TODO: add logging 
router.route('/add').post((req, res) => {
    let docs = req.body.data;      
    let bulk = Item.collection.initializeUnorderedBulkOp();
    for (let i = 0; i < docs.length; i += 1) {
        bulk.insert(docs[i]);
    }

  
    bulk.execute(function (err) {
        if (err) { 
            res.status(400).json('Error: ' + err); 
        } else {
            res.json(`"${docs.length}" items were added!`); 
        }
    });               
});

// Delete items in bulk
// TODO: add logging
router.route('/delete').delete((req, res) => {
    let docs = req.body.data;
    let bulk = Item.collection.initializeUnorderedBulkOp();

    for (let i = 0; i < docs.length; i++) {
        let object_id = new mongoose.Types.ObjectId(docs[i].id)
        bulk.find({_id: object_id}).remove()
    }
    bulk.execute(function (err) {
        if (err) { 
            res.status(400).json('Error: ' + err); 
        } else {
            res.json(`"${docs.length}" items were deleted!`); 
        }
    });     

>>>>>>> main
});

module.exports = router;