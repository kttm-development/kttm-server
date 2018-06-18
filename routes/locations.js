'use strict';

const express = require('express');
const router = express.Router();
const Dma = require('../models/location');


router.get('/locations', async (req,res) => {
  const locationNames = await Dma.find({}, 'location');
  res.json(locationNames);
});

module.exports = router;