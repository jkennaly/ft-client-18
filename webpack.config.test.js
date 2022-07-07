const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
//const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const webpack = require("webpack")
const { InjectManifest } = require("workbox-webpack-plugin")

const payOptionsDev = require("./src/services/payOptions/pay-variables-test.json")
const payOptionsProd = require("./src/services/payOptions/pay-variables-live.json")
const authLocal = require("./src/services/authLocal-variables.local.json")
const authRemote = require("./src/services/authLocal-variables.remote.json")

const mode = "development"

module.exports = (config) => {

}
