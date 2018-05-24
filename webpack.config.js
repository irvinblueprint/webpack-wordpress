const path = require('path');
const config = require('./config.js');

// Including our UglifyJS
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// Our new plugin
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');


const extractSass = new ExtractTextPlugin({
    filename: "../css/[name].min.css",
});


const webpack = require('webpack');


module.exports = {
  entry: './js/main.js',
  plugins: [
  		new UglifyJSPlugin(),
  		extractSass,
      new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery'
      }),
      new BrowserSyncPlugin({
            proxy: config.url,
            files: [
              '**/*.php'
            ],
            reloadDelay: 0
      })
  ],
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'assets/js')
  },
  module : {

  	rules: [
  		{
  			test: /\.js$/,
  			exclude: /(node_modules|bower_components)/,
  			use: {
  				loader: 'babel-loader',
  				options: {
  					presets: ['babel-preset-env']
  				}
  			}
  		},
  		 {
  			test: /\.scss$/,
			  use: extractSass.extract({
			      use: [{
			          loader: "css-loader",
			          options: {
			            minimize: true
			          }
			      }, {
			          loader: "sass-loader"
			      }],
			      // use style-loader in development
			      fallback: "style-loader"
			  })
  		},
  		{
  			test: /\.css$/,
  			loader: 'style-loader',
  		},
  		{
  			test: /\.css$/,
  			loader: 'css-loader',
  			options: {
  				minimize: true
  			}
  		},
  		{
            test: /\.(png|eot|svg|ttf|woff|woff2)$/,
            exclude: /node_modules/,
            use: [{
                loader: 'url-loader',
                options: { 
                    limit: 10000, // Convert images < 8kb to base64 strings
                    name: 'img/[hash]-[name].[ext]'
                } 
            }]
      },
      {
            test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'fonts/'
                }
            }]
      }

  	]
  },
  devServer: {
        historyApiFallback: true,
        compress: true,
        port: 9000,
        https: config.url.indexOf('https') > -1 ? true : false,
        publicPath: config.fullPath,
        proxy: {
            '*': {
                'target': config.url,
                'secure': false
            },
            '/': {
                target: config.url,
                secure: false
            }
        },
  },
  resolve: {
		alias: {
	        'slick': 'slick-carousel/slick/slick.min',
	    }
  }

};