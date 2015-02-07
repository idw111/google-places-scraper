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
			strokeWeight: 1,
			map: map,
			bounds: bounds
		});
		map.setCenter(bounds.getCenter());
	}

	function updateRegion() {
		currentPoint.lng += step;
		
		if (currentPoint.lat > dstPoint.lat()) {
			console.log('end of scrape');
			return false;
		}

		if (currentPoint.lng > dstPoint.lng()) {
			currentPoint.lng = srcPoint.lng();
			currentPoint.lat += step;
			console.log('new row', currentPoint);
		}

		return true;
	}

	function search(bounds) {
		if (!service) return;
		service.textSearch({
			bounds: bounds,
			query: '칼국수'
		}, function(places, status) {
			console.log(status)

			if (status === 'OVER_QUERY_LIMIT') {
				console.log(currentPoint);
				return setTimeout(scrape, 10000);
			}

			if (!updateRegion()) return;

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
					setTimeout(scrape, 1000);
				});				
			}
			else {
				drawRect(bounds);
				setTimeout(scrape, 1000);
			}
		});
	}

	function initialize() {
		var options = {
			zoom: 11,
			center: srcPoint,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		map = new google.maps.Map($('#map-canvas').get(0), options);
		service = new google.maps.places.PlacesService(map);
	}

	// jeju (제주)
	// 33.193077, 126.161130
	// 33.567227, 126.945813
	// 
	// nation-wide (전국)
	// 34.320412, 126.070564
	// 36.088725, 129.583442
	// 
	// daejon (대전)
	// 36.273699, 127.284896 
	// 36.473973, 127.501533
	// 
	// near seoul (수도권)
	// 37.109077, 126.610610
	// 37.799148, 127.282150
	// 
	// daegu (대구)
	// 35.763910, 128.394464
	// 35.949785, 128.666376
	// 
	// busan (부산)
	// 35.044457, 128.960603
	// 35.234527, 129.133294
	// 
	// ulsan (울산)
	// 35.512126, 129.245346
	// 35.597317, 129.460953
	// 
	// gwanju (광주)
	// 35.071050, 126.736000
	// 35.256853, 126.974953
	// 
	// jeonju (전주)
	// 35.762969, 127.062500
	// 35.888234, 127.184723
	// 
	// suwon (수원)
	// 37.146927, 126.947831
	// 37.331694, 127.144211
	// 
	// kyungju (경주)
	// 35.803768, 129.174475
	// 35.908671, 129.262365
	// 
	// pohang (포항)
	// 35.935640, 129.305967
	// 36.120223, 129.487460
	// 
	// gangrung (강릉)
	// 37.679838, 128.852656
	// 37.800857, 128.998006
	// 
	// sokcho (속초)
	// 38.174168, 128.534262
	// 38.224622, 128.617003
	// 
	// wonju (원주)
	// 37.302581, 127.913125
	// 37.390739, 127.985567
	// 
	// chungju (충주)
	// 36.941507, 127.896646
	// 37.022412, 127.965997
	// 
	// cheongju (청주)
	// 36.583677, 127.417367
	// 36.685062, 127.536157
	// 
	// gongju (공주)
	// 36.434664, 127.088464
	// 36.538452, 127.166055
	// 
	// cheonan (천안)
	// 36.764314, 127.082284
	// 36.899512, 127.178415
	// 
	// asan (아산)
	// 36.766909, 126.957644
	// 36.806503, 127.044848
	// 
	// changwon (창원)
	// 35.176060, 128.550719
	// 35.277023, 128.712767
	// 
	// gimhae (김해)
	// 35.166237, 128.784522
	// 35.261606, 128.956870
	// 
	// jinju (진주)
	// 35.155010, 128.029898
	// 35.220667, 128.151434
	// 
	// suncheon (순천)
	// 34.923948, 127.473029
	// 34.995979, 127.611044
	// 
	// mokpo (목포)
	// 34.747570, 126.350985
	// 34.832438, 126.487284
	// 
	// namwon (남원)
	// 35.393001, 127.358294
	// 35.437769, 127.424555
	// 
	// gunsan (군산)
	// 35.912165, 126.660319
	// 36.023590, 126.751643
	// 
	// iksan (익산)
	// 35.920229, 126.920901
	// 35.978594, 127.033511
	// 
	// nonsan (논산)
	// 36.170341, 127.071276
	// 36.218550, 127.129298
	// 
	// chuncheon (춘천)
	// 37.838099, 127.711180
	// 37.898267, 127.767829
	// 
	// gumi (구미)
	// 36.057678, 128.325900
	// 36.135354, 128.422030
	// 
	// andong (안동)
	// 36.550165, 128.684329
	// 36.574983, 128.753680
	// 

	var currentPoint = {lat: 36.550165, lng: 128.684329}
	var srcPoint = new google.maps.LatLng(36.550165, 128.684329);
	var dstPoint = new google.maps.LatLng(36.574983, 128.753680);
	var step = 0.01;



	function scrape() {
		if (!map) return;

		var bounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(currentPoint.lat, currentPoint.lng),
			new google.maps.LatLng(currentPoint.lat + step, currentPoint.lng + step)
		);

		search(bounds);
	}

	initialize();
	
	scrape();

});
