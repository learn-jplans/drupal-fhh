/*
 * Navigation
 */

App.module.create(
  'nav',
  (function(window, $, app) {
    'use strict';

    // define module object
    var module = {};

    /***********************************
     * private variables
     */
    var $body = $('.js-body'),
      $header = $('.js-header'),
      $main = $('.js-main'),
      $burger = $('.js-burger'),
      $hero = $('.js-hero'),
      $search = $('.js-search'),
      $dropdown = $('.js-nav--dropdown'),
      $social = $('.js-nav--social'),
      $overlay = $('.js-overlay'),
      $timeline = $('.js-timeline'),
      $footer = $('.js-footer'),
      $lang = $('.js-lang__dropdown'),
      $langDropDown = $('.js-lang__dropdown-choices'),
      $burgerLang = $('.js-lang__burger'),
      $burgerLangDropDown = $('.js-lang__burger-choices'),
      currentBurgerPageYOffset = 0;

    /***********************************
     * private methods
     */

    /***********************************
     * public application definition
     */
    var omainIndex = function() {
      $('.o-main.js-main').livequery(function () {
        var $el = $(this);
        if($el.find('.c-snackable-home,.c-snackable').length) {
          $el.css({zIndex: 'auto'});
        }
      });
    };

    var bindStickyNav = function () {

      var scrollTop = app.$window.scrollTop(),
        offsetY = $body.offset().top,
        // $mainY = $main.offset().top,
        $headerHeight = $header.outerHeight();
        // $total = $mainY - $headerHeight;

      if( Modernizr.touch ){ // if viewed on a touch device

        if (!$hero.length > 0) {
          $header.addClass('is-header--fixed');
          $main.addClass('o-main--padding');
        }

        var bindStickyNavEvent = function () {

          scrollTop = app.$window.scrollTop();
          $headerHeight = $header.outerHeight();

          if (scrollTop > offsetY && !$header.hasClass('is-header--fixed')) {
            $header.addClass('is-header--fixed');
            if($hero.length > 0) { // home page
              $header.siblings('.js-main').css('padding-top', $header.outerHeight());
            }
          } else if (scrollTop <= offsetY && $header.hasClass('is-header--fixed')) {
            $header.removeClass('is-header--fixed');
            $header.siblings('.js-main').css('padding-top', 0);

            if (!$hero.length > 0) { $header.addClass('is-header--fixed'); }
            // $main.removeClass('is-main--move');
          }
        };

        app.$window.on('EVENT_ON_SCROLL', bindStickyNavEvent);
        app.$window.on('EVENT_ON_RESIZE', bindStickyNavEvent);

        bindStickyNavEvent();

      } else {

        var sticky = new Waypoint.Sticky({
          element: $('.js-header'),
          wrapper: '<div class="sticky-wrapper js-header-parent" />',
          handler: function () {
            $main.css('padding-top', 0);
          }
        });

      }

    };


    var bindBurgerNav = function () {
      $('.js-burger-toggle').livequery(function () {
        var $el = $(this);

        $el.on('click', function (e) {
          var xxx = $('.js-body ').offset().top;
          var animTarget = (typeof browserDetect === "undefined")? "html, body" : browserDetect.scrollTarget;
          e.preventDefault();
          if( $hero.outerHeight() > app.$window.scrollTop() ) {
            $(animTarget).animate({
              scrollTop : $('.js-header').offset().top
            }, 1000, function () {
              showBurgerNav();
            });
          } else {
            showBurgerNav();
          }

          /*if( $hero.outerHeight() > app.$window.scrollTop() ) {
            $("body").animate({
              scrollTop : $hero.outerHeight()
            }, 500, function(){
              showBurgerNav();
            });
          } else {
            showBurgerNav();
          }*/
        });

        var showBurgerNav = function(){

          if($('.openSearch').hasClass('open')) {
            $('.openSearch').click();
          }

          if($('.login-register--container').hasClass('open-login') || $('.login-register--container').hasClass('open-login-home')) {
            $('.login-register--container').css({display: 'none'});
            app.forgotPassword.closeForgotPasswordModal();
            app.loginRegister.closeLoginRegisterModal();
          }

          if($('.accounts-container').hasClass('show') || $('.accounts-container').hasClass('show-home')) {
            $('.accounts-container').css({display: 'none'});
            app.myaccounts.closeAccountsModal();
          }

          if ( $el.hasClass('o-icon--close') && $burger.hasClass('c-burger--active') ) {
            module.closeBurgerNav();
          } else {
            currentBurgerPageYOffset = window.pageYOffset;
            module.closeSocialNav();
            app.$body.addClass('u-no-scroll');
            $el.addClass('o-icon--close');
            $header.addClass('has-open-nav');
            $burger.addClass('c-burger--active');
            $dropdown.addClass('c-nav--hidden');
            $('.js-menu__item').removeClass('is-active');
            $timeline.addClass('is-hidden');

            app.snackable.closeSnackable();
            /*$('.c-snackable').css({opacity: '0'});
            $('.c-snackable-home').css({opacity: '0'});*/

            $header.addClass('is-header--force-fixed');
            setTimeout(function () {
              $overlay.addClass('o-overlay--menu');
            }, 150);
          }
        };
      });
    };

    var bindDropdownNav = function () {
      $('.js-nav--dropdown').livequery(function () {
        var $el = $(this),
          $menu = $el.find('.js-menu'),
          $items = $menu.find('.js-menu__item');

        $items.each(function() {
          var $item = $(this),
            $link = $item.find('a').first(),
            $sub = $item.find('.js-menu__sub');

          $link.on('click', function (e) {

            if($('.login-register--container').hasClass('open-login') || $('.login-register--container').hasClass('open-login-home')) {
              $('.login-register--container').css({display: 'none'});
              app.forgotPassword.closeForgotPasswordModal();
              app.loginRegister.closeLoginRegisterModal();
            }

            if($('.accounts-container').hasClass('show') || $('.accounts-container').hasClass('show-home')) {
              $('.accounts-container').css({display: 'none'});
              app.myaccounts.closeAccountsModal();
            }


            if(!$item.hasClass('js-disabled')) {
              e.preventDefault();
            } else {
              return;
            }
            /*Close Search*/
            if($('.openSearch').hasClass('open')) {
              $search.animate({opacity: '0'},200);
              setTimeout(function(){
                $search.removeAttr('style');
                $('.c-search-close').click();
              },800);
            }

            if (!$item.hasClass('is-active')) {
              if ($('.js-nav--social__toggle').hasClass('is-active')) module.closeSocialNav();

              $items.removeClass('is-active');
              $item.addClass('is-active');
              $overlay.addClass('o-overlay--menu');
              $('.c-snackable-home').css({opacity: '0'});
              setTimeout(function(){ app.snackable.closeSnackable(); },800 );
            } else {
              module.closeDropdownNav();
            }
          });
        });

        // close dropdown on overlay
        $('.js-overlay').on('click', function () {
          var $el = $(this);

          if ($el.hasClass('o-overlay--menu') && $items.hasClass('is-active')) {
            module.closeDropdownNav();
          }
        });

        // close dropdown on overlay
        $('.js-nav--dropdown__close').on('click', function () {
          var $el = $(this);

          if ($items.hasClass('is-active')) {
            module.closeDropdownNav();
          }
        });
      });
    };


    var bindNavSocial = function () {

      $('.js-nav--social__toggle').livequery(function () {
        var $el = $(this);

        var navToggle = function () {
          // $social.css('top', -$social.outerHeight());

          $el.on('click', function () {
            $('.js-search').animate({ opacity: '0'}, 10,function(){
              setTimeout(function(){
                $('.js-search').removeAttr('style');
                $('.c-search-close').click();
              },500)
            });

            if($('.login-register--container').hasClass('open-login') || $('.login-register--container').hasClass('open-login-home')) {
              $('.login-register--container').css({display: 'none'});
              app.forgotPassword.closeForgotPasswordModal();
              app.loginRegister.closeLoginRegisterModal();
            }

            if($('.accounts-container').hasClass('show') || $('.accounts-container').hasClass('show-home')) {
              $('.accounts-container').css({display: 'none'});
              app.myaccounts.closeAccountsModal();
            }


            var $height = $social.outerHeight();
            var animTarget = (typeof browserDetect === "undefined")? "html, body" : browserDetect.scrollTarget;

            var followUsToggle = function(){
              $header.addClass('u-header-transition');

              if ( !$search.hasClass('scrollon') ) {
                if ( $hero.outerHeight() > app.$window.scrollTop() ) return false;
              }

              if ( !$el.hasClass('is-active') ) {

                if ($burger.hasClass('c-burger--active')) module.closeBurgerNav();
                if ($('.js-nav--dropdown .js-menu').find('.js-menu__item').hasClass('is-active')) module.closeDropdownNav();

                $('.js-nav--social__toggle').removeClass('is-active');
                $el.addClass('is-active');
                $social.addClass('is-active');
                $header.css('transform', 'translateY(' + $height + 'px)').addClass("super-stuck");
                $('.c-snackable-home').css({opacity: '0'});
                setTimeout(function(){ app.snackable.closeSnackable(); },800 );

                $('<div class="social-nav-wrapper js-social-nav__close" />').insertAfter($social);

              } else {
                module.closeSocialNav();
              }
            }

            if ($('.openSearch').hasClass('open')) {
              $('.js-search').animate({ opacity: '0'}, 10,function(){
                setTimeout(function(){
                  $('.js-search').removeAttr('style');
                  $('.c-search-close').click();
                },500)
              });
            }

            if ( $hero.outerHeight() > app.$window.scrollTop() ) {
              $(animTarget).animate({ scrollTop : app.$window.outerHeight() }, 500, followUsToggle);
            } else {
              followUsToggle();
            }
          });
        }

        navToggle();
      });

      $('.js-social-nav__close').livequery(function () {
        var $el = $(this);

        $el.on('click', function () {
          module.closeSocialNav()
        });
      });

    };

    // close burger navigation
    module.closeBurgerNav = function () {
      $overlay.removeClass('o-overlay--menu');
      app.$body.removeClass('u-no-scroll');
      $(window).scrollTo(currentBurgerPageYOffset);
      $('.js-burger-toggle').removeClass('o-icon--close');
      $header.removeClass('has-open-nav');
      $header.removeClass('is-header--force-fixed');
      $burger.removeClass('c-burger--active');
      $dropdown.removeClass('c-nav--hidden');
      $timeline.removeClass('is-hidden');
      $('.js-accordion__item').removeClass('is-accordion--active');
    };

    // close dropdown function
    module.closeDropdownNav = function () {
      $('.js-nav--dropdown .js-menu').find('.js-menu__item').removeClass('is-active');
      $overlay.removeClass('o-overlay--menu');
      $('.c-snackable-home').css({opacity: '1'});
    }

    // close social navigation
    module.closeSocialNav = function () {
      $('.js-nav--social__toggle').removeClass('is-active');
      $social.removeClass('is-active');
      $header.css('transform', 'translateY(0)').removeClass("super-stuck");

      $('.c-snackable').css({ opacity: '1' });
      $('.c-snackable-home').css({ opacity: '1' });
      $('.social-nav-wrapper').remove();
    };

    var bindFooterNav = function () {
      $('.js-footer').livequery(function () {
        var $el = $(this);

        var bindFooterNavEvent = function(e, pageY){
          var windowWidth = app.dims ? app.dims.w : app.$window.width(),
              $height = $el.outerHeight();

          if (windowWidth > app.breakpoint.medium) {
            if($body.hasClass('content-loaded')) {
              $body.css({ 'paddingBottom': $height });
            }
          } else {
            $body.css({
              'position': 'relative',
              'paddingBottom': 0
            });
          }

          if (pageY > $hero.outerHeight() + $main.height() - app.$window.height() ) {
            if($body.hasClass('content-loaded')) {
              $footer.addClass('is-visible');
            }
          } else {
            if(!$footer.hasClass('is-footer--move')) {
              $footer.removeClass('is-visible');
            }
          }
        }

        if( ! $body.hasClass('page-unsubscribe') ) {

          app.$window.on("EVENT_ON_SCROLL_END", bindFooterNavEvent);

          bindFooterNavEvent();

        }
      });
    }

    var bindLangSwitcher = function() {
      $lang.livequery(function() {
        var $el = $(this);

        var bindLangSwitcherEvent = function() {
            if($langDropDown.hasClass('is-lang__active')) {
              $langDropDown.removeClass('is-lang__active');
            } else {
              $langDropDown.addClass('is-lang__active');
            }
        }

        $el.on('click', function() {
          bindLangSwitcherEvent();
        });
      });

      $burgerLang.livequery(function() {
        var $el = $(this);

        var bindBurgerLangSwitcherEvent = function() {
            if($burgerLangDropDown.hasClass('is-lang__active')) {
              $burgerLangDropDown.removeClass('is-lang__active');
            } else {
              $burgerLangDropDown.addClass('is-lang__active');
            }
        }

        $el.on('click', function() {
          bindBurgerLangSwitcherEvent();
        });
      });
    }

    var navigationDate = function() {
      var currentDate = new Date(),
          min = currentDate.getMinutes(),
          hour = currentDate.getHours(),
          day = currentDate.getDate(),
          month = currentDate.getMonth(),
          year = currentDate.getFullYear(),
          monthNamesEN = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"],
          monthNamesFR = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
          monthNames = [],
          ampm = '', th = '';

          if(hour >= 12) { ampm = 'PM'; }

          else { ampm = 'AM'; }

          hour = hour % 12;
          if(!hour) hour = 12;

          if(min < 10) { min = '0'+min; }

          switch (day) {
              case 1: case 21: case 31:
                th = "st"; break;
              case 2: case 22:
                th ="nd"; break;
              case 3: case 23:
                th = "rd"; break;
              default:
                th = "th";
          }

          if($('html').attr('lang') == 'fr-FR') {
            monthNames = monthNamesFR;
            th = '';
          } else {
            monthNames = monthNamesEN;
          }

          $('.js-nav-time').html(hour + ':' + min + ' ' + ampm);
          $('.js-nav-date').html(day + th + ' ' + monthNames[month] + ' ' + year);
    }

    window.setInterval(navigationDate, 1000);

    /***********************************
     * global app declaration of events and methods
     */

    // module init method;
    // NOTE: important for initializing the module will be called dynamically
    module.init = function() {
      if( !(typeof browserDetect === "undefined") ){
        browserDetect.init();
      }
      bindStickyNav();
      bindBurgerNav();
      bindDropdownNav();
      bindNavSocial();
      bindFooterNav();
      bindLangSwitcher();
      omainIndex();
    };

    return module;
  })(window, jQuery, window.App)
);
