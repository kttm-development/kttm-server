'use strict';

const mongoose = require('mongoose');

const { DATABASE_URL } = require('../config');
const User = require('../models/user');
const Genre = require('../models/genre');
const Dma = require('../models/location');
const Favorite = require('../models/favorite');

const seedUsers = require('../db/seed/users');
const seedGenres = require('../db/seed/genres');
const seedLocations = require('../db/seed/dma');
const seedFavorites = require('../db/seed/favorite');


mongoose.connect(DATABASE_URL)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      User.insertMany(seedUsers),
      User.createIndexes(),
      Genre.insertMany(seedGenres),
      Genre.createIndexes(),
      Dma.insertMany(seedLocations),
      Dma.createIndexes(),
      Favorite.insertMany(seedFavorites),
      Favorite.createIndexes(),
    ]);
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  });