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
  company: {
    type: String,
    default: '',
    trim: true,
    required: 'Company canot be blank'
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  requirements: {
    type: String,
    default: '',
    trim: true
  },
  hourly_wage: {
    type: Number,
    default: '',
    trim: true
  },
  state: {
    type: String,
    default: '',
  },
  contact_email: {
    type: String,
    default: '',
    trim: true
  },    
  created: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Jobdir', JobdirSchema);
