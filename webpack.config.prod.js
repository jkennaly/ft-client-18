import path from "path"
import HtmlWebpackPlugin from "html-webpack-plugin"
import { CleanWebpackPlugin } from "clean-webpack-plugin"
import TerserPlugin from "terser-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import webpack from "webpack"
import WorkboxPlugin from "workbox-webpack-plugin"
import CopyPlugin from "copy-webpack-plugin"
import { InjectManifest } from "workbox-webpack-plugin"
import payOptionsDev from "./src/services/payOptions/pay-variables-test.json" assert {type: 'json'}
import payOptionsProd from "./src/services/payOptions/pay-variables-live.json" assert {type: 'json'}
import authLocal from "./src/services/authLocal-variables.local.json" assert {type: 'json'}
import authRemote from "./src/services/authLocal-variables.remote.json" assert {type: 'json'}

const mode = "production"

const f = config => {
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
			path: path.resolve("./dist"),
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
					},
					resolve: {
						fullySpecified: false,
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
export default f