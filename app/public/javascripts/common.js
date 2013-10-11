var app = {};
app.map = {};
// for tracking maps markers
app.map.openMarkers = [];
app.map.allMarkers = [];
app.socket = io.connect(window.location.hostname);
app.init = function() {
  app.fillMapHeight();
  app.googleMaps.initialize();
  app.loadTweetDataFromDB();
  app.setupTweetStreamSocket();
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
  if(!app.pause) {
    // lat lon location of the tweet
    var tweetLatLng = null;
    var htmlStr =
      "<div class='tweet'>" +
        "<span class='tweet_text'>" +
          "<strong>tweet: </strong> " +
          "<a href='https://twitter.com/" + tweet.user.name + "/status/" + 
          tweet.id_str + "' target=_blank>" + tweet.text + "</a>" +
          "<br>" +
          "<strong>rank: </strong> " + tweet.ranking +
          "<br>";
          if( tweet.wx ) {
            if( tweet.wx.feelslike_f ) {
              htmlStr += "<strong>wunder temp (faren): </strong> " + tweet.wx.feelslike_f +
              "<br>";
            }
            if( tweet.wx.weather ) {
              htmlStr += "<strong>wunder condition: </strong> " + tweet.wx.weather +
              "<br>";
            }
          }
          htmlStr += "<strong>tweeted on: </strong>" + tweet.created_at;
    // this is the preferred lat/lon object
    if( tweet.coordinates ){
      var WUMapUrl = app.createWUMapUrlLatLon(tweet.coordinates.coordinates[1], tweet.coordinates.coordinates[0]);
      htmlStr +=
        "<br>" +
        "<strong>tweeted from geocode:</strong> <a href='" + WUMapUrl + "' target=_blank>" +
          tweet.coordinates.coordinates[1] + ", " + tweet.coordinates.coordinates[0] +
          "</a>";
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
      if( tweet.instagram_urls.length > 0 ) {
        var instaLen = tweet.instagram_urls.length;
        for(var o=0;o<instaLen;o++){
          htmlStr +=
          "<br>" +
          "<span class='tweet_img'>" +
            "Instagram photo: <br>" +
            "<img src='" + tweet.instagram_urls[o] + "'/>" +
          "</span>" +
          "<br>";
        }
      }
      // is there a direct twitter upload photo we can display?
      if( tweet.entities.media != null && tweet.entities.media.length > 0 ) {
        htmlStr +=
          "<br>" +
          "<span class='tweet_img'>" +
            "Twitter photo: <br>" +
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
}
// do reverse lookup of street address (twitter seems to only provide City, State/Province, Country)
app.reverseGeoCodeAddress = function( address, htmlStr ) {
  app.googleMaps.geocoder.geocode( { 'address': address}, function(results, status) {
    // good to go - if this fails we can't map it, so just fuck it
    if (status == google.maps.GeocoderStatus.OK) {
      app.createMapMarker( htmlStr, results[0].geometry.location )
    }
  });
}
app.createWUMapUrlLatLon = function ( lat, lon ) {
  return "http://www.wunderground.com/wundermap/?" +
  "lat=" + lat +
  "&lon=" + lon +
  "&zoom=6&type=hybrid&units=english" +
  "&pin=%20" +
  "&plat=" + lat +
  "&plon=" + lon +
  "&tl.play=0&tl.spd=2&viewportstart=now-14432&viewportend=now-32&groupSevere=1&groupHurricane=1&groupFire=1&groupCamsPhotos=1&groupRealEstate=1&eyedropper=0&extremes=0&fault=0&favs=0&femaflood=0&fire=0&firewfas=0&fissures=0&fronts=0&hurrevac=0&hur=0&labels=0&lightning=0&livesurge=0&mm=0&ndfd=0&rad=1&rad.num=1&rad.spd=25&rad.opa=70&rad.type=00Q&rad.type2=&rad.smo=1&sat=1&sat.num=1&sat.spd=25&sat.opa=85&sat.gtt1=109&sat.gtt2=109&sat.type=IR4&wxsn=1&wxsn.mode=temp&wxsn.opa=50&wxsn.showpws=1";
}
// creates a google map marker to plop down with an infowindow attached
app.createMapMarker = function( htmlStr, tweetLatLng ) {
  var infoWindow = new google.maps.InfoWindow;
  infoWindow.setContent(htmlStr);
  // action to perform when the marker gets clicked
  var onMarkerClick = function() {
    app.googleMaps.closeOpenMarkers();
    var marker = this;
    marker.infoWindow.open(app.googleMaps.map, marker);
    // track this open marker so we can close it later
    app.map.openMarkers.push(marker);
  };
  // when the map is clicked anywhere that is not a map marker it will close the open one
  google.maps.event.addListener(app.googleMaps.map, 'click', function() {
    infoWindow.close();
  });
  var marker = new google.maps.Marker({
    position: tweetLatLng,
    map: app.googleMaps.map,
    infoWindow: infoWindow
  });
  google.maps.event.addListener(marker, 'click', onMarkerClick);
  app.map.allMarkers.push(marker);
}
// on ready
$(document).ready(function() {
  app.init();
});