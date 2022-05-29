---
title: linux
author: frogif
date: 2022-05-29
---
# linux

## 基础知识

本文全文基于centos7.

```#```超级用户, ```$```普通用户.

常用目录:

* ```/``` - 根目录
* ```/root``` - root用户的家目录
* ```/home/<username>``` - 普通用户的家目录
* ```/etc``` - 配置文件目录(类似windows的注册表/环境变量)
* ```/bin``` - 命令目录
* ```/sbin``` - 管理命令目录
* ```/usr/bin```, ```/usr/sbin``` - 系统预装的其他命令

##### 帮助

帮助命令有三个:

* man
  * 基本使用方式: ```man <命令名称>```
  * man命令会有9个章节, 每个章节是不同的场景. 可以通过```man 7 man```得到各个章节的详细解释
  * 通过```man <章节编号> <命令>```获取到详细帮助信息
  * 想要按顺序浏览全部章节, 可以通过```man -a <命令名称>```进行查看
* help
  * ```help <内部命令>```
  * ```<外部命令> --help```
  * shell解释器自己的命令称为内部命令, 其余称为外部命令
  * 如何区分内部命令和外部命令: ```type <命令名称>```
* info
  * ```info <命令名称>```, 比```help```更详细, 是```help```的补充

## 文件管理

概述:

* 文件资源管理
  * ```pwd```: 显示当前目录
  * ```cd```: 切换目录
  * ```ls```: 查看当前目录下的文件
  * ```mkdir```: 新建文件夹
  * ```rm```: 删除文件或文件夹
  * ```cp```: 复制文件或文件夹
  * ```mv```: 移动文件/文件重命名
* 文本读取
  * ```cat```: 文本内容显示到终端
  * ```head```: 查看文件开头(默认显示开头10行)
  * ```tail```: 查看文件结尾
  * ```wc```: 统计文件的内容信息
  * ```more```: 分屏查看(按回车向下滚动)
* 打包与压缩
  * ```tar```: 打包和压缩

##### ls

* ```ls```: 列出当前目录下的文件
* ```ls <路径>```: 列出指定路径下的文件
* ```ls <路径1> <路径2> <路径3>```: 列出多个指定路径下的文件
* ```ls -l```: 长格式显示, 示例如下:

```
[root@10 frogif]# ls -l
总用量 4
-rw-r--r--. 1 root   root   11 5月  28 20:39 aaa
drwxr-xr-x. 2 frogif frogif  6 5月  28 20:26 公共
drwxr-xr-x. 2 frogif frogif  6 5月  28 20:26 模板
drwxr-xr-x. 2 frogif frogif  6 5月  28 20:26 视频
drwxr-xr-x. 2 frogif frogif  6 5月  28 20:26 图片
drwxr-xr-x. 2 frogif frogif  6 5月  28 20:26 文档
drwxr-xr-x. 2 frogif frogif  6 5月  28 20:26 下载
drwxr-xr-x. 2 frogif frogif  6 5月  28 20:26 音乐
drwxr-xr-x. 2 frogif frogif  6 5月  28 20:26 桌面

对内容的一个解释:

* 第1列: ```-```: 普通文件; ```d``` - 目录; 后面的一串字符表示权限.
* 第2列: 表示内部的文件个数, 显然对于文件, 它的文件个数就是1.
* 第3列: 创建人
* 第4列: 创建人所属用户组
* 第5列: 当前文件大小
* 第6列: 文件最后修改时间
* 第7列: 文件名称
```

* ```ls -a```: 显示所有文件, 包括隐藏的
* ```ls -l -r```/```ls -lr```: 按照文件名, 逆向排序显示
* ```ls -l -r -t```/```ls -lrt```: 按照时间, 逆向排序显示
* ```ls -R```: 递归显示, 显示文件夹的子文件夹等
* ```ll```: ```ls -l```的缩写
* ```ll -h```: 文件大小以更友好的方式显示

##### cd

