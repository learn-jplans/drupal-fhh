
/*
 * Dropdown
 */

App.module.create(
  'dropdown',
  (function(window, $, app) {
  'use strict';

  // define module object
  var module = {};

  /***********************************
  * private variables
  */
  var $dropdown = $('.js-dropdown'),
    $landing = $('.js-header--landing'),
    $landingShortStories = $('.js-header--landing-stories');

  /***********************************
  * private methods
  */


  /***********************************
  * public application definition
  */

  // close dropdown
  // remove overlay
  module.closeDropdownOverlay = function () {
    $('.sort-container').removeAttr('style');
    $dropdown.removeClass('is-dropdown--active');
    $('.js-dropdown-overlay').remove();
    if(is_iOS) {
      $('html,body').removeClass('u-no-scroll');
      $('section, footer').removeAttr('style');
    }
  }

  // open dropdown
  // append overlay
  module.openDropdownOverlay = function () {
    $dropdown.addClass('is-dropdown--active');
    $('.js-main').append('<div class="u-dropdown-overlay js-dropdown-overlay" />');
  }

  module.bindDropdown = function () {
    $('.js-dropdown').livequery(function () {
      var $el = $(this);
      var currentPositionx = 0;
      var $el = $(this),
        $toggler = $el.find('.js-dropdown__value'),
        $close = $el.find('.js-dropdown__cancel'),
        $product = $el.hasClass('c-dropdown--product'),
        $sidebar = $('.js-sidebar');

      $toggler.on('click', function () {

        if ( $el.hasClass('is-dropdown--active') ) {
          // module.closeDropdownOverlay();
          if($el.parent('.c-dropdown-container').hasClass('js-header--landing-stories') && is_iOS){
              $('html,body').removeClass('u-no-scroll');
              $('section, footer').removeAttr('style');
              $(window).scrollTo(currentPositionx);
          }

          $el.removeClass('is-dropdown--active');
          $('.js-sidebar').removeClass('remove-transform');
          $('.js-dropdown-overlay').remove();
          $('.sort-container').removeAttr('style');

        } else {

          $('.js-sidebar').addClass('remove-transform');
          $('.sort-container').css({zIndex: '4', opacity: '0'});
          $('.sort-container,.sortbox, .sortvalue').removeClass('opened');
          // module.openDropdownOverlay();
          if($el.parent('.c-dropdown-container').hasClass('js-header--landing-stories') && is_iOS){
            $('html,body').addClass('u-no-scroll');
            $('section, footer').css({opacity: '0'});
          }
          if(is_iOS) {
            setTimeout(function() { $el.addClass('is-dropdown--active');},500);
          } else {
            $el.addClass('is-dropdown--active');
          }

          if ($product) {
            $sidebar.addClass('remove-transform');
            setTimeout(function () {
              $('.js-main').append('<div class="u-dropdown-overlay js-dropdown-overlay" />');
            }, 205);
          } else {
            $('.js-main').append('<div class="u-dropdown-overlay js-dropdown-overlay" />');
          }

        }
        currentPositionx = window.pageYOffset;
      });

      // close button
      $close.on('click', function () {
        module.closeDropdownOverlay();
      });

    });
  };

  // Dropdown fix header
  var bindLandingHeader = function () {

    if (!$landing || $landing.length < 1) return false;

    var $offsetY = $landing.offset().top,
      $scrollTop = app.$window.scrollTop(),
      $headerHeight = $('.js-header').height(),
      $trendingOffset = $(".o-section--trending").offset().top,
      $trendingHeight = $trendingOffset + $(".o-section--trending").outerHeight();
      $headerHeight = $('.js-header').height();
    var landingHeaderFixed = function () {

      var $scrollTop = app.$window.scrollTop();
      var $activeDropdown = ( $dropdown.hasClass('is-dropdown--active') )? 251 : 0;

      if (($scrollTop + $headerHeight) > $offsetY && !$landing.hasClass('is-dropdown--fixed')) {
        $landing.addClass('is-dropdown--fixed');
      } else if (($scrollTop + $headerHeight) < $offsetY && $landing.hasClass('is-dropdown--fixed')) {
        $landing.removeClass('is-dropdown--fixed');
      }

      if (($scrollTop + $headerHeight + 175 + $activeDropdown) > $trendingOffset && !$landing.hasClass('is-dropdown--fixed--over')) {
        module.closeDropdownOverlay();
      }

      if (($scrollTop + $headerHeight + 550) > $trendingHeight && !$landing.hasClass('is-dropdown--fixed--over')) {
        $landing.addClass('is-dropdown--fixed--over');
      } else if (($scrollTop + $headerHeight + 550) < $trendingHeight && $landing.hasClass('is-dropdown--fixed--over')) {
        $landing.removeClass('is-dropdown--fixed--over');
      }
    };

    if ( Modernizr.touch ) {
      app.$window.on('touchmove', landingHeaderFixed);
    } else {
      app.$window.on('EVENT_ON_SCROLL', landingHeaderFixed);
    }
    app.$window.on('EVENT_ON_RESIZE', landingHeaderFixed);

    landingHeaderFixed();
  };

  var bindShortStoriesHeader = function () {
    if (!$landingShortStories || $landingShortStories.length < 1) return false;

    var $offsetY = $landingShortStories.offset().top,
      $headerHeight = $('.js-header').height(),
      $trendingOffset = $(".o-section--trending").offset().top,
      $trendingHeight = $trendingOffset + $(".o-section--trending").outerHeight();

    // fix short stories dropdown filter
    var shortStoriesHeaderFixed = function () {

      $landingShortStories.addClass('is-dropdown--fixed');

      var $scrollTop = app.$window.scrollTop(),
          $hideDropdown = $('.js-main').outerHeight() + $headerHeight - 650,
          $activeDropdown = ( $landingShortStories.find('.js-dropdown').hasClass('is-dropdown--active') )? 425 : 0;

      if (($scrollTop + $headerHeight + 175 + $activeDropdown) > $trendingOffset && !$landingShortStories.hasClass('is-dropdown--fixed--over')) {
        module.closeDropdownOverlay();
      }

      if (($scrollTop + $headerHeight + 550) > $trendingHeight && !$landingShortStories.hasClass('is-dropdown--fixed--over')) {
        $landingShortStories.addClass('is-dropdown--fixed--over');
      } else if (($scrollTop + $headerHeight + 550) < $trendingHeight && $landingShortStories.hasClass('is-dropdown--fixed--over')) {
        $landingShortStories.removeClass('is-dropdown--fixed--over');
      }

      if (($scrollTop + $headerHeight) > $hideDropdown && !$landingShortStories.hasClass('is-hidden')) {
        $landingShortStories.addClass('is-hidden');
      } else if (($scrollTop + $headerHeight) < $hideDropdown && $landingShortStories.hasClass('is-hidden')) {
        $landingShortStories.removeClass('is-hidden');
      }
    };

    if ( Modernizr.touch ) {
      app.$window.on('touchmove', shortStoriesHeaderFixed);
    } else {
      app.$window.on('EVENT_ON_SCROLL', shortStoriesHeaderFixed);
    }
    app.$window.on('EVENT_ON_RESIZE', shortStoriesHeaderFixed);

    shortStoriesHeaderFixed();
  };

  var filterClear = function () {
    $('.o-checkbox').livequery(function() {
      // $('.o-checkbox').removeAttr('checked');
      var $el = $(this),
        $clear = $('.js-filter__clear');

      $clear.on('click', function () {
        $el.removeAttr('checked');
      });
    });

  };

  var bindSortDrowdown = function() {
    //sort dropdown
    $('.js-short--stories').livequery(function() {
      var $el = $(this);

      $el.on('click', function() {
        if ( $el.hasClass('opened') ) {
          $el.addClass('opened');
          $('.js-main').append('<div class="u-dropdown-overlay js-dropdown-overlay" />');
        } else {
          $el.removeClass('opened');
          $('.js-dropdown-overlay').remove();
        }
      });

    });

  }

  // search brands
  $('.c-autosuggest input').on('keyup', function() {
    var value = new RegExp($(this).val(), 'i');
    $('.c-dropdown__list li').each(function() {
      $(this).hide();
      var label = $(this).children('div').children('.o-label').text();
      if (label.match(value) != null) {
        $(this).show();
      }
    });
  });


  /***********************************
  * global app declaration of events and methods
  */

  // module init method;
  // NOTE: important for initializing the module will be called dynamically
  module.init = function() {
    browserDetect.init();
    module.bindDropdown();
    bindLandingHeader();
    bindShortStoriesHeader();
    filterClear();
    bindSortDrowdown();
  };


  return module;
  })(window, jQuery, window.App)
);
