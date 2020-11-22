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

describe('Stores', () => {
    beforeEach(async () => { //Before each test we empty the database
        console.log("Deleting all...");
        await Store.deleteMany({});
    });

    describe('Store CRUD', () => {

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
        
        it('Should add a store', async () => {
            return await chai.request(app)
                .post('/stores/add')
                .send({
                    "name": "Safeway",
                    "long": 100,
                    "lat": 100
                })
                .then(async (res) => {
                    assert.strictEqual(res.status, 200);
                    let stores = await Store.find();
                    assert.strictEqual(stores.length, 1);
                })
        });

        it('Should delete a store', async () => {
            let newStore = new Store(exampleStore);
            let dbNewStore = await newStore.save();

            return await chai.request(app)
                .delete('/stores/delete')
                .send({
                    "id": dbNewStore._id
                })
                .then(async (res) => {
                    assert.strictEqual(res.status, 200);
                    let stores = await Store.find();
                    assert.strictEqual(stores.length, 0);
                })
        });
    });
});