
/*
 * Timeline
 */

App.module.create(
  'timeline',
  (function(window, $, app) {
  'use strict';

  // define module object
  var module = {};

  /***********************************
  * private variables
  */

  var $progress, $body, $header;


  /***********************************
  * private methods
  */

  function cacheSelectors() {

    $progress = $(".js-timeline").find(".js-timeline__progress");
    $body = $(".js-body");
    $header = $(".js-header");

  }


  /***********************************
  * public application definition
  */

  var bindTimeline = function () {

      var pageScrolled = app.lastScrollY;
      var windowHeight = app.dims ? app.dims.h : app.$window.height();

      var headerHeight = $header.outerHeight(),
        bodyHeight = $body.outerHeight() - (windowHeight - headerHeight),
        pageHeight = bodyHeight;

      // Progress bar on article pages
      if($(".js-section-article.is-active").length) {
        var $activeArticle = $('.js-section-article.is-active'),
            articleStart   = $activeArticle.offset().top  - headerHeight,
            articleEnd     = $activeArticle.offset().top + $activeArticle.outerHeight() - windowHeight,
            articleHeight  = articleEnd - articleStart + $activeArticle.next().outerHeight();

        pageScrolled  = app.$window.scrollTop() - articleStart;
        pageHeight    = articleHeight;
      }

      var $value = (pageScrolled / pageHeight) * 100;
      // console.log("article height: "+pageHeight+" scrolled: "+pageScrolled+" progress value: "+value+"%");

      $progress.attr('value', $value);

  };



  /***********************************
  * global app declaration of events and methods
  */

  // module init method;
  // NOTE: important for initializing the module will be called dynamically
  module.init = function() {

    cacheSelectors();

    app.$window.on("EVENT_ON_RESIZE", bindTimeline);
    app.$window.on("EVENT_ON_SCROLL", bindTimeline);

    bindTimeline();

  };


  return module;
  })(window, jQuery, window.App)
);
