var webpack = require('webpack');

module.exports = {
	cache: true,
	entry: './public/javascripts/main.js',
	output: {
		path: './public/javascripts',
		filename: 'bundle.js'
	},
	devtool: 'source-map',
	module: {
		loaders: [
			{test: /\.jsx$/, loader: 'jsx-loader'}
		]
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	}
};
