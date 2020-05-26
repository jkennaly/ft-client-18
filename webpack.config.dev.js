const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require("webpack");

module.exports = {
	mode: "development",
	entry: './src/index.jsx',
	devtool: "inline-source-map",
	devServer: {
		contentBase: "./dist"
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
      new OptimizeCSSAssetsPlugin({})

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