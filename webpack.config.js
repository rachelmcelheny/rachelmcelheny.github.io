"use strict";

const webpack = require("webpack"),
	path = require("path"),
	HtmlWebpackPlugin = require("html-webpack-plugin"),
	ExtractTextPlugin = require("extract-text-webpack-plugin"),
	PurifyCssPlugin = require("purifycss-webpack-plugin");

let env = process.env.NODE_ENV || "development";

let config = {
	target: "web",
	entry: {
		app: [
			"./src/app.js"
		]
	},
	output: {
		filename: "[name].js",
		path: "./dist"
	},
	module: {
		loaders: []
	},
	sassLoader: {
		includePaths: [
			path.resolve(__dirname, "./src/styles")
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			__ENV__: `"${ env }"`
		}),
		new HtmlWebpackPlugin({
			template: "./src/index.html",
			inject: false
		})
	]
};

if (env === "development") {
	config.devtool = "eval";
	config.entry.app.push("webpack-dev-server/client?http://localhost:8000");

	config.module.loaders.push({
		test: /\.scss$/,
		loaders: [
			"style", "css", "autoprefixer", "sass"
		]
	});
	config.plugins.push(
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	);
} else {
	config.module.loaders.push({
		test: /\.scss$/,
		loader: ExtractTextPlugin.extract("style", ["css", "autoprefixer", "sass"])
	});
	config.plugins.push(
		new ExtractTextPlugin("[name].css"),
		new PurifyCssPlugin({
			basePath: __dirname,
			paths: [
				"src/index.html",
				"src/sections/*.html"
			],
			purifyOptions: {
				minify: true
			}
		})
	);
}

module.exports = config;
