var app = {};
app.user = {
  lat : "",
  lon : "",
  address : "",
  addr : null
}
app.socket = io.connect(window.location.hostname);
app.init = function() {
  //app.fillMapHeight();
  /*geolocator.locate( 
    app.onGeoSuccess,
    app.onGeoError,
    true,
    {
      enableHighAccuracy: true,
      timeout: 3000,
      maximumAge: 0
    },
    null
  );*/
  app.processTweetData();
  // app.processInstagramData();
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
    if( tweet.coordinates || tweet.place ){
      var htmlStr = "<div class='tweet'>" +
        "<span class='tweet_text'>" +
        "<strong>tweet: </strong> " + tweet.text +
        "<br>" +
        "<em>tweeted @:</em> " + tweet.created_at;
      if( tweet.coordinates ){
        /*
        coordinates: Array[2]
          0: -118.49675061
          1: 34.0148869
        */
        htmlStr += "<br>" +
          "<strong><em>tweeted from geocode:</em></strong> " + tweet.coordinates.coordinates[0] + ", " +
          tweet.coordinates.coordinates[1];
      }
      if( tweet.place ) {
        /*
        place: Object
          attributes: Object
          bounding_box: Object
          country: "United States"
          country_code: "US"
          full_name: "Santa Monica, CA"
          id: "59612bd882018c51"
          name: "Santa Monica"
          place_type: "city"
        */
        htmlStr += "<br>" +
          "<strong><em>tweeted from place:</em></strong> " + tweet.place.full_name + ", " +
          tweet.place.country;
      }
      htmlStr += "</span>";
      /*
        entities: Object
          urls: Array[1]
            0: Object
              display_url: "instagram.com/p/fQdZZAkuBT/"
              expanded_url: "http://instagram.com/p/fQdZZAkuBT/"
              indices: Array[2]
              url: "http://t.co/vkeYi20y7l"
      */
      if( tweet.entities ) {
        if( tweet.entities.urls && tweet.entities.urls.length > 0 ) {
          if( tweet.entities.urls[0].expanded_url ) {
            htmlStr += "<br><span class='tweet_link'><a href='" +
              tweet.entities.urls[0].expanded_url + "'>" +
              tweet.entities.urls[0].expanded_url + "</a></span><br><br>";
          }
        }
        if( tweet.entities.media != null && tweet.entities.media.length > 0 ) {
          htmlStr += "<br><span class='tweet_img'>" +
            "<img src='" + tweet.entities.media[0].media_url + "'/>" +
              "</span>" +
            "</div><br><br>";
        } else {
          htmlStr += "</div><br><br>";
        }
      } else {
        htmlStr += "</div><br><br>";
      }
      $("#tweet_map").prepend(htmlStr);
    }
  });
}
/*app.processInstagramData = function() {
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
}*/
// on ready
$(document).ready(function() {
  app.init();
});
