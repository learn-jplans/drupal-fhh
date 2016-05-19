App.module.create(
	'forgotPassword',
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
		var $body = $('.js-body');
		var openLostPassword = function () {
		  $('.lostpassword').livequery(function () {
			var $el = $(this);
			$el.on('click',function() {
			  $('.closelogin').click();
			  module.openForgotPasswordModal();
			  app.$body.addClass('u-no-scroll');
			});
			$('.closeforget').on('click',function(){
				module.closeForgotPasswordModal();
			  app.$body.removeClass('u-no-scroll');
			});
		  });
		};

		/***********************************
		 * global app declaration of events and methods
		 */

		module.closeForgotPasswordModal = function() {
			$('.forgot-password-wrapper').show();
			$('.forgot-password-wrapper--success').hide();
			$('.forgot-password--container').fadeOut();
		};

		module.openForgotPasswordModal = function() {
			$('.forgot-password-wrapper').show();
		  $('.forgot-password-wrapper--success').hide();
		  $('.forgot-password--container').fadeIn();
		};

		// module init method;
		// NOTE: important for initializing the module will be called dynamically
		module.init = function() {
		  openLostPassword();
		};


		return module;
	})(window, jQuery, window.App)
);
