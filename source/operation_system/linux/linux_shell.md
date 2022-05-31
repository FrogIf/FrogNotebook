---
title: shell
author: frogif
date: 2022-05-30
---
# Shell

## 概述

shell是linux的命令解释器. 用于解释用户对操作系统的操作. CentOS7默认使用的shell是bash.

下面列出了一系列shell:

```
[root@frog-centos7 ~]# cat /etc/shells
/bin/sh
/bin/bash
/usr/bin/sh
/usr/bin/bash
/bin/tcsh
/bin/csh
```

## Linux启动过程

linux启动过程: BIOS -> MBR -> BootLoader(grub) -> kernel -> systemd -> 系统初始化 -> shell 

1. BIOS(Basic Input/Output System): BIOS引导, 基本输入输出系统, 存储在主板上
2. MBR: 硬盘主引导记录
   * dump MBR文件: ```dd if=/dev/sda of=mbr.bin bs=446 count=1```
   * 使用16进制查看这个文件: ```hexdump -C mbr.bin```
3. grub: 启动和引导内核
   * grub文件所在目录: ```/boot/grub2```
   * ```grub2-editenv list```查看默认内核
4. kernel: 内核启动
5. systemd: 启动1号进程
6. 系统初始化
7. 执行shell脚本

## shell脚本格式

* UNIX哲学: 一条命令只做一件事
* 为了组合命令和多次执行, 使用脚本文件来保存需要执行的命令
* 赋予该文件执行权限(chmod u+rx filename)

编写bash脚本时, 第一行一般需要声明使用的是哪一种shell

```sh
#!/bin/bash
cd /var/
ls
pwd
# 这里是注释
du -sh
du -sh *
```

## 执行命令的方式

1. ```bash ./filename.sh``` 
   * 使用bash shell执行这个文件
   * 不需要赋予文件可执行权限 
   * 在子进程中执行
2. ```./filename.sh```
   * 使用脚本中声明的shell执行这个文件
   * 需要赋予可执行权限
   * 在子进程中执行
3. ```source ./filename.sh```或者```.filename.sh```
   * 在当前进程中执行
   * 不需要赋予文件可执行权限

内建命令 - 不需要创建子进程; 对当前shell生效

## 管道

管道主要用于进程间通信, 进程通信方式之一. 将两个应用程序连接在一起, 将第一个程序的输出作为第二个程序的输入. 如果有多个程序, 就是前一个的输出作为后一个的输入.

``` cmd1 | cmd2 ```

## 重定向

重定向可以使程序将输出到标准输出的内容输出到文件里

* 输入重定向: ```<```
  * 场景: 使用文件代替键盘进行输入
  * 示例: ```read var < /path/to/a/file```
* 输出重定向:
  * ```>```: 把输出到终端上的内容输出到文件, 会清空原有文件
  * ```>>```: 把输出到终端上的内容输出到文件, 追加写
  * ```2>```: 把错误输出
  * ```&>```: 无论对错, 都输出

输出重定向示例:

```
[root@frog-centos7 ~]# wc -l < anaconda-ks.cfg
65
```

解释: ```wc -l```可以统计用户使用键盘输入了多少行, 这里通过输入重定向, 统计了一个文件有多少行.

```
[root@frog-centos7 ~]# read var2 < a.txt
[root@frog-centos7 ~]# echo $var2
123
```

解释: 将文件中的内容读入到一个变量中, 然后显示出来了.

输出重定向示例:

```
echo $var2 > b.txt
```

解释: 将本应输出到标准输出的内容输出到文件


输入输出重定向结合使用:

```sh
#!/bin/bash

cat > /root/a.sh <<EOF
echo "hello bash"
EOF
```

解释: 将cat读取到的内容输出重定向到```/root/a.sh```中. ```<<```是输入重定向, ```<<EOF```表示执行输入重定向直到遇到EOF结束. 然后下面两行都是输入的内容, 会被cat读取到.

## 变量

shell是弱类型语言.

* 变量赋值:

```sh
# 直接赋值
a=123
# 可以进行计算, 然后赋值, 尽量不要进行计算, 性能太低
let a=10 + 123
# 可以把命令赋给变量
l=ls
# 把命令执行结果赋给变量, 使用$() 或者 ``
c=$(ls -l /etc)
# 变量值有空格等特殊字符, 可以包含在""或者''中
str1="hello bash"
```

> ```=```等号左侧和右侧不允许出现空格

* 变量引用:

```sh
# ${变量名}
echo ${str1}123
# 当变量不与其他内容拼接时, 可以省略大括号
echo $str1
```

> echo - 查看变量值

* 变量的作用范围:

默认情况下, 变量只能在自己的进程中使用. 如果想让子进程获得父进程的值, 可以使用```export```标记:

```
export demo_var1
```

* 删除变量: ```unset demo_var1```

