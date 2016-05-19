
/*
 * Hero Module
 */

App.module.create(
  'hero',
  (function(window, $, app) {
    'use strict';

    // define module object
    var module = {},
        $body = $('.js-body');

    /***********************************
    * private variables
    */

    var $header = $('.js-header');

    /***********************************
    * private methods
    */

    /***********************************
    * public application definition
    */

    var bindHeroScroll = function () {
      $('.js-hero').livequery(function () {
        var $el = $(this);
          // $scrollTop = app.$window.scrollTop(),
          // maxOpacity = 0.8;

        var bindHeroEvent = function(e, pageY) {

          var windowHeight = app.dims ? app.dims.h : app.$window.height();
          var $elBefore = $el.find('.before');

          if ($el.length < 0) return false;
          if (pageY > 0) {

            $el.addClass('is-overlay');
            if($body.hasClass('content-loaded')) {
              $body.addClass('is-on-top');
            }

            if( !$elBefore.length ){
              $el.prepend('<aside class="before"></aside>');
            }

            if( $header.hasClass('stuck') && !$elBefore.hasClass('is-hide') )
              $elBefore.addClass('is-hide');
            else if( !$header.hasClass('stuck') && $elBefore.hasClass('is-hide') )
              $elBefore.removeClass('is-hide');

            $el.find('.before').css('opacity', ((pageY * 100) / windowHeight) / 100 );

          } else if(!$('.js-header').hasClass('is-header--force-fixed') && !$('.js-burger').hasClass('c-burger--active')) {
            $el.removeClass('is-overlay');
            $('.js-body').removeClass('is-on-top');
            $elBefore.remove();
            $(window).scrollTop(0); // for safari
          }
        }

        app.$window.on("EVENT_ON_SCROLL", bindHeroEvent);
      });
    };

    var bindHeroAutoScrollUp = function() {
      if( !$("body.home").length ){ return; }

      if( $("body .page-unsubscribe").length ){ return; }

      var currentPosition = app.$window.scrollTop();

      var scrollToTopDesktop = function(){
        var scrollToTop = function(e, pageY) {
          var windowHeight = app.$window.outerHeight();
          setTimeout(function(){
            if( currentPosition < windowHeight ) {
              if( pageY > 300 ) {
                $("body").addClass("is-animating");
                $("body").animate({ scrollTop: windowHeight }, 500, function(){
                  $(window).scrollTop(windowHeight);
                  $("body").removeClass("is-animating");
                });
              }
            }
          }, 300);

          currentPosition = app.$window.scrollTop();
        };

        app.$window.on("EVENT_ON_SCROLL_END", scrollToTop);
        app.$window.on("scroll", function(e){
          if( $("body").hasClass("is-animating") ) {
            e.preventDefault();
          }
        });
      };

      var scrollToTopMobile = function(){
        var scrollToTop = function() {
          var windowHeight = app.$window.outerHeight();

          setTimeout(function(){
            if( currentPosition < windowHeight ) {
              if( app.$window.scrollTop() > (windowHeight / 2) ) {
                $("body").addClass("is-animating");
                $("html, body").stop().animate({ scrollTop: windowHeight }, 300, function(){
                  $("body").removeClass("is-animating");
                });
              }
            }
          }, 300);

          currentPosition = app.$window.scrollTop();
        };

        app.$window.on("touchend", scrollToTop);
        app.$window.on("touchstart", function(){
          if( !$("body").hasClass("is-animating") ) {
            $("html, body").stop();
          }
        });
        app.$window.on("touchmove", function(e){
          if( $("body").hasClass("is-animating") ) {
            e.preventDefault();
          }
        });
      };

      if( Modernizr.touch ){
        scrollToTopMobile();
      } else {
        scrollToTopDesktop();
      }
    };

    var bindScrollDown = function () {

      var scrollDown = function () {
        $('.js-hero__scroll').on('click', function (e) {
          e.preventDefault();

          var windowHeight = app.dims ? app.dims.h : app.$window.height();

          $(window.browserDetect.scrollTarget).animate({scrollTop: windowHeight}, 'slow');

        });
      };

      // app.$window.on('resize', scrollDown);
      scrollDown();
    };

    var bindEventScrollDown = function () {
      var scrollDown = function () {
        $('.js-hero__event__scroll').on('click', function (e) {
          e.preventDefault();

          var windowHeight = app.dims ? app.dims.h : app.$window.height();

          var $header = $('.js-header').height(),
            val = windowHeight - $header;

          $('html,body').animate({scrollTop: val}, 'slow');

        });
      }

      // app.$window.on('resize', scrollDown);
      scrollDown();
    };

    var bindActions = function() {
      if($('.js-hero').length == 0) return ;

      // skip hero...
      if(getQueryParameterByName('login') == 'true' || getQueryParameterByName('accounts') == 'true' || getQueryParameterByName('action') == 'register') {
        var windowHeight = app.dims ? app.dims.h : app.$window.height();
        $('html,body').animate({scrollTop: windowHeight}, 'slow');
        if(getQueryParameterByName('accounts') == 'true') {
          app.$body.addClass('u-no-scroll');
          $('.js-header').addClass('is-header--force-fixed');
          $('.c-menu__link__account--loggin').addClass('showDetails');
          if($('.js-hero').length == 0) {
            $('.accounts-container').addClass('show');
          } else {
            $('.accounts-container').addClass('show-home');  
          }
          $('.account-menu-container .saved-article').click();
        }
      }
    };

    /***********************************
    * global app declaration of events and methods
    */

    // module init method;
    // NOTE: important for initializing the module will be called dynamically
    module.init = function() {
      browserDetect.init();
      bindHeroScroll();
      bindHeroAutoScrollUp();
      bindScrollDown();
      bindEventScrollDown();

      app.$window.on('load', function(){
        if( app.$doc.find('body').hasClass('from-article') ){
          app.$doc.find('body').removeClass('from-article');
        }

        if( ! (getQueryParameterByName('login') == 'true' || getQueryParameterByName('accounts') == 'true' || getQueryParameterByName('action') == 'register') ) {
          app.$doc.find('body').removeClass('u-no-scroll');
        }
        app.$doc.find('.js-preloader--home').removeClass('is-active');


        app.$doc.find('.js-modal').removeClass('is-active');
        bindActions();
        var s = window.location.href;
        var n = s.indexOf('?');
        s = s.substring(0, n != -1 ? n : s.length);
        window.history.replaceState($('title').text(), $('title').text(), s);
      });
    };


    return module;
  })(window, jQuery, window.App)
);
