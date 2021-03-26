const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const WorkboxPlugin = require('workbox-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin")
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const {InjectManifest} = require('workbox-webpack-plugin')
const mode = 'production'

const payOptionsDev = require('./src/services/payOptions/pay-variables-test.json')
const payOptionsProd = require('./src/services/payOptions/pay-variables-live.json')
const auth0Dev = require('./src/services/auth0-variables.dev.json');
const auth0Prod = require('./src/services/auth0-variables.prod.json');
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
	mode: mode,
	entry: './src/index.jsx',
	devtool: "source-map",
	optimization: {
    	minimizer: [
		    new TerserPlugin({
		    	parallel: true,
			    terserOptions: {
			      ecma: 6,
			    },
		  	})
    	]
  	},
	plugins: [
	new InjectManifest({
	      swSrc: './src/www/src-sw.js',
	      swDest: 'service-worker.js',
	      maximumFileSizeToCacheInBytes: 10 * 1024 * 1024
	      // Any other config if needed.
	    }),
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
	        //cloudy: "cloudinary-core"
    	}),
    	new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    	new webpack.DefinePlugin({
			AUTH_CONFIG: JSON.stringify(composeConfig(env))
		}),
    	new webpack.DefinePlugin({
			STRIPE_PUBLIC: JSON.stringify(env.mode === 'development' ? payOptionsDev : payOptionsProd)
		}),
		new CopyPlugin({
      patterns: [
        { from: "./src/fav/", to: "./fav/" },
        { from: "./src/www/manifest.json", to: "." },
        { from: "./src/www/robots.txt", to: "." },
      ],
    }),
		new MiniCssExtractPlugin(),
		new BundleAnalyzerPlugin()
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
			use: [MiniCssExtractPlugin.loader, 'css-loader']
		},
        {
            test: /\.(png|jp(e*)g|svg)$/,  
			exclude: [/(node_modules)\//, /fav\//],
            type: 'asset/resource',
            generator: {
            	filename: 'img/[name][ext]'
            }
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