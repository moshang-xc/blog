/**
 * 启动本地服务器，将代码注入到每个页面中去
 * 扫描每个页面上的文本字段，并去除文本对应的最大长度
 */
 
(function(){
    let all = {}, 
        btnlist = [], 
        iframe = false, 
        hasNext = false, 
        curNavBtn = null,
        timeOut = null,
        otherTarget = "{{otherTarget}}",
        ignoreTagNames = ["NOSCRIPT", "COMMENT", "SCRIPT"],
        perW = 0,
        lang = "en";

//构建迷你版的jquery
    function _addEvent(target,type,handler){
        if(target.addEventListener){
            target.addEventListener(type, function(e){
                //如果事件函数中出现 return false;则阻止默认事件和阻止冒泡
                if(typeof handler == 'function' && handler() === false){
                    e.preventDefault();
                    e.cancelBubble = true;
                }
            },false);
        }else{
            target.attachEvent('on'+ type, function(event){
                if(typeof handler == 'function' && handler() === false){
                    event.cancelBubble = true;
                    event.returnValue = false;
                }
                return handler.call(target,event);
            });
        }
    }

    function _toArray(arrayLike){
        return Array.prototype.slice.call(arrayLike);
    }

    function _getCSS(obj,style){
        if(window.getComputedStyle){
            return getComputedStyle(obj)[style];
        }
        return obj.currentStyle[style];
    }

    function _getNum(tt){
        return parseInt(tt) || 0;
    }

    function MJ(arg){
        this.elements = [];
        switch(typeof arg){
            case "function":
                _addEvent(window, "load", arg);
                break;
            case "string":
                try{
                    this.elements = _toArray(document.querySelectorAll(arg));
                }
                catch(e){

                }
                break;
            case "object":
                if(arg.constructor == Array){
                    this.elements = arg;
                }else{
                    this.elements.push(arg);
                }      
                break;
        }
    }

    MJ.prototype.appendTo = function(par){
        let parNode = document.querySelector(par);
        if(parNode){
            this.elements.forEach(function(node){
                parNode.appendChild(node);
            });
        }
        return this;
    }

    MJ.prototype.width = function(){
        let node = this.elements[0],
            styleObj = getComputedStyle(node);
        return node.offsetWidth - _getNum(styleObj["paddingLeft"]) - _getNum(styleObj["paddingRight"])
        - _getNum(styleObj["borderLeftWidth"])  - _getNum(styleObj["borderRightWidth"]);
   }

    MJ.prototype.html = function(str){
        if(str === undefined){
            return this.elements[0].innerHTML;
        }else{
            this.elements.forEach(function(node){
                node.innerHTML = str;
            });
        }
        return this;
    }

    MJ.prototype.text = function(str){
        if(str === undefined){
            return this.elements[0].innerText;
        }else{
            this.elements.forEach(function(node){
                node.innerText = str;
            });
        }
        return this;
    }

    MJ.prototype.eq = function(number){
        return $(this.elements[number]);
    }
    
    MJ.prototype.index = function(){
        var elements = this.elements[0].parentNode.children;
        for(var i = 0; i < elements.length; i++){
            if(elements[i] === this.elements[0]){
                return i;
            }
        }
    }
    
    MJ.prototype.find = function(str){
        var arr = [];
        if(str !== undefined && str !== ""){
            for(var i = 0; i < this.elements.length; i++){
                Array.prototype.push.apply(arr, this.elements[i].querySelectorAll(str));
            }
        }

        return $(arr);
    }

    MJ.prototype.each = function(fn){
        this.elements.forEach(function(node, index){
            fn && fn.call(node, index, node);
        });
    }

    MJ.prototype.css = function(attr,value){
        if(typeof attr == 'object'){
            for(var att in attr){
                for(var j = 0; j < this.elements.length; j++){
                    this.elements[j].style[att] = attr[att];
                }
            }
        }else{
            if(arguments.length == 2){
                for(var i = 0; i < this.elements.length; i++){
                    this.elements[i].style[attr] = value;
                }
            }
            else if(arguments.length == 1){
                return _getCSS(this.elements[0],attr);
            }
        }
        return this;
    }

    MJ.prototype.attr = function(attr,value){
        if(typeof attr == 'object'){
            for(var att in attr){
                for(var j = 0; j < this.elements.length; j++){
                    this.elements[j].setAttribute(att,attr[att]);
                }
            }
        }else{
            if(arguments.length == 2){
                for(var i = 0; i < this.elements.length; i++){
                    this.elements[i].setAttribute(attr,value);
                }
            }else if(arguments.length == 1){
                return this.elements[0].getAttribute(attr);
            }
        }
        return this;
    }
    
    MJ.prototype.hide = function(){
        for(var i = 0; i < this.elements.length; i++){
            this.elements[i].displayValue = this.elements[i].style.display;
            this.elements[i].style.display = 'none';
        }
        return this;
    }
    
    MJ.prototype.show = function(){
        for(var i = 0; i < this.elements.length; i++){
            this.elements[i].style.display = this.elements[i].displayValue;
            delete this.elements[i].displayValue;
        }
        return this;
    }
    
    MJ.prototype.on = function(eventType,fn){
        for(var i = 0; i < this.elements.length; i++){
            _addEvent(this.elements[i],eventType,fn.bind(this.elements[i]));
        }
        return this;
    }
    
    MJ.prototype.click = function(fn){
        this.elements.forEach(function(node){
            node.click();
        })
        return this;
    }
    
    MJ.prototype.hover = function(fnOver,fnOut){
        this.on('mouseover',fnOver);
        this.on('mouseout',fnOut);
        return this;
    }

    MJ.prototype.remove = function(){
        this.elements.forEach(function(node){
            node.parentNode.removeChild(node);
        });
        return this;
    }

    MJ.prototype.isVisible = function(){
        if(this.elements.length === 0) return false;
        return this.css("display") !== "none" && (this.elements[0].offsetHeight != 0 || this.elements[0].offsetWidth != 0);
    }

    MJ.prototype.outerWidth = function(arg){
        if(this.elements.length === 0) return 0;

        let curNode = this.elements[0],
            styleObj = getComputedStyle(curNode);

        if(arg){
            let t = curNode.offsetWidth + _getNum(styleObj["margin-left"]) +  + _getNum(styleObj["margin-right"]);
            if(t > 0){
                return t;
            }
            return 0;
        }
        return curNode.offsetWidth;
    }

    MJ.prototype.clone = function(){
        return $(this.elements[0].cloneNode());
    }

    MJ.prototype.insertAfter = function(tar){
        let par = $(tar).elements[0].parentElement;
        par.insertBefore(this.elements[0], $(tar).elements[0]);
        return this;
    }

    function $(arg){
        if(typeof arg === "object" && arg.constructor === MJ){
            return arg;
        }
        return new MJ(arg);
    }

    $.ajax = function(opt){
        opt = Object.assign({type:"post", async:true, dataType:"json", url:""}, opt)
        let xmlHttp;
        if (window.XMLHttpRequest){// code for IE7, Firefox, Opera, etc.
            xmlHttp=new XMLHttpRequest();
        }
        else if (window.ActiveXObject){// code for IE6, IE5
            xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        
        if (xmlHttp != null){
            xmlHttp.onreadystatechange = state_Change;
            xmlHttp.open(opt.type, opt.url, opt.async);
            xmlHttp.send(opt.data);
        }

        function state_Change(){
            if (xmlHttp.readyState==4){// 4 = "loaded"
                if (xmlHttp.status==200){// 200 = OK
                    opt.success && opt.success(JSON.parse(xmlHttp.responseText));
                }
                else{
                    console.log("Problem retrieving XML data");
                }
            }
        }
    }
//构建迷你版的jquery end

    //计算单个14px像素的w的宽度
    function getPerLength(){
        var node = document.createElement("label");
        node.setAttribute("style", "font-size:14px; padding:0; margin:0; border:0;");
        node.innerText = "wwwwwwwwww";
        var $label = $(node).appendTo("body");
        var l = $label.width() / 10;
        $label.remove();
        return l;
    }

    //获取元素的fontsize
    function getFontSize(size){
        if(typeof size === "string"){
            size = size.replace("px", "");
            return parseInt(size);
        }
        return size;
    }

    //遍历导航进行页面切换
    function loopNav(){
        //所有界面遍历完成后，直接发送结束指令，以便输出excel文档
        let $navWrap = $("{{navNode}}"),
            list = $navWrap.find("{{btnNode}}");
        btnlist = Array.prototype.slice.call(list.elements);
        try{
            B && B.setLang("en");
            lang = B.getLang();
        }catch(e){

        }

        //显示所有隐藏的导航元素
        // $navWrap.find("*").show();

        //先扫描最外层
        scanNode(document.body);

        let $frames = document.getElementsByTagName("iframe");
        $frames = Array.prototype.slice.call($frames);

        iframe = $frames.length > 0;
        if(iframe){
            $frames.forEach(function(frame){
                frame.onload = function(){
                    timeOut && clearTimeout(timeOut);
                    setTimeout(()=>{
                        timeOut = null;
                        scanNode(top.document.body);
                    }, 1000);
                }
            });
        }
    }

    function nextPage(){
        if(btnlist.length > 0){
            curNavBtn = btnlist.shift();
            $(curNavBtn.fatTarget || curNavBtn).click();
            //不确定什么时候页面能够加载完成，故不做任何处理
                timeOut = setTimeout(function(){
                    scanNode(document.body);
                },2000);
        }else{
            request('/scannode/end',{}, function(data){
                alert("节点扫描完成，长度文件输出到如下路径：" + data["data"]);
            }); 
        }
    }

    function setData(key, value, fontSize){
        if(value < 0) return;
        let reg = new RegExp(/[A-za-z]/, "g");
        if(/^\d+$/.test(key)){
            return;
        }
        //以14px为基准计算的每个字母的宽度，按不同的尺寸进行等比例缩放
        fontSize = perW * fontSize/14;
        
        value = Math.round(value/fontSize);
        if(lang !== "en"){
            let v = all[key];
            all[key] = v ? ( v > value ? value : v) : value;
        }else if(reg.test(key)){
            let v = all[key];
            all[key] = v ? ( v > value ? value : v) : value;
        }
    }

    //切换页面后进行节点扫描以获取文本的尺寸
    //注意nodeType为3的文本节点
    function scanNode(node){
        if(curNavBtn && curNavBtn.fatTarget){
            try{    
                if(curNavBtn.inIframe){
                    $(node).find("iframe").each(function(){
                        $(this.contentWindow.document.body).find(otherTarget).eq(curNavBtn.btnIndex).click();
                    });
                }else{
                    $(node).find(otherTarget).eq(curNavBtn.btnIndex).click();
                }
                curNavBtn = null;
                timeOut = setTimeout(function(){
                    scanNode(document.body);
                }, 2000);

                return;
            }catch(e){
                console.log(e);
                return;
            }
            return;
        }
        all = {};
        // node = [...node];
        if(node.length){
            node = Array.prototype.slice.call(node);
        }else{
            node = [node];
        }
        
        for(let i = 0, l = node.length; i<l; i++){
            scanSingleNode(node[i]);
        }

        if(curNavBtn && !curNavBtn.fatTarget){
            $(node).find(otherTarget).each(function(i){
                if($(this).isVisible()){
                    this.fatTarget = curNavBtn;
                    this.btnIndex = i;
                    btnlist.push(this);
                }
            });

            $(node).find("iframe").each(function(){
                $(this.contentWindow.document.body).find(otherTarget).each(function(i){
                    if($(this).isVisible()){
                        this.fatTarget = curNavBtn;
                        this.btnIndex = i;
                        this.inIframe = true;
                        btnlist.push(this);
                    }
                });
            });
        }

        console.log(all);
        //发送遍历节点后得到数据的请求
        request('/scannode/push', all, function(){
            nextPage();
        });
    }

    function scanSingleNode(node, w){
        let childNodes = node.childNodes,
            ww = w || $(node).width(); //计算最外层容器的宽度
            w = ww;
        //若当前节点为文本节点
        if(node.nodeType === 3){
            setData(node.nodeValue, ww, getFontSize($(node.parentElement).css("font-size")));
            return;
        }

        //隐藏的元素以后再做处理；
        if(!$(node).isVisible()){
            return;
        }

        //data-nowrap=1的元素的内容当做一个字段进行提取
        if($(node).attr("data-onwrap") === 1 && node.nodeType === 1){
            setData(node.innerHTML, ww, getFontSize($(node).css("font-size")));
            return;
        }

        if(childNodes.length === 1 && childNodes[0].nodeType === 3){
            // 直接计算当前节点的宽度为文本的最大宽度
            setData(childNodes[0].nodeValue, ww, getFontSize($(node).css("font-size")));
        }else{
            let tempNodes = [];
            for(var l = childNodes.length, i = 0; i<l; i++){
                let node = childNodes[i];
                if(node){
                    //to do by xc 数组为什么会超出索引
                    if(node.nodeType === 3){
                        if(node.nodeValue.replace(/(^\s+)|(\s+$)/g,"") === ""){
                            continue;
                        }
                        tempNodes.push(node);
                    }else if(node.nodeType === 1){
                        if(ignoreTagNames.indexOf(node.tagName.toUpperCase()) > -1){
                            continue;
                        }
                        switch(node.tagName.toLowerCase()){
                            case "img":{
                                ww -= $(node).outerWidth(true);//总的宽度减去可定宽元素的宽度+外边距
                            }break;
                            case "textarea":
                            case "input":{
                                let pholder = node.placeholder;
                                setData(pholder, $(node).width(), getFontSize($(node).css("font-size")));
                                ww -= $(node).outerWidth(true);//总的宽度减去可定宽元素的宽度+外边距
                            }break;
                            case "table":{
                                let ths = $(node).find("th"),
                                    fontSize = getFontSize(ths.css("font-size"));
                                ths.each(function(){
                                    let text = $(this).text();
                                    text && setData(text, $(this).width(), fontSize);
                                });
                            }break;
                            case "select":{
                                let options = node.options, opW = $(node).width(), fsize = getFontSize($(node).css("font-size"));
                                for(let m = 0, n = options.length; m < n; m++){
                                    setData(options[m].text, opW, fsize);
                                }
                                return;
                            }break;
                            case "iframe":{
                                scanSingleNode(node.contentWindow.document.body);
                            }break;
                            default:{
                                //position:absolute,fixed脱离文档流的元素,一般情况情况下都是定宽的所以无需考虑对其它元素造成的影响，只需要检测其子元素是否溢出
                                if(/^(absolute|fixed)$/.test($(node).css("position"))){
                                    scanSingleNode(node);
                                }else{
                                    if(isAbsoluteNode(node)){
                                        scanSingleNode(node);
                                        ww -= $(node).outerWidth(true);//总的宽度减去可定宽元素的宽度+外边距
                                    }else{
                                        tempNodes.push(node);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            w = ww > 0 ? ww : w;

            //对于不能确定宽度的元素根据元素的内容
            let tempL = tempNodes.length;
            if(tempL > 1){
                let curW = 0, allWidth = 0, nouseWidth = 0, culNodes = [];
                let reg = new RegExp(/[A-za-z]|[\u4e00-\u9fa5]/, "g");

                tempNodes.forEach(function(cnode){
                    if(cnode.nodeType === 3 && !reg.test(cnode.nodeValue)){
                        
                        var node = document.createElement("label");
                        node.setAttribute("style", "padding:0; margin:0;");
                        node.innerText = cnode.nodeValue;
                        let $label = $(node).appendTo("body");

                        let w1 = $label.width();
                        $label.remove();
                        w -= w1;
                    }else{
                        let w1, w2;
                        if(cnode.nodeType === 3){
                            var node = document.createElement("label");
                            node.setAttribute("style", "padding:0; margin:0; border:0;");
                            node.innerText = cnode.nodeValue;
                            let $label = $(node).appendTo("body");

                            w1 = w2 = $label.width();
                            $label.remove();
                        }else{
                            w1 = $(cnode).outerWidth(true),
                            w2 = $(cnode).width();
                        }
                        allWidth += w2;
                        nouseWidth += w1 - w2;
                        cnode.w = w2;
                        culNodes.push(cnode);
                    }
                });
                
                allWidth = allWidth || 1;
                curW = (w - nouseWidth) / allWidth;
                culNodes.forEach(function(cnode){
                    scanSingleNode(cnode, ~~(curW * cnode.w));
                });
            }else if(tempL === 1){
                scanSingleNode(tempNodes[0], w);
            }
        }
    }

    //判断元素是否具有已给定的宽度例如类似display:block的元素
    function isAbsoluteNode(node){
        let $node = $(node),
            display = $node.css("display");
        switch(display){
            case "block":{
                //position!=absolute,fixed,float!=left,right
                if(/^(left|right)$/.test($node.css("float"))){
                    return checkNode(node); 
                }
                return true;
            }break;
            case "inline":{
                return false;
            }break;
            case "inline-block":
            default:{
                return checkNode(node);
            }break;
        }
    }

    //检测元素的宽度是否是定宽，是否会随着内容的变化宽度也会跟着变化
    function checkNode(node){
         let $node = $(node),
            w1 = $node.width(),
            $clone = $node.clone(),
            style = $node.attr("style") || "";
        $clone.html($node.html() + "插入的多余文本!").insertAfter($node);
        $node.attr("style", style + " ;position:absolute;");
        let w2 = $clone.width();
        $clone.remove();
        $node.attr("style", style);

        return w1 == w2;
    }

    //ajax 操作
    function request (url, data, handler) {
        if(typeof data === "object"){
            data = JSON.stringify(data);
		}
		
        $.ajax({
            url: url,
            type: "post",
            dataType: "json",
            async: true,
            data: data,
            success: function (data) {
                if ((typeof handler).toString() == "function") {
                    handler(data);
                }
            }
        });
    }

    window.onload = function(){
        perW = getPerLength();
        setTimeout(function(){
            loopNav();
        }, 2000);
    }
}(undefined));