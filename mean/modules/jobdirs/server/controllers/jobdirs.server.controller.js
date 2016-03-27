'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Jobdir = mongoose.model('Jobdir'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Jobdir
 */
exports.create = function(req, res) {
  var jobdir = new Jobdir(req.body);
  jobdir.user = req.user;

  jobdir.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(jobdir);
    }
  });
};

/**
 * Show the current Jobdir
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var jobdir = req.jobdir ? req.jobdir.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  jobdir.isCurrentUserOwner = req.user && jobdir.user && jobdir.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(jobdir);
};

/**
 * Update a Jobdir
 */
exports.update = function(req, res) {
  var jobdir = req.jobdir ;

  jobdir = _.extend(jobdir , req.body);

  jobdir.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(jobdir);
    }
  });
};

/**
 * Delete an Jobdir
 */
exports.delete = function(req, res) {
  var jobdir = req.jobdir ;

  jobdir.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(jobdir);
    }
  });
};

/**
 * List of Jobdirs
 */
exports.list = function(req, res) { 
  Jobdir.find().sort('-created').populate('user', 'displayName').exec(function(err, jobdirs) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(jobdirs);
    }
  });
};

/**
 * Jobdir middleware
 */
exports.jobdirByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Jobdir is invalid'
    });
  }

  Jobdir.findById(id).populate('user', 'displayName').exec(function (err, jobdir) {
    if (err) {
      return next(err);
    } else if (!jobdir) {
      return res.status(404).send({
        message: 'No Jobdir with that identifier has been found'
      });
    }
    req.jobdir = jobdir;
    next();
  });
};
