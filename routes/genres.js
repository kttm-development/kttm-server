'use strict';

const express = require('express');
const router = express.Router();
const genres = require('../db/seed/genres');


router.get('/genres', (req,res) => {
  const genreNames = genres.map(genre => {
    return {genre: genre.genre};
  });
  res.json(genreNames);
});

module.exports = router;