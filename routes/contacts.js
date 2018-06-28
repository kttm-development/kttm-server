'use strict';

const express = require('express');
const router = express.Router();
const Contact = require('../models/contact');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const passport = require('passport');


const options = { session: false, failWithError: true };



const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

// GET: fetch user contacts
router.get('/contacts', jwtAuth, async (req, res) => {
    const userId = req.user.id;
    const contacts = await Contact.find({ userId });
    res.json(contacts);
});



// POST: fetch user contacts
router.post('/contacts', jwtAuth, async (req, res) => {
    const { name, email } = req.body;
    const userId = req.user.id;
    const newItem = { name, email, userId };
    const contacts = await Contact.create(newItem);
    res.location(`${req.originalUrl}/${res.id}`).status(201).json(contacts)
});


// PUT: Add to userContacts (avoids duplicates)
router.put('/user/:userId', jwtAuth, async (req, res) => {
    await User.findOneAndUpdate({ 'userId': req.params.userId },
        {
            $addToSet: { 'contacts': req.body.id }
        },
        { new: true },
        async (user) => {
          await res.json(user);
        }
    )
});



// DELETE:  user contacts
router.delete('/contacts/:id', jwtAuth, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    await Contact.findOneAndRemove({ _id: id, userId });
    res.status(204).end();
});

module.exports = router;