const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
const app = require('../server.js');

const StoreModel = require('../models/store.model');

chai.use(chaiHttp);

//This test suite is dependent on a specific store and specific items within that store.
const storedID = '5fc5658b9e729a2b5421bcb7';
const firstItemID = '5fc568c0525eab2dd54eed04';
const secondItemID = '5fc568c0525eab2dd54eed05';

//Start the node server before running tests.
before((done) => {
    app.on("Ready", () => done());
});


describe('Items', () => {
    describe('GET', () => {
        describe('get all items', () =>{ 
            it('Should return list of all items', async () =>{
                //grabbing a storeId from the mongodb database.
                //get request
                let endpoint = `/items?storeId=${storedID}`
                return await chai.request(app)
                    .get(endpoint)
                    .then((res) => {
                        assert.strictEqual(res.status, 200);
                        assert.ok(Array.isArray(res.body));
                        assert.strictEqual(res.body.length, 12);
                    })
            });
            it('Should have no items if no store specified', async () =>{

                return await chai.request(app)
                    .get('/items?storeId=Trash!')
                    .then((res) => {
                        assert.strictEqual(res.status, 400);
                    })
            });

        });
    });
    describe('POST', () => {
        describe('adding items', () => {
            it('Should add an item to a specific grocery store', () => {
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
                        "storeId": storedID
                    }

                return chai.request(app)
                    .post('/items/add')
                    .send(body)
                    .then(async (res) => {
                        //assertions.
                        assert.strictEqual(res.status, 200);
                        StoreModel.find({'_id':storedID}).then((res) =>{
                            assert.notStrictEqual(res[0].items.length, 0);
                            const result = res[0].items.find( item => item.name === 'Grinch Toes');
                            assert.notStrictEqual(result, null);
                        });
                        //delete what we added from db.
                        await StoreModel.updateOne({ _id : storedID}, {$pull: {items: {name: "Grinch Toes"} } });
                    });
            });
            it('Should not be able to add if no body', () =>{
                return chai.request(app)
                    .post('/items/add')
                    .send({"data" : {"name":"pog"}})
                    .then(async (res) =>{
                        assert.strictEqual(res.status, 404);
                    });
            });
            it('Should not be able to add if no such store exists', () => {
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
                    .send(body)
                    .then(async (res) =>{
                        assert.strictEqual(res.status, 500);
                    });
            });
        });
        it('Should be able to add 2 items', () => {
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
                    "storeId": storedID
                }

                return chai.request(app)
                    .post('/items/addMany')
                    .send(body)
                    .then(async (res) =>{
                        assert.strictEqual(res.status, 200);
                        //delete what we added from db.
                        await  StoreModel.updateOne({ _id : storedID}, {$pull: {items: {name: "Kool Aid Flakes"} } });
                        await  StoreModel.updateOne({ _id : storedID}, {$pull: {items: {name: "Gator Meat"} } });
                    });
        });
    }); 

    describe('PUT', () => {
        describe('updating locations', () => {
            it('Should be able to update several existing items location', () =>{
                const body =
                    {
                        "itemIds": [firstItemID, secondItemID],
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
                        "storeId": storedID
                    }
                return chai.request(app)
                    .put('/items/locations')
                    .send(body)
                    .then(async (res) => {
                        assert.strictEqual(res.status, 200);
                        return StoreModel.find({'_id' : storedID}).then(res => {
                            assert.notStrictEqual(res[0].items.length, 0);
                            const result = res[0].items.find(item => item.name === 'coca cola' && item.posX == 10 && item.posY == 10);
                            const resultTwo = res[0].items.find(item => item.name === 'jolly rancher' && item.posX == 20 && item.posY == 20);
                            assert.notStrictEqual(result, null);
                            assert.notStrictEqual(resultTwo, null);
                        });
                    });

            });
            it('Should have nothing updated because no data', () =>{
                const body =
                {
                    "itemIds": [],
                    "itemLocations": [],
                    "storeId": storedID
                }
                return chai.request(app)
                    .put('/items/locations')
                    .send(body)
                    .then(res => {
                        assert.strictEqual(res.status, 200);
                    });
            });
        });
    });

});