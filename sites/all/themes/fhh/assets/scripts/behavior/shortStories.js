App.module.create(
  'shortStories',
  (function(window, $, app) {
  'use strict';

  // define module object
  var module = {};

  /***********************************
  * private variables
  */

    //var $anchorSnackables = $('.js-snackable__link');


  /***********************************
  * private methods
  */


  /***********************************
  * public application definition
  */

  module.equalHeightStories = function() {
    var $el = $('.js-shortstories--breaker');

    if (app.$window.width() > app.breakpoint.small) {
      var maxHeight = 0;

      $el.find('.c-article__body').css({ 'height': '' });
      $el.find('.c-article__body').removeAttr("style");

      $el.find('.c-article__body').each(function(){
        maxHeight = ( maxHeight < $(this).height() )? $(this).height() : maxHeight;
      });

      $el.find('.c-article__body').css({ 'height': maxHeight });

    } else {
      $el.find('.c-article__body').css({ 'height': 'auto' });
    }
  };
  app.$window.on('resize', module.equalHeightStories);
  

  module.equalHeightStoriesLanding = function() {

    $('.c-breaker--stories').each(function(){
      var $el = $(this);

      if (app.$window.width() > app.breakpoint.small) {
        var maxHeight = 0;

        $el.find('.c-article__body').css({ 'height': '' });
        $el.find('.c-article__body').removeAttr("style");

        $el.find('.c-article__body').each(function(){
          maxHeight = ( maxHeight < $(this).height() )? $(this).height() : maxHeight;
        });

        $el.find('.c-article__body').css({ 'height': maxHeight });

      } else {
        $el.find('.c-article__body').css({ 'height': 'auto' });
      }

    });

  };
  app.$window.on('resize', module.equalHeightStoriesLanding);

  var shortStoriesLanding = function() {
    $('.c-breaker--stories').livequery(function () {
      module.equalHeightStoriesLanding();
    }).on('load', module.equalHeightStoriesLanding);
  };
  

  /***********************************
  * global app declaration of events and methods
  */

  // module init method;
  // NOTE: important for initializing the module will be called dynamically
  module.init = function() {
    module.equalHeightStories();
    shortStoriesLanding();
  };


  return module;
  })(window, jQuery, window.App)
);
