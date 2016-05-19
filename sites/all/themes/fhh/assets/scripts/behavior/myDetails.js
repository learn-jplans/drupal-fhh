
/*
 * Card
 */

App.module.create(
  'myDetails',
  (function(window, $, app) {
  'use strict';

  // define module object
  var module = {};

  /***********************************
  * private variables
  */
  var $myDetails = $('#my-details'),
      $personalDetailsForm = $myDetails.find('.personal-details-form'),
      $personalDetailsPictureForm = $myDetails.find('.personal-details-picture-form'),
      $newsletterPreferenceForm = $myDetails.find('form.sign-up'),
      $accountThemesContainer = $myDetails.find('.account-themes'),
      // $accountThemesHeader = $accountThemesContainer.find('.account-themes-header'),
      // $accountThemesSubHeader = $accountThemesContainer.find('.account-themes-sub-header'),
      $accountThemesArticleTags = $accountThemesContainer.find('.article-tags'),
      $preloader = $accountThemesContainer.find('.js-preloader--account-themes');

  /***********************************
  * private methods
  */

  var bindPersonalDetails = function() {
    $('.js-preloader--personal-image').addClass('is-hidden');

    $personalDetailsForm.find('input').on('input change', function(e) {
      $personalDetailsForm.find('.form-actions').removeClass('is-hidden');
      if($(this).attr('name') != 'old_password' && $(this).attr('name') != 'new_password')
        app.loginRegister.validateField($(this));
    });

    $personalDetailsForm.on('submit', function(e) {
      e.preventDefault();
      var is_error = false,
          $old_password = $personalDetailsForm.find('input[name=old_password]'),
          $new_password = $personalDetailsForm.find('input[name=new_password]');

      $personalDetailsForm.find('input:not([name=old_password]):not([name=new_password])').each(function(){
        if(!app.loginRegister.validateField($(this))) is_error = true;
      });

      var new_password_val = $new_password.length > 0 ? $new_password.val() : '';
      var old_password_val = $old_password.length > 0 ? $old_password.val() : '';
      if( new_password_val.length > 0 ) {
        if(!(new_password_val.length >= 8 && new_password_val.length <= 16)) {
          is_error = true;
          app.loginRegister.fieldShowError($new_password, $new_password.data('error-msg'));
        } else {
          app.loginRegister.fieldHideError($new_password);
        }
      }
      if( old_password_val.length == 0 && new_password_val.length > 0 ) {
        is_error = true;
        app.loginRegister.fieldShowError($old_password, $old_password.data('error-msg'));
      } else if(old_password_val.length > 0) {
        app.loginRegister.fieldHideError($old_password);
      }

      if( !is_error ) {
        savePersonalDetails();
      }

      return false;
    });

    $personalDetailsForm.find('.select-container li').each(function() {
      $(this).on('click',function(){
        var $el = $(this),
            $div = $el.parents('.js-custom-scrollbar');
        $div.siblings('.errormessage').removeClass('show');
        $div.siblings('input').removeClass('error');
        $div.siblings('.error-iconbox').find('.empty').removeClass('show');
        $div.siblings('.error-iconbox').find('.checked').addClass('show');
        $personalDetailsForm.find('.form-actions').removeClass('is-hidden');
      });
    });

    $personalDetailsForm.find('input').on('input change', function(e) {
      $personalDetailsForm.find('.form-actions').removeClass('is-hidden');
    });

    $personalDetailsPictureForm.find('input[name=personal_picture]').on('change', function(e) {
      if($(this).val() == '') return;
      else savePersonalDetailsPicture(e);
    });

    $personalDetailsPictureForm.find('.upload-picture,.image-wrapper').on('click', function(e) {
      e.preventDefault();
      $personalDetailsPictureForm.find('input[name=personal_picture]').click();
      return false;
    });

    $personalDetailsPictureForm.find('.select-container ul li').on('click',function(){
      $personalDetailsForm.find('.form-actions').removeClass('is-hidden');
    });
  };

  var resetPersonalDetails = function() {
      $personalDetailsForm.find('input[name=old_password]').val('');
      $personalDetailsForm.find('input[name=new_password]').val('');
      $personalDetailsForm.find('input').each(function(){
        app.loginRegister.fieldReset($(this));
      });
  };

  var savePersonalDetails = function() {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: "/wp-admin/admin-ajax.php?action=personal_details",
        data: {
          'name' : $personalDetailsForm.find('input[name=name]').val(),
          'surname' : $personalDetailsForm.find('input[name=surname]').val(),
          'email' : $personalDetailsForm.find('input[name=email]').val(),
          'country' : $personalDetailsForm.find('input[name=country]').val(),
          'old_password' : $personalDetailsForm.find('input[name=old_password]').length > 0 ? $personalDetailsForm.find('input[name=old_password]').val() : '',
          'new_password' : $personalDetailsForm.find('input[name=new_password]').length > 0 ? $personalDetailsForm.find('input[name=new_password]').val() : '',
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

            if (data.status == true){
              var name = $personalDetailsForm.find('[name=name]').val(),
                  surname = $personalDetailsForm.find('[name=surname]').val(),
                  fullname = name + ' ' + surname;
                $('.c-menu__link__account--loggin .o-label').html(name);
                $('.label-user--fullname').html(fullname);
                $('.label-user--first-name').html(name);
                resetPersonalDetails();
                $personalDetailsForm.find('.form-actions').addClass('is-hidden');
            } else {
                $personalDetailsForm.find('.errormessage, .empty, span.status').removeClass('show');
                switch(data.code) {
                    case 'empty_name':
                        app.loginRegister.fieldShowError($personalDetailsForm.find('[name=name]'), data.message);
                        break;
                    case 'empty_surname':
                        app.loginRegister.fieldShowError($personalDetailsForm.find('[name=surname]'), data.message);
                        break;
                    case 'empty_country':
                        app.loginRegister.fieldShowError($personalDetailsForm.find('[name=country]'), data.message);
                        break;
                    case 'invalid_email':
                    case 'email_exists':
                    case 'empty_email':
                        app.loginRegister.fieldShowError($personalDetailsForm.find('[name=email]'), data.message);
                        break;
                    case 'empty_old_password':
                    case 'invalid_old_password':
                        app.loginRegister.fieldShowError($personalDetailsForm.find('[name=old_password]'), data.message);
                        break;
                    case 'invalid_new_password':
                        app.loginRegister.fieldShowError($personalDetailsForm.find('[name=new_password]'), data.message);
                        break;
                }
            }
        }
    });
  };

  var savePersonalDetailsPicture = function(e) {
    var files = e.target.files;

    $('.js-preloader--personal-image').removeClass('is-hidden');
    $personalDetailsPictureForm.find('.image-wrapper img').hide();

    // Create a formdata object and add the files
    var data = new FormData();
    $.each(files, function(key, value) {
        data.append(key, value);
    });

    $.ajax({
        url: "/wp-admin/admin-ajax.php?action=personal_details_picture",
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'json',
        processData: false, // Don't process the files
        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
        success: function(data, textStatus, jqXHR) {
            if(data == 0){
              var $lang = $('html').attr('lang');
              if($lang == 'en-US') {
                document.location.href = '/en';
              } else {
                document.location.href = '/fr';
              }
            }

            if(data.status == true) {
              if(data.image_url != '') {
                $('.js-preloader--personal-image').addClass('is-hidden');
                $personalDetailsPictureForm.find('.image-wrapper img').remove();
                $personalDetailsPictureForm.find('.image-wrapper').append('<img src="'+data.image_url+'" style="display:none;" />')
                $personalDetailsPictureForm.find('input[name=personal_picture]').val('');
              }
            }
            $personalDetailsPictureForm.find('.image-wrapper img').show();
        },
    });
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: "/wp-admin/admin-ajax.php?action=personal_details_picture",
        data: {
          'picture' : $personalDetailsForm.find('input[name=personal_picture]').val(),
        },
        processData: false,
        contentType: false,
        success: function(data){
        }
    });
  };

  var bindNewsletterPreference = function() {
    $newsletterPreferenceForm.find('input').on('change', function(){
        var $input = $(this), inputValue = $input.prop("checked") ? 'on' : 'off';
        saveNewsletterPreference({ name : $input.attr('name'), value : inputValue });
    });
  };

  var saveNewsletterPreference = function(postData) {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: "/wp-admin/admin-ajax.php?action=newsletter_preference",
        data: postData,
        success: function(data){
          if(data == 0){
            var $lang = $('html').attr('lang');
            if($lang == 'en-US') {
              document.location.href = '/en';
            } else {
              document.location.href = '/fr';
            }
          }
        }
    });
  };

  var updatePassword = function(postData) {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: "/wp-admin/admin-ajax.php?action=update_password",
        data: postData,
        success: function(data){
          if(data == 0){
            var $lang = $('html').attr('lang');
            if($lang == 'en-US') {
              document.location.href = '/en';
            } else {
              document.location.href = '/fr';
            }
          }
        }
    });
  };

  var bindAccountThemes = function() {
    $preloader.addClass('is-hidden');

    $accountThemesArticleTags.find('ul li').livequery(function () {
      var $el = $(this),
          tag_id = $el.data('id'),
          tag_taxonomy = $el.data('taxonomy'),
          tag_type = $el.data('type'),
          is_brand = tag_type === 'brand' ? 1 : 0;

      $el.on('click', function() {
        if($el.hasClass('is-selected')) {
          $el.removeClass('is-selected');
          removeTagFromFavourites(tag_id, tag_taxonomy, is_brand);
        } else {
          $el.addClass('is-selected');
          addTagToFavourites(tag_id, tag_taxonomy, is_brand);
        }
      });

    });
  };

  var removeTagFromFavourites = function(tag_id, tag_taxonomy, is_brand) {
    $.ajax({
      url: "/wp-admin/admin-ajax.php?action=remove_favourite_tag",
      type: "POST",
      data: {
        'tag_id' : tag_id,
        'tag_taxonomy'  : tag_taxonomy,
        'is_brand'      : is_brand,
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

        /*$preloader.removeClass('is-hidden');

        if(data.status) {
          if(data.tag_count === 0) {
            // $accountThemesHeader.fadeOut();
            // $accountThemesSubHeader.html(data.message).fadeOut();
          } else {
            // $accountThemesHeader.fadeIn();
            // $accountThemesSubHeader.html(data.message).fadeIn();
          }
        }

        $preloader.addClass('is-hidden');*/
      }
    });
  };

  var addTagToFavourites = function(tag_id, tag_taxonomy, is_brand) {
    $.ajax({
      url: "/wp-admin/admin-ajax.php?action=save_favourite_tag",
      type: "POST",
      data: {
        'tag_id'        : tag_id,
        'tag_taxonomy'  : tag_taxonomy,
        'is_brand'      : is_brand,
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

        /*$preloader.removeClass('is-hidden');

        if(data.status) {
          if(data.tag_count === 0) {
            // $accountThemesHeader.fadeOut();
            // $accountThemesSubHeader.html(data.message).fadeOut();
          } else {
            // $accountThemesHeader.fadeIn();
            // $accountThemesSubHeader.html(data.message).fadeIn();
          }
        }

        $preloader.addClass('is-hidden');*/

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
    bindPersonalDetails();
    bindNewsletterPreference();
    bindAccountThemes();
  };

  return module;
  })(window, jQuery, window.App)
);
