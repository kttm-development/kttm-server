'use strict';

const app = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const { TEST_DATABASE_URL } = require('../config');

const Dma = require('../models/location');

const seedLocations = require('../db/seed/dma');

const expect = chai.expect;
chai.use(chaiHttp);

describe('KTTM API - Locations', function () {

  before(function () {
    return mongoose.connect(TEST_DATABASE_URL)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return Dma.insertMany(seedLocations);

  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('GET /api/locations', function () {
    it('should return locations', function () {
      return chai.request(app)
        .get('/api/locations')
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(269);
          expect(res.body[0]).to.have.keys('location');
          expect(res.body[0].location).to.equal('Abilene - Sweetwater');
        });
    });
  });
});