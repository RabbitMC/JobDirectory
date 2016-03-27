'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Jobdir = mongoose.model('Jobdir'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, jobdir;

/**
 * Jobdir routes tests
 */
describe('Jobdir CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Jobdir
    user.save(function () {
      jobdir = {
        name: 'Jobdir name'
      };

      done();
    });
  });

  it('should be able to save a Jobdir if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Jobdir
        agent.post('/api/jobdirs')
          .send(jobdir)
          .expect(200)
          .end(function (jobdirSaveErr, jobdirSaveRes) {
            // Handle Jobdir save error
            if (jobdirSaveErr) {
              return done(jobdirSaveErr);
            }

            // Get a list of Jobdirs
            agent.get('/api/jobdirs')
              .end(function (jobdirsGetErr, jobdirsGetRes) {
                // Handle Jobdir save error
                if (jobdirsGetErr) {
                  return done(jobdirsGetErr);
                }

                // Get Jobdirs list
                var jobdirs = jobdirsGetRes.body;

                // Set assertions
                (jobdirs[0].user._id).should.equal(userId);
                (jobdirs[0].name).should.match('Jobdir name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Jobdir if not logged in', function (done) {
    agent.post('/api/jobdirs')
      .send(jobdir)
      .expect(403)
      .end(function (jobdirSaveErr, jobdirSaveRes) {
        // Call the assertion callback
        done(jobdirSaveErr);
      });
  });

  it('should not be able to save an Jobdir if no name is provided', function (done) {
    // Invalidate name field
    jobdir.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Jobdir
        agent.post('/api/jobdirs')
          .send(jobdir)
          .expect(400)
          .end(function (jobdirSaveErr, jobdirSaveRes) {
            // Set message assertion
            (jobdirSaveRes.body.message).should.match('Please fill Jobdir name');

            // Handle Jobdir save error
            done(jobdirSaveErr);
          });
      });
  });

  it('should be able to update an Jobdir if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Jobdir
        agent.post('/api/jobdirs')
          .send(jobdir)
          .expect(200)
          .end(function (jobdirSaveErr, jobdirSaveRes) {
            // Handle Jobdir save error
            if (jobdirSaveErr) {
              return done(jobdirSaveErr);
            }

            // Update Jobdir name
            jobdir.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Jobdir
            agent.put('/api/jobdirs/' + jobdirSaveRes.body._id)
              .send(jobdir)
              .expect(200)
              .end(function (jobdirUpdateErr, jobdirUpdateRes) {
                // Handle Jobdir update error
                if (jobdirUpdateErr) {
                  return done(jobdirUpdateErr);
                }

                // Set assertions
                (jobdirUpdateRes.body._id).should.equal(jobdirSaveRes.body._id);
                (jobdirUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Jobdirs if not signed in', function (done) {
    // Create new Jobdir model instance
    var jobdirObj = new Jobdir(jobdir);

    // Save the jobdir
    jobdirObj.save(function () {
      // Request Jobdirs
      request(app).get('/api/jobdirs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Jobdir if not signed in', function (done) {
    // Create new Jobdir model instance
    var jobdirObj = new Jobdir(jobdir);

    // Save the Jobdir
    jobdirObj.save(function () {
      request(app).get('/api/jobdirs/' + jobdirObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', jobdir.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Jobdir with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/jobdirs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Jobdir is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Jobdir which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Jobdir
    request(app).get('/api/jobdirs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Jobdir with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Jobdir if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Jobdir
        agent.post('/api/jobdirs')
          .send(jobdir)
          .expect(200)
          .end(function (jobdirSaveErr, jobdirSaveRes) {
            // Handle Jobdir save error
            if (jobdirSaveErr) {
              return done(jobdirSaveErr);
            }

            // Delete an existing Jobdir
            agent.delete('/api/jobdirs/' + jobdirSaveRes.body._id)
              .send(jobdir)
              .expect(200)
              .end(function (jobdirDeleteErr, jobdirDeleteRes) {
                // Handle jobdir error error
                if (jobdirDeleteErr) {
                  return done(jobdirDeleteErr);
                }

                // Set assertions
                (jobdirDeleteRes.body._id).should.equal(jobdirSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Jobdir if not signed in', function (done) {
    // Set Jobdir user
    jobdir.user = user;

    // Create new Jobdir model instance
    var jobdirObj = new Jobdir(jobdir);

    // Save the Jobdir
    jobdirObj.save(function () {
      // Try deleting Jobdir
      request(app).delete('/api/jobdirs/' + jobdirObj._id)
        .expect(403)
        .end(function (jobdirDeleteErr, jobdirDeleteRes) {
          // Set message assertion
          (jobdirDeleteRes.body.message).should.match('User is not authorized');

          // Handle Jobdir error error
          done(jobdirDeleteErr);
        });

    });
  });

  it('should be able to get a single Jobdir that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Jobdir
          agent.post('/api/jobdirs')
            .send(jobdir)
            .expect(200)
            .end(function (jobdirSaveErr, jobdirSaveRes) {
              // Handle Jobdir save error
              if (jobdirSaveErr) {
                return done(jobdirSaveErr);
              }

              // Set assertions on new Jobdir
              (jobdirSaveRes.body.name).should.equal(jobdir.name);
              should.exist(jobdirSaveRes.body.user);
              should.equal(jobdirSaveRes.body.user._id, orphanId);

              // force the Jobdir to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Jobdir
                    agent.get('/api/jobdirs/' + jobdirSaveRes.body._id)
                      .expect(200)
                      .end(function (jobdirInfoErr, jobdirInfoRes) {
                        // Handle Jobdir error
                        if (jobdirInfoErr) {
                          return done(jobdirInfoErr);
                        }

                        // Set assertions
                        (jobdirInfoRes.body._id).should.equal(jobdirSaveRes.body._id);
                        (jobdirInfoRes.body.name).should.equal(jobdir.name);
                        should.equal(jobdirInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Jobdir.remove().exec(done);
    });
  });
});
