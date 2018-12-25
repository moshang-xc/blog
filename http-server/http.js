//调用 node index.js 8082
var http = require("http"),
    url = require('url'),
    path = require('path'),
    child_process = require('child_process'),
    fs = require('fs'),
    help = require('./lib/help'),
    json2excel = require('./lib/JSON2EXCEL'),
    DefaultFile = [
        'index.html',
        'index.htm',
        'index.json',
        'index.txt',
        'index.wjs',
        'index.asp'
    ],
    ROOT_PATH = null,
    PORT = process.argv[2] || 80,
    CURPATH = process.cwd(),
    // util = require('util'),
    querystring = require('querystring'),
    watch = require('./lib/watch'),
    //livereload = require('./lib/livereload'), 数据文件存放目录
    dataFolderArr = ["goform"],
    hasLoadData = false;

var fileObj = {}; //存储数据对象
var interfaceObj = {}; //参数与接口映射关系   属性与[url]对应关系
var mibFile;

const APITYPE = {
    MODULE: 1, //数据接口模块化
    OTHER: 2 //数据接口非模块化
},
    ACTINOTYPE = {
        STARTSERVER: 1,//开启服务，默认值
        SCANNODE: 2 //扫描节点
    };
var actionType = ACTINOTYPE.STARTSERVER,//服务器开启类型 
    fieldMess = {}, //扫描后的字段临时存储
    scanFiles = []; //需要注入扫描代码的文件集合
        

let dataFileType = APITYPE.MODULE,//数据请求格式
    relativePath = "";

let jsonLangObj = {};

var isWin = process.env.OS.toLowerCase().indexOf('windows') > -1 ? true : false;

