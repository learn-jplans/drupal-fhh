/*
 * Core JS component for this project
 * Everything will accessed through App JS object
 */

window.App = window.App || {};

window.App = (function (window, $, app) {
  'use strict';

  /***********************************
   * private variables
   */
  var isIE = !!navigator.userAgent.match(/MSIE/),
    ieVersion = 0,
    requestedUrls = [],
    lastScrollTop = 0,
    scrollDirection = '',
    breakpoint = {
      narrow: 0,
      small: 650,
      medium: 960,
      large: 1440
    };

  /***********************************
   * private methods
   */

  // detect scroll direction
  var detectDirection = function () {
    var st = window.pageYOffset;
    if (st > lastScrollTop) {
      scrollDirection = "down";
    } else {
      scrollDirection = "up";
    }
    lastScrollTop = st;
    return scrollDirection;
  };

  // breaker background image parallax
  var parallaxBreaker = function () {

    $('.c-breaker__parallaxImg').livequery(function () {
      var $el = $(this),
        offsetTop = $el.offset().top,
        height = $el.outerHeight();
      app.$window.on('scroll', function () {
        if ($el.isInViewport()) {
          var winHeight = app.$window.height() + height,
            deltaY = -(lastScrollTop - (offsetTop + height)),
            diffY = winHeight - deltaY,
            percentY = diffY / winHeight * 100;
          $el.css({
            'background-position': "50% " + (percentY) + "%"
          });
        }
      });
    });
  };

  var articleImageHover = function () {
    $('.c-article--tile').livequery(function () {
      var $el = $(this),
        $image = $el.find('.c-article__image'),
        $title = $el.find('.o-meta__title');

      $title.on('mouseenter', function () {
          $image.addClass('is-hover');
        })
        .on('mouseleave', function () {
          $image.removeClass('is-hover');
        });
    });

    $('.collection-item').livequery(function () {
      var $el = $(this),
        $image = $el.find('.article-thumbnail'),
        $title = $el.find('.article-title a');

      $title.on('mouseenter', function () {
          $image.addClass('is-hover');
        })
        .on('mouseleave', function () {
          $image.removeClass('is-hover');
        });
    });
  }

  var customScroll = function () {
    $('.js-custom-scrollbar').livequery(function () {
      var $el = $(this);

      $el.mCustomScrollbar({
        theme: 'fhh-theme',
        scrollInertia: 100,
        contentTouchScroll: 25,
        documentTouchScroll: false,
        keyboard: {
          enable: true,
          scrollType: "stepless"
        }
      });
    });
  }

  var autoEllipsis = function () {
    $('.ellipsis').livequery(function () {
      var $el = $(this);

      $el.dotdotdot({
        watch: "window",
        lastCharacter: {
          remove: [' ', ',', ';', '.', '!', '?', ':'],
        }
      });
    });
  };

  var ticking = false;
  var timerScroll = null;
  var scrollUpdate = function () {

    ticking = false;

    clearTimeout(timerScroll);

    timerScroll = setTimeout(function () {

      app.$window.trigger("EVENT_ON_SCROLL_END", [app.lastScrollY]);

    }, 100);

    app.$window.trigger("EVENT_ON_SCROLL", [app.lastScrollY]);

    detectDirection();

  };

  var requestTick = function () {

    if (!ticking) {

      window.requestAnimationFrame(scrollUpdate);
      ticking = true;

    }

  };

  var onScroll = function () {

    app.lastScrollY = window.pageYOffset;
    requestTick();

  };

  var onResize = debounce(function () {

    var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

    app.dims = {
      w: w,
      h: h,
      o: h > w ? "portrait" : "landscape"
    };

    app.$window.trigger("EVENT_ON_RESIZE", [app.dims]);

  }, 300);

  /***********************************
   * public application definition
   */

  app.$window = $(window);
  app.$html = $('html');
  app.$body = $('body');
  app.$doc = $(document);
  app.breakpoint = breakpoint;
  app.isRetina = window.devicePixelRatio ? window.devicePixelRatio > 1 : false;
  app.articleCards = null;
  app.adsCtr = 0;

  // get IE info and update
  if (isIE) {
    var ua = navigator.userAgent;
    var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    var rv = -1;
    if (re.exec(ua) != null) {
      rv = parseFloat(RegExp.$1);
    }
    ieVersion = rv;

    app.$html.addClass('ie');
    if (ieVersion < 9) {
      app.$html.addClass('lt-ie9');
    } else {
      if (ieVersion > 9) {
        app.$html.addClass('gt-ie9');
      } else {
        app.$html.addClass('ie9');
      }
    }
  } else {
    app.$html.addClass('not-ie');
  }

  if (!(window.ActiveXObject) && "ActiveXObject" in window) {
    app.$html.addClass('ie11');
  }

  // mobile safari
  if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
    app.$html.addClass('ios');
  }

  /***********************************
   * global app declaration of events and methods
   */
  app.$window.on("scroll", onScroll);
  app.$window.on("resize", onResize);

  // add ajax request
  app.request = function (options) {
    var self = this;

    var opts = $.extend({
      url: "",
      method: "POST",
      dataType: "json",
      noDuplicate: true,
      data: {}
    }, options);

    $.support.cors = true;
    // remove the trailing '/' character
    opts.url = opts.url.replace(/\/$/, '');

    var _request_url = opts.url + JSON.stringify(opts.data);
    if (opts.noDuplicate) {
      var _idx = requestedUrls.indexOf(_request_url);
      if (_idx >= 0) {
        // url request exists
        return false;
      }
    }

    requestedUrls.push(_request_url);

    return $.ajax({
      url: opts.url,
      method: opts.method,
      data: opts.data,
      dataType: opts.dataType,
      success: function (data, status, xhr) {
        // remove the requested url
        var _idx = requestedUrls.indexOf(_request_url);
        requestedUrls.splice(_idx, 1);

        if ($.isFunction(opts.success)) {
          opts.success.call(this, data, status, xhr);
        }
      },
      error: function (xhr, status, error) {
        var _idx = requestedUrls.indexOf(_request_url);
        requestedUrls.splice(_idx, 1);
        if ($.isFunction(opts.error)) {
          opts.error.call(this, xhr, status, error);
        }
      }
    });
  };

  app.disablePageScroll = function () {

    app.$body.addClass("disable-scroll");

  };

  app.enablePageScroll = function () {

    app.$body.removeClass("disable-scroll");

  };

  // module handler
  app.module = {};
  // module handler: modules in an observable array
  app.module.items = new ObservableArray([]);
  // define the the add event
  app.module.items.addEventListener("itemadded", function (e) {
    // check if there is an init method to call
    if (app[e.item]) {
      if (app[e.item].init) {
        if ($.isFunction(app[e.item].init) && !app[e.item].isLoaded) {
          app[e.item].init();
        }
      }
    }
    app[e.item].isLoaded = true;
  });
  // module handler : create a new module
  app.module.create = function (name, obj) {
    obj.isModule = true;
    obj.isLoaded = false;
    app[name] = obj;
    app.module.items.push(name);
  };

  // application init function
  app.init = function () {
    // initialize
    onResize();
    parallaxBreaker();
    articleImageHover();
    customScroll();
    autoEllipsis();
  };

  return app;

})(window, jQuery, window.App);

// call init function
window.App.init();

window.addEventListener('load', function () {
  if (FastClick) {
    FastClick.attach(document.body);
  }
}, false);