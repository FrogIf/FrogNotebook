# 事务

## 概述

事务控制的命令如下:

* START TRANSACTION | BEGIN [WORK] : 开启事务
* COMMIT [WORK] [AND [NO] CHAIN] [[NO] RELEASE] : 提交事务
* ROLLBACK [WORK] [AND [NO] CHAIN] [[NO] RELEASE] | ROLLBACK TO SAVEPOINT point_name: 回滚事务
* SET AUTOCOMMIT = {0|1} : 设置是否自动提交事务, 默认为1(自动提交)(实际上者就是一个session会话变量)
* SAVEPOINT : 回滚到指定的位置

> START TRANSACTION会导致一个隐式的unlock tables执行.

## 事务特性

ACID:

1. Atomicity - 原子性 : 一组操作要么同时成功, 要么同时失败.
2. Consistency - 一致性 : 一组数据有一种状态, 同时转为另一种状态.
3. Isolation - 隔离性 : 每个事务都是彼此独立的，不会受到其他事务的执行影响。也就是说一个事务在提交之前，对其他事务都是不可见的.
4. Durability - 持久性 : 事务提交后对数据的修改是持久的.

> 事务的特性中, 原子性是基础, 隔离性是手段, 一致性是约束条件, 持久性是目的.

> 同一个事务中最好不使用不同存储引擎的表, 否则ROLLBACK需要对非事务表进行特别处理, 因为COMMIT, ROLLBACK只能对事务类型的表进行提交和回滚.

## 事务的隔离级别

并发事务处理的问题:

1. 更新丢失 : 如果两个事务同时选择同一行, 并且基于相同的初始值进行更新, 就会导致最后的更新覆盖之前的更新.
2. 脏读 : 一个事务读取到另一个事务未提交的修改.
3. 不可重复读 : 一个事务读取到某些事务, 再次读取时发现刚刚读取的数据已经被删除或者修改.
4. 幻读 : 一个事务按照相同条件两次检索数据, 第二次却检索到其它事务新插入的数据.

> 更新丢失这种问题不能通过事务控制来解决, 需要应用程序级别的控制.(可以通过实现原子CAS来解决)

事务的隔离级别:

&nbsp;|数据一致性|脏读|不可重复读|幻读
-|-|-|-|-
未提交读(Read uncommitted)|最低级别, 只能保证不读取物理上损坏的数据|是|是|是
已提交读(Read committed)|语句级|否|是|是
可重复读(Repeatable read)|事务级|否|否|是
可序列化(Serializable)|最高级别, 事务级|否|否|否

## 实现方式

Innodb引擎通过**锁**和**多版本数据**实现一致性读和数据隔离

## 应用

