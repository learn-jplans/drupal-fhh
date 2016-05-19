
/*
 * accordion
 */

App.module.create(
  'accordion',
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

  module.accordion = function () {
    $('.js-accordion').livequery(function () {
      var $el = $(this),
        $items = $el.find('.js-accordion__item');

      $items.each(function (index, val) {
        var $item = $(this),
          $content = $item.find('.js-accordion__content');

        
        if(!$el.hasClass('is-info-page')) {
          $item.on('click', function (e) {
            console.log('test');
              if($(e.target).hasClass('c-menu__link') && !$(e.target).parent().parent().hasClass('js-accordion__content') && !$(e.target).hasClass('js-disabled')) {
                 e.preventDefault();
              } else {
                return;
              }
              collapsible();
          });

        } else {
          $item.find('.js-accordion__title').on('click', function(e) {
            console.log('test info');
            collapsible();
          });
        }

        var collapsible = function() {
          if (!$item.hasClass('is-accordion--active') ) {
            $items.removeClass('is-accordion--active');
            $item.addClass('is-accordion--active');
            $items.find('.c-accordion__icon use').attr('xlink:href', '#expand');
            $item.find('.c-accordion__icon use').attr('xlink:href', '#collapse');

          } else {
            $item.removeClass('is-accordion--active');
            $item.find('.c-accordion__icon use').attr('xlink:href', '#expand');
          }
        }

      });
    });
  };

  module.accordionClose = function () {
    $('.js-accordion__item').removeClass('is-accordion--active');
  };


  /***********************************
  * global app declaration of events and methods
  */

  // module init method;
  // NOTE: important for initializing the module will be called dynamically
  module.init = function() {
    module.accordion();
  };


  return module;
  })(window, jQuery, window.App)
);