'use strict';

const express = require('express');
const router = express.Router();
// const locations = require('../db/seed/dma');
const Dma = require('../models/location');


// router.get('/locations', (req,res) => {
//   const locationNames = locations.map(location => {
//     return {location: location.location};
//   });
//   res.json(locationNames);
// });

router.get('/locations', async (req,res) => {
  const locationNames = await Dma.find({}, 'location');
  res.json(locationNames);
});

module.exports = router;