var app = {};
app.user = {
  lat : "",
  lon : "",
  address : "",
  addr : null
};
app.init = function() {
  app.fillMapHeight();
  //app.getLocation();
  geolocator.locate(app.onGeoSuccess, app.onGeoError, true, { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 }, null);
};
app.fillMapHeight = function() {
  $("#container").css("height", $(window).height() - $('#container').offset().top - 40);
};
app.onGeoSuccess = function(location) {
  app.user.lat = location.coords.latitude;
  app.user.lon = location.coords.longitude;
  app.user.address = location.formattedAddress
  app.user.addr = location.address
  app.initGoogleMaps();
}
app.onGeoError = function(location) {
  alert("Could not get your location - please enter your location manually");
}
app.initGoogleMaps = function() {
  if( app.user.lat != "" ) {
    app.printUserAddress();
    kelner_googleMaps.initialize();
  } else {
    app.onGeoError();
  }
}
app.printUserAddress = function(count) {
  if( app.user.address != null && app.user.address != "" ) {
    $("p#address").html(" - from <i>" + app.user.address + "</i>");
  }
}
// on ready
$(document).ready(function() {
  app.init();
});