var mime = {
    lookupExtension: function (ext, fallback) {
        return mime.TYPES[ext.toLowerCase()] || fallback || 'text/plain';
    },

    TYPES: {
        '.3gp': 'video/3gpp',
        '.a': 'application/octet-stream',
        '.ai': 'application/postscript',
        '.aif': 'audio/x-aiff',
        '.aiff': 'audio/x-aiff',
        '.asc': 'application/pgp-signature',
        '.asf': 'video/x-ms-asf',
        '.asm': 'text/x-asm',
        '.asp': 'text/html',
        '.php': 'text/html',
        '.asx': 'video/x-ms-asf',
        '.atom': 'application/atom+xml',
        '.au': 'audio/basic',
        '.avi': 'video/x-msvideo',
        '.bat': 'application/x-msdownload',
        '.bin': 'application/octet-stream',
        '.bmp': 'image/bmp',
        '.bz2': 'application/x-bzip2',
        '.c': 'text/x-c',
        '.cab': 'application/vnd.ms-cab-compressed',
        '.cc': 'text/x-c',
        '.chm': 'application/vnd.ms-htmlhelp',
        '.class': 'application/octet-stream',
        '.com': 'application/x-msdownload',
        '.conf': 'text/plain',
        '.cpp': 'text/x-c',
        '.crt': 'application/x-x509-ca-cert',
        '.css': 'text/css',
        '.csv': 'text/csv',
        '.cxx': 'text/x-c',
        '.deb': 'application/x-debian-package',
        '.der': 'application/x-x509-ca-cert',
        '.diff': 'text/x-diff',
        '.djv': 'image/vnd.djvu',
        '.djvu': 'image/vnd.djvu',
        '.dll': 'application/x-msdownload',
        '.dmg': 'application/octet-stream',
        '.doc': 'application/msword',
        '.dot': 'application/msword',
        '.dtd': 'application/xml-dtd',
        '.dvi': 'application/x-dvi',
        '.ear': 'application/java-archive',
        '.eml': 'message/rfc822',
        '.eps': 'application/postscript',
        '.exe': 'application/x-msdownload',
        '.f': 'text/x-fortran',
        '.f77': 'text/x-fortran',
        '.f90': 'text/x-fortran',
        '.flv': 'video/x-flv',
        '.for': 'text/x-fortran',
        '.gem': 'application/octet-stream',
        '.gemspec': 'text/x-script.ruby',
        '.gif': 'image/gif',
        '.gz': 'application/x-gzip',
        '.h': 'text/x-c',
        '.hh': 'text/x-c',
        '.htm': 'text/html',
        '.html': 'text/html',
        '.ico': 'image/vnd.microsoft.icon',
        '.ics': 'text/calendar',
        '.ifb': 'text/calendar',
        '.iso': 'application/octet-stream',
        '.jar': 'application/java-archive',
        '.java': 'text/x-java-source',
        '.jnlp': 'application/x-java-jnlp-file',
        '.jpeg': 'image/jpeg',
        '.jpg': 'image/jpeg',
        '.js': 'application/javascript;charset=utf-8',
        '.json': 'application/json',
        '.log': 'text/plain;charset=utf-8',
        '.m3u': 'audio/x-mpegurl',
        '.m4v': 'video/mp4',
        '.man': 'text/troff',
        '.mathml': 'application/mathml+xml',
        '.mbox': 'application/mbox',
        '.mdoc': 'text/troff',
        '.me': 'text/troff',
        '.mid': 'audio/midi',
        '.midi': 'audio/midi',
        '.mime': 'message/rfc822',
        '.mml': 'application/mathml+xml',
        '.mng': 'video/x-mng',
        '.mov': 'video/quicktime',
        '.mp3': 'audio/mpeg',
        '.mp4': 'video/mp4',
        '.mp4v': 'video/mp4',
        '.mpeg': 'video/mpeg',
        '.mpg': 'video/mpeg',
        '.ms': 'text/troff',
        '.msi': 'application/x-msdownload',
        '.odp': 'application/vnd.oasis.opendocument.presentation',
        '.ods': 'application/vnd.oasis.opendocument.spreadsheet',
        '.odt': 'application/vnd.oasis.opendocument.text',
        '.ogg': 'application/ogg',
        '.p': 'text/x-pascal',
        '.pas': 'text/x-pascal',
        '.pbm': 'image/x-portable-bitmap',
        '.pdf': 'application/pdf',
        '.pem': 'application/x-x509-ca-cert',
        '.pgm': 'image/x-portable-graymap',
        '.pgp': 'application/pgp-encrypted',
        '.pkg': 'application/octet-stream',
        '.pl': 'text/x-script.perl',
        '.pm': 'text/x-script.perl-module',
        '.png': 'image/png',
        '.pnm': 'image/x-portable-anymap',
        '.ppm': 'image/x-portable-pixmap',
        '.pps': 'application/vnd.ms-powerpoint',
        '.ppt': 'application/vnd.ms-powerpoint',
        '.ps': 'application/postscript',
        '.psd': 'image/vnd.adobe.photoshop',
        '.py': 'text/x-script.python',
        '.qt': 'video/quicktime',
        '.ra': 'audio/x-pn-realaudio',
        '.rake': 'text/x-script.ruby',
        '.ram': 'audio/x-pn-realaudio',
        '.rar': 'application/x-rar-compressed',
        '.rb': 'text/x-script.ruby',
        '.rdf': 'application/rdf+xml',
        '.roff': 'text/troff',
        '.rpm': 'application/x-redhat-package-manager',
        '.rss': 'application/rss+xml',
        '.rtf': 'application/rtf',
        '.ru': 'text/x-script.ruby',
        '.s': 'text/x-asm',
        '.sgm': 'text/sgml',
        '.sgml': 'text/sgml',
        '.sh': 'application/x-sh',
        '.sig': 'application/pgp-signature',
        '.snd': 'audio/basic',
        '.so': 'application/octet-stream',
        '.svg': 'image/svg+xml',
        '.svgz': 'image/svg+xml',
        '.swf': 'application/x-shockwave-flash',
        '.t': 'text/troff',
        '.tar': 'application/x-tar',
        '.tbz': 'application/x-bzip-compressed-tar',
        '.tcl': 'application/x-tcl',
        '.tex': 'application/x-tex',
        '.texi': 'application/x-texinfo',
        '.texinfo': 'application/x-texinfo',
        '.text': 'text/plain',
        '.tif': 'image/tiff',
        '.tiff': 'image/tiff',
        '.torrent': 'application/x-bittorrent',
        '.tr': 'text/troff',
        '.txt': 'text/plain',
        '.vcf': 'text/x-vcard',
        '.vcs': 'text/x-vcalendar',
        '.vrml': 'model/vrml',
        '.war': 'application/java-archive',
        '.wav': 'audio/x-wav',
        '.wma': 'audio/x-ms-wma',
        '.wmv': 'video/x-ms-wmv',
        '.wmx': 'video/x-ms-wmx',
        '.wrl': 'model/vrml',
        '.wsdl': 'application/wsdl+xml',
        '.xbm': 'image/x-xbitmap',
        '.xhtml': 'application/xhtml+xml',
        '.xls': 'application/vnd.ms-excel',
        '.xml': 'application/xml',
        '.xpm': 'image/x-xpixmap',
        '.xsl': 'application/xml',
        '.xslt': 'application/xslt+xml',
        '.yaml': 'text/yaml',
        '.yml': 'text/yaml',
        '.zip': 'application/zip'
    }
};

