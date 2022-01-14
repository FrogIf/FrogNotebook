# 跨域

## 同源策略

同源策略是浏览器最核心和最基本的安全功能, 所谓同源, 是指两个页面觉有相同的协议(protocol), 主机(host), 端口号(port). 同源策略就是确保一个应用中的资源只能本应用的资源访问, 防止被其他脚本等意外访问. 如果缺少了同源策略, 浏览器很容易受到XSS, CSRF等攻击.

非同源的限制:

* 无法读取非同源网页的cookie, localStorage, indexedDB
* 无法接触非同源网页的DOM
* 无法向非同源地址发送AJAX请求

## 跨域

当请求的url的协议, 域名, 端口三者之间任意一个与当前页面的url不同, 即为跨域.

当前页面url|被请求页面url|是否跨域|原因
-|-|-|-
http://www.test.com/|http://www.test.com/index.html|否|同源
http://www.test.com/|https://www.test.com/index.html|是|协议不同
http://www.test.com/|http://www.baidu.com/|是|主域名不同
http://www.test.com/|http://blog.test.com/|是|子域名不同
http://www.test.com:8080/|http://www.test.com:7001/|是|端口号不同

## 解决方案 -- JSONP

浏览器对非同源的资源, 会作限制, 但是, 对于页面上调用js文件, 则没有这种限制. jsonp就是利用了这一点, 通过网页上添加一个```<script>```元素, 向服务器请求json数据, 服务器收到请求后, 将数据放在一个指定名字的回调函数的参数位置传回来.

原生实现:

客户端:

```javascript
<script src="http://test.com/data?callback=dosomething"></script>
<script type="text/javascript">
function dosomething(result){
    console.log(result);
}
</script>
```

服务端:

```java
public String jsonpReceiver(String callback){
    return callback + "({\"name\":\"aaa\"})";
}
```

## 解决方案 -- CORS

CORS是Cross-Origin Resource Sharing的缩写. 它是W3C标准, 属于跨源AJAX请求的根本解决方案. CORS有很多复杂的内容, 这里简单介绍一下:

CORS需要浏览器和服务器都支持. 整个CORS通信过程是浏览器自动完成的, 不需要用户参与. 实现CORS通信的关键是服务器, 只要服务器实现了CORS接口, 就可以跨源通信.

浏览器将CORS请求分为两类: 简单请求和非简单请求

只要同时满足以下两大条件, 就属于简单请求:

1. 请求方式是以下三种:
   * HEAD
   * GET
   * POST
2. HTTP头信息不超出以下几种字段
   * Accept
   * Accept-Language
   * Content-Language
   * Last-Event-ID
   * Content-Type: 只限于三个值: application/x-www-form-urlencoded, multipart/form-data, text/plain

以上条件只要有一条不满足, 就属于非简单请求. 浏览器对这两种请求的处理方式是不一样的.

**简单请求**

浏览器直接发出CORS请求, 具体来说, 就是在头信息中, 增加一个Origin字段. 例如:

```
GET /test HTTP/1.1
Origin: http://aaa.com
...
```

这个Origin字段用来说明本次请求来自哪个源(协议+域名+端口). 服务器根据这个值, 决定是否同意这次请求. 如果Origin字段指定的源不在许可范围内, 服务器会返回一个正常的http回应. 浏览器发现这个回应的头信息中没有包含```Access-Control-Allow-Origin```, 就知道出错了, 从而抛出错误. 如果Origin指定的域名在许可范围内, 服务器返回的响应, 会多出几个头信息字段:

```
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Credentials: true
Access-Control-Expose-Headers: FooBar
```

这里具体解释一下:

* Access-Control-Allow-Origin: 该字段是必须的, 它的值要么是请求时Origin字段的值, 要么是一个```*```, 表示接受任意域名的请求.
* Access-Control-Allow-Credentials: 该字段可选. 值为布尔值. 表示是否允许发送Cookie, 默认情况下, Cookie不包括在CORS请求中. 设为true, 即表示服务器明确许可, Cookie可以包含在请求中, 一起发给服务器. 这个值也只能设置为true, 如果服务器不需要浏览器发送Cookie, 删除该字段即可.
* Access-Control-Expose-Headers: 该字段可选, CORS请求时, XMLHttpRequest对象的```getResponseHeader()```方法只能拿到6个基本字段: Cache-Control, Content-Language, Content-Type, Expires, Last_Modified, Pragma. 如果想拿到其他字段, 就必须在Access-Control-Expose-Headers里面指定.

withCredentials属性: 上面说到, CORS请求默认不发送Cookie和HTTP认证信息, 如果要把Cookie发送到服务器, 方面需要服务器同意, 指定```Access-Control-Allow-Credentials:true```, 另一方面, 开发者必须在Ajax请求中打开withCredentials属性. 否则, 即使服务器同意发送Cookie, 浏览器也不会发送; 或者服务器要求设置Cookie, 浏览器也不会处理.

```javascript
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```

