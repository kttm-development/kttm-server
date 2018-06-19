'use strict';

const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  name: { type: String },
  attraction: { type: String },
  city: { type: String },
  date: { type: Date },
  id: { type: String },
  image: { type: String },
  state: { type: String },
  time: { type: String },
  url: { type: String },
  venue: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});
favoriteSchema.index({ name: 1, userId: 1 }, { unique: true });
favoriteSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Favorite', favoriteSchema);
