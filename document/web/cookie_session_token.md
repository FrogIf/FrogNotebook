# Cookie, Session, Token

## 前置概念

* 认证(Authentication) - 验证当前人的身份, 常见方式有: 用户名密码, 手机号, 电子邮箱, 身份证号等
* 授权(Authorization) - 授予第三方访问用户资源的权限, 常见方式有: session, cookie, token

## Cookie

http是无状态的协议, cookie设计初衷就是为了弥补http协议的这一缺点.

cookie存储在客户端, 一般由服务端发起, 指示用户浏览器保存一份cookie数据在本地, 在下一次向同一个服务端再次发送请求时, 会被携带到服务端.

cookie是不可跨域的, 每个cookie都会绑定单一的域名(包括子域), 无法在别的域名下获取.

服务端, 通过http响应报文头中的"Set-Cookie"设置客户端的cookie, 格式如下:

```
Set-Cookie: name=value[; expires=date][; domain=domain][; path = path][;secure]
```

相关参数解释:

1. name=value: 键值对, 设置cookie的名称
2. domain: 指定cookie所属的域名, 默认是当前域名. 如果cookie的domain设置为taobao.com, 那么item.taobao.com, order.taobao.com都是可以共享的, 但是访问tmall.com就不能共享了.
3. path: 指定cookie在哪个路径下生效, 默认是"/", 如果设置为/abc, 则只有/abc下的路由可以访问到该cookie, 例如: /abc/def
4. expires: 指定cookie的过期时间(GMT时间格式), 到达该时间后, 该cookie就会自动失效
5. max-age: http1.1中定义的, 优先级高于expires字段. 表示cookie有效期, 单位是秒. 如果为正数, 则该cookie在max-age秒后失效, 如果为负数, 该cookie为临时cookie, 关闭浏览器则失效. 如果为0, 表示删除该cookie. 默认为-1
6. HttpOnly: 如果给某个cookie设置了HttpOnly属性, 则无法通过js脚本读写该cookie信息.
7. secure: 该cookie是否仅被安全协议传输, 默认是false, 当secure值为true时, cookie在http中是无效的.

> GMT时间即格林尼治时间(Greenwich Mean Time,GMT), 北京时间为GMT+8, 即东8区

## Session

用户打开浏览器, 访问一个网站, 进行多个与服务端的交互操作, 然后关闭服务器, 整个过程称为一个会话(session).

session的特点:

* session是另一种记录服务器和客户端会话状态的机制;
* session存储在服务端;
* session一般基于cookie实现, session中包含敏感信息存储在服务器端, 通常将sessionId存储在客户端的cookie中, 客户端每次请求携带sessionId即可识别用户.

session工作流程:

1. 用户第一次请求, 提交用户名密码等信息进行登录认证, 服务器根据用户提交的信息进行鉴权, 鉴权成功后创建session对象, 并将sessionId塞入cookie中, 浏览器收到响应信息, 将cookie存入本地;
2. 用户第二次请求, 浏览器自动将当前域名下的cookie信息发送给服务端, 服务端解析cookie, 获取到sessionId后, 再查找对应的session对象, 如果session对象存在, 说明用户已经登录, 继续下一步操作.

> sessionId是cookie和session之间的一道桥梁.
> 如果客户端禁用了cookie, 还可以通过url重写等方法传递sessionId.

cookie和session区别:

* 存储方式: cookie数据存放在客户端浏览器上, session数据放在服务端上;
* 安全性: cookie是本地存储, 不是很安全;
* 存储大小: 很多浏览器限制单个cookie大小不能超过4k, 一个站点最多保存20个cookie, session则没有限制;
* 生存周期: cookie可设置为长时间保存, session一般失效时间较短, 一般客户端关闭, session就会失效.

## Token

token是验证用户身份的凭证, 我们通常叫它:令牌. 最简单的token组成: uid(用户唯一身份标识)+time(当前时间戳)+sign(签名, 以哈希算法压缩成一定长度的十六进制字符串)

token的特点:

* 无状态, 可扩展;
* 支持移动端设备;
* 支持跨程序调用;
* 安全.

token工作流程:

1. 客户端使用用户名密码或者其他方式进行登录请求;
2. 服务端收到请求后, 进行权鉴, 成功后, 会生成一个token, 并发送给客户端, 客户端收到token以后, 把它存储起来, 例如放在cookie或者localStorage里;
3. 客户端下一次向服务端请求资源的时候, 需要带上存储的token;
4. 服务端收到请求后, 验证客户端请求里的token, 如果验证成功, 就向客户端返回请求的数据.

需要注意的是:

* 客户端请求时, 可以将token放到http的header里;
* 基于token的用户认证是一种服务端无状态的认证方式, 服务端不用存放token数据;
* 用解析token的计算时间换取session的存储空间, 从而减轻服务器的压力, 减少频繁的查询数据库

token的方式, 解决了session在集群环境中, 需要进行session共享的问题.

**标准化的token实现方式--JWT**

jwt即: json web token(JWT), 是为了在网络应用环境间传递声明而执行的一种基于json的开放标准. jwt的声明一般被用来在身份提供者和服务提供者间传递被认证的用户身份信息, 以便于从资源服务器获取资源, 也可以增加一些额外的其他业务逻辑所必须的声明信息.

jwt由三部分组成:

* header -- 头部: 传给你在两部分信息: 声明类型, 这里是jwt; 声明加密算法, 通常直接使用HMACSHA256;
* payload -- 载荷段: 存放有效数据. 主要包含三部分: 标准中注册的声明; 公共的声明; 私有的声明.
* signature -- 签证: 又由三部分组成: encrypt(base64(header) + base64(payload), secret).

需要注意的:

* secret私钥是存储在服务端的, 并且不能对外暴露;
* jwt实现的token中不能存放敏感信息, 因为这个token是可以解密的; jwt的目的是认证, 不保证数据不泄露;
* 如何认证, signature部分在服务端使用secret解密后, 与token中的header和payload进行对比, 如果一致, 则认证成功. 可想而知, 如果私钥泄露出去, 客户端就可以自行签发生成token, 然后通过服务端的认证.


## 参考文献

* [熬夜彻底搞懂Cookie Session Token JWT](https://mp.weixin.qq.com/s/yuGkpO32QUbwhzgB55VUng)
* [JWT(JSON Web Token)简介](https://www.cnblogs.com/cxxtreasure/p/14173315.html)