//重新确定根目录，默认根目录为运行当前命令的目录
function checkParama() {
    //参数说明 在actiobtype为2时，参数结构哈哈
    if (process.argv.length > 3) {
        actionType = process.argv[3] != 2 ? ACTINOTYPE.STARTSERVER : ACTINOTYPE.SCANNODE;
        let params = process.argv.slice(4);
        params.forEach(function(par){
            if(par){
                par = par.split("=");
                if(par[0] === "mainfile"){
                    DefaultFile.unshift(par[1]);
                }else if(par[0] === "json"){
                    let jsonLangPath = par[1];
                    if(fs.existsSync(jsonLangPath)){
                        try{
                            jsonLangObj = JSON.parse(fs.readFileSync(jsonLangPath, "utf-8"));
                        }
                        catch(e){
                            console.log(`读取语言包json文件<${jsonLangPath}>失败。`);
                            jsonLangObj = {};
                        }
                    }
                }
            }
        });
    }
   
    ROOT_PATH = CURPATH;
    mibFile = path.join(ROOT_PATH, ".mib");
}

function exec(filename, response, request) {
    var process = child_process.fork(filename);
    process.on('message', function (msg) {
        if (!msg.Content) {
            var errMsg = 'Error 193:' + filename + ' has error!\n';
            console.log(errMsg);
            goToError(400, response, errMsg);
            return;
        }
        if (!(msg.ContentType)) {
            msg.ContentType = 'text/html';
        }

        try {
            response.writeHead(200, { 'Content-Type': msg.ContentType });
            response.end(msg.Content.toString());
        } catch (e) {
            console.log('Stack:' + e.stack);
            var loc = e
                .stack
                .replace(/Error\n/)
                .split(/\n/)[1]
                .replace(/^\s+|\s+$/, '');
            console.log('Location: ' + loc + '');
            return;
        } finally {
            process.kill();
        }
    });
    if (request.method == 'POST') {
        handleRequest(request, response, function (postData) {
            process.send(
                { 'headers': request.headers, 'url': request.url, 'method': request.method, 'formData': postData }
            );
        });
    } else {
        process.send(
            { 'headers': request.headers, 'url': request.url, 'method': request.method }
        );
    }
}

function handleRequest(request, response, callback) {
    var postData = '';
    request.addListener('data', function (postDataChunk) {
        postData += postDataChunk;
        console.log('Received POST data chunk ' + postDataChunk + '.');
    });
    request.addListener('end', function () {
        console.log('Received POST data:' + postData);
        callback.call(this, postData);
    });
}

function rmFile(fileName) {
    if (isWin) {
        require('child_process').exec('del /f /s /q ' + fileName);
    } else {
        require('child_process').exec('rm -f ' + fileName);
    }
}

function writeFile(fileName, content) {
    fs.writeFile(fileName, content, function (err) {
        if (err) {
            throw err;
        }
        /*if (isWin) {
        require('child_process').exec('attrib +h ' + fileName);
    }*/
    });
}

function readFile(filename, response, request) {

    if (path.extname(filename) == '.wjs') {
        exec(filename, response, request);
    } else {
        fs.readFile(filename, function (err, file) {

            if (err) {
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end(err + '\n');
                return;
            }

            response.writeHead(200, {
                'Content-Type': mime.lookupExtension(path.extname(filename)),
                'Access-Control-Allow-Origin': "*",
                'Cache-control': 'no-cache',
                'Connection': 'close'
            });

            if (path.extname(filename) != '.wjs') {
                response.end(file);
            } else {
                response.end();
            }
        });
    }
}

function goToError(num, response, text) {
    response.writeHead(num, { 'Content-Type': 'text/plain' });
    response.end(text + '\n');
}

function goTo404(response) {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('404 Not Found\n');
}

