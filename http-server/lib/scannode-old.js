/**
 * 启动本地服务器，将代码注入到每个页面中去
 * 扫描每个页面上的文本字段，并去除文本对应的最大长度
 */
 
(function($){
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

    //计算单个14px像素的w的宽度
    function getPerLength(){
        var $label = $('<label style="font-size:14px; padding:0; margin:0; border:0;">wwwwwwwwww</label>').appendTo("body");
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
        btnlist = Array.prototype.slice.call(list);
        try{
        // B && B.setLang("en");
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
                if($(this).is(":visible")){
                    this.fatTarget = curNavBtn;
                    this.btnIndex = i;
                    btnlist.push(this);
                }
            });

            $(node).find("iframe").each(function(){
                $(this.contentWindow.document.body).find(otherTarget).each(function(i){
                    if($(this).is(":visible")){
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
        if($(node).css("display")=== "none" || $(node).is(':hidden')){
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

            w = ww > 100 ? ww : w;

            //对于不能确定宽度的元素根据元素的内容
            let tempL = tempNodes.length;
            if(tempL > 0){
                let curW = 0, allWidth = 0, nouseWidth = 0, culNodes = [];
                let reg = new RegExp(/[A-za-z]/, "g");

                tempNodes.forEach(function(cnode){
                    if(cnode.nodeType === 3 && !reg.test(cnode.nodeValue)){
                        let $label = $('<lable style="margin:0;padding:0;">'+ cnode.nodeValue +'<lable>').appendTo("body");
                        let w1 = $label.width();
                        $label.remove();
                        w -= w1;
                    }else{
                        let w1, w2;
                        if(cnode.nodeType === 3){
                            let $label = $('<lable style="margin:0;padding:0;">'+ cnode.nodeValue +'<lable>').appendTo("body");
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
            cache: false,
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
}(jQuery, undefined));