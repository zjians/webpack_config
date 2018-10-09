var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
module.exports = {
    entry: './index.js',
    output: {
        path: __dirname + '/dist/',
        filename: 'bundle.js'
    },
    optimization: {
        minimizer: [
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: path.resolve(__dirname, "./node_modules"),
                include: path.resolve(__dirname, "index.js"),
                options: {
                    presets: ['es2015'],
                    plugins: ['transform-decorators-legacy']
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: '1000',
                    name: 'static/[name]_[hash:6].[ext]?[hash:6]'
                }
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // minimize: true
                        }
                    },
                    "css-loader"
                ]
            }
        ]
    },
    plugins: [
        new HtmlwebpackPlugin({
            filename: "index.html",
            template: path.resolve(__dirname, "index.html"),
            hash: true,
            inject: true,
            minify: {
                caseSensitive: true,
                collapseWhitespace: true
            }
        }),
        new OpenBrowserPlugin({
            url: 'http://localhost:8080'
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[chunkhash:8].css",
            chunkFilename: "[id].css"
        })
    ]
}