App.module.create(
  'articleLanding',
  (function(window, $, app) {
  'use strict';

  // define module object
  var module = {};

  /***********************************
  * private variables
  */
  	var winHeight = app.$window.height(),
      request = 1,
      breakerSize = 0,
      articleOffset = 6,
      trigger = false,
      $el_main = $('.js-main'),
      categoriesFilter = $el_main.data('filter-categories'),
      categoryId = $el_main.data('category'),
      is_video = $el_main.data('is-video'),
      is_short_story = $el_main.data('is-short-story'),
      is_tag = $el_main.data('is-tag'),
      is_brand = $el_main.data('is-brand'),
      is_home = $('body').hasClass('home'),
      brand_id = $el_main.data('brand-id'),
      taxonomy = $el_main.data('taxonomy'),
      slug = $el_main.data('slug'),
      breakerSize = $el_main.data('breaker-size'),
      $sortValue = $('.js-short--stories .sortvalue'),
      $loader    = $('.js-preloader--landing'),
      is_filter = $el_main.data('is-filter'),
      $excluded_ids = $('.js-excluded-ids:last').data('excluded-ids'),
      articleMax = $el_main.data('article-max');
      

  /***********************************
  * private methods
  */

  var loadArticle = function() {
   var scrollTop = app.$window.scrollTop(),
    windowHeight = app.$window.height() / 2,
    mainHeight = $el_main.outerHeight() - windowHeight;

    if(scrollTop >= mainHeight) {
      if(scrollTop > 0) {
        if(parseInt(articleMax) > articleOffset) {
          if(!trigger) {
            $loader.removeClass('is-hidden');
            trigger = true;

            if( !isNaN(parseInt(categoryId)) ) {

              getArticle(categoryId, categoriesFilter);

            } else if (is_video) {

              getArticleVideos(categoriesFilter);

            } else if (is_tag) {

              getArchiveArticle();

            } else if (is_brand) {

              getArchiveBrandArticle();

            } else if (is_short_story) {

              getArticleShortStories(categoriesFilter, $sortValue.text());

            } else if (is_home) {

              getLandingBreakersByBatch();

            }
          }
        } else {
          
          $('.js-body').addClass('content-loaded');
          $('.js-main').removeClass('no-box-shadow');
          $loader.addClass('is-hidden');
        }
      }
		} else {
      $('.js-footer').removeClass('is-visible');
    }

  	};

  	var getArticle = function(categoryId, categoriesFilter) {
  		$.ajax({
  			url: "/wp-admin/admin-ajax.php?action=get_category_articles",
  			type: "GET",
  			data: {
          categoryId : categoryId,
          request : request,
          offset : articleOffset,
          categoriesFilter : categoriesFilter,
          isFilter : is_filter,
          excluded_ids : $excluded_ids
        },
  			success: function(data){
          request++;
          articleOffset+=6;
          $('.js-main').append( data );
          if(request >= parseInt(breakerSize)) {
            request = 0;
          }
          $loader.addClass('is-hidden');
          trigger = false;
  			}
  		});

  	};

    var getArchiveArticle = function() {
      //display 9 articles for archives
      articleOffset+=3;
      $.ajax({
        url: "/wp-admin/admin-ajax.php?action=get_archive_articles",
        type: "GET",
        data: {
          taxonomy : taxonomy,
          offset : articleOffset,
          slug : slug
        },
        success: function(data){
          articleOffset+=6;
          $('.js-main').append( data );
          $loader.addClass('is-hidden');
          trigger = false;
        }
      });

    };

    var getArchiveBrandArticle = function() {
      //display 9 articles for archives
      articleOffset+=3;
      $.ajax({
        url: "/wp-admin/admin-ajax.php?action=get_archive_brand_articles",
        type: "GET",
        data: {
          brand_id : brand_id,
          offset : articleOffset,
        },
        success: function(data){
          articleOffset+=6;
          $('.js-main').append( data );
          $loader.addClass('is-hidden');
          trigger = false;
        }
      });

    };

    var getArticleVideos = function(categoriesFilter) {
      $.ajax({
        url: "/wp-admin/admin-ajax.php?action=get_video_articles",
        type: "GET",
        data: {
          request : request,
          offset : articleOffset,
          categoriesFilter : categoriesFilter,
          isFilter : is_filter,
          excluded_ids : $excluded_ids
        },
        success: function(data){
          request++;
          articleOffset+=6;
          $('.js-main').append( data );
          if(request >= parseInt(breakerSize)) {
            request = 0;
          }
          $loader.addClass('is-hidden');
          trigger = false;
        }
      });
    };

    var getArticleShortStories = function(categoriesFilter, sortBy) {

      $.ajax({
        url: "/wp-admin/admin-ajax.php?action=get_short_story_articles",
        type: "GET",
        data: {
          request : request,
          offset : articleOffset,
          categoriesFilter : categoriesFilter,
          sort : sortBy,
          isFilter : is_filter
        },
        success: function(data){
          request++;
          articleOffset+=6;
          $('.js-main').append( data );
          if(request >= parseInt(breakerSize)) {
            request = 0;
          }
          $loader.addClass('is-hidden');
          trigger = false;
        }
      });
    };

    var sortArticle = function () {
      $('.js-article__sortbox ul li').livequery(function () {
        var $el = $(this);
          $el.on('click',function(e){
            e.preventDefault();
            var $svedValue = $(this).text();
            $('.sortvalue').text($svedValue).click();
            $('#sortvalue').val($svedValue);
            $('.c-breaker').remove();
            $('.o-section--trending').remove();
            articleOffset = 0;
            if(!trigger) {
              trigger = true;
              getArticleShortStories(categoriesFilter, $sortValue.text());
            }
            $el.addClass('is-current').siblings().removeClass('is-current');
          });

      });
    };

    var initLanding = function() {
      //subtract total excluded ids
      var $total_excluded_ids = (typeof $excluded_ids != 'undefined') ? $excluded_ids.toString().split(',').length : 0;
        //articleMax = articleMax - $total_excluded_ids; // <<DW>> Do not exclude IDs which aren't part of the query

      if(is_home || is_tag || is_brand || is_video || is_short_story || !isNaN(parseInt(categoryId)) || (parseInt(articleMax) <= articleOffset)  ) {
        $('.js-main').addClass('no-box-shadow');
        $loader.addClass('is-hidden');
      }
    }

    var getLandingBreakersByBatch = function() {

      $.ajax({
        url: "/wp-admin/admin-ajax.php?action=get_landing_breakers_by_batch",
        type: "GET",
        data: {
          offset : articleOffset,
        },
        success: function(data){
          articleOffset+=4;
          $('.js-main').append( data );
          $loader.addClass('is-hidden');
          trigger = false;
        }
      });
    };

  /***********************************
  * public application definition
  */

  /***********************************
  * global app declaration of events and methods
  */

  // module init method;
  // NOTE: important for initializing the module will be called dynamically
  module.init = function() {
    initLanding();
    if (is_home) {
      articleOffset = 4;
    }

    if (is_home) {
      articleOffset = 4;
    }

  	app.$window.on('scroll', function() {
  		loadArticle();
  	});

    sortArticle();
  };


  return module;
  })(window, jQuery, window.App)
);
