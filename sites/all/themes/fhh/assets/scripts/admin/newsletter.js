jQuery(document).ready(function($){

    /*
     * Newsletter
     */

     var initNewsletter = function() {

        var $previewContainer = $('#newsletter-preview'),
            $htmlContainer = $('#newsletter-html'),
            $previewIframe = $('iframe#newsletter-preview--iframe'),
            $htmlCode = $('textarea#newsletter-html--code'),
            $previewBtn = $('a.acf-tab-button[data-key=field_565ec96dd9c3c]'),
            $htmlBtn = $('a.acf-tab-button[data-key=field_565ec88b82e27]');

        $('a.acf-tab-button[data-key=field_565ec96dd9c3c], a.acf-tab-button[data-key=field_565ec88b82e27]').on('click', function(e){
            var $el = $(this),
                key = $el.data('key');

            // preview
            $previewContainer.find('.status').show();
            $previewIframe.contents().find("body").html("");

            // html code
            $htmlContainer.find('.status').show();
            $htmlCode.text('');

            $.ajax({
              type: 'POST',
              dataType: 'html',
              url: ajax_newsletter_object.previewurl,
              data: {
                  'action': 'newsletter_generate_html', //calls wp_ajax_newsletter_generate_html
                  'post_data': $('form[name=post]').serializeArray(),
                  'lang': icl_this_lang
              },
              success: function(data){

                // preview
                $previewIframe.ready(function() {
                    $previewContainer.find('.status').hide();
                    data = data.replace(/src="\/\//g, 'src="https://'); // force https in src
                    $previewIframe.contents().find("body").html(data);
                });

                // html code
                $htmlCode.text(data);
                $htmlContainer.find('.status').hide();

              }
            });

            e.preventDefault();
        });

     }

     initNewsletter();

});
