'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Cobro = mongoose.model('Cobro'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  cobro;

/**
 * Cobro routes tests
 */
describe('Cobro CRUD tests', function () {

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

    // Save a user to the test db and create new Cobro
    user.save(function () {
      cobro = {
        name: 'Cobro name'
      };

      done();
    });
  });

  it('should be able to save a Cobro if logged in', function (done) {
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

        // Save a new Cobro
        agent.post('/api/cobros')
          .send(cobro)
          .expect(200)
          .end(function (cobroSaveErr, cobroSaveRes) {
            // Handle Cobro save error
            if (cobroSaveErr) {
              return done(cobroSaveErr);
            }

            // Get a list of Cobros
            agent.get('/api/cobros')
              .end(function (cobrosGetErr, cobrosGetRes) {
                // Handle Cobros save error
                if (cobrosGetErr) {
                  return done(cobrosGetErr);
                }

                // Get Cobros list
                var cobros = cobrosGetRes.body;

                // Set assertions
                (cobros[0].user._id).should.equal(userId);
                (cobros[0].name).should.match('Cobro name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Cobro if not logged in', function (done) {
    agent.post('/api/cobros')
      .send(cobro)
      .expect(403)
      .end(function (cobroSaveErr, cobroSaveRes) {
        // Call the assertion callback
        done(cobroSaveErr);
      });
  });

  it('should not be able to save an Cobro if no name is provided', function (done) {
    // Invalidate name field
    cobro.name = '';

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

        // Save a new Cobro
        agent.post('/api/cobros')
          .send(cobro)
          .expect(400)
          .end(function (cobroSaveErr, cobroSaveRes) {
            // Set message assertion
            (cobroSaveRes.body.message).should.match('Please fill Cobro name');

            // Handle Cobro save error
            done(cobroSaveErr);
          });
      });
  });

  it('should be able to update an Cobro if signed in', function (done) {
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

        // Save a new Cobro
        agent.post('/api/cobros')
          .send(cobro)
          .expect(200)
          .end(function (cobroSaveErr, cobroSaveRes) {
            // Handle Cobro save error
            if (cobroSaveErr) {
              return done(cobroSaveErr);
            }

            // Update Cobro name
            cobro.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Cobro
            agent.put('/api/cobros/' + cobroSaveRes.body._id)
              .send(cobro)
              .expect(200)
              .end(function (cobroUpdateErr, cobroUpdateRes) {
                // Handle Cobro update error
                if (cobroUpdateErr) {
                  return done(cobroUpdateErr);
                }

                // Set assertions
                (cobroUpdateRes.body._id).should.equal(cobroSaveRes.body._id);
                (cobroUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Cobros if not signed in', function (done) {
    // Create new Cobro model instance
    var cobroObj = new Cobro(cobro);

    // Save the cobro
    cobroObj.save(function () {
      // Request Cobros
      request(app).get('/api/cobros')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Cobro if not signed in', function (done) {
    // Create new Cobro model instance
    var cobroObj = new Cobro(cobro);

    // Save the Cobro
    cobroObj.save(function () {
      request(app).get('/api/cobros/' + cobroObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', cobro.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Cobro with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/cobros/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Cobro is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Cobro which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Cobro
    request(app).get('/api/cobros/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Cobro with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Cobro if signed in', function (done) {
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

        // Save a new Cobro
        agent.post('/api/cobros')
          .send(cobro)
          .expect(200)
          .end(function (cobroSaveErr, cobroSaveRes) {
            // Handle Cobro save error
            if (cobroSaveErr) {
              return done(cobroSaveErr);
            }

            // Delete an existing Cobro
            agent.delete('/api/cobros/' + cobroSaveRes.body._id)
              .send(cobro)
              .expect(200)
              .end(function (cobroDeleteErr, cobroDeleteRes) {
                // Handle cobro error error
                if (cobroDeleteErr) {
                  return done(cobroDeleteErr);
                }

                // Set assertions
                (cobroDeleteRes.body._id).should.equal(cobroSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Cobro if not signed in', function (done) {
    // Set Cobro user
    cobro.user = user;

    // Create new Cobro model instance
    var cobroObj = new Cobro(cobro);

    // Save the Cobro
    cobroObj.save(function () {
      // Try deleting Cobro
      request(app).delete('/api/cobros/' + cobroObj._id)
        .expect(403)
        .end(function (cobroDeleteErr, cobroDeleteRes) {
          // Set message assertion
          (cobroDeleteRes.body.message).should.match('User is not authorized');

          // Handle Cobro error error
          done(cobroDeleteErr);
        });

    });
  });

  it('should be able to get a single Cobro that has an orphaned user reference', function (done) {
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

          // Save a new Cobro
          agent.post('/api/cobros')
            .send(cobro)
            .expect(200)
            .end(function (cobroSaveErr, cobroSaveRes) {
              // Handle Cobro save error
              if (cobroSaveErr) {
                return done(cobroSaveErr);
              }

              // Set assertions on new Cobro
              (cobroSaveRes.body.name).should.equal(cobro.name);
              should.exist(cobroSaveRes.body.user);
              should.equal(cobroSaveRes.body.user._id, orphanId);

              // force the Cobro to have an orphaned user reference
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

                    // Get the Cobro
                    agent.get('/api/cobros/' + cobroSaveRes.body._id)
                      .expect(200)
                      .end(function (cobroInfoErr, cobroInfoRes) {
                        // Handle Cobro error
                        if (cobroInfoErr) {
                          return done(cobroInfoErr);
                        }

                        // Set assertions
                        (cobroInfoRes.body._id).should.equal(cobroSaveRes.body._id);
                        (cobroInfoRes.body.name).should.equal(cobro.name);
                        should.equal(cobroInfoRes.body.user, undefined);

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
      Cobro.remove().exec(done);
    });
  });
});
