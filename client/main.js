var $ = require('jquery');
var Scraper = require('./Scraper');

$(function() {

	Scraper.init('#map-canvas');
	Scraper.scrape('소아과');

});
