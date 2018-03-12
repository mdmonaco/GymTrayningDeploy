'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Cobro = mongoose.model('Cobro'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Cobro
 */
exports.create = function(req, res) {
  var cobro = new Cobro(req.body);
  cobro.user = req.user;

  cobro.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cobro);
    }
  });
};

/**
 * Show the current Cobro
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var cobro = req.cobro ? req.cobro.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  cobro.isCurrentUserOwner = req.user && cobro.user && cobro.user._id.toString() === req.user._id.toString();

  res.jsonp(cobro);
};

/**
 * Update a Cobro
 */
exports.update = function(req, res) {
  var cobro = req.cobro;

  cobro = _.extend(cobro, req.body);

  cobro.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cobro);
    }
  });
};

/**
 * Delete an Cobro
 */
exports.delete = function(req, res) {
  var cobro = req.cobro;

  cobro.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cobro);
    }
  });
};

/**
 * List of Cobros
 */
exports.list = function(req, res) {
  Cobro.find().sort('-created').populate('user', 'displayName').exec(function(err, cobros) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(cobros);
    }
  });
};

/**
 * Cobro middleware
 */
exports.cobroByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Cobro is invalid'
    });
  }

  Cobro.findById(id).populate('user', 'displayName').exec(function (err, cobro) {
    if (err) {
      return next(err);
    } else if (!cobro) {
      return res.status(404).send({
        message: 'No Cobro with that identifier has been found'
      });
    }
    req.cobro = cobro;
    next();
  });
};
