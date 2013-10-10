var kelner_googleMaps = {}
kelner_googleMaps.initialize = function() {
  var mapOptions = {
    //center: new google.maps.LatLng(app.user.lat, app.user.lon),
    // ATLANTA WHERE THE PLAYERS PLAY
    center: new google.maps.LatLng(33.756264,-84.385179),
    zoom: 2, // far out
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("container"), mapOptions);
  kelner_googleMaps.map = map;
}
kelner_googleMaps.geocoder = new google.maps.Geocoder();
