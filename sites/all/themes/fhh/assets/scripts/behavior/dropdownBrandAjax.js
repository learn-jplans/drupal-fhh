
/*
 * Timeline
 */

App.module.create(
  'dropdownBrandAjax',
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
  module.loadProductItems = function () {

    $('.js-dropdown__brand').livequery(function () {
      var $el = $(this),
        $dropdown = $el.parents('.js-dropdown'),
        $section = $dropdown.parents('.js-section-article'),
        $item = $el.find('.js-dropdown__item'),
        $value = $dropdown.find('.js-dropdown__value');

      $item.on('click', function () {

        var brand_id = $(this).data("dropdownId"),
          product_name = $(this).data("dropdownValue"),
          $parent = $(this).parents('.o-sidebar__item'),
          $sidebarPreloader = $parent.find('.js-sidebar__preloader'),
          $watch = $parent.find('.js-carousel--watch'),
          $foot = $parent.find('.o-sidebar__foot');

        //change dropdown value
        $value.text(product_name);
        // close dropdown
        closeDropdownOverlay();
        // unslick carousel
        $watch.slick('unslick').empty();
        // remove footer button
        $foot.remove();
        // show preloader
        $sidebarPreloader.addClass('is-show')
          .find('.js-preloader--sidebar').removeClass('is-hidden');

        $.ajax({
          url: "/wp-admin/admin-ajax.php?action=get_product_items",
          type: "GET",
          data: { brand_id: brand_id },
          success: function(data){
            var product = JSON.parse(data);

            if(product.length > 0) {

              $sidebarPreloader.removeClass('is-show');

              $.each(product[0].items, function (idx, item) {
                  renderItems(item, $watch);
              });

              if((product[0].cta_text).length > 0) {
                renderShopButton(product[0].cta_text, product[0].cta_url, product[0].target_page, $watch.parent());
              }
              // re initialize carousel
              dropdownCarousel();

            } else {
              $sidebarPreloader.find('.js-preloader--sidebar')
                .addClass('is-hidden');
            }

          },
          error: function (xhr, status, error) {
            console.log(status + ' - ' + error);
          }
        });

      });

      var closeDropdownOverlay = function () {
        $dropdown.removeClass('is-dropdown--active');
        $('.js-dropdown-overlay').remove();
        if(is_iOS) {
          $('html,body').removeClass('u-no-scroll');
          $('section, footer').removeAttr('style');
        }
      }

      var dropdownCarousel = function () {
        $section.find('.js-sidebar--carousel').each(function (index,value) {

          var $el = $(this),
            $item = $el.find('.js-carousel__item'),
            $details = $el.find('.js-carousel__details');

          $el.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
            var $i = (currentSlide ? currentSlide : 0);
            $details.removeClass('is-visible');
            $('[data-slick-index="' + $i + '"]').find($details).addClass('is-visible');
          })
          .slick({
            lazyload: 'ondemand',
            arrows: false,
            dots: true,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            responsive: [
              {
                breakpoint: app.breakpoint.medium,
                settings: {
                  dots: false
                }
              },
              {
                breakpoint: app.breakpoint.small,
                settings: {
                  arrows: false,
                  dots: false,
                  slidesToShow: 1,
                  centerMode: true,
                  touchThreshold: 10
                  // variableWidth: true
                }
              }
            ]
          });
        });
      }

    });
  };

  var renderItems = function(product, $parent) {
    var html = "";
    html += '<div class="c-watch__item js-watch__item">';
      html += '<div class="c-watch__image">';
        html += '<img src="'+product.image.url+'" alt="'+product.image.alt+'">';
      html += '</div>';
      html += '<div class="c-watch__details o-meta o-align-c js-carousel__details">';
        html += '<div class="o-meta__title__product">'+product.title+'</div>';
        html += '<a href="javascript://void(0);" class="o-meta__title__brand__link"><span class="o-label o-label--red">'+product.view_text+'</span></a>';
      html += '</div>';
    html += '</div>';
    $parent.append(html);
  };

  var renderShopButton = function(text, url, target_page, $parent) {
    var html = "";
      html += '<div class="o-sidebar__foot o-align-c">';
        html += '<a href="'+url+'" '+target_page+' title="'+text+'" class="o-button">'+text+'</a>';
      html += '</div>';
    $parent.append(html);
  };


  /***********************************
  * global app declaration of events and methods
  */

  // module init method;
  // NOTE: important for initializing the module will be called dynamically
  module.init = function() {
    module.loadProductItems();
  };


  return module;
  })(window, jQuery, window.App)
);