```sql
mysql> select * from orders;
+-----------+---------------------+---------+
| order_num | order_date          | cust_id |
+-----------+---------------------+---------+
|     20005 | 2005-09-01 00:00:00 |   10001 |
|     20006 | 2005-09-12 00:00:00 |   10003 |
|     20007 | 2005-09-30 00:00:00 |   10004 |
|     20008 | 2005-10-03 00:00:00 |   10005 |
|     20009 | 2005-10-08 00:00:00 |   10001 |
|     20010 | 2006-01-10 00:00:00 |   10001 |
|     20011 | 2007-10-01 00:00:00 |   10002 |
|     20012 | 2008-11-01 00:00:00 |   10004 |
|     20014 | 2008-11-01 00:00:00 |   10003 |
+-----------+---------------------+---------+
9 rows in set (0.00 sec)

mysql> select * from products;
+---------+---------+----------------+------------+----------------------------------------------------------------+
| prod_id | vend_id | prod_name      | prod_price | prod_desc                                                      |
+---------+---------+----------------+------------+----------------------------------------------------------------+
| ANV01   |    1001 | .5 ton anvil   |       5.99 | .5 ton anvil, black, complete with handy hook                  |
| ANV02   |    1001 | 1 ton anvil    |       9.99 | 1 ton anvil, black, complete with handy hook and carrying case |
| ANV03   |    1001 | 2 ton anvil    |      14.99 | 2 ton anvil, black, complete with handy hook and carrying case |
| DTNTR   |    1003 | Detonator      |      13.00 | Detonator (plunger powered), fuses not included                |
| FB      |    1003 | Bird seed      |      10.00 | Large bag (suitable for road runners)                          |
| FC      |    1003 | Carrots        |       2.50 | Carrots (rabbit hunting season only)                           |
| FU1     |    1002 | Fuses          |       3.42 | 1 dozen, extra long                                            |
| JP1000  |    1005 | JetPack 1000   |      35.00 | JetPack 1000, intended for single use                          |
| JP2000  |    1005 | JetPack 2000   |      55.00 | JetPack 2000, multi-use                                        |
| OL1     |    1002 | Oil can        |       8.99 | Oil can, red                                                   |
| SAFE    |    1003 | Safe           |      50.00 | Safe with combination lock                                     |
| SLING   |    1003 | Sling          |       4.49 | Sling, one size fits all                                       |
| TNT1    |    1003 | TNT (1 stick)  |       2.50 | TNT, red, single stick                                         |
| TNT2    |    1003 | TNT (5 sticks) |      10.00 | TNT, red, pack of 10 sticks                                    |
+---------+---------+----------------+------------+----------------------------------------------------------------+
14 rows in set (0.00 sec)
mysql> start transaction;
Query OK, 0 rows affected (0.00 sec)

mysql> update orders set cust_id = 10002 where order_num = 20005;
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> savepoint test;
Query OK, 0 rows affected (0.00 sec)

mysql> update products set prod_desc = 'test';
Query OK, 14 rows affected (0.00 sec)
Rows matched: 14  Changed: 14  Warnings: 0

mysql> select * from products;
+---------+---------+----------------+------------+-----------+
| prod_id | vend_id | prod_name      | prod_price | prod_desc |
+---------+---------+----------------+------------+-----------+
| ANV01   |    1001 | .5 ton anvil   |       5.99 | test      |
| ANV02   |    1001 | 1 ton anvil    |       9.99 | test      |
| ANV03   |    1001 | 2 ton anvil    |      14.99 | test      |
| DTNTR   |    1003 | Detonator      |      13.00 | test      |
| FB      |    1003 | Bird seed      |      10.00 | test      |
| FC      |    1003 | Carrots        |       2.50 | test      |
| FU1     |    1002 | Fuses          |       3.42 | test      |
| JP1000  |    1005 | JetPack 1000   |      35.00 | test      |
| JP2000  |    1005 | JetPack 2000   |      55.00 | test      |
| OL1     |    1002 | Oil can        |       8.99 | test      |
| SAFE    |    1003 | Safe           |      50.00 | test      |
| SLING   |    1003 | Sling          |       4.49 | test      |
| TNT1    |    1003 | TNT (1 stick)  |       2.50 | test      |
| TNT2    |    1003 | TNT (5 sticks) |      10.00 | test      |
+---------+---------+----------------+------------+-----------+
14 rows in set (0.00 sec)

mysql> rollback to savepoint test;
Query OK, 0 rows affected (0.00 sec)

mysql> commit;
Query OK, 0 rows affected (0.00 sec)

mysql> select * from products;
+---------+---------+----------------+------------+----------------------------------------------------------------+
| prod_id | vend_id | prod_name      | prod_price | prod_desc                                                      |
+---------+---------+----------------+------------+----------------------------------------------------------------+
| ANV01   |    1001 | .5 ton anvil   |       5.99 | .5 ton anvil, black, complete with handy hook                  |
| ANV02   |    1001 | 1 ton anvil    |       9.99 | 1 ton anvil, black, complete with handy hook and carrying case |
| ANV03   |    1001 | 2 ton anvil    |      14.99 | 2 ton anvil, black, complete with handy hook and carrying case |
| DTNTR   |    1003 | Detonator      |      13.00 | Detonator (plunger powered), fuses not included                |
| FB      |    1003 | Bird seed      |      10.00 | Large bag (suitable for road runners)                          |
| FC      |    1003 | Carrots        |       2.50 | Carrots (rabbit hunting season only)                           |
| FU1     |    1002 | Fuses          |       3.42 | 1 dozen, extra long                                            |
| JP1000  |    1005 | JetPack 1000   |      35.00 | JetPack 1000, intended for single use                          |
| JP2000  |    1005 | JetPack 2000   |      55.00 | JetPack 2000, multi-use                                        |
| OL1     |    1002 | Oil can        |       8.99 | Oil can, red                                                   |
| SAFE    |    1003 | Safe           |      50.00 | Safe with combination lock                                     |
| SLING   |    1003 | Sling          |       4.49 | Sling, one size fits all                                       |
| TNT1    |    1003 | TNT (1 stick)  |       2.50 | TNT, red, single stick                                         |
| TNT2    |    1003 | TNT (5 sticks) |      10.00 | TNT, red, pack of 10 sticks                                    |
+---------+---------+----------------+------------+----------------------------------------------------------------+
14 rows in set (0.00 sec)

mysql> select * from orders;
+-----------+---------------------+---------+
| order_num | order_date          | cust_id |
+-----------+---------------------+---------+
|     20005 | 2005-09-01 00:00:00 |   10002 |
|     20006 | 2005-09-12 00:00:00 |   10003 |
|     20007 | 2005-09-30 00:00:00 |   10004 |
|     20008 | 2005-10-03 00:00:00 |   10005 |
|     20009 | 2005-10-08 00:00:00 |   10001 |
|     20010 | 2006-01-10 00:00:00 |   10001 |
|     20011 | 2007-10-01 00:00:00 |   10002 |
|     20012 | 2008-11-01 00:00:00 |   10004 |
|     20014 | 2008-11-01 00:00:00 |   10003 |
+-----------+---------------------+---------+
9 rows in set (0.00 sec)
```