/*
 * @build  : 24 Aug, 2013
 * @author : Ram swaroop
 * @company: Compzets.com
 */
(function($){
    $.fn.contentshare = function(options) {
        // fetch options
        var opts = $.extend({},$.fn.contentshare.defaults,options);
        var $position;

        $.extend($.fn.contentshare,{

            init : function(shareable) {
                $.fn.contentshare.defaults.shareable = shareable;
            },
            getContent : function(phrase) {
                var content="",
                    url="";
                phrase = ''+phrase;
                for(var i=0;i<opts.shareLinks.length;i++){
                    var data = $('mark').parents('.js-content-share').data('shareline');

                    if( opts.sharePlatform[i] === "Facebook" ) {
                        url = "&p[url]="+data.url;
                    } else if( opts.sharePlatform[i] === "Twitter" ) {
                        // limit characters
                        if(phrase.length >= 90) {
                          phrase = phrase.substring(0, 90);
                          phrase = phrase.substring(0, phrase.lastIndexOf(" "));
                          phrase += "...";
                        }

                        url = "&url="+data.url;
                    }

                    content+='<a class="js-social-share" title="'+opts.sharePlatform[i]+'" href="'+opts.shareLinks[i]+phrase+' via @FondationHH'+url+'" '+((opts.newTab)?"target=\"_blank\"":"")+'>'+opts.shareIcons[i]+'</a>';
                }
                return content;
            },
            getSelection : function(option) {
                if(window.getSelection){
                    return (option==='string')?encodeURIComponent($.trim(window.getSelection().getRangeAt(0).toString())):window.getSelection().getRangeAt(0);
                }
                else if(document.selection){
                    return (option==='string')?encodeURIComponent($.trim(document.selection.createRange().text)):document.selection.createRange();
                }
            },
            showTooltip : function() {
                this.clear();
                this.preloadShareIcons(opts.shareIcons);

                var range = this.getSelection();

                // if less than 6 words, exit
                checkPhrase = ''+range;
                checkPhrase = checkPhrase.replace(/(^\s*)|(\s*$)/gi,"");
                var wordCount = checkPhrase.split(' ').length;
                if(wordCount <= opts.minLength){
                    return;
                } else if (checkPhrase === ''){ // if there are no highlighted text, exit
                    return;
                }

                var newNode = document.createElement("mark");
                range.surroundContents(newNode);
                $('mark').addClass(opts.className);
                $('.c-article').addClass('hasHiglights');

                $shareContentWidth = $('mark').parent().width();
                $position = (($(window).width() - $shareContentWidth) / 2) > 110 ? 'right' : 'top';

                $('.'+opts.className).tooltipster({
                    trigger:'custom',
                    interactive:true,
                    contentAsHTML: true,
                    content:this.getContent(range),
                    animation:opts.animation,
                    position: $position,
                    debug: false
                });
                $('.'+opts.className).tooltipster('show');
            },
            preloadShareIcons : function(array) {
                for (var i = 0; i < array.length; i++) {
                    var img = new Image();
                    img.src = array[i];
                }
            },
            clear : function() {
                if($('.'+opts.className).length) {
                    $('.'+opts.className).tooltipster('hide');   
                }
                $('.c-article').removeClass('hasHiglights');
                $('mark').contents().unwrap();
                $('mark').remove();
            }
        });

        // initialize the awesome plugin
        $.fn.contentshare.init(this);
    };

    var siteIconfb = '<svg class="o-icon o-icon--facebook"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#facebook"></use></svg>',
        siteIcontw = '<svg class="o-icon o-icon--twitter"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#twitter"></use></svg>';

    // default options
    $.fn.contentshare.defaults = {
        shareable  : {},
        shareIcons : [siteIconfb,siteIcontw],
        shareLinks : [
            "http://www.facebook.com/sharer.php?p[title]="+document.title+"&p[summary]=",
            "https://twitter.com/share?text="
        ],
        sharePlatform : ['Facebook', 'Twitter'],
        minLength  : 5,
        newTab     : true,
        className  : "c-highlight",
        animation  : "grow"
    };

}(jQuery));