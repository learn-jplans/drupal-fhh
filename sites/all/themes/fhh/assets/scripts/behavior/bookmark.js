/*
 * Event Tooltip
 */

App.module.create(
  'bookmark',
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

    var bindBookmark = function() {
      $('.js-bookmark').livequery(function() {
        var $el = $(this);

        $el.on('click', function(e) {
          e.preventDefault();

          if($('.js-body').hasClass('logged-in')) {
            var id = $el.data('id');
            if($el.hasClass('active')) $('.js-bookmark[data-id='+id+']').removeClass('active');
            else $('.js-bookmark[data-id='+id+']').addClass('active');
            module.ajaxBookmark(id);
          } else {
            $('a.c-menu__link__account').first().click();
          }

          return false;
        });

      });
    };


    /***********************************
    * public application definition
    */

    module.ajaxBookmark = function(post_id) {
      $.ajax({
        url: "/wp-admin/admin-ajax.php?action=ajax_bookmark",
        type: "POST",
        data: {
          'post_id' : post_id
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
          
          if(data.status == true) {
            if(data.code == 'post_saved')
              $('.js-bookmark[data-id='+post_id+']').addClass('active');
            else if(data.code == 'post_removed')
              $('.js-bookmark[data-id='+post_id+']').removeClass('active');
            app.myaccounts.fetchSavedArticles(false);
          }
        }
      });
    };

    /***********************************
    * global app declaration of events and methods
    */

    // module init method;
    // NOTE: important for initializing the module will be called dynamically
    module.init = function() {
      bindBookmark();
    };

    return module;
  })(window, jQuery, window.App)
);
