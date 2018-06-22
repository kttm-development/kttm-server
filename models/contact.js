'use strict';

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});
contactSchema.index({ name: 1, userId: 1 }, { unique: true });
contactSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

module.exports = mongoose.model('Contact', contactSchema);
