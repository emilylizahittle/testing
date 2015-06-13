'use strict';

//Setting up route
angular.module('gardens').config(['$stateProvider',
	function($stateProvider) {
		// Gardens state routing
		$stateProvider.
		state('listGardens', {
			url: '/gardens',
			templateUrl: 'modules/gardens/views/list-gardens.client.view.html'
		}).
		state('createGarden', {
			url: '/gardens/create',
			templateUrl: 'modules/gardens/views/create-garden.client.view.html'
		}).
		state('viewGarden', {
			url: '/gardens/:gardenId',
			templateUrl: 'modules/gardens/views/view-garden.client.view.html'
		}).
		state('editGarden', {
			url: '/gardens/:gardenId/edit',
			templateUrl: 'modules/gardens/views/edit-garden.client.view.html'
		});
	}
]);