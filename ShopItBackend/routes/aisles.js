const express = require('express');

const router = express.Router();

let Store = require('../models/store.model.js');
let Aisle = require('../models/aisle.model.js');

/**
 * Return aisles for a specific grocery store
 */
router.route('/').get((req, res) => {
    const storeId = req.query.id;

    Store.findById(storeId)
        .then(store => res.json(store.aisles))
        .catch(err => res.status(400).json(err));
});

/**
 * Create item and add item to grocery store
 * 
 * TODO: after adding image infra in, add back imageURL to the object creation
 */
router.route('/add').post((req, res) => {
    const storeId = req.body.storeId;
    const { xPos, yPos, length, width, sectorLength, sectorWidth, rotation } = req.body;

    Store.findById(storeId)
        .then(store => {
            if (!store) res.status(404).json('Error: Cannot find store');

            const newAisle = new Aisle({
                xPos: xPos,
                yPos: yPos,
                length: length,
                width: width,
                sectorLength: sectorLength,
                sectorWidth: sectorWidth,
                rotation: rotation
            });

            store.aisles.push(newAisle);
            return store.save();
        })
        .then(store => {
            console.log('Created aisle and added to store: ', store);
            res.json(`Successfully created aisle at (${xPos}, ${yPos})!`);
        })
        .catch(err => {
            console.log('Failed to create aisle: ', err);
            res.status(400).json(err);
        });
});

/**
 * Delete an aisle from a store
 */
router.route('/delete').delete(async (req, res) => {
    const storeId = req.body.id;
    const aisleId = req.body.aisleId;

    try {
        const store = await Store.findById(storeId);
        const aisle = store.aisles.id(aisleId);

        await store.update({$pull : { items: { aisle: aisleId } }});
        await store.aisles.pull({ _id: aisleId });

        await store.save();

        console.log(`Deleted aisle ${aisleId} from store ${storeId}: ` + aisle);
        res.json(`Successfully deleted item ${aisleId}`);
    } catch (err) {
        console.log('Error: Unable to delete aisle ' + err);
        res.status(400).json(err);
    }
});

module.exports = router;