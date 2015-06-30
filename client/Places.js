var $ = require('jquery');

var Places = {

	map: null,

	service: null,

	poi: {},

	init: function(selector) {
		var options = {
			zoom: 11,
			center: new google.maps.LatLng(36.550165, 128.684329),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		Places.map = new google.maps.Map($(selector).get(0), options);
		Places.service = new google.maps.places.PlacesService(Places.map);
	},

	flatten: function(place) {
		return {
			address: place.formatted_address,
			location: [place.geometry.location.lat(), place.geometry.location.lng()],
			name: place.name,
			place_id: place.place_id,
			reference: place.reference
		};
	},

	searchBounds: function(keyword, bounds, done) {
		if (!Places.service) return done({message: 'Google Places Service 객체가 없습니다'});
		Places.service.textSearch({bounds: bounds, query: keyword}, function(places, status) {
			if (status === 'OVER_QUERY_LIMIT') return done({code: 1, message: '쿼리 한계를 넘었습니다'});
			var results = [];
			for (var i in places) {
				var place = places[i];
				
				if (place.place_id in Places.poi) continue;
				Places.poi[place.place_id] = true;

				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()), 
					title: place.name
				});
				marker.setMap(Places.map);
				results.push(Places.flatten(place));
			}

			return done(null, results);
		});
	}

};

module.exports = Places;