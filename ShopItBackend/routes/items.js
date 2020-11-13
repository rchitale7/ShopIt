const express = require('express');

const router = express.Router();
let Item = require('../models/item.model');

// Return all items
router.route('/').get((req, res) => {
    Item.find()
        .then(items => res.json(items))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Add new item to database
router.route('/add').post((req, res) => {
    const { name, price, imageURL } = req.body;

    // Will add image upload later
    const newItem = new Item( {"name": name, "price": price, "imageURL": imageURL} );

    newItem.save()
        .then(() => res.json(`Item "${name}" was added!`))
        .catch(err => res.status(400).json('Error: ' + err));
});

// Delete item from database given its _id
router.route('/delete').delete((req, res) => {
    const id = req.body.id;
    
    // Will add image deletion later
    Item.findOneAndDelete({ _id: { $eq : id } })
        .then((item) => res.json(`${item.name} has been deleted!`))
        .catch(err => res.status(400).json(`Unable to delete item. Error: ${err}`));
});

module.exports = router;