var express = require('express');
var router = express.Router();
var Place = require('../model/Place');

/* GET home page. */
router.get('/', function(req, res) {
	return res.render('index', { title: 'Express' });
});

router.post('/places', function(req, res) {
	var places = JSON.parse(req.param('places'));

	console.log(places.length);
	if (!places.length) return res.json({success: 1});

	var count = places.length;
	for (var i in places) {
		var placeData = JSON.parse(places[i]);
		placeData.location = JSON.parse(placeData.location);
		var place = new Place(placeData);
		place.save(function(err) {
			count--;
			if (count <= 0) return res.json({success: 1});
		});
	}
})

module.exports = router;


