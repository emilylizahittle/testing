'use strict';

//Gardens service used to communicate Gardens REST endpoints
angular.module('gardens').factory('Gardens', ['$resource',
	function($resource) {
		return $resource('gardens/:gardenId', { gardenId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);