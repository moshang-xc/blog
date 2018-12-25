#!/usr/bin/env node

let ACTINOTYPE = {
        STARTSERVER: 1,//开启服务，默认值
        SCANNODE: 2 //扫描节点
    };

if(process.argv.length > 3){
    let actionType = process.argv[3] == "2" ? ACTINOTYPE.SCANNODE : ACTINOTYPE.STARTSERVER;
    if(actionType === ACTINOTYPE.SCANNODE){
        require('./autoScan.js').startScanNode();
    }else{
        require('./http.js').start();
    }
}else{
    require('./http.js').start();
}
