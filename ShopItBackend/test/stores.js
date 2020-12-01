const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
const app = require('../server.js');
const fs = require('fs')
const csv = require('csvtojson')
const path = require("path")

const Store = require('../models/store.model');
const User = require('../models/user.model');

chai.use(chaiHttp);

const exampleStore1 = {
    "name": "Lucky's",
    "address": "Foothill Expressway, Palo Alto, CA, USA"
};

const exampleStore2 = {
    "name": "Trader Joe's",
    "long": "Glendon Ave, Los Angeles, CA"
}

const exampleUser = {
    "username": "testuser1", 
    "password": "testpassword1"
}

let token; 

before((done) => {
    app.on("Ready", () => done());
});

describe('Stores', () => {
    // beforeEach(async () => { //Before each test we empty the database
    //     await Store.deleteMany({});
    // });

    // describe('GET', () => {
    //     describe('Find all stores', () => {
    //         it('Should return list of all stores', async () => {
    //             let newStore1 = new Store(exampleStore);
    //             let newStore2 = new Store(exampleStore2);

    //             await newStore1.save();
    //             await newStore2.save();

    //             return await chai.request(app)
    //                 .get('/stores')
    //                 .then((res) => {
    //                     assert.strictEqual(res.status, 200);
    //                     assert.ok(Array.isArray(res.body));
    //                     assert.strictEqual(res.body.length, 2);
    //                 })
    //         });

    //         it('Should return empty list if no stores exist', async () => {
    //             return await chai.request(app)
    //                 .get('/stores')
    //                 .then((res) => {
    //                     assert.strictEqual(res.status, 200);
    //                     assert.ok(Array.isArray(res.body));
    //                     assert.strictEqual(res.body.length, 0);
    //                 })
    //         });
    //     });

    //     describe('Find store at specified name and address', () => {
    //         it('Should return store at location', async () => {
    //             let newStore1 = new Store(exampleStore);
    //             let newStore2 = new Store(exampleStore2);

    //             await newStore1.save();
    //             await newStore2.save();

    //             return await chai.request(app)
    //                 .get('/stores/at')
    //                 .query({ name: newStore1.name, address: newStore1.address })
    //                 .then((res) => {
    //                     assert.strictEqual(res.status, 200);
    //                     assert.strictEqual(res.body.name, newStore1.name);
    //                 })
    //         });

    //         it('Should return an error if store not found', async () => {
    //             let newStore1 = new Store(exampleStore);
    //             let newStore2 = new Store(exampleStore2);

    //             await newStore1.save();
    //             await newStore2.save();

    //             return await chai.request(app)
    //                 .get('/stores/at')
    //                 .query({ name: newStore1.name, address: newStore2.address })
    //                 .then((res) => {
    //                     assert.strictEqual(res.status, 404);
    //                 })
    //         });

    //         it('Should return an error if name or address not given', async () => {
    //             return await chai.request(app)
    //                 .get('/stores/at')
    //                 .then((res) => {
    //                     assert.strictEqual(res.status, 400);
    //                 })
    //         });
    //     });

    // });

    describe('GET /stores/:username', () => {
        beforeEach(async() => {
            await chai.request(app)
              .post("/users/signup")
              .send(exampleUser)
              .then((res) => {
                assert.strictEqual(res.status, 200);
              });
        });

        beforeEach(async() => {
            await chai.request(app)
              .post("/users/login")
              .send(exampleUser)
              .then((res) => {
                token = res.headers['set-cookie'][0]
                assert.strictEqual(res.status, 200);
              });
        });

        afterEach(async() => {
            await User.findOneAndDelete({username: exampleUser.username})
            await Store.findOneAndDelete({name: exampleStore1.name, address: exampleStore1.address})
        }); 

        it('Should return store that corresponds to user', async () => {
            let newStore1 = new Store(exampleStore1);
            newStore1 = await newStore1.save();
            let user1 = await User.findOne({username: exampleUser.username})
            user1.store = newStore1
            await user1.save()

            return await chai.request(app)
                .get('/stores/' + exampleUser.username)
                .set('Cookie', token)
                    .then((res) => {
                        assert.strictEqual(res.status, 200);
                        assert.strictEqual(res.body.name, newStore1.name);
                        assert.strictEqual(res.body.address, newStore1.address);
            })
        });
        
        it('Should return null store', async () => {

            return await chai.request(app)
                .get('/stores/' + exampleUser.username)
                .set('Cookie', token)
                    .then((res) => {
                        assert.strictEqual(res.status, 200);
                        assert.strictEqual(res.body.name, undefined);
                        assert.strictEqual(res.body.address, undefined);
            })
        });

    }); 

    describe('POST /stores/:username', () => {
        beforeEach(async() => {
            await chai.request(app)
              .post("/users/signup")
              .send(exampleUser)
              .then((res) => {
                assert.strictEqual(res.status, 200);
              });
        });

        beforeEach(async() => {
            await chai.request(app)
              .post("/users/login")
              .send(exampleUser)
              .then((res) => {
                token = res.headers['set-cookie'][0]
                assert.strictEqual(res.status, 200);
              });
        });

        afterEach(async() => {
            user = await User.findOne({username: exampleUser.username}); 
            await Store.findByIdAndDelete(user.store); 
            await User.findOneAndDelete({username: exampleUser.username}); 
        }); 

        it('Should add new store with items given by items_valid.csv file', async () => {


            let filepath = path.resolve(__dirname, "../test_files/items_valid.csv")
            let items = await csv().fromFile(filepath);
            let name = "Trader Joe's";
            let address = 'Westwood, CA';
            return await chai.request(app)
                .post('/stores/' + exampleUser.username)
                .set('Cookie', token)
                .set('Content-Type', 'multipart/form-data')
                .field('name', name)
                .field('address', address)
                .attach('items', 
                    fs.readFileSync(filepath), 
                    'items_valid.csv'
                )
                .then((res) => {
                        assert.strictEqual(res.status, 200);
                        return User.findOne({username: exampleUser.username});
                }).then((user) => {
                    return Store.findById(user.store);
                }).then((store) => {
                    assert.notStrictEqual(null, store); 
                    assert.notStrictEqual(undefined, store);

                    assert.strictEqual(name, store.name)
                    assert.strictEqual(address, store.address)
                    for (let i = 0; i < items.length; i++) {
                        assert.strictEqual(items[i].name, store.items[i].name)
                        assert.strictEqual(items[i].brand, store.items[i].brand)
                        assert.strictEqual(items[i].category, store.items[i].category)
                        assert.strictEqual(parseFloat(items[i].price), store.items[i].price)
                        assert.strictEqual(items[i].size, store.items[i].size)
                    }

                }); 
                
        });
        it('Should reject POST request because file is not in csv format', async () => {


            let filepath = path.resolve(__dirname, "../test_files/floor_plan.jpg")
            let name = "Trader Joe's";
            let address = 'Westwood, CA';
            return await chai.request(app)
                .post('/stores/' + exampleUser.username)
                .set('Cookie', token)
                .set('Content-Type', 'multipart/form-data')
                .field('name', name)
                .field('address', address)
                .attach('items', 
                    fs.readFileSync(filepath), 
                    'floor_plan.jpg'
                )
                .then((res) => {
                    assert.strictEqual(res.status, 400);
                })
                
        });

        it('Should reject POST request because item "chicken" in items_invalid.csv does not have an associated brand, which is required', async () => {


            let filepath = path.resolve(__dirname, "../test_files/items_invalid.csv")
            let name = "Trader Joe's";
            let address = 'Westwood, CA';
            return await chai.request(app)
                .post('/stores/' + exampleUser.username)
                .set('Cookie', token)
                .set('Content-Type', 'multipart/form-data')
                .field('name', name)
                .field('address', address)
                .attach('items', 
                    fs.readFileSync(filepath), 
                    'items_invalid.csv'
                )
                .then((res) => {
                    assert.strictEqual(res.status, 400);
                })
                
        });

        it('Should update existing store items (based on items_valid.csv file) and name field', async () => {


            let filepath = path.resolve(__dirname, "../test_files/items_valid.csv")
            let items = await csv().fromFile(filepath);

            let store = new Store(exampleStore1); 
            store.items = [{name: "pizza", brand: "Tasty Pizza", category: "Frozen Foods", size: "10 oz", price: 3.99}];
            let saved_store = await store.save();
            let user = await User.findOne({username: exampleUser.username});
            user.store = saved_store
            await user.save()

            return await chai.request(app)
                .post('/stores/' + exampleUser.username)
                .set('Cookie', token)
                .set('Content-Type', 'multipart/form-data')
                .field('name', "Ralph's")
                .field('address', saved_store.address)
                .attach('items', 
                    fs.readFileSync(filepath), 
                    'items_valid.csv'
                )
                .then((res) => {
                        assert.strictEqual(res.status, 200);
                        return User.findOne({username: exampleUser.username});
                }).then((user) => {
                    return Store.findById(user.store);
                }).then((store) => {
                    assert.notStrictEqual(null, store); 
                    assert.notStrictEqual(undefined, store);

                    assert.strictEqual("Ralph's", store.name)
                    assert.strictEqual(saved_store.address, store.address)
                    assert.strictEqual(items.length, store.items.length)
                    for (let i = 0; i < items.length; i++) {
                        if(items[i].name == "pizza") {
                            for(let j = 0; j < store.items.length; j++) {
                                if (store.items[j].name == "pizza") {
                                    assert.strictEqual(items[i].brand, store.items[j].brand)
                                    assert.strictEqual(items[i].category, store.items[j].category)
                                    assert.strictEqual(parseFloat(items[i].price), store.items[j].price)
                                    assert.strictEqual(items[i].size, store.items[j].size)
                                }
                            }

                        }
                        
                    }

                }); 
                
        });

        


    }); 
    
    // describe('POST', () => {
    //     describe('Add a store', () => {
    //         it('Should add a store', async () => {
    //             return await chai.request(app)
    //                 .post('/stores/add')
    //                 .send(exampleStore)
    //                 .then(async (res) => {
    //                     assert.strictEqual(res.status, 200);
    //                     let stores = await Store.find();
    //                     assert.strictEqual(stores.length, 1);
    //                 })
    //         });

    //         it('Should return return an error if not all required parameters' 
    //             + ' are given', async () => {
    //             return await chai.request(app)
    //                 .post('/stores/add')
    //                 .send({
    //                     "long": 100,
    //                     "lat": 100
    //                 })
    //                 .then(async (res) => {
    //                     assert.strictEqual(res.status, 400);
    //                 })
    //         });

    //         it('Should return return an error if store with same (lat, long) already'
    //             + ' exists in the database', async () => {
    //             let newStore = new Store(exampleStore);
    //             await newStore.save();

    //             return await chai.request(app)
    //                 .post('/stores/add')
    //                 .send(exampleStore)
    //                 .then(async (res) => {
    //                     assert.strictEqual(res.status, 400);
    //                 })
    //         });
    //     });
    // });

    // describe('DELETE', () => {
    //     describe('Remove a store', () => {
    //         it('Should delete a store', async () => {
    //             let newStore = new Store(exampleStore);
    //             let dbNewStore = await newStore.save();

    //             return await chai.request(app)
    //                 .delete('/stores/delete')
    //                 .send({
    //                     "storeId": dbNewStore._id
    //                 })
    //                 .then(async (res) => {
    //                     assert.strictEqual(res.status, 200);
    //                     let stores = await Store.find();
    //                     assert.strictEqual(stores.length, 0);
    //                 })
    //         });

    //         it('Should return an error if store not found', async () => {
    //             return await chai.request(app)
    //                 .delete('/stores/delete')
    //                 .send({
    //                     "storeId": 'wrongId'
    //                 })
    //                 .then(async (res) => {
    //                     assert.strictEqual(res.status, 404);
    //                 })
    //         });
    //     });
    // });
});