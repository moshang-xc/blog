var xlsx = require('./xlsx-write'),
    path = require('path');

function Json2Excel(originData, dest){
    var jsonData = [];
    dest = path.join(dest, "en-length.xlsx");
    
    for (var key in originData) {
        jsonData.push([key, originData[key]]);
    }
    jsonData.unshift(['en', '字符最大长度']);
    
    xlsx.write(dest, '', jsonData);
    console.log(`最大字符长度excel文件已经导出到以下路径：${dest}`);
}

exports.Json2Excel = Json2Excel;