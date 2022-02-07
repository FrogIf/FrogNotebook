# 分区

## 概述

mysql从5.1开始支持分区功能. 分区是指根据指定的规则, 把数据库表分解成多个更小的, 更容易管理的部分. 对于访问数据库的应用而言, 逻辑上只有一个表或者索引, 每个分区都是独立的对象, 可以独自处理, 也可以作为标的一部分进行处理, 分区对于应用来说是完全透明的, 不影响应用的逻辑.

优点:
1. 相比于当个磁盘或者文件的分区相比, 可以存储更多数据.
2. 优化查询. 在where子句中包含分区条件时, 可以只扫描必要的一个或者多个分区来提高查询效率; 同时在涉及sum, count这类聚合函数查询时, 可容易的在每个分区并行处理, 最终只需汇总所有分区得到的结果.
3. 对于已经过期或者不需要保存的数据, 可以使用删除与这些写数据有关的分区来快速删除数据.
4. 跨多个磁盘分散数据查询, 已获得更大的查询吞吐量.

## 使用

**分区的类型**

* RANGE : 基于给定的连续区间范围, 把数据分配到不同的分区
* LIST : 类似RANGE分区, 但是LIST分区是基于不连续的枚举值列表进行分区
* HASH : 基于给定的分区个数, 把数据分配到不同分区
* KEY : 类似HASH分区

> mysql5.1中range, list, hash分区的分区键必须是int类型或者通过表达式返回int类型.只有key分区是支持其他类型的分区键. 5.5以上版中, 支持非整型的range, list分区.

> 无论哪种mysql分区类型, 分区表要么没有主键/唯一键, 要么主键/唯一键包含分区键. 也就是说不能使用主键/唯一键以外的字段进行分区(如果表中没有主键/唯一键就可以随便使用任意字段作为分区键了).

## RANGE分区

利用取值范围将数据分成分区, 区间要连续并且不能互相重叠.

```sql
mysql> create table p_range_test_1(id int not null, ename varchar(30), store_id int not null)
    -> partition by range (store_id)(
    -> partition p0 values less than (10),
    -> partition p1 values less than (20),
    -> partition p2 values less than (30)
    -> );
Query OK, 0 rows affected (0.46 sec)

mysql> insert into p_range_test_1 (id, ename, store_id) values(1, 't1', 3), (2, 't2', 15), (3, 't3', 25);
Query OK, 3 rows affected (0.03 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> select * from p_range_test_1;
+----+-------+----------+
| id | ename | store_id |
+----+-------+----------+
|  1 | t1    |        3 |
|  2 | t2    |       15 |
|  3 | t3    |       25 |
+----+-------+----------+
3 rows in set (0.00 sec)

mysql> insert into p_range_test_1 (id, ename, store_id) values (4, 't4', 36);
ERROR 1526 (HY000): Table has no partition for value 36
```

> 注意分区的定义需要按照顺序从低到高进行定义.

上面命令最后插入的值任何一个分区都不满足, 所以报错了, 可以这样解决:

```sql
mysql> alter table p_range_test_1 add partition (partition p3 values less than maxvalue);
Query OK, 0 rows affected (0.12 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> insert into p_range_test_1 (id, ename, store_id) values (4, 't4', 36);
Query OK, 1 row affected (0.00 sec)

mysql> select * from p_range_test_1;
+----+-------+----------+
| id | ename | store_id |
+----+-------+----------+
|  1 | t1    |        3 |
|  2 | t2    |       15 |
|  3 | t3    |       25 |
|  4 | t4    |       36 |
+----+-------+----------+
4 rows in set (0.00 sec)

```

mysql5.1如果想对日期分区, 需要这样做:

```sql
mysql> create table p_range_test_2(id varchar(10) not null, ename varchar(30), start_time datetime)
    -> partition by range (year(start_time))(
    ->    partition p0 values less than (1990),
    ->    partition p1 values less than (2000),
    ->    partition p2 values less than (2010)
    -> );
Query OK, 0 rows affected (0.26 sec)

mysql> insert into p_range_test_2 (id, ename, start_time) values ('a', 'a', '1980-03-11 12:00:00'), ('b', 'b', '1995-05-15 13:25:23');
Query OK, 2 rows affected (0.29 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> select * from p_range_test_2;
+----+-------+---------------------+
| id | ename | start_time          |
+----+-------+---------------------+
| a  | a     | 1980-03-11 12:00:00 |
| b  | b     | 1995-05-15 13:25:23 |
+----+-------+---------------------+
2 rows in set (0.00 sec)
```

mysql5.5支持直接对日期进行分区, 但是需要使用range columns来定义表:

```sql
mysql> create table p_range_test_3(ename varchar(30), start_time datetime)
    -> partition by range columns (start_time)(
    ->     partition p0 values less than ('1990-01-01 00:00:00'),
    ->     partition p1 values less than ('2000-01-01 00:00:00'),
    ->     partition p2 values less than ('2010-01-01 00:00:00')
    -> );
Query OK, 0 rows affected (0.23 sec)

mysql> insert into p_range_test_3(ename, start_time) values('a', '1980-03-11 12:00:00'), ('b', '1995-05-15 13:25:23');
Query OK, 2 rows affected (0.00 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> select * from p_range_test_3;
+-------+---------------------+
| ename | start_time          |
+-------+---------------------+
| a     | 1980-03-11 12:00:00 |
| b     | 1995-05-15 13:25:23 |
+-------+---------------------+
2 rows in set (0.00 sec)

```

range分区删除指定分区数据:

```sql
mysql> alter table p_range_test_1 drop partition p0;
Query OK, 0 rows affected (0.11 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> select * from p_range_test_1;
+----+-------+----------+
| id | ename | store_id |
+----+-------+----------+
|  2 | t2    |       15 |
|  3 | t3    |       25 |
|  4 | t4    |       36 |
+----+-------+----------+
3 rows in set (0.00 sec)

```

## List分区

```sql
mysql> create table p_list_test_1(sex, ename)
    -> partition by sex^C
mysql> create table p_list_test_1(sex int(1), ename varchar(30))
    -> partition by list(sex)(
    ->     partition p0 values in (1),
    ->     partition p1 values in (0)
    -> );
Query OK, 0 rows affected (0.20 sec)

mysql> insert into p_list_test_1(sex, ename) values(1, 'a'), (0, 'b');
Query OK, 2 rows affected (0.29 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> select * from p_list_test_1;
+------+-------+
| sex  | ename |
+------+-------+
|    1 | a     |
|    0 | b     |
+------+-------+
2 rows in set (0.00 sec)

mysql> create table p_list_test_2(category varchar(20), gname varchar(30))
    -> partition by list columns(category)(
    ->     partition p0 values in ('fruits', 'vegetables'),
    ->     partition p1 values in ('tools')
    -> );
Query OK, 0 rows affected (0.45 sec)

mysql> insert into p_list_test_2 (category, gname) values ('fruits', 'orange'), ('tools', 'knife');
Query OK, 2 rows affected (0.01 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> select * from p_list_test_2;
+----------+--------+
| category | gname  |
+----------+--------+
| fruits   | orange |
| tools    | knife  |
+----------+--------+
2 rows in set (0.00 sec)
```

## HASH分区

hash分区主要用于分散热电读, 确保数据在预先确定个数的分区中尽可能均匀分布.

**常规hash分区**

```sql
mysql> create table p_hash_test_1(store_id int primary key auto_increment, ename varchar(30))
    -> partition by hash (store_id) partitions 4;
Query OK, 0 rows affected (0.56 sec)

mysql> insert into p_hash_test_1 (ename) values ('a'), ('b'), ('c');
Query OK, 3 rows affected (0.01 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> select * from p_hash_test_1;
+----------+-------+
| store_id | ename |
+----------+-------+
|        1 | a     |
|        2 | b     |
|        3 | c     |
+----------+-------+
3 rows in set (0.00 sec)
```

常规哈希使用的算法是取余, 假设定义有4个hash分区, 则根据分区键key的值, 会被分配到(key%4)号分区上去.

**线性hash分区**

常规hash如果后期增加分区, 原来分区中的数据都需要重新分区, 所以常规hash不适合需要灵活变动分区的需求. 这时就需要使用线性hash分区.

```sql
mysql> create table p_hash_test_2(store_id int primary key auto_increment, ename varchar(30))
    -> partition by linear hash (store_id) partitions 4;
Query OK, 0 rows affected (0.29 sec)

mysql> insert into p_hash_test_2 (ename) values ('a'), ('b'), ('c');
Query OK, 3 rows affected (0.29 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> select * from p_hash_test_2;
+----------+-------+
| store_id | ename |
+----------+-------+
|        1 | a     |
|        2 | b     |
|        3 | c     |
+----------+-------+
3 rows in set (0.00 sec)
```

线性分区算法是这样的:

```txt
假设将要保存记录的分区编号为N; num是一个非负整数, 表示分割成分区的数量; key_value表示待插入数据的分区键值, 那么N可以通过以下算法得到.
1. 找到大于等于num的2的幂次:
    V = power(2, ceiling(log(2, num)))
2. 计算N = key_value & (V - 1)
3. 如果N >= num, 令N = N & (V - 1)
```

线性分区的优点是在分区维护是更迅速, 缺点是数据分布不太均匀.

## key分区

