jQuery(document).ready(function($){
    $.ajaxSetup({
      beforeSend: function( xhr, settings ) {
        if(settings.data && typeof settings.data != 'undefined') {
          // TODO: target only specific field
          // override Breakers ajax request.. add editor id
          //editor breaker
          var editor_id = $("input[name='acf[field_561e7b069515f]']").val();
          //world clock breaker editor
          // use to filter post by editor in world clock (list of articles by author)
          var wc_editor = $("tr[data-key='field_56723334cd8eb']").find('.select2-dropdown-open').parents('.acf-row').first().find("tr[data-key='field_567100c335084'] input[type='hidden']:not(:disabled)").val();
          // use to filter post by brand in world clock (list of articles by brand)
          var wc_brand = $("tr[data-key='field_5672337dcd8ee']").find('.select2-dropdown-open').parents('.acf-row').first().find("tr[data-key='field_567125d896194'] input[type='hidden']:not(:disabled)").val();
          var excluded_ids = "";

          if(typeof editor_id != 'undefined' && editor_id.length <= 0) {
              editor_id = wc_editor;
          }


          var $element = $("tr[data-key='field_561e610c3581a'], tr[data-key='field_561e6423dc5ad'], tr[data-key='field_561e6465dc5b6'], tr[data-key='field_561e64b2dc5bf'], tr[data-key='field_561e745dd21fa'], tr[data-key='field_5625f1d6aa846'], tr[data-key='field_5666a17a08c3b'], tr[data-key='field_567100c335084'], tr[data-key='field_567125d896194'], tr[data-key='field_567128913253e'], tr[data-key='field_5649c31fbb93e'], tr[data-key='field_5649c884d9c5a'], tr[data-key='field_5649d19668f9d'], tr[data-key='field_5649d28986cd6'], tr[data-key='field_5649bb075a0e2'], tr[data-key='field_5649d35a1d643'], tr[data-key='field_56596b3762f5d'], tr[data-key='field_5653d15e911d4'], tr[data-key='field_5653031382879'], div[data-key='field_5649c2d7dffe8'], div[data-key='field_5649c859317ea'], div[data-key='field_5649d1c96589e'], div[data-key='field_5649d2ba919e1'], div[data-key='field_5649b059cb7e1'], div[data-key='field_5649d338a6ab8'], div[data-key='field_565308a1bbad2'] "),
          $items = $element.find("input[type='hidden']:not(:disabled)");

          $.each($items, function(index, item){
              if($(this).val().toString().length > 0)
                  excluded_ids += "," + $(this).val()
          });


          //article breaker filter by category
          var category_id = $('#acf-field_5637207fd822d').val();

          excluded_ids = (excluded_ids.length > 0) ? excluded_ids.substr(1, excluded_ids.length) : "";
          settings.url = settings.url + "?editor_id=" + editor_id + "&excluded_ids=" + excluded_ids + "&brand_id=" + wc_brand + "&category_id=" + category_id;
        }
      }
    });

    $("input[name='acf[field_561e7b069515f]']").change(function() {
    	$("input[name='acf[field_561e7aee9515e]']").val('');
    	$('#s2id_acf-field_561e7aee9515e .select2-chosen').text('Select');
    });

    //category field on article breaker
    $('#acf-field_5637207fd822d').change(function() {
       var $articleDropdown = $("tr[data-key='field_561e6423dc5ad'], tr[data-key='field_561e610c3581a'], tr[data-key='field_561e6465dc5b6'], tr[data-key='field_561e64b2dc5bf']");

       $articleDropdown.find("input[type='hidden']:not(:disabled)").val('');
       $articleDropdown.find('.select2-chosen').text('Select');

    });

});
