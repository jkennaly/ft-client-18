const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require("webpack");

const mode = 'production'

const authDev = require('./src/services/auth0-variables.dev.json');
const authProd = require('./src/services/auth0-variables.prod.json');


function composeConfig(env) { /* Helper function to dynamically set runtime config */
  if (env === 'development') {
    return authDev;
  }

  if (env === 'production') {
    return authProd;
  }
}


module.exports = {
	mode: mode,
	entry: './src/index.jsx',
	devtool: "source-map",
	node: {
	    Buffer: false,
	    process: false
	},
	optimization: {
    	minimizer: [
		    new TerserPlugin({
		    	parallel: true,
			    terserOptions: {
			      ecma: 6,
			    },
		  	}),
	      	new OptimizeCSSAssetsPlugin({})
    	]
  	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: "./index.html",
			filename: "index.html",
			inject: false
		}),
		new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
		new webpack.ProvidePlugin({
	        //$: "jquery",
	        //jQuery: "jquery",
	        //_: "lodash",
	        cloudy: "cloudinary-core"
    	}),
    	new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    	new webpack.DefinePlugin({
			AUTH0_CONFIG: JSON.stringify(composeConfig(mode))
		})
	],
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'bundle.js',
	},
	module: {
		rules: [
		{
			test: /\.jsx$/,
			exclude: /(node_modules)/,
			use: {
				loader: 'babel-loader',
		        options: {
			      'plugins': ['lodash'],
			      'presets': [['@babel/env', { 'targets': { 'node': 6 } }]]
			    }
			}
		}, {
			test: /\.js$/,
			exclude: /(node_modules)/,
			use: {
				loader: 'babel-loader',
		        options: {
		      'plugins': ['lodash'],
		      'presets': [['@babel/env', { 'targets': { 'node': 6 } }]]
		    }
			}
		}, {
			test: /\.css$/,
			use: [MiniCssExtractPlugin.loader,
          'css-loader']
		},
        {
            test: /\.(png|jp(e*)g|svg)$/,  
			exclude: [/(node_modules)\//, /fav\//],
            use: [{
                loader: 'url-loader',
                options: { 
                    limit: 8000, // Convert images < 8kb to base64 strings
                    name: 'img/[name].[ext]'
                } 
            }]
		}, 
        {
            test: /fav\/(.*)\.(png|ico|xml)$/,  
			exclude: /(node_modules)\//,
            use: [{
                loader: 'url-loader',
                options: { 
                    limit: 16000, // Convert images < 8kb to base64 strings
                    name: 'fav/[name].[ext]'
                } 
            }]
		}
]
	}
};