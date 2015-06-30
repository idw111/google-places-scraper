var $ = require('jquery');
var Regions = require('./Regions');
var Places = require('./Places');
var async = require('async');
var Cookie = require('js-cookie');

var Scraper = {

	step: 0.04,

	region: null,
	
	srcPoint: null,

	dstPoint: null,

	currentPoint: null,

	init: function(selector) {
		Places.init(selector);
		if (Cookie.get('restore') === 'yes') {
			var srcPoint = JSON.parse(Cookie.get('srcPoint'));
			var dstPoint = JSON.parse(Cookie.get('dstPoint'));
			Scraper.region = JSON.parse(Cookie.get('region'));
			Scraper.srcPoint = new google.maps.LatLng(srcPoint.lat, srcPoint.lng);
			Scraper.dstPoint = new google.maps.LatLng(dstPoint.lat, dstPoint.lng);
			Scraper.currentPoint = JSON.parse(Cookie.get('currentPoint'));
			Cookie.remove('restore');
		}
	},

	drawRect: function(bounds) {
		var rect = new google.maps.Rectangle();
		rect.setOptions({
			strokeColor: '#ff0000',
			strokeOpacity: 0.5,
			strokeWeight: 0.5,
			map: Places.map,
			bounds: bounds
		});
		Places.map.setCenter(bounds.getCenter());
	},

	updateRegion: function() {
		if (!Scraper.region) {
			Scraper.region = Regions.data[0];
			return true;
		}

		for (var i in Regions.data) {
			i = parseInt(i, 10);
			if (Regions.data[i].alias === Scraper.region.alias) {
				if (i < Regions.data.length - 1) {
					Scraper.region = Regions.data[i + 1];
					return true;
				}
				else {
					return false;
				}
			}
		}

		return false;
	},

	updateBounds: function() {
		if (!Scraper.region) {
			if (!Scraper.updateRegion()) return false;
		}
		if (!Scraper.currentPoint) {
			Scraper.srcPoint = new google.maps.LatLng(Scraper.region.bounds[0][0], Scraper.region.bounds[0][1]);
			Scraper.dstPoint = new google.maps.LatLng(Scraper.region.bounds[1][0], Scraper.region.bounds[1][1]);
			Scraper.currentPoint = {lat: Scraper.region.bounds[0][0], lng: Scraper.region.bounds[0][1]};
			return true;
		}

		Scraper.currentPoint.lng += Scraper.step;
		if (Scraper.currentPoint.lat > Scraper.dstPoint.lat()) {
			if (!Scraper.updateRegion()) return false;
			Scraper.currentPoint = null;
			return Scraper.updateBounds();
		}

		if (Scraper.currentPoint.lng > Scraper.dstPoint.lng()) {
			Scraper.currentPoint.lng = Scraper.srcPoint.lng();
			Scraper.currentPoint.lat += Scraper.step;
		}

		return true;
	},

	scrape: function(keyword) {
		if (!Scraper.updateBounds()) return;

		var bounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(Scraper.currentPoint.lat, Scraper.currentPoint.lng),
			new google.maps.LatLng(Scraper.currentPoint.lat + Scraper.step, Scraper.currentPoint.lng + Scraper.step)
		);

		async.waterfall([
			function(done) {
				Places.searchBounds(keyword, bounds, function(err, results) {
					if (err) return done(err);
					return done(null, results);
				});
			},
			function(results, done) {
				if (!results.length) return done(null);
				for (var i in results) {
					results[i].location = JSON.stringify(results[i].location);
					results[i] = JSON.stringify(results[i]);
				}
				$.post('/places', {places: JSON.stringify(results)}, function(result) {
					if (!result.ok) return done({message: 'ajax error'});
					return done(null);
				});
			}
		], function(err) {
			if (err) {
				if (err.code === 1) {
					Cookie.set('region', JSON.stringify(Scraper.region));
					Cookie.set('srcPoint', JSON.stringify({lat: Scraper.srcPoint.lat(), lng: Scraper.srcPoint.lng()}));
					Cookie.set('dstPoint', JSON.stringify({lat: Scraper.dstPoint.lat(), lng: Scraper.dstPoint.lng()}));
					Cookie.set('currentPoint', JSON.stringify(Scraper.currentPoint));
					Cookie.set('restore', 'yes');
					return window.location.reload();
				}
				console.log(err);
			}
			Scraper.drawRect(bounds);
			setTimeout(function() {
				Scraper.scrape(keyword);
			}, 200);
		});
	}

};

module.exports = Scraper;