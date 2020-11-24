const express = require('express');

const router = express.Router();
let Store = require('../models/store.model');

// Returns all grocery stores
router.route('/').get((req, res) => {
    Store.find()
        .then(stores => res.json(stores))
        .catch(err => res.status(400).json(err));
});

// Returns grocery store given lat and long
router.route('/at').get((req, res) => {
    const { lat, long }  = req.query;

    if (!lat || !long) res.status(400).json('Lat and/or long not in query params');

    Store.findOne({long: { $eq : long }, lat: { $eq : lat }})
        .then(store => {
            if (store) res.json(store)
            else res.status(404).json(`Could not find store at ${lat}, ${long}`)
        })
        .catch(err => res.status(400).json('Error: ' + err));
});

// Add grocery store
router.route('/add').post((req, res) => {
    const { name, long, lat, items } = req.body;

    const newStore = new Store({
        name: name,
        long: long,
        lat: lat, 
        items: (items == undefined ? [] : items)
    });

    newStore.save()
        .then(store => res.json(`A new Store (${store._id}) was added!`))
        .catch(err => res.status(400).json(err));
});

// Delete grocery store
router.route('/delete').delete(async (req, res) => {
    const storeId = req.body.storeId;
    
    Store.findByIdAndDelete(storeId)
        .then(store => res.json(`Store (${store._id}) has been deleted!`))
        .catch(err => res.status(404).json(err));
});

module.exports = router;
