import path from "path"
import HtmlWebpackPlugin from "html-webpack-plugin"
import { CleanWebpackPlugin } from "clean-webpack-plugin"
import TerserPlugin from "terser-webpack-plugin"
import CopyPlugin from "copy-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import webpack from "webpack"
import { InjectManifest } from "workbox-webpack-plugin"
import fs from "fs"



const payOptionsDev = JSON.parse(fs.readFileSync("./src/services/payOptions/pay-variables-test.json", 'utf8'))
const payOptionsProd = JSON.parse(fs.readFileSync("./src/services/payOptions/pay-variables-live.json", 'utf8'))
const authLocal = JSON.parse(fs.readFileSync("./src/services/authLocal-variables.local.json", 'utf8'))
const authRemote = JSON.parse(fs.readFileSync("./src/services/authLocal-variables.remote.json", 'utf8'))

const mode = "development"

const f = (config) => {
	const apiUrl = config.LOCAL_API ? "'http://localhost:8080'" : "'https://api.festigram.app'"
	const env = {
		mode,
		authConfig: config.LOCAL_API ? authLocal : authRemote
	}
	return {
		mode,
		entry: "./src/index.jsx",
		devtool: "inline-source-map",
		devServer: {
			port: 8181
		},
		plugins: [
			/*
			goes a little insane when run with devServer
			new InjectManifest({
				swSrc: "./src/www/src-sw.js",
				swDest: "service-worker.js",
				maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
				// Any other config if needed.
			}),
			*/
			new CleanWebpackPlugin(),
			new HtmlWebpackPlugin({
				template: "./index.html",
				filename: "index.html",
				inject: false,
			}),
			new webpack.ProvidePlugin({
				//$: "jquery",
				//jQuery: "jquery",
				//_: "lodash",
				//cloudy: "cloudinary-core",
			}),
			new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
			//new OptimizeCSSAssetsPlugin({}),
			new webpack.DefinePlugin({
				STRIPE_PUBLIC: JSON.stringify(
					env.mode === "development" ? payOptionsDev : payOptionsProd
				),
				BUILD_TIME: Date.now(),
				API_URL: apiUrl,
				AUTH_CONFIG: JSON.stringify(env.authConfig)
			}),
			new CopyPlugin({
				patterns: [
					{ from: "./src/fav/", to: "./fav/" },
					{ from: "./src/www/manifest.json", to: "." },
				],
			}),
			new MiniCssExtractPlugin(),
			//new BundleAnalyzerPlugin(),
		],
		output: {
			path: path.resolve("./dist"),
			filename: "bundle.js",
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
							presets: [["@babel/env", { "targets": { "browsers": "> 1%" } }]],
						},
					},
				},
				{
					test: /\.js$/,
					exclude: /(node_modules)/,
					use: {
						loader: "babel-loader",
						options: {
							plugins: ["lodash"],
							presets: [["@babel/env", { "targets": { "browsers": "> 1%" } }]],
						},
					},
					resolve: {
						fullySpecified: false,
					}
				},
				{
					test: /\.css$/,
					use: [MiniCssExtractPlugin.loader, "css-loader"],
				},
				{
					test: /\.(png|jp(e*)g|svg)$/,
					exclude: [/(node_modules)\//, /fav\//],
					type: "asset/resource",
					generator: {
						filename: "img/[name][ext]",
					},
				},
			],
		},
	}
}
export default f