* ```cd <路径>```: 切换至指定目录
* ```cd -```: 回到之前操作的目录
* ```cd ..```: 切换至上级目录

##### mkdir

* ```mkdir <路径>```: 创建指定的文件夹
* ```mkdir <路径1> <路径2> <路径3>```: 创建多个文件夹
* ```mkdir -p <路径>```: 创建多级目录

##### rm

* ```rm <文件>```: 删除文件或者空文件夹
* ```rm -r <目录>```: 递归删除多级目录
* ```rm -rf <目录>```: 递归删除多级目录, 并且没有任何提示

##### cp

* ```cp <源文件> <目标文件(夹)>```: 将源文件复制到目标文件(只能是文件)
* ```cp -r <源文件夹> <目标文件夹>```: 将源文件夹复制到目标文件夹
* ```cp -p <其他操作>```: 复制时保留原有文件信息(最后修改时间, 所属人/组)

##### mv

* ```mv <源文件> <目标文件>```: 移动并重命名
* ```mv -r <文件夹> <目标文件夹>```: 移动文件夹

##### head

* ```head <文件>```: 查看文件开头10行
* ```head -3 <文件>```: 查看文件开头3行(这个数字可以随意指定)

##### tail

* ```tail <文件>```: 查看文件结尾10行
* ```tail -3 <文件>```: 查看文件结尾3行(这个数字可以随意指定)
* ```tail -f <文件>```: 查看文件结尾10行, 当文件不断变化时, 同步更新

##### wc

* ```wc -l <文件>```: 查看文件还有多少行

##### tar

* ```tar cf <包含目录的目标文件> <源文件(夹)>```: 打包文件夹(打包好的目标文件建议后缀```.tar```)
* ```tar czf <包含目录的目标文件> <源文件(夹)>```: 打包并使用gzip压缩(目标文件后缀建议:```.tar.gz```或```tgz```)
* ```tar cjf <包含目录的目标文件> <源文件(夹)>```: 打包并使用bzip2压缩(目标文件后缀建议```.tar.bz2```或```tbz2```), 这个压缩比例比gzip高
* ```tar xf <包含目录的目标文件> <源文件(夹)>```: 解包
* ```tar xzf <包含目录的目标文件> <源文件(夹)>```: 解压缩
* ```tar xjf <包含目录的目标文件> <源文件(夹)>```: 解压缩

> c - 打包; x - 解包; f - 指定操作类型为文件; z - 使用gzip; j - 使用bzip2;

## 文件编辑--vi

多模式编辑:

* 正常模式(Normal-mode)
* 插入模式(Insert-mode)
* 命令模式(Command-mode)
* 可视模式(Visual-mode)

> 线上环境中, 查看巨大文件, 不要使用vim!

> 修改vim全局配置, 全局配置文件在```/etc/vimrc```

##### 正常模式

默认就是正常模式......

* h - 向左移动; l - 向右移动; k - 向上移动; l - 向下移动;
* y命令-复制
  * ```yy```: 按行复制
  * ```3yy```: 从当前向下3行, 都复制(这个3可以随意指定)
  * ```y$```: 复制从光标当前位置到该行末尾
* p命令-粘贴
* d命令-剪切
  * ```dd```: 按行剪切
  * ```d$```: 剪切从光标当前位置到该行末尾
* u命令-撤销
* ctrl + r - 重做
* ```x```: 删除光标所在位置的字符
* ```r```: 替换贯标所在位置的字符(按r之后, 输入新的字符)
* ```11G```: 光标移动到第11行(数字11可以随意指定)
* ```G```: 光标移动到文件最后一行
* ```g```: 光标移动到文件第一行
* ```^```: 光标移动到一行的开头
* ```$```: 光标移动到一行的结尾

##### 插入模式

正常模式-->按```i```进入插入模式......
正常模式-->按```o```进入插入模式, 并在光标当前行下面插入空行......

##### 命令模式

正常模式-->按```:```进入命令模式......

