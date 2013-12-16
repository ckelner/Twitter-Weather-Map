/* Module dependencies. */
var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  io = require('socket.io'),
  _ = require('underscore'),
  path = require('path'),
  twitter = require('ntwitter'),
  request = require('request'),
  posts = require('./routes/posts.js'),
  rank = require('./rank.js'),
  config = require('./config.json');

var app = express();
var server = http.createServer(app);

app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.get('/', routes.index);
app.get('/fullscreenmap', routes.fullscreenmap);
app.get('/posts', posts.findAll);
app.get('/recentposts', posts.findRecent);
app.get('/recentposts/:minutes', posts.findByPastMinutes);
app.get('/instagram', posts.findAllInstagrams);
app.get('/posts/:id', posts.findById);
app.post('/posts', posts.addPost);
app.put('/posts/:id', posts.updatePost);
app.delete('/posts/:id', posts.deletePost);

// mongo setup
var mongo = require('mongodb');
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var mserver = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('weatherpostdb', mserver);

db.open(function(err, db) {
  if(!err) {
    console.log("Connected to 'weatherpostdb' database");
    db.collection('posts', {strict:true}, function(err, collection) {
      if(err) {
        console.log("The 'posts' collection does not exist, creating it with sample data");
        populateDB();
      }
    });
  }
});

//Start a Socket.IO listen
var io = io.listen(server);
io.set('log level', 1); // reduce socket io logging

// provide 15 miutes of data to user at startup
io.sockets.on('connection', function (socket) {
  var end = new Date();
  var start = new Date();
  start.setMinutes(start.getMinutes() - 15);
  db.collection('posts', function(err, collection) {
    collection.find({status: {$gte: start, $lt: end}}).toArray(function(err, items) {
      if(!err){
        socket.emit('firstShow', { tweets: items });
      }
    });
  });
});

// NTwitter setup
var twit = new twitter({
  consumer_key: config.twitter_consumer_key,
  consumer_secret: config.twitter_consumer_secret,
  access_token_key: config.twitter_access_token_key,
  access_token_secret: config.twitter_access_token_secret
});

