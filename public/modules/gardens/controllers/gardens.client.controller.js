'use strict';

// Gardens controller
angular.module('gardens').controller('GardensController', ['$scope', '$stateParams', '$location', 'Authentication', 'Gardens',
	function($scope, $stateParams, $location, Authentication, Gardens) {
		$scope.authentication = Authentication;

		// Create new Garden
		$scope.create = function() {
			// Create new Garden object
			var garden = new Gardens ({
				name: this.name
			});

			// Redirect after save
			garden.$save(function(response) {
				$location.path('gardens/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Garden
		$scope.remove = function(garden) {
			if ( garden ) { 
				garden.$remove();

				for (var i in $scope.gardens) {
					if ($scope.gardens [i] === garden) {
						$scope.gardens.splice(i, 1);
					}
				}
			} else {
				$scope.garden.$remove(function() {
					$location.path('gardens');
				});
			}
		};

		// Update existing Garden
		$scope.update = function() {
			var garden = $scope.garden;

			garden.$update(function() {
				$location.path('gardens/' + garden._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Gardens
		$scope.find = function() {
			$scope.gardens = Gardens.query();
		};

		// Find existing Garden
		$scope.findOne = function() {
			$scope.garden = Gardens.get({ 
				gardenId: $stateParams.gardenId
			});
		};
	}
]);