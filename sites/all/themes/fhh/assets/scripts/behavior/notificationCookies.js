/*
 * Notifications Module
 */

App.module.create(
	'notificationCookies',
	(function(window, $, app) {
		'use strict';

		// define module object
		var module = {};

		/***********************************
		 * private variables
		 */

		var $container,
			$closeBtn;

		/***********************************
		 * private methods
		 */

		var showNotification = function() {
			$container.fadeIn();
		};

		var hideNotification = function() {
			$container.fadeOut();
		};

		var bindNotification = function() {

			if($.cookie('fhh_cookies_informed') === undefined) {
				showNotification();
			}

			$closeBtn.on('click', function() {
				if($.cookie('fhh_cookies_informed') !== undefined) return;

				hideNotification();

				// add cookie with expiration (1 week)
				$.cookie('fhh_cookies_informed', 1, { expires: 7, path: '/' });
			});
		}

		/***********************************
		 * public application definition
		 */


		/***********************************
		 * global app declaration of events and methods
		 */

		// module init method;
		// NOTE: important for initializing the module will be called dynamically
		module.init = function() {
			$(window).load(function() {
				$container = $('#notification-cookies');
				$closeBtn = $('.js-cookies__close');

				if ($('#notification-cookies').length == 0) return;

				bindNotification();
			});
		};


		return module;
	})(window, jQuery, window.App)
);