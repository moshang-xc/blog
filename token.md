## 一、Token？

上一篇讲到登录验证策略`Token`，先回顾一下`Token`相关的内容，简单的流程如下：

- 客户端使用用户名跟密码请求登录；
- 服务端收到请求，去验证用户名与密码；
- 验证成功后，服务端会签发一个 Token，再把这个 Token 发送给客户端；
- 客户端收到 Token 以后可以把它存储起来，比如放在 Cookie 里或者 Local Storage 里；
- 客户端每次向服务端请求资源的时候需要带着服务端签发的 Token；
- 服务端收到请求，然后去验证客户端请求里面带着的 Token，如果验证成功，就向客户端返回请求的数据；

那么Token在客户端怎么存储，存储在哪比较好？

## 二、Token存放位置

Token在用户登录成功之后会返回给客户端，客户端主要以下几种存储方式：

1. 存储在localStorage中，每次调用接口的时候都把它当成一个字段传给后台
2. 存储在cookie中，让它自动发送，不过缺点就是不能跨域
3. 拿到之后存储在localStorage中，每次调用接口的时候放在HTTP请求头的`Authorization`字段里面。

token 在客户端一般存放于localStorage、cookie、或sessionStorage中。

## 三、Token 放在 cookie、localStorage、sessionStorage中的不同点？

### Cookie

cookie是大家最熟悉的前端存储方案。大家对它的一些特性很熟悉，比如同源限制，自动携带等等，限制大小4KB。那这里就主要说它的几个安全方面的配置：

- http-only：这个参数限定只能通过请求自动携带的方式获取cookie，没办法通过脚本去获取，这样一来就可以有效避免cookie被xss攻击，及时你的页面被不小心注入脚本，也无法获取你的cookie。
- same-site：这个属性规定，只有请求是从同源页面发起才能获取cookie。这个主要是用来防御CSRF的，因为如果只要是同源请求就可以自由携带cookie的话，很容易就遭受CSRF攻击，比如在token失效之前打开了攻击者页面，该页面自动向后台发送请求，就会携带cookie。
- secure：这个参数可以让cookie只会被https请求携带，https应该是是目前最好用的几种防止中间人攻击的方式之一，可以有效防止你的token被窃听。

### localStorage、sessionStorage、IndexDB

SessionStorage：sessionStorage 特别的一点在于，即便是相同域名下的两个页面，只要它们不在同一个浏览器窗口中打开，那么它们的 sessionStorage 内容便无法共享；

LocalStorage：在同源的所有标签页和窗口之间共享数据，保存的数据长期存在，下一次访问该网站的时候，网页可以直接读取以前保存的数据。

IndexDB：类似LocalStorage，只不过容量大很多

### 比较

SessionStorage安全性较高，能比较好防御CSRF，但是对XSS无用，且局限较大。

LocalStorage和IndexDB受同源保护，但是一旦被注入脚本也很危险。

Cookie最方便，但是默认状态下最不安全，需要将http-only，same-site，secure等开启才能有较高的安全性。

### Cookie 比 localStorage 更可取

尽管 cookie 仍然存在一些漏洞，但与`localStorage`任何可能的情况相比，它更可取。为什么？

- `localStorage`和`cookie`都容易受到XSS攻击，但是当您使用`httpOnly` `cookie`时，攻击者更难进行攻击。
- Cookie 容易受到 CSRF 攻击，但可以使用`sameSite`标志和[反CSRF令牌](https://www.sangniao.com/link/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.Imh0dHBzOlwvXC9vd2FzcC5vcmdcL3d3dy1jb21tdW5pdHlcL0FudGlfQ1JTRl9Ub2tlbnNfQVNQLU5FVCI.mss4KC8OFhsmMLAVfvqINOa7jVdSZRMUqVvaq8DBBGc)来缓解。

这也与OWASP社区的建议一致：不要将会话标识符存储在本地存储中，因为JavaScript始终可以访问数据。Cookies可以使用httpOnly标志减轻这种风险。

> XSS：跨站脚本（Cross-site scripting，通常简称为XSS）是一种网站应用程序的安全漏洞攻击，是代码注入的一种。它允许恶意用户将代码注入到网页上，其他用户在观看网页时就会受到影响。**这类攻击通常包含了HTML以及用户端脚本语言**。
>
> CSRF: 跨站请求伪造（英语：Cross-site request forgery），也被称为 one-click attack 或者 session riding，通常缩写为 CSRF 或者 XSRF， 是一种挟制用户在当前已登录的Web应用程序上**执行非本意的操作的攻击方法**。

## 四、如何使用 cookie 来保存Token

回顾一下，存储令牌的不同方法：

- 将访问令牌存储在`localStorage` ：易于使用XSS。
- 将访问令牌存储在`httpOnly` cookie中：容易出现CSRF，但可以缓解，对于XSS更好。
- 将刷新令牌存储在`httpOnly、same-site` cookie中：远离CSRF，对于XSS更好。

我们将讨论**选项3的**工作原理，因为它在3个选项中提供了最大的好处。

### 如何工作

1. **在用户进行身份验证时，返回访问令牌和刷新令牌。**

用户进行身份验证后，授权服务器将返回`access_token`和`refresh_token` 。 `access_token`将包含在Response正文中， `refresh_token`将包含在cookie中。

**2. 将访问令牌存储在内存中**

将令牌存储在内存中意味着您将此访问令牌放在前端站点的变量中，这意味着如果用户切换标签或刷新站点，则访问令牌将消失。 这就是为什么我们有刷新令牌。

**3. 使用刷新令牌续订访问令牌**

当访问令牌消失或过期时，发送`refresh_token`请求，并且步骤1中存储在cookie中的刷新令牌将包含在请求中。 您现在将获得一个新的访问令牌，然后可以将其用于您的API请求。