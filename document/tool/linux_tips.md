# linux使用相关

## ssh

ssh 服务端安装和配置:

1. 更新源列表:

```bash
sudo apt-get update
```

2. 安装服务器:

```bash
sudo apt-get install openssh-server
```

或者直接服务端客户端一起安装:

```bash
sudo apt-get install ssh
```

3. ssh配置

通过修改配置文件/etc/ssh/sshd_config，可以改ssh登录端口和禁止root登录:

```bash
sudo gedit /etc/ssh/sshd_config
```

把配置文件中的"PermitRootLogin without-password"加一个"#"号,把它注释掉-->再增加一句"PermitRootLogin yes"-->保存，修改成功。（"PermitRootLogin yes"的含义是允许root用户登录）

重启ssh服务

```bash
sudo service ssh restart
```

4. 其他命令

```bash
#停止服务
sudo service ssh stop

#启动服务
sudo service ssh start

#重启服务
sudo service ssh restart

#查看状态
sudo service ssh status
```

**连接至ssh**

命令: ``` ssh [-llogin_name] [-p port] [user@]hostname ```

直接连接:

```
ssh bbb@127.0.0.1
```

指定端口号:

```
ssh -p 8080 aaa@127.0.0.1
```