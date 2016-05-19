App.module.create(
  'tiles',
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

  module.tiles = function () {
    $('.js-tiles').livequery( function(e) {
      var $el = $(this);

      var equalHeightTiles = function() {
        if (app.$window.width() > app.breakpoint.small) {
          var maxHeight = 0;
          $el.find('.c-tile').removeAttr("style");

          $el.find('.c-tile').each(function(){
            maxHeight = ( maxHeight < $(this).outerHeight() )? $(this).outerHeight() : maxHeight;
          });

          $el.find('.c-tile').css({ height: maxHeight });

        } else {
          $el.find('.c-tile').css({ height: 'auto' });
        }
      };
      app.$window.on('resize', equalHeightTiles);
      equalHeightTiles();
    });
  }


  module.sidebarTiles = function () {
    $('.js-tiles--sidebar').livequery( function(e) {
      var $el = $(this);

      var equalHeightTiles = function() {
        if (app.$window.width() > app.breakpoint.small && app.$window.width() < app.breakpoint.medium) {
          var maxHeight = 0;
          $el.find('.js-tiles--sidebar__item').removeAttr("style");

          $el.find('.js-tiles--sidebar__item').each(function(){
            maxHeight = ( maxHeight < $(this).outerHeight() )? $(this).outerHeight() : maxHeight;
          });

          $el.find('.js-tiles--sidebar__item').css({ height: maxHeight });

        } else {
          $el.find('.js-tiles--sidebar__item').css({ height: 'auto' });
        }
      };
      app.$window.on('resize', equalHeightTiles);
      equalHeightTiles();
    });
  }

  /***********************************
  * global app declaration of events and methods
  */

  // module init method;
  // NOTE: important for initializing the module will be called dynamically
  module.init = function() {
    module.tiles();
    module.sidebarTiles();
  };


  return module;
  })(window, jQuery, window.App)
);
