# css那些事儿

# height, width

`width`、`height`的默认值都是`auto`。

对于块级元素，`width: auto`的自动撑满一行。

对于内联元素，`width: auto`则呈现出包裹性，即由子元素的宽度决定。

无论内联元素还是块级元素，`height: auto`都是呈现包裹性，即高度由子级元素撑开。但是父元素设置`height: auto`会导致子元素`height: 100%`百分比失效。

流体布局之下，块级元素的宽度`width: auto`是默认撑满父级元素的。这里的撑满并不同于`width: 100%`的固定宽度，而是像水一样能够根据`margin`不同而自适应的宽度。

css的属性非常有意思，正常流下，如果块级元素的`width`是个固定值，`margin`是`auto`，则`margin`会撑满剩下的空间；如果`margin`是固定值，`width`是`auto`，则`width`会撑满剩下的空间。这就是流体布局的根本所在。

# 替换元素

替换元素是指内容可以替换的元素，实际上就是`content box`可以被替换的元素。如存在`src=""`属性的`<img> <audio> <video> <iframe>`元素和可以输入文本的`<input> <select> <textarea>`元素等。

所有替换元素都是内联元素，默认`display`属性是`inline`或`inline-block`（除了`input[type="hidden"]`默认`display: none;`）。

## padding

1. 大部分情况下我们会将元素重置为`box-sizing: border-box`，宽高的计算是包含了`padding`的，给人一种`padding`也是`content box`一部分的感觉，好像`line-height`属性也作用于`padding`上。但实际上，元素真正的内容的宽高只是`content box`的宽高，而**`line-height`属性是不作用于`padding`的**。
2. `padding`不可为负值，但是可以为百分比值。**为百分比时水平和垂直方向的`padding`都是相对于父级元素宽度计算的**。将一个`div`设为`padding: 100%`就能得到一个正方形，`padding: 10% 50%`可以得到一个宽高比 5:1 的矩形。
3. `padding`配合`background-clip`属性，可以制作一些特殊形状。

## margin

margin的top和bottom属性对非替换内联元素无效，例如`span`。

1. 作为外边距，`margin`属性并不会参与盒子宽度的计算，但通过设置`margin`为负值，却能改变元素水平方向的尺寸：

```html
<div>asdf</div>
<style>
  div {
    margin: 0 -100px;
  }
</style>
```

此时`div`元素的宽度是比父级元素的宽度大`200px`的。但是这种情况只会发生在元素是流布局的时候，即元素`width`是默认的`auto`并且可以撑满一行的时候。如果元素设定了宽度，或者元素设置了`float: left` / `position: absolute`这样的属性改变了流体布局，那么`margin`为负也无法改变元素的宽度了。

2. 块级元素的垂直方向会发生`margin`合并，存在以下三种场景：

- 相邻兄弟元素之间`margin`合并；
- 父元素`margin-top`和子元素`margin-top`，父元素`margin-bottom`和子元素`margin-bottom`；
- 空块级元素自身的`margin-top`和`margin-botom`合并，例子如下。

要阻止`margin`合并，可以：1. 给元素设置 bfc；2. 设置border或padding阻隔margin；3.  用内联元素（如文字）阻隔；4. 给父元素设定高度。

3. `margin`的百分比值跟`padding`一样，垂直方向的`margin`和水平方向上的一样都是相对于父元素宽度计算的。

