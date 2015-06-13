'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Garden = mongoose.model('Garden'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, garden;

/**
 * Garden routes tests
 */
describe('Garden CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
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

		// Save a user to the test db and create new Garden
		user.save(function() {
			garden = {
				name: 'Garden Name'
			};

			done();
		});
	});

	it('should be able to save Garden instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Garden
				agent.post('/gardens')
					.send(garden)
					.expect(200)
					.end(function(gardenSaveErr, gardenSaveRes) {
						// Handle Garden save error
						if (gardenSaveErr) done(gardenSaveErr);

						// Get a list of Gardens
						agent.get('/gardens')
							.end(function(gardensGetErr, gardensGetRes) {
								// Handle Garden save error
								if (gardensGetErr) done(gardensGetErr);

								// Get Gardens list
								var gardens = gardensGetRes.body;

								// Set assertions
								(gardens[0].user._id).should.equal(userId);
								(gardens[0].name).should.match('Garden Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Garden instance if not logged in', function(done) {
		agent.post('/gardens')
			.send(garden)
			.expect(401)
			.end(function(gardenSaveErr, gardenSaveRes) {
				// Call the assertion callback
				done(gardenSaveErr);
			});
	});

	it('should not be able to save Garden instance if no name is provided', function(done) {
		// Invalidate name field
		garden.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Garden
				agent.post('/gardens')
					.send(garden)
					.expect(400)
					.end(function(gardenSaveErr, gardenSaveRes) {
						// Set message assertion
						(gardenSaveRes.body.message).should.match('Please fill Garden name');
						
						// Handle Garden save error
						done(gardenSaveErr);
					});
			});
	});

	it('should be able to update Garden instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Garden
				agent.post('/gardens')
					.send(garden)
					.expect(200)
					.end(function(gardenSaveErr, gardenSaveRes) {
						// Handle Garden save error
						if (gardenSaveErr) done(gardenSaveErr);

						// Update Garden name
						garden.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Garden
						agent.put('/gardens/' + gardenSaveRes.body._id)
							.send(garden)
							.expect(200)
							.end(function(gardenUpdateErr, gardenUpdateRes) {
								// Handle Garden update error
								if (gardenUpdateErr) done(gardenUpdateErr);

								// Set assertions
								(gardenUpdateRes.body._id).should.equal(gardenSaveRes.body._id);
								(gardenUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Gardens if not signed in', function(done) {
		// Create new Garden model instance
		var gardenObj = new Garden(garden);

		// Save the Garden
		gardenObj.save(function() {
			// Request Gardens
			request(app).get('/gardens')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Garden if not signed in', function(done) {
		// Create new Garden model instance
		var gardenObj = new Garden(garden);

		// Save the Garden
		gardenObj.save(function() {
			request(app).get('/gardens/' + gardenObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', garden.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Garden instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Garden
				agent.post('/gardens')
					.send(garden)
					.expect(200)
					.end(function(gardenSaveErr, gardenSaveRes) {
						// Handle Garden save error
						if (gardenSaveErr) done(gardenSaveErr);

						// Delete existing Garden
						agent.delete('/gardens/' + gardenSaveRes.body._id)
							.send(garden)
							.expect(200)
							.end(function(gardenDeleteErr, gardenDeleteRes) {
								// Handle Garden error error
								if (gardenDeleteErr) done(gardenDeleteErr);

								// Set assertions
								(gardenDeleteRes.body._id).should.equal(gardenSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Garden instance if not signed in', function(done) {
		// Set Garden user 
		garden.user = user;

		// Create new Garden model instance
		var gardenObj = new Garden(garden);

		// Save the Garden
		gardenObj.save(function() {
			// Try deleting Garden
			request(app).delete('/gardens/' + gardenObj._id)
			.expect(401)
			.end(function(gardenDeleteErr, gardenDeleteRes) {
				// Set message assertion
				(gardenDeleteRes.body.message).should.match('User is not logged in');

				// Handle Garden error error
				done(gardenDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Garden.remove().exec();
		done();
	});
});