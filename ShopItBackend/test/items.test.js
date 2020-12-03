const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
const app = require('../server.js');

const Store = require('../models/store.model');
const User = require('../models/user.model');

chai.use(chaiHttp);



const exampleStore1 = {
    "name": "teststore",
    "address": "testaddress"
};

const exampleUser = {
    "username": "testinguser1", 
    "password": "testpassword1"
}

let token; 

//Start the node server before running tests.
before((done) => {
    app.on("Ready", () => done());
});


describe('Items', () => {

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
        await Store.findOneAndDelete({name: exampleStore1.name, address: exampleStore1.address})
        await User.findOneAndDelete({username: exampleUser.username}); 
    }); 

    describe('GET', () => {
        describe('get all items', () =>{ 
            it('Should return list of all items', async () =>{
                //grabbing a storeId from the mongodb database.
                //get request
                let store = new Store(exampleStore1)
                store.items = [{name: "coca cola", brand: "coke", category: "Beverages", size: "10 oz", price: 3.99}];
                store = await store.save()
                let endpoint = `/items?storeId=${store._id}`
                return await chai.request(app)
                    .get(endpoint)
                    .set('Cookie', token)
                    .then((res) => {
                        assert.strictEqual(res.status, 200);
                        assert.ok(Array.isArray(res.body));
                        assert.strictEqual(res.body.length, 1);
                    })
            });
            it('Should have no items if store specified doesnt exist', async () =>{

                return await chai.request(app)
                    .get('/items?storeId=Trash!')
                    .set('Cookie', token)
                    .then((res) => {
                        assert.strictEqual(res.status, 400);
                    })
            });

        });
    });
    describe('POST', () => {
        describe('adding items', () => {
            it('Should add an item to a specific grocery store', async () => {
                let store = new Store(exampleStore1)
                store = await store.save()
                const body =
                    {
                        "data": {
                            "name": "Grinch Toes",
                            "category": "Meat",
                            "brand": "Trader Joe's",
                            "price": 3.99,
                            "size": "12 oz",
                            "posX": 50,
                            "posY": 50
                        },
                        "storeId": store._id
                    }

                return chai.request(app)
                    .post('/items/add')
                    .set('Cookie', token)
                    .send(body)
                    .then((res) => {
                        //assertions.
                        assert.strictEqual(res.status, 200);
                        Store.find({'_id':store._id}).then((res) =>{
                            assert.notStrictEqual(res[0].items.length, 0);
                            const result = res[0].items.find( item => item.name === 'Grinch Toes');
                            assert.notStrictEqual(result, null);
                        });
                    });
            });
            it('Should not be able to add if no store id', () =>{
                return chai.request(app)
                    .post('/items/add')
                    .set('Cookie', token)
                    .send({"data" : {"name":"pog"}})
                    .then((res) =>{
                        assert.strictEqual(res.status, 404);
                    });
            });
            it('Should not be able to add if no such store exists', async () => {
                const body =
                    {
                        "data": {
                            "name": "Chicken breast",
                            "category": "Meat",
                            "brand": "Trader Joe's",
                            "price": 8.99,
                            "size": "10 oz",
                            "posX": 40,
                            "posY": 50
                        },
                        "storeId": ""
                    }
                return chai.request(app)
                    .post('/items/add')
                    .set('Cookie', token)
                    .send(body)
                    .then((res) =>{
                        assert.strictEqual(res.status, 500);
                    });
            });
        });
        it('Should be able to add 2 items', async () => {
            let store = new Store(exampleStore1)
            store = await store.save()
            const body =
                {
                    "data": [
                        {
                        "name": "Gator Meat",
                        "category": "Meat",
                        "brand": "Trader Joe's",
                        "price": 8.99,
                        "size": "10 oz",
                        "posX": 40,
                        "posY": 50
                        },
                        {
                            "name": "Kool Aid Flakes",
                            "category": "Cereal",
                            "brand": "Trader Joe's",
                            "price": 5.99,
                            "size": "10 oz",
                            "posX": 40,
                            "posY": 50
                        }
                    ],
                    "storeId": store._id
                }

                return chai.request(app)
                    .post('/items/addMany')
                    .set('Cookie', token)
                    .send(body)
                    .then((res) =>{
                        assert.strictEqual(res.status, 200);        
                    });
        });
        it('Should not add anything with no items for addMany', async () => {
            return chai.request(app)
                    .post('/items/addMany')
                    .set('Cookie', token)
                    .send({})
                    .then((res) =>{
                        assert.strictEqual(res.status, 400);
                    });
        });
    }); 

    describe('PUT', () => {
        describe('updating locations', () => {
            it('Should be able to update several existing items location', async () =>{
                let store = new Store(exampleStore1)
                store.items = [{name: "coca cola", brand: "coke", category: "Beverages", size: "10 oz", price: 3.99}];
                store.items.push({name: "jolly rancher", brand: "general mills", category: "candy", size: "5 oz", price: 3.99});
                store = await store.save()
                const body =
                    {
                        "itemIds": [store.items[0]._id, store.items[1]._id],
                        "itemLocations": [ 
                            {
                                "posX": 10,
                                "posY": 10
                            },
                            {
                                "posX":20,
                                "posY":20
                            }
                        ],
                        "storeId": store._id
                    }
                return chai.request(app)
                    .put('/items/locations')
                    .set('Cookie', token)
                    .send(body)
                    .then((res) => {
                        assert.strictEqual(res.status, 200);
                        Store.find({'_id' : store._id}).then(res => {
                            assert.notStrictEqual(res[0].items.length, 0);
                            const result = res[0].items.find(item => item.name === 'coca cola' && item.posX == 10 && item.posY == 10);
                            const resultTwo = res[0].items.find(item => item.name === 'jolly rancher' && item.posX == 20 && item.posY == 20);
                            assert.notStrictEqual(result, null);
                            assert.notStrictEqual(resultTwo, null);
                        });
                    });

            });
            it('Should not get locations because bad store id', async () =>{
                const body =
                {
                    "itemIds": [],
                    "itemLocations": [],
                    "storeId": 'bad'
                }
                return chai.request(app)
                .put('/items/locations')
                .set('Cookie', token)
                .send(body)
                .then((res) => {
                    assert.strictEqual(res.status, 400);
                });
            });
            it('Should have nothing updated because no data', async () =>{
                let store = new Store(exampleStore1)
                store = await store.save()
                const body =
                {
                    "itemIds": [],
                    "itemLocations": [],
                    "storeId": store._id
                }
                return chai.request(app)
                    .put('/items/locations')
                    .set('Cookie', token)
                    .send(body)
                    .then(res => {
                        assert.strictEqual(res.status, 200);
                    });
            });
        });
    });

});