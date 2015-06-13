'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Garden = mongoose.model('Garden'),
	_ = require('lodash');

/**
 * Create a Garden
 */
exports.create = function(req, res) {
	var garden = new Garden(req.body);
	garden.user = req.user;

	garden.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(garden);
		}
	});
};

/**
 * Show the current Garden
 */
exports.read = function(req, res) {
	res.jsonp(req.garden);
};

/**
 * Update a Garden
 */
exports.update = function(req, res) {
	var garden = req.garden ;

	garden = _.extend(garden , req.body);

	garden.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(garden);
		}
	});
};

/**
 * Delete an Garden
 */
exports.delete = function(req, res) {
	var garden = req.garden ;

	garden.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(garden);
		}
	});
};

/**
 * List of Gardens
 */
exports.list = function(req, res) { 
	Garden.find().sort('-created').populate('user', 'displayName').exec(function(err, gardens) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gardens);
		}
	});
};

/**
 * Garden middleware
 */
exports.gardenByID = function(req, res, next, id) { 
	Garden.findById(id).populate('user', 'displayName').exec(function(err, garden) {
		if (err) return next(err);
		if (! garden) return next(new Error('Failed to load Garden ' + id));
		req.garden = garden ;
		next();
	});
};

/**
 * Garden authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.garden.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
