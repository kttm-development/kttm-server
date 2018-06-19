'use strict';

const app = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { TEST_DATABASE_URL, JWT_SECRET } = require('../config');

const Favorite = require('../models/favorite');
const seedFavorites = require('../db/seed/favorite');

const User = require('../models/user');
const seedUsers = require('../db/seed/users');


let token;

const username = 'exampleUser';



const expect = chai.expect;
chai.use(chaiHttp);


describe.only('KTTM API - Favorites', function () {

  before(function () {
    return mongoose.connect(TEST_DATABASE_URL)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return Promise.all([
      User.insertMany(seedUsers),
      Favorite.insertMany(seedFavorites),
      Favorite.createIndexes(),
    ]);
  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });
  it('should return favorites', function () {
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
          .get('/api/favorites')
          .send(payload.user.authToken);
        console.log(res.body);
        expect(res).to.be.json;
        // expect(res.body[0]).to.have.keys('city');
        // expect(res.body[0].attraction).to.equal('The Fixx');
      });
  });
});


