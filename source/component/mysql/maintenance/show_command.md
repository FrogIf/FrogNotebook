# Show命令

## 使用help show可以查看所有show命令

```
mysql> help show
Name: 'SHOW'
Description:
SHOW has many forms that provide information about databases, tables,
columns, or status information about the server. This section describes
those following:

SHOW {BINARY | MASTER} LOGS
SHOW BINLOG EVENTS [IN 'log_name'] [FROM pos] [LIMIT [offset,] row_count]
SHOW CHARACTER SET [like_or_where]
SHOW COLLATION [like_or_where]
SHOW [FULL] COLUMNS FROM tbl_name [FROM db_name] [like_or_where]
SHOW CREATE DATABASE db_name
SHOW CREATE EVENT event_name
SHOW CREATE FUNCTION func_name
SHOW CREATE PROCEDURE proc_name
SHOW CREATE TABLE tbl_name
SHOW CREATE TRIGGER trigger_name
SHOW CREATE VIEW view_name
SHOW DATABASES [like_or_where]
SHOW ENGINE engine_name {STATUS | MUTEX}
SHOW [STORAGE] ENGINES
SHOW ERRORS [LIMIT [offset,] row_count]
SHOW EVENTS
SHOW FUNCTION CODE func_name
SHOW FUNCTION STATUS [like_or_where]
SHOW GRANTS FOR user
SHOW INDEX FROM tbl_name [FROM db_name]
SHOW MASTER STATUS
SHOW OPEN TABLES [FROM db_name] [like_or_where]
SHOW PLUGINS
SHOW PROCEDURE CODE proc_name
SHOW PROCEDURE STATUS [like_or_where]
SHOW PRIVILEGES
SHOW [FULL] PROCESSLIST
SHOW PROFILE [types] [FOR QUERY n] [OFFSET n] [LIMIT n]
SHOW PROFILES
SHOW RELAYLOG EVENTS [IN 'log_name'] [FROM pos] [LIMIT [offset,] row_count]
SHOW SLAVE HOSTS
SHOW SLAVE STATUS [FOR CHANNEL channel]
SHOW [GLOBAL | SESSION] STATUS [like_or_where]
SHOW TABLE STATUS [FROM db_name] [like_or_where]
SHOW [FULL] TABLES [FROM db_name] [like_or_where]
SHOW TRIGGERS [FROM db_name] [like_or_where]
SHOW [GLOBAL | SESSION] VARIABLES [like_or_where]
SHOW WARNINGS [LIMIT [offset,] row_count]

like_or_where:
    LIKE 'pattern'
  | WHERE expr

If the syntax for a given SHOW statement includes a LIKE 'pattern'
part, 'pattern' is a string that can contain the SQL % and _ wildcard
characters. The pattern is useful for restricting statement output to
matching values.

Several SHOW statements also accept a WHERE clause that provides more
flexibility in specifying which rows to display. See
http://dev.mysql.com/doc/refman/5.7/en/extended-show.html.

URL: http://dev.mysql.com/doc/refman/5.7/en/show.html
```

## 查看数据库

```
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| crashcourse        |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.00 sec)
```

## 查看表

```
mysql> show tables;
+-----------------------+
| Tables_in_crashcourse |
+-----------------------+
| customers             |
| orderitems            |
| orders                |
| productnotes          |
| products              |
| vendors               |
+-----------------------+
6 rows in set (0.00 sec)
```

## 查看列

```
mysql> show columns from customers;
+--------------+-----------+------+-----+---------+----------------+
| Field        | Type      | Null | Key | Default | Extra          |
+--------------+-----------+------+-----+---------+----------------+
| cust_id      | int(11)   | NO   | PRI | NULL    | auto_increment |
| cust_name    | char(50)  | NO   |     | NULL    |                |
| cust_address | char(50)  | YES  |     | NULL    |                |
| cust_city    | char(50)  | YES  |     | NULL    |                |
| cust_state   | char(5)   | YES  |     | NULL    |                |
| cust_zip     | char(10)  | YES  |     | NULL    |                |
| cust_country | char(50)  | YES  |     | NULL    |                |
| cust_contact | char(50)  | YES  |     | NULL    |                |
| cust_email   | char(255) | YES  |     | NULL    |                |
+--------------+-----------+------+-----+---------+----------------+
9 rows in set (0.00 sec)
```