function formatBody(parent, files) {
    var res = [];
    res.push('<!doctype>');
    res.push('<html>');
    res.push('<head>');
    res.push(
        '<meta http-equiv="Content-Type" content="text/html;charset=utf-8"></meta>'
    );
    res.push('<title>Node.js HTTP Server -- Powered By Wen</title>');
    res.push('</head>');
    res.push('<body>');
    res.push('<ul>');
    res.push('<li><a href="../">.. </a></li>');
    files.forEach(function (val) {
        var stat = fs.statSync(path.join(parent, val));
        if (stat.isDirectory(val)) {
            val = path.basename(val) + '/';
            res.push(
                '<li><a href="' + val + '"><strong>' + val + '</strong></a></li>'
            );
        } else {
            val = path.basename(val);
            res.push('<li><a href="' + val + '">' + val + '</a></li>');
        }
    });
    res.push('</ul>');
    res.push('</body>');
    return res.join('');
}

//list directory
function listDirectory(parentDirectory, res) {
    fs.readdir(parentDirectory, function (error, files) {
        var body = formatBody(parentDirectory, files);
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Cache-control': 'no-cache',
            'Connection': 'close',
            'Content-Type': 'text/html;charset=utf-8',
            'Content-Length': Buffer.byteLength(body, 'utf8'),
            'Server': 'NodeJs(' + process.version + ')'
        });
        res.write(body, 'utf8');
        res.end();
    });
}

function listDefaultFile(basedir, response, request, index) {
    var fileName = basedir.replace(/[\/\\]+$/gi, '') + '\\' + DefaultFile[index];
    fs.exists(fileName, function (exists) {
        if (exists) {
            readFile(fileName, response, request);
        } else {
            index = ~~index;
            if (index < 0) {
                index = 0;
            } else if (index >= DefaultFile.length) {
                listDirectory(basedir, response);
                return;
            }
            listDefaultFile(basedir, response, request, index + 1);
        }
    });
}

function checkUri(basedir, response, request, uri) {
    if (fs.lstatSync(basedir).isDirectory()) {
        if (!(/[\\\/]$/gi.test(basedir))) {
            //console.log(response.headers);
            var queryString = url.parse(request.url).search;

            var rep = request.headers;

            rep.Location = uri + '/' + (queryString == null ? '' : queryString);
            response.writeHead(301, rep);

            response.end();
            return;
        } else {
            listDefaultFile(basedir, response, request, 0);
        }
    } else {
        readFile(basedir, response, request);
    }
}