// NTwitter stream
twit.stream(
  'statuses/filter',
  {
    'track' : rank.first_tier.toString()
  },
  function(stream) {
    stream.on(
      'data',
      function (tweet) {
        if(rank.validateTweet(tweet)) {
          var tweet_ranking = rank.getTweetRank(tweet);
          tweet['ranking'] = tweet_ranking;

          //Grab Tweet Location
          var tweet_loc;
          if(tweet['coordinates']) {
              tweet_loc = tweet['coordinates']['coordinates'];
          } else { 
            if(tweet['place'] && tweet['place']['bounding_box']) {
              tweet_loc = tweet['place']['bounding_box']['coordinates'][0];
            } else {
              console.log("location error, no place or coordinates");
              return;
            }
          }
          //Build Current Condition Request URL
          var actual_geo = tweet_loc[1] + ',' + tweet_loc[0];
          tweet['latlong'] = actual_geo;
          var condition_url = 'http://api.wunderground.com/api/' + config.wuAPI + '/conditions/q/';
          condition_url = condition_url + actual_geo + '.json'; 

          //Send request
          request.get({url:condition_url, json:true}, function (err, res, body) {
            if(!err && res.statusCode == 200) {
              //On response, check valid location/observation
              if(body['current_observation']) {
                tweet['wx'] = body['current_observation'];
              }
              // scrape for instagram
              tweet['instagram_urls'] = getInstaUrls(tweet);
              // send data to the front end
              io.sockets.emit('data', tweet);
              // pump it to mongo
              putTweetInDB(tweet);
            }
          });
        }
      }
    );
    stream.on('error', function(error, code) {
      console.log("Error: " + error + ": " + code);
    });
  }
);
// does the tweet have an insta URL
function getInstaUrls(tweet) {
  var instaUrls = [];
  if( tweet.entities ) {
    if( tweet.entities.urls && tweet.entities.urls.length > 0 ) {
      var urlLen = tweet.entities.urls.length;
      for(var z=0;z<urlLen;z++){
        var tweetUrl = tweet.entities.urls[z].expanded_url;
        if(tweetUrl.indexOf("instagram") != -1) {
          instaUrls.push(tweetUrl + "media");
        }
      }
    }
  }
  return instaUrls;
}
// put the valid tweet in the db
function putTweetInDB(tweet) {
  tweet['status'] = new Date();
  // debug
  // console.log("$$$$$$$$$$$$ Valid $$$$$$$$$$$$$$");
  // console.log(valid_tweet);
  db.collection('posts', function(err, collection) {
    collection.insert(tweet, {safe:true}, function(err, result) {
      if(err) {
       console.log('An error during tweet posting has occured');
      } else {
        // debug
       // console.log('Success: ' + JSON.stringify(result[0]));
      }
    });
  });
}
// moved from posts... my node on EC2 couldn't find this...? :(
function populateDB() {
  var posts =
    [
      {
        "name": "data",
        "args": [
          {
            "created_at": "Wed Oct 09 18:40:51 +0000 2013",
            "id": 3.8801118935714e+17,
            "id_str": "388011189357142017",
            "text": "2nd time in 7 months. #Rain #snapseed http:\/\/t.co\/KSdd6WOuHc",
            "source": "<a href=\"http:\/\/twitter.com\/download\/android\" rel=\"nofollow\">Twitter for Android<\/a>",
            "truncated": false,
            "in_reply_to_status_id": null,
            "in_reply_to_status_id_str": null,
            "in_reply_to_user_id": null,
            "in_reply_to_user_id_str": null,
            "in_reply_to_screen_name": null,
            "user": {
              "id": 208709507,
              "id_str": "208709507",
              "name": "Lyan",
              "screen_name": "lyanbv",
              "location": "Los Angles, CA",
              "url": null,
              "description": "kaizen",
              "protected": false,
              "followers_count": 96,
              "friends_count": 79,
              "listed_count": 0,
              "created_at": "Wed Oct 27 19:54:37 +0000 2010",
              "favourites_count": 30,
              "utc_offset": -25200,
              "time_zone": "Pacific Time (US & Canada)",
              "geo_enabled": true,
              "verified": false,
              "statuses_count": 4217,
              "lang": "en",
              "contributors_enabled": false,
              "is_translator": false,
              "profile_background_color": "131516",
              "profile_background_image_url": "http:\/\/a0.twimg.com\/profile_background_images\/378800000075313779\/8a8b8243436e7695452cfcb4c1501583.jpeg",
              "profile_background_image_url_https": "https:\/\/si0.twimg.com\/profile_background_images\/378800000075313779\/8a8b8243436e7695452cfcb4c1501583.jpeg",
              "profile_background_tile": false,
              "profile_image_url": "http:\/\/a0.twimg.com\/profile_images\/378800000479778444\/98f39f22a4731a908a285137a8bc9299_normal.jpeg",
              "profile_image_url_https": "https:\/\/si0.twimg.com\/profile_images\/378800000479778444\/98f39f22a4731a908a285137a8bc9299_normal.jpeg",
              "profile_banner_url": "https:\/\/pbs.twimg.com\/profile_banners\/208709507\/1379286613",
              "profile_link_color": "009999",
              "profile_sidebar_border_color": "FFFFFF",
              "profile_sidebar_fill_color": "EFEFEF",
              "profile_text_color": "333333",
              "profile_use_background_image": true,
              "default_profile": false,
              "default_profile_image": false,
              "following": null,
              "follow_request_sent": null,
              "notifications": null
            },
            "geo": {
              "type": "Point",
              "coordinates": [
                34.0572754,
                -118.4443617
              ]
            },
            "coordinates": {
              "type": "Point",
              "coordinates": [
                -118.4443617,
                34.0572754
              ]
            },
            "place": {
              "id": "3b77caf94bfc81fe",
              "url": "https:\/\/api.twitter.com\/1.1\/geo\/id\/3b77caf94bfc81fe.json",
              "place_type": "city",
              "name": "Los Angeles",
              "full_name": "Los Angeles, CA",
              "country_code": "US",
              "country": "United States",
              "bounding_box": {
                "type": "Polygon",
                "coordinates": [
                  [
                    [
                      -118.668176,
                      33.704554
                    ],
                    [
                      -118.668176,
                      34.337306
                    ],
                    [
                      -117.753334,
                      34.337306
                    ],
                    [
                      -117.753334,
                      33.704554
                    ]
                  ]
                ]
              },
              "attributes": {
                
              }
            },
            "contributors": null,
            "retweet_count": 0,
            "favorite_count": 0,
            "entities": {
              "hashtags": [
                {
                  "text": "Rain",
                  "indices": [
                    22,
                    27
                  ]
                },
                {
                  "text": "snapseed",
                  "indices": [
                    28,
                    37
                  ]
                }
              ],
              "symbols": [
                
              ],
              "urls": [
                
              ],
              "user_mentions": [
                
              ],
              "media": [
                {
                  "id": 3.8801118897127e+17,
                  "id_str": "388011188971266048",
                  "indices": [
                    38,
                    60
                  ],
                  "media_url": "http:\/\/pbs.twimg.com\/media\/BWJ-Ht-CYAArVb1.jpg",
                  "media_url_https": "https:\/\/pbs.twimg.com\/media\/BWJ-Ht-CYAArVb1.jpg",
                  "url": "http:\/\/t.co\/KSdd6WOuHc",
                  "display_url": "pic.twitter.com\/KSdd6WOuHc",
                  "expanded_url": "http:\/\/twitter.com\/lyanbv\/status\/388011189357142017\/photo\/1",
                  "type": "photo",
                  "sizes": {
                    "medium": {
                      "w": 600,
                      "h": 800,
                      "resize": "fit"
                    },
                    "large": {
                      "w": 1024,
                      "h": 1365,
                      "resize": "fit"
                    },
                    "thumb": {
                      "w": 150,
                      "h": 150,
                      "resize": "crop"
                    },
                    "small": {
                      "w": 340,
                      "h": 453,
                      "resize": "fit"
                    }
                  }
                }
              ]
            },
            "favorited": false,
            "retweeted": false,
            "possibly_sensitive": false,
            "filter_level": "medium",
            "lang": "en"
          }
        ]
      }
    ];

  posts[0]["status"] = new Date();

  //console.log("########### Generating fake posts ##########");
  //console.log(posts);

  db.collection('posts', function(err, collection) {
    collection.insert(posts, {safe:true}, function(err, result) {});
  });
}

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


