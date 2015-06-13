'use strict';

// Configuring the Articles module
angular.module('gardens').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Gardens', 'gardens', 'dropdown', '/gardens(/create)?');
		Menus.addSubMenuItem('topbar', 'gardens', 'List Gardens', 'gardens');
		Menus.addSubMenuItem('topbar', 'gardens', 'New Garden', 'gardens/create');
	}
]);