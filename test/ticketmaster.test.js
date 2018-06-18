'use strict';

const app = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { TEST_DATABASE_URL } = require('../config');

const Genre = require('../models/genre');
const seedGenres = require('../db/seed/genres');
const Location = require('../models/location');
const seedLocations = require('../db/seed/dma');

const expect = chai.expect;
chai.use(chaiHttp);


describe('KTTM API - TicketMaster', function () {

  before(function () {
    return mongoose.connect(TEST_DATABASE_URL)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    Genre.insertMany(seedGenres);
    Location.insertMany(seedLocations);

  });

  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });

  after(function () {
    return mongoose.disconnect();
  });
  describe('GET /api/concerts/:location/:genre', function () {
    it('should return the correct concerts search', function () {
      const searchQuery = {
        'location': 'New York',
        'genre': 'Hip-Hop-Rap'
      };
      return chai.request(app)
        .get(`/api/concerts/${searchQuery.location}/${searchQuery.genre}`)
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.an('array');
          expect(res.body.length).to.equal(20);
          expect(res.body[0]).to.have.keys('id', 'name', 'image', 'venue', 'date', 'time', 'city', 'state');
        });
    });
    it('should return no concerts found', function () {
      const searchQuery = {
        'location': 'Yukon',
        'genre': 'Hip-Hop-Rap'
      };
      return chai.request(app)
        .get(`/api/concerts/${searchQuery.location}/${searchQuery.genre}`)
        .catch(err => err.response)
        .then((res) => {
          expect(res).to.have.status(404);
          expect(res.body.message).to.equal('Sorry, there were no concerts found matching your criteria');
        });
    });
  });

});


