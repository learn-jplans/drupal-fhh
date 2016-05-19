/*
 * Letter Parallax
 */

App.module.create(
  'letterParallax',
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


  /***********************************
  * global app declaration of events and methods
  */
  var letterParallaxInit = function() {
    $('.o-letter').livequery(function(e) {
      var $el = $(this);

      var letter = {
        top : $el.offset().top,
        left : $el.offset().left,
        width : $el.outerWidth(),
        height : $el.outerHeight()
      };

      $el.css("background-size", "110% 110%");

      if($el.hasClass('c-info-noimage')) { // info page
        $('.o-main').on("mousemove", function(e){
          parallaxMove(e, letter, $el);
        });
      } else { // default
        $el.on("mousemove", function(e){
          parallaxMove(e, letter, $el);
        });
      }
    });
  }

  var parallaxMove = function(e, letter, $obj) {

    var hitX = Math.abs( letter['left'] - e.pageX );
    var hitY = Math.abs( letter['top'] - e.pageY );

    var perX = ((hitX * 100) / letter['width']);
    var perY = ((hitY * 100) / letter['height']);

    $obj.css("background-position", perX + "% " + perY + "%");

  }

  var letterArticles = function () {

    var resizeLetter = function () {
      $('.o-letter--articles').livequery(function () {
        var $el = $(this),
          $width = $el.parent().outerWidth() / 6,
          $height = $el.parent().outerHeight();

        $el.css({'fontSize': $width + $height});
      });
    }

    app.$window.on('resize', resizeLetter);
    resizeLetter();
  };

  // module init method;
  // NOTE: important for initializing the module will be called dynamically
  module.init = function() {
    letterParallaxInit();
    letterArticles();
  };

  return module;
  })(window, jQuery, window.App)
);
