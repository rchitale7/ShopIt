const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = require('assert');
const suppressLogs = require('mocha-suppress-logs');
let app = require('../app.js');

const User = require('../models/user.model');

const testPort = 8888;
chai.use(chaiHttp);
suppressLogs();

const exampleUser = {
    "username": "testinguser1", 
    "password": "testpassword1"
}

const exampleUser2 = {
    "username": "bobby",
    "password": "bob"
}

const exampleUser3 = {
    "username": "testinguser1", 
    "password": "testpassword2"
}

const exampleUser4 = {
    "username": "testinguser2", 
    "password": "testpassword2"
}

before((done) => {
	app.on('Mongoose ready', () => {
		app = app.listen(testPort, () => {
			console.log(`Test server is running on port ${testPort}!\n`);
			done();
		});
	});
});

describe('Users', () => {

    describe('GET /', () => {
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



    describe('POST /users/signup', () => {

        afterEach(async() => {
            await User.findOneAndDelete({username: exampleUser.username}); 
        }); 

        describe('signup user', () => {
            it('should sign up the user', () => {
                return chai.request(app)
                .post('/users/signup')
                .send(exampleUser)
                .then((res) => {
                    assert.strictEqual(res.status, 200);
                    return User.findOne({username: exampleUser.username})
                })
                .then((user) => {
                    assert.strictEqual(user.username, exampleUser.username)
                })
            });
        });

        describe('not signup user', () => {
            it('should not sign up the user, because password is less than 5 characters', () => {
                return chai.request(app)
                .post('/users/signup')
                .send(exampleUser2)
                .then((res) => {
                    assert.strictEqual(res.status, 400);
                    return User.findOne({username: exampleUser2.username})
                })
                .then((user) => {
                    assert.strictEqual(user, null)
                })
            });

            it('should not sign up the user, because the username is not unique', async () => {

                let user = new User(exampleUser)
                await user.save()
                return chai.request(app)
                .post('/users/signup')
                .send(exampleUser3)
                .then((res) => {
                    assert.strictEqual(res.status, 400);
                    return User.find({username: exampleUser.username})
                })
                .then((user) => {
                    assert.strictEqual(user.length, 1)
                    assert.strictEqual(user[0].password, exampleUser.password)
                })
            });

        });
    });

    describe('POST /users/login', () => {

        afterEach(async() => {
            await User.findOneAndDelete({username: exampleUser.username}); 
        }); 

        beforeEach(async() => {
            await chai.request(app)
              .post("/users/signup")
              .send(exampleUser)
              .then((res) => {
                assert.strictEqual(res.status, 200);
              });
        });

        describe('login user', () => {
            it('login the user', async () => {
                return chai.request(app)
                .post('/users/login')
                .send(exampleUser)
                .then((res) => {
                    assert.strictEqual(res.status, 200);
                    return User.findOne({username: exampleUser.username})
                })
                .then((user) => {
                    assert.strictEqual(user.username, exampleUser.username)
                })
            });
        });

        describe('not login user', () => {
            it('should not login the user, because the username and password do not match', async () => {
                return chai.request(app)
                .post('/users/login')
                .send(exampleUser3)
                .then((res) => {
                    assert.strictEqual(res.status, 401);
                })
            });

            it('should not login the user, because the user does not exist in the db', () => {

                return chai.request(app)
                .post('/users/login')
                .send(exampleUser4)
                .then((res) => {
                    assert.strictEqual(res.status, 401);
                })
            });

        });
    });

});

after((done) => {
    app.close();
    done();
});