> 使用 show full columns from customers; 可以查看包含注释在内的更详细内容

或者

```
mysql> desc customers;
+--------------+-----------+------+-----+---------+----------------+
| Field        | Type      | Null | Key | Default | Extra          |
+--------------+-----------+------+-----+---------+----------------+
| cust_id      | int(11)   | NO   | PRI | NULL    | auto_increment |
| cust_name    | char(50)  | NO   |     | NULL    |                |
| cust_address | char(50)  | YES  |     | NULL    |                |
| cust_city    | char(50)  | YES  |     | NULL    |                |
| cust_state   | char(5)   | YES  |     | NULL    |                |
| cust_zip     | char(10)  | YES  |     | NULL    |                |
| cust_country | char(50)  | YES  |     | NULL    |                |
| cust_contact | char(50)  | YES  |     | NULL    |                |
| cust_email   | char(255) | YES  |     | NULL    |                |
+--------------+-----------+------+-----+---------+----------------+
9 rows in set (0.00 sec)
```

## 查看服务器状态

```
mysql> show status like 'Innodb%';
+---------------------------------------+--------------------------------------------------+
| Variable_name                         | Value                                            |
+---------------------------------------+--------------------------------------------------+
| Innodb_buffer_pool_dump_status        | Dumping of buffer pool not started               |
| Innodb_buffer_pool_load_status        | Buffer pool(s) load completed at 190609 16:03:28 |
| Innodb_buffer_pool_resize_status      |                                                  |
| Innodb_buffer_pool_pages_data         | 415                                              |
| Innodb_buffer_pool_bytes_data         | 6799360                                          |
| Innodb_buffer_pool_pages_dirty        | 0                                                |
| Innodb_buffer_pool_bytes_dirty        | 0                                                |
| Innodb_buffer_pool_pages_flushed      | 392                                              |
| Innodb_buffer_pool_pages_free         | 7776                                             |
| Innodb_buffer_pool_pages_misc         | 0                                                |
| Innodb_buffer_pool_pages_total        | 8191                                             |
| Innodb_buffer_pool_read_ahead_rnd     | 0                                                |
| Innodb_buffer_pool_read_ahead         | 0                                                |
| Innodb_buffer_pool_read_ahead_evicted | 0                                                |
| Innodb_buffer_pool_read_requests      | 8114                                             |
| Innodb_buffer_pool_reads              | 233                                              |
| Innodb_buffer_pool_wait_free          | 0                                                |
| Innodb_buffer_pool_write_requests     | 4399                                             |
| Innodb_data_fsyncs                    | 231                                              |
| Innodb_data_pending_fsyncs            | 0                                                |
| Innodb_data_pending_reads             | 0                                                |
| Innodb_data_pending_writes            | 0                                                |
| Innodb_data_read                      | 3887616                                          |
| Innodb_data_reads                     | 264                                              |
| Innodb_data_writes                    | 605                                              |
| Innodb_data_written                   | 11448832                                         |
| Innodb_dblwr_pages_written            | 281                                              |
| Innodb_dblwr_writes                   | 9                                                |
| Innodb_log_waits                      | 0                                                |
| Innodb_log_write_requests             | 414                                              |
| Innodb_log_writes                     | 146                                              |
| Innodb_os_log_fsyncs                  | 160                                              |
| Innodb_os_log_pending_fsyncs          | 0                                                |
| Innodb_os_log_pending_writes          | 0                                                |
| Innodb_os_log_written                 | 415232                                           |
| Innodb_page_size                      | 16384                                            |
| Innodb_pages_created                  | 183                                              |
| Innodb_pages_read                     | 232                                              |
| Innodb_pages_written                  | 392                                              |
| Innodb_row_lock_current_waits         | 0                                                |
| Innodb_row_lock_time                  | 0                                                |
| Innodb_row_lock_time_avg              | 0                                                |
| Innodb_row_lock_time_max              | 0                                                |
| Innodb_row_lock_waits                 | 0                                                |
| Innodb_rows_deleted                   | 0                                                |
| Innodb_rows_inserted                  | 967                                              |
| Innodb_rows_read                      | 1295                                             |
| Innodb_rows_updated                   | 0                                                |
| Innodb_num_open_files                 | 28                                               |
| Innodb_truncated_status_writes        | 0                                                |
| Innodb_available_undo_logs            | 128                                              |
+---------------------------------------+--------------------------------------------------+
51 rows in set (0.00 sec)
```

