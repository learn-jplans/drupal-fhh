/*
 * Tab
 */

App.module.create(
  'tab',
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

    var bindTab = function () {
      $('.js-tab').livequery(function () {
        var $el = $(this),
          $items = $el.find('.js-tab__item'),
          $content = $el.find('.js-tab__content'),
          $breaker = $('.js-breaker-background');

        // on load
        // add data-tab index value
        $items.each(function (index) {
          $(this).attr('data-tab', index);
        });

        // on load
        // add data-tab-index value
        $content.each(function (index) {
          $(this).attr('data-tab-index', index);
        });

        $items.on('click', function () {
          var $item = $(this),
            $location = $item.find('.js-clock__location'),
            $locationText = $location.text(),
            $locationRep = $locationText.replace(/\s+/g, '-').toLowerCase(),
            $itemIndex = $item.data('tab');

          $items.removeClass('is-active');
          $item.addClass('is-active');

          $content.removeClass('is-active');
          $content.filter('[data-tab-index="' + $itemIndex + '"]') .addClass('is-active');

          // change background image
          // based on the selected city
          $breaker.removeClass(module.removeClassBG)
            .addClass('o-bg--city-'+$locationRep);
          // change the text of selected city
          $('.js-location span').text($locationText);

        });

      });
    };


    // remove class BG
    module.removeClassBG = function(index, classNames) {
      var current_classes = classNames.split(" "),
          classes_to_remove = [];

      $.each(current_classes, function (index, class_name) {
        if (/o-bg--city.*/.test(class_name)) {
          classes_to_remove.push(class_name);
        }
      });
      return classes_to_remove.join(" ");
    }


    /***********************************
     * global app declaration of events and methods
     */

    // module init method;
    // NOTE: important for initializing the module will be called dynamically
    module.init = function() {
      bindTab();
    };


    return module;
  })(window, jQuery, window.App)
);