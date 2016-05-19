/*
 * Maps
 */

App.module.create(
  'maps',
  (function(window, $, app) {
  'use strict';

  // define module object
  var module = {};

  /***********************************
  * private variables
  */

  /***********************************
  * private methods
  */


  /***********************************
  * public application definition
  */

  var bindEventInfo = function(){
    $('.c-event__info').livequery(function(){
      var $eventInfo = app.$doc.find('.c-event__info'),
          $eventCont = app.$doc.find('.c-event__info__container'),
          $eventMap = app.$doc.find('.c-event__map');

      var checkHeights = function(cb){
        if( $eventCont.outerHeight() > $eventInfo.outerHeight() ){
          $eventInfo.addClass('is-tall');
          if(typeof cb === 'function') {
            cb();
          }
        }
      }

      var adjustMap = function(){
        if( ($eventCont.outerHeight() + 48) > 550 ) {
          $eventMap.css({ height: ($eventCont.outerHeight() + 48) });
        } else {
          $eventMap.css({ height: 550 });
        }
      }

      app.$window.on('resize', adjustMap);
      checkHeights(adjustMap);
    });
  };

  var bindMap = function () {

    $('#js-map').livequery(function(){

      var styles = [
        {
          "featureType": "administrative",
          "elementType": "labels",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "landscape",
          "elementType": "labels",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "poi",
          "elementType": "labels",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "transit",
          "elementType": "labels",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "transit",
          "elementType": "geometry",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "water",
          "elementType": "labels",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            { "color": "#26262d" }
          ]
        },{
          "featureType": "landscape",
          "stylers": [
            { "color": "#4d4d5b" }
          ]
        },{
          "featureType": "road",
          "elementType": "labels.text.stroke",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "road",
          "elementType": "labels.text",
          "stylers": [
            { "color": "#ffffff" }
          ]
        },{
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "road.highway",
          "elementType": "geometry.fill",
          "stylers": [
            { "color": "#252630" }
          ]
        },{
          "featureType": "road.arterial",
          "elementType": "geometry.stroke",
          "stylers": [
            { "color": "#808080" },
            { "visibility": "off" }
          ]
        },{
          "featureType": "road.arterial",
          "elementType": "geometry.fill",
          "stylers": [
            { "color": "#26262d" }
          ]
        },{
          "featureType": "road.local",
          "elementType": "geometry.stroke",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "road.local",
          "elementType": "geometry.fill",
          "stylers": [
            { "color": "#3a3a47" }
          ]
        },{
          "featureType": "poi",
          "elementType": "labels.icon",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "poi",
          "elementType": "labels.text",
          "stylers": [
            { "visibility": "off" }
          ]
        },{
          "featureType": "road.local",
          "elementType": "geometry.fill",
          "stylers": [
            { "color": "#262730" }
          ]
        }
      ];

      var map = new GMaps({
        div: '#js-map',
        lat: parseFloat($('#js-map').attr('data-lat')) + 0.01,
        lng: $('#js-map').attr('data-lng'),
        disableDefaultUI: true,
        zoom: 13
      });

      var image_marker = $('#js-map').attr('data-icon');
      map.addMarker({
        lat: $('#js-map').attr('data-lat'),
        lng: $('#js-map').attr('data-lng'),
        icon: image_marker,
      });

      map.addStyle({
        styledMapName:'Styled Map',
        styles: styles,
        mapTypeId: 'map_style'
      });

      map.setStyle('map_style');
    });
  }

  /***********************************
  * global app declaration of events and methods
  */

  // module init method;
  // NOTE: important for initializing the module will be called dynamically
  module.init = function() {
    bindMap();
    bindEventInfo();
  };


  return module;
  })(window, jQuery, window.App)
);