4. margin: auto`能在块级元素设定宽高之后自动填充剩余宽高。`margin: auto`自动填充触发的前提条件是元素在对应的水平或垂直方向具有自动填充特性，显然默认情况下块级元素的高度是不具备这个条件的。典型应用是块级元素水平局中的实现：

```css
display: block;
width: 200px;
margin: 0 auto;
```

`auto`的特性是，如果两侧都是`auto`，则两侧均分剩余宽度；如果一侧`margin`是固定的，另一侧是`auto`，则这一侧`auto`为剩余宽度。

除了水平方向，垂直方向的`margin`也能实现垂直居中，但是需要元素在垂直方向具有自动填充特性，而这个特性可以利用`position`实现：

```css
position: absolute;
left: 0; right: 0; top: 0; bottom: 0;
width: 200px;
height: 200px;
margin: auto;
```

## line-height

line-height的值可以为数值和百分比或者具体的长度值，默认值为`normal`，约为1.2。其中数值和百分比的计算方法为乘以对应的`font-size`，长度值为具体的带单位`px`的值。

`line-height`是数值的元素的子元素继承的就是这个数值，百分比/长度值继承的都是计算后得出的带单位的值（px）。

### 作用

对块级元素来说，`line-height`决定了**行框盒子**的最小高度。注意是行框盒子的最小高度，而不是块级元素的实际高度。**对于非替代的 inline 元素，它用于计算行框盒子的高度。此时内联元素的行框盒子的高度完全由`line-height`决定，不受其他任何属性的影响。**

## vertical-align

在内联元素的垂直方向对齐中，基线是最为重要的概念。`line-height`定义的就是两基线之间的距离，`vertical-align`的默认值就是基线。基线的定义则是字母 x 的下边缘。

css中有个概念叫`x-height`，指的是小写字母 x 的高度。`vertical-align: middle`对齐的就是基线往上1/2`x-height`高度的地方，可以理解为近似字母 x 的交叉点。

**vertical-align属性起作用的前提必须是作用在内联元素上。**

取值说明：

- baseline：默认值，使元素的基线与父元素的基线对齐
- top：使元素及其后代元素的顶部部与整行或整块的底部对齐
- middle：使元素的中部与父元素的基线往上`x-height`的一半对齐
- bottom：使元素及其后代元素的底部与整行或整块的底部对齐
- text-top：使元素的顶部与父元素的字体顶部对齐
- text-bottom：使元素的顶部与父元素的字体底部对齐
- sub：元素的基线与父元素的下标基线对齐
- super：元素的基线与父元素的上标基线对齐
- 数值：默认值`baseline`相当于数值的 0 。使元素的基线对齐到父元素的基线之上的给定长度，数值正值是基线往上偏移，负值是往下偏移
- 百分比：使元素的基线对齐到父元素的基线之上的给定百分比，该百分比是line-height属性的百分比

## line-height  vertical-align

```html
<div>
<span>文本</span>
</div>
```

```css
div{
line-height: 30px;
}
span{
font-size: 30px;
}
```

上面的`div`的高度会超过`30xp`，为什么呢？

内联元素的默认对齐方式是`baseline`，所以此时此时`span`元素的基线是和父元素的基线相对齐的。父元素的基线其实就是行框盒子前的幽灵空白节点的基线。把幽灵空白节点具象化为字母x可能容易理解些：

父元素的基线其实就是行框盒子前的幽灵空白节点的基线。把幽灵空白节点具象化为字母`x`可能容易理解些：

由于`div`行高是`30px`，所以字母`x`和`span`元素的高度都是`30px`。但是字母x的`font-size`较小，`span`元素的`font-size`较大，而行高一样的情况下`font-size`越大基线的位置越偏下，所以两者的基线不在同一水平线上。由于内联元素默认基线对齐，所以字母`x`和`span`元素发生了位移以使基线对齐，导致`div`高度变大。而此时字母`x`的半行距比`span`元素的半行距大，大出的部分就是`div`的高度增加的部分。

### inline-block基线问题

一个设置了`display: inline-block`的元素：

1. 如果元素内部没有内联元素，则该元素基线就是该元素下边缘；
2. 如果元素设置了`overflow`为`hidden auto scroll`，则其基线就是该元素下边缘；
3. 如果元素内部还有内联元素，则其基线就是内部最后一行内联元素的基线。

> 由于替换元素内部不可能再有别的元素，所以其基线位置永远位于下边缘。

```html
<div>
x
<span></span>
</div>
```

```css
div{
outline: 1px solid #ddd;
text-align: center;
}

