App.module.create(
	'myaccounts',
	(function(window, $, app) {
		'use strict';

		// define module object
		var module = {};

		/***********************************
		 * private variables
		 */

    var $body = $('.js-body'),
      $savedArticle = $('#saved-article'),
      $savedArticleFirstLogContainer = $savedArticle.find('.firstLog-container'),
      $savedArticleContainer = $savedArticle.find('.saved-article-content'),
      $recommendedArticle = $('#we-recommend-you'),
      $recommendedArticleFirstLogContainer = $recommendedArticle.find('.firstLog-container'),
      $recommendedArticleContainer = $recommendedArticle.find('.saved-article-content'),

      maxItems = 0, currentBreakpoint,
      currentPageYOffset = 0, currentRecommendedTab = '', currentRecommendedPage = 1;

		/***********************************
		 * private methods
		 */

      var accountsTab = function () {
        $('.account-menu-container a').livequery(function(){
          var $el = $(this);

          $el.each(function(){
            $el.on('click',function(){
              var tabClass = $el.attr('class');
              if(!$el.hasClass('active')){
                $el.siblings('a').removeClass('active');
                $el.addClass('active');
                $('#' + tabClass).siblings('div').removeAttr('style');
                $('#' + tabClass).fadeIn();
              }


              console.log($('.sign-up-form-group .o-label').outerHeight());
              if($('.sign-up-form-group .o-label').outerHeight() > 32 ) {
                $('.sign-up-form-group .o-label').addClass('twoline');
              }


              if($el.data('id') == 'saved_articles')
                module.fetchSavedArticles(true); // load saved articles
              else if ($el.data('id') == 'recommended_articles')
                module.fetchRecommendedArticles(true, 'all', 1); // load recommended articles
            })
          });
        });


        $('.js-recommended').livequery(function(){
          var $el = $(this);

          $el.each(function(){
            $el.on('click',function(){
              currentRecommendedPage = 1;
              $('.js-load-more--recommended').addClass('hidden');
              module.fetchRecommendedArticles(true, $el.data('type'), 1);
            });
          });
        });

        $('.js-load-more--recommended').livequery(function(){
          $(this).on('click', function() {
            $('.js-load-more--recommended').addClass('hidden');
            $('.js-preloader--recommended-articles').removeClass('is-hidden');
            currentRecommendedPage++;
            module.fetchRecommendedArticles(true, currentRecommendedTab, currentRecommendedPage) 
          });
        });
      };

      var removeBookmark = function () {
        $('.my-saved-article ul li').livequery(function(){
          var $el = $(this),
              $remove = $el.children('.remove-bookmark'),
              $confirm = $el.find('.delete-confirmation');

          $remove.each(function(){
            $remove.on('click',function(){
              $remove.fadeOut();
              // $(this).siblings('.saved-article-list').fadeOut();
              $(this).parent().find('.delete-confirmation').addClass('show');
            });
          });
          $confirm.find('a').each(function(){
            $(this).on('click',function(){
              console.log('test');
              if($(this).hasClass('will-remove')) {
                  var $parent_li = $(this).parents('li'),
                      post_id = $parent_li.data('id');

                  if($parent_li.parents('#we-recommend-you').length > 0) {
                      removeArticleFromRecommended(post_id);

                      $recommendedArticleContainer.show();
                      $recommendedArticle.find('.account-header-info, .myaccount-filter,.my-saved-article').hide();
                      $('.js-preloader--recommended-articles').removeClass('is-hidden');
                      $recommendedArticle.find('.my-saved-article ul').html('');
                      $recommendedArticle.find('.myaccount-filter ul li[data-type=all]').click();

                      $recommendedArticleFirstLogContainer.hide();
                      $recommendedArticleContainer.hide();
                  } else if($parent_li.parents('#saved-article').length > 0) {
                      app.bookmark.ajaxBookmark(post_id);

                      $savedArticleContainer.show();
                      $savedArticle.find('.account-header-info, .myaccount-filter,.my-saved-article').hide();
                      $('.js-preloader--saved-articles').removeClass('is-hidden');
                      $savedArticle.find('.my-saved-article ul').html('');
                      $savedArticle.find('.myaccount-filter ul li[data-type=all]').click();

                      $savedArticleFirstLogContainer.hide();
                      $savedArticleContainer.hide();
                  }

                  $parent_li.remove();
              } else if($(this).hasClass('cancel-delete')) {
                $remove.removeAttr('Style');
                $('.saved-article-list').removeAttr('Style');
                $confirm.removeClass('show');
              }
            });
          });

        });
      };

      var accountFilterBtn = function () {
        $('.account-filterBtn').livequery(function(){
          var $el = $(this);
          $el.on('click',function(){
            if($el.hasClass('opened')) {
              $el.removeClass('opened');
              $el.parent('div').removeClass('opened');
              $el.siblings('ul').removeClass('opened');
            } else {
              $el.addClass('opened');
              $el.parent('div').addClass('opened');
              $el.siblings('ul').addClass('opened');
            }
          });
        });
      };

      var accountFilterSelect = function () {
        $('.myaccount-filter ul li').livequery(function(){
          var $el = $(this);
          $el.each(function(){
            $el.on('click',function(){
              var $filter = $(this).text(),
                  filterType = $(this).data('type'),
                  $accountsTab = $(this).parents('.accounts-tab');
              $('.account-filterBtn').html($filter + '<span></span>').removeClass('opened');
              $('.myaccount-filter,.myaccount-filter ul').removeClass('opened');

              // add active class
              $accountsTab.find('.myaccount-filter ul li').removeClass('active');
              $(this).addClass('active');

              // show all items
              $accountsTab.find('li.collection-item').removeClass('is-hidden');

              if(filterType != 'all') {
                // only show items of the selected type
                $accountsTab.find('li:not(.collection-item--' + filterType+')').addClass('is-hidden');
              }
            });
          });
        });
      };

      var openAccount = function () {
        $('.c-menu__link__account--loggin').livequery(function(){
          var $el = $(this);
          $el.on('click',function(){

            closeOpenModal();

            $('.accounts-container').removeAttr('style');

            if($('body').hasClass('home')){
              if( $('.js-hero').outerHeight() > app.$window.scrollTop() ) {
                currentPageYOffset = $('.js-body').offset().top;
                $("html,body").animate({
                  scrollTop : currentPageYOffset
                },800);
              } else {
                currentPageYOffset = window.pageYOffset;
              }
              if(!$el.hasClass('showDetails')){
                $el.addClass('showDetails');
                $('.accounts-container').addClass('show-home');
                $('.js-header').addClass('is-header--force-fixed');
                app.$body.addClass('u-no-scroll');
              }

            } else {
              if(!$el.hasClass('showDetails')){
                $el.addClass('showDetails');
                $('.accounts-container').addClass('show');
                $('.js-header').addClass('is-header--force-fixed');
                currentPageYOffset = window.pageYOffset;
                app.$body.addClass('u-no-scroll');
              }
            }
            $('.account-menu-container a[data-id=saved_articles]').click();
          });
          $('.close-account').on('click',function(){
            module.closeAccountsModal();
          });
        });
      };

      /**
       * Saved Articles
       */

      var populateSavedArticles = function(data) {
        $savedArticle.find('.my-saved-article').fadeIn();
        for( var key in data.results ) {
          if (data.results.hasOwnProperty(key)) {
            var result = data.results[key];
            if($savedArticle.find('.collection-item--article[data-id="'+result.ID+'"]').length == 0)
              bindSavedArticlesTemplate(result);
          }
        }
      }

      var bindSavedArticlesTemplate = function (data) {
        var tmpl = $('#tmplAccountArticlesResult').html(),
           $html = Mustache.to_html(tmpl, data);
        $savedArticle.find('.my-saved-article ul').append($html);
      };

      /***/

      var bindLinks = function() {

        $('.go-to-my-details-page').on('click', function(e) {
          e.preventDefault();
          var $el = $(this);
          $('.account-menu-container a[data-id=my_details]').click();

          return false;
        });

        $('.startreading').on('click', function(e) {
          e.preventDefault();
          var $el = $(this);
          $('.close-account').click();
          return false;
        });

      };

      var bindVariables = function() {
        var windowWidth = app.$window.outerWidth();
        if(app.breakpoint.medium <= windowWidth) { // desktop
          maxItems = 16;
          currentBreakpoint = 'desktop';
        } else if(app.breakpoint.small <= windowWidth) { // tablet
          maxItems = 8;
          currentBreakpoint = 'tablet';
        } else { // mobile
          maxItems = 4;
          currentBreakpoint = 'mobile';
        }
      };

      var _onResize = function() {
        var oldBreakpoint = currentBreakpoint,
            activeId = $('.account-menu-container a.active').data('id');
        bindVariables();
        if(oldBreakpoint !== currentBreakpoint) {
          if(activeId === 'recommended_articles') {
            module.fetchRecommendedArticles(true);
          }
        }
      };
      app.$window.on('resize', _onResize);


      /**
       * Recommended Articles
       */

      var populateRecommendedArticles = function(data) {
        $recommendedArticle.find('.my-saved-article').fadeIn();
        for( var key in data.results ) {
          if (data.results.hasOwnProperty(key)) {
            var result = data.results[key];
            if($recommendedArticle.find('.collection-item--article[data-id="'+result.ID+'"]').length === 0){
              bindRecommendedArticlesTemplate(result);
            }
          }
        }
      };

      var bindRecommendedArticlesTemplate = function (data) {
        var tmpl = $('#tmplAccountArticlesResult').html(),
           $html = Mustache.to_html(tmpl, data);
        $recommendedArticle.find('.my-saved-article ul').append($html);
      };

      var removeArticleFromRecommended = function(post_id) {
          var excluded_ids = [];
          $recommendedArticle.find('.my-saved-article ul li').each(function(index) {
              excluded_ids.push($(this).data('id'));
          });

          $.ajax({
              url: "/wp-admin/admin-ajax.php?action=remove_from_recommended",
              type: "POST",
              data: {
                  'post_id' : post_id,
                  'max' : maxItems,
                  'excluded_ids' : excluded_ids,
              },
              success: function(data){
                if(data == 0){
                  var $lang = $('html').attr('lang');
                  if($lang == 'en-US') {
                    document.location.href = '/en';
                  } else {
                    document.location.href = '/fr';
                  }
                }
                module.fetchRecommendedArticles(true, currentRecommendedTab, 1);
              }
          });
      };

      /***/

      var closeOpenModal = function() {
        if($('.openSearch').hasClass('open')) {
          $('.openSearch').click();
        }
        if( $('.js-burger').hasClass('c-burger--active') ) {
          app.nav.closeBurgerNav();
        }
        if( $('.js-menu__item').hasClass('is-active') ) {
          app.nav.closeDropdownNav();
        }
        if( $('.js-nav--social').hasClass('is-active') ) {
          app.nav.closeSocialNav();
        }
        app.snackable.closeSnackable();
      };

		/***********************************
		 * public application definition
		 */


      /**
       * Saved Articles
       */

      module.fetchSavedArticles = function(is_load_all) {
        if($savedArticle.length == 0) return ;

        // if(is_load_all) {
          $savedArticleContainer.show();
          $savedArticle.find('.account-header-info, .myaccount-filter,.my-saved-article').hide();
          $('.js-preloader--saved-articles').removeClass('is-hidden');
          $savedArticle.find('.my-saved-article ul').html('');
          $savedArticle.find('.myaccount-filter ul li[data-type=all]').click();

          $savedArticleFirstLogContainer.hide();
          $savedArticleContainer.hide();
        // }

        // fetch articles
        $.ajax({
          url: "/wp-admin/admin-ajax.php?action=saved_articles",
          type: "GET",
          data: {},
          success: function(data){
            if(data == 0){
              var $lang = $('html').attr('lang');
              if($lang == 'en-US') {
                document.location.href = '/en';
              } else {
                document.location.href = '/fr';
              }
            }
            $('.js-preloader--saved-articles').addClass('is-hidden');
            if(data.totalResults == 0) {
              $savedArticleFirstLogContainer.fadeIn();
            } else {
              App.savedArticles = data;
              populateSavedArticles(data);;
              $savedArticleContainer.fadeIn();
              $savedArticle.find('.account-header-info').html(data.headerInfo);
              $savedArticle.find('.account-header-info, .myaccount-filter').fadeIn();
            }
          }
        });
      };

      /***/


      /**
       * Recommended Articles
       */

      module.fetchRecommendedArticles = function(is_load_all, type, page) {
        if($recommendedArticle.length == 0) return ;

        if(page === undefined) { page = 1; }
        currentRecommendedTab = type;

        if(page == 1) {
          currentRecommendedPage = 1;
          $recommendedArticleContainer.show();
          $recommendedArticle.find('.account-header-info, .myaccount-filter,.my-saved-article').hide();
          $('.js-preloader--recommended-articles').removeClass('is-hidden');
          $recommendedArticle.find('.my-saved-article ul').html('');
          $recommendedArticle.find('.myaccount-filter ul li').removeClass('active');

          $recommendedArticleFirstLogContainer.hide();
          $recommendedArticleContainer.hide();
        }

        if(type == 'article') {
          $recommendedArticle.find('.myaccount-filter ul li[data-type=article]').addClass('active');
        } else if(type == 'event') {
          $recommendedArticle.find('.myaccount-filter ul li[data-type=event]').addClass('active');
        } else {
          $recommendedArticle.find('.myaccount-filter ul li[data-type=all]').addClass('active');
        }

        // fetch articles
        $.ajax({
          url: "/wp-admin/admin-ajax.php?action=recommended_articles",
          type: "GET",
          data: { 'max' : maxItems, 'type' : type, 'page' : page },
          success: function(data){
            if(data == 0){
              var $lang = $('html').attr('lang');
              if($lang == 'en-US') {
                document.location.href = '/en';
              } else {
                document.location.href = '/fr';
              }
            }

            $('.js-preloader--recommended-articles').addClass('is-hidden');

            if(data.article_cnt === 0 && data.event_cnt) {
              $recommendedArticleFirstLogContainer.fadeIn();
            } else {
              App.recommendedArticles = data;
              populateRecommendedArticles(data);
              $recommendedArticleContainer.fadeIn();
              $recommendedArticle.find('.account-header-info').html(data.headerInfo);
              $recommendedArticle.find('.account-header-info, .myaccount-filter').fadeIn();
              if(data.totalResults > maxItems && (maxItems * page-1) <= data.totalResults) {
                $recommendedArticle.find('.js-load-more--recommended').removeClass('hidden');
              }
            }

          }
        });
      };

      /***/


		/***********************************
		 * global app declaration of events and methods
		 */

    module.closeAccountsModal = function() {
      if($('body').hasClass('home')){
        $('.c-menu__link__account--loggin').removeClass('showDetails');
        $('.accounts-container').removeClass('show-home');
        $('.js-header').removeClass('is-header--force-fixed');
        app.$body.removeClass('u-no-scroll');
      } else {
        $('.c-menu__link__account--loggin').removeClass('showDetails');
        $('.accounts-container').removeClass('show');
        $('.js-header').removeClass('is-header--force-fixed');
        app.$body.removeClass('u-no-scroll');
      }
      if(currentPageYOffset > 0)
        $(window).scrollTo(currentPageYOffset);
    };

		// module init method;
		// NOTE: important for initializing the module will be called dynamically
		module.init = function() {
          bindVariables();
          accountsTab();
          removeBookmark();
          accountFilterBtn();
          accountFilterSelect();
          openAccount();
          bindLinks();
		};


		return module;
	})(window, jQuery, window.App)
);
