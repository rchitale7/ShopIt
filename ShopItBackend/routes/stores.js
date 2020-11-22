const express = require('express');

const router = express.Router();
let Store = require('../models/store.model');

// Return all grocery stosres
router.route('/').get((req, res) => {
    let long = parseFloat(req.query.long);
    let lat = parseFloat(req.query.lat);

    if (long != undefined && lat != undefined) {
        Store.findOne({long: { $eq : long }, lat: { $eq : lat }})
        .then(store => res.json(store))
        .catch(err => res.status(400).json('Error: ' + err));
    } else {
        Store.find()
        .then(stores => res.json(stores))
        .catch(err => res.status(400).json(err));
    }
});

// Add grocery store
router.route('/add').post((req, res) => {
    const { name, long, lat, aisles } = req.body;

    const newStore = new Store({
        name: name,
        long: long,
        lat: lat, 
        aisles: (aisles == undefined ? [] : aisles)
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
        .catch(err => res.status(400).json(err));
});

module.exports = router;
