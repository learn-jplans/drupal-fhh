App.module.create(
  'contact', (function (window, $, app) {
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
    var customSelects = function () {
      $('.select-container a').livequery(function () {
        var $el = $(this);
        $el.each(function(){
          $el.on('click',function(){
            if($el.hasClass('opened')) {
              $el.removeClass('opened');
              $el.parent('div').removeClass('opened');
              $('.opened').removeClass('opened');
            } else {
              $('.opened').removeClass('opened');
              $el.addClass('opened');
              $el.parent('div').addClass('opened');
            }
          });
        });

        $('input,textarea').focusin(function(){
          $('.opened').removeClass('opened');
        });

        $('.select-container li').each(function() {
          $(this).on('click',function(){
            var xval = $(this).text();
            // console.log(xval);
            $(this).parents('.select-container').find('a').text(xval).removeClass('opened');
            $(this).parents('.select-container').removeClass('opened');
            $(this).parents('.select-container').find('input').val(xval);

            $(this).parents('.select-container').removeClass('error').addClass('success');

          });
        });

      });
    };



    var SlideSubmit = function () {
      $('.slide-submit').livequery(function () {

        var $width = $(this).width() - 52;

        $(".slide-submit button").draggable({
          cancel: false,
          containment: "parent",
          axis: "x",
          drag: function( event, ui ) {
            $(".slide-submit .buffer").css({'width': ui.position.left + "px"});
          },
          stop: function () {
            // console.log('slide left: ' + $(this).position().left);
            // console.log('slide width: ' + $width);

            if ($(this).position().left > 100 ) {

              var $form = $(this).closest("form");

              if(validateFeedbackForm($form, $(this))) {
                $(this).css({
                  left: "auto",
                  right: 0
                }).addClass("submitted").text($(this).data('submittingText')).draggable({ disabled: true });
              } else {
                $(this).css({ left: 0 });
              }


            } else {
              $(this).css({
                left: 0
              });
            }
            $(".slide-submit .buffer").animate({'width': '0'}, 300);
          }
        }).on("click", function () {
          return false;
        });

        if($("#slideContactSubmit").length > 0) {

          document.getElementById("slideContactSubmit").addEventListener("touchstart", touchHandler, true);
          document.getElementById("slideContactSubmit").addEventListener("touchmove", touchHandler, true);
          document.getElementById("slideContactSubmit").addEventListener("touchend", touchHandler, true);
          document.getElementById("slideContactSubmit").addEventListener("touchcancel", touchHandler, true);

          function touchHandler(event) {
            var touch = event.changedTouches[0];

            var simulatedEvent = document.createEvent("MouseEvent");
            simulatedEvent.initMouseEvent({
                touchstart: "mousedown",
                touchmove: "mousemove",
                touchend: "mouseup"
              }[event.type], true, true, window, 1,
              touch.screenX, touch.screenY,
              touch.clientX, touch.clientY, false,
              false, false, false, 0, null);

            touch.target.dispatchEvent(simulatedEvent);
            event.preventDefault();
          }
        }


      });
    };

    var validateFeedbackForm = function ($form, $submitBtn) {
      var $formArray = $form.serializeArray();
      var form_data = new Object();
      var is_error = false;
      
      for (var i=0; i < $formArray.length ; i++) {
        form_data[$formArray[i].name] = $formArray[i].value;
      }

      $form.find('[data-required=true]').each(function() {
        var $field = $(this);
        if(form_data[$field.attr('name')] == '') {
          $field.parent().addClass('error');
          is_error = true;
        }
      });

      $form.find('input[name="email_address"]').each(function() {
        var $email = $(this);
        var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
        if (!testEmail.test($email.val())) {
          is_error = true;
          $email.parent().addClass('error');
        }
      });

      if(!is_error) {
        submitFeedback(form_data, $submitBtn)
      }

      console.log('is_error'+is_error);

      return !is_error;
    };

    var submitFeedback = function (form_data, $submitBtn) {

      console.log('submitFeedback');

        app.request({
          url     : '/wp-admin/admin-ajax.php?action=send_feedback',
          data    : form_data,
          method    : 'POST',
          dataType  : 'json',
          success   : function (data, status, xhr) {
            $submitBtn.html($submitBtn.data('submittedText'));
          },
          error     : function (xhr, status, error) {
            console.log('error')
          }
        });

    };

    var simpleValidate = function () {
      $('.js-contactform').livequery(function () {

        $('.js-contactform input').each(function(){
          $(this).on('focusout',function(){
            var required = jQuery(this).attr("data-required") == 'true',
                empty = jQuery(this).val() == '';
            if($(this).attr('name') == 'email_address') {
              var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
              if (!testEmail.test($(this).val()) || empty) {
                $(this).parent().addClass('error');
                $(this).parent().removeClass('success');
              } else {
                $(this).parent().addClass('success');
                $(this).parent().removeClass('error');
              }
            } else if(required && empty) {
              // console.log('true');
              $(this).parent().addClass('error');
              $(this).parent().removeClass('success');
            } else {
              $(this).parent().addClass('success');
              $(this).parent().removeClass('error');
            }
          });
        });

        $('textarea').each(function(){
          $(this).on('focusout',function(){
            var required = jQuery(this).attr("data-required") == 'true',
                empty = jQuery(this).val() == '';
            if(required && empty) {
              // console.log('true');
              $(this).parent().addClass('error');
              $(this).parent().removeClass('success');
            } else {
              $(this).parent().addClass('success');
              $(this).parent().removeClass('error');
            }
          });
        });

        $('.storeselect').each(function(){
          $(this).on('change',function(){
            var required = jQuery(this).attr("data-required") == 'true',
                empty = jQuery(this).val() == '';
            var statys = $(this).val();
            // console.log(statys);
            if(required && empty) {
              // console.log('true');
              $(this).parent().addClass('error');
              $(this).parent().removeClass('success');
            } else {
              // console.log('false');
              $(this).parent().addClass('success');
              $(this).parent().removeClass('error');
            }
          });
        });


      });
    };


    /***********************************
     * global app declaration of events and methods
     */

    // module init method;
    // NOTE: important for initializing the module will be called dynamically
    module.init = function () {
      SlideSubmit();
      customSelects();
      simpleValidate();
    };


    return module;
  })(window, jQuery, window.App)
);
