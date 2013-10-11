app.pause = false;
app.sliderDiv = null;
app.init = function() {
  app.fillMapHeight();
  app.googleMaps.initialize();
  app.loadTweetDataFromDB();
  app.setupTweetStreamSocket();
  app.pausePlayDiv();
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
// sorry ass JS hack to set the map height to half the window size... 
// 50% in css doesn't seem to work
app.fillMapHeight = function() {
  $("#container").css("height", $(window).height() - $(window).height() / 2);
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
        var val = app.sliderDiv.slider( "value" );
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
      }
    );
  });
}
