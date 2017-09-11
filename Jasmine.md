# jasmine API
`describe()` 测试集

```
/*@param
*   string     用于描述测试组的名称
*   function   是测试组的主体函数
*/

describe("测试集描述", function () {
    // 测试集主体函数
})
```

`it()` 测试体，包含在`describe()`，传入两个参数

```
/*@param
*    string     用于描述测试体的名称
*    function   是测试体的主体函数
*/
describe("测试集描述", function () {
    it("测试体描述",function(){
        // 测试体主体函数
    })
})
```

四个全局函数 (和it同级)

- beforeEach() 在describe函数中每个Spec(it)执行之前执行。
- afterEach() 在describe函数中每个Spec(it)数执行之后执行。
- beforeAll() 在describe函数中所有的Spec(it)执行之前执行，但只执行一次，在Sepc之间并不会被执行。
- afterAll() 在describe函数中所有的Spec(it)执行之后执行，但只执行一次，在Sepc之间并不会被执行。

```
describe("测试集描述", function () {
    beforeEach(function(){
        // 每个it执行前执行函数体
    })
})
```

`expect(`) 断言，传递一个参数，接收实际值，后面紧跟着一个`Matchers()`，来进行判断是否通过

```
describe("测试集描述", function () {
    it("测试体描述",function(){
        var a=true;
        expect(a).toEqual(true);
    })
})
```

`Matchers()` 常见的有：

- not 表示对下面断言的否定
- toBe() 判断两个变量是否全等，类似于“===”；
- toNotBe() 与上一个相反，判断两个变量是否不全等，类似于“!==”；
- toEqual() 判断变量是否相等，相当于“==”；
- toThrow() 检验一个函数是否会抛出一个错误。
- toBeDefined() 检查变量或属性是否已声明且赋值（是否不等于undefined）；
- toBeUndefined() 检查变量或属性是否已声明且赋值（是否等于undefined）；
- toBeNull() 判断变量是否为null；
- toBeTruthy() 判断变量如果转换为布尔值，是否为true；
- toBeFalsy() 判断变量如果转换为布尔值，是否为false；
- toBeLessThan() 与数值比较，是否小于；
- toBeGreaterThan() 与数值比较，是否大于；
- toContain() 判断一个数组中是否包含元素（值）。只能用于数组，不能用于对象；
- toBeCloseTo() 数值比较时定义精度，先四舍五入后再比较；
- toMatch() 按正则表达式匹配；
- toNotMatch() 不按正则表达式匹配；

```
describe("测试集描述", function () {
    it("测试体描述",function(){
        var a=true;
        expect(a).not.toEqual(false);
    })
})
```

闲置测试

> 在`describe`和`it`前加一个`x`，变成`xdescribe`,`xit`,就可以闲置该测试，这样运行时就不会自动测试，需要手动开始。

```
xdescribe("测试集描述", function () {
    xit("测试体描述",function(){

    })
})
```

自定义`Matchers`

```
jasmine.addMatchers({
    mySelfMatcher: function () {  //定义断言的名字
        return {
            compare: function (actual, expected) {  //compare是必须的
                return {
                    pass: actual === expected,
                    message: "song is not current playing"  //断言为false时的信息
                }  //要返回一个带pass属性的对象，pass就是需要返回的布尔值
            }
            //negativeCompare: function(actual, expected){ ... }  //自定义not.的用法
        };
    }
});
```

调用

```
...
// actual 为要测试的值，expect期望值
expect(actual).mySelfMatcher(expect);
```

spy
> 能监测任何function的调用和方法参数的调用痕迹,但是不会影响函数真实返回值，需使用2个特殊的Matcher

- toHaveBeenCalled 可以检查function是否被调用过
- toHaveBeenCalledWith 可以检查传入参数是否被作为参数调用过
```
describe("spy", function() {
var foo, bar = null;

beforeEach(function() {
  foo = {
setBar: function(value) {
  bar = value;
}
  };

  spyOn(foo, 'setBar');

  foo.setBar(123); rue
  foo.setBar(456, 'another param');
});

it("跟踪函数调用情况", function() {
  // 上面调用了foo.setBar,所以返回true
  expect(foo.setBar).toHaveBeenCalled();
  // 上面调用了foo.setBar,并且传入参数123，所以返回true
  expect(foo.setBar).toHaveBeenCalledWith(456, 'another param');

  // Spy的调用并不会影响真实的值，所以bar仍然是null。
  expect(bar).toBeNull();
});
});
```

- `and.callThrough` 如果在`spyOn`之后链式调用`and.callThrough`，那么`Spy`除了跟踪所有的函数调用外，并且`Spy`返回的值是函数调用后实际的值。

```
describe("spy", function() {
...
spyOn(foo, 'setBar').and.callThrough();
foo.setBar(123);

it("跟踪函数调用情况", function() {
  // Spy后面添加了and.callThrough()，返回的值是函数调用后实际的值，所以此时bar变为了123，而不是null。
  expect(bar).toEqual(123);
});
});
```

- `and.stub` 在调用`and.callThrough()`后，可以阻止`spy`对实际值的影响，也就是将`and.callThrough()`方法执行以后进行还原
```
describe("spy", function() {
  ...
  it("跟踪函数调用情况", function() {
  spyOn(foo, 'setBar').and.callThrough();
  foo.setBar(123);
  expect(bar).toEqual(123);  // 调用and.callThrough(),影响了bar的值

  bar = null;
  foo.setBar.and.stub();// 调用and.stub()后，之后调用foo.setBar将不会影响bar的值。
  foo.setBar(123);
  expect(bar).toBeNull();// 没有影响bar的值，bar此时为null
  });
});
```
参考文章：
