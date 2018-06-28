'use strict';

const app = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { TEST_DATABASE_URL } = require('../config'); ('../config');

const User = require('../models/user');

const expect = chai.expect;

chai.use(chaiHttp);

describe('KTTM API - Users', function () {
  const username = 'exampleUser';
  const password = 'examplePass';
  const firstName = 'Example First';
  const lastName = 'Example Last';

  before(function () {
    return mongoose.connect(TEST_DATABASE_URL)
      .then(() => mongoose.connection.db.dropDatabase());
  });

  beforeEach(function () {
    return User.ensureIndexes();
  });

  afterEach(function () {
    return User.remove();
    // return User.collection.drop();
    // return mongoose.connection.db.dropDatabase()
  });

  after(function () {
    return mongoose.disconnect();
  });

  describe('/api/users', function () {
    describe('POST', function () {
      it('Should create a new user with valid password', function () {
        let res;
        return chai
          .request(app)
          .post('/api/users')
          .send({ username, password, firstName, lastName })
          .then(_res => {
            res = _res;
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('id', 'username', 'firstName', 'lastName', 'favorites', 'contacts');
            expect(res.body.id).to.exist;
            expect(res.body.username).to.equal(username);
            expect(res.body.firstName).to.equal(firstName);
            expect(res.body.lastName).to.equal(lastName);
            return User.findOne({ username });
          })
          .then(user => {
            expect(user).to.exist;
            expect(user.id).to.equal(res.body.id);
            expect(user.firstName).to.equal(firstName);
            expect(user.lastName).to.equal(lastName);
            return user.validatePassword(password);
          })
          .then(isValid => {
            expect(isValid).to.be.true;
          });
      });

      it('Should reject users with missing username', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({ password, firstName, lastName })
          .catch(err => err.response)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.equal('Missing \'username\' in request body');
          });
      });

      it('Should reject users with missing password', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({ username, firstName, lastName })
          .catch(err => err.response)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.equal('Missing \'password\' in request body');
          });

      });

      it('Should reject users with non-string username', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({ username: 1234, password, firstName, lastName })
          .catch(err => err.response)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.equal('Incorrect field type: expected string');
          });
      });

      it('Should reject users with non-string password', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({ username, password: 1234, firstName, lastName })
          .catch(err => err.response)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.equal('Incorrect field type: expected string');
          });
      });

      it('Should reject users with non-trimmed username', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({ username: ` ${username} `, password, firstName, lastName })
          .catch(err => err.response)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.equal('Cannot start or end with whitespace');
          });
      });

      it('Should reject users with non-trimmed password', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({ username, password: ` ${password}`, firstName, lastName })
          .catch(err => err.response)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.equal('Cannot start or end with whitespace');
          });
      });

      it('Should reject users with empty username', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({ username: '', password, firstName, lastName })
          .catch(err => err.response)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.equal('Field: \'username\' must be at least 1 characters long');
          });
      });

      it('Should reject users with password less than 8 characters', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({ username, password: 'asdfghj', firstName, lastName })
          .catch(err => err.response)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.equal('Field: \'password\' must be at least 8 characters long');
          });
      });

      it('Should reject users with password greater than 72 characters', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({ username, password: new Array(73).fill('a').join(''), firstName, lastName })
          .catch(err => err.response)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.equal('Field: \'password\' must be at most 72 characters long');
          });
      });

      it('Should reject users with duplicate username', function () {
        return User
          .create({
            username,
            password,
            firstName,
            lastName
          })
          .then(() => {
            return chai
              .request(app)
              .post('/api/users')
              .send({ username, password, firstName, lastName });
          })
          .catch(err => err.response)
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.message).to.equal('Username already taken');
          });
      });

      it('Should trim firstName', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({ username, password, firstName: ` ${firstName} ` })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('username', 'firstName', 'lastName', 'id', 'favorites', 'contacts');
            expect(res.body.username).to.equal(username);
            expect(res.body.firstName).to.equal(firstName);
            return User.findOne({ username });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.firstName).to.equal(firstName);
          });
      });

      it('Should trim lastName', function () {
        return chai
          .request(app)
          .post('/api/users')
          .send({ username, password, lastName: ` ${lastName} ` })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('username', 'lastName', 'firstName', 'id', 'favorites', 'contacts');
            expect(res.body.username).to.equal(username);
            expect(res.body.lastName).to.equal(lastName);
            return User.findOne({ username });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.lastName).to.equal(lastName);
          });
      });
    });
  });
});