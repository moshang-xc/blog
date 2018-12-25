var fs = require("fs");
var path = require("path");


function copyFile(src, dest, dataObj){
    if(fs.existsSync(src)){
        dest = path.join(dest, path.basename(src));
        let state = fs.statSync(src);
        if(state.isFile()){
            let jsMess = fs.readFileSync(src, "utf-8");
            jsMess = jsMess.replace(/\{\{(.*?)\}\}/g, function(item){
                item = item.replace(/^\{\{/,'').replace(/\}\}$/,'');
                return dataObj[item];
            });
            fs.writeFileSync(dest, jsMess);
        }
    }else{
        console.log(`目标文件'${src}'不存在.`);
    }
}

function updateFile(filepath, rootpath){
    let filePaths = [], l = 0;
    console.log("文件插入遍历代码");
    scanFolder(filepath, rootpath, filePaths);
    l = filePaths.length;
    console.log(`一共有(${l})个文件需要处理！`);
    for(let i = 0; i < l; i++){
        insertFile(filePaths[i], rootpath);
        console.log(`文件-${filePaths[i]}-处理成功！(${i+1}/${l})`);
    }
    return filePaths;
}


function scanSingleFile(filepath, filename){
    let files = fs.readdirSync(filepath), paths = [];
    files.forEach(function(file){
        let fullfile = path.join(filepath, file);
        if(fs.statSync(fullfile).isFile() && filename === file){
            resetFile(fullfile);
            paths.push(fullfile);
            insertFile(fullfile, filepath);
        }
    });
    return paths;
}

function scanFolder(filepath, rootPath, paths){
    let files = fs.readdirSync(filepath);
    files.forEach(function(file){
        file = path.join(filepath, file);
        if(fs.statSync(file).isDirectory()){
            scanFolder(file, rootPath, paths);
        }else if(/(\.html)|(\.htm)|(\.asp)|(\.aspx)/.test(path.extname(file))){
            //插入文件引用
            // insertFile(file, rootPath);
            paths.push(file);
        }
    });
}

function insertFile(file, rootPath){
    if(fs.existsSync(file)){
        let fileMess = fs.readFileSync(file, "utf-8"),
            relativePath = path.relative(file, path.join(rootPath, "scanpage.js?v=" + Math.random()));
        let script = '<!-- insert --><script src="' + relativePath + '"></script><!-- insert -->'
        fileMess = fileMess.replace(/<\/body>/g,function(a){return script + a;});
        fs.writeFileSync(file, fileMess);
    }
}

//将插入的文本全部去除
function resetFiles(filepath){
    if(typeof filepath === "object"){
        filepath.forEach(function(file){
            if(fs.existsSync(file)){
                resetFile(file);
            }
        });
    }else{
        resetFile(filepath);
    }
}

function resetFile(filepath){
    if(fs.existsSync(filepath)){
        let fileMess = fs.readFileSync(filepath, "utf-8");
        fileMess = fileMess.replace(/(<!-- insert -->)((.|\\s)*?)(<!-- insert -->)/g, "");
        fs.writeFileSync(filepath, fileMess);
    }
}

//对象合并
function combineObj(oldObj, newObj){
    for(let key in newObj){
        if(newObj.hasOwnProperty(key)){
            let v = oldObj[key], 
                value = newObj[key];
            oldObj[key] = v ? ( v > value ? value : v) : value;
        }
    }
}

exports.copyFile = copyFile;
exports.updateFile = updateFile;
exports.resetFiles = resetFiles;
exports.combineObj = combineObj;
exports.scanSingleFile = scanSingleFile;