'use strict';

const app = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');

const Contact = require('../models/contact');
const seedContact = require('../db/seed/contact');

const User = require('../models/user');
const seedUsers = require('../db/seed/users');


let token;

const username = 'exampleUser';



const expect = chai.expect;
chai.use(chaiHttp);


describe('KTTM API - Contacts', function () {

  before(function () {
    return mongoose.connect(TEST_DATABASE_URL)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return Promise.all([
      User.insertMany(seedUsers),
      Contact.insertMany(seedContact),
      Contact.createIndexes(),
    ]);
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });
  it('should return contacts', function () {
    const { username } = seedUsers[0];
    return chai.request(app)
      .post('/api/login')
      .send({ username, password: '123' })
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.authToken).to.be.a('string');

        const payload = jwt.verify(res.body.authToken, JWT_SECRET);
        chai.request(app)
          .get('/api/contacts')
          .send(payload.user.authToken);
        console.log(res.body);
        expect(res).to.be.json;
      });
  });
});