* ```set nu```: 显示行号(只对当前会话生效)
* ```set nonu```: 取消行号显示(只对当前会话生效)
* ```set nohlsearch```: 取消搜索高亮显示
* ```w <文件路径及文件名>```: 保存文件到指定的路径(对于已有文件, 就是另存为)
* ```w```: 保存原有文件
* ```q```: 推出
* ```wq```: 保存并退出
* ```q!```: 不保存退出
* ```!<系统命令>```:  临时执行linux系统命令(中间没有空格)
* ```s/<旧字符>/<新字符>```: 替换(只针对光标所在行)
* ```%s/<旧字符>/<新字符>```: 全文替换(只替换一个)
* ```%s/<旧字符>/<新字符>/g```: 全文替换(替换所有)
* ```<开始行号>,<结束行号>s/<旧字符>/<新字符>```: 指定范围替换

正常模式-->按```/```进行查找

* ```/<需要查找的内容>```: 查找指定的文本(按```n```匹配下一个, 按```N```匹配上一个)

##### 可视模式

正常模式-->按```v```进入字符可视模式......
正常模式-->按```V```进入行可视模式......
正常模式-->按```ctrl + v```进入块可视模式......

## 用户和权限管理

* ```useradd```: 新建用户
* ```userdel```: 删除用户
* ```usermod```: 修改用户
* ```passwd```: 修改用户密码
* ```chage```: 修改用户的生命周期
* ```id <用户名>```: 查看用户基本信息
* ```groupadd```: 增加用户组
* ```groupdel```: 删除用户组
* ```su```: 切换用户
* ```sudo```: 以其他用户身份执行命令/以管理员身份运行
* ```visudo```: 配置sudo可执行范围
* ```chmod```: 修改文件/目录权限
* ```chown```: 更改属主/属组

##### useradd

* ```useradd <用户名>```: 添加指定名称的用户(如果用户已存在, 会提示)
* ```useradd -g <用户组> <用户名>```: 添加用户, 同时指定用户组

useradd都执行了哪些操作?

1. 创建```/home/<username>```文件夹及里边的文件
2. ```/etc/passwd```文件中增加了一行记录
3. ```/etc/shadow```文件中增加了一行记录

> 只有root用户才可以创建用户

##### userdel

* ```userdel <username>```: 删除用户
* ```userdel -r <username>```: 删除用户以及该用户的家目录

##### usermod

* ```usermod -d <新的家目录> <username>```: 修改用户的家目录位置
* ```usermod -g <用户组> <username>```: 修改用户的用户组

##### chage

TODO后期详细讲解

##### su

* ```su - <username>```: 切换至指定的用户, 同时把自己运行的环境变更为新用户的运行环境(会跳转值新用户的家目录)
* ```su <username>```: 切换至指定用户, 不完全切换, 切换之后, 仍停留在当前目录

##### visudo

* ```visudo```: 打开sudo范围配置文件

```
授予某个用户某些权限:
<用户名>  <主机>=<执行的指令>,<执行的指令2> <是否需要密码(默认需要)>

授予某个用户组某些权限:
%<用户组>  <主机>=<执行的指令>,<执行的指令2> <是否需要密码(默认需要)>

示例:
frogif localhost=shutdown -c
```

> 上面输入的密码是当前用户的密码,而不是目标用户的密码

##### 用户和用户组的配置文件

* ```/etc/passwd```文件
```
uuu:x:1001:1003:这里是备注:/home/uuu:/bin/bash

uuu - 用户名
x - 表示是否需要密码验证, 如果删除x, 则不需要密码验证
1001 - 用户的uid, 将这个值改为0, 这个用户就变成了root用户
1003 - 用户的gid
这里是备注 - 备注
/home/uuu - 该用户的家目录
/bin/bash - 该用户登录后使用的命令解释器(将这里改为/sbin/nologin, 则可以使这个用户不能登录)
```

* ```/etc/shadow```文件 - 保存用户密码相关信息

