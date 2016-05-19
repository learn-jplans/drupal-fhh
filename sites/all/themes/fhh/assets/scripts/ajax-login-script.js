jQuery(document).ready(function($) {

    // Show the login dialog box on click
    /*$('a.c-menu__link__account').on('click', function(e){
        //$('body').prepend('<div class="login_overlay"></div>');
        $('div.login-register-container').fadeIn(500);
        $('div.login_overlay, form#login a.close').on('click', function(){
            $('div.login_overlay').remove();
            $('div.login-register-container').hide();
        });
        e.preventDefault();
    });*/

    // Perform AJAX login on form submit
    $('form#fhh_loginform').on('submit', function(e){
        var $el = $(this),
            is_error = false;

        e.preventDefault();

        $el.find('input[data-required=true]').each(function(){
            if(!App.loginRegister.validateField($(this))) is_error = true;
        });

        if( is_error ) return false;

        $el.find('span.status').removeClass('show');

        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: ajax_login_object.ajaxurl,
            data: {
                'action': 'ajaxlogin', //calls wp_ajax_nopriv_ajaxlogin
                'username': $('form#fhh_loginform #username').val(),
                'password': $('form#fhh_loginform #password').val(),
                'security': $('form#fhh_loginform #security').val() },
            success: function(data){

                if (data.loggedin == true){
                    $el.find('span.status').html($('<textarea />').html(data.message).text());
                    setTimeout(function(){ document.location.href = ajax_login_object.redirecturl; }, 3000);
                } else {
                    $el.find('.errormessage, .empty, span.status').removeClass('show');
                    console.log(data);
                    switch(data.code) {
                        case 'empty_password':
                            $el.find('.form-item--password #password').focus().addClass('error');
                            $el.find('.form-item--password .error-iconbox').children('.empty').addClass('show');
                            $el.find('.form-item--password .error-iconbox').children('.checked').removeClass('show');
                            $el.find('.form-item--password .errormessage').html($('<textarea />').html(data.message).text()).addClass('show');
                            break;
                        case 'invalid_email':
                            $el.find('.form-item--username #username').focus().addClass('error');
                            $el.find('.form-item--username .error-iconbox').children('.empty').addClass('show');
                            $el.find('.form-item--username .error-iconbox').children('.checked').removeClass('show');
                            $el.find('.form-item--username .errormessage').html($('<textarea />').html(data.message).text()).addClass('show');
                            break;
                        case 'incorrect_password':
                            $el.find('.form-item--password #password').focus().addClass('error');
                            $el.find('.form-item--password .error-iconbox').children('.empty').addClass('show');
                            $el.find('.form-item--password .error-iconbox').children('.checked').removeClass('show');
                            $el.find('.form-item--password .errormessage').html($('<textarea />').html(data.message).text()).addClass('show');
                            break;
                        default:
                            $el.find('span.status').html($('<textarea />').html(data.message).text()).addClass('show');
                    }

                }
            }
        });
        $el.find('span.status').html(ajax_login_object.loadingmessage).addClass('show');

    });

});
