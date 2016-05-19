/*
 * Product Comparison
 */

App.module.create(
  'productComparison',
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

    var bindProduct = function () {
      $('.js-product').livequery(function () {
        var $el = $(this),
          $item = $el.find('.js-product__item');
          compareItem($item.find('.js-product__slide'), $item.find('.js-product__resize--left'), $item.find('.js-product__resize--right'), $item);
      });
    };

    var compareItem = function(dragElement, leftElement, rightElement, container) {
      dragElement.on("mousedown vmousedown", function(e) {
          dragElement.addClass('is-draggable');
          leftElement.addClass('is-resizable--left');
          rightElement.addClass('is-resizable--right');

          var dragWidth = dragElement.outerWidth(),
              xPosition = dragElement.offset().left + dragWidth - e.pageX,
              containerOffset = container.offset().left,
              containerWidth = container.outerWidth(),
              minLeft = containerOffset - 10,
              maxLeft = containerOffset + containerWidth - dragWidth + 10;

          dragElement.parents().on("mousemove vmousemove", function(e) {
              var leftValue = e.pageX + xPosition - dragWidth;

              if (leftValue < minLeft ) {
                  leftValue = minLeft;
              } else if ( leftValue > maxLeft) {
                  leftValue = maxLeft;
              }

              var leftWidthValue = (leftValue + dragWidth/2 - containerOffset)*100/containerWidth+'%';
              var rightWidthValue = 100-((leftValue + dragWidth/2 - containerOffset)*100/containerWidth)+'%';

              $('.is-draggable').css('left', leftWidthValue);
              $('.is-resizable--left').css('width', leftWidthValue);
              $('.is-resizable--right').css('width', rightWidthValue);

          // });
           }).on("mouseup vmouseup", function(e){
              dragElement.removeClass('is-draggable');
              leftElement.removeClass('is-resizable--left');
              rightElement.removeClass('is-resizable--right');
          });

          e.preventDefault();
      });

    }


    /***********************************
     * global app declaration of events and methods
     */

    // module init method;
    // NOTE: important for initializing the module will be called dynamically
    module.init = function() {
      bindProduct();
    };


    return module;
  })(window, jQuery, window.App)
);