```
uuu:$6$LiTy2.GP$CAkNdqlfx07fgUh8twKpC3aSpdJJMEcEOLCzPccj2K4OjyOSVQGqZ6.SZNyXQ5cr0rCCkLqUlvtDypRH.omtL0:19140:0:99999:7:::

第一个 - 用户名
第二个 - 用户加密后的密码
```

* ```/etc/group```文件 - 用户组相关配置

```
mail:x:12:postfix

mail - 用户组名称
x - 是否需要密码
12 - 组id
postfix - 其他组设置, 这里postfix是用户名, 也就是说postfix用户属于它设置的组以外, 还属于mail这个组
```

##### 文件权限

一条文件的记录, 信息如下:

```
-rw-------. 1 frogxxx groupxx 1.6K 5月  29 00:35 anaconda-ks.cfg
```

```-rw-------```描述了一个文件的权限信息. 其中第一位是文件类型(这里是普通文件), 从第二位开始, 每3位一组, 共3组, 代表三种不同的权限. 

* 第一组三个字符表示文件的所属用户(即frogxxx)对文件的权限;
* 第二组三个字符表示文件的所属用户组(即groupxx)对文件的权限;
* 第三组三个字符表示其它人对文件的权限.

文件类型:

* ```-``` - 普通文件
* ```d``` - 目录文件
* ```b``` - 块特殊文件(一个移动硬盘之类的)
* ```c``` - 字符特殊文件(终端)
* ```l``` - 符号链接(类似于windows快捷方式)
* ```f``` - 命名管道
* ```s``` - 套接字文件

对于普通文件, 权限结构为: ```rwx```, r - 读权限(4); w - 写权限(2); x - 执行权限(1).
对于目录文件, x - 进入目录; rx - 显示目录内的文件名; wx - 修改目录内的文件名.

> root用户不受限制, 不管权限是如何指定的.

* ```chown <username> <文件名>```: 修改文件的属主
* ```chown :<groupname> <文件名>```: 修改文件的属组
* ```chmod u+x <文件名>```: 修改文件的权限
  * u - 属主权限; g - 属组权限; o - 其他权限; a - 前面三个所有
  * + - 增加权限; - - 减少权限; = - 设置权限;
  * r/w/x
* ```chmod 777 <文件名>```: 修改文件的权限(数字权限方式)

> 如果属组和属主的权限有冲突, 那么以属主为准. 场景: user1属于group1, group1组内的用户对一个文件有写权限, 但是user1对文件没有写权限, 那么user1就没有写权限

特殊权限

* SUID - 用于二进制可执行文件, 执行命令时取得文件属主权限(```rws```)(```chmod 4xxx```)
* SGID - 用于目录, 在该目录先创建新的文件和目录, 权限自动更改为该目录的属组(常用于文件共享)
* SBIT - 用于目录, 该目录下新建的文件和目录, 仅root和自己可以删除(```rwt```)(```chmod1xxx```)


## 网络管理

具体分为以下:

* 网络状态查看
* 网络配置
* 路由命令
* 网络故障排除
* 网络服务管理
* 常用网络配置文件

##### 网络状态查看

下面这些命令都属于net-tools工具包.

* ```ifconfig```: 查看网络状态
```
[root@10 frogif]# ifconfig
enp0s3: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 10.0.2.15  netmask 255.255.255.0  broadcast 10.0.2.255
        inet6 fe80::a701:a03a:d08f:3b15  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:fa:ca:d0  txqueuelen 1000  (Ethernet)
        RX packets 5687  bytes 448182 (437.6 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 3095  bytes 558907 (545.8 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536
        inet 127.0.0.1  netmask 255.0.0.0
        inet6 ::1  prefixlen 128  scopeid 0x10<host>
        loop  txqueuelen 1000  (Local Loopback)
        RX packets 84  bytes 7060 (6.8 KiB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 84  bytes 7060 (6.8 KiB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0

virbr0: flags=4099<UP,BROADCAST,MULTICAST>  mtu 1500
        inet 192.168.122.1  netmask 255.255.255.0  broadcast 192.168.122.255
        ether 52:54:00:f3:4a:05  txqueuelen 1000  (Ethernet)
        RX packets 0  bytes 0 (0.0 B)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 0  bytes 0 (0.0 B)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
```

