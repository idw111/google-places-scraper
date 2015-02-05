var $ = require('jquery');

$(function() {

	function initialize() {
		var options = {
			zoom: 15,
			center: new google.maps.LatLng(36.3572509, 127.3665127),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map($('#map-canvas').get(0), options);
		var service = new google.maps.places.PlacesService(map);
		
		var bounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(36.3572509, 127.3665127),
			new google.maps.LatLng(36.3772509, 127.3865127)
		);

		var rect = new google.maps.Rectangle({
			map: map,
			bounds: bounds,
			strokeColor: "#ff0000",
			strokeOpacity: 0.8,
			strokeWeight: 2
		});

		service.textSearch({
			bounds: bounds,
			query: '칼국수'
		}, function(places, status) {
			for (var i in places) {
				var place = places[i];
				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(place.geometry.location.k, place.geometry.location.D),
					title: place.name
				});
				marker.setMap(map);
			}
		});
	}

	initialize();

	// google.maps.event.addDomListener(window, 'load', initialize);

});
