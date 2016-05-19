App.module.create(
  'newsletter', (function (window, $, app) {
    'use strict';

    // define module object
    var module = {};

    /***********************************
     * private variables
     */

    var $form = $('.js-newsletter'),
        $unsubscribeForm = $('.js-newsletter--unsubscribe');

    /***********************************
     * private methods
     */

    var bindNewsletter = function() {
      $form.livequery(function () {
        var $el = $(this);

        $el.on('submit', function(e) {
          e.preventDefault();

          var email = $el.find("input[name=nl_email]").val();

          // $el.find('.message').text('Please wait...');
          $el.find('.message').removeClass('is-hidden');

          addSubscriber(email, $el);

          return false;
        });

        $el.find("input[name=nl_email]").on('keydown', function(e) {
          $el.find('.message').text('');
        });

      });
    };

    var addSubscriber = function (email, $el) {
      console.log('addSubscriber');
      $.ajax({
        url: "/wp-admin/admin-ajax.php?action=subscribe_to_newsletter",
        type: "POST",
        data: {
          email: email,
        },
        success: function(data, status){
          $el.find('.message').text(data.responseText);
        }
      });
    };

    var bindUnsubscribeNewsletter = function() {
      $unsubscribeForm.livequery(function () {
        var $el = $(this);

        $el.on('submit', function(e) {
          e.preventDefault();

          var email = $el.find("input[name=nl_email]").val();

          // $el.find('.message').text('Please wait...');
          $el.find('.message').removeClass('is-hidden');
          $el.find('[name=nl_submit]').addClass('disabled').prop('disabled', true);

          removeSubscriber(email, $el);

          return false;
        });

        $el.find("input[name=nl_email]").on('keydown', function(e) {
          $el.find('.message').text('');
        });

      });
    };

    var removeSubscriber = function (email, $el) {
      console.log('remove Subscriber');
      $.ajax({
        url: "/wp-admin/admin-ajax.php?action=unsubscribe_to_newsletter",
        type: "POST",
        data: {
          email: email,
        },
        success: function(data, status){
          $el.find('.message').text(data.responseText);

          if(data.status != 'true') {
            $el.find('[name=nl_submit]').removeClass('disabled').prop('disabled', false);
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
    module.init = function () {
      bindNewsletter();
      bindUnsubscribeNewsletter();
    };


    return module;
  })(window, jQuery, window.App)
);