> 普通用户, 需要执行```/sbin/ifconfig```.
> inet网卡的ip地址
> ether网卡的mac地址
> lo是本地的环回, ip永远是127.0.0.1

在centos7以前, 第一块网卡的名字, 又称"网络接口", 一般叫```eth0```. centos7开始, 采用如下规则:

名称|解释
-|-
eno1|板载网卡
ens33|PCI-E网卡
enp0s3|无法获取物理信息的PCI-E网卡
eth0|以上都不匹配

但是这个名字不太方便, 如果是多个系统的集群, 如果网卡名字不同, 则无法进行批量操作. 这时就需要接口命名修改:

```
1. 编辑/etc/default/grub文件, 增加biosdevname=0  net.ifnames=0
示例: GRUB_CMDLINE_LINUX="crashkernel=auto rd.lvm.lv=centos/root rd.lvm.lv=centos/swap rhgb quiet biosdevname=0 net.ifnames=0"
2. 更新grub: grub2-mkconfig -o /boot/grub2/grub.cfg
3. 重启
4. 之后ifconfig就能看到eth0了
5. 修改名称后, 在/etc/sysconfig/network-scripts中不会自动生成ifcfg-eth0配置文件, 需要自己手动新增
```

* ```mii-tool eth0```: 查看网络连接状态

```
[root@10 ~]# mii-tool eth0
eth0: no autonegotiation, 1000baseT-FD flow-control, link ok
```

* ```route -n```: 查看网关

```
[root@10 ~]# route -n
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         10.0.2.2        0.0.0.0         UG    100    0        0 eth0
10.0.2.0        0.0.0.0         255.255.255.0   U     100    0        0 eth0
192.168.122.0   0.0.0.0         255.255.255.0   U     0      0        0 virbr0
```

##### 网络配置

* ```ifconfig eth0 <新的ip地址>```: 设置ip
* ```ifconfig eth0 <新的ip地址> netmask <子网掩码>```: 设置ip和子网掩码
* ```ifup <网络接口>```: 启用网络接口
* ```ifdown <网络接口>```: 禁用网络接口

##### 路由命令

* ```route del default gw <网关ip地址>```: 删除默认网关
* ```route add default gw <网关ip地址>```: 添加默认网关
* ```route add -host <目标ip> gw <网关ip地址>```: 添加明细路由, 当访问"目标ip"时, 使用指定的网关ip
* ```route add -net <目标网段> netmask <子网掩码> gw <网关ip地址>```: 添加明细路由, 当访问指定网段时, 使用指定的网关ip

> centos7之后, 又有了iproute2工具包, 里面的命令有```ip```, ```ss```, 可以实现和上面类似的功能

##### 网络故障排除

* ping: 检测当前主机和目标主机是否畅通
* ```traceroute -w 1 www.baidu.com```: 检测当前主机和目标主机的网络状况, 追踪当前主机到目标主机, 都经过了哪些路由, ```-w 1```表示如果1秒钟没有返回, 则跳过, 如果中间的路由不支持traceroute, 则结果中会显示```*```
* ```mtr```: 检测当前主机和目标主机的网络状况, 直接执行, 显示的信息比traceroute更详细, 会显示与当前主机通信的所有其他主机信息

```
                                                      My traceroute  [v0.85]
10.0.2.15 (::)                                                                                            Sun May 29 06:16:03 2022
Keys:  Help   Display mode   Restart statistics   Order of fields   quit
                                                                                          Packets               Pings
 Host                                                                                   Loss%   Snt   Last   Avg  Best  Wrst StDev
 1. localhost                                                                            0.0%    20    0.1   0.1   0.1   0.2   0.0
```
* ```nslookup <目标主机>```: 显示目标主机ip, 使用的dns等
* ```nslookup```: 进入操作命令行, 然后输入```server```查看dns

