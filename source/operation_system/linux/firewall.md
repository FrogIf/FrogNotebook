---
title: linux防火墙
author: frogif
date: 2022-10-31
---
# linux防火墙

## CentOS7

* 查看防火墙版本: ```firewall-cmd --version```
* 查看防火墙状态: ```firewall-cmd --state```
* 查看防火墙服务状态: ```systemctl status firewalld```
* 查看防火墙全部信息: ```firewall-cmd --list-all```
* 查看防火墙已开放端口: ```firewall-cmd --list-port```
* 查看防火墙已开通服务: ```firewall-cmd --list-service```
* 开放端口: ```firewall-cmd --add-port=8094/tcp --permanent```
* 重载防火墙: ```firewall-cmd --reload```
* 移除端口: ```firewall-cmd --remove-port=80/tcp --permanent```

## CentOS6

下面命令是针对centOS6的:

1. 检查防火墙状态

```
service iptables status
```

2. 启动防火墙

```
1. 即时生效, 重启后失效:
service iptables start

2. 永久生效
chkconfig iptables on
```


3. 关闭防火墙

```
1. 即时生效, 重启后失效
service iptables stop

2. 永久生效
chkconfig iptables off
```

4. 重启防火墙

```
service iptables restart
```

5. 查看防火墙开放端口

```
[root@localhost ~]# more /etc/sysconfig/iptables
# Firewall configuration written by system-config-firewall
# Manual customization of this file is not recommended.
*filter
:INPUT ACCEPT [0:0]
:FORWARD ACCEPT [0:0]
:OUTPUT ACCEPT [0:0]
-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
-A INPUT -p icmp -j ACCEPT
-A INPUT -i lo -j ACCEPT
-A INPUT -m state --state NEW -m tcp -p tcp --dport 22 -j ACCEPT
-A INPUT -j REJECT --reject-with icmp-host-prohibited
-A FORWARD -j REJECT --reject-with icmp-host-prohibited
COMMIT
```

> 可以看出图中只开放了22端口

6. 开放指定的端口

```
[root@localhost ~]# vi /etc/sysconfig/iptables
# Firewall configuration written by system-config-firewall
# Manual customization of this file is not recommended.
*filter
:INPUT ACCEPT [0:0]
:FORWARD ACCEPT [0:0]
:OUTPUT ACCEPT [0:0]
-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
-A INPUT -p icmp -j ACCEPT
-A INPUT -i lo -j ACCEPT
-A INPUT -m state --state NEW -m tcp -p tcp --dport 22 -j ACCEPT
-A INPUT -m state --state NEW -m tcp -p tcp --dport 3306 -j ACCEPT
-A INPUT -j REJECT --reject-with icmp-host-prohibited
-A FORWARD -j REJECT --reject-with icmp-host-prohibited
COMMIT

[root@localhost ~]# service iptables restart
iptables：将链设置为政策 ACCEPT：filter                    [确定]
iptables：清除防火墙规则：                                 [确定]
iptables：正在卸载模块：                                   [确定]
iptables：应用防火墙规则：                                 [确定]
```