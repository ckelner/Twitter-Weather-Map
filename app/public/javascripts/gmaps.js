var kelner_googleMaps = {}
kelner_googleMaps.initialize = function() {
  var mapOptions = {
    center: new google.maps.LatLng(app.user.lat, app.user.lon),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("container"), mapOptions);
}
