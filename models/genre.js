'use strict';

const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  genre: {type: String, unique: true},
  id: {type: String}
});

genreSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    // delete ret.password;
  }
});


module.exports = mongoose.model('Genre', genreSchema);
