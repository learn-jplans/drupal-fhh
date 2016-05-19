
/*
 * Gallery Module
 */

App.module.create(
  'gallery',
  (function(window, $, app) {
    'use strict';

    // define module object
    var module = {};

    /***********************************
    * private variables
    */
    var offset = 0,
        post_per_page = 12;

    /***********************************
    * private methods
    */

    /***********************************
    * public application definition
    */
    module.loadGalleries = function(article_id, post_per_page) {
      var $post = $.ajax({
        url: "/wp-admin/admin-ajax.php?action=load_galleries",
        type: "GET",
        data: {
          article_id : article_id,
          offset : offset,
          post_per_page : post_per_page
        },
        success: function(data) {
          offset += post_per_page;
          var is_desktop = (app.$window.width() >= app.breakpoint.medium),
              max = $('.js-gallery').data('maxGalleryArticle'),
              $container;

          $container = (offset > post_per_page && is_desktop) ? $('.js-gallery__article .slick-track') : $('.js-gallery__article');

          // append gallery
          $container.append(data);

          //show load more button
          $('.js-loader-gallery__toggle').removeClass('is-hidden');

          //hide preloader
          $('.js-preloader--load-more').addClass('is-hidden');

          $('.js-preloader--gallery').addClass('is-hidden');

          $('.js-gallery').parent().addClass('is-show');

          if( offset >= max ) {
            $('.js-loader-gallery__toggle').remove();
          }

          if (offset > 12) {

            module.loadMorePosition();
            app.$window.on('resize', module.loadMorePosition());

          }

        }
      });

      return $post;
    };

    module.getOffset = function() {
      return offset;
    };

    // load more gallery
    var loadMoreGallery = function() {
      $('.js-loader-gallery__toggle').livequery(function() {
        var $el = $(this);
        $el.on('click', function() {
          var article_id = $('.js-modal__toggle').data('modalId');

          //hide load more button
          $(this).addClass('is-hidden');

          //show preloader
          $('.js-preloader--load-more').removeClass('is-hidden');

          module.loadGalleries(article_id, 6);

        });
      });
    }

    // gallery thumbnail
    var galleryThumbnail = function () {
      $('.js-gallery').livequery(function () {
        var $el = $(this),
          $modal = $el.parents('.js-modal'),
          $thumbnail = $el.find('.js-gallery__thumbnail'),
          $thumbnailToggle = $el.find('.js-gallery__thumbnail__toggle'),
          $thumbnailCtrl = $el.find('.js-gallery__controls'),
          $ctrl = $el.find('.js-gallery__ctrl'),
          $galleryLoader = $el.find('.js-gallery__loader'),
          $article = $el.find('.js-gallery__article'),
          $articleToggle = $el.find('.js-gallery__article__toggle'),
          $article_carousel = $el.find('.js-gallery__article'),
          $body = $el.find('.js-gallery__body'),
          $foot = $el.find('.js-gallery__foot');

        // Thumbnail Toggle
        $thumbnailToggle.on('click', function () {

          if ($article.hasClass('is-show')) { closeMoreGalleries(); }

          if ( $thumbnail.hasClass('is-show') ) {

            closeThumbnail();

          } else {

            openThumbnail();

          }
        });

        // Articles Toggle
        $articleToggle.on('click', function () {

          if ($thumbnail.hasClass('is-show')) { closeThumbnail(); }

          if ( $article.hasClass('is-show') ) {

            if ( app.$window.width() <= app.breakpoint.medium ) {

              $modal.animate({ scrollTop: '0px' }, 500,  function () {
                closeMoreGalleries();
              });

            } else {

              closeMoreGalleries();

            }

          } else {

            if ( app.$window.width() >= app.breakpoint.medium ) { App.carousel.galleryCarouselArticle(); }

            openMoreGalleries();

          }

        });

        // close more galleries function
        var closeMoreGalleries = function () {
          $body.removeClass('is-open--up');
          $articleToggle.removeClass('is-active');
          $article.removeClass('is-show');
          $galleryLoader.css('bottom', 0).removeClass('is-show');
        }

        // open more galleries function
        var openMoreGalleries = function () {
          var $windowHeight = app.$window.outerHeight(),
            $toggleHeight = $articleToggle.outerHeight(),
            $scrollOffset = ($windowHeight - $toggleHeight) - 18;

          // for desktop only
          $body.addClass('is-open--up');
          $articleToggle.addClass('is-active');
          $article.addClass('is-show');

          module.loadMorePosition();

          $modal.animate({ scrollTop: $scrollOffset + 'px' }, 500);

        };

        // close thumbnail function
        var closeThumbnail = function () {
          $thumbnailToggle.removeClass('is-active');
          $thumbnail.removeClass('is-show');
          $thumbnailCtrl.removeClass('is-move');
          $body.removeClass('is-open');
          $foot.removeClass('is-open');
        }

        // open thumbnail function
        var openThumbnail = function () {
          $thumbnailToggle.addClass('is-active');
          $thumbnail.addClass('is-show');
          $thumbnailCtrl.addClass('is-move');
          $body.addClass('is-open');
          $foot.addClass('is-open');
        }

      });
    };


    // compute load more position
    module.loadMorePosition = function () {

      var loadPosition = function () {
        var $gallery = $('.js-gallery'),
          $article_carousel = $gallery.find('.js-gallery__article'),
          $galleryLoader = $gallery.find('.js-gallery__loader'),
          $position = ($article_carousel.outerHeight() + 40) * -1;

        $galleryLoader.css('bottom', $position)
          .addClass('is-show');
      };

      loadPosition();

    };


    module.loadGalleryModal = function(article_id) {
      var $el = $('.js-modal').find('.o-container');
      $.ajax({
        url: "/wp-admin/admin-ajax.php?action=load_gallery_modal",
        type: "GET",
        data: {article_id : article_id},
        success: function(data){
          $el.html(data);

          //reset article offset
          offset = 0;
          module.loadGalleries(article_id,post_per_page);

        },
      });
    };

    var bindModal = function () {
      $('.js-modal__toggle').livequery(function () {
        var $el = $(this),
          $elData = $el.data('modalName'),
          article_id = $el.data('modalId'),
          $item = $el.parents('.c-carousel__item'),
          $modal = $('.js-modal[data-modal="' + $elData + '"]');

        $el.on('click', function (e) {
          e.preventDefault();

          var $index = $(this).parents('.c-carousel__item').data('slickIndex');
          if ($item.hasClass('slick-active')) {

            if ( !$modal.hasClass('is-active') ) {
              $modal.addClass('is-active');
              app.$body.addClass('u-no-scroll');
            }

            // load gallery
            module.loadGalleryModal(article_id);
            // initialize carousel
            App.carousel.galleryCarousel($index);

            setTimeout(function() {
              $('.js-overlay').addClass('o-overlay--gallery');
            }, 2000);

          }

        });

      });
    };

    var modalClose = function () {
      $('.js-modal__close').livequery(function () {
        var $el = $(this),
        $modal = $el.parents('.js-modal'),
        $gallery = $modal.find('.js-gallery'),
        $thumbnail = $gallery.find('.js-carousel--gallery__thumbnail'),
        $carousel = $gallery.find('.js-carousel--gallery'),
        $article_carousel = $gallery.find('.js-gallery__article');

        $el.on('click', function() {
          if ( $modal.hasClass('is-active') ) {
            $modal.removeClass('is-active');
            app.$body.removeClass('u-no-scroll');
            $('.js-overlay').removeClass('o-overlay--gallery');
            $('.js-preloader--gallery').removeClass('is-hidden');
            $modal.find('.o-container').removeClass('is-show');
            $gallery.remove();
          }
        });
      });
    };

    /***********************************
    * global app declaration of events and methods
    */

    // module init method;
    // NOTE: important for initializing the module will be called dynamically
    module.init = function() {
      galleryThumbnail();
      bindModal();
      loadMoreGallery();
      modalClose();
    };


    return module;
  })(window, jQuery, window.App)
);