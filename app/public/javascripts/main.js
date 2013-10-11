app.pause = false;
app.init = function() {
  app.fillMapHeight();
  app.googleMaps.initialize();
  app.loadTweetDataFromDB();
  app.setupTweetStreamSocket();
  app.pausePlayDiv();
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