//开启本地服务
function createServer() {
    http.createServer(function (request, response) {
        var uri = url.parse(request.url).pathname.replace(/%20/g, ' ');
        var re = /(%[0-9A-Fa-f]{2}){3}/g;
        if (re.test(uri)) {
            //能够正确显示中文，将三字节的字符转换为utf-8编码
            uri = uri.replace(re, function (word) {
                var buffer = new Buffer(3),
                    array = word.split('%');
                array.splice(0, 1);
                array.forEach(function (val, index) {
                    buffer[index] = parseInt('0x' + val, 16);
                });
                return buffer.toString('utf8');
            });
        }

        //标示是否为模块化接口操作数据
        dataFileType = "/goform/module" === uri ? APITYPE.MODULE : APITYPE.OTHER;

        if (request.method == 'POST') {
            var post = '';
            request.on('data', function (chunk) { //通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
                post += chunk;
            }
            );

            //在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
            request.on('end', function () {
                try {
                    post = JSON.parse(post);
                } catch (e) {
                    post = querystring.parse(post);
                }

                //处理页面节点扫描数据回传
                if (uri === "/scannode/push") {
                    help.combineObj(fieldMess, post);
                    console.log(post);
                    return;
                } else if (uri === "/scannode/end") {
                    // 关闭当前服务器，并且移除所有文件对ScanCode的引用
                    help.resetFiles(scanFiles);
                    
                    //导出节点文件为excel
                    let outObj = {};
                    for(let key in jsonLangObj){
                        outObj[key] = fieldMess[key] || "";
                    }

                    json2excel.Json2Excel(outObj, ROOT_PATH);
                    fs.unlinkSync(path.join(ROOT_PATH, "scanPage.js"));

                    response.writeHead(200, {
                        'Content-Type': "application/json",
                        'Access-Control-Allow-Origin': "*",
                        'Cache-control': 'no-cache',
                        'Connection': 'close'
                    });
                    response.end(JSON.stringify({data:ROOT_PATH + "en-length.xlsx"}));
                    //todo by xc 关闭xxx
                    return;
                }
                //页面扫描数据回传 end

                // console.log("post请求: ", post);
                // console.log("dataFileType: ", dataFileType);
                // console.log("-----------------------------------------------");

                changeMibData(post, uri);

                //处理API接口，进行数据返回
                if (dataFileType === APITYPE.MODULE) {
                    var postBackData = {},
                        defaultData = 0;

                    for (var key in post) {
                        if (post.hasOwnProperty(key)) {
                            postBackData[key] = fileObj[key] || defaultData;
                        }
                    }

                    // console.log("请求返回: ", postBackData);
                    // console.log("-----------------------------------------------");

                    response.writeHead(200, {
                        'Content-Type': "application/json",
                        'Access-Control-Allow-Origin': "*",
                        'Cache-control': 'no-cache',
                        'Connection': 'close'
                    });
                    response.end(JSON.stringify(postBackData));
                }
            }
            );
        } else {
            var getStr = "",
                index = 0,
                getData;

            index = request.url.indexOf(uri) + uri.length + 1;
            getStr = request.url.slice(index);
            try {
                if(getStr){
                    getData = querystring.parse(getStr);
                    changeMibData(getData, uri);
                }
            } catch (e) { }
        }

        //	对于模块化接口数据在post中进行处理
        if (dataFileType === APITYPE.MODULE) {
            return;
        }

        scanDirectDataFile(uri);

        var filename = "";
        if (relativePath && uri && uri.indexOf(relativePath.replace(/(^[\\\/]+)|([\\\/]+$)/g, "")) === -1) {
            filename = path.join(ROOT_PATH, relativePath, uri);
        } else {
            filename = path.join(ROOT_PATH, uri);
        }
        let key = uri.replace(/\\/g,'/').replace(/^\//,""),
            postBackData = fileObj[key];

        //存在于缓存的数据文件之中
        if (postBackData) { 
            response.writeHead(200, {
                'Content-Type': mime.lookupExtension(path.extname(filename)),
                'Access-Control-Allow-Origin': "*",
                'Cache-control': 'no-cache',
                'Connection': 'close'
            });

            if (path.extname(filename) != '.wjs') {
                response.end(JSON.stringify(postBackData));
            } else {
                response.end();
            }
        } else { 
            fs.exists(filename, function (exists) {
                if (!exists) {
                    if (uri.indexOf(".") === -1) {
                        response.writeHead(200, {
                            'Content-Type': "application/json",
                            'Access-Control-Allow-Origin': "*",
                            'Cache-control': 'no-cache',
                            'Connection': 'close'
                        });
                        response.end(JSON.stringify({ "status": 1 }));
                    } else {
                        goTo404(response);
                    }
                } else {
                    checkUri(filename, response, request, uri);
                }
            });
        }
    }).listen(PORT);

    setTimeout(function () {
        console.log(
            'Server running at http://localhost:' + PORT + ', the webroot is: ' +
            ROOT_PATH
        );
    }, 1000);
}

function changeMibData(data, uri) {
    for (let prop in data) {
        if(dataFileType === APITYPE.MODULE){
            let prop1 = prop.replace(/^set/, "get");
            setMibValueModal(fileObj, prop1, data[prop]);
        }else{
            let inter = interfaceObj[prop];
            if (inter) {
                for (let i = 0, l = inter.length; i < l; i++) {
                    setMibValue(fileObj[inter[i]], prop, data[prop]);
                }
            }
        }
    }
}

function getType(obj) {
    return Object.prototype.toString.call(obj);
}

/**
 * 收到请求后，改变缓存中变量的值
 * data: goform/getWifi的数据
 * prop: wifiSsid
 * value: wifiSsid的值 新值
 */

function setMibValue(data, prop, value) {
    //data: goform/getWifi的数据
    //prop: wifiSsid
    //value: wifiSsid的值
    for (var namei in data) {
        //hack: 暂时不支持数组数据修改
        if (Object.prototype.toString.call(data[namei]) == "[object Array]") {
            //按照给定的数据格式才能进行数据修改

            continue;
        }
        if (namei == prop) {
            if (data[namei] != value) {
                //console.log("############## " + data[namei]);
                data[namei] = value;
                break;
            }
        } else {
            //console.log(Object.prototype.toString.call(data[namei]) == '[object Object]');
            if (Object.prototype.toString.call(data[namei]) == '[object Object]') {
                setMibValue(data[namei], prop, value);
                continue;
            }
        }
    }
}

function setMibValueModal(data, prop, value) {
    //data: goform/getWifi的数据 prop: wifiSsid value: wifiSsid的值 新值
    var newData = [];
    for (var namei in data) {
        if (data.hasOwnProperty(namei)) {
            // hack: 暂时不支持数组数据修改 数组格式为： { 	type:'add'/'delete'/'edit', 	key:''//数据项的主键
            // data：[]// add和edit时为对象数组，delete时为要删除的键值数组 }
            if (namei == prop) {
                if (getType(data[namei]) == "[object Array]") {

                    if (getType(value) == "[object Array]" && value && value.length > 0 && typeof value[0] != "object") {
                        data[namei] = value;
                        continue;
                    }

                    if (getType(value) != "[object Object]") {
                        continue;
                    }

                    try {
                        var key = value.key || "ID",
                            curData = data[namei],
                            id = 1;
                        if (curData && curData[curData.length - 1]) {
                            id = curData[curData.length - 1][key];
                        }

                        switch (value.type) {
                            case "add":
                                {
                                    data[namei] = curData.concat(value.data);
                                    if (getType(value.data) === "[object Object]") {
                                        value.data[key] = ++id;
                                    } else if (getType(value.data) === "[object Array]") {
                                        for (let i = 0, l = value.data.length; i < l; i++) {
                                            //新增的情况下怎么返回对应的ID号
                                            value.data[i][key] = ++id;
                                        }
                                    }
                                }
                                break;
                            case "delete":
                                {
                                    // console.log("delete ---------");
                                    for (var i = 0, l = curData.length; i < l; i++) {
                                        if (value.data.indexOf(curData[i][key]) > -1) {
                                            data[namei].splice(i, 1);
                                            i--;
                                            l--;
                                            console.log("delete -----done----");
                                        }
                                    }
                                }
                                break;
                            case "switch":
                            case "edit":
                                {
                                    // console.log("edit"); console.log(value);
                                    var valData = {};
                                    if (getType(value.data) === "[object Object]") {
                                        valData[value.data[key]] = value.data;
                                    } else {
                                        for (var tt in value.data) {
                                            if (value.data.hasOwnProperty(tt)) {
                                                var d = value.data[tt];
                                                valData[d[key]] = d;
                                            }
                                        }
                                    }

                                    // console.log(valData);
                                    for (var j = 0, len = curData.length; j < len; j++) {
                                        var dd = curData[j][key];
                                        if (valData[dd]) {
                                            Object.assign(data[namei][j], valData[dd]);
                                        }
                                    }
                                }
                                break;
                        }
                    } catch (e) {
                        console.log("操作数据出错！");
                        console.log(e);
                    }
                    continue;
                } else if (getType(data[namei]) == "[object Object]") {
                    Object.assign(data[namei], value);
                } else if (data[namei] != value) {
                    data[namei] = value;
                    // console.log(namei);
                    break;
                }
            } else {
                //console.log(Object.prototype.toString.call(data[namei]) == '[object Object]');
                if (Object.prototype.toString.call(data[namei]) == '[object Object]') {
                    setMibValue(data[namei], prop, value);
                    continue;
                }

            }
        }
    }
}

//找到goform文件夹存放的路径
function travel(dir) {
    var rootPath = "";

    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);

        if (fs.statSync(pathname).isDirectory()) {
            if (dataFolderArr.indexOf(path.basename(file)) > -1) {
                // console.log("dataDir ",dir);
                rootPath = dir;
            } else {
                rootPath = travel(pathname) || rootPath;
            }
        }
    });
    return rootPath;
}

