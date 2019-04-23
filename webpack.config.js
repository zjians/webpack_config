var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const Webpack = require('webpack')
module.exports = function (env, arg) {
    if (arg.mode) {
        console.log('环境:', arg.mode)
    }
    if (env) {
        console.log('env:', env.NODE_ENV)
        // console.log('env:', arg.env)
    }
    return {
        entry: './index.js',
        output: {
            path: __dirname + '/dist/',
            filename: 'bundle.js'
        },
        optimization: {
            minimizer: [
                new OptimizeCSSAssetsPlugin({}),
                new UglifyJsPlugin()
            ]
        },
        devtool: "source-map", // 开启sourceMap,方便线上调试
        resolve: { // 模块路径解析相关的配置
            modules: [ // 依赖先从lib里找，找不到再到node_modules中找
                path.resolve('./lib'),
                'node_modules'
            ],
            alias: {
                // '@': resolve('src')
                // utils: path.resolve(__dirname, 'src/utils/') 这是模糊匹配 意味着只要模块路径中携带了 utils 就可以被替换掉，
                // 如：import 'utils/query.js' // 等同于 import '[项目绝对路径]/src/utils/query.js'
                // utils$: path.resolve(__dirname, 'src/utils') // 精确匹配 只会匹配 import 'utils'
            },
            extensions: ['.js', '.json'], // 在进行模块路径解析时，webpack 会尝试帮你补全那些后缀名来进行查找,
            //  比如 import * as common from './src/utils/common' 此处就可以省略.js的后缀。数组中的后缀是有顺序的，写在前面的会被优先匹配
        },
        module: {
            // { test: ... } 匹配特定条件(此处的条件可以是字符串，正则表达式，函数，数组，对象)
            // { include: ... } 匹配特定路径
            // { exclude: ... } 排除特定路径
            // { and: [...] }必须匹配数组中所有条件
            // { or: [...] } 匹配数组中任意一个条件
            // { not: [...] } 排除匹配数组中所有条件...
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
                    test: /\.(png|jpg|jpeg|gif)$/,
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
                },
                {
                    test: /\.less$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        "css-loader", "less-loader"]
                },
                {
                    test: /\.(htm|html)$/,
                    use: ['html-withimg-loader']
                }
            ],
            // noParse: /jquery | lodash/   // 用于配置哪些模块文件的内容不需要进行解析。对于一些不需要解析依赖（即无依赖） 的第三方大型类库等，可以通过这个字段来配置，以提高整体的构建速度。
        },
        devServer: { // webpack-dev-server相关的配置
            clientLogLevel: 'warning',
            port: 8080,
            publicPath: '/',
            proxy: {
                // '/api': {
                //         target: "http://localhost:3000", // 将 URL 中带有 /api 的请求代理到本地的 3000 端口的服务上
                //         pathRewrite: { '^/api': '' }, // 把 URL 中 path 部分的 `api` 移除掉...
                // }
            }
        },
        plugins: [
            new Webpack.DefinePlugin({ // definePlugin 在运行时给全局设置参数，变量
                'process.env': {
                    NODE_ENV: JSON.stringify(env && env.NODE_ENV),
                    MODE: JSON.stringify(arg && arg.mode)
                }
            }),
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
            new MiniCssExtractPlugin({ // 将css分离出来成为单独的文件
                filename: "[name].[chunkhash:8].css",
                chunkFilename: "[id].css"
            }),
            // 有些文件没经过 webpack 处理，但是我们希望它们也能出现在 build 目录下，这时就可以使用 CopyWebpackPlugin 来处理了。
            new CopyWebpackPlugin([
                // { from: './static/1.jpeg', to: 'test.jpeg' }, // 顾名思义，from 配置来源，to 配置目标路径
                { from: './static/icon/*.ico', to: '*.ico' }, // 配置项可以使用 glob
                // ...可以配置很多项复制规则
            ])
        ]
    }
}