'use strict';

const express = require('express');
const router = express.Router();
const {TICKETMASTERAPIKEY}  = require('../config.js');
const request = require('ajax-request');
const mongoose = require('mongoose');
const genreList = require('../db/seed/genres');
const locationList = require('../db/seed/dma');



/* ========== GET/READ ALL CONCERTS IN DMA REGION & GENRE FILTER ========== */
router.get('/concerts/:location/:genre', (req, res, next) => {
  const { location, genre } = req.params;
  const genreObj = genreList.find(item => item.genre === genre);
  const genreId = genreObj.id;
  const locationObj = locationList.find(item => item.location === location);
  const locationId = locationObj.dmaId;
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&genreId=${genreId}&dmaId=${locationId}&apikey=${TICKETMASTERAPIKEY}`;
  request({
    url: url,
    method: 'GET',
    json: true
  }, (err, response, body) => {
    if (!body._embedded) {
      err = new Error('Ticketmaster Api not returning any events');
      return next(err);
    }
    let array = body._embedded.events;
    let concerts = array.map(item => {
      return {
        id: item.id,
        name: item.name,
        image: item.images[0].url,
        venue: `${item._embedded.venues[0].name}` + ` ${item._embedded.venues[0].city.name}` + ` ${item._embedded.venues[0].address.line1}`,
        date: item.dates.start.localDate,
        time: item.dates.start.localTime
      };
    });
    res.json(concerts);
  });
});

// /* ========== GET/READ A SINGLE ITEM ========== */
// router.get('/concerts/:id', (req, res, next) => {
//   const { id } = req.params;

// });

/* ========== POST/CREATE AN ITEM ========== */


/* ========== PUT/UPDATE A SINGLE ITEM ========== */


/* ========== DELETE/REMOVE A SINGLE ITEM ========== */


module.exports = router;