function scanDirectDataFile(uri) {
    uri = uri || "";

    if (relativePath && uri && uri.indexOf(relativePath) > -1) {
        return;
    }

    let rootPath = "", dir = path.join(ROOT_PATH, uri);

    if (!fs.existsSync(dir)) {
        return;
    }

    if (path.basename(uri).indexOf(".") > -1) {
        return;
    }

    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);

        if (fs.statSync(pathname).isDirectory()) {
            if (dataFolderArr.indexOf(path.basename(file)) > -1) {
                // console.log("dataDir ",dir);
                rootPath = dir;
                return false;
            }
        }
    });

    if (rootPath) {
        dataFolderArr.forEach(function (folder) {
            let p = path.join(rootPath, folder);
            if (fs.existsSync(p)) {
                relativePath = uri;
                console.log("##################### relativePath", relativePath);

                //单个数据文件(默认文件为index.json) 不去解析其它文件
                var dataPath = path.join(ROOT_PATH, relativePath, folder, "index.json");

                if (fs.existsSync(dataPath)) {
                    console.log("本地数据文件路径：", dataPath);
                    let fileStr = fs.readFileSync(dataPath, "utf-8");
                      
                    var obj = JSON.parse(fileStr);
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key)) {
                            fileObj[key] = obj[key];
                        }
                    }
                        // fs.writeFile('interface.json', JSON.stringify(interfaceObj));
                        // fs.writeFile('fileObj.json', JSON.stringify(fileObj));

                } else {
                    //多个数据文件
                    dataFolderArr.forEach(function(folder){ 
                        currentPath = path.join(ROOT_PATH, relativePath, folder);
                        if (!fs.existsSync(currentPath)) {
                            return true;
                        }

                        files = fs.readdirSync(currentPath);

                        files.forEach(function (file) {
                            dirPath = folder + "/" + path.basename(file, path.extname(file));
                            fileObj[dirPath] = walk(currentPath, file);
                        });
                    });
                    // mapAllIterface(fileObj);
                }
                mapAllIterface(fileObj);

                writeMibData();
                return false;
            }
        });
    } else {
        fileObj = {};
        interfaceObj = {};
        relativePath = "";
    }
}

