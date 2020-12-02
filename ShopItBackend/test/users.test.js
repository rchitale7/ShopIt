
const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
const app = require('../server.js');

const Store = require('../models/user.model');

chai.use(chaiHttp);

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
            it('should delete a single user from the db', () => {
                //Getting a random user to delete.
                Store.find().then(res => {
                    let filteredUsers = []
                    for(let i =0; i < res.length; i++){
                        filteredUsers.push(res[i].username);
                    }
                    assert.notStrictEqual(filteredUsers.length, 0);
                    const randomNumber = Math.floor(Math.random() * filteredUsers.length);
                    
                    return chai.request(app)
                    .delete('/users/delete')
                    .send({"username":filteredUsers[randomNumber]})
                    .then(async (res) => {
                        assert.strictEqual(res.status, 200);
                        let results = await Store.find({"username":filteredUsers[randomNumber]});
                        assert.strictEqual(results.length, 0);
    
                    })
                });
            });

            it('should not delete any users without a specified body', () => {
                return chai.request(app)
                    .delete('/users/delete')
                    .then(async (res)  => {
                        assert.strictEqual(res.status, 200);
                    });
            });
        });
    });
});
