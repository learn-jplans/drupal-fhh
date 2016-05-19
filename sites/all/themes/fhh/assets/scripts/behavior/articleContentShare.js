App.module.create(
	'articleContentShare',
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
        var shareArticle = function () {
          $('.js-content-share').livequery(function () {
            var $el = $(this);
            $el.contentshare();
            $.fn.contentshare.defaults.shareable.on('mousedown',function(){
              $.fn.contentshare.clear();
            });
            $.fn.contentshare.defaults.shareable.on('mouseup',function(){
              $.fn.contentshare.showTooltip();
            });
          });
		  $('div').not('.js-content-share').on('mousedown', function(){
		  	$.fn.contentshare.clear();
		  });
        };

        var shareCounter = function () {
        	$('.js-social-share').livequery(function () {
        		var $el = $(this),
        			elUrl = $el.attr('href'),
        			elPostId = $el.data('id'),
        			elPlatform = $el.attr('title'),
					w = 600,
					h = 460,
        			y = window.top.outerHeight / 2 + window.top.screenY - ( h / 2),
					x = window.top.outerWidth / 2 + window.top.screenX - ( w / 2);

        		$el.on('click', function(e) {
        			e.preventDefault();

					window.open(elUrl,'sharer','toolbar=0,status=0,width='+w+',height='+h+',top='+y+',left='+x+'');

					$.ajax({
						url: "/wp-admin/admin-ajax.php?action=popularity_increment",
						type: "GET",
						data: {
							post_id: elPostId,
							platform: elPlatform
						},
						success: function(data){
						}
					});

        		});

        	});
        };
		/***********************************
		 * global app declaration of events and methods
		 */

		// module init method;
		// NOTE: important for initializing the module will be called dynamically
		module.init = function() {
          if($('.js-content-share').length) {
          	shareArticle();
          }

          shareCounter();
		};


		return module;
	})(window, jQuery, window.App)
);
