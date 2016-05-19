
/*
 * Countdown
 */

App.module.create(
  'countdown',
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
  var bindCountdown = function () {
    var $countdown = $('.js-countdown');

    $countdown.each(function (index, val) {
      var $el = $(this),
        $date = $el.data('countdownDate'),
        $days = $el.find('.js-countdown__days'),
        $hours = $el.find('.js-countdown__hours'),
        $minutes = $el.find('.js-countdown__minutes'),
        $seconds = $el.find('.js-countdown__seconds'),
        currentTime = new Date().getTime(),
        eventDateTime = new Date($date).getTime(),
        $heroContent = $countdown.parent().parent().find('.c-hero__content');

      if( currentTime > eventDateTime) {
        $countdown.hide();
        if(!$heroContent.hasClass('no-countdown')) $heroContent.addClass('no-countdown');
        return ;
      }

      $countdown.show();
      $heroContent.removeClass('no-countdown');

      $el.countdown($date)
        .on('update.countdown', function (event) {
          $days.find('div').text(event.strftime('%D'));
          $hours.find('div').text(event.strftime('%H'));
          $minutes.find('div').text(event.strftime('%M'));
          $seconds.find('div').text(event.strftime('%S'));
        });

    });
  };

  var bindHeroTitleSize = function () {
    var rtime,
      $heroTitle = $('.c-hero__content .c-hero__title'),
      timeout = false,
      delta = 200;

    if( !$heroTitle.length ){ return; }

    var handleHeroTitle = function() {
      if( $heroTitle.outerHeight() > 72 ){
        $heroTitle.addClass('two-lines');
      } else {
        $heroTitle.removeClass('two-lines');
      }
    };

    var resizeEnd = function () {
      if (new Date() - rtime < delta) {
        setTimeout(resizeEnd, delta);
      } else {
        timeout = false;
        handleHeroTitle();
      }
    };

    var startResize = function() {
      rtime = new Date();
      $heroTitle.removeClass('two-lines');
      if (timeout === false) {
        timeout = true;
        setTimeout(resizeEnd, delta);
      }
    };

    app.$window.on('resize', startResize);

    handleHeroTitle();
  };

  /***********************************
  * global app declaration of events and methods
  */

  // module init method;
  // NOTE: important for initializing the module will be called dynamically
  module.init = function() {
    bindCountdown();
    bindHeroTitleSize();
  };


  return module;
  })(window, jQuery, window.App)
);