另外, 如果要发送Cookie, Access-Control-Allow-Origin就不能设置为星号, 必须明确指定与请求网页一直的域名. 同时, Cookie依然遵循同源策略, 只有服务器域名设置的Cookie才会上传, 其他域名的Cookie并不会上传, 且原网页代码中的document.cookie也无法读取服务器域名下的Cookie.

**非简单请求**

非简单请求时那种对服务器有特殊要求的请求, 比如请求方法是PUT或DELETE, 或者Content-Type字段类型是application/json. 对于非简单请求, 会在正式通信之前, 增加一次HTTP请求, 称为预检请求(preflight)

浏览器先询问服务器, 当前网页所在的域名是否在服务器许可名单之中, 以及可以使用哪些HTTP动词和头信息字段. 只有得到肯定答复, 浏览器才会发出正式的ajax请求, 否则就报错.

下面是一段浏览器的javascript脚本:

```javascript
var url = 'http://api.alice.com/cors';
var xhr = new XMLHttpRequest();
xhr.open('PUT', url, true);
xhr.setRequestHeader('X-Custom-Header', 'value');
xhr.send();
```

这段代码中, HTTP请求的方法是PUT, 并且发送一个自定义头信息```X-Custom-Header```, 浏览器发现这是一个非简单请求, 就会自动发送一个预检请求, 向服务器确认可以这样请求. 下面是这个预检请求的http头信息:

```
OPTIONS /cors HTTP/1.1
Origin: http://api.bob.com
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: X-Custom-Header
Host: api.alice.com
Accept-Language: en-US
Connection: keep-alive
User-Agent: Mozilla/5.0...
```

预检请求使用```OPTIONS```, 表示这个请求是用来询问的. 头信息里面, 关键字段是Origin, 表示请求来自哪个源. 除了Origin字段, 预检请求的头信息还包含两个特殊字段:

* Access-Control-Request-Method: 字段是必须的, 用来列出浏览器的CORS请求会用到哪些http方法.
* Access-Control-Request-Headers: 该字段是一个逗号分隔的字符串, 指定浏览器CORS请求将会额外发送的头信息字段.

预检请求的回应:

服务端在收到预检请求后, 检查了```Origin```, ```Access-Control-Request-Method```和```Access-Control-Request-Headers```字段之后, 确认允许跨源请求, 就可以做出回应了.

```
HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache/2.0.61 (Unix)
Access-Control-Allow-Origin: http://api.bob.com
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Content-Type: text/html; charset=utf-8
Content-Encoding: gzip
Content-Length: 0
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: text/plain
```

CORS相关字段如下:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT
Access-Control-Allow-Headers: X-Custom-Header
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 1728000
```

* Access-Control-Allow-Methods: 必需, 表明服务器支持的所有跨域请求的方法. 注意返回的是所有支持的方法, 而不单是浏览器请求的那个方法. 这是为了避免多次预检请求
* Access-Control-Allow-Headers: 必需, 表明服务端支持的所有头信息字段, 不限于浏览器在预检中请求的字段.
* Access-Control-Max-Age: 可选, 用来指定本次预检的有效期, 单位为秒. 即允许本次预检缓存的时间, 在此期间, 不用发送另一条预检请求.

一旦预检通过, 以后每次浏览器正常的CORS请求, 就都跟简单请求一样, 会有一个Origin头信息字段. 服务器的回应, 也都会有一个```Access-Control-Allow-Origin```头信息字段.


## 其他方案

特定场景下的一些方案, 并不常用

**方案一**

设置document.domain解决无法读取非同源网页的Cookie问题. 因为浏览器是通过document.domain属性来建厂两个页面是否同源. 因此, 只要设置相同的document.domain, 两个页面就可以共享Cookie. 此方案仅限主域相同, 子域不同的跨域应用场景.

```javascript
document.domain = 'test.com';
```

**方案二**

跨文档通信API: window.postMessage(). 调用postMessage方法实现父窗口向子窗口发送消息(子窗口同样可以向父窗口发送消息). 它可以用于解决以下方面的问题:

* 页面和其打开的新窗口的数据传输;
* 多窗口之间的消息传递
* 页面与嵌套iframe消息传递
* 上面三个场景的跨域数据传递

```javascript
var openWindow = window.open('http://xxxxxxx', 'title');

// 父窗口向子窗口发消息(第一个参数代表发送的内容, 第二个参数代表接收消息的窗口的url)
openWindow.postMessage('Nice to meet you!', 'http://xxxxxxx');
```

调用message事件, 监听对方发送的消息

```
window.addEventListener('message', function(e){
    console.log(e.source);  // 发送消息的窗口
    console.log(e.origin);  // 发送消息的网址
    console.log(e.data);    // 发送的消息
}, false);
```

## 参考文献

* [什么是跨域？跨域解决方法](https://blog.csdn.net/qq_38128179/article/details/84956552)
* [跨域资源共享 CORS 详解](https://www.ruanyifeng.com/blog/2016/04/cors.html)