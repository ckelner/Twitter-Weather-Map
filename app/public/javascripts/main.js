var app = {};
app.map = {};
// for tracking maps markers
app.map.openMarkers = [];
app.socket = io.connect(window.location.hostname);
app.init = function() {
  app.fillMapHeight();
  kelner_googleMaps.initialize();
  app.loadTweetDataFromDB();
  app.setupTweetStreamSocket();
}
// sorry ass JS hack to set the map height to half the window size... 
// 50% in css doesn't seem to work
app.fillMapHeight = function() {
  $("#container").css("height", $(window).height() - $(window).height() / 2);
}
app.loadTweetDataFromDB = function() {
  app.socket.on('firstShow', function (data) {
    var size = data.tweets.length
    for(var i=0;i<size;i++){
      app.processTweetData(data.tweets[i]);
    }
  });
}
app.setupTweetStreamSocket = function() {
  app.socket.on('data', function(tweet) {
    app.processTweetData(tweet);
  });
}
app.processTweetData = function(tweet) {
  // lat lon location of the tweet
  var tweetLatLng = null;
  var htmlStr =
    "<div class='tweet'>" +
      "<span class='tweet_text'>" +
        "<strong>tweet: </strong> " + tweet.text +
        "<br>" +
        "<strong>rank: </strong> " + tweet.ranking +
        "<br>" +
        "<strong>tweeted on:</strong> " + tweet.created_at;
  // this is the preferred lat/lon object
  if( tweet.coordinates ){
    htmlStr +=
      "<br>" +
      "<strong>tweeted from geocode:</strong> " +
        tweet.coordinates.coordinates[0] + ", " + tweet.coordinates.coordinates[1];
    tweetLatLng = new google.maps.LatLng(
      tweet.coordinates.coordinates[1],
      tweet.coordinates.coordinates[0]
    );
  }
  // human readable location, ex: Atlanta, Georgia United States
  if( tweet.place ) {
    htmlStr +=
      "<br>" +
      "<strong>tweeted from place:</strong> " +
      tweet.place.full_name + ", " + tweet.place.country;
    // only need to try to get the lat/lon if we don't have it already
    if( !tweet.coordinates ){
      app.reverseGeoCodeAddress( tweet.place.full_name + ", " + tweet.place.country, htmlStr );
    }
  }
  htmlStr += "</span>";
  if( tweet.entities ) {
    // see if there is a link in there we can use
    //TODO: go back and try to show this link if it is an image?
    if( tweet.entities.urls && tweet.entities.urls.length > 0 ) {
      if( tweet.entities.urls[0].expanded_url ) {
        htmlStr +=
        "<br>" +
        "<span class='tweet_link'>" +
          "<a href='" +tweet.entities.urls[0].expanded_url + "'>" +
            tweet.entities.urls[0].expanded_url +
          "</a>" +
        "</span>" +
        "<br><br>";
      }
    }
    // is there a direct twitter upload photo we can display?
    if( tweet.entities.media != null && tweet.entities.media.length > 0 ) {
      htmlStr +=
        "<br>" +
        "<span class='tweet_img'>" +
          "<img src='" + tweet.entities.media[0].media_url + "'/>" +
        "</span>" +
        "</div>" +
        "<br><br>";
    } else {
      htmlStr += "</div><br><br>";
    }
  } else {
    htmlStr += "</div><br><br>";
  }
  if(tweet.ranking && tweet.ranking >= 2) {
    $("#tweet_map_highlights").prepend(htmlStr);
  } else { 
    $("#tweet_map").prepend(htmlStr);
  }
  // this is only if coords were available, if we had to use 'place' then
  // the callpack for reverse geocoding lookup will create the map marker
  if( tweet.coordinates ){
    app.createMapMarker( htmlStr, tweetLatLng )
  }
}
// do reverse lookup of street address (twitter seems to only provide City, State/Province, Country)
app.reverseGeoCodeAddress = function( address, htmlStr ) {
  kelner_googleMaps.geocoder.geocode( { 'address': address}, function(results, status) {
    // good to go - if this fails we can't map it, so just fuck it
    if (status == google.maps.GeocoderStatus.OK) {
      app.createMapMarker( htmlStr, results[0].geometry.location )
    }
  });
}
// creates a google map marker to plop down with an infowindow attached
app.createMapMarker = function( htmlStr, tweetLatLng ) {
  var infoWindow = new google.maps.InfoWindow;
  infoWindow.setContent(htmlStr);
  // action to perform when the marker gets clicked
  var onMarkerClick = function() {
    var len = app.map.openMarkers.length;
    // close all the other open markers, this generally should just be one other one
    for(var i=0;i<len;i++){
      var aMarker = app.map.openMarkers.pop();
      aMarker.infoWindow.close();
    }
    var marker = this;
    marker.infoWindow.open(kelner_googleMaps.map, marker);
    // track this open marker so we can close it later
    app.map.openMarkers.push(marker);
  };
  // when the map is clicked anywhere that is not a map marker it will close the open one
  google.maps.event.addListener(kelner_googleMaps.map, 'click', function() {
    infoWindow.close();
  });
  var marker = new google.maps.Marker({
    position: tweetLatLng,
    map: kelner_googleMaps.map,
    infoWindow: infoWindow
  });
  google.maps.event.addListener(marker, 'click', onMarkerClick);
}
// on ready
$(document).ready(function() {
  app.init();
});
