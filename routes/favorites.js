'use strict';

const express = require('express');
const router = express.Router();
const Favorite = require('../models/favorite');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const passport = require('passport');


const options = { session: false, failWithError: true };



const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

// GET: fetch user favorites
router.get('/favorites', jwtAuth, async (req, res) => {
    const userId = req.user.id;
    const favorites = await Favorite.find({ userId });
    res.json(favorites);
});



// POST: fetch user favorites
router.post('/favorites', jwtAuth, async (req, res) => {
    const { name, attraction, city, date, id, image, state, time, url, venue, description } = req.body;
    const userId = req.user.id;
    const newItem = { name, attraction, city, date, id, image, state, time, url, venue, userId, description };
    const favorites = await Favorite.create(newItem);
    res.location(`${req.originalUrl}/${res.id}`).status(201).json(favorites);
});


// PUT: Add to userFavorites (avoids duplicates)
router.put('/user/:userId', jwtAuth, async (req, res) => {
    await User.findOneAndUpdate({ 'userId': req.params.userId },
        {
            $addToSet: { 'favorites': req.body.id }
        },
        { new: true },
        async (user) => {
          await res.json(user);
        }
    )
});



// DELETE:  user favorites
router.delete('/favorites/:id', jwtAuth, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    await Favorite.findOneAndRemove({ _id: id, userId });
    res.status(204).end();
});

module.exports = router;