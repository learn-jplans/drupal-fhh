
/*
 * Calendar
 */

App.module.create(
  'calendar',
  (function(window, $, app) {
    'use strict';

    // define module object
    var module = {};

    /***********************************
    * private variables
    */
    var $calendar = $('.js-calendar');

    /***********************************
    * private methods
    */

    /***********************************
    * public application definition
    */
    module.closeCalendar = function () {
      $('.js-calendar__toggle').removeClass('is-active');

      $calendar.slideUp(600, function(){
        $calendar.removeClass('is-open');
      });

      App.eventTooltip.closeToolTip();
    }

    var calendarToggle = function () {
      $('.js-calendar__toggle').livequery(function () {
        var $el = $(this);

        $el.on('click', function () {
          if (!$el.hasClass('is-active') && !$calendar.hasClass('is-open')) {
            $el.addClass('is-active');
            $("body").css({ 'overflow' : 'hidden' });
            $calendar.slideDown(600, function(){
              $calendar.addClass('is-open');
            });
          } else {
            module.closeCalendar();
            $("body").css({ 'overflow' : 'auto' });
          }
        });
      });
    }

    var closeCalendar = function() {
      $('.js-calendar__close').livequery(function () {
        var $el = $(this);

        $el.on('click', function () {
          module.closeCalendar();
          $("body").css({ 'overflow' : 'auto' });
        });
      });
    }

    /***********************************
    * global app declaration of events and methods
    */

    // module init method;
    // NOTE: important for initializing the module will be called dynamically
    module.init = function() {
      calendarToggle();
      closeCalendar();
    };


    return module;
  })(window, jQuery, window.App)
);
