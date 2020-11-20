const Store = require('../models/store.model');

//Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server.js');

chai.use(chaiHttp);

const assert = require('assert');

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
        await Store.deleteMany({});
    });

    describe('Store CRUD', () => {

        it('Should return list of all stores', () => {
            const newStore = new Store(exampleStore);
            const newStore2 = new Store(exampleStore2);
            return newStore.save()
                .then(console.log('ufkc'))
                .then(chai.request(app).get('/stores'))
                .then((res) => {
                    console.log(res);
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                });
        });
        
        it.skip('Should add a store', (done, fuck) => {
            chai.request(app)
                .post('/stores/add')
                .send({
                    "name": "Safeway",
                    "long": 100,
                    "lat": 100
                })
                .end(async (err, res) => {
                    res.should.have.status(200);
                    const stores = await Store.find();
                    stores.length.should.be.eql(1);
                    done();
                })
                .finally(done());
        });

        it.skip('Should delete a store', (done) => {
            const newStore = new Store(exampleStore);
            newStore.save().then((store) => {
                    chai.request(app)
                        .delete('/stores/delete')
                        .send({
                            "id": store._id
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            Store.find().then((stores) => {
                                stores.length.should.be.eql(2);
                                done();
                            })
                        })
                }
            )
            .finally(done());
        });
    });
});