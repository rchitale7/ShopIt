const express = require('express');
const router = express.Router();
let Store = require('../models/store.model');
const csv = require("csvtojson");
const fs = require('fs')

// Return grocery store give lat and long
// if lat and long are not given, return all stores
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

// add grocery store
router.route('/add').post( async (req,res) => {
    console.log(req.files['floorPlan'][0])
    console.log(req.files['items'][0])
    console.log(req.body)
    csvFilePath = req.files['items'][0].path
    floorPlanPath = req.files['floorPlan'][0].path
    let asyncUpdate = new Promise(async function(resolve, reject){
        try {
            jsonArray = await csv().fromFile(csvFilePath);
            resolve(jsonArray);
        } catch (error) {
            reject("Error: could not parse json");
        }
    })

    asyncUpdate
    .then(function(jsonArray) {
        const { name, long, lat } = req.body;

        const newStore = new Store({
            name: name,
            long: long,
            lat: lat, 
            items: jsonArray
        });

        newStore.save()
        .then(store => res.json(`A new Store (${store._id}) was added!`))
        .catch(err => res.status(400).json(err));
    })
    .catch(function(val) {
        res.status(400).json(val);
    })
    .finally(function() {
        fs.unlink(csvFilePath, (err) => {
            if (err) {
              console.error(err)
            }
        })
        fs.unlink(floorPlanPath, (err) => {
            if (err) {
              console.error(err)
            }
        })
    })
 
})

// Delete grocery store
router.route('/delete').delete(async (req, res) => {
    const storeId = req.body.storeId;
    
    Store.findByIdAndDelete(storeId)
        .then(store => res.json(`Store (${store._id}) has been deleted!`))
        .catch(err => res.status(400).json(err));
});

module.exports = router;
