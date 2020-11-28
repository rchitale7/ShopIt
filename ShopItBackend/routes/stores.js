const express = require('express');
const router = express.Router();

let Store = require('../models/store.model');
let Item = require('../models/item.model');
let User = require('../models/user.model');

const csv = require("csvtojson");
const fs = require('fs')

var jwt = require('jsonwebtoken');
var secret_key = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c"

// Returns all grocery stores
router.route('/').get((req, res) => {
    Store.find()
        .then(stores => res.json(stores))
        .catch(err => res.status(400).json({msg: err}));
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

router.use('/:username', function (req, res, next) {

    let token = req.cookies.jwt;

    if (token == null) {
      res.status(401).json({msg: '401 error: Could not authenticate'});
    } else {
        jwt.verify(token, secret_key, function(err, decoded) {
          if(err != null || decoded == null)
          {
            res.status(401).json({msg: '401 error: Could not authenticate'});
          } else {
            req.jwt_usr = decoded.usr
            console.log("authenticated!")
            next()
          }
      });
    }
})


// get grocery store

router.route('/:username').get((req, res) => {
    let username = req.params.username;
    if (req.jwt_usr != username) {
        res.status(401).json({msg: '401 error: Could not authenticate'})
    } else {
        User.findOne({username: username})
        .then(user => {
            if (user.store == null) {
                res.status(200).json({exists: false, msg: "Store does not exist (yet)"})
            } else {
                Store.findById(user.store) 
                    .then(store => res.status(200).json({exists: true, name: store.name, address: store.address, msg: "Found store!"}))
                    .catch(err => res.status(400).json({msg: 'Error: could not find store: ' + err}))
            }
        })
        .catch(err => res.status(400).json({msg: 'Error:' + err}))
    }
    

})

// add grocery store


router.route('/:username').post( async (req,res) => {

    let csvFilePath = ""
    let floorPlanPath = ""
    try {
        let username = req.params.username;
        csvFilePath = req.files['items'][0].path
        floorPlanPath = req.files['floorPlan'][0].path
        if (req.jwt_usr != username) {
            console.log("incorrect user")
            res.status(401).json({msg: '401 error: Could not authenticate'});
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
        } else {
            let asyncUpdate = new Promise(async function(resolve, reject){
                try {
                    jsonArray = await csv().fromFile(csvFilePath);
                    resolve(jsonArray);
                } catch (error) {
                    reject("Error: could not parse json");
                }
            })

            asyncUpdate.then(function(jsonArray) {
                const { name, address  } = req.body;

                validItems = []
                invalidItems = []

                for(let i = 0; i < jsonArray.length; i++) {
                    let item = new Item(jsonArray[i]); 
                    let error = item.validateSync(); 
                    if(error == null) {
                        validItems.push(item)
                    } else {
                        invalidItems.push(item)
                    }
                };

                const newStore = new Store({
                    name: name,
                    address: address,
                    items: validItems
                });

                newStore.save()
                .then(store => {
                    User.findOne({username: username})
                    .then(user => {
                        user.store = store
                        user.save()
                            .then(user => {
                                res.status(200).json({validItems: store.items, invalidItems: invalidItems, msg: "Added store to db!"})
                            })
                            .catch(err => res.status(400).json({msg: "Error: could not save store to user account" + err}))
                    })
                    .catch(err => res.status(400).json({msg: "Error: could not find user account: " + err}))
                })
                .catch(err => res.status(400).json({msg: "Error: could not save store: " + err}));
 
            })
            .catch(function(val) {
                res.status(400).json({msg: "Error: Could not create store: " + val});
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
        }
    } catch(error) {
        res.status(500).json({msg: "Internal Server Error: Could not open files"})
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
    }
})

// Delete grocery store
router.route('/:username').delete(async (req, res) => {

    let username = req.params.username;

    if(req.jwt_usr != username) {
        res.status(401).json({msg: 'Error: User is not authenticated'});
    } else {
        User.findOne({username: username})
            .then(user => {
                storeId = user.store
                Store.findByIdAndDelete(storeId)
                .then(store => {
                    user.store = null;
                    user.save()
                        .then(user => res.status(200).json({user: user.name, name: store.name, msg: "Deleted store!"}))
                        .catch(err => res.status(400).json({msg: 'Error could not delete store: ' + err}) )
                })
                .catch(err => res.status(400).json({msg: 'Error could not delete store: ' + err}));
            })
            .catch(err => res.status(400).json({msg: 'Error could not find user: ' + err}))
    }
});


module.exports = router;
