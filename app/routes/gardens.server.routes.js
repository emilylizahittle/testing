'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var gardens = require('../../app/controllers/gardens.server.controller');

	// Gardens Routes
	app.route('/gardens')
		.get(gardens.list)
		.post(users.requiresLogin, gardens.create);

	app.route('/gardens/:gardenId')
		.get(gardens.read)
		.put(users.requiresLogin, gardens.hasAuthorization, gardens.update)
		.delete(users.requiresLogin, gardens.hasAuthorization, gardens.delete);

	// Finish by binding the Garden middleware
	app.param('gardenId', gardens.gardenByID);
};