key分区与hash分区类似, 但是key分区不允许使用用户自定义的表达式, 需要使用mysql服务器提供的hash函数. key支持除blob和text以外的其他类型分区键.

```sql
mysql> create table p_key_test_1(id_ varchar(36) primary key, ename varchar(30)) partition by key(id_) partitions 4;
Query OK, 0 rows affected (0.59 sec)

mysql> insert into p_key_test_1 (id_, ename)values(uuid(), 'a'), (uuid(), 'b');
Query OK, 2 rows affected (0.28 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> select * from p_key_test_1;
+--------------------------------------+-------+
| id_                                  | ename |
+--------------------------------------+-------+
| dfbf0830-a5e8-11e9-a2ef-000c29374e46 | a     |
| dfbf0932-a5e8-11e9-a2ef-000c29374e46 | b     |
+--------------------------------------+-------+
2 rows in set (0.00 sec)
```

key分区也可以使用linear, 效果与hash相同:

```sql
mysql> create table p_key_test_2(id_ varchar(36) primary key, ename varchar(30)) partition by linear key (id_) partitions 4;
Query OK, 0 rows affected (0.25 sec)

mysql> insert into p_key_test_2 (id_, ename)values(uuid(), 'a'), (uuid(), 'b');
Query OK, 2 rows affected (0.00 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> select * from p_key_test_2;
+--------------------------------------+-------+
| id_                                  | ename |
+--------------------------------------+-------+
| 43073a40-a5e9-11e9-a2ef-000c29374e46 | a     |
| 43073b45-a5e9-11e9-a2ef-000c29374e46 | b     |
+--------------------------------------+-------+
2 rows in set (0.00 sec)
```

key分区可以不指定分区键, 这时会使用主键作为分区键, 如果没有主键, 会使用非空唯一键作为分区键. 如果没有主键也没有唯一键就必须手动指定分区键.

## Columns分区

就是上面range, list中使用的columns, mysql5.5开始支持.

columns分区分为两种: list columns, range columns.

columns分区支持整数(tinyint, smallint, mediumint, int, bigint), 日期(date, datetime), 字符串(char, varchar, binary, varbinary)作为分区键.

columns支持多列分区:

```sql
mysql> create table p_columns_test_1(a int, b int)
    -> partition by range columns (a, b)(
    ->     partition p0 values less than (0, 10),
    ->     partition p1 values less than (10, 10),
    ->     partition p2 values less than (10, 35),
    ->     partition p3 values less than (maxvalue, maxvalue)
    -> );
mysql> insert into p_columns_test_1 (a, b) values (1, 10);
Query OK, 1 row affected (0.29 sec)

mysql> select * from p_columns_test_1;
+------+------+
| a    | b    |
+------+------+
|    1 |   10 |
+------+------+
1 row in set (0.00 sec)

```

多列分区时插入规则与order by多列类似, 先检查第一列待插入值可以插入哪几个分区, 如果只有一个可以插入的分区, 直接插入, 如果有多个, 则检第二列值可以插入哪个分区, 然后再插入.

## 子分区

对每一个分区再进行分区. range分区和list分区可以进行子分区, 子分区需使用hash分区或者key分区.

```sql
mysql> create table p_sub_test_1(id_ int, ename varchar(30))
    -> partition by range(id_)
    -> subpartition by hash(ename) subpartitions 2
    -> (
    ->     partition p0 values less than (0),
    ->     partition p1 values less than (10),
    ->     partition p2 values less than (20),
    ->     partition p3 values less than (maxvalue)
    -> );
Query OK, 0 rows affected (0.66 sec)
```

## 分区处理null值

range分区中会把null值当做0值或者最小值处理, list分区中, null值必须出现在枚举列表中, 否则不被接受; hash/key分区中, null值被当做0值处理.

## RANGE&LIST分区管理

**删除分区**

```sql
ALTER TABLE DROP PARTITION partition_name;
```

**增加分区**

```sql
ALTER TABEL ADD PARTITION partition_name_define;
```

> 对于range分区, 只能向最大端增加分区, 不能在原有分区区间内继续新增分区.    
> 对于list分区, 不能添加包含现有分区枚举值的分区.

**重新定义分区**

```sql
ALTER TABLE REORGANIZE PARTITION partition_name1, ... INTO (
    partition_define_1, 
    ...
);
```

> 对于range分区, 重新定义分区时, 只能重新定义相邻的分区, 重新定义的分区必须覆盖之前分区所指定的所有区间.    
> 对于list分区, 重新定义时, 也只能定义相邻分区.

## HASH&KEY分区

**删除分区**

hash分区和key分区不能删除. 须使用合并分区替代:

```sql
ALTER TABLE COALESCE PARTITION partition_num;
```

**增加分区**

```sql
ALTER TABLE ADD PARTITION PARTITIONS partition_num;
```

