var $ = jQuery,
    relationshipReady = new CustomEvent('relationshipReady');

window.addEventListener('relationshipReady', function( e ){

  var $relationship_fields = $(document).find('.acf-field-relationship'),
      $choices = $relationship_fields.find('.choices');

  acf.add_action('change', function( $el ){
    var $selected_items = $relationship_fields.find('.values span[data-id]'),
        $selected_ids = [];

    $.each($selected_items, function(i, val){
      $selected_ids.push( $(val).attr('data-id') );
    });

    $choices.find('.acf-rel-item').removeClass('disabled');
    $.each($selected_ids, function(i, val){
      $choices.find('.acf-rel-item[data-id=' + val + ']').addClass('disabled');
    });
  });

  acf.do_action('change');
});
