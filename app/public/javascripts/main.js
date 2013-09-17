var app = {};
app.user = {
  lat : "",
  lon : "",
  address : "",
  addr : null
}
app.init = function() {
  app.fillMapHeight();
  geolocator.locate( 
    app.onGeoSuccess,
    app.onGeoError,
    true,
    {
      enableHighAccuracy: true,
      timeout: 3000,
      maximumAge: 0
    },
    null
  );
  app.processTweetData();
}
app.fillMapHeight = function() {
  $("#container").css("height", $(window).height() - $('#container').offset().top - 40);
  $("#tweet_map").css("height", $(window).height() - $('#tweet_map').offset().top - 40);
  // why???
  $("#tweet_map").css("top", "-10px");
}
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
app.processTweetData = function() {
    var socket = io.connect(window.location.hostname);
    socket.on('data', function(tweet) {
      $("#tweet_map").prepend(
        "<div class='tweet'>" +
          "<span class='tweet_text'>" +
            "tweet: " + tweet.text +
          "</span>" +
          "<span class='tweet_img'>" +
            "<img src='" + tweet.entities.media[0].media_url + "'/>" +
          "</span>" +
        "</div>"
      );
    });
}
// on ready
$(document).ready(function() {
  app.init();
});