> 就是系统变量

* Com\_xxx : 可以查看每一个xxx语句的执行次数.(xxx可以是insert, select, update, delete等)
* Innodb\_rows\_xxx : 查看innodb引擎各种操作的次数.(xxx可以是insert, read, update, delete等), 并且回滚也会累加.
* Com\_commit, Com\_rollback: 记录提交和回滚的次数, 对于回滚频繁的数据库, 可能存在问题.
* Connections : 试图连接mysql服务器的次数
* Uptime : 服务器工作时间
* Slow_queries : 慢查询次数

## 查看数据库创建语句

```
mysql> show create database crashcourse \G;
*************************** 1. row ***************************
       Database: crashcourse
Create Database: CREATE DATABASE `crashcourse` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */
1 row in set (0.00 sec)

ERROR:
No query specified
```

## 查看表创建语句

```
mysql> show create table customers \G;
*************************** 1. row ***************************
       Table: customers
Create Table: CREATE TABLE `customers` (
  `cust_id` int(11) NOT NULL AUTO_INCREMENT,
  `cust_name` char(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cust_address` char(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cust_city` char(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cust_state` char(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cust_zip` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cust_country` char(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cust_contact` char(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cust_email` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`cust_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10006 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
1 row in set (0.00 sec)

ERROR:
No query specified
```

## 查看授权

```
mysql> show grants;
+-------------------------------------------------------------+
| Grants for root@%                                           |
+-------------------------------------------------------------+
| GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION |
+-------------------------------------------------------------+
1 row in set (0.00 sec)
```

## 查看错误和警告

```
mysql> update customer set ss = '123';
ERROR 1146 (42S02): Table 'crashcourse.customer' doesn't exist
mysql> show errors;
+-------+------+--------------------------------------------+
| Level | Code | Message                                    |
+-------+------+--------------------------------------------+
| Error | 1146 | Table 'crashcourse.customer' doesn't exist |
+-------+------+--------------------------------------------+
1 row in set (0.00 sec)
```

## show processlist

```
SHOW [FULL] processlist;
```

* SHOW PROCESSLIST显示正在运行(用户运行线程)的线程(或SHOW FULL PROCESSLIST显示更多信息)
* 您还可以从表或mysqladmin processlist命令获取此信息. 
* 如果你有这个PROCESS特权, 你可以看到所有的线程. 否则, 您只能看到自己的线程(即与您正在使用的MySQL帐户相关联的线程). 
* 如果不使用该FULL关键字, 则每个语句的前100个字符都将显示在该Info字段中.

> 可以理解为mysql的任务管理器.

如果收到"太多连接"错误消息, 并且想要了解发生了什么, 该命令非常有用. MySQL保留一个额外的连接以供有权限的帐户使用SUPER, 以确保管理员始终能够连接和检查系统(假设您没有向所有用户授予此权限).

除了show processlist命令, 查询INFORMATION\_SCHEMA.PROCESSLIST或者PERFORMANCE\_SCHEMA.THREADS表也可以得到同样的信息, 并且performance\_schema.threads获得信息不需要互斥锁, 对服务器性能影响最小, performance\_schema.threads还可以显示后台线程.

```sql
mysql> show processlist;
+----+------+-----------+------+---------+------+----------+------------------+
| Id | User | Host      | db   | Command | Time | State    | Info             |
+----+------+-----------+------+---------+------+----------+------------------+
|  2 | root | localhost | frog | Query   |    0 | starting | show processlist |
+----+------+-----------+------+---------+------+----------+------------------+
1 row in set (0.00 sec)

```

各列含义:

* id : 一个标识，你要kill一个语句的时候很有用.
* user : 显示当前用户，如果不是root，这个命令就只显示你权限范围内的sql语句
* host : 显示这个语句是从哪个ip 的哪个端口上发出的。可用来追踪出问题语句的用户
* db : 显示这个进程目前连接的是哪个数据库
* command : 显示这个线程此刻正在执行的命令，一般对应DDL或DML语句。
* time : 表示线程处于当前state的时间，单位是秒.
* state : 对应Command指令, 大多数状态对应于非常快速的操作. 如果线程在给定状态下保持多秒, 则可能存在需要调查的问题.
* info : 一般记录的是线程执行的语句. 默认只显示前100个字符, 也就是你看到的语句可能是截断了的, 要看全部信息, 需要使用 show full processlist.

---

* **Command可选值**

值|解释
-|-
Binlog Dump|这是主服务器上的线程，用于将二进制日志内容发送到从服务器。
Table Dump|线程将表内容发送到从服务器。
Change user|线程正在执行改变用户操作。
Close stmt|线程正在关闭准备好的语句。
Connect|复制中，从服务器连接到其主服务器。
Connect Out|复制中，从服务器正在连接到其主服务器。
Create DB|线程正在执行create-database操作。
Daemon|此线程在服务器内部，而不是服务客户端连接的线程。
Debug|线程正在生成调试信息。
Delayed insert|线程是一个延迟插入处理程序。
Drop DB|线程正在执行drop-database操作。
Execute|线程正在执行一个准备好的语句（prepare statement类型就是预编译的语句，JDBC支持次类型执行SQL）。
Fetch|线程正在执行一个准备语句的结果。
Field List|线程正在检索表列的信息。
Init DB|线程正在选择默认数据库。
Kill|线程正在杀死另一个线程。
Long Data|该线程在执行一个准备语句的结果中检索长数据。
Ping|线程正在处理服务器ping请求。
Prepare|线程正在为语句生成执行计划。
Processlist|线程正在生成有关服务器线程的信息。
Query|该线程正在执行一个语句。
Quit|线程正在终止。
Refresh|线程是刷新表，日志或缓存，或重置状态变量或复制服务器信息。
Register Slave|线程正在注册从服务器。
Reset stmt|线程正在重置一个准备好的语句。
Set optio|线程正在设置或重置客户端语句执行选项。
Shutdown|线程正在关闭服务器。
Sleep|线程正在等待客户端向其发送新的语句。
Statistics|线程正在生成服务器状态信息。
Time|


* **status可选值**

1. 一般线程状态(State)值

值|解释
-|-
After create | 当线程创建表(包括内部临时表)时, 会在创建表的函数的末尾创建. 即使由于某些错误而无法创建表, 也会使用此状态
Analyzing | 线程正在计算MyISAM表密钥分布(例如:for ANALYZE TABLE)
checking permissions | 线程正在检查服务器是否具有执行语句所需的权限
Checking table | 线程正在执行表检查操作
cleaning up | 线程已经处理了一个命令，正在准备释放内存并重置某些状态变量
closing tables | 线程将更改的表数据刷新到磁盘并关闭已用表。这应该是一个快速的操作。如果没有，请验证您是否没有完整的磁盘，并且磁盘没有被非常大的使用
copy to tmp table | 线程正在处理ALTER TABLE语句. 此状态发生在已创建新结构的表之后, 但是将行复制到该表之前. 对于此状态的线程, 可以使用性能模式来获取有关复制操作的进度
Copying to group table | 如果语句具有不同ORDER BY和GROUP BY标准, 各行按组排列和复制到一个临时表
Creating index | 线程正在处理ALTER TABLE … ENABLE KEYS一个MyISAM表
Creating sort index | 线程正在处理一个SELECT使用内部临时表解析的线程
creating table | 线程正在创建一个表，这包括创建临时表
committing alter table to storage engine | 服务器已经完成就位ALTER TABLE并提交结果
deleting from main table | 服务器正在执行多表删除的第一部分, 它仅从第一个表中删除, 并从其他（引用）表中保存要用于删除的列和偏移量
deleting from reference tables | 服务器正在执行多表删除的第二部分, 并从其他表中删除匹配的行
discard\_or\_import\_tablespace | 线程正在处理ALTER TABLE … DISCARD TABLESPACE或ALTER TABLE … IMPORT TABLESPACE声明
end | 这发生在结束, 但的清理之前ALTER TABLE, CREATE VIEW, DELETE, INSERT, SELECT或UPDATE语句
executing | 该线程已经开始执行一个语句
Execution of init\_command | 线程正在init\_command系统变量的值中执行语句
freeing items | 线程已经执行了一个命令, 在这种状态下完成的项目的一些释放涉及查询缓存, 这个状态通常在后面cleaning up
FULLTEXT initialization | 服务器正在准备执行自然语言全文搜索
init | 此操作在初始化ALTER TABLE, DELETE, INSERT, SELECT, or UPDATE之前发生, 服务器在该状态中采取的操作包括刷新二进制日志、Innodb日志和一些查询缓存清理操作. 对于最终状态, 可能会发生以下操作: 更改表中的数据后删除查询缓存项、将事件写入二进制日志、释放内存缓冲区, 包括blob.
Killed | 执行KILL语句, 向线程发送了一个声明, 下次检查kill标志时应该中断. 在MySQL的每个主循环中检查该标志, 但在某些情况下, 线程可能需要很短时间才能死掉. 如果线程被某个其他线程锁定, 则一旦其他线程释放锁定, 该kill就会生效
Locking system tables | 线程正在尝试锁定系统表(例如, 时区或日志表
login | 连接线程的初始状态, 直到客户端成功认证为止
manage keys | 服务器启用或禁用表索引
NULL | 该状态用于SHOW PROCESSLIST状态
Opening system tables | 线程尝试打开系统表(例如, 时区或日志表)
Opening tables | 线程正在尝试打开一个表, 这应该是非常快的程序, 除非有事情阻止打开. 例如, 一个ALTER TABLE或一个LOCK TABLE语句可以阻止打开一个表, 直到语句完成. 还可能需要关注table\_open\_cache参数的值是否足够大. 对于系统表, 使用Opening system tables状态
optimizing | 服务器正在执行查询的初始优化
preparing | 此状态发生在查询优化期间
Purging old relay logs | 线程正在删除不需要的中继日志文件
query end | 处理查询之后, freeing items状态之前会发生这种状态
Removing duplicates | 该查询的使用SELECT DISTINCT方式使得MySQL不能在早期阶段优化不同的操作. 因此, MySQL需要一个额外的阶段来删除所有重复的行, 然后将结果发送给客户端
removing tmp table | 处理语句后, 该线程正在删除一个内部临时表SELECT. 如果没有创建临时表, 则不使用该状态
rename | 线程正在重命名一个表
rename result table | 线程正在处理一个ALTER TABLE语句, 已经创建了新表, 并重新命名它来替换原始表
Reopen tables | 线程获得了表的锁, 但在获得基础表结构更改的锁之后注意到. 它释放了锁, 关闭了table, 并试图重新打开它
Repair by sorting | 修复代码正在使用排序来创建索引
preparing for alter table | 服务器正在准备就地执行ALTER TABLE
Repair done | 线程已经完成了一个MyISAM表的多线程修复
Repair with keycache | 修复代码通过密钥缓存逐个使用创建密钥, 这比慢得多Repair by sorting
Rolling back | 线程正在回滚事务
Saving state | 对于MyISAM表操作(如修复或分析),  线程将新的表状态保存到.MYI文件头. 状态包括行数, AUTO_INCREMENT计数器和键分布等信息
Searching rows for update | 线程正在进行第一阶段, 以便在更新之前查找所有匹配的行. 如果UPDATE要更改用于查找涉及的行的索引, 则必须执行此操作
setup | 线程正在开始一个ALTER TABLE操作
Sorting for group | 线程正在做一个满足一个GROUP BY
Sorting for order | 线程正在做一个满足一个ORDER BY
Sorting index | 线程是排序索引页，以便在MyISAM表优化操作期间更有效地访问。
Sorting result | 对于一个SELECT语句, 这类似于Creating sort index, 但是对于非临时表
statistics | 服务器正在计算统计信息以开发查询执行计划. 如果一个线程长时间处于这种状态, 服务器可能是磁盘绑定的, 执行其他工作
update | 线程正在准备开始更新表
Updating | 线程正在搜索要更新的行并正在更新它们
updating main table | 服务器正在执行多表更新的第一部分, 它仅更新第一个表, 并保存用于更新其他(引用)表的列和偏移量
updating reference tables | 服务器正在执行多表更新的第二部分, 并从其他表更新匹配的行
User lock | 线程将要求或正在等待通过GET_LOCK()呼叫请求的咨询锁定. 因为 SHOW PROFILE, 这个状态意味着线程正在请求锁定(不等待它)
User sleep | 线程调用了一个 SLEEP()调用

2. 故障诊断状态(State)值

值 | 解释
-|-
logging slow query | 线程正在向慢查询日志写入语句
altering table | 服务器正在执行就地ALTER TABLE
Receiving from client | 服务器正在从客户端读取数据包
Copying to tmp table | 服务器正在复制磁盘到内存的临时表, 是直接在磁盘创建的临时表而并非从内存转到磁盘的临时表
Copying to tmp table on disk | 对于线程将临时表从内存中更改为基于磁盘的格式存储以节省内存后, 又把临时表从磁盘复制到内存时的状态
Creating tmp table | 线程正在内存或磁盘上创建临时表. 如果表在内存中创建, 但后来转换为磁盘表, 则该操作中的状态将为Copying to tmp table on disk
Sending data | 线程正在读取和处理SELECT语句的行, 并将数据发送到客户端. 由于在此状态期间发生的操作往往执行大量的磁盘访问(读取), 所以在给定查询的整个生命周期内通常是最长的运行状态
Sending to client | 服务器正在向客户端写入数据包
Waiting for commit lock | FLUSH TABLES WITH READ LOCK正在等待提交锁。
Waiting for global read lock | FLUSH TABLES WITH READ LOCK正在等待全局读锁定或read\_only正在设置全局系统变量
Waiting for tables | 线程得到一个通知, 表格的底层结构已经改变, 需要重新打开表以获得新的结构. 但是, 要重新打开表格, 必须等到所有其他线程都关闭该表. <br/>如果另一个线程已使用FLUSH TABLES或下面的语句之一: FLUSH TABLES tbl_name, ALTER TABLE, RENAME TABLE, REPAIR TABLE, ANALYZE TABLE, 或OPTIMIZE TABLE都会发生通知
Waiting for table flush | 线程正在执行FLUSH TABLES并正在等待所有线程关闭它们的表, 或者线程得到一个通知, 表中的底层结构已经改变, 并且需要重新打开表以获得新的结构.<br/> 但是, 要重新打开表, 必须等到所有其他线程都关闭该表. <br/>如果另一个线程已使用FLUSH TABLES或下面的语句之一: FLUSH TABLES tbl_name, ALTER TABLE, RENAME TABLE, REPAIR TABLE, ANALYZE TABLE, 或OPTIMIZE TABLE都会发出这个通知
Waiting for lock\_type lock | 服务器正在等待THR\_LOCK从元数据锁定子系统获取锁或锁, 其中lock\_type指示锁的类型. THR\_LOCK状态表示: Waiting for table level lock; 这些状态表示等待元数据锁定 | Waiting for event metadata lock、Waiting for global read lock、Waiting for schema metadata lock、Waiting for stored function metadata lock、Waiting for stored procedure metadata lock、Waiting for table metadata lock、Waiting for trigger metadata lock
Writing to net | 服务器正在将数据包写入网络, 如果一个线程长时间在执行并且一直处于Writing to net状态, 那么一直在发送数据包到网络, 可以试着调整max\_allowed\_packet大小. 另外, 这可能会导致其他线程大量阻塞
Waiting on cond | 线程等待条件成为true的一般状态, 没有特定的状态信息可用
System lock | 线程已经调用mysql\_lock\_tables(), 且线程状态从未更新. 这是一个非常普遍的状态, 可能由于许多原因而发生. <br/>例如, 线程将请求或正在等待表的内部或外部系统锁. 当InnoDB在执行锁表时等待表级锁时, 可能会发生这种情况. <br/>如果此状态是由于请求外部锁而导致的, 并且不使用正在访问相同表的多个mysqld服务器MyISAM, 则可以使用该–skip-external-locking选项禁用外部系统锁. <br/>但是, 默认情况下禁用外部锁定, 因此这个选项很有可能不起作用. 因为SHOW PROFILE, 这个状态意味着线程正在请求锁定(不等待它). 对于系统表, 使用Locking system tables状态

3. 查询缓存状态(State)值(MYSQL8.0已经没有缓存了)

值|解释
-|-
checking privileges on cached query | 服务器正在检查用户是否具有访问缓存查询结果的权限
checking query cache for query | 服务器正在检查当前查询是否存在于查询缓存中
invalidating query cache entries | 查询缓存条目被标记为无效, 因为底层表已更改
sending cached result to client | 服务器正在从查询缓存中获取查询的结果, 并将其发送给客户端
storing result in query cache | 服务器将查询结果存储在查询缓存中
Waiting for query cache lock | 当会话正在等待采取查询缓存锁定时, 会发生此状态. 这种情况可能需要执行一些查询缓存操作, 如使查询缓存无效的INSERT或DELETE语句, 以及RESET QUERY CACHE等等

4. 事件调度器线程状态(State)值

> 这些状态适用于事件调度程序线程, 创建用于执行调度事件的线程或终止调度程序的线程

值|解释
-|-
Clearing | 调度程序线程或正在执行事件的线程正在终止，即将结束
Initialized | 调度程序线程或将执行事件的线程已初始化
Waiting for next activation | 调度程序具有非空事件队列, 但下一次激活是将来
Waiting for scheduler to stop | 线程发出SET GLOBAL event_scheduler=OFF并正在等待调度程序停止
Waiting on empty queue | 调度程序的事件队列是空的, 它正在休眠

5. 主从复制相关State值

MySQL的主从复制的基本原理是从库连接到主库, 主库生成一个主库DUMP线程, 该DUMP线程的主要任务是一直挖掘binlog日志, 然后发送到从库的IO线程, IO线程接收到日志流后, 写入relay log, 另一个线程SQL线程,会读取该relay log内容, 然后对sql语句进行重放.

主库线程状态(State)值:

> 以下列表显示了主从复制中主服务器的Binlog Dump线程的State列中可能看到的最常见状态, 如果Binlog Dump线程在主服务器上看不到, 这意味着复制没有运行, 也就是说, 目前没有连接任何Slave主机

值 | 解释
-|-
Sending binlog event to slave | 二进制日志由各种事件组成, 一个事件通常为一个更新加一些其它信息. 线程已经从二进制日志读取了一个事件并且正将它发送到从服务器
Finished reading one binlog; switching to next binlog | 线程已经读完二进制日志文件并且正打开下一个要发送到从服务器的日志文件
Has sent all binlog to slave; waiting for binlog to be updated | 线程已经从二进制日志读取所有主要的更新并已经发送到了从服务器. 线程现在正空闲, 等待由主服务器上新的更新导致的出现在二进制日志中的新事件
Waiting to finalize termination | 线程停止时发生的一个很简单的状态

从库I/O线程状态(State)值:

值 | 解释
-|-
Connecting to master | 线程正试图连接主服务器
Checking master version | 建立同主服务器之间的连接后立即临时出现的状态
Registering slave on master | 建立同主服务器之间的连接后立即临时出现的状态
Requesting binlog dump | 建立同主服务器之间的连接后立即临时出现的状态. 线程向主服务器发送一条请求, 索取从请求的二进制日志文件名和位置开始的二进制日志的内容
Waiting to reconnect after a failed binlog dump request | 如果二进制日志转储请求失败(由于没有连接), 线程进入睡眠状态, 然后定期尝试重新连接, 可以使用–master-connect-retry选项指定重试之间的间隔
Reconnecting after a failed binlog dump request | 线程正尝试重新连接主服务器
Waiting for master to send event | 线程已经连接上主服务器, 正等待二进制日志事件到达. 如果主服务器正空闲, 会持续较长的时间. 如果等待持续slave\_read\_timeout秒, 则发生超时. 此时, 线程认为连接被中断并企图重新连接
Queueing master event to the relay log | 线程已经读取一个事件, 正将它复制到中继日志供SQL线程来处理
Waiting to reconnect after a failed master event read | 读取时(由于没有连接)出现错误, 线程企图重新连接前将睡眠master-connect-retry秒
Reconnecting after a failed master event read | 线程正尝试重新连接主服务器, 当连接重新建立后, 状态变为Waiting for master to send event
Waiting for the slave SQL thread to free enough relay log space | 正使用一个非零relay\_log\_space\_limit值, 中继日志已经增长到其组合大小超过该值. I/O线程正等待直到SQL线程处理中继日志内容并删除部分中继日志文件来释放足够的空间
Waiting for slave mutex on exit | 线程停止时发生的一个很简单的状态

从库SQL线程状态(State)值:

值 | 解释
-|-
Reading event from the relay log | 线程已经从中继日志读取一个事件，可以对事件进行处理了
Has read all relay log; waiting for the slave I/O thread to update it | 线程已经处理了中继日志文件中的所有事件, 现在正等待I/O线程将新事件写入中继日志
Waiting for slave mutex on exit | 线程停止时发生的一个很简单的状态

从库连接线程状态(State)值:

> 这些线程状态发生在复制从库上, 但与连接线程相关联, 而不与I/O或SQL线程相关联

值 | 解释
-|-
Changing master | 线程正在处理CHANGE MASTER TO语句
Killing slave | 线程正在处理STOP SLAVE语句
Opening master dump table | 此状态发生在Creating table from master dump之后
Reading master dump table data | 此状态发生在Opening master dump table之后
Rebuilding the index on master dump table | 此状态发生在Reading master dump table data之后

## 如何kill掉一个线程

```sql
KILL id;
```

## show profile

show profiles 和show profile用来分析每条sql的执行过程.

改功能默认是关闭的, 可以通过set语句来在session级临时开启.

```sql
mysql> select @@have_profiling;
+------------------+
| @@have_profiling |
+------------------+
| YES              |
+------------------+
1 row in set, 1 warning (0.00 sec)

mysql> select @@profiling;
+-------------+
| @@profiling |
+-------------+
|           0 |
+-------------+
1 row in set, 1 warning (0.00 sec)

mysql> set @@profiling = 1;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> show warnings;
+---------+------+----------------------------------------------------------------------+
| Level   | Code | Message                                                              |
+---------+------+----------------------------------------------------------------------+
| Warning | 1287 | '@@profiling' is deprecated and will be removed in a future release. |
+---------+------+----------------------------------------------------------------------+
1 row in set (0.00 sec)

mysql> select * from customers;
+---------+----------------+---------------------+-----------+------------+----------+--------------+--------------+---------------------+
| cust_id | cust_name      | cust_address        | cust_city | cust_state | cust_zip | cust_country | cust_contact | cust_email          |
+---------+----------------+---------------------+-----------+------------+----------+--------------+--------------+---------------------+
|   10001 | Coyote Inc.    | 200 Maple Lane      | Detroit   | MI         | 44444    | USA          | Y Lee        | ylee@coyote.com     |
|   10002 | Mouse House    | 333 Fromage Lane    | Columbus  | OH         | 43333    | USA          | Jerry Mouse  | NULL                |
|   10003 | Wascals        | 1 Sunny Place       | Muncie    | IN         | 42222    | USA          | Jim Jones    | rabbit@wascally.com |
|   10004 | Yosemite Place | 829 Riverside Drive | Phoenix   | AZ         | 88888    | USA          | Y Sam        | sam@yosemite.com    |
|   10005 | E Fudd         | 4545 53rd Street    | Chicago   | IL         | 54545    | USA          | E Fudd       | NULL                |
|   10006 | frog           | aaa                 | bbb       | ON         | NULL     | NULL         | NULL         | NULL                |
+---------+----------------+---------------------+-----------+------------+----------+--------------+--------------+---------------------+
6 rows in set (0.00 sec)

mysql> show profiles;
+----------+------------+-------------------------+
| Query_ID | Duration   | Query                   |
+----------+------------+-------------------------+
|        1 | 0.00005625 | show warnings           |
|        2 | 0.00021825 | select * from customers |
+----------+------------+-------------------------+
2 rows in set, 1 warning (0.00 sec)

mysql> show profile for query 2;
+----------------------+----------+
| Status               | Duration |
+----------------------+----------+
| starting             | 0.000044 |
| checking permissions | 0.000007 |
| Opening tables       | 0.000014 |
| init                 | 0.000019 |
| System lock          | 0.000007 |
| optimizing           | 0.000003 |
| statistics           | 0.000009 |
| preparing            | 0.000009 |
| executing            | 0.000002 |
| Sending data         | 0.000070 |
| end                  | 0.000004 |
| query end            | 0.000006 |
| closing tables       | 0.000006 |
| freeing items        | 0.000010 |
| cleaning up          | 0.000009 |
+----------------------+----------+
15 rows in set, 1 warning (0.00 sec)

```

> have_profiling表明当前mysql是否支持profile.

> 上面查询出的status在show processlist中有详细列出.

> Duration表示执行时间

show profile for query query_id命令还有很多东西, 但是上面警告都提示这个命令已过时, 咱也不懂, 咱也不敢用. 就这么样吧.