acf.add_action('load', function( $el ){
	
	// $el will be equivalent to $('body')
	
	var $field = $el.find('.media-modal');

	$field.find('.attachments .js--select-attachment').live('click', function() {
		var $item = jQuery(this).parent(),
			$button = jQuery('.media-modal').find('.media-button-select');
			
		if($item.attr('aria-checked')==="true") {
			$button.removeAttr('disabled');
		} else {
			$button.attr('disabled','disabled');
		}
	});	
	
});