App.module.create(
  'search', (function (window, $, app) {
    'use strict';

    // define module object
    var module = {},
        $sortValue = $('.sortvalue'),

        $searchValue = $('.js-search input[type=search]'),
        $searchFilterBox = $('.search-filterbox--container'),
        $placeholder = $searchValue.attr('placeholder'),
        $filterCategory = '',
        $filterType = '',
        currentPageYOffset = 0,
        $card = $('.js-card'),
        $cardToggle = $('.js-card__toggle'),
        $navDropdown = $('.js-nav--dropdown'),
        $navDropdownItem = $navDropdown.find('.js-menu__item'),
        $xhrPool = [],
        $preloader = $('.js-preloader--search');
    /***********************************
     * private variables
     */

    /***********************************
     * private methods
     */

    /***********************************
     * public application definition
     */
    var seachDisplay = function () {
      $('.openSearch').livequery(function () {
        $(this).on('click', function () {
          $preloader.addClass('is-hidden');
          if ($(this).hasClass('open') && $navDropdownItem.hasClass('is-active')) {
            openSearchFunc();
            setTimeout(closeDropdown, 650);
          } else if ($(this).hasClass('open')) {
            $('.c-search-close').click();
            $cardToggle.css('visibility', 'visible');
          } else {
            openSearchFunc();
            setTimeout(closeDropdown, 650);
          }

        });

        // open search
        var openSearchFunc = function () {
          if($('.login-register--container').hasClass('open-login') || $('.login-register--container').hasClass('open-login-home')) {
            $('.login-register--container').css({display: 'none'});
            app.forgotPassword.closeForgotPasswordModal();
            app.loginRegister.closeLoginRegisterModal();
          }

          if($('.accounts-container').hasClass('show') || $('.accounts-container').hasClass('show-home')) {
            $('.accounts-container').css({display: 'none'});
            app.myaccounts.closeAccountsModal();
          }
          
          if($('.js-burger').hasClass('c-burger--active')) {
            $('.js-burger-toggle').click();
          }
          $('.js-search, .c-search--overlay').stop();

          if( $('.js-hero').outerHeight() > app.$window.scrollTop() ) {
            $("html,body").animate({
              scrollTop : $('.js-body ').offset().top
            }, 1000);
          }

          currentPageYOffset = window.pageYOffset;
          if ($('.js-nav--social').hasClass('is-active')) {
            $('.js-nav--social').removeClass('is-active');
            $('.js-header').css('top', 0);
          }

          if ($cardToggle) { setTimeout(function () { $cardToggle.css('visibility', 'hidden');}, 450); }

          if ($cardToggle.hasClass('is-card-toggle--active') && $card.hasClass('is-card--move')) {
            app.$body.removeClass('u-no-scroll has-card-open');
            $('.js-card__toggle').removeClass('is-card-toggle--active').css('visibility','hidden');
            $('.js-card__toggle__item, [data-card-id]').removeClass('is-card-toggler--active');
            $('.js-body').removeClass('is-body--move');
            $('.js-footer').removeClass('is-footer--move');
            $('.js-main').css({'overflow-x':'hidden', 'top':''});
            $('.js-card').removeClass('is-card--move');
            $('.js-card__wrapper').remove();
            $('.c-snackable').removeAttr('style');
            app.$html.removeClass('u-no-scroll');
          }

          $('.js-search').show();
          //$('footer').addClass('fixed');
          app.snackable.closeSnackable();

          if( app.$doc.find(".js-video__more").length ){
            app.$doc.find('.c-morevideo--button').removeClass("is-active");
            app.$doc.find(".js-video__more").removeClass("is-shown").slideUp();
            app.$doc.find('.c-video__container').removeClass("more--videos");
          }

          //$('.c-search--overlay').animate({opacity: '1'}, 700, function(){
            $('.js-search,.c-search--overlay').css('opacity','1');
            $('.c-search--overlay').css({display:'block'});
            $('.openSearch').addClass('open');
            $('.js-hero').addClass('hidden');
            $('body').addClass('u-no-scroll');
            $('.c-breaker').css('display','none');

            if(!is_iOS) {
              $('html').css({'height':'auto'});
            }
            $(window).scrollTo(currentPageYOffset);

            $('.js-header').addClass('is-header--force-fixed');
            $('#mainsearch input[type=search]').focus();
          //});
        }

        // close dropdown
        var closeDropdown = function () {
          if ($navDropdownItem.hasClass('is-active')) {
            $navDropdownItem.removeClass('is-active');
            $('.js-overlay').removeClass('o-overlay--menu');
          }
        }

        $('.c-search-close').on('click',function(e) {
            e.preventDefault();
            $('.js-search,.c-search--overlay').stop();
            $('.c-search-bg').show();
            //$('footer').removeClass('fixed');

            if(!($('.c-search-result').css('display') == 'block') && !($('.c-search-noresult').css('display') == 'block')) {
              $('html,body').removeAttr('style');
              $('.home .o-body').css('top','100%');
              $('.c-breaker').css('display','');
              $('.js-hero').removeClass('hidden');
              $('body').removeClass('u-no-scroll');

              $('.c-search--overlay').animate({opacity: '0'},700, function() {
                $('.openSearch').removeClass('open');

                $('html,body').removeAttr('style');

                $('.js-search,.c-search--overlay').css('opacity','0');
                $('.c-search--overlay').css({display:'none'});
                $('.js-search').hide();

                $('.js-header').removeClass('is-header--force-fixed');
                $(window).scrollTo(currentPageYOffset);
                if(is_iOS) {
                  $('html').removeClass('u-no-scroll has-search-open');
                  $(window).scrollTo(currentPageYOffset);
                }
              });
            }
            $('.c-search').removeClass('scrollon');
            $('.c-search-form').removeClass('animate');
            $('.c-search-noresult, .c-search-result').removeAttr('style');
            $('.c-search--dcontent').html($placeholder);
            $('.js-search input[type=search]').val('');

            $('.js-search input[type=search]').siblings('button').css({display: 'none'}).animate({
              opacity: '0'
            });
            setTimeout(function () {
              $cardToggle.css('visibility', 'visible');
            }, 850);

            $searchValue.data('status', 'abort-search');
            $preloader.addClass('is-hidden');

        });

        $('.js-search-again').on('click', function() {
          $('.c-search-close').trigger('click');
          $('.js-search input[type=search]').focus();
        });

      });
    };
    var updateSearch = function () {
      $('.js-search').livequery(function () {
        $('.js-search input[type=search]').each(function () {
          $(this).on('focus',function(){
            $(this).val('');
            $('.c-search--dcontent').html($placeholder);
            if(is_iOS) {
              $('html').addClass('u-no-scroll has-search-open');
            }
          });
          $(this).on('keyup', function () {
            var $searchContent = $(this).val();
            $('.c-search--dcontent').html($searchContent);
            if ($(this).val() == '') {
              $('.c-search--dcontent').html($placeholder);
              //$('.c-search-form').removeClass('animate');

              $(this).siblings('button').css({display: 'none'}).animate({
                opacity: '0'
              });
            } else {
              $(this).siblings('button').css({display: 'block'}).animate({
                opacity: '1'
              });
            }
          });
        });
      });
    };
    //Sample Animation for Search
    var mainSearchAnimation = function () {
      $('.c-search-form').livequery(function () {
        var $el = $(this),
          $form = $('#mainsearch');

        $form.submit(function (event) {
          $('.js-search input[type=search]').focusout();
          event.preventDefault();
          var searchValue = $searchValue.val();

          $('.c-search-noresult').css({display:'none'});
          $preloader.addClass('o-preloader--search__initial-show');

          if($('.c-search-result').css('display') == 'block') {
            $preloader.removeClass('o-preloader--search__initial-show');
          }


          $('.home .o-body').css('top','0');
          $('html,body').css({overflow: 'hidden'});

          $('.c-search').addClass('scrollon');
          $('.c-search-bg').fadeOut();
          $('.js-search input[type=search]').blur();

          $el.addClass('animate');
          $form.data('last-search', searchValue);
          $searchValue.data('status', 'search');

          $('.c-search-result').hide();
          $('.search-filter-resultbox').hide();

          resetFilter();
          clearResults();

          doSearch(searchValue, 1);
        });


      });
    };

    var doSearch = function(searchValue, currentPage) {

      var jqXHR = $.ajax({
        url: "/wp-admin/admin-ajax.php?action=search",
        type: "GET",
        data: {
          search_value : searchValue,
          page : currentPage,
          sort : $sortValue.text(),
          filter_type : $filterType,
          filter_category : $filterCategory
        },
        success: function(data){
          if($('#mainsearch').data('last-search') != searchValue)
            return;

          if($searchValue.data('status') == 'abort-search') {
            return;
          }


          if(data.totalResults == 0) {
            $('.c-search-noresult').fadeIn();
            $('.c-search-result').fadeOut();
            $('.c-search-noresult span').text(searchValue);
            $preloader.addClass('is-hidden');
          } else {
            App.searchResults = data;
            populateSearchResults(data);
            if(data.totalResults > data.totalDisplayed) {
              doSearch(searchValue, currentPage+1);
            } else {
              $preloader.addClass('is-hidden');
            }
            $('.c-search-noresult').fadeOut();
            $('.c-search-result').fadeIn();

          }
          $preloader.removeClass('o-preloader--search__initial-show');
        }
      });
      $xhrPool.push(jqXHR);

    }

    var abortXHR = function() {
        $.each($xhrPool, function(idx, jqXHR) {
            jqXHR.abort();
        });
    }

    var populateSearchResults = function(data) {
      $('.c-search-result--title span').text(data.totalResults);

      for( var key in data.results ) {
        if (data.results.hasOwnProperty(key)) {
          var result = data.results[key];
          bindTemplate(result);
        }
      }
    }

    var bindTemplate = function (data) {
      var tmpl = $('#tmplSearchResults').html(),
         $html = Mustache.to_html(tmpl, data);

      $('.c-search-result ul').not('.ul-sort').append($html);
    };

    var filterShow = function () {
      $('.filter-btn').livequery(function () {
        var $el = $(this);

        $el.on('click',function(){
          if($el.hasClass('opened')){
            $el.removeClass('opened');
            $('.search-filterbox').removeClass('opened');
            //$('.clearall-btn').click();
            $('.whiteoverlay').removeClass('show');
          } else {
            $el.addClass('opened');
            $('.search-filterbox').addClass('opened');
            $('.whiteoverlay').addClass('show');
          }
        });

        $('.cancel-filter--btn').on('click',function(){
          $el.click();
        });

        $('.filter-submit').on('click', function(e) {
          e.preventDefault();
          $('.c-search-result').hide();
          $('.search-filter-resultbox').hide();
          $el.click();
          clearResults();
          checkFilter();
          $searchValue.data('status', '');
          doSearch($searchValue.val(), 1);
        });
      });


    }
    var customFilter = function () {
      $('.checkbox-custom').livequery(function () {
        var $el = $(this);
        $el.each(function(){
          $el.on('click',function(){
            if($el.hasClass('checked')) {
              $el.removeClass('checked');
              $el.siblings('label').removeClass('checked');
              $el.siblings('input[type=checkbox]').removeAttr('checked');
            } else {
              $el.addClass('checked');
              $el.siblings('label').addClass('checked');
              $el.siblings('input[type=checkbox]').attr('checked','checked');
            }
          });
        });
        $('.clearall-btn').on('click',function(){
          $('.checkbox-custom,.search-filterbox--container label').removeClass('checked');
          $('.search-filterbox--container input[type=checkbox]').removeAttr('checked');
        });
      });

      $('.close-filter-result').livequery(function() {
        var $el = $(this);
        $el.on('click', function() {
          $('.search-filter-resultbox').hide();
          $('.c-search-result').hide();
          resetFilter();
          clearResults();
          doSearch($searchValue.val(), 1);
        });
      });
    };


    var customSort = function () {
      $('.sortvalue').livequery(function () {
        var $el = $(this);
        $el.on('click',function(){
          if($el.hasClass('opened')){
            $el.removeClass('opened');
            $('.clearall-btn').click();
            $('.sortbox,.sort-container').removeClass('opened');
            $('.whiteoverlay').removeClass('show');
          } else {
            $el.addClass('opened');
            $('.sortbox,.sort-container').addClass('opened');
            $('.whiteoverlay').addClass('show');
            $('.clearall-btn').click();
          }
        });
      });
    };
    var customSortValue = function () {
      $('.js-sort__search ul li').livequery(function () {
        var $el = $(this);

        $el.each(function(){
          $el.on('click',function(){
            var $svedValue = $(this).text();
            $('.sortvalue').text($svedValue).click();
            $('#sortvalue').val($svedValue);
            clearResults();
            doSearch($searchValue.val(), 1);
          });
        });

      });
    };

    var getIcon = function(type) {

    }


    var clearResults = function() {
      abortXHR();
      $('.c-search-result ul').not('.ul-sort').html('');
      setTimeout(function(){
        $preloader.removeClass('is-hidden');
      }, 650);
    }

    var checkFilter = function() {
      var filterStr = '',
          ctr = 0,
          count = $('.checkbox-custom.checked').length,
          filterTypeArray = [],
          filterCategoryArray = [];

      $('.checkbox-custom', $searchFilterBox).livequery(function() {
        var $el = $(this),
            $tmpArray = [];
        $el.each(function() {
          if($(this).hasClass('checked')) {
            if(ctr != 0 && ctr != ($('.search-filterbox--container .checkbox-custom.checked').length - 1))
              filterStr += ', <strong>' + $(this).siblings('label').text() + '</strong>';
            else if(ctr == ($('.search-filterbox--container .checkbox-custom.checked').length - 1) && ctr != 0)
              filterStr += ' and <strong>' + $(this).siblings('label').text() + '</strong>';
            else
              filterStr += '<strong>' + $(this).siblings('label').text() + '</strong>';
            ctr++;
          }
        });
      });

      if($('.search-filterbox--container .checkbox-custom.checked').length) {
        $('.search-filter-resultbox').html('Filtered by ' + filterStr);
        $('.search-filter-resultbox').append('<a class="close-filter-result"><svg class="o-icon o-icon--cross"><use xlink:href="#close"></use></svg></a>');
        $('.search-filter-resultbox').show();
        $('.sortbox,.sort-container').addClass('filtered');
        $searchFilterBox.hide();
      } else {
        $('.search-filter-resultbox').hide();
        $searchFilterBox.show();
        $('.sortbox,.sort-container').removeClass('filtered');
      }

      $('.filter-type .checkbox-custom.checked').each( function() {
        filterTypeArray.push($(this).siblings('label').text());
      });

      $('.filter-category .checkbox-custom.checked').each( function() {
        filterCategoryArray.push($(this).siblings('input').val());
      });

      $filterType = filterTypeArray.join(',');
      $filterCategory = filterCategoryArray.join(',');
    }

    var resetFilter = function() {
      $('.search-filterbox--container').show();
      $('.search-filter-resultbox').hide();
      $('.search-filterbox--container').show();
      $('.sortbox,.sort-container').removeClass('filtered');
      $('.checkbox-custom').livequery(function() {
        var $el = $(this);
        $el.each(function() {
          $el.removeClass('checked');
          $el.siblings('label').removeClass('checked');
          $el.siblings('input[type=checkbox]').removeAttr('checked');
        });
      });
      $filterType = '';
      $filterCategory = '';
    }

    /***********************************
     * global app declaration of events and methods
     */

    // module init method;
    // NOTE: important for initializing the module will be called dynamically
    module.init = function () {
      updateSearch();
      mainSearchAnimation();
      seachDisplay();
      customFilter();
      filterShow();
      customSort();
      customSortValue();
    };


    return module;
  })(window, jQuery, window.App));
