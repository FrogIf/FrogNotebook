# Windows下的Tomcat配置和部署

## Overview

需要在同一台机器上部署多个tomcat, 并把这些tomcat都做成Service服务, 并开机自启

## 修改service.bat

1. 设置参数JAVA\_HOME为jdk所在目录(根目录)
2. 设置CATALINA\_HOME, 这个参数是tomcat所在目录
3. 设置PR\_DISPLAYNAME和SERVICE\_NAME, 这个是tomcat服务在windows上注册服务之后的服务名
4. 设置JvmOptions, 添加内存配置以及字符编码配置
5. 设置JvmMs, JvmMx, 这两个是初始化内存的大小和最大内存大小

```bat
SET JAVA_HOME=C:\Program Files\Java\jdk1.8.0_172
SET CATALINA_HOME=E:\Server1
SET PR_DISPLAYNAME=Server1

SET SERVICE_NAME=Server1

--JvmOptions "........;-XX:PermSize=64M;-XX:MaxPermSize=1024m;-XX:ReservedCodeCacheSize=48m;-Dfile.encoding=utf-8" ^
--JvmMs 128 ^
--JvmMx 256
```

## 修改startup.bat和shutdown.bat配置

需要修改JAVA\_HOME, CATALINA\_HOME和上面保持一致

## 配置server.xml

修改端口号之类的

## 注册服务

上面的配置完成之后, 在windows命令行输入service.bat install, 注册service服务

> 删除服务是: service.bat remove

上面的内存配置可以在tomcat7w.exe中看到