span{
display: inline-block;
width: 200px;
height: 200px;
background: #f00;
}
```

上面示例`div`底部和`span`下边缘之间会有空隙。

此时`span`的行框盒子前，还存在一个幽灵空白节点。由于`span`元素默认基线对齐，所以`span`元素的基线也就是其下边缘是和幽灵空白节点的基线对齐的。从而导致幽灵空白节点基线下面的半行距撑高了`div`元素，造成空隙。

**解决问题**

间隙产生本质上是由基线对齐引发的错位造成的，源头上是`vertical-align`和`line-height`共同造成的，所以要想解决这个问题，只要直接或间接改造两个属性中的一个就行了：

1. 给元素设置块状化`display: block`使`vertical-align`属性失效；
2. 尝试不同的`vertical-align`值如`bottom/middle/top`；
3. 直接修改`line-height`值；
4. 如果`line-height`为相对值如`1.4`，设置`font-size: 0`间接改变`line-height`。



## BFC：块级格式化上下文

- 概念

BFC是一个独立的渲染区域，只有`Block-level box`参与， 它规定了内部的`Block-level Box`如何布局，并且与这个区域外部毫不相干。
BFC 就好像一个结界，结界里面的东西不能影响外面的布局，也就是说，**BFC的子元素再翻江倒海，都不会影响外面的元素。** 所以：

1. BFC本身不会发生`margin`重叠。
2. BFC可以彻底解决子元素浮动带来的的高度坍塌和文字环绕问题。

- BFC的创建方法

1. 根元素；
2. 浮动元素 (`float`不为`none`的元素)；
3. 绝对定位元素 (元素的`position`为`absolute`或`fixed`)；
4. `inline-blocks`(元素的 `display: inline-block`)；
5. 表格单元格(元素的`display: table-cell`，`HTML`表格单元格默认属性)；
6. `overflow`的值不为`visible`的元素；
7. 弹性盒 `flex boxes` (元素的`display: flex`或`inline-flex`)；

BFC包含创建该上下文元素的所有子元素，但不包括创建了新BFC的子元素的内部元素。

- 特性

1. 内部的盒会在垂直方向一个接一个排列（可以看作BFC中有一个的常规流）；
2. Box垂直方向的距离由`margin`决定。属于同一个BFC的两个相邻Box的`margin`会发生重叠；
3. 每一个盒子的左外边距应该和包含块的左边缘相接触。即使存在浮动也是如此，除非子盒子形成了一个新的BFC。
4. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然；
5. 计算BFC的高度时，考虑BFC所包含的所有元素，连浮动元素也参与计算；
6. BFC的区域不会与`float box`重叠；

## 元素隐藏方法总结

1. 如果希望元素不可见、不占据空间、资源会加载、DOM 可访问：`display: none`；
2. 如果希望元素不可见、不能点击、但占据空间、资源会加载，可以使用：`visibility: hidden`；
3. 如果希望元素不可见、不占据空间、显隐时可以又`transition`淡入淡出效果

```
div{
  position: absolute;
  visibility: hidden;
  opacity: 0;
  transition: opacity .5s linear;
  background: cyan;
}
div.active{
  visibility: visible;
  opacity: 1;
}
```

**这里使用`visibility: hidden`而不是`display: none`，是因为`display: none`会影响css3的`transition`过渡效果。但是`display: none`并不会影响css`animation`动画的效果。**

1. 如果希望元素不可见、可以点击、占据空间，可以使用：`opacity: 0`；
2. 如果希望元素不可见、可以点击、不占据空间，可以使用：`opacity: 0; position: abolute;`；
3. 如果希望元素不可见、不能点击、占据空间，可以使用：`position: relative; z-index: -1;`；
4. 如果希望元素不可见、不能点击、不占据空间，可以使用：`position: absolute ; z-index: -1;`；

## display: none与visibility: hidden的区别

1. `display: none`的元素不占据任何空间，`visibility: hidden`的元素空间保留；
2. `display: none`会影响css3的`transition`过渡效果，`visibility: hidden`不会；
3. `display: none`隐藏产生重绘 ( repaint ) 和回流 ( relfow )，`visibility: hidden`只会触发重绘；（回流重绘知识点参考：真正理解重绘和回流）
4. 株连性：`display: none`的节点和子孙节点元素全都不可见，`visibility: hidden`的节点的子孙节点元素可以设置 `visibility: visible`显示。`visibility: hidden`属性值具有继承性，所以子孙元素默认继承了`hidden`而隐藏，但是当子孙元素重置为`visibility: visible`就不会被隐藏。