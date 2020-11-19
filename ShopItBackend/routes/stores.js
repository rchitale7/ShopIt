const express = require('express');

const router = express.Router();
let Store = require('../models/store.model');

// Return all grocery stosres
router.route('/').get((req, res) => {
    Store.find()
        .then(stores => res.json(stores))
        .catch(err => res.status(400).json(err));
});

// Add grocery store
router.route('/add').post((req, res) => {
    const { name, long, lat } = req.body;

    const newStore = new Store({
        name: name,
        long: long,
        lat: lat
    });

    newStore.save()
        .then(store => res.json(`A new Store (${store._id}) was added!`))
        .catch(err => res.status(400).json(err));
});

// Delete grocery store
router.route('/delete').delete(async (req, res) => {
    const storeId = req.body.id;
    
    Store.findByIdAndDelete(storeId)
        .then(store => res.json(`Store (${store._id}) has been deleted!`))
        .catch(err => res.status(400).json(err));
});

module.exports = router;
