const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
const fs = require('fs')
const csv = require('csvtojson')
const path = require("path")
const suppressLogs = require('mocha-suppress-logs');
let app = require('../app.js');

const Store = require('../models/store.model');
const User = require('../models/user.model');

const testPort = 8888;
chai.use(chaiHttp);
suppressLogs();

const exampleStore1 = {
    "name": "Lucky's",
    "address": "Foothill Expressway, Palo Alto, CA, USA"
};

const exampleStore2 = {
    "name": "Trader Joe's",
    "address": "Glendon Ave, Los Angeles, CA"
}

const exampleUser = {
    "username": "testuser1", 
    "password": "testpassword1"
}

let token; 

// Start the node server before running tests.
before((done) => {
	app.on('Mongoose ready', () => {
		app = app.listen(testPort, () => {
			console.log(`Test server is running on port ${testPort}!\n`);
			done();
		});
	});
});

describe('Stores', () => {
    describe('GET /stores/at', () => {
        afterEach(async() => {
            await Store.findOneAndDelete({name: exampleStore1.name, address: exampleStore1.address})
            await Store.findOneAndDelete({name: exampleStore2.name, address: exampleStore2.address})
        }); 

        it('Should return store at name and location', async () => {
            let newStore1 = new Store(exampleStore1);
            let newStore2 = new Store(exampleStore2);

            await newStore1.save();
            await newStore2.save();

            return await chai.request(app)
                .get('/stores/at')
                .query({ name: newStore1.name, address: newStore1.address })
                .then((res) => {
                    assert.strictEqual(res.status, 200);
                    assert.strictEqual(res.body.name, newStore1.name);
                })
        });

        it('Should return an error if store not found', async () => {
            let newStore1 = new Store(exampleStore1);
            let newStore2 = new Store(exampleStore2);

            await newStore1.save();
            await newStore2.save();

            return await chai.request(app)
                .get('/stores/at')
                .query({ name: newStore1.name, address: newStore2.address })
                .then((res) => {
                    assert.strictEqual(res.status, 404);
                })
        });

        it('Should return an error if name or address not given', async () => {
            return await chai.request(app)
                .get('/stores/at')
                .then((res) => {
                    assert.strictEqual(res.status, 400);
                })
        });
    });

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
            let user = await User.findOne({username: exampleUser.username}); 
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


            let filepath = path.resolve(__dirname, "../test_files/floor_plan.png")
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
                    'floor_plan.png'
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

        it('Should upload store floor plan from floor_plan.png file', async () => {


            let filepath = path.resolve(__dirname, "../test_files/floor_plan.png")

            let store = new Store(exampleStore1);
            let saved_store = await store.save();
            let user = await User.findOne({username: exampleUser.username});
            user.store = saved_store
            await user.save()

            return await chai.request(app)
                .post('/stores/' + exampleUser.username)
                .set('Cookie', token)
                .set('Content-Type', 'multipart/form-data')
                .field('name', saved_store.name)
                .field('address', saved_store.address)
                .attach('floorPlan', 
                    fs.readFileSync(filepath), 
                    'floor_plan.png'
                )
                .then((res) => {
                        assert.strictEqual(res.status, 200);
                        return User.findOne({username: exampleUser.username});
                }).then((user) => {
                    return Store.findById(user.store);
                }).then((store) => {
                    assert.notStrictEqual(null, store); 
                    assert.notStrictEqual(undefined, store);
                    assert.strictEqual("https://shopit-item-images.s3.us-west-2.amazonaws.com/floorplan-images/" + user.username + "/floor_plan.png", store.floorPlan)

                }); 
                
        });

        it('Should reject POST request because floor plan is not a valid image (floor plan must be in jpeg, png, or jpg form', async () => {


            let filepath = path.resolve(__dirname, "../test_files/items_valid.csv")

            let name = "Trader Joe's";
            let address = "Westwood, CA";

            return await chai.request(app)
                .post('/stores/' + exampleUser.username)
                .set('Cookie', token)
                .set('Content-Type', 'multipart/form-data')
                .field('name', name)
                .field('address', address)
                .attach('floorPlan', 
                    fs.readFileSync(filepath), 
                    'items_valid.csv'
                )
                .then((res) => {
                    assert.strictEqual(res.status, 400);
                });
                
        });

        it('Should match items in store to images in zip file', async () => {


            let filepath = path.resolve(__dirname, "../test_files/images1.zip")

            let store = new Store(exampleStore1); 
            store.items = [{name: "pizza", brand: "Tasty Pizza", category: "Frozen Foods", size: "10 oz", price: 3.99}];
            store.items.push({name: "pudding", brand: "some brand", category: "Dairy", size: "6 oz", price: 5.99});
            let saved_store = await store.save();
            let user = await User.findOne({username: exampleUser.username});
            user.store = saved_store
            user = await user.save()

            return await chai.request(app)
                .post('/stores/' + exampleUser.username)
                .set('Cookie', token)
                .set('Content-Type', 'multipart/form-data')
                .field('name', saved_store.name)
                .field('address', saved_store.address)
                .attach('images', 
                    fs.readFileSync(filepath), 
                    'images1.zip'
                )
                .then((res) => {
                    assert.strictEqual(res.status, 200);
                    return User.findOne({username: exampleUser.username});
                }).then((user) => {
                    return Store.findById(user.store);
                }).then((store) => {
                    assert.notStrictEqual(null, store); 
                    assert.notStrictEqual(undefined, store);

                    assert.strictEqual("https://shopit-item-images.s3.us-west-2.amazonaws.com/item-images/" + user.username + "/images/pizza.jpeg", store.items[0].imageURL)
                    assert.strictEqual("https://shopit-item-images.s3.us-west-2.amazonaws.com/item-images/default.png", store.items[1].imageURL)

                    // also compare pudding image (not equal)

                }); 
                
        });

        it('Should reject POST request because images is not valid (images must be in zip form)', async () => {


            let filepath = path.resolve(__dirname, "../test_files/floor_plan.png")

            let name = "Trader Joe's";
            let address = "Westwood, CA";

            return await chai.request(app)
                .post('/stores/' + exampleUser.username)
                .set('Cookie', token)
                .set('Content-Type', 'multipart/form-data')
                .field('name', name)
                .field('address', address)
                .attach('images', 
                    fs.readFileSync(filepath), 
                    'floor_plan.png'
                )
                .then((res) => {
                    assert.strictEqual(res.status, 400);
                });
                
        });

        


    }); 
    

    describe('DELETE /stores/username', () => {

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
            let user = await User.findOne({username: exampleUser.username}); 
            await Store.findByIdAndDelete(user.store); 
            await User.findOneAndDelete({username: exampleUser.username}); 
        }); 

        it('Should delete a store', async () => {
            let newStore = new Store(exampleStore1);
            let saved_store = await newStore.save();
            let user = await User.findOne({username: exampleUser.username});
            user.store = saved_store
            user = await user.save()

            return await chai.request(app)
                .delete('/stores/' + exampleUser.username)
                .set('Cookie', token)
                .then(async (res) => {
                    assert.strictEqual(res.status, 200);
                    let store = await Store.findById(user.store);
                    assert.strictEqual(store, null);
                })
        });

        it('Should return an error if store not found', async () => {
            return await chai.request(app)
            .delete('/stores/' + exampleUser.username)
            .set('Cookie', token)
            .then(async (res) => {
                assert.strictEqual(res.status, 400);
            })
        });
    });

    describe('Authentication tests', () => {

        afterEach(async() => {
            await Store.findOneAndDelete({name: exampleStore1.name, address: exampleStore1.address})
            await User.findOneAndDelete({username: exampleUser.username}); 
        }); 

        it('Should reject GET /stores/username because user is not authenticated', async () => {

            let user = new User(exampleUser)
            let saved_user = await user.save()
            return await chai.request(app)
                .get('/stores/' + saved_user.username)
                .then((res) => {
                    assert.strictEqual(res.status, 401);
                })
        });

        it('Should reject POST /stores/username because user is not authenticated', async () => {

            let newStore = new Store(exampleStore1);
            let saved_store = await newStore.save();
            let user = new User(exampleUser)
            user = await user.save()
            user.store = saved_store
            user = await user.save()

            return await chai.request(app)
                .post('/stores/' + user.username)
                .set('Content-Type', 'multipart/form-data')
                .field('name', "Test")
                .field('address', saved_store.address)
                .then((res) => {
                    assert.strictEqual(res.status, 401);
                })
        });

        it('Should reject DELETE /stores/username because user is not authenticated', async () => {

            let user = new User(exampleUser)
            let saved_user = await user.save()
            return await chai.request(app)
                .delete('/stores/' + saved_user.username)
                .then((res) => {
                    assert.strictEqual(res.status, 401);
                })
        });

    });
});

after((done) => {
    app.close();
    done();
});
