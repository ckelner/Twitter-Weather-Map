exports.findById = function(req, res) {
	var id = req.params.id;
	console.log('Retrieving post: ' + id);
	db.collection('posts', function(err, collection) {
		collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
			res.send(item);
		});
	});
};

exports.findByPastMinutes = function(req, res) {
	var minutes = req.params.minutes;
        var end = new Date();
        var start = new Date();
        start.setMinutes(start.getMinutes() - minutes);
	db.collection('posts', function(err, collection) {
		collection.find({created_on: {$gte: start, $lt: end}}).toArray(function(err, items) {
			res.send(items);
		});
	});
};


exports.findRecent = function(req, res) {
        var end = new Date();
        var start = new Date();
        start.setMinutes(start.getMinutes() - 15);
	db.collection('posts', function(err, collection) {
		collection.find({status: {$gte: start, $lt: end}}).toArray(function(err, items) {
			res.send(items);
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
