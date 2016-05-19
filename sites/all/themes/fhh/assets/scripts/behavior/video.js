/*
 * Video Module
 */

App.module.create(
	'video',
	(function(window, $, app) {
		'use strict';

		// define module object
		var module = {};

		/***********************************
		 * private variables
		 */

    var fullHeaderHeight = app.$doc.find('.js-header').outerHeight() +  $(app.$doc.find('.js-header--article')[0]).outerHeight();

		/***********************************
		 * private methods
		 */

		/***********************************
		 * public application definition
		 */
        module.loadVideos = function($obj) {
          var $el = $obj,
              $videoContainer = app.$doc.find('.c-video__container'),
              $videoInView = app.$doc.find('.js-video'),
              $moreBtn = app.$doc.find('.c-morevideo--button'),
              $currentVideo = app.$doc.find('.c-morevideo--currentplay'),
              $videoBg = app.$doc.find('.c-video--bg'),
              $sidebar = app.$doc.find('.js-sidebar');

          var toggleMoreVideo = function(){
            if( $moreBtn.hasClass('is-active') ){
              $moreBtn.removeClass('is-active');
              $el.removeClass('is-shown').slideUp();
              $videoBg.removeClass('fadeOut');
              $videoContainer.removeClass('more--videos');
              $sidebar.removeClass('with-video');
            } else {
              var moreVideoPosTop = fullHeaderHeight;
              $moreBtn.addClass('is-active');
              moreVideoPosTop = app.$doc.find('.js-header').outerHeight() + $(app.$doc.find('.js-header--article')[0]).outerHeight();
              $el.addClass('is-shown').css('top', moreVideoPosTop).slideDown('800');
              $videoBg.addClass('fadeOut');

              if( $videoInView.hasClass('is-inview') ){
                $videoContainer.addClass('more--videos');
                $sidebar.addClass('with-video');
                $("html, body").animate({
                  scrollTop: ($videoInView.offset().top - app.$doc.find('.js-header').outerHeight())
                }, 800);
              }
            }
          }

          if( !$el.hasClass('is-loaded') ){
            $.ajax({
              url: "/ajax/load_videos",
              type: "GET",
              data: {},
              success: function(data){
                $('.js-video__list').html(data);
                $el.addClass('is-loaded');
                moreVideoCarousel();
                toggleMoreVideo();
              }
            });
          } else {
            toggleMoreVideo();
          }
        };

        var moreVideoBtn = function () {
          $('.js-video__more').livequery(function(){
            var $el = $(this);
            var $moreBtn = $('.c-morevideo--button');

            $moreBtn.on('click', function(e){
              e.preventDefault();
              module.loadVideos($el);
            });
          });
        };

        var handleVideoVisibility = function(){
          $('.js-video').livequery(function(){
            var $el = $(this);
            var checkIfVisible = function(){
              var t = $el.offset().top;
              var b = t + $el.outerHeight();

              if( ((window.scrollY + window.outerHeight) > t) && (window.scrollY < (b - fullHeaderHeight)) ) {
                if( !$el.hasClass('is-inview') && (app.$window.width() >= app.breakpoint.medium) ) {
                  $el.addClass('is-inview');
                }
              } else {
                if( $el.hasClass('is-inview') ) {
                  $el.removeClass('is-inview');
                }
              }
            };

            checkIfVisible();
            app.$window.on('EVENT_ON_SCROLL', checkIfVisible);
          });
        };

        var moreVideoCarousel = function () {
          $('.c-morevideo__listcontainer').livequery(function(){
            var $el = $(this);

            $el.slick({
              mobileFirst: true,
              arrows: false,
              dots: false,
              infinite: true,
              centerMode: false,
              slidesToShow: 1,
              slidesToScroll: 1,
              variableWidth: true,
              responsive: [
                {
                  breakpoint: app.breakpoint.small,
                  settings: {
                    slidesToShow: 2,
                    centerMode: false,
                    variableWidth: true,
                    infinite: true,
                    lazyLoad: 'ondemand',
                    swipeToSlide: true,
                  }
                },
                {
                  breakpoint: app.breakpoint.medium,
                  settings: {
                    slidesToShow: 4,
                    centerMode: false,
                    variableWidth: true,
                    swipeToSlide: true,
                  }
                },
                {
                  breakpoint: app.breakpoint.large,
                  settings: {
                    slidesToShow: 4,
                    centerMode: false,
                    variableWidth: true,
                    swipeToSlide: true,
                  }
                }
              ]
            });

            $el.css('opacity', 0).slick('slickGoTo', 1).delay(400).animate({
              'opacity' : 1
            }, 300);
          });
        };

        var playVideo = function (){
          $('.c-video__container, .c-video-basic').livequery(function(){
            var $cont = $(this),
                $el = $('.c-video--playbutton, .c-video-basic--playbutton', $cont),
                $video = $('.c-video__box', $cont),
                $videoContainer = $('.c-video__box.animated', $cont),
                $videoClose = $('.close-video', $cont),
                $videoIframe = $el.parent().find('iframe').first(),
                $source = $videoIframe.data('source'),
								$videoContainer = app.$doc.find('.c-video__container');

            $el.on('click',function(){
							var $this = $(this);
              if($el.hasClass('fadeOut')){
                $el.removeClass('fadeOut');
                $video.removeClass('fadeIn');
                $videoClose.fadeOut();
              } else {
                $el.addClass('fadeOut');
                $video.addClass('fadeIn');
                $videoClose.fadeIn();
              }

							$videoContainer.addClass('is-playing');
							var ifBasic = ( $this.hasClass('c-video-basic--playbutton') )? 200 : -50;
							$("html, body").animate({
								scrollTop: $this.parent('.c-video__current').offset().top - fullHeaderHeight - ifBasic
							}, 600);
              if($source === 'youtube') {
                $videoIframe[0].contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
              } else if($source === 'vimeo') {
                $videoIframe[0].contentWindow.postMessage('{"method":"play"}', '*');
              }
            });

            $videoClose.on('click',function(){
              $(this).fadeOut();
              $('.c-video--playbutton').removeClass('fadeOut');
              $video.removeClass('fadeIn');
							$videoContainer.removeClass('is-playing');

              if($source === 'youtube') {
                $videoIframe[0].contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
              } else if($source === 'vimeo') {
                $videoIframe[0].contentWindow.postMessage('{"method":"unload"}', '*');
              }
            });
          });
        };

        var videoTransporter = function () {
          $('.js-videotransporter').livequery(function(){
            var $el = $(this);
            var postId = $el.data('id');

            app.$window.on('resize', function () {
              $el.slick('destroy').slick('init');
              adjustTransporterContainer(postId);
            });
            $el.slick({
              mobileFirst: true,
              arrows: false,
              dots: false,
              infinite: false,
              centerMode: false,
              slidesToShow: 1,
              slidesToScroll: 1,
              variableWidth: true,
              responsive: [
                {
                  breakpoint: app.breakpoint.small,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    focusOnSelect: true,
                    centerMode: false,
                    variableWidth: true,
                    infinite: false,
                    lazyLoad: 'ondemand'
                  }
                },
                {
                  breakpoint: app.breakpoint.medium,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    focusOnSelect: true,
                    centerMode: false,
                    variableWidth: true,
                    infinite: false,
                    lazyLoad: 'ondemand'
                  }
                },
                {
                  breakpoint: 1400,
                  settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    focusOnSelect: true,
                    draggable: false,
                    swipeToSlide: false,
                    centerMode: false,
                    variableWidth: true,
                    infinite: false,
                    lazyLoad: 'ondemand'
                  }
                }
              ]
            });

            $el.on('afterChange', function(event, slick, currentSlide){
              if(currentSlide >= 2 ) {
                $('.js-videotransporter--title').slick("slickNext");
              } else if (currentSlide <= 2) {
                $('.js-videotransporter--title').slick("slickPrev");
              }
            });

            $('.m-videotransporter[data-id='+postId+'] img').one("load", function() {
              adjustTransporterContainer(postId);
            }).each(function() {
              if(this.complete) $(this).load();
            });

          });
        };

        var videoTransporterTitle = function () {
          $('.js-videotransporter--title').livequery(function(){
              var $el = $(this);
              $el.slick({
                arrows: false,
                dots: false,
                infinite: false,
                centerMode: false,
                slidesToShow: 2,
                slidesToScroll: 2,
                draggable: false,
                swipe: false,
                variableWidth: false,
                responsive: [
                {
                  breakpoint: 960,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    variableWidth: true
                  }
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    variableWidth: true
                  }
                },
                {
                  breakpoint: 320,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                  }
                }
              ]
              });
          });
        };

        var adjustTransporterContainer = function(postId) {
          /*var $transporterContainer = $('.m-videotransporter[data-id='+postId+']');
          var $transporterPostsContainer = $('.js-videotransporter[data-id='+postId+']');
          var $tiles = $transporterContainer.find('.c-tile');

          // reset
          $tiles.css( 'height', '' );

          // ajust height
          var height = $transporterPostsContainer.height();
          height = isMedium() ? height : (height - 32);
          var padding = $transporterContainer.find('.c-tile:first-child').css('paddingBottom');
          $tiles.css( 'height', height + 'px' );*/
        };

        var isMedium = function() {
          return (app.$window.height() >= app.breakpoint.medium);
        };

        var positionBasicVideo = function() {
          $('.c-video-basic.right').livequery(function(){
            var $el = $(this),
                $elBody = app.$doc.find('.c-article__body'),
                $elCurrent = $el.find('.c-video__current');

            var adjustVideoAlignment = function(){
              if(window.outerWidth > app.breakpoint.medium){
                var leftSpace = $elBody.offset().left,
                    vidWidth = $el.outerWidth(),
                    rightSpace = leftSpace + vidWidth,
                    finalSpace = window.outerWidth - rightSpace;

                $el.css({ transform: 'translateX('+finalSpace+'px)' });
              } else {
                $el.css({ transform: 'none' });
              }
            }

            app.$window.on('EVENT_ON_RESIZE', adjustVideoAlignment);
            adjustVideoAlignment();
          });
        };

        var detectFullscreen = function() {
          var fullscreenCount = 0;
          var changeHandler = function() {
            fullscreenCount ++;
            if(fullscreenCount % 2 === 0) {
              $('header, .o-header--article, .o-meta__category, .c-article__title, .o-meta__date, .o-meta__type, .o-meta__duration, .c-article__social, .close-video').removeClass('fullscreen');
              $('#notification-cookies').css('display', 'block');
            } else {
              $('header, .o-header--article, .o-meta__category, .c-article__title, .o-meta__date, .o-meta__type, .o-meta__duration, .c-article__social, .close-video').addClass('fullscreen');
              $('#notification-cookies').css('display', 'none');
            }
          }
          document.addEventListener("fullscreenchange", changeHandler, false);
          document.addEventListener("webkitfullscreenchange", changeHandler, false);
          document.addEventListener("mozfullscreenchange", changeHandler, false);
          document.addEventListener("MSFullscreenChanges", changeHandler, false);
        }


		/***********************************
		 * global app declaration of events and methods
		 */

		// module init method;
		// NOTE: important for initializing the module will be called dynamically
		module.init = function() {
      playVideo();
      moreVideoBtn();
      videoTransporter();
      handleVideoVisibility();
      videoTransporterTitle();
      positionBasicVideo();
      detectFullscreen();
		};


		return module;
	})(window, jQuery, window.App)
);
