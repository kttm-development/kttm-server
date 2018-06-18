'use strict';

const express = require('express');
const router = express.Router();
const {TICKETMASTERAPIKEY}  = require('../config.js');
const fetch = require('node-fetch');
const Dma = require('../models/location');
const Genre = require('../models/genre');



/* ========== GET/READ ALL CONCERTS IN DMA REGION & GENRE FILTER ========== */
router.get('/concerts/:location/:genre', async (req, res, next) => {
  const { location, genre } = req.params;
  const genreObj = await Genre.findOne({genre}, 'id');
  const locationObj = await Dma.findOne({location}, 'dmaId');
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&genreId=${genreObj.id}&dmaId=${locationObj.dmaId}&apikey=${TICKETMASTERAPIKEY}`;
  const ticketMasterRes = await fetch(url);
  const body = await ticketMasterRes.json();
    if (!body._embedded) {
      err = new Error('Sorry, there were no concerts found matching your criteria');
      err.status = 404;
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
        time: item.dates.start.localTime,
        city: item._embedded.venues[0].city.name,
        state: item._embedded.venues[0].state.stateCode
      };
    });
    res.json(concerts);
});

module.exports = router;