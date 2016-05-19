
/*
 * Timeline
 */

App.module.create(
  'articleAjax',
  (function(window, $, app) {
  'use strict';

  // define module object
  var module = {};

  /***********************************
  * private variables
  */

    //var $anchorSnackables = $('.js-snackable__link');


  /***********************************
  * private methods
  */


  /***********************************
  * public application definition
  */

  var loadSnackableItem = function() {
    $('.js-snackable__link').livequery( function(e) {
      $(this).each( function() {
        var $el = $(this);

        $el.on('click', function(e) {
          e.preventDefault();
          var $parentDiv = $el.parents('.c-tile'),
              $siblingLinks = $parentDiv.siblings();
          var $article_id = $el.data('article-id');



          $.ajax({
            // url: "/wp-admin/admin-ajax.php?action=load_article",
            url: "/wp-admin/admin-ajax.php?action=transporter_post",
            type: "GET",
            data: {article_id : $article_id, is_snackable : true},
            success: function(data){
              $('.js-section-article.is-active #c-snackable-content, .c-snackable-home #c-snackable-content').html(data).delay(1000).animate({opacity: '1'},1000);
              $('.js-section-article.is-active .c-snackablecontent--close, .c-snackable-home .c-snackablecontent--close').addClass('show');
              $('.js-section-article.is-active .c-snackable, .c-snackable-home').removeClass('slideDown').addClass('loaded');
            }
          });

          if($parentDiv.hasClass('active')) {

            $parentDiv.removeClass('active');
            $siblingLinks.removeClass('active');
            $('html').removeAttr('style');
            $('.js-section-article.is-active .c-snackablecontent--close, .c-snackable-home .c-snackablecontent--close').addClass('show');

          } else {

            $parentDiv.addClass('active');
            $siblingLinks.removeClass('active');
            $('.js-section-article.is-active .c-snackablecontent--close, .c-snackable-home .c-snackablecontent--close').removeClass('show');

            app.disablePageScroll();

          }

          app.$window.trigger("EVENT_SHOW_SNACKABLE_ARTICLE");


        });
      });


    });
  }


  /***********************************
  * global app declaration of events and methods
  */

  // module init method;
  // NOTE: important for initializing the module will be called dynamically
  module.init = function() {
    loadSnackableItem();
  };


  return module;
  })(window, jQuery, window.App)
);