#### 系统环境变量

环境变量: 每个shell打开都可以获得的变量.

* ```env```: 查看系统的所有环境变量
* ```echo $环境变量```: 查看指定的环境变量

常用的环境变量:

```sh
# 当前用户名
[root@frog-centos7 ~]# echo $USER
root
# uid
[root@frog-centos7 ~]# echo $UID
0
# 查询命令搜索路径
[root@frog-centos7 ~]# echo $PATH
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin

# 当前提示终端, 可以修改, 显示的更友好, 这里就是[root@frog-centos7 ~]
[root@frog-centos7 ~]# echo $PS1
[\u@\h \W]\$
```

```$PATH```是命令搜索路径. 当执行某条命令时, 会到这些目录中搜索, 如果搜索到, 就会直接执行. 否则就会显示没有这个命令. 可以在当前进程中, 临时修改这个变量值. ```PATH=$PATH:<一个目录>```

环境变量配置文件有多个:

* ```/etc/profile```
* ```/etc/profile.d```
* ```~/.bash_profile```
* ```~/.bashrc```
* ```/etc/bashrc```

> 上面etc下的, 是所有用户通用的配置; 位于用户家目录的配置, 是这个用户特有的配置.
> 当```su - <用户名>```时, 上面的文件都会生效. 如果是```su <用户名>```则只有```~/.bashrc```和```/etc/bashrc```会生效, 因此, 这种切换方式是不完全的.
> 修改这些配置之后, 不会立即生效, 需要执行退出重进, 或者执行```source <文件名>```


#### 预定义变量

* ```$?```: 记录上一条命令是否正确执行, 0 - 正确执行, 非0 - 执行失败 
* ```$$```: 记录当前进程pid
* ```$0```: 记录当前进程名称

#### 位置变量

```sh
#!/bin/bash

echo $1
echo ${2-x}
```

这个执行结果是:

```
[root@frog-centos7 ~]# ./6.sh -a
-a
x
```

第一个参数是```-a```, 第二个参数没有输入, 但脚本中我们指定了默认值.

> 数字超过9后, 需要这样写: ```echo ${10}```

#### 数组

* 定义数组: ```a=(1 2 3 4)```
* 显示所有元素: ```echo ${a[@]}```
* 显示元素个数: ```echo ${#a[@]}```
* 显示指定索引的元素: ```echo ${a[1]}```


## 符号

#### 转义和引用

* 特殊字符 - 一个字符不仅有字面意义, 还有元意(meta-meaning)
  * ```#``` 注释
  * ```;``` 分号
  * ```\``` 转义
    * 转义: ```\n```, ```\r```, ```\t```, ```\$```, ```\"```, ```\\```
  * ```"```, ```'``` 引号

```
[root@frog-centos7 ~]# a=123
[root@frog-centos7 ~]# echo "$a"
123
[root@frog-centos7 ~]# echo '$a'
$a
```

> 注意上面执行结果, 双引号是不完全引用, 单引号是完全引用

#### 运算符

* 赋值运算符: ```=```
* 算数运算符: 
  * ```+, -, *, /, **, %```
  * ```expr 4 + 5```(expr只支持整数, 符号和数字之间需要有空格)
  * ```let 变量名=变量值```
  * ```((a=10))```, ```((a++))```, ```echo $((10+20))```

```
[root@frog-centos7 ~]# num1=`expr 4 + 5`
[root@frog-centos7 ~]# echo $num1
9
[root@frog-centos7 ~]# ((a=4+5))
[root@frog-centos7 ~]# echo $a
9
```

#### 特殊符号大全

符号|说明
-|-
 ```'```|引号, 完全引用
 ```"```|不完全引用
 `|执行命令
 ```()```|单独使用, 可以产生一个子shell(子shell复制, 父shell看不到); 数组初始化
 ```(())```|算数运算
 ```$()```|执行命令, 输出结果
 ```[]```|测试输出布尔值; 数组元素
 ```[[]]```|测试表达式
 ```< >```|重定向
 ```{ }``` | 输出范围```echo {0..9}```; 文件复制```cp -v /etc/passwd /etc/passwd.bak```替换为```cp -v /etc/passwd{,.bak}```
 ```+-*/%```| 算数运算符
 ```> = <```| 大小比较(在```[[]] (())```中)
 ```&& || !```| 布尔运算
 ```\```|转义字符
 ```#```|注释
 ```;```|命令分割符, case语句的分割符需要转义```;;```
 ```:```|空指令
 ```.```|同```source```
 ```~```|家目录
 ```,```|分割目录
 ```*```|通配符
 ```?```|条件测试;通配符
 ```$```|取值符号
 ```|```|管道
 ```&```|后台运行
 ``` ```|空格, 分割不同的命令

## 测试和判断

详细使用手册: ```man test```

如果使用```< >```, 需要使用```[[]]```