```
[root@10 ~]# nslookup www.baidu.com
Server:         192.168.1.1
Address:        192.168.1.1#53

Non-authoritative answer:
www.baidu.com   canonical name = www.a.shifen.com.
Name:   www.a.shifen.com
Address: 110.242.68.4
Name:   www.a.shifen.com
Address: 110.242.68.3
[root@10 ~]# nslookup
> server
Default server: 192.168.1.1
Address: 192.168.1.1#53
> exit
```

* ```telnet <目标主机> <目标端口>```: 检查端口连接状态

可能没有这个命令, 这时需要手动安装: ```yum install telnet -y```

```
[root@10 ~]# telnet www.baidu.com 80
Trying 110.242.68.3...
Connected to www.baidu.com.
Escape character is '^]'.
```
退出telnet --> ```ctrl + ]``` --> 输入```quit```

* ```tcpdump -i any -n port 80```: 捕获数据包, ```-i any```抓取所有网卡; ```-n```所有域名都转ip显示; ```-port 80```指定抓取的端口
* ```tcpdump -i any -n host 10.0.0.1```: 只捕获和10.0.0.1之间的数据包
* ```tcpdump -i any -n host 10.0.0.1 and port 80```: 只捕获和10.0.0.1的80端口之间的数据包
* ```tcpdump -i any -n host 10.0.0.1 and port 80 -w <文件名>```: 只捕获和10.0.0.1的80端口之间的数据包, 并保存到指定的文件中
* ```netstat -ntpl```: 列出当前主机监听相关信息. ```-n```所有域名转ip显示; ```-t```只列出tcp数据相关; ```-p```显示端口所对应的进程信息; ```-l```只显示监听.

```
[root@10 ~]# netstat -ntpl
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:111             0.0.0.0:*               LISTEN      654/rpcbind
tcp        0      0 192.168.122.1:53        0.0.0.0:*               LISTEN      1297/dnsmasq
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      1099/sshd
tcp        0      0 127.0.0.1:631           0.0.0.0:*               LISTEN      1098/cupsd
tcp6       0      0 :::111                  :::*                    LISTEN      654/rpcbind
tcp6       0      0 :::22                   :::*                    LISTEN      1099/sshd
tcp6       0      0 ::1:631                 :::*                    LISTEN      1098/cupsd
```

上面Local Address列中, 0.0.0.0表示的是能对所有ip都可以处理. 127.0.0.1表示只处理来自本机的请求.

* ```ss -ntpl```: 和netstat差不多, 支持信息的展示形式有些区别

##### 网络服务管理

网络配置文件:

* ```/etc/sysconfig/network-scripts/ifcfg-eth0```: ```ifcfg-xxx```后面的xxx不固定, 会随网卡名称变化
* ```/etc/hosts```: 主机名相关配置

相关命令:

* ```service network status```: 查看网络状态

```
[root@10 network-scripts]# service network status
已配置设备：
lo eth0
当前活跃设备：
lo eth0 virbr0
```

* ```service network restart```: 重启网络服务
* ```systemctl list-unit-files NetworkManager.service```: 查看某个服务systemctl是否支持

查看ifcfg-eth0配置文件:

```
TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=dhcp
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=eth0
UUID=b257db0a-8634-4333-9513-5dd339f06b38
DEVICE=eth0
ONBOOT=yes
```

主要关注的配置: BOOTPROTO(静态ip还是动态ip), NAME, DEVICE, ONBOOT(开机启动)

如果设置为静态ip:

```
TYPE=Ethernet
UUID=b257db0a-8634-4333-9513-5dd339f06b38
NAME=eth0
DEVICE=eth0
ONBOOT=yes
BOOTPROTO=none
IPADDR=10.0.2.15
NETMASK=255.255.255.0
GATEWAY=10.0.2.255
DNS1=114.114.114.114
```

> NetworkManager和network是两套网络管理服务, NetworkManager是centos7开始新增的.

* ```hostname```: 查看主机名
* ```hostname <新主机名>```: 修改为新主机名, 当前生效
* ```hostnamectl set-hostname <新主机名>```: 修改主机名, 永久生效

