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

## line-height & vertical-align

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

