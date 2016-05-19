App.module.create(
	'watchlist',
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
        var parallaxBGwl = function () {
          $('.o-watch-list').livequery(function () {
            var $el = $(this),
                $parallaxOffset = $(this).offset().top;
            //console.log('pov:' + $parallaxOffset);
            console.log($('.o-watch-list .c-tile ').length);
            if($('.o-watch-list .c-tile ').length > 3 ) {
              $el.prepend('<span class="watchlist-bg two-row"></span>');
            } else {
              $el.prepend('<span class="watchlist-bg"></span>');
            }

            var position = $(window).scrollTop();
            var header = $('.watchlist-bg');
            var range = header.outerHeight();

            $(window).scroll(function(){
              var scrollTop = $(this).scrollTop();
              var offset = header.offset().top;
              var height = header.outerHeight() - 1000 ;
              offset = offset + height / 2;
              var calc = 0 + (scrollTop - offset + range) / range;

              $('.watchlist-bg').css({ 'opacity': calc });

              if ( calc > '1' ) {
                $('.watchlist-bg').css({ 'opacity': 1 });
              } else if ( calc < '0' ) {
                $('.watchlist-bg').css({ 'opacity': 0 });
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
          parallaxBGwl();
		};


		return module;
	})(window, jQuery, window.App)
);