* if判断语句: if [ 测试条件成立 ] 或命令返回值是否为0 then 执行响应命令 fi 结束

```sh
#!/bin/bash

if [ 12 > 3 ]
then
    echo "right"
fi
```

```sh
#!/bin/bash

if [ $USER = root ] ; then
    echo "root user"
else
    echo "other user"
fi
```

```sh
#!/bin/bash

if [ $USER = root ]
then
    echo "root"
elif [ $USER = user1 ]
then
    echo "user1"
else
    echo "other"
fi
```

```sh
#!/bin/bash

if [ $UID = 0 ] ; then
    echo " please run "
    if [ -x /tmp/10.sh ] ;  then
          /tmp/10.sh
    fi
else
    echo " switch user root  "
fi
```

## case分支

```sh
#!/bin/bash

case "$1" in
    "start"|"START")
        echo $0 start...
    ;;
    "stop"|"STOP")
        echo $0 stop...
    ;;
    "restart"|"reload")
        echo $0 restart...
    ;;
    *)
        echo "Usage: $0 {start|stop|restart|reload}"
    ;;
esac
```

## for循环

```sh
for i in {1..9}
do
   echo $i
done
```

```sh
for filename in `ls *.sh`
do
    echo $filename
done
```

```sh
for sc_name in /etc/profile.d/*.sh
do
    if [ -x $sc_name ] ; then
        . $sc_name
    fi
done
```

也支持常规编程中的for循环, 但是不建议使用, 因为shell不擅长做计算

```sh
for (( i = 1 ; i <= 10 ; i++))
do
    echo $i
done
```

## while循环和until循环

```sh
a=1
while [ $a -lt 10 ]
do
    echo $a
    ((a++))
done
```

```sh
a=1
until [ $a -gt 10 ]
do
   echo $a
   (( a++ ))
done
```

## 跳转

```sh
for num in {1..9}
do
    if [ $num -eq 5 ] ; then
        break
    fi
    echo $num
done
```

```sh
for num in {1..9}
do
    if [ $num -eq 5 ] ; then
        continue
    fi
    echo $num
done
```

## 使用循环处理命令行参数

```sh
for pos in $*
do
    if [ $pos = "help" ]
    then
        echo $pos $pos
    fi
done
```

> ```$*```表示所有输入参数的列表

```sh
while [ $# -ge 1 ]
do
    if [ "$1" = "help" ] ; then
        echo $1 $1
    fi
    shift
done
```

> ```shift```可以将输入参数从队首开始出队

## 自定义函数

```sh
function cdls(){
   cd /var
   ls
}
```

> function可以省略
> 删除函数```unset <函数名>```

```sh
cdls(){
   cd $1
   ls
}
```

通过```local```声明变量的作用范围仅限于函数内:

```sh
checkpid() {

    local i

    for i in $* ; do
        [ -d "/proc/$i" ] && return 0
    done

    return 1
}
```


系统函数库: ```/etc/init.d/functions```, 可以通过```source /etc/init.d/functions```导入.

## 脚本控制

* 脚本优先级控制
  * 使用```nice```和```renice```调整脚本优先级
  * 避免出现不可控的死循环

fork炸弹:

```
func(){ func | func& }
```


## 信号

* kill默认会发送15号信号
* ctrl + c会发送2号信号给应用程序
* 9号信号不可阻塞

捕获2号和15号信号示例:

```sh
trap "echo sig 15" 15
trap "echo sig 2" 2

echo $$

while :
do
   :
done
```

## 计划任务

* 一次性计划任务at
* 周期性计划任务
* 计划任务加锁flock

需要注意的问题:

* 命令的搜索路径
* 命令的标准输入

#### 一次性计划任务

```
[root@frog-centos7 ~]# at 17:15
at> echo hello > /tmp/hello.txt
at> <EOT>
```

* ```atq```: 查询一次性计划任务列表

#### 周期性计划任务

用cron

* ```crontab -e```: 编辑计划任务
* ```crontab -l```: 查看计划任务
* 配置格式: ```分钟 小时 日期 月份 星期 执行的命令```, 注意周期性计划任务只能精确到分钟

通过```crontab -e```创建计划任务:

```
* * * * * /usr/bin/date >> /tmp/date.txt
```

每分钟, 向```/tmp/date.txt```文件输出内容.

```tail -f /var/log/cron```可以查看cron编辑和任务执行日志.

上面```crontab -e```创建的计划任务保存在目录```ls /var/spool/cron/```中, 每一个用户会有一个文件.

#### 计划任务加锁

* 如果计算机不能按照预期时间运行
  * anacrontab 延时计划任务
  * flock 锁文件

* ```flock -xn "/tmp/f.lock" -c "/root/a.sh"```: 执行任务时, 增加排它锁, 指定锁文件目录```/tmp/f.lock```