Javascript Application Library
===============================


How to create a new module
---------------------------
1. Create a new file with the name of the module
   e.g.: module.js, siteNav.js

2. Use below as template:
/*
 * [Module Name and Description]
 */

App.module.create(
	'siteNav',
	(function(window, $, app) {
		'use strict';

		// define module object
		var module = {};

		/***********************************
		 * private variables
		 */

		/***********************************
		 * private methods
		 */

		/***********************************
		 * public application definition
		 */


		/***********************************
		 * global app declaration of events and methods
		 */

		// module init method;
		// NOTE: important for initializing the module will be called dynamically
		module.init = function() {

		};


		return module;
	})(window, jQuery, window.App)
);

3. Include the file to the manifest.json file.