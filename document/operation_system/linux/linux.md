# linux

## 概述

常用目录:

* /    根目录
* /root    root用户的家目录
* /home/username    普通用户的家目录
* /etc    配置文件目录
* /bin    命令目录
* /sbin    管理命令目录
* /usr/bin, /usr/sbin    系统预装的其他命令

## 工作中积累的一些命令

* 查看磁盘使用情况: ```df -h```
* 汇总一个目录下各个文件/文件夹大小: ```du -sh *```
* 查看端口监听: ```lsof -i:端口号```
    ```
    [root@localhost gitlab]# lsof -i:80
    COMMAND   PID       USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
    nginx   10494       root    7u  IPv4 128147      0t0  TCP *:http (LISTEN)
    nginx   10498 gitlab-www    7u  IPv4 128147      0t0  TCP *:http (LISTEN)
    ```

## 帮助

* man
    - manual的缩写
    - demo: man ls
    - man 7 man
    - 章节
    - man -a <command>
* help
    - help <command>   内部命令(shell解释器自带命令)
    - <command> --help     外部命令
    - 如何区分外部命令和内部命令: type <command>
* info
    - 更详细的命令描述, 是help的补充

## 文件管理

**文件查看**

* pwd
    - 显示当前目录名称
* ls
    - 查看当前目录下的文件
    - ls -l   长格式显示
        ```
            root@DESKTOP-8U8SJ9D:/home# ls -l
            total 4
            drwxr-xr-x 5 frogif frogif 4096 Oct 13 09:18 frogif
        对应解释:
            1[  2    ] 3 [  4 ] [ 5  ] [ 6] [      7   ] [  8  ]
        ```
        1 - 文件类型;
        2 - 权限;
        3 - 内部包含文件个数;
        4 - 创建人;
        5 - 创建人所属用户组;
        6 - 文件大小;
        7 - 最后修改时间;
        8 - 文件名;
    - ls -a  显示隐藏文件和隐藏文件夹
    - ls -r  以逆向的方式排序(默认是'文件名'进行排序)
        - ls -l -r
        - ls -l -r -t   (-t指定以时间进行排序)
    - ls -R  递归显示
* cd
    - 目录位置的切换
    - cd -   回到之前操作的目录(可以实现两个目录之间的切换)
    - cd ..  进入上一级目录

> 命令的基本结构: <command> [options] [args...]

> 清屏: clear 或 ctrl+L

**目录创建及删除**

* mkdir
    - 创建目录(后接多个路径可以建立多个目录)
    - mkdir -p <path> 创建多级目录
* rmdir
    - 删除目录, 注意, 只能删除空白目录
* rm
    - 删除文件
    - rm -r   递归删除
    - rm -r -f  没有询问的递归删除
* cp
    - 文件复制
    - cp [源文件路径] [目标目录]
    - cp -r [源文件路径] [目标目录]  复制目录, 而不是文件
    - cp -v ... 显示复制的详细过程信息
    - cp -p ... 如果没有p, 复制之后, 文件的用户,权限,时间等都会变化, 加上-p会保证信息不回变化
    - cp -a ... 等同于-dpR
* mv
    - 移动及重命名

> 通配符: *, ?
> * - 匹配多个字符
> ? - 匹配单个字符

**文本查看**

* cat
    - 文本的内容显示到终端
* head
    - 查看文件的开头(默认查看10行)
    - head -5 [filename] 查看前5行
* tail
    - 查看文件的结尾(默认查看10行)
    - tail -f [filename] 同步更新
* wc
    - 统计文件内容信息
    - wc -l [filename] 查看文件有多少行
* more
    - 分行显示, 一次显示一部分内容
* less
    - 类似于more


**打包与压缩**

* tar
    - 打包
    - tar cf [filename] [source] 打包成文件
        * c 打包
        * f 打包成文件
    - tar czf [filename] [source] 打包并使用gzip压缩
        * z 使用gzip压缩
    - tar cjf [filename] [source] 打包并使用bzip2压缩
        * j 使用bzip2压缩
    - tar xf [filename] 解包
    - tar xf [filename] -C [targetPath] 解包到指定的文件夹
    - tar xzf 解压缩gzip压缩过的文件
    - tar xjf 解压缩bzip2压缩过的文件
