jQuery(document).ready(function($) {

    // Perform AJAX forgetpassword on form submit
    $('form#forgetpasswordform').on('submit', function(e){
        e.preventDefault();

        var $el = $(this);

        console.log('submit');
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: ajax_forgetpassword_object.ajaxurl,
            data: {
                'action': 'ajaxforgetpassword', //calls wp_ajax_nopriv_ajaxforgetpassword
                'email': $el.find('#forget_email').val(),
                'security': $el.find('#security').val() },
            success: function(data){
                if(data.status == true) {
                    $('.forgot-password-wrapper').hide();
                    $('.forgot-password-wrapper--success').show();
                    $el.find('.errormessage').hide();
                } else {
                    $el.find('.errormessage').html($('<textarea />').html(data.message).text());
                }
            }
        });
        $el.find('.errormessage').html(ajax_forgetpassword_object.loadingmessage).show();
        return false;
    });
});
