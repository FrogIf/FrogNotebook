---
title: linux防火墙
author: frogif
date: 2022-10-31
---

# 远程断点调试

## SpringBoot&IDEA

1. 启动参数中添加: ```-Xdebug -Xrunjdwp:transport=dt_socket,address=13345,server=y,suspend=n```, 例如:

```
nohup java -Xdebug -Xrunjdwp:transport=dt_socket,address=13345,server=y,suspend=n -jar AppServerMock.jar --server.port=13341 >/dev/null 2>&1 &
```

2. 确定linux系统防火墙已经打对应的端口(tcp)

```
firewall-cmd --list-all
```

3. 本地IDEA配置

![image](img/remote_debug_idea.png)

4. 启动, 调试, 完成.