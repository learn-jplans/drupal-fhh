App.module.create(
  'transporter',
  (function(window, $, app) {
  'use strict';

  // define module object
  var module = {};

  /***********************************
  * private variables
  */
  	var hasArticle = $('.js-section-article:not(".is-author")').length,
        isVideoArticle = $('.js-video__more').length,
        isHomePage = $('body.home').length,
        $header = $('.js-header'),
        headerHeight = $header.outerHeight(),
        winHeight = app.$window.height(),
        siteName = 'HH Journal - ',
    		scrolled = false,
    		postsLoaded = [];

  /***********************************
  * private methods
  */
  var transporterArticle = function() {
    // current article
    var $el = $('.js-section-article.is-active:not(".is-author")'),
        winScrollPosition   = app.$window.scrollTop(),
        elStart             = $el.offset().top  - headerHeight,
        elEnd               = $el.offset().top + $el.outerHeight() - winHeight,
        elContentHeight     = elEnd - elStart,
        elTransporterHeight = $el.next().outerHeight(),
        elHeight            = elEnd - elStart + elTransporterHeight,
        elScrollPosition    = winScrollPosition - elStart,
        elScrolled          = (elScrollPosition / elHeight) * 100;

    // current article elements
    var $elHeaderBar  = $el.find('.js-header--article'),
        $elMoreVideo  = app.$doc.find('.js-video__more'),
        $elVideo      = app.$doc.find('.c-video__container'),
        $elMoreVidBtn = app.$doc.find('.c-morevideo--button'),
        $elHeader     = $el.find('.js-article__head'),
        $elSocial     = $elHeader.find('.c-article__social'),
        elSocialEnd   = $elSocial.offset().top + $elSocial.outerHeight() - headerHeight;

    // toggle dark overlay
    if ( elScrollPosition > (elContentHeight + (elTransporterHeight/2)) ) {
      $el.addClass('has-overlay');
    } else {
      $el.removeClass('has-overlay');
    }

    // load next article
    if ( elScrollPosition > (elHeight - 600) ) {
      // console.log("load next article");
      loadNextArticle($el);
    }

    // toggle article sticky header
    var articleHeader = function () {

      var headerHeight = $header.outerHeight();

      if ( winScrollPosition >= elSocialEnd && elScrollPosition < (elHeight - 600) ) {
        $elHeaderBar.css('top', headerHeight);
      } else {
        if( $elMoreVideo.length ){
          $elVideo.removeClass('more--videos');
          $elMoreVideo.slideUp('300', function(){
            $elHeaderBar.css('top', '-50%');
          });
          $elMoreVidBtn.removeClass('is-active');
        } else {
          $elHeaderBar.css('top', '-50%');
        }
      }
    };

    app.$window.on('resize', articleHeader);
    articleHeader();

    // toggle active state
    if ( winScrollPosition <= (elStart - winHeight + headerHeight) ) {
      // previous article
      var $elPrev = $el.prev().prev().prev(),
          elPrevData  = $elPrev.find('.js-article').data('article');

      $el.removeClass('is-active');
      $elPrev.addClass('is-active');
      udpateUrl(elPrevData);
    } else if ( elScrollPosition >= elHeight ) {
      // next article
      var $elNext = $el.next().next().next();

      if ( $elNext.length && $elNext.hasClass('js-section-article') ) {
        var elNextData = $elNext.find('.js-article').data('article');

        $el.removeClass('is-active');
        $elNext.addClass('is-active');
        udpateUrl(elNextData);
      }
    }
  };

  var loadNextArticle = function($el) {
    var $elTransporter = $el.next(),
        $elDefaultNext = $elTransporter.find('.c-tile--trend:first'),
        nextArticleId = $elDefaultNext.data('id');

    if (!$elDefaultNext.data('loaded')) {
      loadThisPost(nextArticleId, $el.data('id'));
    }
  };

  var udpateUrl = function(articleData) {
  	//update url
    // console.log("url changed to: "+articleData.path);
  	History.pushState(null, siteName + articleData.title, articleData.path);
  };

  var closeArticleHeader = function () {
    $('.js-header--article').livequery(function () {
      var $el = $(this),
        $close = $el.find('.js-header--article__close'),
        $activeArticle = $el.parent();

        $close.on('click', function() {
          $el.css('top', '0%');
        });

    });
  };

  var bindLoadArticle = function() {
    $('.js-videotransporter .c-tile--trend:first-child').livequery( function(e){
      $(this).addClass('is-active');
    });

  	$('.js-videotransporter .c-tile--trend').livequery( function(e) {
  		var $el = $(this),
  			$elId = $el.data('id'),
  			$elParentId = $el.parent().data("id"),
  			$elTransporter = $el.parents('.m-videotransporter');

	  	$el.on("click", function(e) {
	  		e.preventDefault();
	  		loadThisPost($elId, $elParentId, 1);
        $el.siblings().removeClass('is-active');
        $el.addClass('is-active');
		  });
  	});
  };

  var incrementPageVisit = function(post_id) {
    $.ajax({
      url: "/wp-admin/admin-ajax.php?action=popularity_increment",
      type: "GET",
      data: {
        post_id: post_id,
      },
      success: function(data){
        // console.log('page visit count +1');
      }
    });
  };

  var firstLoad = function() {
  	var	$firstArticle = $('.js-section-article'),
  		firstArticleId = $firstArticle.data('id'),
  		$activeTransporter = $firstArticle.next(),
  		$firstRelated = $activeTransporter.find('.c-tile--trend:first'),
  		firstRelatedID = $firstRelated.data('id');

  	$firstArticle.addClass('is-active');

  	postsLoaded.push(firstArticleId);

  	if (!$firstRelated.data('loaded')) {
  		loadThisPost(firstRelatedID, firstArticleId);
      incrementPageVisit(firstArticleId);
  	}
  };

  var loadThisPost = function(relatedId, activeArticleId, reload ) {
  	var $tile = $('.c-tile--trend[data-id='+relatedId+']'),
  		$tranporterContainer = $('.m-videotransporter[data-id='+activeArticleId+']'),
  		$prevArticle = $tranporterContainer.prev(),
  		$preloader = $tranporterContainer.next(),
  		$currentLoadedPosts = $preloader.nextAll(),
      $currentLoadedPostsHeight = $currentLoadedPosts.height();

    $preloader.css('height', '');
  	$preloader.show();
  	reload = reload || false;

  	$tile.data('loaded', 1);
  	postsLoaded.push(relatedId);

  	if(reload) {
  		$prevArticle.addClass('is-active');
      $preloader.css('height', $currentLoadedPostsHeight);
  		$currentLoadedPosts.remove();
  	}

  	$.ajax({
  		url: "/wp-admin/admin-ajax.php?action=transporter_post",
  		type: "GET",
  		data: {
  			article_id: relatedId,
  			not_in: postsLoaded
  		},
  		success: function(data){
        // $preloader.hide();
  			$preloader.fadeOut(1100, "linear");
  			$(data).insertAfter($preloader);
        incrementPageVisit(relatedId);
  			App.sidebar.sidebarArticle();

        // scroll to the new reloaded article
        if(reload) {
          // run after the preloader fadeout
          setTimeout(function(){ 
            var $el = $preloader.next(),
                $scrollHere = ($el.offset().top  - headerHeight);

            $('html, body').animate({
             scrollTop: $scrollHere
            }, 800);
          }, 1110);
        }
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
    if(isHomePage) {
      return;
    }

  	if (hasArticle || isVideoArticle) {
  		firstLoad();
  		bindLoadArticle();

  		$(window).scroll(function() {
  		  scrolled = true;
  		});

  		setInterval(function() {
		    if ( scrolled ) {
		        scrolled = false;
            transporterArticle();
		    }
  		}, 50);

      closeArticleHeader();
  	}

  };


  return module;
  })(window, jQuery, window.App)
);
