# Zookeeper

## 服务的启动与停止

找到 %zkHome%\bin 目录, 通过该目录下的 zkServer.sh
* 启动 zkServer.sh start
* 停止 zkServer.sh stop
* 重启 zkServer.sh restart
* 查看ZK服务状态 zkServer.sh status

## zk客户端命令

ZooKeeper命令行工具类似于Linux的shell环境，不过功能肯定不及shell啦，但 是使用它我们可以简单的对ZooKeeper进行访问，数据创建，数据修改等操作.  使用 zkCli.sh -server 127.0.0.1:2181 连接到 ZooKeeper 服务，连接成功后，系统会输出 ZooKeeper 的相关环境以及配置信息。命令行工具的一些简单操作如下:

* 显示根目录下、文件： ls / 使用 ls 命令来查看当前 ZooKeeper 中所包含的内容
* 显示根目录下、文件： ls2 / 查看当前节点数据并能看到更新次数等数据
* 创建文件，并设置初始内容： create /zk "test" 创建一个新的 znode节点" zk "以及与它关联的字符串
* 获取文件内容： get /zk 确认 znode 是否包含我们所创建的字符串
* 修改文件内容： set /zk "zkbak" 对 zk 所关联的字符串进行设置
* 删除文件： delete /zk 将刚才创建的 znode 删除
* 退出客户端： quit
* 帮助命令： help

登录账号:
```
addauth digest user:password
```

## 内置的四字命令(方便且实用)

ZooKeeper 支持某些特定的四字命令字母与其的交互。它们大多是查询命令，用来获取 ZooKeeper 服务的当前状态及相关信息。用户在客户端可以通过 telnet 或 nc 向 ZooKeeper 提交相应的命令。nc的做法为 nc localhost 2181 + 回车 ，然后输入以下命令中的一个，则服务器会返回相应的信息

* stat 来查看哪个节点被选择作为follower或者leader
* ruok 测试是否启动了该Server，若回复imok表示已经启动
* dump ,列出未经处理的会话和临时节点
* kill ,关掉server
* conf ,输出相关服务配置的详细信息
* cons ,列出所有连接到服务器的客户端的完全的连接 / 会话的详细信息
* envi ,输出关于服务环境的详细信息（区别于 conf 命令）
* reqs ,列出未经处理的请求
* wchs ,列出服务器 watch 的详细信息
* wchc ,通过 session 列出服务器 watch 的详细信息，它的输出是一个与 watch 相关的会话的列表
* wchp ,通过路径列出服务器 watch 的详细信息。它输出一个与 session 相关的路径
* mntr ,输出一些ZK运行时信息，通过对这些返回结果的解析，可以达到监控的效果
* srst ,重置服务器的统计信息（功能性命令，慎用）
* crst ,重置所有连接的统计信息（功能性命令，慎用）
