const express = require('express');

const router = express.Router();
let Store = require('../models/store.model');


<<<<<<< HEAD
// Return grocery store
=======
// Return grocery store ID and aisles of grocery store
>>>>>>> main
router.route('/').get((req, res) => {

    let long = parseFloat(req.query.long);
    let lat = parseFloat(req.query.lat);
<<<<<<< HEAD
    Store.findOne({long: { $eq : long }, lat: { $eq : lat }})
=======
    Store.find({long: { $eq : long }, lat: { $eq : lat }})
>>>>>>> main
        .then(store => res.json(store))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Add grocery store 
router.route('/add').post((req, res) => {
    const newStore = new Store(req.body.data);

    newStore.save()
        .then((store) => res.json(`A new Store (${store._id}) was added!`))
<<<<<<< HEAD
        .catch(err => res.status(400).json('Unable to add store. Error: ' + err));
=======
        .catch(err => res.status(400).json('Error: ' + err));
>>>>>>> main
});

// Delete grocery store
router.route('/delete').delete((req, res) => {
    const id = req.body.id;
    
    Store.findOneAndDelete({ _id: { $eq : id } })
        .then((store) => res.json(`Store (${store._id}) has been deleted!`))
<<<<<<< HEAD
        .catch(err => res.status(400).json(`Unable to delete store. Error: ${err}`));
=======
        .catch(err => res.status(400).json(`Unable to delete sector. Error: ${err}`));
>>>>>>> main
});

module.exports = router;
