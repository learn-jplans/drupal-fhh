/*
 * Event Tooltip
 */

App.module.create(
  'eventTooltip',
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

    var showToolTipEvent = function () {
      $(".js-calendar__tooltip.has-event").livequery(function () {

        var $el = $(this),
          $header = $(".js-header"),
          $toolTipContainer = $('.js-event__tooltip'),
          $calendarEvent = $el.data('calendarEvents'),
          ajaxUrl = $(".js-calendar").data("ajax-url");

        var toggleEvent = function () {
          $el.on('click', function () {

            var numberOfEvents = numberToWords($el.data("calendar-events"));
            numberOfEvents += ($el.data("calendar-events") == 1)? " Event " : " Events ";

            $(".js-event__tooltip__title").find("span").text( numberOfEvents );

            var $offset = $el.offset().top,
              $height = $el.outerHeight(),
              $scrollTop = app.$window.scrollTop(),
              $bar = $(".js-calendar__bar").outerHeight(),
              $header = $(".js-header").outerHeight(),
              $val = ($offset - $header - $bar) + $height + 20;

            if( $el.hasClass("has-event") || !$calendarEvent ) {

              module.closeToolTip();
              $toolTipContainer.addClass("is-show").css({ top: $val });

              $.ajax({
                url : ajaxUrl + "/ajax/get_calendar_day_events",
                type: "GET",
                data: {
                  year  : $(".js-calendar").data("year"),
                  month : $(".js-calendar").data("month"),
                  day   : $el.data("day"),
                },
                success: function(data) {

                  var $new_data = module.cleanUpJson(data);

                  module.bindTemplate($new_data);

                }
              });

            } else if( !$el.hasClass("has-event") || $calendarEvent ) {

              module.closeToolTip();

            }
          });
        }

        // app.$window.on('scroll', toggleEvent);
        app.$window.on("resize", toggleEvent);
        toggleEvent();
      });
    };

    var closeToolTip = function () {
      $(".js-event__tooltip__close").on("click", function () {
        module.closeToolTip();
      });
    };

    /***********************************
    * public application definition
    */

    module.cleanUpJson = function(data) {
      var $old_json = data;
      var $new_json = [];

      $new_json = {
        events: []
      };

      $old_json = JSON.parse( $old_json );

      for(var i = 0; i < $old_json.events.length; i++){
        $new_json.events.push({
          title: $old_json.events[i].title.decodeHTML(),
          thumbnail: $old_json.events[i].thumbnail,
          // tag: 'sub category',
          body: $old_json.events[i].body.decodeHTML(),
          date: 'Wednesday 22 July 2015',
          //outbound: 'www.google.com',
          //author: {
          //  name: '',
          //  url: ''
          //},
          //duration: '5',
          postType: 'event'
        })
      }

      return $new_json;
    }

    module.closeToolTip = function () {
      $('.js-event__tooltip').removeClass('is-show')
        .css({top: 'auto'});
      $('.js-event__tooltip__carousel').slick('unslick').children().remove();
    }

    module.bindEventTooltip = function () {
      $('.js-event__tooltip__carousel').livequery(function () {
        var $el = $(this);

        $el.slick({
          arrows: false,
          dots: true,
          infinite: false,
          slidesToShow: 4,
          slidesToScroll: 1,
          responsive: [
            {
              breakpoint: app.breakpoint.medium,
              settings: {
                slidesToShow: 3
              }
            },
            {
              breakpoint: app.breakpoint.small,
              // settings: 'unslick'
              settings: {
                slidesToShow: 1
              }
            }
          ]
        });
      });
    };

    module.bindTemplate = function (data) {
      var tmpl = $('#tmplEventToolTip').html(),
        $html = Mustache.to_html(tmpl, data);
      // Append data and reinit slick
      $('.js-event__tooltip__carousel').html($html)
        .slick('reinit');
    };

    /***********************************
    * global app declaration of events and methods
    */

    // module init method;
    // NOTE: important for initializing the module will be called dynamically
    module.init = function() {
      //module.bindEventTooltip();
      //showToolTipEvent();
      //closeToolTip();
    };

    return module;
  })(window, jQuery, window.App)
);
