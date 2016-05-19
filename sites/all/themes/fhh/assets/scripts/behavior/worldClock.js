
/*
 * Card
 */

App.module.create(
  'worldClock',
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
  var bindWorldClock = function () {
    $('.js-carousel--clock').livequery(function(){
      var $el = $(this);
      var $clocks = $el.find('.js-clock');

      $clocks.each(function(){
        var time = getWorldClockTime( $(this).data("gmt") );

        // hour
        var hour = time["hour"];
        if( (hour < 5) || (hour > 17) ) {
          $(this).find('.c-clock__body').addClass("is_pm");
        }
        if( hour > 12 ){
          hour = hour - 12;
        }

        var hourDeg = (360 / 12) * hour;

        // minutes
        var min = time["min"];
        var minDeg = (360 / 60) * min;

        // seconds
        var sec = time["secs"];

        $(this).find('.c-clock__hand--hour').css({ 'transform' : 'rotate(' + hourDeg + 'deg)' });
        $(this).find('.c-clock__hand--min').css({ 'transform' : 'rotate(' + minDeg + 'deg)' });

        setClockTime(hour, min, sec, $(this));
      });
    });
  };

  var setClockTime = function(hour, min, sec, $obj){
    var timeObject = new Array();

    var moveHands = function(){
      sec++;

      $obj.find('.c-clock__hand--sec .c-clock__timer').css({ 'transform' : 'rotate(' + sec * 6 + 'deg)' });

      if( sec === 60 ) { sec = 0; }

    }

    window.setInterval(moveHands, 1000);
  };

  var getWorldClockTime = function(zone){
    var dst = 0;
    var time = new Date();
    var gmtMS = time.getTime() + (time.getTimezoneOffset() * 60000);
    var gmtTime = new Date(gmtMS);
    var day = gmtTime.getDate();
    var month = gmtTime.getMonth();
    var year = gmtTime.getYear();
    var timeObject = new Array();

    if(year < 1000){
      year += 1900;
    }

    var monthArray = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
    var monthDays = new Array("31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31");

    if (year%4 == 0){
      monthDays = new Array("31", "29", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31");
    }

    if(year%100 == 0 && year%400 != 0){
      monthDays = new Array("31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31");
    }

    var hr = gmtTime.getHours() + zone;
    var min = gmtTime.getMinutes();
    var sec = gmtTime.getSeconds();

    if (hr >= 24){
      hr = hr-24;
      day -= -1;
    }

    if (hr < 0){
      hr -= -24;
      day -= 1;
    }

    if (day <= 0){
      if (month == 0){
    	  month = 11;
    	  year -= 1;
    	} else {
    	  month = month -1;
    	}

      day = monthDays[month];
    }

    if(day > monthDays[month]){
    	day = 1;
    	if(month == 11){
    	  month = 0;
    	  year -= -1;
    	} else {
    	  month -= -1;
    	}
    }

    if (dst == 1){
      hr -= -1;

      if (hr >= 24){
        hr = hr-24;
        day -= -1;
      }

      if(day > monthDays[month]){
        day = 1;

        if(month == 11){
          month = 0;
          year -= -1;
        } else {
          month -= -1;
        }
    	}

      timeObject = {
        'hour': hr,
        'min': min,
        'secs': sec,
      };

      return timeObject;

    } else {

      timeObject = {
        'hour': hr,
        'min': min,
        'secs': sec
      };

      return timeObject;
    }
  };

  /***********************************
  * global app declaration of events and methods
  */

  // module init method;
  // NOTE: important for initializing the module will be called dynamically
  module.init = function() {
    bindWorldClock();
  };

  return module;
  })(window, jQuery, window.App)
);
