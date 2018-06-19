'use strict';

const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorite');




// GET: fetch user favorites
router.get('/favorites', async (req, res) => {
    const userId = req.user.id;
    const favorites = await Favorite.find({ userId });
    res.json(favorites);
});



// POST: fetch user favorites
router.post('/favorites', async (req, res) => {
    const { name, attraction, city, date, id, image, state, time, url, venue} = req.body;
    const userId = req.user.id;
    const newItem = { name, attraction, city, date, id, image, state, time, url, venue, userId};
    const favorites = await Favorite.create(newItem);
    res.location(`${req.originalUrl}/${result.id}`).status(201).json(favorites);
});

module.exports = router;