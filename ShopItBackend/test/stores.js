const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
const app = require('../server.js');

const Store = require('../models/store.model');

chai.use(chaiHttp);

const exampleStore = {
    "name": "Safeway",
    "long": 100,
    "lat": 100
};

const exampleStore2 = {
    "name": "Trader Joe's",
    "long": 200,
    "lat": 200
}

before((done) => {
    app.on("Ready", () => done());
});

describe('Stores', () => {
    beforeEach(async () => { //Before each test we empty the database
        await Store.deleteMany({});
    });

    describe('GET', () => {
        describe('Find all stores', () => {
            it('Should return list of all stores', async () => {
                let newStore1 = new Store(exampleStore);
                let newStore2 = new Store(exampleStore2);

                await newStore1.save();
                await newStore2.save();

                return await chai.request(app)
                    .get('/stores')
                    .then((res) => {
                        assert.strictEqual(res.status, 200);
                        assert.ok(Array.isArray(res.body));
                        assert.strictEqual(res.body.length, 2);
                    })
            });

            it('Should return empty list if no stores exist', async () => {
                return await chai.request(app)
                    .get('/stores')
                    .then((res) => {
                        assert.strictEqual(res.status, 200);
                        assert.ok(Array.isArray(res.body));
                        assert.strictEqual(res.body.length, 0);
                    })
            });
        });

        describe('Find store at specified latitude and longitude', () => {
            it('Should return store at location', async () => {
                let newStore1 = new Store(exampleStore);
                let newStore2 = new Store(exampleStore2);

                await newStore1.save();
                await newStore2.save();

                return await chai.request(app)
                    .get('/stores/at')
                    .query({ lat: newStore1.lat, long: newStore1.long })
                    .then((res) => {
                        assert.strictEqual(res.status, 200);
                        assert.strictEqual(res.body.name, newStore1.name);
                    })
            });

            it('Should return an error if store not found', async () => {
                let newStore1 = new Store(exampleStore);
                let newStore2 = new Store(exampleStore2);

                await newStore1.save();
                await newStore2.save();

                return await chai.request(app)
                    .get('/stores/at')
                    .query({ lat: newStore1.lat, long: newStore2.long })
                    .then((res) => {
                        assert.strictEqual(res.status, 404);
                    })
            });
        });
    });
    
    describe('POST', () => {
        describe('Add a store', () => {
            it('Should add a store', async () => {
                return await chai.request(app)
                    .post('/stores/add')
                    .send(exampleStore)
                    .then(async (res) => {
                        assert.strictEqual(res.status, 200);
                        let stores = await Store.find();
                        assert.strictEqual(stores.length, 1);
                    })
            });

            it('Should return return an error if not all required parameters' 
                + ' are given', async () => {
                return await chai.request(app)
                    .post('/stores/add')
                    .send({
                        "long": 100,
                        "lat": 100
                    })
                    .then(async (res) => {
                        assert.strictEqual(res.status, 400);
                    })
            });

            it('Should return return an error if store with same (lat, long) already'
                + ' exists in the database', async () => {
                let newStore = new Store(exampleStore);
                await newStore.save();

                return await chai.request(app)
                    .post('/stores/add')
                    .send(exampleStore)
                    .then(async (res) => {
                        assert.strictEqual(res.status, 400);
                    })
            });
        });
    });

    describe('DELETE', () => {
        describe('Remove a store', () => {
            it('Should delete a store', async () => {
                let newStore = new Store(exampleStore);
                let dbNewStore = await newStore.save();

                return await chai.request(app)
                    .delete('/stores/delete')
                    .send({
                        "storeId": dbNewStore._id
                    })
                    .then(async (res) => {
                        assert.strictEqual(res.status, 200);
                        let stores = await Store.find();
                        assert.strictEqual(stores.length, 0);
                    })
            });

            it('Should return an error if store not found', async () => {
                return await chai.request(app)
                    .delete('/stores/delete')
                    .send({
                        "storeId": 'wrongId'
                    })
                    .then(async (res) => {
                        assert.strictEqual(res.status, 404);
                    })
            });
        });
    });
});