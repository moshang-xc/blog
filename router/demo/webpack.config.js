/*eslint-disable*/
const webpack = require('webpack');
const es3ifyPlugin = require('es3ify-webpack-plugin');//解决IE8保留字冲突问题
const HtmlWebpackPlugin = require('html-webpack-plugin');//自动生成html
const CopyWebpackPlugin = require('copy-webpack-plugin');	//将特定文件输出指定位置
//使用ExtractTextPlugin时，css文件中的注释需要使用/**/，使用//会报错
const ExtractTextPlugin = require('extract-text-webpack-plugin');//分离css和js

module.exports = {
	devtool: "source-map",
	devServer: {
		contentBase: './dist',
		inline: true,
		open: true,	
		port: 8060,
        proxy: {//代理
            '/goform/*': {
              target: 'http://localhost:8088',
              changeOrigin: true
            }
		}
	},
	entry: {
		"main": ["babel-polyfill", "./src/index.js"]
	},
	output: {
		path: __dirname + '/dist',
		filename: '[name]/[name].js',
        // publicPath: '/dist',
        chunkFilename: 'controlers/[name].min.js' 
	},
	module: {
		rules: [
			{
				test: /\.(html)$/,
				use: {
					loader: 'html-loader'
				}
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 1024
						}
					}
				]
			},
            {
                test: /\.js$/,//匹配所有.js文件
                use: [
                	{
                		loader: 'babel-loader'
                	}
                ],
                exclude: /node_modules/	//排除node_module下的所有文件
            },
            {
				test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader?sourceMap', 'postcss-loader'],
                    fallback: "style-loader"
                })
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader?sourceMap', 'sass-loader?sourceMap', 'postcss-loader'],
                    fallback: "style-loader"
                })
            }
        ]
	},
	externals: {
		"jquery": "jQuery"
	},
	plugins: [
		new HtmlWebpackPlugin({ 
			template:__dirname + '/src/index.ejs',
			filename:"./index.html",//编译后的入口文件名字
			chunks: ['main'],//入口文件所需要用到的js
			chunksSortMode: "manual",
			inject: 'body',
			navList: require("./navcfg.js")
		}),
		new es3ifyPlugin(),
		new ExtractTextPlugin({
			filename: 'css/[name].[contenthash].css'
		}),
    	new CopyWebpackPlugin([//reference from：https://www.npmjs.com/package/copy-webpack-plugin
				{from: './src/common/js/jquery.js', to: './common'},
                {from: './src/common/img', to: './common/img'},
                {from: './src/modules/**/*.html', to: './pages', flatten: true}
    		])
	]
}