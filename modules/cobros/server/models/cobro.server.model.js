'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Cobro Schema
 */
var CobroSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Cobro name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Cobro', CobroSchema);
