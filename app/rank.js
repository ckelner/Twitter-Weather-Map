/*
  get as many potential results as possible - the idea being we don't want 
  to limit the scope up front.  Let's filter through the shit
*/
var sample_tweet =
          {
            "created_at": "Wed Oct 09 18:40:51 +0000 2013",
            "id": 3.8801118935714e+17,
            "id_str": "388011189357142017",
//            "text": "2nd time in 7 months. #Rain #snapseed http:\/\/t.co\/KSdd6WOuHc",
            "text": "Nasty weather. :/ #rain #gloomy #roadtrip amberjamon rodmom7911 @AJRAGQC_love @ Cedar Crest, New Mexico http://t.co/QoMbIfyHKu",
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
          };


var old_first_tier_terms = [
  "weather",
  "weatherchannel",
  "wunderground",
  "hurricane",
  "lightning",
  "monsoon",
  "precipitation",
  "rain",
  "rainy",
  "raindrops",
  "rainfall",
  "raining",
  "rainstorm",
  "sprinkling",
  "storm",
  "snow",
  "snowy",
  "stormy",
  "sunshine",
  "sunshower",
  "thunderstorm",
  "tornado",
  "weather",
  "weatherchannel",
  "wunderground",
  "wx",
  "wxweather"
];

//optimized for rain
var first_tier_terms = [
  "hurricane",
  "thunder",
  "lightning",
  "monsoon",
  "precipitation",
  "rain",
  "rainy",
  "raindrops",
  "rainfall",
  "raining",
  "rainstorm",
  "snow",
  "snowy",
  "sprinkling",
  "storm",
  "stormy",
  "sunshine",
  "sunshower",
  "thunderstorm"
];

var second_tier_terms = [
  "aqueous",
  "cat-and-dogweather",
  "clammy",
  "cloudburst",
  "clouds",
  "condensation",
  "dank",
  "deluge",
  "dew",
  "dewy",
  "drizzle",
  "drenched",
  "drencher",
  "dripping",
  "drizzling",
  "flood",
  "flurry",
  "foggy",
  "gloomy",
  "hail",
  "heavydew",
  "humid",
  "liquidsunshine",
  "mist",
  "moistened",
  "misty",
  "muggy",
  "pour",
  "pouring",
  "precip",
  "saturate",
  "saturated",
  "sheets",
  "shower",
  "showers",
  "showery",
  "sleet",
  "slimy",
  "slippery",
  "slushy",
  "soaking",
  "sopping",
  "soppy",
  "soused",
  "spate",
  "spit",
  "sprinkle",
  "stream",
  "soaked",
  "sodden",
  "soggy",
  "teeming",
  "teary",
  "torrent",
  "torrential",
  "volley",
  "water-logged",
  "watery",
  "wet",
  "wetstuff",
  "wringing-wet",
  // non alphabetical below
  "blizzard",
  "cyclone",
  "downpour",
  "snowstorm",
  "squall",
  "tempest",
  "weather",
  "weatherchannel",
  "wunderground",
  "wx",
  "wxweather"

];
var third_tier_terms = [
  "aqueous",
  "cat-and-dogweather",
  "clammy",
  "cloudburst",
  "clouds",
  "condensation",
  "dank",
  "deluge",
  "dew",
  "dewy",
  "drizzle",
  "drenched",
  "drencher",
  "dripping",
  "drizzling",
  "flood",
  "flurry",
  "foggy",
  "hail",
  "heavydew",
  "humid",
  "liquidsunshine",
  "mist",
  "moistened",
  "misty",
  "muggy",
  "pour",
  "pouring",
  "precip",
  "saturate",
  "saturated",
  "sheets",
  "shower",
  "showers",
  "showery",
  "sleet",
  "slimy",
  "slippery",
  "slushy",
  "soaking",
  "sopping",
  "soppy",
  "soused",
  "spate",
  "spit",
  "sprinkle",
  "stream",
  "soaked",
  "sodden",
  "soggy",
  "teeming",
  "teary",
  "torrent",
  "torrential",
  "volley",
  "water-logged",
  "watery",
  "wet",
  "wetstuff",
  "wringing-wet",
  // non alphabetical below
  "blizzard",
  "cyclone",
  "downpour",
  "snowstorm",
  "squall",
  "tempest"
];

exports.first_tier = first_tier_terms;
exports.second_tier = second_tier_terms;
exports.third_tier = third_tier_terms;


function createKeywordTier(word_array) {
  var wordHash = {};
  for(var word in word_array) {
    wordHash[word_array[word]] = true;
  }
  for(var word in word_array) {
    wordHash["#"+word_array[word]] = true;
  }
  return wordHash;
}
function createHashtagArray(word_array) {
  var wordArray = [];
  for(var i in word_array) {
    wordArray.push('#'+word_array[i]);
  }
  return wordArray;
}
var test_array = createHashtagArray(first_tier_terms);
var first_tier = createKeywordTier(first_tier_terms);
var second_tier = createKeywordTier(second_tier_terms);

// returns matching instances of words from object/map of terms
function wordMatchCount(tweet, target_tier) {
  //put # here and get rid of createKeywordTier ?
  var normalized_text = tweet.text.toLowerCase().replace(/[\.,-\/!$#%\^&\*;:{}=\-_`~()]/g,"");
  var words = normalized_text.split(' ');
  var count = 0; 

  for(var i=0; i < words.length; i++) {
    if(target_tier[words[i]]) {
      //console.log(words[i]);
      count++;
    }
  }
  return count;
}

// rank the tweet based on hastags and context
function rankTweet(tweet){
/*
  var rank = 0;
  var twit_text = tweet.text;
  var twit_hashtag_array = [];
  if(tweet.entities && tweet.entities.hashtags.length > 0) {
    twit_hashtag_array = tweet.entities.hashtags;
	//number of words in first tier
	//number of words in second tier
	//number of words in third tier
	//total number of words?
  }
  return rank;
*/
  var rank = 0;
  rank += wordMatchCount(tweet, first_tier);
  rank += wordMatchCount(tweet, second_tier);
  return rank;
}
exports.getTweetRank = rankTweet;

// processes the tweet, makes sure it meets our needs of text and lat/lon
function validateTweet(tweet) {
  // validate the tweet, must have tweet text and coordinates
  var valid_tweet = false;
  if(tweet.text && (tweet.coordinates || tweet.place)) {
    valid_tweet = true;
  }
  return valid_tweet;
}
exports.validateTweet = validateTweet;

/*
console.log(validateTweet(sample_tweet));
console.log(sample_tweet.text);
console.log(rankTweet(sample_tweet, first_tier));
*/
