var $ = require('jquery');

$(function() {

	var Places = {};
	var map = null;
	var service = null;

	function flatten(place) {
		var result = {};
		result.address = place.formatted_address;
		result.location = JSON.stringify([place.geometry.location.k, place.geometry.location.D]);
		result.name = place.name;
		result.place_id = place.place_id;
		result.reference = place.reference;
		return JSON.stringify(result);
	}

	function drawRect(bounds) {
		if (!map) return;
		var rect = new google.maps.Rectangle();
		rect.setOptions({
			strokeColor: '#ff0000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			map: map,
			bounds: bounds
		});
		map.setCenter(bounds.getCenter());
	}

	function search(bounds) {
		if (!service) return;
		service.textSearch({
			bounds: bounds,
			query: '칼국수'
		}, function(places, status) {
			console.log(status)
			var data = [];
			for (var i in places) {
				var place = places[i];
				
				if (place.place_id in Places) continue;
				Places[place.place_id] = true;

				var marker = new google.maps.Marker({
					position: new google.maps.LatLng(place.geometry.location.k, place.geometry.location.D), 
					title: place.name
				});
				marker.setMap(map);
				data.push(flatten(place));
			}

			if (data.length) {
	 			$.post('/places', {places: JSON.stringify(data)}, function(json) {
					drawRect(bounds);
					setTimeout(scrape, 200);
				});				
			}
			else {
				drawRect(bounds);
				setTimeout(scrape, 200);
			}
		});
	}

	function initialize() {
		var options = {
			zoom: 8,
			center: new google.maps.LatLng(36.3672509, 127.3765127),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map($('#map-canvas').get(0), options);
		service = new google.maps.places.PlacesService(map);
	}

	var currentPoint = {
		lat: 33.193077,
		lng: 126.161130
	};
	var srcPoint = new google.maps.LatLng(33.193077, 126.161130);
	var dstPoint = new google.maps.LatLng(33.567227, 126.945813);
	var step = 0.1;

	function scrape() {
		if (!map) return;

		var bounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(currentPoint.lat, currentPoint.lng),
			new google.maps.LatLng(currentPoint.lat + step, currentPoint.lng + step)
		);

		currentPoint.lng += step;

		if (currentPoint.lat > dstPoint.lat()) {
			console.log('end of scrape');
			return;
		}

		if (currentPoint.lng > dstPoint.lng()) {
			currentPoint.lng = srcPoint.lng();
			currentPoint.lat += step;
		}

		search(bounds);

		
	}

	initialize();
	scrape();

		
	// google.maps.event.addDomListener(window, 'load', initialize);

});
