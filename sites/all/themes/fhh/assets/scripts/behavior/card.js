
/*
 * Card
 */

App.module.create(
  'card',
  (function(window, $, app) {
  'use strict';

  // define module object
  var module = {};

  /***********************************
  * private variables
  */
  var $article = $('.js-article'),
      $main = $('.js-main'),
      card_ids = [],
      body_scroll_top = 0;

  /***********************************
  * private methods
  */


  /***********************************
  * public application definition
  */

  var bindCardToggler = function () {
    $('.js-card__toggle__item, a[data-card-id]').livequery(function (e) {

      $(this).each(function () {
        var $el = $(this),
          $card = $('.js-card'),
          $body = $('.js-body'),
          // $main = $('.js-main'),
          $footer = $('.js-footer'),
          $toggleContainer = $('.js-card__toggle'),
          $elCardID = $el.data('cardId');

        // Add overflow body
        // add scroll in container of c-card
        $el.on('click', function (e) {
          e.preventDefault();
          body_scroll_top = app.$window.scrollTop();

          // if (!$('.js-card__toggle__item, a[data-card-id]').hasClass('is-card-toggler--active')) {
          if (!$el.hasClass('is-card-toggler--active')) {
            setTimeout( function () {
              closeCard();
              app.$body.addClass('u-no-scroll has-card-open');
              $toggleContainer.addClass('is-card-toggle--active');
              $el.addClass('is-card-toggler--active');
              $body.addClass('is-body--move');
              $footer.addClass('is-footer--move');
              $('.js-card[data-card-id="' +  $elCardID + '"]').addClass('is-card--move');
              $body.append('<div class="c-card__wrapper js-card__wrapper"></div>');
              // console.log('open: ' + body_scroll_top);
              // $main.css({'overflow-x':'visible', 'top':'-'+(body_scroll_top)+'px'});
              // app.$html.addClass('u-no-scroll');
            }, 350);

            $('.c-snackable').css({display: 'none'});

          } else {
            closeCard();
            // body_scroll_top = app.$window.scrollTop();
            // app.$window.scrollTop(body_scroll_top);
            // console.log('close: ' + app.$window.scrollTop());
          }
        });

      });
    });
  }

  var closeCard = function () {
    app.$body.removeClass('u-no-scroll has-card-open');
    $('.js-card__toggle').removeClass('is-card-toggle--active');
    $('.js-card__toggle__item, [data-card-id]').removeClass('is-card-toggler--active');
    $('.js-body').removeClass('is-body--move');
    $('.js-footer').removeClass('is-footer--move');
    $('.js-main').css({'overflow-x':'hidden', 'top':''});
    $('.js-card').removeClass('is-card--move');
    $('.js-card__wrapper').remove();
    $('.c-snackable').removeAttr('style');
    app.$html.removeClass('u-no-scroll');
  };

  var bindEditorToggler = function () {
    $('.js-editor').livequery(function () {
      var $el = $(this),
        $content = $el.find('.js-editor__content'),
        $body = $el.find('.js-editor__body'),
        $moreToggle = $el.find('.js-editor__more'),
        $parent = $el.parents('.js-article'),
        $toggle = $parent.find('.js-editor__toggle'),
        $close = $parent.find('.js-editor__close');

      $toggle.on('click', function(e) {
        e.preventDefault();

        var $editorID = $(this).data('editorId');

        if (!$el.hasClass('is-editor--open')) {
          $el.filter('[data-editor-id="' + $editorID + '"]').addClass('is-editor--open');
          $el.filter('[data-editor-id="' + $editorID + '"]').addClass('finish');
        } else {
          $el.removeClass('finish');
          $el.removeClass('is-editor--open');
        }
        setTimeout(function () { app.$window.resize(); }, 650);
      });

      $close.on('click', function () {
        $el.removeClass('is-editor--open');
        $el.removeClass('finish');
      });


      // show read more toggler
      // if editor body is more than 143px
      var checkBody = function () {
        var textLength = app.$window.width() >= app.breakpoint.small ? 400 : 230;
        if ($body.outerHeight() >= 142 && $body.text().length >= textLength) {
          $moreToggle.addClass('is-show');
        } else {
          $moreToggle.removeClass('is-show is-active');
        }
      }

      checkBody();
      app.$window.on('resize', checkBody);

      if ($content.find('.c-editor__content__container').outerHeight() > 500) {
        $content.mCustomScrollbar({
          theme: 'fhh-theme'
        });
      }

      $moreToggle.on('click', function (e) {
        e.preventDefault();

        var $this = $(this),
          $more = $this.data('readMore'),
          $less = $this.data('readLess');

        if ($this.hasClass('is-show') && !$content.hasClass('is-show-all')) {
          $body.addClass('show-all');
          $content.addClass('is-show-all')
            .mCustomScrollbar({
              theme: 'fhh-theme'
            });
          $this.addClass('is-active')
            .find('span').text($less);
        } else {
          $body.removeClass('show-all');
          $content.removeClass('is-show-all')
            .mCustomScrollbar('destroy');
          $this.removeClass('is-active')
            .find('span').text($more);
        }

      });

    });
  };

  var closeWrapper = function () {
    $('.js-card__wrapper').livequery(function () {
      var $el = $(this),
        body_scroll_top = $(window).scrollTop();

      $el.on('click', closeCard);
    });
  };

  var loadArticleCards = function() {
    if(app.$body.hasClass('single-post') && !app.$body.hasClass('article-card-loaded')) {
      $.ajax({
        url: "/wp-admin/admin-ajax.php?action=article_cards",
        type: "GET",
        success: function(data){
          app.articleCards = data;
          app.$body.addClass('article-card-loaded');
          passThruArticle();
        }
      });
    }
  }
  RegExp.quote = function(str) {
     return str.replace(/([.?*+^$[\]\\(){}|-|])/g, "\\$1");
  };
  var passThruArticle = function() {
    $('.js-article').livequery(function() {
      var $el = $(this);
      if(!$el.hasClass('js--glossary-done')) {
        if(App.articleCards.length) {
          var $articleBody = $('.js-article__body', $el),
              tmpArray = [],
              ctr = 0;
          $articleBody.html( $articleBody.html().replace(/\u2013/g, '-') );
          var text = $articleBody.text().replace(/\u2013/g, '-');
          for( var key in app.articleCards ) {
            if (App.articleCards.hasOwnProperty(key)) {
              var card = App.articleCards[key];
              var word = card.string;
              var regx = new RegExp(RegExp.quote(word), 'gi');
              var matches = text.match(regx);

              // console.log("word:"+word);
              // console.log("regx:"+regx);
              // console.log("matches:"+matches);

              if(matches) {
                createCard(card);
                for( var key2 in matches ) {
                  if (matches.hasOwnProperty(key2)) {
                    var glossary_word = matches[key2];
                    var glossary_reg = new RegExp(RegExp.quote(glossary_word), 'g');

                    // add temporary title
                    var temp_title = matches[key2];
                    temp_title = '!!!!FHH!!!!' + temp_title + '!!!!FHH!!!!';
                    temp_title = temp_title.replace(/ /g,'&nbsp;');
                    tmpArray['{{{'+ctr+'}}}'] = '<a href="javascript:void()" data-card-id="'+card.id+'">' + temp_title + '</a>';
                    $articleBody.html( $articleBody.html().replace(glossary_reg, '{{{'+ctr+'}}}'));
                    ctr++;
                  }
                }
              }
            }
          }

          for( var key in tmpArray) {
             if (tmpArray.hasOwnProperty(key)) {
                var regx = new RegExp(RegExp.quote(key), 'gi');
                $articleBody.html( $articleBody.html().replace(regx, tmpArray[key]));
             }
          }

          //remove temp text
          $articleBody.html( $articleBody.html().replace(/!!!!FHH!!!!/g,'') );
        }
      }
    });
  }

  var createCard = function(card) {

    if(card_ids.indexOf(card.id) >= 0) return;

    card_ids.push(card.id);

    if(card.type === 'brand') {

      var cardElement = $('<div class="c-card c-card--brand js-card" data-card-id="'+card.id+'"><div class="c-card__container"><div class="c-card__head"></div></div></div>');
      $('.c-card__container', cardElement).append('<div class="c-card__photo c-card__photo--left"><img src="'+card.image+'" title="'+card.name+'" /></div>');
      $('.c-card__container', cardElement).append('<h6 class="c-card__name">'+card.name+'</h6>');
      $('.c-card__container', cardElement).append('<div class="c-card__title">'+card.title+'</div>');
      $('.c-card__container', cardElement).append('<div class="c-card__body"></div>');

      if(card.intro_text.length) {
        $('.c-card__body', cardElement).append('<div class="c-shareline">'+
        '<div class="c-shareline__head">'+
          '<ul class="o-list o-list--horizontal o-list--space-m o-list--border clearfix">'+
            '<li><a href="javascript://void(0);"><svg class="o-icon o-icon--facebook"><use xlink:href="#facebook"></use></svg></a></li>'+
            '<li><a href="javascript://void(0);"><svg class="o-icon o-icon--twitter"><use xlink:href="#twitter"></use></svg></a></li>'+
          '</ul>'+
        '</div>'+
        '<div class="c-shareline__body">'+ card.intro_text +'</div>'+
      '</div><!-- /.c-shareline -->');
      }

      if(card.text.length) {
        $('.c-card__body', cardElement).append('<div class="c-card__content js-card--more"></div>');
        $('.c-card__content', cardElement).append(card.text);
      }

      if(card.text.length > 90) {
        $('.c-card__body', cardElement).append('<a href="javascript://void(0);" title="Read more" class="read-more js-card--more__toggle"><span class="o-label o-label--dropdown" data-readmore-text="'+card.card_link_text3+'" data-readless-text="'+card.card_link_text4+'">'+card.card_link_text3+'</span></a>');
      }

      $('.c-card__container', cardElement).append(
        '<div class="c-card__foot">'+
          '<ul class="o-list o-list--horizontal o-list--border">'+
            '<li><a href="#" title="Brand Page">'+card.card_link_text+'</a></li>'+
            '<li><a href="#" title="Related Articles">'+card.card_link_text2+'</a></li>'+
          '</ul>'+
        '</div>'
      );

      // console.log(cardElement);
      $main.after(cardElement);
    }

    if(card.type === 'profile') {
      var cardElement = $('<div class="c-card c-card--designer js-card" data-card-id="'+card.id+'"><div class="c-card__container"><div class="c-card__head"></div></div></div>');
      $('.c-card__container', cardElement).append('<div class="c-card__photo c-card__photo--left"><img src="'+card.image+'" title="'+card.name+'" /></div>');
      $('.c-card__container', cardElement).append('<h6 class="c-card__name">'+card.name+'</h6>');
      $('.c-card__container', cardElement).append('<div class="c-card__title">'+card.title+'</div>');
      $('.c-card__container', cardElement).append('<div class="c-card__body"></div>');

      if(card.intro_text.length) {
        $('.c-card__body', cardElement).append('<div class="c-shareline">'+
        '<div class="c-shareline__head">'+
          '<ul class="o-list o-list--horizontal o-list--space-m o-list--border clearfix">'+
            '<li><a href="'+card.fb_share+'" target="_blank"><svg class="o-icon o-icon--facebook"><use xlink:href="#facebook"></use></svg></a></li>'+
            '<li><a href="'+card.twitter_share+'" target="_blank"><svg class="o-icon o-icon--twitter"><use xlink:href="#twitter"></use></svg></a></li>'+
          '</ul>'+
        '</div>'+
        '<div class="c-shareline__body ellipsis">'+ card.intro_text +'</div>'+
      '</div><!-- /.c-shareline -->');
      }

      // if(card.text.length) {
      //   $('.c-card__body', cardElement).append(card.text);
      // }


      if(card.text.length) {
        $('.c-card__body', cardElement).append('<div class="c-card__content js-card--more"></div>');
        $('.c-card__content', cardElement).append(card.text);
      }

      if(card.text.length > 90) {
        $('.c-card__body', cardElement).append('<a href="javascript://void(0);" title="Read more" class="read-more js-card--more__toggle"><span class="o-label o-label--dropdown" data-readmore-text="'+card.card_link_text3+'" data-readless-text="'+card.card_link_text4+'">'+card.card_link_text3+'</span></a>');
      }

      $('.c-card__container', cardElement).append(
        '<div class="c-card__foot">'+
          '<ul class="o-list o-list--horizontal o-list--border">'+
            '<li><a href="#" title="View Profile">'+card.card_link_text+'</a></li>'+
            '<li><a href="#" title="Other">'+card.card_link_text2+'</a></li>'+
          '</ul>'+
        '</div>'
      );


      $main.after(cardElement);
    }

    if(card.type === 'product') {
      var cardElement = $('<div class="c-card c-card--watch js-card" data-card-id="'+card.id+'"><div class="c-card__container"><div class="c-card__head"></div></div></div>');
      $('.c-card__container', cardElement).append('<div class="c-card__hero"><div class="c-watch"></div></div>');
      $('.c-watch', cardElement).append('<div class="c-watch__item js-carousel__item">'+
          '<div class="c-watch__image">'+
            '<img src="'+card.image+'" alt="">'+
          '</div>'+
          '<div class="c-watch__details o-meta js-carousel__details o-align-c">'+
            '<div class="o-meta__title__product">'+card.title+'</div>'+
          '</div>'+
        '</div><!-- /.c-carousel__item -->');

      if(card.cta_text.length && card.url.length) {
        $('.c-card__container', cardElement).append('<div class="c-watch__foot o-align-c">'+
            '<a href="'+card.url+'" title="'+card.cta_text+'" class="o-button o-button--small">'+card.cta_text+'</a>'+
          '</div>');
      }

      $('.c-card__container', cardElement).append('<div class="c-card__body"></div>');

      if(card.intro_text.length) {
        $('.c-card__body', cardElement).append('<div class="c-shareline">'+
        '<div class="c-shareline__head">'+
          '<ul class="o-list o-list--horizontal o-list--space-m o-list--border clearfix">'+
            '<li><a href="javascript://void(0);"><svg class="o-icon o-icon--facebook"><use xlink:href="#facebook"></use></svg></a></li>'+
            '<li><a href="javascript://void(0);"><svg class="o-icon o-icon--twitter"><use xlink:href="#twitter"></use></svg></a></li>'+
          '</ul>'+
        '</div>'+
        '<div class="c-shareline__body">'+ card.intro_text +'</div>'+
      '</div><!-- /.c-shareline -->');
      }

      if(card.text.length) {
        console.log("product->card.text.length");
        $('.c-card__body', cardElement).append('<div class="c-card__content js-card--more"></div>');
        $('.c-card__content', cardElement).append(card.text);
      }

      if(card.text.length > 90) {
        $('.c-card__body', cardElement).append('<a href="javascript://void(0);" title="Read more" class="read-more js-card--more__toggle"><span class="o-label o-label--dropdown" data-readmore-text="'+card.card_link_text3+'" data-readless-text="'+card.card_link_text4+'">'+card.card_link_text3+'</span></a>');
      }

      $('.c-card__container', cardElement).append(
        '<div class="c-card__foot">'+
          '<ul class="o-list o-list--horizontal o-list--border">'+
            '<li><a href="#" title="Brand Page">'+card.card_link_text+'</a></li>'+
            '<li><a href="#" title="Related Articles">'+card.card_link_text2+'</a></li>'+
          '</ul>'+
        '</div>'
      );

      $main.after(cardElement);
    }
  };

  var showMore = function () {
    $('.js-card--more__toggle').livequery(function () {
      var $toggle = $(this);

      $toggle.on('click', function () {
        var $el = $(this),
        readmoreText = $el.find('.o-label').data('readmoreText'),
        readlessText = $el.find('.o-label').data('readlessText');

        if (!$toggle.prev().hasClass('show-more')) {
          console.log(readmoreText);
          $el.addClass('is-active');
          $el.prev().addClass('show-more');
          $el.find('.o-label').text(readlessText);
        } else {
          console.log(readlessText);
          $el.removeClass('is-active');
          $el.prev().removeClass('show-more');
          $el.find('.o-label').text(readmoreText);
        }
      });
    });
  };

  var bindContactAuthor = function() {
      $('form.o-form--card--contact-author').livequery(function () {
        var $el = $(this);

        if($el.length == 0) return;

        $el.find('[type=submit]').removeClass('disabled').prop('disabled', false);


        $el.on('submit', function(e) {
          e.preventDefault();
          validateContactAuthorForm($el);
          return false;
        });

        $el.find(".o-input,.o-textarea").on('keydown', function(e) {
          $(this).parent().removeClass('error');
          $el.find('.message').text('');
        });

      });
  };

  var validateContactAuthorForm = function($form) {
      var formValues = $form.serializeArray(),
          formData = {},
          is_error = false;

      for(var i = 0; i < formValues.length ; i++) {
        formData[formValues[i].name] = formValues[i].value;
      }

      if(checkRequiredFields($form)) {
        var $el = $form.find('.message');
        $el.html($el.data('waiting-text'));
        sendContactAuthorForm($form, formData);
      }
  };

  var checkRequiredFields = function($form) {
      var is_error = false;

      $form.find('[data-required=true]').each(function() {
        var $field = $(this);
        if($field.val() === '') {
          $field.parent().addClass('error');
          is_error = true;
        }
      });

      return !is_error;
  };

  var sendContactAuthorForm = function($form, formData) {
        app.request({
          url     : '/wp-admin/admin-ajax.php?action=contact_author',
          data    : formData,
          method    : 'POST',
          dataType  : 'json',
          success   : function (data, status, xhr) {
            if(data.status === 'error') {
              if(data.code === 'email_invalid') {
                $form.find('input[name=email]').focus().parent().addClass('error');
              } else if(data.code === 'required_fields') {
                checkRequiredFields($form);
              }
              $form.find('.message').text(data.responseText);
            } else if(data.status === 'success') {
              $form.addClass('is-hidden');
              $form.next().removeClass('is-hidden');
            }
          },
          error     : function (xhr, status, error) {
            console.log('error');
          }
        });
  };

  /***********************************
  * global app declaration of events and methods
  */

  // module init method;
  // NOTE: important for initializing the module will be called dynamically
  module.init = function() {
    bindEditorToggler();
    bindCardToggler();
    closeWrapper();
    loadArticleCards();
    showMore();
    bindContactAuthor();
  };


  return module;
  })(window, jQuery, window.App)
);
