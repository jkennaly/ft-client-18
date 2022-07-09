const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const webpack = require("webpack")
const WorkboxPlugin = require("workbox-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const { InjectManifest } = require("workbox-webpack-plugin")

const payOptionsDev = require("./src/services/payOptions/pay-variables-test.json")
const payOptionsProd = require("./src/services/payOptions/pay-variables-live.json")
const authLocal = require("./src/services/authLocal-variables.local.json")
const authRemote = require("./src/services/authLocal-variables.remote.json")



const mode = "production"

module.exports = config => {
	const apiUrl = config.LOCAL_API ? "'http://localhost:8080'" : "'https://api.festigram.app'"
	const env = {
		mode: mode,
		authConfig: config.LOCAL_API ? authLocal : authRemote
	}
	return {
		mode,
		entry: "./src/index.jsx",
		devtool: "source-map",
		optimization: {
			minimizer: [
				new TerserPlugin({
					parallel: true,
					terserOptions: {
						ecma: 6
					}
				})
			]
		},
		devServer: {
			static: "./dist",
			port: 8181
		},
		plugins: [
			new InjectManifest({
				swSrc: "./src/www/src-sw.js",
				swDest: "service-worker.js",
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
				API_URL: apiUrl,
				BUILD_TIME: Date.now(),
				STRIPE_PUBLIC: JSON.stringify(
					env.mode === "development" ? payOptionsDev : payOptionsProd
				),
				AUTH_CONFIG: JSON.stringify(env.authConfig)
			}),
			new CopyPlugin({
				patterns: [
					{ from: "./src/fav/", to: "./fav/" },
					{ from: "./src/www/manifest.json", to: "." },
				]
			}),
			new MiniCssExtractPlugin()
			//new BundleAnalyzerPlugin()
		],
		output: {
			path: path.resolve(__dirname, "./dist"),
			filename: "bundle.js"
		},
		module: {
			rules: [
				{
					test: /\.jsx$/,
					exclude: /(node_modules)/,
					use: {
						loader: "babel-loader",
						options: {
							plugins: ["lodash"],
							presets: [["@babel/env", { "targets": { "browsers": "> 1%" } }]]
						}
					}
				},
				{
					test: /\.js$/,
					exclude: /(node_modules)/,
					use: {
						loader: "babel-loader",
						options: {
							plugins: ["lodash"],
							presets: [["@babel/env", { "targets": { "browsers": "> 1%" } }]]
						}
					}
				},
				{
					test: /\.css$/,
					use: [MiniCssExtractPlugin.loader, "css-loader"]
				},
				{
					test: /\.(png|jp(e*)g|svg)$/,
					exclude: [/(node_modules)\//, /fav\//],
					type: "asset/resource",
					generator: {
						filename: "img/[name][ext]"
					}
				},
				{
					test: /fav\/(.*)\.(png|ico|xml)$/,
					exclude: /(node_modules)\//,
					use: [
						{
							loader: "url-loader",
							options: {
								limit: 16000, // Convert images < 8kb to base64 strings
								name: "fav/[name].[ext]"
							}
						}
					]
				}
			]
		}
	}
}
