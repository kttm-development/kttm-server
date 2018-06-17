'use strict';

const express = require('express');
const router = express.Router();
const Genre = require('../models/genre');



router.get('/genres', async (req,res) => {
  const genreNames = await Genre.find({}, 'genre');
  res.json(genreNames);
});


module.exports = router;