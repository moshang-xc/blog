const path = require('path')
const webpack = require('webpack')
const root = path.resolve(__dirname, '..') // 项目的根目录绝对路径
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //分离css和js
const CopyWebpackPlugin = require('copy-webpack-plugin'); //将特定文件输出指定位置
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const mockjsPlugin = require('webpack-mockjs-plugin');

module.exports = {
    entry: {
        app: ['./app/main.js'],
		login: ['./app/login.js']
        
    }, // 入口文件路径
    output: {
        path: path.join(root, 'dist'), // 出口目录
        publicPath: process.env.NODE_ENV === 'publish' ? "/dist" : "/",
        filename: 'js/libs/[name].js?[chunkhash:5]', // 出口文件名
        chunkFilename: '[name].js?[chunkhash:5]'
    },
    resolve: {
        alias: { // 配置目录别名
            // 在任意目录下require('components/example') 相当于require('项目根目录/app/components/example')
            'vue': 'vue/dist/vue.js', //解决 [Vue warn]: You are using the runtime-only build of Vue
            '@': path.resolve('app'),
            'elementui': 'element-ui/packages'
        },
        extensions: ['.js', '.vue'], // 引用js和vue文件可以省略后缀名
 
    },

    module: { // 配置loader
        rules: [ 
			{ //npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
                test: /\.(scss|css)$/,
                use: [
                    "vue-style-loader",
                    //MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            // Provide path to the file with resources
                            resources: './app/css/vars.scss',
                        },
                    }
                ],
                exclude: /node_modules/
            },
			
            {
                test: /\.(png|jpe?g|gif)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 1000,
                    publicPath: "/img/",
                    outputPath: "/img/",
                    name: '[name].[ext]?[hash:7]'
                }
            },
            {
                test: /\.(eot|svg|ttf|woff)(\?\S*)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]?[hash:5]',
                        outputPath: '/fonts/',
                        publicPath: '/fonts/'

                    }
                }]

            },

            {
                test: /\.js$/, //匹配所有.js文件
                use: [{
                    loader: 'babel-loader'
                }],
                exclude: /node_modules/ //排除node_module下的所有文件
            },
            {
                test: /\.vue$/, //匹配所有.js文件

                loader: 'vue-loader',
                options: {
                    loaders: {
                        js: 'babel-loader',
                        css: 'style-loader',
						scss: 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    },
					extractCSS: true
                }

            }


        ]

    },

    optimization: { //webpack 4
        minimize: false,
        /*   runtimeChunk: {
        	name: "manifest"
        }, */
        splitChunks: { //提取公共库文件
            chunks: 'all',
            minSize: 10000,
            minChunks: 1,
            maxAsyncRequests: 8,
            maxInitialRequests: 5,
            name: "js/libs/app.libs",
            //automaticNameDelimiter: ".",
            cacheGroups: {
                //vue相关框架
                main: {
                    test: /[\\/]node_modules[\\/]vue[\\/]/,
                    name: './js/libs/vue.libs',
                    priority: 10,
                    chunks: 'all'
                },

                //业务中可复用的js
                vendors: {
                    test: /[\\/]app[\\/].+\.js$/,
                    name: './js/libs/vendors',
                    chunks: 'all'
                },
				   styles: {
                    test: /\.(scss|css)$/,
                    name: './css/styles',
                    chunks: 'all',
					priority: 20,
					enforce: true
                }
            }
        }
    },
    plugins: [
	
		new webpack.DefinePlugin({
			//设置代理服务器
			PROXY_HTTP_HOST: process.env.HTTP_PROXY ? '"http://192.168.99.123:3010/mock/11"' : '""'
		  
		}),

        new VueLoaderPlugin(),
		
		 /* new MiniCssExtractPlugin({
			filename: 'css/styles.css?[contenthash:5]',
			chunkFilename: 'css/[name].css?[contenthash:5]' // use contenthash *
		}), */
		//new ExtractTextPlugin("css/xxx.css"),

        //mock数据处理
        new mockjsPlugin({
			from: './app/assets/**/*.txt',
            output: '/[dirname]/[name]/index.html',
        }, {
            //config: './build/mockConfig.js',
            watch: true
        }),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true,
            chunks: ["./js/libs/vue.libs", './css/styles', "./js/libs/vendors", "js/libs/app.libs", "app"],

            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            //chunksSortMode: "dependency",
        }),

		new HtmlWebpackPlugin({
            filename: 'login.html',
            template: 'login.html',
            inject: true,
            chunks: ["./js/libs/vue.libs",  './css/styles',"./js/libs/vendors", "js/libs/app.libs", "login"],

            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
           // chunksSortMode: "dependency",
        }),
		
        /* 	 new HtmlWebpackPlugin({
              filename: 'login.html',
              template: 'login.html',
              inject: true,
        	  chunks: 'all',
        	  chunksSortMode: "dependency",


            }), */

        new CopyWebpackPlugin([ //reference from：https://www.npmjs.com/package/copy-webpack-plugin
            { from: './app/assets/fonts', to: './fonts/', flatten: true },
            //{ from: './node_modules/element-ui/lib/theme-chalk/fonts', to: './fonts/', flatten: true },
            //{ from: './app/assets/img', to: './img/' },
            { from: './app/assets/lang/', to: './lang/', toType: "dir" },
            //{ from: './app/assets/goform/*.txt', to: './goform/[name]', flatten: true },

        ])
    ]

}