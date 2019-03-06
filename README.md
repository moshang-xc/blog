# JS代码片段
学习总结归纳

## 1. 小数取整

```
let x = 1.234;
~~x    //1
x >>   //1
x | 0  //1
Math.floor(x)  //1

let y = -1.4;
x >>   //-1
Math.floor(y)   //-2
```

## 2. 生成N位随机数

```
let getRandom = n => Math.random().toString().slice(-n);
```

## 3. 生成N-M之间的随机数

```
let randomNum = (n,m) => Math.floor(Math.random()*(m-n) + n);
```

## 4. 生成16进制颜色

```
let colorCode = '#' +('00000' +(Math .random()* 0x1000000 << 0).toString(16)).slice(- 6);
```

## 5.驼峰命名转下划线

```
let humpToUnderline = str => str.match(/^[a-z][a-z0-9]+|[A-Z][a-z0-9]*/g).join('_').toLowerCase();
```

## 6.数组去重

```
let unique = arr => [...new Set(arr)]
```

## 7. 时间格式化

```

```

## 8. 检测浏览器是否支持svg
```
function isSupportSVG() { 
    var SVG_NS = 'http://www.w3.org/2000/svg';
    return !!document.createElementNS &&!!document.createElementNS(SVG_NS, 'svg').createSVGRect; 
} 
```

## 9. 检测浏览器是否支持canvas
```
function isSupportCanvas() {
    if(document.createElement('canvas').getContext){
        return true;
    }else{
        return false;
    }
}
```


## 10. 检测是否移动端及浏览器内核

```javascript
var browser = { 
    versions: function() { 
        var u = navigator.userAgent; 
        return { 
            trident: u.indexOf('Trident') > -1, //IE内核 
            presto: u.indexOf('Presto') > -1, //opera内核 
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核 
            gecko: u.indexOf('Firefox') > -1, //火狐内核Gecko 
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否移动终端 
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios 
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android 
            iPhone: u.indexOf('iPhone') > -1 , //iPhone 
            iPad: u.indexOf('iPad') > -1, //iPad 
            webApp: u.indexOf('Safari') > -1 //Safari 
        }; 
    }
} 

if (browser.versions.mobile() || browser.versions.ios() || browser.versions.android() || browser.versions.iPhone() || browser.versions.iPad()) { 
    alert('移动端'); 
}
```

## 11. 检测是否电脑端/移动端

```javascript
var browser={ 
    versions:function(){
        var u = navigator.userAgent, app = navigator.appVersion;
        var sUserAgent = navigator.userAgent;
        return {
        trident: u.indexOf('Trident') > -1,
        presto: u.indexOf('Presto') > -1, 
        isChrome: u.indexOf("chrome") > -1, 
        isSafari: !u.indexOf("chrome") > -1 && (/webkit|khtml/).test(u),
        isSafari3: !u.indexOf("chrome") > -1 && (/webkit|khtml/).test(u) && u.indexOf('webkit/5') != -1,
        webKit: u.indexOf('AppleWebKit') > -1, 
        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
        mobile: !!u.match(/AppleWebKit.*Mobile.*/), 
        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), 
        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
        iPhone: u.indexOf('iPhone') > -1, 
        iPad: u.indexOf('iPad') > -1,
        iWinPhone: u.indexOf('Windows Phone') > -1
        };
    }()
}
if(browser.versions.mobile || browser.versions.iWinPhone){
    window.location = "http:/www.baidu.com/m/";
} 
```

## 12. 检测浏览器内核

```javascript
function getInternet(){    
    if(navigator.userAgent.indexOf("MSIE")>0) {    
      return "MSIE";       //IE浏览器  
    }  

    if(isFirefox=navigator.userAgent.indexOf("Firefox")>0){    
      return "Firefox";     //Firefox浏览器  
    }  

    if(isSafari=navigator.userAgent.indexOf("Safari")>0) {    
      return "Safari";      //Safan浏览器  
    }  

    if(isCamino=navigator.userAgent.indexOf("Camino")>0){    
      return "Camino";   //Camino浏览器  
    }  
    if(isMozilla=navigator.userAgent.indexOf("Gecko/")>0){    
      return "Gecko";    //Gecko浏览器  
    }    
} 
```

