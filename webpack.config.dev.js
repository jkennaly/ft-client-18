const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require("webpack");

const mode = 'development'
const auth0Dev = require('./src/services/auth0-variables.dev.json')
const auth0Prod = require('./src/services/auth0-variables.prod.json')
const authLocalDev = require('./src/services/authLocal-variables.dev.json')
const authLocalProd = require('./src/services/authLocal-variables.prod.json')

const params = process.argv.slice(2)
const authSource = params.includes('local') ? 'local' : 'auth0'

const env = {
	mode: mode,
	authSource: authSource
}


function composeConfig(env) { /* Helper function to dynamically set runtime config */
  if (env.mode === 'development') {
    return env.authSource === 'auth0' ? auth0Dev : authLocalDev
  }

  if (env.mode === 'production') {
    return env.authSource === 'auth0' ? auth0Prod : authLocalProd
  }
}


module.exports = config => {
const env = {
	mode: mode,
	authSource: config && config.auth === 'local' ? 'local' : 'auth0'
}
 return {
	mode: env.mode,
	entry: './src/index.jsx',
	devtool: "inline-source-map",
	devServer: {
		contentBase: "./dist"
	},
	node: {
	    Buffer: false,
	    process: false
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: "./index.html",
			filename: "index.html",
			inject: false
		}),
		new webpack.ProvidePlugin({
	        //$: "jquery",
	        //jQuery: "jquery",
	        //_: "lodash",
	        cloudy: "cloudinary-core"
    	}),
    	new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
      new OptimizeCSSAssetsPlugin({}),
    	new webpack.DefinePlugin({
			ENV: env.mode
		}),
    	new webpack.DefinePlugin({
			AUTH_CONFIG: JSON.stringify(composeConfig(env))
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
}}