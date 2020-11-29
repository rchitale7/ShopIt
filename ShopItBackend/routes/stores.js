const express = require('express');
const router = express.Router();

let Store = require('../models/store.model');
let Item = require('../models/item.model');
let User = require('../models/user.model');

const csv = require("csvtojson");
const fs = require('fs')
const AdmZip = require('adm-zip')
const multer  = require('multer');
const AWS = require('aws-sdk');

const ID = process.env.ACCESS_KEY;
const SECRET = process.env.SECRET_KEY;
const BUCKET_NAME = process.env.BUCKET;

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

var jwt = require('jsonwebtoken');
var secret_key = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c"

var storage = multer.diskStorage({
    destination: '/tmp/cs130',
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

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
                console.log("hello")
                Store.findById(user.store) 
                    .then(store => {
                        if (store == null) {
                            res.status(200).json({exists: false, msg: "Store was deleted"})
                        } else {
                            res.status(200).json({exists: true, name: store.name, address: store.address, msg: "Found store!"})
                        }
                        
                    })
                    .catch(err => res.status(400).json({msg: 'Error: could not find store: ' + err}))
            }
        })
        .catch(err => res.status(400).json({msg: 'Error:' + err}))
    }
    

})

// add grocery store

router.use(multer({ storage: storage }).
    fields([{ name: 'floorPlan', maxCount: 1 }, { name: 'items', maxCount: 1 }, {name: 'images', maxCount: 1}])
);

router.route('/:username').post( async (req,res) => {

    let images = req.files['images']
    let itemfile = req.files['items']
    let floorPlan= req.files['floorPlan']
    let username = req.params.username 
    let status_code = 200; 
    let msg = "Success!"
    let response_map = {}
    response_map['validImages'] = []
    response_map['invalidImages'] = []
    response_map['validItems'] = [] 
    response_map['invalidItems'] = [] 
    console.log(req.files)

    try {
        const { name, address  } = req.body;
        let user = await User.findOne({username: username}); 
        let store = await Store.findById(user.store)
        if (store == null) {
            const newStore = new Store({
                name: name,
                address: address
            });

            store = await newStore.save()
            user.store = store
            await user.save()
        } else {
            store.name = name
            store.address = address
            store = await store.save()
        }
        let items = store.items;

        let item_map = {}
        for (let i = 0; i < items.length; i++) {
            item_map[items[i].name] = i
        }

        if (itemfile != null) {

            if (itemfile[0].mimetype != 'text/csv') {
                throw "Error: items must be uploaded in csv format"
            }
            let csvFilePath = itemfile[0].path
            let asyncUpdate = new Promise(async function(resolve, reject){
                try {
                    let jsonArray = await csv().fromFile(csvFilePath);
                    resolve(jsonArray);
                } catch (error) {
                    reject("Error: could not parse json");
                }
            })

            let jsonArray = await asyncUpdate; 
        
            let validItems = []

            for(let i = 0; i < jsonArray.length; i++) {
                let item = new Item(jsonArray[i]); 
                let error = item.validateSync(); 
                if(error == null) {
                    pos = item_map[item.name]
                    if (pos == null) {
                        validItems.push(item)
                    } else {
                        store.items[pos].name = item.name 
                        store.items[pos].brand = item.brand
                        store.items[pos].size = item.size
                        store.items[pos].category = item.category
                        store.items[pos].price = item.price
                    }
                    
                } else {
                    throw "Item: " + item.name + " could not be added to the database because of invalid formatting. Please upload your csv again"
                }
            }

            store.items = (store.items).concat(validItems)

            store = await store.save()

        }

        if (floorPlan != null) {

            if (floorPlan[0].mimetype != 'image/jpeg' && floorPlan[0].mimetype != 'image/jpg' && floorPlan[0].mimetype != 'image/png') {
                throw "Error: floor plan must be uploaded in jpeg, png, or jpg format"
            }

            let filedata = await fs.promises.readFile(floorPlan[0].path, "binary")
            console.log("read file")
            const params = {
                Bucket: BUCKET_NAME,
                Key: 'shopit-item-images/floorplan-images/' + username + "/" + floorPlan[0].originalname, 
                Body: filedata
            };
            let data = await s3.upload(params).promise()
            let location = data.Location
            console.log(`Floor plan uploaded successfully. ${location}`);
            store.floorPlan = location
            await store.save()
 
        }

        if (images != null) {
            let zip = new AdmZip(images[0].path);
            let zipEntries = zip.getEntries(); 
            const re = RegExp('^images\/.*\.(png|jpeg|jpg)')
            zipEntries.forEach(async function(zipEntry) {
                if (re.test(zipEntry.entryName)) {
                    console.log(zipEntry.entryName); 
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                    let name = zipEntry.entryName + '-' + uniqueSuffix
                    zip.extractEntryTo(zipEntry.entryName, '/tmp/cs130', false, true, name)
                    let filedata = await fs.promises.readFile('/tmp/cs130/' + name, "binary")
                    let start = zipEntry.entryName.indexOf('/')
                    let end = zipEntry.entryName.indexOf('.')
                    let item_name = zipEntry.entryName.substring(start+1, end)
                    console.log(item_name)
                    let position = item_map[item_name]
                    if (position != null) {
                        const params = {
                            Bucket: BUCKET_NAME,
                            Key: 'shopit-item-images/item-images/' + username + "/" + zipEntry.entryName, 
                            Body: filedata
                        };
                        let data = await s3.upload(params).promise()
                        let location = data.Location
                        console.log(`File uploaded successfully. ${location}`);
                        store.items[position].imageURL = location
                        await store.save()
                        response_map['validImages'].push(item_name)

                    }
                }
            })
 
        }
    } catch (error) {
        status_code = 500
        console.log(error)
        msg = error
    }

    if (status_code != 200) {
        console.log("bad response")
        res.status(status_code).json({'msg': msg})
    } else {
        response_map['msg'] = msg 
        res.status(200).json(response_map)
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
                let storeId = user.store
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
