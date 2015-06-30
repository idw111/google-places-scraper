var config = {
	
	host: 'localhost',
	port: 4000,

	mongo: {
		host: 'localhost',
		port: 27017,
		url: function() { 
			return config.mongo.host + ':' + config.mongo.port; 
		},
		database: 'places'
	}
	
};

module.exports = config;
