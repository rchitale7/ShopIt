const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
const app = require('../server.js');

const Store = require('../models/user.model');

chai.use(chaiHttp);


let users;

before((done) => {
    app.on("Ready", () => done());
});

describe('Users', () => {
    describe('GET', () => {
        describe('get all users', () => {
            it('should get all users', () => {
                return chai.request(app)
                .get('/users')
                .then((res) => {
                    assert.strictEqual(res.status, 200);
                    assert.ok(Array.isArray(res.body));
                });
            });
        })
    });

    describe('DELETE', () =>{
        describe('delete user', () => {
            it('should delete a singular user from the db', () => {
                //Getting a random user to delete.
                Store.find().then(res => {
                    let filteredData = []
                    for(let i =0; i < res.length; i++){
                        filteredData.push(res[i].username);
                    }
                    users = filteredData;
                    assert.notStrictEqual(users.length,0);
                    const randomNumber = Math.random(users.length);

                    return chai.request(app)
                    .delete('/users/delete')
                    .send({"username" :users[randomNumber].username})
                    .then(async (res) => {
                        assert.strictEqual(res.status, 200);
                        let results = await Store.find({"username":users[randomNumber].username});
                        assert.strictEqual(results.length, 0);
                    });
                });
            });

            it('should not be able to delete with no specified body', () => {
                return chai.request(app)
                    .delete('/users/delete')
                    .then(async (res)  => {
                        assert.strictEqual(res.status, 200);
                    });
            });
        });
    });
});