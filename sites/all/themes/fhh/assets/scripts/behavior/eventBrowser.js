/*
 * Event Browser
 */

App.module.create(
  'eventBrowser',
  (function(window, $, app) {
    'use strict';

    // define module object
    var module = {};

    /***********************************
    * private variables
    */
    var $container = $('.js-browser-container');

    /***********************************
    * private methods
    */

    /***********************************
    * public application definition
    */

    var eventBrowserHead = function () {

      $('.js-browser__event').livequery(function () {
        var $el = $(this),
          $parent = $el.parent(),
          $ctrl = $('.js-browser__ctrl');

        $el.on('click', function (e) {

          e.preventDefault();

          document.location = $el.parent(".js-browser__item").data("href");

          // var $dataIndex = $(this).parent().data('slickIndex');
          //
          // if (!$parent.hasClass('is-active')) {
          //   $('.js-browser__item').removeClass('is-active');
          //   $('.js-browser__body').removeClass('is-show');
          //   $parent.addClass('is-active');
          //   $ctrl.removeClass('is-show');
          //   //$('[data-browser-index="' + $dataIndex + '"]').addClass('is-show');
          //   $('[data-browser-index]').addClass('is-show');
          // } else {
          //   $parent.removeClass('is-active');
          //   $ctrl.addClass('is-show');
          //   $('.js-browser__body').removeClass('is-show');
          // }
          //
          // $("html,body").animate({ scrollTop: $('.js-browser__body.is-show').offset().top - 100 - $('.js-header').outerHeight() + 30 });
          //
          // app.$window.resize();
        });
      });
    }

    var bindBrowserHeadSticky = function () {
      var $header = $('.js-header'),
        $browser = $('.js-browser');

      if ($browser.length < 1) return false;

      var $browserOffsetY = $browser.parent().next().offset().top,
      $scrollTop = app.$window.scrollTop(),
      $headerHeight = $header.outerHeight(),
      $ctrlHeight = $browser.find('.js-browser__ctrl').outerHeight();

      var browserHeadSticky = function () {
        $scrollTop = app.$window.scrollTop();
        var $relatedOffset = app.$doc.find('.js-event__related').offset().top - $header.outerHeight() - $ctrlHeight;

        if (app.$window.width() > app.breakpoint.small) {
          if (($scrollTop + $headerHeight + $ctrlHeight ) > $browserOffsetY && !$browser.hasClass('is-browser--fixed')) {
            // $browser.addClass('is-browser--fixed');
            $container.addClass('is-fixed');
          } else if (($scrollTop + $headerHeight + $ctrlHeight) < $browserOffsetY && $browser.hasClass('is-browser--fixed')) {
            // $browser.removeClass('is-browser--fixed');
            $container.removeClass('is-fixed');
          }

          if( $scrollTop > $relatedOffset ) {
            $browser.addClass('stuck--footer');
          } else {
            $browser.removeClass('stuck--footer');
          }
        }
      }

      var sticky = new Waypoint.Sticky({
        element: $browser[0],
        offset: -($('.js-event__dark').offset().top - $header.outerHeight() - $ctrlHeight - 90),
        wrapper: '<div class="sticky-wrapper js-browser__sticky-wrapper" />'
      });

      var reInitWaypoint = function(){
        setTimeout(function(){
          sticky.destroy();
          var newOffset = 0;
          if(app.$window.width() >= app.breakpoint.small && app.$window.width() <= app.breakpoint.medium){
            newOffset = -($('.js-browser__carousel').outerHeight() - $header.outerHeight() - 120)
          } else {
            newOffset = -($('.js-browser__carousel').outerHeight() - $header.outerHeight() - 90)
          }
          sticky = new Waypoint.Sticky({
            element: $browser[0],
            // offset: 0
            // offset: -($('.js-browser__title').offset().top - $header.outerHeight() + $ctrlHeight + $('.js-calendar__bar').outerHeight() - 4)
            offset: newOffset,
            wrapper: '<div class="sticky-wrapper js-browser__sticky-wrapper" />'
          });
        }, 300);
      };

      app.$window.on('EVENT_ON_SCROLL', browserHeadSticky);
      app.$window.on('EVENT_ON_RESIZE', browserHeadSticky);
      app.$window.on('resize', reInitWaypoint);
      browserHeadSticky();
    }

    var bindBrowserCurrentNews = function() {
      $('.js-browser__current-news').livequery(function() {
        var $el = $(this);
        $el.on('click', function(e){
          e.preventDefault();
          $('html,body').animate({ scrollTop: $('.js-event__dark').offset().top - 215 });
        });
      });
    };

    var bindBrowserCarousel = function () {
      $('.js-browser__carousel').livequery(function () {
        var $el = $(this),
          $item = $el.find('.js-browser__item'),
          $ctrl = $el.parent().find('.js-browser__ctrl'),
          $current = $ctrl.find('.js-browser__slides__current'),
          $total = $ctrl.find('.js-browser__slides__total'),
          $nextSlide = $ctrl.find('.js-browser__item__next'),
          $prevSlide = $ctrl.find('.js-browser__item__prev');

        var showCtrl = function () {
          if ($item.length > 3) {
            $ctrl.addClass('is-show');
          } else {
            $ctrl.removeClass('is-show');
          }
        };

        app.$window.on('resize', function () {
          if (app.$window.width() >= app.breakpoint.small) {
            //$el.slick('reinit');
          }
        });

        showCtrl();

        $el.on('init afterChange', function (event, slick, currentSlide, nextSlide) {
          var $i = (currentSlide ? currentSlide : 0);

          if (app.$window.width() >= app.breakpoint.small && app.$window.width() <= app.breakpoint.medium) {
            $item.removeClass('is-active');
            $('.js-browser__body').removeClass('is-show');
            $('[data-slick-index="' + $i + '"]').addClass('is-active');
            $('[data-browser-index="' + $i + '"]').addClass('is-show');
          }

          $current.text($i + 1);
          $total.text(slick.slideCount);

        });

      });
    };

    var bindGetMoreEvents = function(){
      if( !$('.js-load-more--events__body').length && !$('.js-load-more--events').length ){ return; }

      var postsPerPage = 4,
          currentOffset = postsPerPage,
          $loadMoreBody = $('.js-load-more--events__body'),
          loadMoreHiddenItems = $loadMoreBody.find('.c-tile--flex.hide').length,
          $btn = $('.js-load-more--events'),
          $headerHeight = $('.js-header').outerHeight();

      $btn.on('click', function(e){
        e.preventDefault();
        var i = currentOffset;

        for(i = currentOffset; i < currentOffset + postsPerPage; i++){
          $loadMoreBody.find('[data-count=' + i + ']').removeClass('hide');
          loadMoreHiddenItems--;
        }

        $('html, body').animate({
          scrollTop: $loadMoreBody.find('[data-count=' + (i - postsPerPage) + ']').offset().top - $headerHeight - 30
        }, 500, function(){
          app.$window.resize();
        });

        currentOffset = i;

        if(loadMoreHiddenItems <= 0){
          $btn.hide();
        }
      });

      // var $events_body = $('.js-load-more--events__body'),
      //     $btn = $('.js-load-more--events'),
      //     loadmoreText = $btn.data('loadmoretext'),
      //     loadingText = $btn.data('loadingtext'),
      //     ajaxUrl = $events_body.data("ajaxUrl"),
      //     ajaxExclude = $events_body.data("exclude"),
      //     ajaxCountPerPage = 4;
      //
      // $btn.on('click', function(e){
      //   e.preventDefault();
      //
      //   var newOffset = $events_body.attr('data-offset');
      //   $btn.text(loadingText);
      //   $events_body.attr('data-offset', (parseInt(newOffset) + ajaxCountPerPage));
      //   getMoreEvents(ajaxUrl, newOffset);
      // });
      //
      // var getMoreEvents = function(ajaxUrl, ajaxOffset){
      //   $.ajax({
      //     // url : '/ajax/get_more_events', // fhh_custom_ajax.php: get_more_events()
      //     url : '/wp-admin/admin-ajax.php?action=get_more_events', // fhh_ajax.php: get_more_events()
      //     type: 'GET',
      //     data: {
      //       offset: ajaxOffset,
      //       exclude: ajaxExclude
      //     },
      //     success: function(data) {
      //       $events_body.append(data);
      //       $btn.text(loadmoreText);
      //       if( (data === '') || ($(".c-tile--flex").length % 4 !== 0) ){
      //         $btn.hide();
      //       }
      //     }
      //   });
      // };
    };

    /***********************************
    * global app declaration of events and methods
    */

    // module init method;
    // NOTE: important for initializing the module will be called dynamically
    module.init = function() {
      eventBrowserHead();
      bindBrowserCarousel();
      bindBrowserHeadSticky();
      bindBrowserCurrentNews();
      bindGetMoreEvents();
    };


    return module;
  })(window, jQuery, window.App)
);
