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
		
		service.textSearch({
			bounds: new google.maps.LatLngBounds(new google.maps.LatLng(36.3576789,127.3794686), new google.maps.LatLng(36.3578789,127.3796686)),
			query: '칼국수'
		}, function(results, status) {
			console.log(results);
			console.log(status);
		});
	}

	initialize();

	// google.maps.event.addDomListener(window, 'load', initialize);

});
