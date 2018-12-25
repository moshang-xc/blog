let path = require("path"),
    fs = require("fs"),
    help = require("./lib/help"),
    CURPATH = process.cwd();

let scanObj = {
    scanFiles: [], //需要注入扫描代码的文件集合
    mainfile:"", //需要注入扫描代码的文件名
    navNode:"",//导航栏层唯一选择器
    btnNode:"",//导航内部点击可切换导航选择器
    otherTarget:[]//页面内容部分可点击导航选择器，尽量提供唯一的选择器
}


//重新确定根目录，默认根目录为运行当前命令的目录
function startScanNode() {
    //参数说明 在actiobtype为2时，参数结构哈哈
    
    if (process.argv.length > 3) {
    //自动化扫描节点，获取长度
        let params = process.argv.slice(4);
        params.forEach(function(par){
            if(par){
                par = par.split("=");
                
                switch(par[0]){
                    case "mainfile":{
                        scanObj["mainfile"] = par[1];
                    }break;
                    case "navNode":{
                        scanObj["navNode"] = par[1];
                    }break;
                    case "btnNode":{
                        scanObj["btnNode"] = par[1];
                    }break;
                    case "otherTarget":{
                        scanObj["otherTarget"] = par[1];
                    }break;
                }
            }
        });
    }

    if(scanObj.mainfile == "" || scanObj.btnNode == "" || scanObj.navNode == ""){
        console.log("参数不全，无法开启节点扫描。");
        return false;
    }

    let paths = fileHandle(CURPATH);
    require('./http.js').start(paths);
}

function fileHandle(rootPath){
    //拷贝lib/scanpage文件到rootPath目录下面
    let scriptRoot = path.resolve(__filename, "../");
    let src = path.join(scriptRoot, "lib", "scanpage.js"),
        dest = rootPath;
    help.copyFile(src, dest, scanObj);

    //遍历rootpath目录下面的所有文件
    return help.scanSingleFile(rootPath, scanObj.mainfile);
}

exports.startScanNode = startScanNode;