* gzip
    - 压缩/解压缩 
* bzip2
    - 压缩/解压缩, 压缩率相较于gzip更高, 速度慢一些

> 一般, 文件.tar.gz, .tgz是gzip压缩的文件, .tar.bz2, tar.bzip2, .tbz2是bzip2压缩的文件. 压缩的时候, 也应该遵循这个规则进行命名


**文本编辑器Vim**

特性: 多模式

* 正常模式(Normal-mode)
    - y -- 复制
        * yy -- 按行复制
        * y$ -- 复制当前位置到光标结尾
        * <数字>yy -- 复制多行
    - p -- 粘贴
    - d -- 剪切
        * dd -- 按行剪切
        * d$ -- 剪切当前位置到光标结尾
    - u -- 撤销
    - ctrl + r -- 重做
    - x -- 单个字符的删除
    - r<新字符> -- 单个字符的替换
    - G -- 移动到指定行
        * <数字>G -- 移动到指定行
        * g -- 移动到第一行
        * G -- 移动到最后一行
    - ^  定位到行首
    - $  定位到行尾
* 插入模式(Insert-mode)
    - i -- 进入插入模式
    - I -- 进入插入模式, 光标定位到行开头
    - a -- 进入插入模式, 光标定位到原位置的下一位
    - A -- 进入插入模式, 光标定位到行结尾
    - o -- 进入插入模式, 光标所在行的下一行插入空行
    - O -- 进入插入模式, 光标所在行的上一行插入空行
* 命令模式(Command-mode)
    - : -- 进入命令模式
    - w <path>  -- 保存到指定位置
    - q -- 退出编辑器
        * q!  -- 不保存退出
        * wq  -- 保存并退出
    - !<命令> -- 执行linux命令
    - /<内容> -- 查找(不需要先按:)
        * n -- 定位到下一个
        * N -- 定位到上一个
    - s/<旧的字符>/<新的字符> -- 替换(针对光标所在行)
    - %s/<旧的字符>/<新的字符> -- 替换(针对全文)
        * %s/<旧>/<新>/g -- 全部替换
        * <数字>,<数字>s/<旧>/<新> -- 针对指定行范围进行替换
    - set -- 设置
        * set nu -- 显示行号
        * set nonu -- 不显示行号
* 可视模式(Visual-mode)
    - v -- 进入字符可视模式
    - V -- 进入行可视模式
    - ctrl + v -- 进入块可视模式
        * I -- 插入
        * d -- 删除


> 全局配置:
> 修改/etc/vimrc文件, 在最后一行, 例如加入:
> set nu


## 用户及用户组

**用户管理**

* useradd -- 新建用户
    - 该命令执行之后, 系统都做了哪些事情?
        * 创建了 /home/<username>目录
        * /etc/passwd文件中, 会记录该用户
        * /etc/shadow文件中, 会记录该用户
* userdel -- 删除用户
    - userdel <username> /home/<username>数据如果还有用, 则不要加-r
    - userdel -r <username> 如果需要同时删除/home/<username> 需要加-r
* passwd -- 修改用户密码
    - 更改自己的密码, 直接passwd
    - 更改其他用户的密码, passwd <username>
* usermod -- 修改用户的属性
    - 修改用户的home目录等, 详见man 
* chage -- 修改用户的属性
    - 修改用户多久修改一次密码等时间相关
* id <用户名> -- 判断该用户是否存在

**组管理**

* groupadd -- 新建用户组
    - usermod -g <group> <username> 修改某个用户的用户组
    - useradd -g <group> <username> 新增用户同时指定用户组
* groupdel -- 删除用户组


**其他**

* su -- 切换用户
    - su - <username> 加上'-', 切换用户同时, 把当前运行环境也切换(就是说, 切换到指定用户的home目录)
* exit -- 退回root用户
* sudo -- 以其他用户身份执行命令
    - visudo -- 打开配置文件
    ```
    <用户> <主机>=<命令1>,<命令2> [NOPASSWD:主机]
    %<用户组> ...同上
    ```

> which 查找某条命令的具体位置

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

## tip

* 查看是否有系统主动杀掉进程的问题:

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
