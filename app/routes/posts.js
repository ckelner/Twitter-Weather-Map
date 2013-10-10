exports.findById = function(req, res) {
	var id = req.params.id;
	console.log('Retrieving post: ' + id);
	db.collection('posts', function(err, collection) {
		collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
			res.send(item);
		});
	});
};

exports.findAll = function(req, res) {
	db.collection('posts', function(err, collection) {
		collection.find().toArray(function(err, items) {
			res.send(items);
		});
	});
};

exports.addPost = function(req, res) {
	var post = req.body;
	console.log("Post Body: ");
	console.log(post);
	db.collection('posts', function(err, collection) {
		collection.insert(post, {safe:true}, function(err, result) {
			if(err) {
				res.send({'error':'An error during posting has occured'});
			} else { 
				console.log('Success: ' + JSON.stringify(result[0]));
				res.send(result[0]);
			}
		});
	});
}

exports.updatePost = function(req, res) {
	var id = req.params.id;
	var post = req.body;
	conosle.log('Updating post: ' + id);
	console.log(JSON.stringify(post));
	db.collection('posts', function(err, collection) {
		collection.update({'_id':new BSON.ObjectID(id)}, post, {safe:true}, function(err, result) {
			if (err) {
				console.log('Error updating weather post: ' + err);
				res.send({'error':'An error has occured'});
			} else { 
				console.log('' + result + ' post(s) updated');
				res.send(post);
			}
		});
	});
}

exports.deletePost = function(req, res) {
	var id = req.params.id;
	console.log('Deleting post: ' + id);
	db.collection('posts', function(err, collection) {
		collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
			if (err) {
				res.send({'error':'An error during deletion has occurred - ' + err});
			} else { 
				console.log('' + result + ' post(s) deleted');
				res.send(req.body);
			}
		});
	});
}

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

  console.log("########### Generating fake posts ##########");
  console.log(posts);

  db.collection('posts', function(err, collection) {
    collection.insert(posts, {safe:true}, function(err, result) {});
  });
};
