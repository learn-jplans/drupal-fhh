
/*
 * Timeline
 */

App.module.create(
  'articleProfileLazyLoad',
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
  var loadArticle = function () {
    var offset = 4,
      author_id = $('.js-section-article').data('id'),
      max = $('.js-loader').data('max');
      
    $('.js-loader__toggle').on('click', function(){
      $.ajax({
        url: "/wp-admin/admin-ajax.php?action=load_author_post",
        type: "GET",
        data: {
          offset: offset,
          author_id : author_id
        },
        success: function(data){
          var posts = $.parseJSON(data);
          $.each(posts, function(idx, post){
            bindTemplate(post);
          });

          offset+=4;
          if( offset >= max ) {
            $('.js-loader__toggle').remove();
          }
            
          app.tiles.tiles();
        }
      });

    });
  };

  var bindTemplate = function (data) {
    var tmpl = $('#tmplAuthorPosts').html(),
      $html = Mustache.to_html(tmpl, data);
    $('.js-loader').append($html);
  };

  /***********************************
  * global app declaration of events and methods
  */

  // module init method;
  // NOTE: important for initializing the module will be called dynamically
  module.init = function() {
    loadArticle();
  };


  return module;
  })(window, jQuery, window.App)
);