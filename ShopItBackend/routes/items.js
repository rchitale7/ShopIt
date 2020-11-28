const express = require('express');

const router = express.Router();

let Store = require('../models/store.model.js');
let Item = require('../models/item.model.js');

/**
 * Return items for a specific grocery store
 */
router.route('/').get((req, res) => {
    const storeId = req.query.storeId;

    Store.findById(storeId)
        .then(store => {
            if (!store) res.status(404).json('Cannot find store.');
            res.json(store.items);
        })
        .catch(err => res.status(400).json(err));
});

/**
 * Create item and add item to grocery store
 * 
 * TODO: after adding image infra in, add back imageURL to the validation and object creation
 */
router.route('/add').post((req, res) => {
    const storeId = req.body.storeId;
    const { name, brand, size, category, price, posX, posY } = req.body.data;
    
    Store.findById(storeId)
        .then(store => {
            if (!store) res.status(404).json('Error: Cannot find store.');
            const newItem = new Item({
                name: name,
                brand: brand,
                category: category,
                size: size,
                price: price,
                posX: posX,
                posY: posY
            });

            store.items.push(newItem);
            return store.save();
        })
        .then(store => {
            console.log('Created item and added to store: ' + store);
            res.json(`Successfully created ${name}!`);
        })
        .catch(err => {
            console.log('Failed to create item: ' + err);
            res.status(500).json(err);
        });
});

/**
 * itemIds: array of item _id's
 * itemLocation: array of { posX: n, posY: n } objects corresponding to the _id's
 */
router.route('/locations').put(async (req, res) => {
    const { storeId, itemIds, itemLocations } = req.body;

    // Maps itemId to itemLocation because store.items order is not guaranteed
    let idToLocation = new Map();
    for (let i = 0; i < itemIds.length; i++) {
        idToLocation.set(itemIds[i], itemLocations[i]);
    }

    try {
        let store = await Store.findById(storeId);
        let items = store.items.filter((item) => itemIds.includes(item._id.toString()));

        for (let i = 0; i < items.length; i++) {
            items[i].posX = idToLocation.get(items[i]._id.toString()).posX;
            items[i].posY = idToLocation.get(items[i]._id.toString()).posY;
        }

        await store.save();
        console.log("Updated locations for items with _id in", itemIds);
        res.json("Succesfully updated all item locations!");
    } 
    catch (e) {
        res.status(400).json(e);
    }
});

/**
 * Delete an item from a store
 */
router.route('/delete').delete((req, res) => {
    const storeId = req.body.storeId;
    const itemId = req.body.itemId;

    Store.findByIdAndUpdate(storeId, { $pull: { items: { _id: itemId } } })
        .then(store => {
            console.log(`Deleted item ${itemId} from store ${storeId}: ` + store);
            res.json(`Successfully deleted item ${itemId}`);
        })
});

/**
 * Add items in bulk
 */
router.route('/addMany').post((req, res) => {
    const storeId = req.body.storeId;
    const docs = req.body.data;
    Store.updateMany(
        {_id: storeId}, 
        { $push: { items: { $each: docs } } },
        function(err) {
            if (err) res.status(400).json(err);
            else res.json(`"${docs.length}" items were added!`);
        }); 
});   

/**
 * Remove items in bulk
 */
router.route('/deleteMany').delete((req, res) => {
    const storeId = req.body.storeId;
    const docs = req.body.data

    Store.updateMany({_id: storeId}, { $pull: { items: {_id: { $in: docs } } } }, function(err) {
        if (err) {
            res.status(400).json('Error: ' + err);
        } else {
            res.json(`"${docs.length}" items were deleted!`);
        }
    });
});


module.exports = router;