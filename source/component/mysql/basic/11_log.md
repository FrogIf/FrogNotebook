# 日志

## 概述

这里只介绍server层的日志, 不会介绍引擎层的日志(比如:redo log)

* 错误日志
* 二进制日志
* 查询日志
* 慢查询日志

## 错误日志

记录了mysqld服务器运行过程中出现的故障.

**开启**

```txt
--log-error[=file_name]
```

> 不写file_name, 则使用host_name.err作为日志文件名, 并使用DATADIR(数据目录)作为存储目录

> 文本文件, 可以直接读取

## 二进制日志

binlog记录了所有DDL和DML, 但是不包括查询语句, 它描述的是数据的更改过程.

格式:

* STATEMENT : 日志中记录的是执行的sql语句. 日志量少, IO影响小; 某些情况下, slave日志复制会出错.
* ROW : 记录**每一行**的变更内容. 日志量大, IO影响大; 不会出现主从复制不一致的情况.
* MIXED : 上面两种方式的混合. 介于两者之间

**开启**

```txt
--log-bin[=file_name]
--binlog_format={STATEMENT|ROW|MIXED}
```

> 同错误日志, 不指定文件名时, 默认名为host_name-bin.\*\*\*\*

**读取**

不能直接读取, 需要使用mysqlbinlog工具进行查看.

```
shell> mysqlbinlog filename
```

**日志删除**

1. RESET MASTER : 删除所有日志.
2. PURGE MASTER LOGS TO 'mysql-bin.\*\*\*\*' : 删除编号"\*\*\*\*"之前的所有日志
3. PURGE MASTER LOGS BEFORE 'yyyy-mm-dd hh24:mi:ss' : 删除指定日期之前的日志
4. 设置--expire-logs_days= : 启动项中设置日志有效天数, 指定天数之后, 自动删除.

## 查询日志

记录所有查询, 修改, 插入等操作

**开启**

```txt
启动查询日志:
--general_log[={0|1}]
--general_log_file=filename
指定查询日志输出形式
--log-output[=value]
    value : TABLE|FILE|NONE  默认为文件
```

> 如果--log-output=TABLE, 会输出到general_log表中.

## 慢查询日志

记录所有执行时间超过long\_query\_time(单位:秒, 默认为10)并扫描记录数不小于min\_examined\_row\_limit的所有sql.

以下sql不会被记录:
* 管理语句 : 通过配置--log-slow-admin-statements启用记录
* 不使用索引的查询 : 通过配置log\_queries\_not\_using\_indexes启用记录

**启用**

```txt
--slow_query_log[={0|1}]
slow_query_log_file[=filename]
long_query_time=...
--log-output[=value]
    value : TABLE|FILE|NONE
```
