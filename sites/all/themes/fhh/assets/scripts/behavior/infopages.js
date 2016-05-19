App.module.create(
	'infopages',
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
        var infoNav = function () {
          $('.c-info__nav').livequery(function () {
            var $el = $(this),
                headerHeight = $('.header').height(),
                bannerHeight = $('.c-info__banner').height() ;
            app.$window.on('resize', function () {
              var headerHeight = $('.header').height(),
                  bannerHeight = $('.c-info__banner').height();
            });
            $(window).scroll(function () {
                if($(this).scrollTop() > bannerHeight) {
                  $el.addClass('fixed');
                } else if($(this).scrollTop() < bannerHeight) {
                  $el.removeClass('fixed');
                  $('.c-navlist--mobile').removeClass('open')
                  $('.c-nav--list').removeAttr('style');
                }
            });

          });
        };
        var infoNavMobile = function () {
          $('.c-navlist--mobile').livequery(function () {
            var $el = $(this);
            $el.on('click',function() {
              if($el.hasClass('open')) {
                $el.removeClass('open');
                $el.siblings('ul.c-nav--list').slideUp();
              } else {
                $el.addClass('open');
                $el.siblings('ul.c-nav--list').slideDown();
              }
            });

          });
        };
        var infoAccordion = function () {
          $('.js-infoaccordion').livequery(function () {
            var $el = $(this),
                $accordionTitle = $el.children('h2'),
                $accordionContent = $accordionTitle.next('div');

            $accordionTitle.each(function(){
              $(this).on('click',function() {
                if($(this).hasClass('active')) {
                  $(this).removeClass('active');
                  $(this).next('div').removeClass('active');

                } else {
                  $accordionTitle.removeClass('active');
                  $accordionContent.removeClass('active');
                  $(this).addClass('active');
                  $(this).next('div').addClass('active');
                }
              });
            });

          });
        };


        var infoReadmore = function () {
          $('.c-info--readmore').livequery(function(){
            var $el = $(this),
                $content = $el.siblings('.c-info__content');
                $el.each(function(){
                  $el.on('click',function(){
                    if($el.hasClass('expanded')) {
                      $el.removeClass('expanded');
                      $content.removeClass('expanded');
                      $el.text('Read More');
                    } else {
                      $el.addClass('expanded');
                      $el.text('Read Less');
                      $content.addClass('expanded');
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
          infoNav();
          infoAccordion();
          infoNavMobile();
          infoReadmore();
		};


		return module;
	})(window, jQuery, window.App)
);
