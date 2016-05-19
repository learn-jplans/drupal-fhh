
/*
 * Sidebar
 */

App.module.create(
  'sidebar',
  (function(window, $, app) {
  'use strict';

  // define module object
  var module = {};

  /***********************************
  * private variables
  */

  var $article, $articleHead, $articleHero, $articleMain;

  /***********************************
  * private methods
  */


  /***********************************
  * public application definition
  */

  module.sidebarArticle = function () {
    $('.js-sidebar').each(function () {
      var $el = $(this),
        $article = $el.siblings('.js-article'),
        $headerHeight = $('.js-header').outerHeight(),
        $articleHead = $article.find('.js-article__head'),
        $articleMain = $article.find('.js-article__main');

      if ($el.length === 0 || $articleMain.length === 0) return false;

      var $sidebarPos = $articleHead.outerHeight(),
      $offsetY = $articleHead.offset().top,
      $offsetX = $articleMain.offset().left;

      if (app.$window.width() >= app.breakpoint.medium) {
        $el.css({
          'top' : $sidebarPos - 30,
          'left' : $offsetX,
        }).show();
      } else {
        $el.css({
          'top': '0',
          'left': '0'
        });
        $articleMain.css('height','auto');
      }


      var adjustMainContent = function () {
        if (app.$window.width() >= app.breakpoint.medium) {
          if ($el.outerHeight() >= $articleMain.outerHeight()) {
            $articleMain.css({ 'height': $el.outerHeight() });
          } else {
            $articleMain.css({ 'height': 'auto' });
          }
        }
      }
      adjustMainContent();

    });
  };

  var bindSidebarArticle = function () {
    app.$window.on('resize', module.sidebarArticle);
    module.sidebarArticle();
  };


  module.sidebarEvent = function () {
    var $el = $('.js-event-sidebar'),
      $articleMain = $el.parent('.js-article__main');

    if ($el.length === 0 || $articleMain.length === 0) return false;

    var $height = $el.outerHeight(),
        $articleMainHeight = $articleMain.outerHeight();

    var adjustMainContentEvent = function () {
      if ($height > $articleMainHeight) {
        $articleMain.css('height', $height);
      } else {
        $articleMain.css('height', 'auto');
      }
    }

    adjustMainContentEvent();
  };

  var bindSidebarEvent = function () {
    app.$window.one('EVENT_ON_SCROLL', module.sidebarEvent);
    app.$window.on('EVENT_ON_RESIZE', module.sidebarEvent);
    module.sidebarEvent();
  };
  /***********************************
  * global app declaration of events and methods
  */

  // module init method;
  // NOTE: important for initializing the module will be called dynamically
  module.init = function() {
    bindSidebarArticle();
    bindSidebarEvent();
  };


  return module;
  })(window, jQuery, window.App)
);
