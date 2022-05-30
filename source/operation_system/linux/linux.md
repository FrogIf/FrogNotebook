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

#### 帮助

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

#### ls

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

对目录文件的解释:

* 第1列: ```-```: 普通文件; ```d``` - 目录; 后面的一串字符表示权限.
* 第2列: 表示内部的文件个数, 显然对于文件, 它的文件个数就是1.
* 第3列: 创建人
* 第4列: 创建人所属用户组
* 第5列: 当前文件大小
* 第6列: 文件最后修改时间
* 第7列: 文件名称
```

> 对于非目录文件, 基本上差不多, 只不过第二列表示的是链接数量

* ```ls -a```: 显示所有文件, 包括隐藏的
* ```ls -l -r```/```ls -lr```: 按照文件名, 逆向排序显示
* ```ls -l -r -t```/```ls -lrt```: 按照时间, 逆向排序显示
* ```ls -R```: 递归显示, 显示文件夹的子文件夹等
* ```ll```: ```ls -l```的缩写
* ```ll -h```: 文件大小以更友好的方式显示

#### cd

* ```cd <路径>```: 切换至指定目录
* ```cd -```: 回到之前操作的目录
* ```cd ..```: 切换至上级目录

#### mkdir

* ```mkdir <路径>```: 创建指定的文件夹
* ```mkdir <路径1> <路径2> <路径3>```: 创建多个文件夹
* ```mkdir -p <路径>```: 创建多级目录

#### rm

* ```rm <文件>```: 删除文件或者空文件夹
* ```rm -r <目录>```: 递归删除多级目录
* ```rm -rf <目录>```: 递归删除多级目录, 并且没有任何提示

#### cp

* ```cp <源文件> <目标文件(夹)>```: 将源文件复制到目标文件(只能是文件)
* ```cp -r <源文件夹> <目标文件夹>```: 将源文件夹复制到目标文件夹
* ```cp -p <其他操作>```: 复制时保留原有文件信息(最后修改时间, 所属人/组)

#### mv

* ```mv <源文件> <目标文件>```: 移动并重命名
* ```mv -r <文件夹> <目标文件夹>```: 移动文件夹

#### head

* ```head <文件>```: 查看文件开头10行
* ```head -3 <文件>```: 查看文件开头3行(这个数字可以随意指定)

#### tail

* ```tail <文件>```: 查看文件结尾10行
* ```tail -3 <文件>```: 查看文件结尾3行(这个数字可以随意指定)
* ```tail -f <文件>```: 查看文件结尾10行, 当文件不断变化时, 同步更新

#### wc

* ```wc -l <文件>```: 查看文件还有多少行

#### tar

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

#### 正常模式

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

#### 插入模式

正常模式-->按```i```进入插入模式......
正常模式-->按```o```进入插入模式, 并在光标当前行下面插入空行......

#### 命令模式

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

#### 可视模式

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

#### useradd

* ```useradd <用户名>```: 添加指定名称的用户(如果用户已存在, 会提示)
* ```useradd -g <用户组> <用户名>```: 添加用户, 同时指定用户组

useradd都执行了哪些操作?

1. 创建```/home/<username>```文件夹及里边的文件
2. ```/etc/passwd```文件中增加了一行记录
3. ```/etc/shadow```文件中增加了一行记录

> 只有root用户才可以创建用户

#### userdel

* ```userdel <username>```: 删除用户
* ```userdel -r <username>```: 删除用户以及该用户的家目录

#### usermod

* ```usermod -d <新的家目录> <username>```: 修改用户的家目录位置
* ```usermod -g <用户组> <username>```: 修改用户的用户组

#### chage

TODO后期详细讲解

#### su

* ```su - <username>```: 切换至指定的用户, 同时把自己运行的环境变更为新用户的运行环境(会跳转值新用户的家目录)
* ```su <username>```: 切换至指定用户, 不完全切换, 切换之后, 仍停留在当前目录

#### visudo

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

#### 用户和用户组的配置文件

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

#### 文件权限

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

#### 网络状态查看

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

#### 网络配置

* ```ifconfig eth0 <新的ip地址>```: 设置ip
* ```ifconfig eth0 <新的ip地址> netmask <子网掩码>```: 设置ip和子网掩码
* ```ifup <网络接口>```: 启用网络接口
* ```ifdown <网络接口>```: 禁用网络接口

#### 路由命令

* ```route del default gw <网关ip地址>```: 删除默认网关
* ```route add default gw <网关ip地址>```: 添加默认网关
* ```route add -host <目标ip> gw <网关ip地址>```: 添加明细路由, 当访问"目标ip"时, 使用指定的网关ip
* ```route add -net <目标网段> netmask <子网掩码> gw <网关ip地址>```: 添加明细路由, 当访问指定网段时, 使用指定的网关ip

> centos7之后, 又有了iproute2工具包, 里面的命令有```ip```, ```ss```, 可以实现和上面类似的功能

#### 网络故障排除

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

#### 网络服务管理

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

#### yum包管理器

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

#### 源代码编译安装

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

## grub

grub是系统启动引导软件, centos6使用的是grub1, centos7使用的是grub2. grub配置文件位于```/boot/grub2/grub.cfg```, 但是不要手动修改这个文件.

如果需要修改, 可以修改```/etc/default/grub```文件. 如果想修改更详细的引导配置可以修改```/etc/grub.d```文件夹中的配置文件.

修改完成之后, 需要执行```grub2-mkconfig -o /boot/grub2/grub.cfg```来产生新的grub配置文件.

grub基础配置配置 - ```/etc/default/grub```:

```
GRUB_TIMEOUT=5
GRUB_DISTRIBUTOR="$(sed 's, release .*$,,g' /etc/system-release)"
GRUB_DEFAULT=saved
GRUB_DISABLE_SUBMENU=true
GRUB_TERMINAL_OUTPUT="console"
GRUB_CMDLINE_LINUX="crashkernel=auto rd.lvm.lv=centos/root rd.lvm.lv=centos/swap rhgb quiet biosdevname=0 net.ifnames=0"
GRUB_DISABLE_RECOVERY="true"
```

主要关注的有两项: GRUB_DEFAULT - 默认启动引导的内核; GRUB_CMDLINE_LINUX - 引导时, 对linux内核增加哪些参数

* GRUB_CMDLINE_LINUX:
  * rhgb: 图形模式
  * quiet: 静默模式, 如果去掉, 可以看到系统启动时更详细的信息输出

#### 示例-指定系统启动时默认引导的内核

* ```grub2-editenv list```: 显示系统当前引导的内核
* ```grep ^menu /boot/grub2/grub.cfg```: 列出所有可引导的内核

```
[root@frog-centos7 ~]# grep ^menu /boot/grub2/grub.cfg
menuentry 'CentOS Linux (3.10.0-1160.el7.x86_64) 7 (Core)' --class centos --class gnu-linux --class gnu --class os --unrestricted $menuentry_id_option 'gnulinux-3.10.0-1160.el7.x86_64-advanced-c72e3b21-d1f1-4d4f-b440-a51c09e515be' {
menuentry 'CentOS Linux (0-rescue-4b273917fe62da4292db2842cc87efc6) 7 (Core)' --class centos --class gnu-linux --class gnu --class os --unrestricted $menuentry_id_option 'gnulinux-0-rescue-4b273917fe62da4292db2842cc87efc6-advanced-c72e3b21-d1f1-4d4f-b440-a51c09e515be' {
```

* ```grub2-set-default 0```: 设置默认引导第一个内核

## 进程管理

进程状态查看命令:

* ```ps```: 查看进程状态
* ```pstree```: 查看进程的树形结构
* ```top```: 查看进程详细信息

#### ps

* ```ps```: 显示当前终端下能看到的进程状态
* ```ps -e```: 显示全部进程, 一些关键的列: PID - 进程id
* ```ps -ef```: 显示全部进程, 在上一个基础上, 额外显示: UID - 表示进程的有效用户id; PPID - 父进程id; CMD - 命令完整路径
* ```ps -eLf```: 在上一个基础上, 会显示LWP - 线程数, 可以用来查看一个进程的线程数是否过多

#### top

* ```top```: 查看进程详细信息, 不需要任何参数

```
top - 14:36:48 up  5:40,  1 user,  load average: 0.00, 0.01, 0.05
Tasks: 154 total,   1 running, 153 sleeping,   0 stopped,   0 zombie
%Cpu(s):  0.0 us,  0.0 sy,  0.0 ni,100.0 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem :  1014760 total,    84316 free,   405236 used,   525208 buff/cache
KiB Swap:   839676 total,   830708 free,     8968 used.   450648 avail Mem

  PID USER      PR  NI    VIRT    RES    SHR S %CPU %MEM     TIME+ COMMAND
    1 root      20   0  128284   4540   2644 S  0.0  0.4   0:02.48 systemd
    2 root      20   0       0      0      0 S  0.0  0.0   0:00.00 kthreadd
```

详细说明一下具体内容:

* 第一行 - ```up 5:40```: 表示系统已启动5小时40分钟
* 第一行 - ```1 user```: 表示当前系统有1个用户登录
* 第一行 - ```load average: 0.00, 0.01, 0.05```: 平均负载, 用于衡量系统的繁忙程度, 后面三个值, 分别是1分钟/5分钟/15分钟的指标. 对于单核如果值为1, 就表示系统满负载运行; 双核如果值为2, 就是满负载等等, 如果100核, 值为1, 那就很空闲.
* 第二行 - ```Tasks: 154 total```: 表示有154个进程在运行
* 第三行: CPU使用情况: us - 用户进程使用占比; sy - 系统进程使用占比; id - 空闲状态; wa - io wait占比
* 第四行: 内存使用情况: total - 总内存大小; free - 空闲内存大小; used - 使用内存大小; buff/cache - 用于读写的缓存的内存大小
* 第五行: 交换分区(虚拟内存) : 当物理内存不足时, 会将一部分内存数据暂时输出到磁盘中进行保存, 称之为交换分区
* 第六行: %CPU进程占用的CPU; %MEM进程占中的内存; TIME+进程已经运行时间; PR - 系统优先级; NI - nice值; S - 进程状态(S - interruptable sleep, D - Uninterruptable sleep, R - 运行状态; Z - 僵尸状态; T - Stop模式，进程要么处于被调试状态)

> 什么是僵尸进程? 在Linux中，每个进程都有一个父进程，进程号叫PID（Process ID），父进程号叫PPID（Parent PID）。当进程死亡时，会关闭已经打开的文件，舍弃已经占用的内存，交换空间等公共资源，然后向父进程返回一个退出状态值，报告死讯。如果在报告的过程中出了问题，父进程不知道子进程死了，子进程便变成了僵尸。Linux中，可以通过杀死父进程的方式来让子进程消失。但是，僵尸进程并不占用任何资源，只是错误显示，如果父进程正在跑业务，千万不可以贸然杀死父进程。

在top界面的命令操作:

* ```1``` - 总CPU和逻辑CPU之间显示切换
* ```s``` - 修改数据刷新频率, 默认每3秒更新一次
* ```e``` - 进程显示指标单位切换
* ```E``` - 上方整体系统指标单位切换
* ```P``` - 按照CPU排序
* ```M``` - 按照内存排序

其他命令:

* ```top -p <pid>```: 查看指定进程的运行状态

#### 进程控制

* ```nice -n <优先级> <程序启动命令>```: 设置优先级, 范围从-20到19, 值越小优先级越高, 抢占资源就越多
* ```renice -n <优先级> <进程pid>```: 对于已经启动的程序, 重新设置优先级
* ```<程序启动命令> &```: 使得程序后台运行
* ```jobs```: 查看后台运行的程序

```
[root@frog-centos7 ~]# jobs
[1]+  运行中               ./a.sh &
```

* ```fg <数字>```: 使得后台程序调回前台运行, 数字就是jobs第一列的数字
* ```ctrl + z```: 将前台程序调入后台, 并暂停
* ```bg <数字>```: 通过jobs查看, 可以找到被```ctrl + z```调入后台暂停的程序, 然后通过这个命令重新运行

#### 进程间通信

信号是进程间通信的方式之一. 典型用法是: 终端用户输入中断命令, 通过信号机制停止一个程勋的运行.

* ```kill -l```: 查看信号
* ```ctrl + c```: 就是2号信号, 通过```kill -l```看到
* ```kill -9 <pid>```: 发送9号信号, 使得其无条件结束

#### 守护进程

* ```nohup <程序启动命令>```: 使得程序运行时, hangup不会回应, 这样, 即使终端关掉, 也可以不影响程序的运行. 这个命令会将输出内容追加到nohup.out文件
* ```nohup <程序启动命令> &```: 一般都这样使用, 使得: 1. 不回应hangup, 2. 后台运行.

上面这个不属于守护进程. 守护进程(daemon)是一些开机自启的后台进程. 

下面介绍一个特殊的文件夹```/proc```, 这是一个在磁盘上不存在的文件夹, 是操作系统将内存信息以文件方式呈现出来:

```
[root@frog-centos7 19548]# ls /proc
1     1428  1526  1585  17     19578  288  392  45   60   659  8          dma          kmsg          sched_debug    uptime
10    1434  1529  1588  17729  19579  289  393  46   618  661  9          driver       kpagecount    schedstat      version
1067  1440  1533  1591  18     2      291  394  483  620  662  95         execdomains  kpageflags    scsi           vmallocinfo
1069  1450  1536  1594  18775  20     292  395  509  622  668  acpi       fb           loadavg       self           vmstat
1070  1454  1545  1599  18781  21     30   396  522  624  690  asound     filesystems  locks         slabinfo       zoneinfo
1072  1459  1554  16    19     22     31   397  577  625  691  buddyinfo  fs           mdstat        softirqs
1079  1460  1558  1604  19130  23     316  398  578  646  694  bus        interrupts   meminfo       stat
1085  1464  1565  1608  19283  24     32   399  579  647  695  cgroups    iomem        misc          swaps
1086  1469  1569  1614  19336  2584   33   4    580  650  696  cmdline    ioports      modules       sys
11    1473  1570  1620  19389  276    367  400  581  651  697  consoles   irq          mounts        sysrq-trigger
13    1494  1572  1623  19438  282    368  401  582  653  7    cpuinfo    kallsyms     mtrr          sysvipc
1307  15    1575  1627  19449  284    378  41   584  654  720  crypto     kcore        net           timer_list
1309  1501  1577  1650  19454  285    379  43   586  657  724  devices    keys         pagetypeinfo  timer_stats
14    1510  1579  1674  19548  286    391  44   6    658  760  diskstats  key-users    partitions    tty
[root@frog-centos7 proc]# ls -l /proc/19548/cwd
lrwxrwxrwx. 1 root root 0 5月  29 16:02 /proc/19548/cwd -> /proc
[root@frog-centos7 proc]# ls -l /proc/19548/fd
总用量 0
l-wx------. 1 root root 64 5月  29 16:02 0 -> /dev/null
l-wx------. 1 root root 64 5月  29 16:02 1 -> /root/nohup.out
l-wx------. 1 root root 64 5月  29 16:02 2 -> /root/nohup.out
lr-x------. 1 root root 64 5月  29 16:02 3 -> /var/log/messages
lr-x------. 1 root root 64 5月  29 16:02 4 -> anon_inode:inotify
```

proc目录中, 每个文件夹对应一个进程, 可以进入到每个进程目录中进行查看. 其中```cwd```指示的是当前工作目录, 也就是程序工作过程中, 占用的目录. ```fd```目录记录了输入输出信息. 0 - 标准输入; 1/2 - 标准输出.

介绍screen命令: screen命令是在当前终端新开启一个"界面", 用于防止在一系列操作过程中, 由于网络中断等, 导致hangup, 导致操作到一半结果工作丢失. 可能需要安装:``` yum install screen```. 使用方式如下:

1. ```screen```: 进入screen
2. 执行正常的一些工作
3. ```ctrl + a d```: 临时退出screen
4. ```screen -ls```: 查看当前存在的screen列表
5. ```screen -r <sessionId>```: 通过上面列表中查询到的id, 重新进入指定的screen
6. ```exit```: 离开screen

## 系统日志

所有系统日志都会输出到```/var/log```目录. 需要关注的有:

* ```messages```: 系统常规日志, 例如是否有些进程被系统主动杀掉
* ```dmesg```: 系统启动日志
* ```secure```: 系统安全日志
* ```cron```: 定时任务日志

## 服务管理工具systemctl

centos7提供的新的服务管理工具, 相较于centos7之前的service命令, 操作更方便. 常见操作如下:

* ```systemctl start|status|stop|restart|reload|enable|disable <服务名称>```
  * reload - 有些服务, 可以动态加载配置变更, 就可以使用这个
* ```systemctl get-default```: 查看系统当前的运行级别
* ```systemctl set-default <运行级别>```: 指定运行级别(级别可选项参见下面, 例如multi-user.target)

服务单元所在目录:  ```/usr/lib/systemd/system```, 内部```*.service```就是服务, ```*.target```表示服务的级别

```
[root@frog-centos7 system]# ls -l /usr/lib/systemd/system/runlevel*.target
lrwxrwxrwx. 1 root root 15 5月  28 20:12 /usr/lib/systemd/system/runlevel0.target -> poweroff.target
lrwxrwxrwx. 1 root root 13 5月  28 20:12 /usr/lib/systemd/system/runlevel1.target -> rescue.target
lrwxrwxrwx. 1 root root 17 5月  28 20:12 /usr/lib/systemd/system/runlevel2.target -> multi-user.target
lrwxrwxrwx. 1 root root 17 5月  28 20:12 /usr/lib/systemd/system/runlevel3.target -> multi-user.target
lrwxrwxrwx. 1 root root 17 5月  28 20:12 /usr/lib/systemd/system/runlevel4.target -> multi-user.target
lrwxrwxrwx. 1 root root 16 5月  28 20:12 /usr/lib/systemd/system/runlevel5.target -> graphical.target
lrwxrwxrwx. 1 root root 13 5月  28 20:12 /usr/lib/systemd/system/runlevel6.target -> reboot.target
```

服务启动配置文件介绍一下```vim /usr/lib/systemd/system/sshd.service```:

```
[Unit]
Description=OpenSSH server daemon
Documentation=man:sshd(8) man:sshd_config(5)
After=network.target sshd-keygen.service
Wants=sshd-keygen.service

[Service]
Type=notify
EnvironmentFile=/etc/sysconfig/sshd
ExecStart=/usr/sbin/sshd -D $OPTIONS
ExecReload=/bin/kill -HUP $MAINPID
KillMode=process
Restart=on-failure
RestartSec=42s

[Install]
WantedBy=multi-user.target
```

上面需要注意几项:

* ```After``` - 服务启动后, 执行
* ```Requires``` - 服务启动前, 启动
* ```ExecStart``` - 实际程序位置
* ```WantedBy``` - 服务期望在哪个级别启动

## SELinux

SELinux是用来进行安全控制的, 包括访问权限等. SELinux开启会降低服务器的性能, 生产服务器一般会关闭这个功能.

* ```getenforce```: 查看SELinux状态, 或者在```vim /etc/selinux/config```中查看
  * 存在三种状态: enforcing - 强制访问控制; permissive - 警告; disabled - 禁用
* ```setenforce 0```: 临时修改SELinux
* 修改```/etc/selinux/config```文件: 永久修改SELinux配置, 修改之后需要重启
* ```ps -Z```: 显示进程, 同时显示SELinux标签
* ```id -Z```: 显示当前用户的SELinux标签
* ```ls -Z```: 显示文件的SELinux标签

> 只有标签完全匹配, 才具有权限

## 内存和磁盘管理

#### 内存查看

* ```free```: 查看内存
* ```free -m```: 查看内存, 以Mb为单位
* ```free -g```: 查看内存, 以Gb为单位
* ```free -h```: 查看内存, 带单位显示

```
[root@frog-centos7 system]# free -h
              total        used        free      shared  buff/cache   available
Mem:           990M        391M        140M        4.0M        459M        445M
Swap:          819M         10M        809M
```

> buff/cache - 缓存, 可以释放
> available - 如果buff/cache都释放掉, 那么还可以使用多少内存
> Swap - 交换分区, 内存不够用时, 系统会把一部分暂时不需要的内存转移到磁盘上, 称之为交换分区

#### 磁盘查看

* ```fdisk -l```: 查看磁盘信息, 这个命令也可以用来进行分区编辑

```
[root@frog-centos7 system]# fdisk -l

磁盘 /dev/sda：8589 MB, 8589934592 字节，16777216 个扇区
Units = 扇区 of 1 * 512 = 512 bytes
扇区大小(逻辑/物理)：512 字节 / 512 字节
I/O 大小(最小/最佳)：512 字节 / 512 字节
磁盘标签类型：dos
磁盘标识符：0x000c737f

   设备 Boot      Start         End      Blocks   Id  System
/dev/sda1   *        2048     2099199     1048576   83  Linux
/dev/sda2         2099200    16777215     7339008   8e  Linux LVM

磁盘 /dev/mapper/centos-root：6652 MB, 6652166144 字节，12992512 个扇区
Units = 扇区 of 1 * 512 = 512 bytes
扇区大小(逻辑/物理)：512 字节 / 512 字节
I/O 大小(最小/最佳)：512 字节 / 512 字节


磁盘 /dev/mapper/centos-swap：859 MB, 859832320 字节，1679360 个扇区
Units = 扇区 of 1 * 512 = 512 bytes
扇区大小(逻辑/物理)：512 字节 / 512 字节
I/O 大小(最小/最佳)：512 字节 / 512 字节
```

解释一下里边的内容:

sda, sdb, sdc, ... - 表示可插拔的磁盘

设备列表中有sda1, sda2 ... 表示对磁盘的分区, 最多到sda15. 

对于其中一个分区, 又有start, end列, 代表的是扇区. system列代表分区类型. Boot列, 有```*```的表示内核所在的分区.

* ```df -h```: 查看其它的磁盘信息, 磁盘容量等, 磁盘挂在到哪一个目录

```
[root@frog-centos7 dev]# df -h
文件系统                 容量  已用  可用 已用% 挂载点
devtmpfs                 479M     0  479M    0% /dev
tmpfs                    496M     0  496M    0% /dev/shm
tmpfs                    496M  7.4M  489M    2% /run
tmpfs                    496M     0  496M    0% /sys/fs/cgroup
/dev/mapper/centos-root  6.2G  4.8G  1.5G   77% /
/dev/sda1               1014M  172M  843M   17% /boot
tmpfs                    100M   12K  100M    1% /run/user/42
tmpfs                    100M     0  100M    0% /run/user/0
```

* ```du <文件/目录>```: 查看文件实际占用的空间(ls -l也能看到大小, 但是那个不是实际占用的大小, 是存在"空洞的")

#### 文件系统

linux支持多种文件系统, 常见有:

* ext4
* xfs
* NTFS(需安装额外软件)

对于ext4文件系统:

* 超级块: 记录了整个文件系统中包含了多少个文件
* 超级块副本
* i节点(inode): 记录每一个文件的文件名, 大小, 编号, 权限等等
  * 文件名和剩余其他信息记录在不同的i节点, 文件名存储在它的父目录的i节点上
  * ```ls -i```: 可以查看文件所属i节点编号
* 数据块(datablock): 记录实际数据, i节点链接着数据块.

> linux系统中, ext4和xfs文件系统中, 默认创建的一个数据块大小是4k, 也就是说, 如果一个文件中只有一个字符, 也会占用4k. 因此linux中, 如果存储很多小文件, 也会占用很多空间

执行mv命令, 如果是在当前分区中进行的, i节点是不变的. 

vim修改文件时, 是先复制一个副本```.xxx.swp```, 然后在副本上进行操作, 最后保存时, 再进行覆盖.

rm命令实际上做的工作是使得文件名和i节点的链接断开. 所以误删数据就是误将链接断开了, 数据还是存在的.

文件链接:

* ```ln <源文件名> <新文件名>```: 硬链接, 建立一个新的文件名, 链接到源文件上, 就是两个文件名使用同一个i节点. 硬链接只能是在同一个分区
* ```ln -s <源文件名> <新文件名>```: 软连接(符号链接), 这时, 两者的i节点是不一样的. 软连接记录了目标文件的路径.

文件访问控制列表, 用于精准控制每一个用户和用户组对某个文件的控制权限:

* ```getfacl <文件名>```: 查看访问控制列表
* ```setfacl -m u:<用户名>:<权限符号rwx> <文件名>```: 赋予权限, u表示给用户赋予, g表示给用户组赋予
* ```setfacl -x u:<用户名>:<权限符号rwx> <文件名>```: 收回权限

> 设置文件访问控制列表后, ls -l显示的原有的访问权限标识后面会多一个"+"号

* ```mount```: 查看分区挂在情况

#### 其他一些内容

* 分区挂载
* 磁盘配额
* 交换分区
* RAID
  * RAID 0 - 就是将数据进行分片
  * RAID 1 - 就是主从备份
  * RAID 5 - 至少三块磁盘, 其中一块存储校验, 两块存储数据. 数据可以通过校验值恢复, 校验值可以通过数据生成.
  * RAID 10 - 至少4块磁盘, 就是先分片, 构成集群, 然后每个节点又做主从.
* 逻辑卷LVM
  * 将多个物理磁盘(物理卷)拼接在一起, 在上层, 通过软件使得看起来就像一个分区, 这就是逻辑卷

## 系统综合状态查询

* ``` sar -u 1 10```: 查看cpu运行状态, 每1秒执行一次, 共执行10次
* ```sar -r 1 10```: 查看内存运行状态
* ```sar -b 1 5```: 查看磁盘io运行状态
* ```sar -d 1 5```: 查看每一块磁盘的io状态
* ```sar -q 1 5```: 查看进程的综合状态

另一个工具iftop用于查看网络流量. 需要先安装```yum install epel-release```, 然后再安装```yum install iftop```.

* ```iftop -P```: 查看网络信息

## ssh服务

> 呃, 这个是Ubuntu的...

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


#### 查看磁盘使用情况
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
* ```lscpu```: 查看cpu相关信息
* ```uname -r```: 查看当前内核版本

统配符:

* ```*```: 通配任意长度的任意字符
* ```?```: 通配一个任意字符

输出:

* ```echo <内容>```: 输出内容

挂在磁盘:

* ```mount <块文件> <目标路径>```: 将指定的块文件(也就是镜像之类的)挂载到目标路径, 目标路径一般推荐使用```/mnt```