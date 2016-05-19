/*
 * Ads Module
 */

App.module.create(
	'ads',
	(function(window, $, app) {
		'use strict';

		// define module object
		var module = {},
			loadedUrl = false,
			initLoad = true,
			loadPostId = false,
			currentBreakpoint = false,
			breakerItems = [],
			$queue = $('<div></div>').attr('id','ads_queue');

		// ad units
		module.adUnits = {
			firstSet: [],
		};

		/***********************************
		 * private variables
		 */

		/***********************************
		 * private methods
		 */


		var addAdUnit = function(el, prefix, cnt, url, postId, cb) {
			// console.log('function??');
			prefix = typeof(prefix) === "undefined" ? 'ad_unit' : prefix;
			url = typeof(url) === "undefined" ? false : url;
			postId = typeof(postId) === "undefined" ? false : postId;
			var $el = $(el),
				id = prefix + cnt,
				data = $el.data(),
				adUnit = false,
				withResize = false,
				units = [],
				breakpoints = [],
				sizeMap = false,
				windowWidth = app.$window.width(),
				size = 320,
				currentSize = 0,
				isBreaker = false;

			if (typeof(data.code) == 'undefined') return false;
			if (typeof(data.type) == 'undefined') return false;

			data.type = data.type.toLowerCase();

			$el.attr('id', id);
			$el.addClass('ad-loaded');

			// get current size
			if (windowWidth < 728) size = 350; // mobile
			if (windowWidth >= 768 && windowWidth < 1440) size = 768;
			if (windowWidth >= 1440) size = 1440;
			currentBreakpoint = size;

			var resize = function () {
				windowWidth = app.$window.width();

				if (withResize && adUnit !== false && breakpoints.length > 0) {
					// if (windowWidth < 728) size = 320; // mobile
					// if (windowWidth >= 768 && windowWidth < 1024) size = 768;
					// if (windowWidth >= 1024) size = 1024;

					if (!breakpoints.contains(size)) return false;

					//if (currentSize !== size) {
						//currentSize = size;
						//console.log('resize 4', size, adUnit);
						googletag.cmd.push(function () {
							googletag.pubads().refresh([adUnit]);
						});
					//}
				}
			};

			googletag.cmd.push(function () {
				sizeMap = googletag.sizeMapping().build();

				if (['leaderboard', 'leaderboardpushdown', 'leaderboardexpandable'].indexOf(data.type) >= 0) {
					units = [728, 90]; // default desktop unit

					sizeMap = googletag.sizeMapping()
							//.addSize([1024, 300], [728, 90])
							.addSize([768, 200], [728, 90])
							.addSize([320, 400], [320, 50])
							.build();

					breakpoints = [320, 768];
					withResize = true;


				} else if (data.type == 'mpu') {
					units = [300, 250];
				} else if (data.type == 'half-page' || data.type == 'inline') {
					units = [300, 600];
				} else if (data.type == 'overlay') {
					units = [300, 600];

					sizeMap = googletag.sizeMapping()
							//.addSize([1024, 300], [728, 90])
							.addSize([768, 200], [300, 600])
							.addSize([320, 400], [300, 250])
							.build();

					breakpoints = [320, 768];
					withResize = true;

				} else if (data.type == 'hm') {
					units = [[300, 250], [300, 600]];
					// console.log('use hm');
				} else if (data.type == 'featuredbillboard') {
					units = [970, 250];
				} else if (data.type == 'breaker') {
					units = [[1440, 400], [768, 214], [350,209]];

					sizeMap = googletag.sizeMapping()
							.addSize([960, 600], [1440, 400])
							.addSize([651, 300], [768, 214])
							.addSize([0, 213], [350, 209])
							.build();

					breakpoints = [350, 768, 1440];
					withResize = true;
					isBreaker = true;
				} 

				adUnit = googletag.defineSlot('/90383227/' + data.code, units, id)
						.defineSizeMapping(sizeMap)
						.setCollapseEmptyDiv(true)
						.addService(googletag.pubads());

				if (url) {
					//console.log('TARGET URL: ', url);
					adUnit.setTargeting("url", url);
				}

				if (postId) {
					//console.log('TARGET Post Id: ', postId);
					adUnit.setTargeting("id", postId);
				}

				if (initLoad) {
					initLoad = false;
					googletag.pubads().enableSingleRequest();
					googletag.pubads().enableAsyncRendering();
					googletag.pubads().disableInitialLoad();
					googletag.enableServices();
				}

				adUnit.pushdown = false;
				if(['billboardpushdown', 'leaderboardpushdown'].indexOf(data.type) >= 0) {
					adUnit.pushdown = true;
				}

				adUnit.expandable = false;
				if(['billboardexpandable', 'leaderboardexpandable'].indexOf(data.type) >= 0) {
					adUnit.expandable = true;
				}

				adUnit.elemId = id;

				googletag.display(id);
				
				adUnit.elemId = id;
				adUnit.isBreaker = isBreaker;

				$el.data('adUnit', adUnit);

				setTimeout(function() {
					googletag.cmd.push(function () {
						googletag.display(id);
						if ($.isFunction(cb)) cb.call(el, cnt, adUnit);
					});
				}, 10 + (2 * cnt));

			});

		};

		var renderAd = function(el) {
			var $el = $(this),
				id = $el.attr('id'),
				data = $el.data();

			googletag.cmd.push(function () {
				googletag.display(id);
			});

		};

		var loadAds = function() {
			$('.js-ad-item').livequery(function() {
				app.adsCtr++;
				var $el = $(this),
					data = $el.data(),
					id = 'ad_' + app.adsCtr,
					cnt = 0;
					
				$el.addClass('ad-item-done');


				setTimeout(function() {
					
					module.adUnits[id] = $el;
					
					var _AdItems = [];
					$.each(module.adUnits[id], function (idx, ad_item) {
						$queue.queue('ItemsQueue', function() {
							cnt++;
							addAdUnit(ad_item, id + '-', cnt, false, false, function(idx, adUnit) {
								_AdItems.push(adUnit);
								if (idx == module.adUnits[id].length) {
									googletag.cmd.push(function () {
										googletag.pubads().refresh(_AdItems);
									});
								}
								$queue.dequeue('ItemsQueue');
							});
						});
					});

					$queue.dequeue('ItemsQueue');

				}, 500);
			});
		}

		var expandableInit = function(e) {
			// console.log('pushdown check');
			// console.log('e', e);
			if(e.slot.pushdown) {
				// console.log('binding pushdown events');
				window.parent.addEventListener('adExpandEvent', function(e) {
					if(typeof e.detail.height !== 'undefined') {
						// console.log('expand container #' + e.slot.elemId);
						var $container = $('#' + e.slot.elemId);
						$container.css({
							height: e.detail.height
						});
					}
				});

				window.parent.addEventListener('adCollapseEvent', function(e) {
					if(typeof e.detail.height !== 'undefined') {
						// console.log('collapse container #' + e.slot.elemId);
						var $container = $('#' + e.slot.elemId);
						$container.css({
							height: e.detail.height
						});
					}
				});
			}
		};


		var resizeAdImage = function(img, w, iframe) {
			var windowWidth = app.$window.width(),
				size = 0,
				maxH = 0;
			if (windowWidth < 728) { size = 650; maxH = 210; } // mobile
			if (windowWidth >= 651 && windowWidth < 960) { size = 960; maxH = 214; }
			if (windowWidth >= 961) { size = 1440; maxH = 400 }
			
			if(size != currentBreakpoint) {
				for(var key in breakerItems) {
					if(breakerItems.hasOwnProperty(key)) {
						googletag.pubads().refresh([breakerItems[key]]);
					}
				}
				currentBreakpoint = size;
			}

			var ratio = img.width() / img.height(),
			newW      = w,
			newH      = w/ratio;
			img.css({
				width: newW,
				height: newH,
			});

			if(newH >= maxH) newH = maxH;
			
			iframe.css({
				height: newH,
			});
		};



		/***********************************
		 * public application definition
		 */

		// handles when ad slot is rendered
		googletag.cmd.push(function () {
			googletag.pubads().addEventListener('slotRenderEnded', function (e) {
				breakerItems.push(e.slot);
				// check if ad is empty, if so try to refresh 1 time
				if (e.isEmpty && !e.slot.tried) {
					// console.log(e.slot);
					setTimeout(function () {
						e.slot.tried = true;
						googletag.pubads().refresh([e.slot]);
						expandableInit(e);
						// console.log('i tried');
					}, 500);
				}

				if (typeof(e.slot.isBreaker) !== 'undefined') {
					if (e.slot.isBreaker) {
						var elemId = e.slot.elemId,
							$el        = $('#'+elemId),
                            $container = $el.parent(),
							$div       = $el.children('div'),
							$iframe    = $div.find('iframe'),
							$frmBody   = $iframe.contents().find('body'),
							$frmDiv    = $frmBody.find('div'),
							$frmImg    = $frmDiv.find('img');

						app.$window.resize(function() {
							resizeAdImage($frmImg, app.$window.width(), $iframe);
						});
						resizeAdImage($frmImg, app.$window.width(), $iframe);

                        $container.removeClass('hidden');
                        
						// $iframe.css({'width' : '100%', 'height' : 'auto'});
						// $frmDiv.css({'width' : '100%', 'height' : 'auto'});
						// $frmImg.css({'width' : '100%', 'height' : 'auto'});

						// console.log('AD RENDER ENDED : ', e);
					}
				}

				if(typeof e.slot.elemId !== 'undefined') {
					var $container = $('#' + e.slot.elemId);
					if($container.length > 0) {
						$container.trigger('adRefresh');
						if(!e.isEmpty) {
	                        $container.parent().removeClass('hidden');
	                    }
					}
				}

				// reposition sidebar
                
				app.sidebar.sidebarArticle();

				// e.slot.pushdown
				// target div container to get iframe height

				// e.slot.expandable
				// iframe-class
				// height:
				// position: absolute
				// top: 0
				// left: 50%
				// transform: translateX(-50%)

				// console.log('relayout');

			});
		});


		/***********************************
		 * global app declaration of events and methods
		 */

        // module init method;
        // NOTE: important for initializing the module will be called dynamically
		module.init = function() {
			// console.log(":)");
			// console.log("ADS");
			$queue.hide();
			app.$body.append($queue);

			loadAds();
		};


		return module;
	})(window, jQuery, window.App)
);