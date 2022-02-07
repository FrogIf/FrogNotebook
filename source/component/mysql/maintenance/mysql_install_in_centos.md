# CentOS安装mysql

## 软件下载

1. 软件下载地址: https://www.mysql.com/downloads/
2. 选择community  server
3. 点击DOWLOAD
4. 选择版本

## 软件安装

1. 解压与部署

```
1. mkdir /usr/local/mysql

2. tar -zxvf mysql-5.7.26-linux-glibc2.12-x86_64.tar.gz

3. mv mysql-5.7.26-linux-glibc2.12-x86_64 /usr/local/mysql
```

2. 添加系统Mysql组和Mysql用户

```
groupadd mysql

useradd -r -g mysql mysql
```

3. 查看mysql数据目录
数据库数据默认目录datadir=/var/lib/mysql，可通过vim /etc/my.cnf 查看

```
[mysqld]
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock
user=mysql
# Disabling symbolic-links is recommended to prevent assorted security risks
symbolic-links=0

[mysqld_safe]
log-error=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid
```

4. 修改目录权限

```
chown -R mysql:mysql  ./
```

> 在/usr/local/mysql/里执行. 以下命令如无特殊指明, 均为在/usr/local/mysql/目录下执行

5. 执行安装命令

* 5.7版本:

```
bin/mysqld --initialize --user=mysql
```

* 5.7以前版本

```
./scripts/mysql_install_db --user=mysql
```

> 如果报错: ./bin/mysqld: error while loading shared libraries: libnuma.so.1: cannot open shared object file: No such file or directory
> 使用: yum install -y numactl 安装依赖

6. 修改权限为root

```
chown -R root:root .
chown -R mysql:mysql /var/lib/mysql
```

7. 添加启动服务

```
cp support-files/mysql.server /etc/init.d/mysql

service mysql start
```

> 这一步会生成一个root用户的初始密码, 要记住这个密码(这里我的密码是:0Y<aW:3G=S=D)

8. 设置root用户密码

在bin目录中执行

```
./mysql -uroot -p'0Y<aW:3G=S=D'
```

如果报错:

```
mysqladmin: connect to server at 'localhost' failed
error: 'Can't connect to local MySQL server through socket '/tmp/mysql.sock' (2)'
Check that mysqld is running and that the socket: '/tmp/mysql.sock' exists!
```

需要修改配置/etc/my.cnf:

```
[mysqld]
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock
user=mysql
# Disabling symbolic-links is recommended to prevent assorted security risks
symbolic-links=0

[mysqld_safe]
log-error=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid

[client]
socket=/var/lib/mysql/mysql.sock

[mysql]
socket=/var/lib/mysql/mysql.sock
```

然后重启服务:

```
service mysql restart
```

然后再执行:

```
./mysql -uroot -p'0Y<aW:3G=S=D'

alter user user() identified by "123456";
```

至此Mysql安装完成.


## 其他配置

* 建立超链接

如果想在系统各个目录下, 输入mysql -uroot -p...都得到执行, 需要建立超链接:

```
ln -s /usr/local/mysql/bin/mysql /usr/bin
```

因为系统会自动到 "/usr/bin"目录下寻找相关程序. 建立超链接之后就可以了.

* 开机自启

```
1. 将服务文件拷贝到init.d下，并重命名为mysql
cp /usr/local/mysql/support-files/mysql.server /etc/init.d/mysqld

2、赋予可执行权限
chmod +x /etc/init.d/mysqld

3、添加服务
chkconfig --add mysqld

4、显示服务列表
chkconfig --list

如果看到mysql的服务，并且3,4,5都是开的话则成功，如果是关，则键入:
    chkconfig --level 345 mysqld on
    
5、重启电脑
reboot
```

* 修改字符集编码

先查看一下当前字符集编码:

```
show variables like 'character%';
+--------------------------+----------------------------------+
| Variable_name            | Value                            |
+--------------------------+----------------------------------+
| character_set_client     | utf8                             |
| character_set_connection | utf8                             |
| character_set_database   | latin1                           |
| character_set_filesystem | binary                           |
| character_set_results    | utf8                             |
| character_set_server     | latin1                           |
| character_set_system     | utf8                             |
| character_sets_dir       | /usr/local/mysql/share/charsets/ |
+--------------------------+----------------------------------+

查看mysql支持的字符集 -->
show character set;
```

发现character_set_database和character_set_server采用的是latin1, 而其余为utf8, 而utf8是有问题的, 所以需要修改:

```
vi /etc/my.cnf
```

改为:

```
[mysqld]
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock
user=mysql
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
init_connect='SET NAMES utf8mb4'
skip-character-set-client-handshake = true
# Disabling symbolic-links is recommended to prevent assorted security risks
symbolic-links=0

[mysqld_safe]
log-error=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid

[client]
socket=/var/lib/mysql/mysql.sock
default-character-set=utf8mb4

[mysql]
socket=/var/lib/mysql/mysql.sock
default-character-set=utf8mb4
```

重启服务, 再次检查:

```
mysql> show variables like 'character%';
+--------------------------+----------------------------------+
| Variable_name            | Value                            |
+--------------------------+----------------------------------+
| character_set_client     | utf8mb4                          |
| character_set_connection | utf8mb4                          |
| character_set_database   | utf8mb4                          |
| character_set_filesystem | binary                           |
| character_set_results    | utf8mb4                          |
| character_set_server     | utf8mb4                          |
| character_set_system     | utf8                             |
| character_sets_dir       | /usr/local/mysql/share/charsets/ |
+--------------------------+----------------------------------+
```

修改成功.

* 允许远程使用root账户

```
[root@localhost ~]# mysql -uroot -p121212
mysql: [Warning] Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 5
Server version: 5.7.26 MySQL Community Server (GPL)

Copyright (c) 2000, 2019, Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> use mysql
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> select host from user where user='root';
+-----------+
| host      |
+-----------+
| localhost |
+-----------+
1 row in set (0.00 sec)

mysql> update user set host = '%' where user = 'root';
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> select host from user where user='root';
+------+
| host |
+------+
| %    |
+------+
1 row in set (0.00 sec)

mysql> flush privileges;
Query OK, 0 rows affected (0.00 sec)
```

> mysql8.0以上版本还需要别的操作, 详见[Ubuntu下安装mysql](../../../operation_system/linux/Ubuntu.html)