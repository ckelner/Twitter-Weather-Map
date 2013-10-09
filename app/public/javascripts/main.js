var app = {};
app.user = {
  lat : "",
  lon : "",
  address : "",
  addr : null
}
app.socket = io.connect(window.location.hostname);
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
  app.processInstagramData();
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
  app.socket.on('data', function(tweet) {
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
app.processInstagramData = function() {
  app.socket.on('firstShow', function (data) {
    var size = data.firstShow.length
    for(var i=0;i<size;i++){
      app.addInstaGramPhotos(
        (data.firstShow[i].caption == null ? '' : data.firstShow[i].caption.text),
        data.firstShow[i].images.standard_resolution.url
      );
    }
  });
  app.socket.on('instagram', function(data) {
    var url = data.show;
    $.ajax({
        url: url,
        type: 'POST',
        crossDomain: true,
        dataType: 'jsonp'
    }).done(function (data) {
        var size = data.data.length
        for(var i=0;i<size;i++){
          app.addInstaGramPhotos(
            (data.data[i].caption == null ? '' : data.firstShow[i].caption.text),
            data.data[i].images.standard_resolution.url
          );
        }
    }); 
  });
}
app.addInstaGramPhotos = function(text, img_url) {
  $("#tweet_map").prepend(
    "<div class='tweet'>" +
      "<span class='tweet_text'>" +
        "INSTAGRAM: " + text +
      "</span>" +
      "<span class='tweet_img'>" +
        "<img src='" + img_url + "'/>" +
      "</span>" +
    "</div>"
  );
}
// on ready
$(document).ready(function() {
  app.init();
});