//目前弃用
function createDataMib() {
    var mibFile = path.join(ROOT_PATH, ".mib"),
        files,
        currentPath,
        dirPath;

    fs.exists(mibFile, function (exists) {
        if (!exists) {
            fs.writeFileSync(mibFile, '');
        }

        //取到goform文件夹存放的路径
        var travelPath = travel(ROOT_PATH);
        travelPath = travelPath.slice(ROOT_PATH.length).replace(/[\\]/ig, '/');

        relativePath = travelPath;
        console.log("-- travelPath", travelPath);

        //单个数据文件(默认文件为index.json) 不去解析其它文件
        var folder = dataFolderArr[0],
            dataPath = path.join(ROOT_PATH, travelPath, folder, "index.json");

        if (fs.existsSync(dataPath)) {
            console.log("本地数据文件路径：", dataPath);
            fs.readFile(dataPath, "utf-8", function (err, fileStr) {
                if (err) {
                    console.error("本地数据文件读取失败！");
                }

                var obj = JSON.parse(fileStr);
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        fileObj[key] = obj[key];
                        if (getType(obj[key]) !== "[object Array]") {
                            // mapInterface(fileObj[key], key);
                        }
                    }
                }

                // fs.writeFile('interface.json', JSON.stringify(interfaceObj));
                // fs.writeFile('fileObj.json', JSON.stringify(fileObj));
            });

        } else {
            //多个数据文件
            for (var i = 0; i < dataFolderArr.length; i++) {
                var folder = dataFolderArr[i];
                currentPath = path.join(ROOT_PATH, travelPath, folder);
                if (!fs.existsSync(currentPath)) {
                    continue;
                }

                files = fs.readdirSync(currentPath);

                files.forEach(function (file) {
                    //todo by xc 去除所有dirPath值前面的goform标记，按接口名称取值即可
                    dirPath = relativePath + "/" + folder + "/" + path.basename(
                        file,
                        path.extname(file)
                    );
                    fileObj[dirPath] = walk(currentPath, file);

                    if (getType(fileObj[dirPath]) !== "[object Array]") {
                        // mapInterface(fileObj[dirPath], dirPath);
                    }
                });
            }
        }

        writeMibData();
    });
}
//目前弃用 end

//建立属性与接口的映射关系，如{ssid: ['/goform/getWifi', '/goform/getStatus']}
function mapInterface(dataObj, APIName) {
    for (var prop in dataObj) {
        if (Object.prototype.toString.call(dataObj[prop]) == '[object Object]') {
            mapInterface(dataObj[prop], url);
        } else {
            if (interfaceObj[prop]) {
                interfaceObj[prop].push(url);
            } else {
                interfaceObj[prop] = [];
                interfaceObj[prop].push(url);
            }
        }
    }
}

