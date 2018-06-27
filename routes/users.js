'use strict';

const express = require('express');
const router = express.Router();

// const mongoose = require('mongoose');

const User = require('../models/user');



router.post('/users', (req, res, next) => {
  // const {username, fullName, password} = req.body;
  
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    const err = new Error(`Missing '${missingField}' in request body`);
    err.status = 422;
    return next(err);
  }
  const stringFields = ['username', 'password', 'firstName', 'lastName'];
  const notString = stringFields.find(field => field in req.body && typeof req.body[field] !== 'string');
  if (notString) {
    const err = new Error('Incorrect field type: expected string');
    err.status = 422;
    return next(err);
  }
  
  const trimmedFields = ['username', 'password'];
  const nonTrimmedFields = trimmedFields.find(field => req.body[field].trim() !== req.body[field]);
  if (nonTrimmedFields) {
    const err = new Error('Cannot start or end with whitespace');
    err.status = 422;
    return next(err);
  }

  const sizedFields = {
    username: { min: 1 },
    password: { min: 8, max: 72 }
  };

  const tooSmallField = Object.keys(sizedFields).find(
    field => 'min' in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );
  if (tooSmallField) {
    const min = sizedFields[tooSmallField].min;
    const err = new Error(`Field: '${tooSmallField}' must be at least ${min} characters long`);
    err.status = 422;
    return next(err);
  }

  const tooLargeField = Object.keys(sizedFields).find(
    field => 'max' in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooLargeField) {
    const max = sizedFields[tooLargeField].max;
    const err = new Error(`Field: '${tooLargeField}' must be at most ${max} characters long`);
    err.status = 422;
    return next(err);
  }

  let { username, password, firstName = '', lastName = '' } = req.body;
  firstName = firstName.trim();
  lastName = lastName.trim();
  

  return User.find({username})
    .count()
    .then(usersWithThatUsername => {
      if (usersWithThatUsername > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'username'
        });
      }
      return User.hashPassword(password);
    })
    .then(digest => {
      const newUser = {
        username,
        password: digest,
        firstName,
        lastName
      };
      return User.create(newUser);
    })
    .then(result => {
      return res.status(201).location(`/api/users/${result.id}`).json(result);
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
   
    });
});


module.exports = router;