'use strict';

const mongoose = require('mongoose');

const dmaSchema = new mongoose.Schema({
  location: {type: String, unique: true},
  dmaId: {type: Number}
});

dmaSchema.set('toObject', {
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  }
});


module.exports = mongoose.model('Dma', dmaSchema);
