const express = require('express');

const router = express.Router();
let Store = require('../models/store.model');


// Return grocery store
router.route('/').get((req, res) => {

    let long = parseFloat(req.query.long);
    let lat = parseFloat(req.query.lat);
    Store.findOne({long: { $eq : long }, lat: { $eq : lat }})
        .then(store => res.json(store))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Add grocery store 
router.route('/add').post((req, res) => {
    const newStore = new Store(req.body.data);

    newStore.save()
        .then((store) => res.json(`A new Store (${store._id}) was added!`))
        .catch(err => res.status(400).json('Unable to add store. Error: ' + err));
});

// Delete grocery store
router.route('/delete').delete((req, res) => {
    const id = req.body.id;
    
    Store.findOneAndDelete({ _id: { $eq : id } })
        .then((store) => res.json(`Store (${store._id}) has been deleted!`))
        .catch(err => res.status(400).json(`Unable to delete store. Error: ${err}`));
});

module.exports = router;
