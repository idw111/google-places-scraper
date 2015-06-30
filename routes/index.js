var express = require('express');
var router = express.Router();
var Place = require('../model/Place');
var async = require('async');

router.get('/', function(req, res) {
	return res.render('index', { title: 'Express' });
});

router.post('/places', function(req, res) {
	var places = JSON.parse(req.param('places'));
	if (!places.length) return res.json({ok: true});

	var count = places.length;
	async.eachSeries(places, function(place, done) {
		var placeData = JSON.parse(place);
		placeData.location = JSON.parse(placeData.location);
		var place = new Place(placeData);
		place.save(function(err) {
			if (err) return done(err);
			return done(null);
		});
	}, function(err) {
		if (err) return res.json({ok: false, error: err});
		return res.json({ok: true});
	});

	// for (var i in places) {
	// 	var placeData = JSON.parse(places[i]);
	// 	placeData.location = JSON.parse(placeData.location);

	// 	var place = new Place(placeData);
	// 	place.save(function(err) {
	// 		count--;
	// 		if (count <= 0) return res.json({success: 1});
	// 	});
	// }
})

module.exports = router;


