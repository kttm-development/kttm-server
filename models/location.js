'use strict';

const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  location: {type: String, unique: true},
  dmaId: {type: Number}
});

locationSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});


module.exports = mongoose.model('Location', locationSchema);
