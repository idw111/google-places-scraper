var webpack = require('webpack');

module.exports = {
	cache: true,
	entry: './client/main.js',
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
