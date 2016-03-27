'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Jobdir Schema
 */
var JobdirSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Jobdir name',
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

mongoose.model('Jobdir', JobdirSchema);