> 永久修改主机名之后, 需要在```/etc/hosts```增加配置

## 软件包管理器

包管理器是方便软件安装,卸载,解决软件依赖关系的重要工具.

* CentOS, RedHat使用yum包管理器, 软件安装包格式为rpm
* Debian, Ubuntu使用apt包管理器, 软件安装包格式为deb

rpm包格式:

```
vim-common-7.4.10-5.el7.x86_64.rpm

解释:
vim-common - 软件名称
7.4.10-5 - 软件版本
el7 - 系统版本
x86_64 - 平台
```

rpm使用:

* ```rpm -qa```: 查询当前系统中安装的所有软件包
* ```rpm -qa | more```: 利用管道符, 实现分屏查看
* ```rpm -q <软件包名称>```: 查询某个单独的软件包是否安装
* ```rpm -i <软件包文件>```: 安装软件包
* ```rpm -e <软件包名称>```: 卸载软件包

##### yum包管理器

官方yum源: http://mirror.centos.org/centos/7/
国内镜像: https://developer.aliyun.com/mirror/

修改yum源位置为国内的:

```
1. 备份原镜像配置文件: mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
2. 下载阿里配置: wget -O /etc/yum.repos.d/CentOS-Base.repo https://mirrors.aliyun.com/repo/Centos-7.repo
3. 更改yum系统缓存: yum makecache
```

* ```yum install <软件包名称>```: 安装软件包
* ```yum remove <软件包名称>```: 卸载软件包
* ```yum list```: 查看已经安装的软件包
* ```yum update```: 更新软件包

##### 源代码编译安装

基本流程大致如下:

1. 下载源代码
2. 解压
3. 切换至源码根目录
4. 执行```./configure --prefix=<安装路径>```进行安装前配置, 并指定程序的安装目录(安装目录需要是该程序专属目录, 不是它的上级目录)
5. 执行```make```编译源码
6. 执行```make install```进行安装
7. 完成, 可以在上面指定的安装目录中找到

> 中途可能出现各种缺少依赖, 需要逐个解决
> 编译源码安装都需要依赖gcc, 一般系统不会内置, 需要手动安装```yum install gcc gcc-c++```

##### 升级内核















## ssh服务

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

## 工作中的积累


**查看磁盘使用情况**
```df -h```

**汇总一个目录下各个文件/文件夹大小**

```du -sh *```

**查看端口监听**

```lsof -i:端口号```
```
[root@localhost gitlab]# lsof -i:80
COMMAND   PID       USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
nginx   10494       root    7u  IPv4 128147      0t0  TCP *:http (LISTEN)
nginx   10498 gitlab-www    7u  IPv4 128147      0t0  TCP *:http (LISTEN)
```

**查看是否有系统主动杀掉进程的问题**

```
egrep -i -r 'killed process' /var/log
```

> 需要有权限, 才能查看

或者下面这个命令:

vim /var/log/messages

有时候系统会主动杀掉tomcat等后台进程, 这时tomcat日志只会有一句: catalina.sh .... killed ....
这时候就需要查看系统日志, 确定是不是被系统主动杀掉了.

* setsid命令

让进程运行在新的会话里, 从而成为不属于此终端的子进程. 从而实现进程后台运行.

**环境变量配置**

1. 执行```export```查看当前所有环境变量;
2. 修改系统环境变量配置```vim /etc/profile```(需root权限);
3. 在文档末尾, 填写需要指定的环境变量, 例如:```export VAR_KEY=VAR_VALUE```;
4. 执行```source /etc/profile```使其立即生效.

## 其他命令

* ```clear```: 清屏

统配符:

* ```*```: 通配任意长度的任意字符
* ```?```: 通配一个任意字符

输出:

* ```echo <内容>```: 输出内容

挂在磁盘:

* ```mount <块文件> <目标路径>```: 将指定的块文件(也就是镜像之类的)挂载到目标路径, 目标路径一般推荐使用```/mnt```