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

AWS.config.update({region: 'us-west-2'});

const ID = process.env.ACCESS_KEY;
const SECRET = process.env.SECRET_KEY;
const BUCKET_NAME = process.env.BUCKET;

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "ApiError";
        this.status_code = statusCode;
    }
}

var jwt = require('jsonwebtoken');
var secret_key = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c"

var storage = multer.diskStorage({
    destination: '/tmp/cs130',
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

// Returns grocery store given lat and long
router.route('/at').get((req, res) => {
    const { name, address }  = req.query;

    if (!name || !address) res.status(400).json('Name and/or address not in query params');

    Store.findOne({name: { $eq : name }, address: { $eq : address }})
        .then(store => {
            if (store) res.json(store)
            else res.status(404).json(`Could not find store at ${name}, ${address}`)
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
            res.locals.user = decoded.usr
            next()
          }
      });
    }
})


// get grocery store

router.route('/:username').get((req, res) => {
    let username = req.params.username;
    if (res.locals.user != username) {
        res.status(401).json({msg: '401 error: Could not authenticate'})
    } else {
        User.findOne({username: username})
        .then(user => {
            if (user.store == null) {
                res.status(200).json({exists: false, msg: "Store does not exist (yet)"})
            } else {
                Store.findById(user.store)
                    .then(store => {
                        if (store == null) {
                            res.status(200).json({exists: false, msg: "Store was deleted"})
                        } else {
                            res.status(200).json({exists: true, storeId: store._id, name: store.name, address: store.address,
                                                  items: store.items, floorPlan: store.floorPlan,
                                                  msg: "Found store!"})
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

    try {
        if (res.locals.user != username) {
            throw new ApiError("Could not authenticate user", 401)
        }
        const { name, address  } = req.body;
        
        let user = await User.findOne({username: username});
        let store = await Store.findById(user.store)
        if (store == null) {
            const newStore = new Store({
                name: name,
                address: address
            });
            let existing_store = await Store.findOne({name: name, address: address})
            if (existing_store != null) {
                throw new ApiError("Grocery store with name: " + name + " and address: " + address + " is already in the database, please use another name and/or address", 400)
            }

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
                throw new ApiError("Items must be uploaded in csv format", 400)
            }
            let csvFilePath = itemfile[0].path

            let jsonArray = await csv().fromFile(csvFilePath);

            let validItems = []

            for(let i = 0; i < jsonArray.length; i++) {
                let item = new Item(jsonArray[i]);
                let error = item.validateSync();
                if(error == null) {
                    let pos = item_map[item.name]
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
                    throw new ApiError("Item: " + item.name + " could not be added to the database because of invalid formatting. Please upload your csv again", 400)
                }
            }

            store.items = (store.items).concat(validItems)

            store = await store.save()

        }

        if (floorPlan != null) {

            if (floorPlan[0].mimetype != 'image/jpeg' && floorPlan[0].mimetype != 'image/jpg' && floorPlan[0].mimetype != 'image/png') {
                throw new ApiError("Floor plan must be uploaded in jpeg, png, or jpg format", 400)
            }

            let filedata = await fs.promises.readFile(floorPlan[0].path)
            const params = {
                Bucket: BUCKET_NAME,
                ACL: 'public-read',
                Key: 'floorplan-images/' + username + "/" + floorPlan[0].originalname,
                Body: filedata,
                ContentType: floorPlan[0].mimetype
            };
            let data = await s3.upload(params).promise()
            let location = data.Location
            console.log(`Floor plan uploaded successfully. ${location}`);
            store.floorPlan = location
            await store.save()

        }

        if (images != null) {
            if (images[0].mimetype != 'application/zip') {
                throw new ApiError("Images must be uploaded in zip format", 400)
            }

            let items = store.items;

            let item_map = {}
            for (let i = 0; i < items.length; i++) {
                item_map[items[i].name] = i
            }
            
            let zip = new AdmZip(images[0].path);
            let zipEntries = zip.getEntries();

            const re = RegExp('\/.*\.(png|jpeg|jpg)') //eslint-disable-line
            await Promise.all(zipEntries.map(async (zipEntry) => {
                if (re.test(zipEntry.entryName)) {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                    let name = zipEntry.entryName + '-' + uniqueSuffix
                    zip.extractEntryTo(zipEntry.entryName, '/tmp/cs130', false, true, name)
                    let filedata = await fs.promises.readFile('/tmp/cs130/' + name)
                    let start = zipEntry.entryName.lastIndexOf('/')
                    let end = zipEntry.entryName.lastIndexOf('.')
                    let item_name = zipEntry.entryName.substring(start+1, end)
                    let position = item_map[item_name]
                    if (position != null) {
                        const params = {
                            Bucket: BUCKET_NAME,
                            ACL: 'public-read',
                            Key: 'item-images/' + username + "/images/" + item_name + zipEntry.entryName.substring(end),
                            Body: filedata,
                            ContentType: 'image/' + zipEntry.entryName.substring(end+1)
                        };
                        let data = await s3.upload(params).promise()
                        let location = data.Location
                        console.log(`File uploaded successfully. ${location}`);
                        // needed to handle ParallelSaveError
                        let store = await Store.findById(user.store)
                        store.items[position].imageURL = location
                        await store.save()

                    }
                }
            }))

        }
    } catch (error) {
        if (error instanceof ApiError) {
            status_code = error.status_code
            console.log(error.message)
            msg = error.message
        } else {
            status_code = 500
            msg = error
        }
        console.log(error)
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

    if(res.locals.user != username) {
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
