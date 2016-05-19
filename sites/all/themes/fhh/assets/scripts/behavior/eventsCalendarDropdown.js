
/*
 * Timeline
 */

App.module.create(
  'dropdownCalendar',
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

  var handleCalendarDropdown = function(){

    $(".js-dropdown--calendar").livequery( function(e) {
      var $el = $(this),
        ajaxUrl = $(".js-calendar").data("ajax-url");

      $el.find(".js-dropdown__item").on("click", function(e){
        var $li = $(this);

        $('.js-event__tooltip').removeClass('is-show').css({top: 'auto'});
        $('.js-event__tooltip__carousel').slick('unslick').children().remove();

        $el.find(".js-dropdown__value").text( $li.text() );

        $.ajax({
          url : ajaxUrl + '/ajax/get_calendar_items',
          type: "GET",
          data: {
            year  : $li.data("dropdown-year"),
            month : $li.data("dropdown-month")
          },
          success: function(data) {
            $(".js-calendar").attr("data-year", $li.data("dropdown-year")).attr("data-month", $li.data("dropdown-month"));
            $(".js-calendar__body").html(data);
            $(".js-dropdown-overlay").fadeOut("fast");
            $el.removeClass("is-dropdown--active");
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
    handleCalendarDropdown();
  };


  return module;
  })(window, jQuery, window.App)
);
