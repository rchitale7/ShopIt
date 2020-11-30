const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
const app = require('../server.js');

const Store = require('../models/item.model');

chai.use(chaiHttp);

//Start the node server before running tests.
before((done) => {
    app.on("Ready", () => done());
});

describe('Items', () => {
    describe('GET', () => {
        describe('get all items', () =>{
            it('Should return list of all items', async () =>{
                //grabbing a storeId from the mongodb database.
                let storedID = '5fc5593c7059a80ee25c11ff';
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
            it('Should have no items if no store', async () =>{

                return await chai.request(app)
                    .get('/items?storeId=Trash!')
                    .then((res) => {
                        assert.strictEqual(res.status, 400);
                    })
            });

        });
    });


});