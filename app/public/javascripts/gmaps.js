app.googleMaps = {}

// google overlay prototype
app.googleMaps.geocoder = new google.maps.Geocoder();
app.googleMaps.overlay = null;

app.googleMaps.initialize = function() {
  var ATL_lat = 33.756264;
  var ATL_lon = -84.385179;
  var mapOptions = {
    center: new google.maps.LatLng(ATL_lat,ATL_lon),
    zoom: 10, // far out
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("container"), mapOptions);
  app.googleMaps.map = map;
  // set the google weather and cloud layers
  var weatherLayer = new google.maps.weather.WeatherLayer({
    temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT
  });
  // redo overlay on map events
  google.maps.event.addListener(map, 'center_changed', function() {
    app.googleMaps.loadOverlay();
  });
  google.maps.event.addListener(map, 'bounds_changed', function() {
    app.googleMaps.loadOverlay();
  });
  google.maps.event.addListener(map, 'drag', function() {
    app.googleMaps.loadOverlay();
  });
  google.maps.event.addListener(map, 'resize', function() {
    app.googleMaps.loadOverlay();
  });
  google.maps.event.addListener(map, 'zoom_changed', function() {
    app.googleMaps.loadOverlay();
  });
  weatherLayer.setMap(app.googleMaps.map);
  setTimeout(app.googleMaps.loadOverlay, 2000);
};

app.googleMaps.loadOverlay = function() {
  var map = app.googleMaps.map;
  // build wunderground image api params
  var mapBounds = map.getBounds();
  var mapNE = mapBounds.getNorthEast();
  var mapSW = mapBounds.getSouthWest();
  var mapDiv = map.getDiv();
  /* Animated seems to load too slow :(
    var img = "http://api.wunderground.com/api/ba3cc8d32973ec43/animatedradar/image.gif?" +
    "maxlat=" + mapNE.lat() + "&maxlon=" + mapNE.lng() + "&minlat=" +
    mapSW.lat() + "&minlon=" + mapSW.lng() + "&width=" + mapDiv.offsetWidth +
    "&height=" + mapDiv.offsetHeight + "&newmaps=0&rainsnow=1&smooth=1&noclutter=1&num=6";
  */
  var img = "http://api.wunderground.com/api/ba3cc8d32973ec43/radar/image.gif?" +
    "maxlat=" + mapNE.lat() + "&maxlon=" + mapNE.lng() + "&minlat=" +
    mapSW.lat() + "&minlon=" + mapSW.lng() + "&width=" + mapDiv.offsetWidth +
    "&height=" + mapDiv.offsetHeight + "&newmaps=0&rainsnow=1&smooth=1&noclutter=1&reproj.automerc=1";
  // remove current overlay
  if( app.googleMaps.overlay ) {
    app.googleMaps.overlay.setMap(null);
  }
  app.googleMaps.overlay = new google.maps.GroundOverlay(img, map.getBounds());
  app.googleMaps.overlay.setMap(map);
  app.googleMaps.overlay.setOpacity(0.5);
};
