app.pause = false;
app.sliderDiv = null;
app.init = function() {
  app.fillMapHeight();
  app.googleMaps.initialize();
  app.loadTweetDataFromDB();
  app.setupTweetStreamSocket();
  app.pausePlayDiv();
  app.initBigDataDiv();
  app.initSlider();
}
app.pausePlayDiv = function() {
  $("#pause_play").click(function() {
    app.pause = (app.pause == false ? true : false)
    if( app.pause ) {
      $("#pause_play").css( "background-color", "red" );
    } else {
      $("#pause_play").css( "background-color", "green" );
    }
  });
}
app.initBigDataDiv = function() {
  $("#big_data").click(function() {
    $("#big_data").css( "background-color", "red" );
    app.initBigData();
  });
}
// sorry ass JS hack to set the map height to half the window size... 
// 50% in css doesn't seem to work
app.fillMapHeight = function() {
  $("#container").css("height", $(window).height() - $(window).height() / 2);
}
// get 24hrs of data
app.initBigData = function() {
  $.ajax( "/recentposts/" + (24 * 60) ).done(
    function( data ) {
      app.googleMaps.closeOpenMarkers();
      app.googleMaps.removeMarkers();
      var dataLen = data.length;
      for(var y=0;y<dataLen;y++) {
        var tweet = data[y];
        if( tweet.coordinates ){
          var tweetLatLng = new google.maps.LatLng(
            tweet.coordinates.coordinates[1],
            tweet.coordinates.coordinates[0]
          );
          app.createMapMarker( "", tweetLatLng, tweet.created_at );
          app.map.allMarkers.forEach( function(el) {
            el.setVisible(false);
          });
          app.pause=true;
        }
      }
      $("#big_data").css( "background-color", "green" );
    }
  );
}
app.initSlider = function() {
  $(function() {
    app.sliderDiv = $( "#slider" );
    app.sliderDiv.slider();
    app.sliderDiv.slider( "option", "min", 10 );
    app.sliderDiv.slider( "option", "max", 60 * 24 );
    app.sliderDiv.slider( "option", "step", 5 );
    app.sliderDiv.slider( "option", "value", 5 );
    app.sliderDiv.on( "slidechange",
      function( event, ui ) {
        var val = app.sliderDiv.slider("value");
        var curDate = new Date();
        var oldTime = new Date(curDate.getTime() - (val * 60 * 1000));
        app.map.allMarkers.forEach( function(el) {
          var createdAt = el.created_at;
          var markerDate = new Date(createdAt);
          var oldMS = oldTime.getTime();
          var markMS = markerDate.getTime();
          if(markMS > oldMS) {
            el.setVisible(true);
          } else {
            el.setVisible(false);
          }
        });
        // this takes way too long to load... I think we need to have all the tweet data in memory...
        /*var val = app.sliderDiv.slider( "value" );
        $.ajax( "/recentposts/" + val ).done(
          function( data ) {
            app.googleMaps.closeOpenMarkers();
            app.googleMaps.removeMarkers();
            var dataLen = data.length;
            for(var y=0;y<dataLen;y++) {
              app.processTweetData(data[y]);
            }
          }
        );
        */
      }
    );
  });
}
