'use strict';

const express = require('express');
const router = express.Router();
const {TICKETMASTERAPIKEY}  = require('../config.js');
const request = require('request');

const mongoose = require('mongoose');



/* ========== GET/READ ALL CONCERTS IN DMA REGION & GENRE FILTER ========== */
router.get('/concerts/:location/:genre', (req, res) => {
  const { location, genre } = req.params;
  const url = `https://app.ticketmaster.com/discovery/v2/events?classificationName=music&genreId=${genre}&dmaId=${location}&apikey=${TICKETMASTERAPIKEY}`;
  request.get(url, (error, response, body) => {
    res.send(body);
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