## 13. 浏览器视口大小获取

### 1、获取浏览器窗口的可视区域的宽度
```
function getViewPortWidth() {
    return document.documentElement.clientWidth || document.body.clientWidth;
}
```
 
### 2、获取浏览器窗口的可视区域的高度
```
function getViewPortHeight() {
    return document.documentElement.clientHeight || document.body.clientHeight;
}
```
 
### 3、获取浏览器窗口水平滚动条的位置
```
function getScrollLeft() {
    return document.documentElement.scrollLeft || document.body.scrollLeft;
}
```
 
### 4、获取浏览器窗口垂直滚动条的位置
```
function getScrollTop() {
    return document.documentElement.scrollTop || document.body.scrollTop;
}
```

## 14. 强制移动端页面横屏显示

```javascript
$( window ).on( "orientationchange", function( event ) {
    if (event.orientation=='portrait') {
        $('body').css('transform', 'rotate(90deg)');
    } else {
        $('body').css('transform', 'rotate(0deg)');
    }
});
```

## 15. 电脑端页面全屏显示

```javascript
function fullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}
```


## 16. 获取上传文件大小

```html
<input type="file" id="filePath" onchange="getFileSize(this)"/>
```

```javascript
// 兼容IE9低版本
function getFileSize(obj){
    var filesize;
    
    if(obj.files){
        filesize = obj.files[0].size;
    }else{
        try{
            var path,fso; 
            path = document.getElementById('filePath').value;
            fso = new ActiveXObject("Scripting.FileSystemObject"); 
            filesize = fso.GetFile(path).size; 
        }
        catch(e){
            // 在IE9及低版本浏览器，如果不容许ActiveX控件与页面交互，点击了否，就无法获取size
            console.log(e.message); // Automation 服务器不能创建对象
            filesize = 'error'; // 无法获取
        }
    }
    return filesize;
}
```

## 17. 限制上传文件类型

### 1、高版本浏览器

```html
<input type="file" name="filePath" accept=".jpg,.jpeg,.doc,.docxs,.pdf">
```

### 2、限制图片

```html
<input type="file" class="file" value="上传" accept="image/*"/>
```

### 3、低版本浏览器

```html
<input type="file" id="filePath" onchange="limitTypes()"/>
```

```javascript
/* 通过扩展名，检验文件格式。
 * @parma filePath{string} 文件路径
 * @parma acceptFormat{Array} 允许的文件类型
 * @result 返回值{Boolen}：true or false
 */

function checkFormat(filePath,acceptFormat){
    var resultBool= false,
        ex = filePath.substring(filePath.lastIndexOf('.') + 1);
        ex = ex.toLowerCase();
        
    for(var i = 0; i < acceptFormat.length; i++){
    　　if(acceptFormat[i] == ex){
            resultBool = true;
            break;
    　　}
    }
    return resultBool;
};
        
function limitTypes(){
    var obj = document.getElementById('filePath');
    var path = obj.value;
    var result = checkFormat(path,['bmp','jpg','jpeg','png']);
    
    if(!result){
        alert('上传类型错误，请重新上传');
        obj.value = '';
    }
}
```

## 18. 去除选中

```
function clearSelections () {
    if (window.getSelector) {
        // 获取选中
        var selection = window.getSelection();
        // 清除选中
        selection.removeAllRanges();
    } else if (document.selection && document.selection.empty) {
       // 兼容 IE8 以下，但 IE9+ 以上同样可用
        document.selection.empty();
        // 或使用 clear() 方法
        // document.selection.clear();
    }       
}
```

## 19. 函数节流
```js
function throttle(fn, delay) {
  let lastTime = 0;
  return function() {
    let nowTime = Date.now();
    if (nowTime - lastTime > delay) {
      fn.apply(this, arguments);
      lastTime = nowTime;
    }
  };
}
```

## 20. 函数防抖动
```js
function debounce(fn, delay){
  let timeout;
  return function(){
    timeout && clearTimeout(timeout);
    timeout = setTimeout(()=> {
        fn && fn();
        timeout = null;
    }, delay);
  }
}
```
