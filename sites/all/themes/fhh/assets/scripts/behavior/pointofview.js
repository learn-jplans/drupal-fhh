App.module.create(
	'pointofview',
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
        var parallaxBG = function () {
          $('.o-section--pov').livequery(function () {
            var $el = $(this),
                $parallaxOffset = $(this).offset().top;
            console.log('pov:' + $parallaxOffset);
            var position = $(window).scrollTop();
            var header = $('.o-section--pov');
            var range = header.outerHeight() - 800;

            $(window).scroll(function(){
              /*if ($(window).scrollTop() >=  $parallaxOffset) {
                $('.parallaxbg').addClass('glow');
              } else {
                $('.parallaxbg').removeClass('glow');
              }*/


              var scrollTop = $(this).scrollTop();
              var offset = header.offset().top - 500;
              var height = header.outerHeight();
              offset = offset + height / 2;
              var calc = 0 + (scrollTop - offset + range) / range;

              $('.parallaxbg').css({ 'opacity': calc });

              if ( calc > '1' ) {
                $('.parallaxbg').css({ 'opacity': 1 });
              } else if ( calc < '0' ) {
                $('.parallaxbg').css({ 'opacity': 0 });
              }



            });
          });
        };

		/***********************************
		 * global app declaration of events and methods
		 */

		// module init method;
		// NOTE: important for initializing the module will be called dynamically
		module.init = function() {
          parallaxBG();
		};


		return module;
	})(window, jQuery, window.App)
);
