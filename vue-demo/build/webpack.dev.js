const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base')
const root = path.resolve(__dirname, '..');
const fs = require('fs');

const Mock = require('mockjs');
Mock.Random.extend(require('./mockConfig.js'));
//Mock = Mock;
//baseConfig.entry["app"].push("./src/assets/goform/index.js");
module.exports = merge(baseConfig, {
    devServer: {
		//index: "falsy",
        contentBase: './dist',
        inline: true, // 文件改变自动刷新页面
		/* proxy: {
			context: () => true,
			target: "http://192.168.99.123:3010/mock/11"
		}, */
        //progress: true, // 显示编译进度
        /* setup: (app) => { //解决post没响应的问题

            //https://stackoverflow.com/questions/47442543/how-do-i-get-webpack-dev-server-to-accept-post-requests
            app.post('/goform/**', function(req, res) {
                res.redirect(req.originalUrl); //重定向到对应路径
            });

            app.get('/goform/**', function(req, res) {
                try {
                    let reqUrl = req.originalUrl.split("?")[0];
                    let fileStr, fileObj, data;

                    fileStr = fs.readFileSync(path.join("./src/assets", reqUrl + ".txt"), 'utf-8');

                    fileStr = fileStr.replace(/^\s+|\s+$/g, "");

                    fileObj = JSON.parse(fileStr);

                    data = Mock.mock(fileObj);
                    //setTimeout(function() {
                        res.send(data);
                   // }, 3000)

                } catch (e) {
                    res.send("404 No Found");
                }
            });

        }, */
        after: function() {
            console.log("########################  after")
        }
    },
    devtool: 'source-map' // 用于标记编译后的文件与编译前的文件对应位置，便于调试
})