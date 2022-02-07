# 执行sql脚本

## 方法一

命令:
```
mysql -u用户名 -p密码 -D数据库 < 脚本
```

举例:
```
[root@localhost ~]# mysql -uroot -p121212 -Dcrashcourse < create.sql
mysql: [Warning] Using a password on the command line interface can be insecure.
```

## 方法二

进入mysql命令行之后, 选择好数据库. 执行:

```
mysql> source 脚本
```