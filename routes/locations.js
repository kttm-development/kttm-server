'use strict';

const express = require('express');
const router = express.Router();
const locations = require('../db/seed/dma');


router.get('/locations', (req,res) => {
  const locationNames = locations.map(location => {
    return {location: location.location};
  });
  res.json(locationNames);
});

module.exports = router;