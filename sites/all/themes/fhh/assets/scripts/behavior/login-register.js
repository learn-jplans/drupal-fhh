App.module.create(
	'loginRegister',
	(function(window, $, app) {
		'use strict';

		// define module object
		var module = {},
            currentPageYOffset = 0,
            $card = $('.js-card'),
            $cardToggle = $('.js-card__toggle'),
            $navDropdown = $('.js-nav--dropdown'),
            $navDropdownItem = $navDropdown.find('.js-menu__item');

		/***********************************
		 * private variables
		 */

    var $body = $('.js-body');
    var $register = document.getElementById("slideregister");

		/***********************************
		 * private methods
		 */

    var openLoginRegister = function () {
      $('.c-menu__link__account').livequery(function () {
        var $el = $(this);
        $el.on('click',function() {

          //CLOSE ALL OPEN MODAL
          closeOpenModal();

          $('.login-register--container').removeAttr('style');

          if($('body').hasClass('home')){
            if( $('.js-hero').outerHeight() > app.$window.scrollTop() ) {
              currentPageYOffset = $('.js-body ').offset().top;
              $("html,body").animate({
                scrollTop : currentPageYOffset
              }, 1000);
            } else {
              currentPageYOffset = window.pageYOffset;
            }
            if(!$el.hasClass('opened')) {
              $el.addClass('opened');
              $('.login-register--container').addClass('open-login-home');
              app.$body.addClass('u-no-scroll');

            }
          } else {
            if(!$el.hasClass('opened')) {
              $el.addClass('opened');
              $('.login-register--container').addClass('open-login');
              currentPageYOffset = window.pageYOffset;
              app.$body.addClass('u-no-scroll');
            }
          }
            console.log('loginRegister');
          console.log(currentPageYOffset);

          //$('section.c-snackable').addClass('slideDown');
          //$('.snackhomebox, .snackspadding-home').hide();


          $('.js-hero').addClass('hidden');
          $(window).scrollTo(currentPageYOffset);
          $('.js-header').css({top: '0', position: 'fixed'});
          $('.o-main').css({overflow: 'visible'});
        });

        $('.closelogin').on('click',function(){
          module.closeLoginRegisterModal();
        });
        $('.select-container ul li').on('click',function(){
          var $el = $(this);
          var $div = $el.parents('.js-custom-scrollbar');
          $div.siblings('.errormessage').removeClass('show');
          $div.siblings('input').removeClass('error');
          $div.siblings('.error-iconbox').find('.empty').removeClass('show');
          $div.siblings('.error-iconbox').find('.checked').addClass('show');
        });
      });
    };

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

    var selectAccessHover = function () {
      $('.login-register--wrapper > div').livequery(function () {
        var $el = $(this);
        $el.hover(function() {
          $el.siblings('div').addClass('unhovered');
        }, function() {
          $el.siblings('div').removeClass('unhovered');
        });
      });
    };
    var accessbtn = function () {
      $('.accessbtn').livequery(function () {
        var $el = $(this);
        $el.each(function(){
          $el.on('click',function(){
            $el.addClass('moveUp');
              $('.resetregister').click();
            var $parent = $(this).attr('id');
            if($('.' + $parent + '-box').hasClass('inactive')) {
              $('.' + $parent + '-box').removeClass('inactive').siblings('div').addClass('inactive');
              $('.' + $parent + '-box').siblings('div').children('ul').removeClass('moved');
              $('.' + $parent + '-list').addClass('moved');
              $('.' + $parent + '-box').siblings('div').children('ul').children('li').children('h1').removeClass('moveUp');
            } else {
              $('.' + $parent + '-box').siblings('div').addClass('inactive');
              $('.' + $parent + '-list').addClass('moved');
              $('.' + $parent + '-box').siblings('div').children('ul').removeClass('moved');
              $('.' + $parent + '-box').siblings('div').children('ul').children('li').children('h1').removeClass('moveUp');
            }
          });
        });
      });
    };

    var showpassword = function () {
      $('.showpass').livequery(function () {
        var $el = $(this);

        $el.each(function(){
          var $showtext = $(this).attr('data-text-show');
          var $hidetext = $(this).attr('data-text-hide');
          var $inputpass = $(this).siblings('input');
          $el.text($showtext);

          if($el.siblings('input[type=password]').val() == ''){
            $el.addClass('phide');
          } else {
            $el.removeClass('phide');
          }
          $el.siblings('input[type=password]').keyup(function(){
            if($el.siblings('input').val() == ''){
              $el.addClass('phide');
            } else {
              $el.removeClass('phide');
            }
          });


          $el.on('click',function(){
            if($el.hasClass('hide')) {
              $el.removeClass('hide');
              $el.text($showtext);
              $el.siblings('input').attr('type','password');
            } else {
              $el.addClass('hide');
              $el.text($hidetext);
              $el.siblings('input').attr('type','text');
            }
          });
        });

      });
    };

    var validateLogin = function () {
      $('#fhh_loginform').livequery(function () {

        $('#fhh_loginform').find('.login_button').prop('disabled', true);

          $('#fhh_loginform input').each(function(){

            var _validate = function() {
              var $input_username = $('#fhh_loginform').find('input#username'),
                  $input_password = $('#fhh_loginform').find('input#password'),
                  $submit_btn = $('#fhh_loginform').find('.login_button');
              if(module.validateField($input_username) &&
                  module.validateField($input_password) &&
                  $input_password.val().length >= 8) {
                $submit_btn.addClass('active');
                $submit_btn.prop('disabled', false);
              } else {
                $submit_btn.removeClass('active');
                $submit_btn.prop('disabled', true);
              }
            };

            $(this).on('focusout input',function() { _validate(); });

          });
      });
    };

    var validateRegister = function () {
      $('#fhh_registerform').livequery(function () {
          $('#fhh_registerform input').each(function(){
            $(this).on('focusout input',function(){
              module.validateField($(this));
            });
          });
      });
    };

    var SlideRegister = function () {
      $('#slideregister').livequery(function () {
        $("#slideregister button").draggable({
          cancel: false,
          containment: "parent",
          axis: "x",
          drag: function( event, ui ) {
            var $slideBtn = $(this);
            $slideBtn.siblings(".buffer").css({'width': ui.position.left + "px"});
          },
          stop: function () {

            var $slideBtn = $(this);

            if ($slideBtn.position().left > 100 ) {

              var $form = $slideBtn.closest("form"),
                  is_error = false,
                  $password = $form.find('#reg_password');

              $form.find('[data-required=true]').each(function(){
                  if(!module.validateField($(this))) is_error = true;
              });
              if( !($password.val().length >= 8 && $password.val().length <= 16) ) {
                is_error = true;
                module.fieldShowError($password, $password.data('error-msg'));
              }

              if( !is_error ) {

                // $form.find('span.status').removeClass('show');

                $slideBtn.css({ left: 0 });
                $slideBtn.siblings(".buffer").animate({'width': '0'}, 300);
                $slideBtn.siblings("label").html( $slideBtn.data('msg-load') );

                registerUser($form);
                // $form.find('span.status').show().text(ajax_register_object.loadingmessage);

              } else {
                $slideBtn.css({ left: 0 });
                $slideBtn.siblings(".buffer").animate({'width': '0'}, 300);
              }


            } else {
              $slideBtn.css({ left: 0 });
              $slideBtn.siblings(".buffer").animate({'width': '0'}, 300);
            }
          }
        }).on("click", function () {
          return false;
        });

        if($("#slideregister").length > 0) {

          document.getElementById("slideregister").addEventListener("touchstart", touchHandler, true);
          document.getElementById("slideregister").addEventListener("touchmove", touchHandler, true);
          document.getElementById("slideregister").addEventListener("touchend", touchHandler, true);
          document.getElementById("slideregister").addEventListener("touchcancel", touchHandler, true);

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


    var registerUser = function($form) {
      var $slideBtn = $form.find('#slideregister button'),
          $container = $('.login-register--container'),
          $socialContainer = $('.socialsignin');
      $.ajax({
          type: 'POST',
          dataType: 'json',
          url: ajax_register_object.ajaxurl,
          data: {
              'action': 'ajaxregister', //calls wp_ajax_nopriv_ajaxregister
              'reg_name': $form.find('#reg_name').val(),
              'reg_surname': $form.find('#reg_surname').val(),
              'reg_email': $form.find('#reg_email').val(),
              'reg_country': $form.find('#reg_country').val(),
              'reg_password': $form.find('#reg_password').val(),
              'reg_newsletter_updates': $form.find('#reg_newsletter_updates').attr('checked') ? "on" : false,
              'security': $form.find('#security').val() },
          success: function(data){
            if (data.status == true){
                $form.find('span.status').html($('<textarea />').html(data.message).text()).addClass('show');
                $slideBtn.css({
                  left: "auto",
                  right: 0
                }).addClass("registeredsuccess").html('<span class="registeredicon"><svg class="o-icon o-icon--submit-tick"><use xlink:href="#submit-tick"></use></svg></span> Registered').draggable({ disabled: true });
                $slideBtn.siblings(".buffer").animate({'width': '0'}, 300);
                $form.addClass('registration-success');
                $container.animate({ scrollTop: 0 }, "fast");
                $socialContainer.addClass('is-hidden');
            } else {
                $form.find('.errormessage, .empty, span.status').removeClass('show');
                switch(data.code) {
                    case 'empty_name':
                        module.fieldShowError($form.find('[name=reg_name]'), data.message);
                        break;
                    case 'empty_surname':
                        module.fieldShowError($form.find('[name=reg_surname]'), data.message);
                        break;
                    case 'invalid_email':
                    case 'email_exists':
                    case 'empty_email':
                        module.fieldShowError($form.find('[name=reg_email]'), data.message);
                        break;
                    case 'empty_password':
                    case 'invalid_password':
                        module.fieldShowError($form.find('[name=reg_password]'), data.message);
                        break;
                    default:
                        $form.find('span.status').html($('<textarea />').html(data.message).text()).addClass('show');
                }

                $slideBtn.siblings("label").html( $slideBtn.data('msg-default') );
            }

          }
      });
    };

		/***********************************
		 * public application definition
		 */

    module.validateField = function($field) {
      var required = $field.attr("data-required") == 'true',
          empty = $field.val() == '',
          errormessage = $field.attr('data-error-msg'),
          is_error = false;

      $field.siblings('.errormessage').html('');

      if(required && empty) {
        module.fieldShowError($field, errormessage);
        is_error = true;
      } else {
        module.fieldHideError($field);
        is_error = false;
      }

      return !is_error;
    };

    module.fieldShowError = function($field, errormessage) {
      if($field.length === 0) return;
      $field.addClass('error');
      $field.siblings('.error-iconbox').children('.empty').addClass('show');
      $field.siblings('.error-iconbox').children('.checked').removeClass('show');
      $field.siblings('.errormessage').html($('<textarea />').html( errormessage ).text()).addClass('show');
      $field.parent('div').addClass('error');
    };

    module.fieldHideError = function($field) {
      if($field.length === 0) return;
      $field.removeClass('error');
      $field.siblings('.error-iconbox').children('.empty').removeClass('show');
      $field.siblings('.error-iconbox').children('.checked').addClass('show');
      $field.siblings('.errormessage').removeClass('show');
      $field.parent().addClass('success');
      $field.parent().removeClass('error');
    };

    module.fieldReset = function($field) {
      if($field.length === 0) return;
      $field.removeClass('error');
      $field.siblings('.error-iconbox').children('.empty').removeClass('show');
      $field.siblings('.error-iconbox').children('.checked').removeClass('show');
      $field.siblings('.errormessage').removeClass('show');
      $field.parent().removeClass('success');
      $field.parent().removeClass('error');
    };

    module.closeLoginRegisterModal = function() {
      if($('body').hasClass('home')){
        $('.c-menu__link__account').removeClass('opened');
        $('.login-register--container').removeClass('open-login-home');
        app.$body.removeClass('u-no-scroll');
        $('ul.moved').removeClass('moved');
        $('div.inactive').removeClass('inactive');
      } else {
        $('.c-menu__link__account').removeClass('opened');
        $('.login-register--container').removeClass('open-login');
        app.$body.removeClass('u-no-scroll');
        $('ul.moved').removeClass('moved');
        $('div.inactive').removeClass('inactive');
      }
      $('.js-hero').removeClass('hidden');
      $('.js-header,.o-main').removeAttr('style');
      $('.socialerror').addClass('hidden');

      if(currentPageYOffset > 0)
        $(window).scrollTo(currentPageYOffset);
    };

		/***********************************
		 * global app declaration of events and methods
		 */

		// module init method;
		// NOTE: important for initializing the module will be called dynamically
		module.init = function() {
      openLoginRegister();
      selectAccessHover();
      accessbtn();
      showpassword();
      validateLogin();
      validateRegister();
      SlideRegister();
		};


		return module;
	})(window, jQuery, window.App)
);
