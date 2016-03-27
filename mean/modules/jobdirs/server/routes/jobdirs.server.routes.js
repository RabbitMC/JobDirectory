'use strict';

/**
 * Module dependencies
 */
var jobdirsPolicy = require('../policies/jobdirs.server.policy'),
  jobdirs = require('../controllers/jobdirs.server.controller');

module.exports = function(app) {
  // Jobdirs Routes
  app.route('/api/jobdirs').all(jobdirsPolicy.isAllowed)
    .get(jobdirs.list)
    .post(jobdirs.create);

  app.route('/api/jobdirs/:jobdirId').all(jobdirsPolicy.isAllowed)
    .get(jobdirs.read)
    .put(jobdirs.update)
    .delete(jobdirs.delete);

  // Finish by binding the Jobdir middleware
  app.param('jobdirId', jobdirs.jobdirByID);
};
