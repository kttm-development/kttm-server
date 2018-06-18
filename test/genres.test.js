'use strict';

const app = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');


const expect = chai.expect;
chai.use(chaiHttp);

describe('GET /api/genres', function () {
  it('should return genres', function () {
    return chai.request(app)
      .get('/api/genres')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(13);
        expect(res.body[0]).to.have.keys('genre');
        expect(res.body[0].genre).to.equal('Alternative');
      });
  });
});