function mapAllIterface(dataObj){
    for(let key in dataObj){
        if(dataObj.hasOwnProperty(key)){
            let curVal = dataObj[key];
            if(getType(curVal) === "[object Array]"){
                continue;
            }

            mapInterface(curVal, key);
        }
    }
}

//将当前的数据信息记录到本地的mibFile文件中，不知道是做啥用的
function writeMibData() {
    fs.writeFileSync(mibFile, JSON.stringify(fileObj));
}

//读取当前路径下面的数据文件
//若当前路径是文件夹，则数据文件必为文件下面的的一个名称为DefaultFile中数组中的某一项的文件
function walk(filePath, file) {
    var fileStr = "{}",
        dataObj = {};
    try {
        var basepath = path.join(filePath, file);
        if (fs.statSync(basepath).isDirectory()) { //goform/getSysTool
            DefaultFile.forEach(function(dFile){ 
                filePath = path.join(basepath, dFile); //goform/getSysTool/index.html
                if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
                    fileStr = fs.readFileSync(filePath, "utf-8");
                    return;
                }
            });
        } else { //goform/getSysTool.txt
            fileStr = fs.readFileSync(basepath, "utf-8");
        }
    } catch (e) {
        return dataObj;
    }

    try {
        dataObj = JSON.parse(fileStr);
        return dataObj;
    } catch (e) {
        return dataObj;
    }
}

function startServer() {
    //确定根目录: ROOT_PATH
    checkParama();

    //读取数据文件的所有数据，并写入属性与接口的映射文件
    // createDataMib();
    scanDirectDataFile();

    //开启服务
    setTimeout(createServer, 1000);
    //在浏览器中打开监听的页面
    setTimeout(function () {
        require('child_process').exec('start http://127.0.0.1:' + PORT);
    }, 1200);

    //监听数据文件变化
    setTimeout(function () {
        watch(ROOT_PATH, dataFolderArr, function (url, file) {
            var dataObj,
                fileStr;
            if (file) {
                setTimeout(function () {
                    // console.log("file<", file, "> has changed ------------------");
                    if(dataFileType === APITYPE.MODULE){
                        reloadData(file);
                    }else{
                        fileStr = fs.readFileSync(file, "utf-8");
                        
                        if (fileObj[url] && JSON.stringify(fileObj[url]) != fileStr) {
                            try {
                                fileObj[url] = JSON.parse(fileStr);
                            } catch (e) {
                                fileObj[url] = {};
                            }
                            writeMibData();
                        }
                    }
                }, 1000);
            }
        });
    }, 3000)
}

function reloadData(file) {
    var fileStr = fs.readFileSync(file, "utf-8");
    try {
        if(file){
            fileObj = JSON.parse(fileStr);
            writeMibData();
            console.log("解析完成！");
        }
    } catch (e) {
        console.log("数据文件格式错误，重新解析......");
        setTimeout(function () {
            reloadData(file);
        }, 100);

    }
}

//入口文件
function start(paths) {
    if(paths){
        scanFiles = paths;
    }

    fileObj = {};
    interfaceObj = {};
    fs.readFile('.pidTmp', function (err, file) {
        if (!err) {
            var arr = file
                .toString()
                .split('\r\n');
            if (arr[1] == PORT) {
                console.log('Find old process is running, killing...');
                if (isWin) {
                    // windows 貌似没有 gracefully 关闭。 用 process.kill 会遇到进程关不了的情况，没有 exit 事件响应，原因不明！
                    require('child_process').exec(
                        'taskkill /PID ' + arr[0] + ' /T /F',
                        startServer
                    );
                } else {
                    // try to gracefully kill it.
                    process.kill(arr[0], 'SIGTERM');
                    startServer();
                }
            } else {
                startServer();
            }
        } else {
            startServer();
        }

        process.nextTick(function () {
            writeFile('.pidTmp', process.pid + '\r\n' + PORT);
        });
    });
}

process.on('uncaughtException', function (err) {
    if (err.toString().indexOf('EADDRINUSE') > -1) {
        console.error('Port ' + PORT + ' in use!');
        rmFile('.pidTmp');
        process.exit();
    } else {
        console.error('Error caught in uncaughtException event:', err);
    }
});

exports.start = start;

if (!/index\.js$/i.test(process.argv[1])) {
    start();
}