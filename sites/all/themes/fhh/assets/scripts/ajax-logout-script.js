jQuery(document).ready(function($) {
    
    $(document).on('click','.logout', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: ajax_logout_object.ajax_url,
            data: {
                'action': 'custom_ajax_logout', //calls wp_ajax_nopriv_ajaxlogout
                'ajaxsecurity': ajax_logout_object.logout_nonce
            },
            success: function(r){
                // When the response comes back
                window.location = ajax_logout_object.home_url;
            }
        });
    });

});