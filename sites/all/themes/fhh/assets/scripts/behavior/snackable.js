/* global App, window, jQuery */
App.module.create(
  "snackable",
  (function(window, $, app) {
    "use strict";

    // define module object
    var module = {};

    /***********************************
     * private variables
     */

    var SHOW_THRESHOLD = 500;
    var SHOW_TIME = 4000;
    var SHOW_AGAIN_TIME = 4000;
    var HAS_SHOWN = false;

    var hasHero = false;
    var isOpen = false;
    var isViewingArticle = false;

    var autoCloseTimer = null;

    var $container, $content, $bar, $carousel, $articleCloseBtn, $closeSnacks, $inbox;

    var carouselHeight = 0;

     /***********************************
     * private methods
     */

    function setup() {

      /*if (window.sessionStorage && window.sessionStorage.getItem('FHH_HAS_SEEN_SNACKABLES')) {

        HAS_SHOWN = false;

      } else {
        try {
          window.sessionStorage.setItem('FHH_HAS_SEEN_SNACKABLES', 1);
          return true;
        } catch (e) {
          return false;
        }

      }*/

      hasHero = !!app.$body.find(".o-section--hero").length;

      cacheSelectors();
      getDims();
      bindEvents();

    }

    function getDims() {

      carouselHeight = $carousel.outerHeight();

    }

    function cacheSelectors() {

      $container = app.$body.find("[data-snackable-menu]");
      $content = $container.find("[data-snackable-content]");
      $bar = app.$body.find("[data-snackable-bar]");
      $carousel = $content.find("[data-snackable-carousel]");
      $articleCloseBtn = $content.find("[data-snackable-close-article]");
      $closeSnacks = $content.find("[data-close-snackables]");
      $inbox = $('.js-social-nav__close');
    }

    function showSnackables() {

      startTimer();

      isOpen = true;
      HAS_SHOWN = true;

      $container.addClass("show");


    }

    function hideSnackables() {

      var delay = isViewingArticle ? 300 : 0;

      if (isViewingArticle) {

        closeArticle();
        resetContentScroll();

      }

      setTimeout(function() {

        isOpen = false;
        $container.removeClass("show");

      }, delay);

    }

    function startTimer() {

      var timerDuration = HAS_SHOWN ? SHOW_AGAIN_TIME : SHOW_TIME;

      // always stop first
      stopTimer();

      // only auto-close if user has mouse input
      if (!Modernizr.touch) {

        autoCloseTimer = setTimeout(hideSnackables ,timerDuration);

      }

    }

    function stopTimer() {

      clearTimeout(autoCloseTimer);

    }

    function bindEvents() {

      app.$window.on("EVENT_ON_SCROLL", onScroll);
      app.$window.on("EVENT_ON_RESIZE", onResize);
      app.$window.on("EVENT_SHOW_SNACKABLE_ARTICLE", onShowSnackableArticle);

      $content.on("mouseenter", onMouseEnter);
      $content.on("mousemove", onMouseMove);
      $content.on("mouseleave", onMouseLeave);
      $content.on("scroll", onContentScroll);

      $bar.on("click", onBarClick);

      $container.on("click", ".c-snackablecontent--close", onCloseArticleClick);
      //$container.on("click", "[data-close-snackables]", onCloseSnackablesClick);
      $closeSnacks.on("click", onCloseSnackablesClick);

    }

    function onScroll(e, pageY) {

      var offset = (hasHero && app.dims) ? app.dims.h : 0;

      if ((pageY > (SHOW_THRESHOLD + offset)) && !HAS_SHOWN) {

        showSnackables();
        $.cookie('fhh_cookies_shackables', 1, { expires: 7, path: '/' });

      }

    }

    function onResize() {

      getDims();

    }

    function onShowSnackableArticle() {

      isViewingArticle = true;

      stopTimer();

    }

    function onMouseEnter() {

      stopTimer();

    }

    function onMouseMove() {

      stopTimer();

    }

    function onMouseLeave() {

      if (!isViewingArticle) {

        startTimer();

      }

    }

    function onContentScroll() {

      var classChange = $content.scrollTop() > carouselHeight ? "addClass" : "removeClass";

      /*$articleCloseBtn[ classChange ]("sticky");*/

    }

    function onBarClick() {

      if (!isOpen) {
        $('a.closelogin').click();
        closeInbox();
        closeSearch();
        showSnackables();

        $container.removeClass('hidden');



      } else {

        hideSnackables();

      }

    }

    function closeInbox() {
      $inbox.click();
    }
    function closeSearch() {
      if($('.openSearch').hasClass('open')){
        $('.c-search-close').click();
      }
    }

    function onCloseArticleClick() {

      closeArticle();
      resetContentScroll();

    }

    function onCloseSnackablesClick() {

      hideSnackables();

      $container.addClass('hidden');

      //$.cookie('fhh_cookies_shackables', 1, { expires: 7, path: '/' });

    }

    function closeArticle() {

      // TEMP - animate this
      $container.find("#c-snackable-content").animate({ opacity: '0' },1000);
      $container.find(".c-tile.active").removeClass("active");
      $container.find(".c-snackable-home").removeClass("loaded");
      setTimeout(function(){ $container.find("#c-snackable-content").html(''); }, 1500);
      isViewingArticle = false;

      startTimer();
      app.enablePageScroll();

    }

    function resetContentScroll() {

      // @TODO - animate this with callback
      $content.scrollTo(0, 0);

    }

    /***********************************
     * public application definition
     */

    module.closeSnackable = function() {
      hideSnackables();
      $container.find(".c-snackable-home").removeAttr('style');
    };

    /***********************************
     * global app declaration of events and methods
     */

    // module init method;
    // NOTE: important for initializing the module will be called dynamically
    module.init = function() {

      setup();

    };

    return module;
  })(window, jQuery, window.App)
);
