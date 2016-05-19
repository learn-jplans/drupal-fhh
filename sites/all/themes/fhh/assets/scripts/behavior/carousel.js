/*
 * Carousel
 */

App.module.create(
  'carousel',
  (function(window, $, app) {
    'use strict';

    // define module object
    var module = {};

    /***********************************
     * private variables
     */

     // default arrows
     var $arrowLeft = '<div class="c-carousel__arrows c-carousel__arrows--left o-pos-l"><svg class="o-icon o-icon--next-l"><use xlink:href="#arrow-left"></use></svg></div>',
      $arrowRight = '<div class="c-carousel__arrows c-carousel__arrows--right o-pos-r"><svg class="o-icon o-icon--next-r"><use xlink:href="#arrow-right"></use></svg><svg class="o-icon o-icon--arrow-right-c" style="display: none;"><use xlink:href="#arrow-right-c"></use></svg></div>';


    /***********************************
     * private methods
     */


    /***********************************
     * public application definition
     */


    // Default
    var bindCarouselDefault = function () {
      $('.js-carousel').livequery(function () {
        var $el = $(this)
        $el.slick({
          arrows: false,
          dots: true
        });
      });
    };

    // Snackables
    var bindCarouselSnackables = function () {
      $('.js-carousel--snacks').livequery(function () {
        var $el = $(this);
        $el.slick({
          arrows: false,
          dots: false,
          infinite: false,
          centerMode: false,
          slidesToShow: 4,
          slidesToScroll: 1,
          variableWidth: false,
          responsive: [
            {
              breakpoint: 3000,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
                arrows: false,
                dots: false,
                variableWidth: true
              }
            },
            {
              breakpoint: 1339,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                arrows: false,
                dots: false,
                variableWidth: true
              }
            },
            {
              breakpoint: 960,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                arrows: false,
                dots: true,
                variableWidth: true
              }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                dots: true,
                centerMode:false,
                variableWidth: true,
                infinite: true
              }
            },
            {
              breakpoint: 300,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                dots: true,
                centerMode:false,
                variableWidth: false,
                infinite: true
              }
            }]
        });
      });
    };

    // Aricle Brand and Gallery
    var bindCarouselBrand = function () {
      $('.js-carousel--brand').livequery(function () {
        var $el = $(this),
          $bransSlidesCurrent = $('.js-carousel__slides__current'),
          $brandSlidesTotal = $('.js-carousel__slides__total'),
          $caption = $('.js-carousel__item__caption'),
          $ctrls = $el.parent().find('.js-carousel__ctrl'),
          $ctrlCurrent = $ctrls.find('.js-carousel__ctrl__current'),
          $ctrlTotal = $ctrls.find('.js-carousel__ctrl__total'),
          $ctrlPrev = $ctrls.find('.js-carousel__ctrl__prev'),
          $ctrlNext = $ctrls.find('.js-carousel__ctrl__next');

        // on initialize, on re initalize, on after change
        $el.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
          var $i= (currentSlide ? currentSlide : 0) + 1;

          // display current slide and total items
          $bransSlidesCurrent.text($i);
          $brandSlidesTotal.text(slick.slideCount);

          $ctrlCurrent.text($i);
          $ctrlTotal.text(slick.slideCount);

          // get the carousel item caption
          // pass it inside carousel info
          var $captionNew = $('.slick-slide[data-slick-index="' + slick.currentSlide + '"]').find($caption).html();
          $('.js-carousel-caption').text($captionNew);

        })
        .slick({
          lazyload: 'ondemand',
          dots: false,
          arrows: true,
          prevArrow: $ctrlPrev,
          nextArrow: $ctrlNext,
          variableWidth: true,
          centerMode: true,
          focusOnSelect: true
        });
      });
    };

    // Watch
    module.bindCarouselWatch = function () {
      $('.js-carousel--watch').livequery(function () {

        var $el = $(this),
          $item = $el.find('.js-carousel__item'),
          $details = $el.find('.js-carousel__details');
        $el.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
          var $i = (currentSlide ? currentSlide : 0);
          module.showSliderContent($i,$details);
        })
        .slick({
          lazyload: 'ondemand',
          arrows: true,
          prevArrow: $arrowLeft,
          nextArrow: $arrowRight,
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
                touchThreshold: 10,
                variableWidth: true
              }
            }
          ]
        });
      });
    };


    // Short Stories
    var bindCarouselShortStories = function () {
      $('.js-carousel--short-stories').livequery(function () {
        var $el = $(this);

        app.$window.on('resize', function () {
          if (app.$window.width() >= app.breakpoint.small) {
            $('.js-shortstories--breaker .c-article__body').removeAttr("style");
            App.shortStories.equalHeightStories();
          }
        });

        $el.on('init reInit', function (event, slick) {
          $('.js-shortstories--breaker .c-article__body').removeAttr("style");
          App.shortStories.equalHeightStories();
        })
        .on('afterChange', function(event, slick, currentSlide){
          if(app.$window.outerWidth(true) <= app.breakpoint.medium) {
            if(currentSlide >= 3) {
              setTimeout(function(){
                $el.find('.slick-dots li:nth-child(1)').click();
              }, 100);
            }
          }

        })
        .slick({
          arrows: false,
          dots: true,
          infinite: false,
          slidesToShow: 1,
          slidesToScroll: 3,
          initialSlide: 1,
          centerMode: true,
          variableWidth: true,
          responsive: [
            {
              breakpoint: app.breakpoint.medium,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 3,
                initialSlide: 1,
                centerMode: true,
                // variableWidth: true,
              }
            },
            {
              breakpoint: app.breakpoint.small,
              settings: 'unslick'
            }
          ]
        });
      });
    };

    // Trending Section
    var bindCarouselTrending = function () {
      $('.js-carousel--trending').livequery(function () {
        var $el = $(this);
        app.$window.on('resize', function () {
          if (app.$window.width() >= app.breakpoint.small) {
            $el.slick('reinit');
          }
        });

        $el.slick({
          lazyLoad: 'ondemand',
          arrows: false,
          dots: false,
          infinite: false,
          slidesToShow: 4,
          slidesToScroll: 1,
          responsive: [
            {
              breakpoint: 1302,
              settings: {
                variableWidth: true,
                slidesToShow: 3
              }
            },
            {
              breakpoint: app.breakpoint.medium,
              settings: {
                variableWidth: true,
                slidesToShow: 2
              }
            },
            {
              breakpoint: app.breakpoint.small,
              settings: {
                variableWidth: true,
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
          ]
        });
      });
    };

    // Daily Section
    var bindCarouselDaily = function () {
      $('.js-carousel--daily').livequery(function () {
        var $el = $(this);

        app.$window.on('resize', function () {
          if (app.$window.width() >= app.breakpoint.small) {
            $el.slick('reinit');
          }
        });
        $el.slick({
          lazyLoad: 'ondemand',
          arrows: false,
          dots: false,
          infinite: false,
          slidesToShow: 4,
          slidesToScroll: 1,
          responsive: [
            {
              breakpoint: app.breakpoint.medium,
              settings: {
                variableWidth: true,
                slidesToShow: 2
              }
            },
            {
              breakpoint: app.breakpoint.small,
              settings: 'unslick'
            }
          ]
        });
      });
    };

    // World Clock Section
    var bindCarouselWorldClock = function () {
      $('.js-carousel--clock').livequery(function () {
        var $el = $(this),
          $tabContent = $('.js-tab__content'),
          $tabItem = $('.js-tab__item'),
          $breaker = $('.js-breaker-background');

        $el.on('afterChange', function (event, slick, currentSlide) {
          // $tabContent.first().addClass('is-tab__content--active');
          var $i = (currentSlide ? currentSlide : 0),
            $item = $('.js-tab').find('.js-tab__item'),
            $content = $('.js-tab').find('.js-tab__content'),
            $city = $('[data-tab="' + $i + '"]').find('.js-clock__location').text(),
            $locationRep = $city.replace(/\s+/g, '-').toLowerCase();

          $item.removeClass('is-active');
          $content.removeClass('is-active');
          $item.filter('[data-tab="' + $i + '"]').addClass('is-active');
          $content.filter('[data-tab-index="' + $i + '"]').addClass('is-active');

          // change background image
          // based on the selected city
          $breaker.removeClass(App.tab.removeClassBG)
            .addClass('o-bg--city-'+$locationRep);

          $('.js-location span').text($city);

        })
        .slick({
          arrows: false,
          dots: false,
          slidesToShow: 4,
          swipe: false,
          responsive: [
            {
              breakpoint: app.breakpoint.medium,
              settings: {
                arrows: true,
                fade: true,
                prevArrow: $arrowLeft,
                nextArrow: $arrowRight,
                dots: false,
                // initialSlide: $i,
                slidesToShow: 1,
                slidesToScroll: 1,
                adaptiveHeight: true
              }
            }
          ]
        });
      });
    };

    var bindCarouselTab = function () {
      $('.js-carousel--tab').livequery(function () {
        var $el = $(this);
        $el.slick({
          mobileFirst: true,
          arrows: false,
          dots: true,
          infinite: false,
          touchThreshold: 3,
          edgeFriction: 0.50,
          swipeToSlide: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          responsive: [
            {
              breakpoint: app.breakpoint.medium,
              settings: {
                slidesToShow: 3,
                inifinite: false
              }
            }
          ]
        });
      });
    }

    // Gallery thumbnail
    module.galleryThumbnail = function (index) {
      $('.js-carousel--gallery__thumbnail').livequery(function () {
        var $el = $(this),
          $thumbnailItem = $el.find('.c-gallery__thumbnail__item'),
          $brandSlidesCurrent = $('.js-gallery__slides__current'),
          $brandSlidesTotal = $('.js-gallery__slides__total'),
          $dataInd = index;

        if ($el.hasClass('slick-initialized')) { $el.slick('unslick'); }

        if (!$el.hasClass('slick-initialized')) {

          $el.slick({
            lazyload: 'ondemand',
            arrows: false,
            dots: false,
            infinite: false,
            initialSlide: $dataInd,
            slidesToShow: 6,
            variableWidth: true,
            focusOnSelect: false,
            edgeFriction: 0.50,
            touchThreshold: 15,
            responsive: [
              {
                breakpoint: app.breakpoint.small,
                settings: {
                  slidesToShow: 1,
                  touchThreshold: 5
                }
              },
              {
                breakpoint: app.breakpoint.medium,
                settings: {
                  slidesToShow: 3,
                  touchThreshold: 10
                }
              },
              {
                breakpoint: app.breakpoint.large,
                settings: {
                  slidesToShow: 5,
                  touchThreshold: 10
                }
              }
            ]
          });

          // navigate slides thru thumbnail images
          var isTouchMoving = false;

          $thumbnailItem.on('vclick', function () {
            var $item = $(this),
              $dataIndex = parseInt($item.data('slickIndex'));

            if(isTouchMoving) {
              $('.js-carousel--gallery').slick('slickGoTo', $dataIndex);
              isTouchMoving = false;
              return false;
            }
          });

          $el.on('mouseup mousemove vmousemove touchend', function () {
            isTouchMoving = true;
          });
          $el.on('scrollstop', function () {
            isTouchMoving = false;
          });

        }

      });
    };


    module.galleryCarousel = function (index) {

      index = index ? index : 0;

      $('.js-carousel--gallery').livequery(function () {
        var $el = $(this),
          $item = $el.find('.js-gallery__item'),
          $content = $('.js-gallery__content'),
          $galleryArrows = $el.parent().find('.js-gallery__arrows'),
          $galleryArrowRight = $galleryArrows.find('.js-gallery__arrows--right'),
          $galleryArrowLeft = $galleryArrows.find('.js-gallery__arrows--left'),
          $thumbnailPrev = $('.js-gallery__thumbnail__prev'),
          $thumbnailNext = $('.js-gallery__thumbnail__next');

        if ($el.hasClass('slick-initialized')) { $el.slick('unslick'); }

        if (!$el.hasClass('slick-initialized')) {

          // on initialize, on re initalize, on after change
          $el.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
            var $i = (currentSlide ? currentSlide : 0);

            $('.js-gallery__slides__current').text($i + 1);
            $('.js-gallery__slides__total').text(slick.slideCount);

            module.showSliderContent($i,$content);
          })
          .slick({
            lazyload: 'ondemand',
            arrows: true,
            prevArrow: $arrowLeft,
            nextArrow: $arrowRight,
            fade: true,
            initialSlide: index,
            dots: false,
            infinite: true,
            draggable: false,
            cssEase: 'ease-in-out',
            speed: 700,
            responsive: [
              {
                breakpoint: app.breakpoint.medium,
                settings: {
                  draggable: true
                }
              }
            ]
          });

          $('.js-gallery__slides__current').text(index + 1);
          module.showSliderContent(index,$content);

          // navigate slides thru thumbnail controller
          // next
          $thumbnailNext.on('click', function () {
            var $slidesCurrent = $('.c-gallery__controls').find('.js-gallery__slides__current').text(),
              $slidesTotal = $('.c-gallery__controls').find('.js-gallery__slides__total').text(),
              $dataIndex = $slidesCurrent !== $slidesTotal  ? $slidesCurrent : 0;

            $('.js-carousel--gallery').slick('slickGoTo', $dataIndex);
          });

          // navigate slides thru thumbnail controller
          // previous
          $thumbnailPrev.on('click', function () {
            var $slidesCurrent = $('.c-gallery__controls').find('.js-gallery__slides__current').text(),
              $slidesTotal = $('.c-gallery__controls').find('.js-gallery__slides__total').text(),
              $dataIndex = $slidesCurrent > 1 ? $slidesCurrent : $slidesTotal + 1;

            $('.js-carousel--gallery').slick('slickGoTo', $dataIndex - 2);
          });

        }
      });

      module.galleryThumbnail(index);

    }

    module.galleryCarouselArticle = function () {
      // $('.js-gallery__article').livequery(function () {
        var $el = $('.js-gallery__article'),//$(this),
          $tile = $el.find('.c-tile');

        $el.on('edge swipe', function (event, slick, direction) {

          var article_id = $('.js-modal__toggle').data('modalId'),
            $dots = $el.find('.slick-dots').find('li:last-child').hasClass('slick-active');

          if ( direction === 'left' ) {

            if (event.type === 'edge' && $dots) {
              app.gallery.loadGalleries(article_id,6)
                .done(function () {
                  var offset = app.gallery.getOffset();
                  $el.slick('reinit');
                  $el.slick('slickGoTo', offset + 1);
                  removeDots();
                });
            }
          }

        });

        if ($el.hasClass('slick-initialized')) {
          $el.slick('unslick');
        }
        if (app.$window.width() > app.breakpoint.medium && $tile.length > 6) {
          if (!$el.hasClass('slick-initialized')) {
            $el.slick({
              dots: true,
              arrows: false,
              infinite: false,
              slidesToShow: 6,
              slidesToScroll: 6,
              focusOnSelect: false,
              touchThreshold: 10,
              responsive: [
                {
                  breakpoint: app.breakpoint.medium,
                  settings: 'unslick'
                }
              ]
            });
          }
        }

        app.$window.on('EVENT_ON_RESIZE', function () {
          if (app.$window.width() >= app.breakpoint.medium) {
            $el.slick('reinit');
            removeDots();
          }
        });

        var removeDots = function () {
          // remove duplicate dots
          $el.find('.slick-dots').each(function (index) {
            var $this = $(this);
            $this.not(':last-child').remove();
          });
        }
      // });
    };

    // display carousel content
    // caption / social media
    module.showSliderContent = function(index, item) {
      $('.js-gallery__content').removeClass('is-visible');
      $('[data-slick-index="' + index + '"]').find(item).addClass('is-visible');
    }

    var bindCarouselEvents = function() {
      bindCarouselDefault();
      bindCarouselSnackables();
      bindCarouselBrand();
      module.bindCarouselWatch();
      bindCarouselShortStories();
      bindCarouselTrending();
      bindCarouselDaily();
      bindCarouselWorldClock();
      bindCarouselTab();
    }
    /***********************************
     * global app declaration of events and methods
     */

    // module init method;
    // NOTE: important for initializing the module will be called dynamically
    module.init = function() {

      // module.galleryCarousel();

      // app.$window.on('load', function(){
      //   if( app.$doc.find('body').hasClass('from-article') ){
      //     app.$doc.find('body').removeClass('from-article');
      //     $('html, body').scrollTop(0).animate({
      //       scrollTop: app.$window.height()
      //     }, 0);
      //   }
      // });
      //

      if( app.$doc.find('body').hasClass('from-article') ){
        $('html, body').scrollTop( app.$window.height() );
      }

      bindCarouselEvents();
    };


    return module;
  })(window, jQuery, window.App)
);
