const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
const suppressLogs = require('mocha-suppress-logs');
let app = require('../app.js');

const Store = require('../models/user.model');

const testPort = 8888;
chai.use(chaiHttp);
suppressLogs();

// Start the node server before running tests.
before((done) => {
	app.on('Mongoose ready', () => {
		app = app.listen(testPort, () => {
			console.log(`Test server is running on port ${testPort}!\n`);
			done();
		});
	});
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

after((done) => {
    app.close();
    done();
});
