# 存储引擎

## 概述

* mysql5.5之前默认存储引擎是MyISAM, 5.5及之后默认存储引擎为Innodb
* show engines;命令可以查看当前mysql支持的存储引擎

## MYSIAM

* 不支持事务
* 不支持外键
* 访问速度快

MyISAM引擎的每一个表都存储为三个文件, 文件名都与表名相同, 扩展名分别是:
* .frm 存储表的定义
* .MYD (MYData)存储数据
* .MYI (MYIndex)存储索引

支持三种存储格式:
* 静态(固定长度)表(默认存储格式): 字段都是非变长字段, 每一条记录的长度都是固定的. 优点是存储迅速, 容易缓存, 出现故障容易恢复; 确定是占用空间大.
* 动态表: 每一条记录的长度不固定, 占用空间小, 频繁更新删除会产生碎片, 需要定期指定OPTIMIZE TABLE来改善性能.
* 压缩表: 有myisampack工具创建. 占用磁盘空间极小.

## InnoDB

* 支持事务
* 支持外键

**自动增长列**

InnoDB的自动增长列必须是索引, 如果是组合索引, 也必须是组合索引的第一列. 但是对于MyISAM, 自动增长列可以是组合索引的其他列, 这样插入记录后, 自动增长列是按照组合索引前面几列.进行排序后递增的.

如下:
```sql
mysql> create table autoincre_demo
    -> (d1 int not null auto_increment,
    -> d2 int not null,
    -> name varchar(10),
    -> index(d2, d1)
    -> )engine=myisam;
Query OK, 0 rows affected (0.09 sec)

mysql> insert into autoincre_demo(d2, name)values(2, 'a'), (3,'b'),(4,'c'), (2, 'a'), (3, 'b'), (4, 'c');
Query OK, 6 rows affected (0.02 sec)
Records: 6  Duplicates: 0  Warnings: 0

mysql> select * from autoincre_demo;
+----+----+------+
| d1 | d2 | name |
+----+----+------+
|  1 |  2 | a    |
|  1 |  3 | b    |
|  1 |  4 | c    |
|  2 |  2 | a    |
|  2 |  3 | b    |
|  2 |  4 | c    |
+----+----+------+
6 rows in set (0.00 sec)
```

**外键约束**

mysql中只有InnoDB支持外键约束.

```sql
mysql> create table country(country_id int auto_increment not null, name varchar(10), primary key(country_id));
Query OK, 0 rows affected (0.28 sec)

mysql> create table city(
    -> city_id int auto_increment not null,
    -> name varchar(10) not null,
    -> country_id int not null,
    -> primary key(city_id),
    -> constraint `fk_city_country` foreign key (country_id) references country(country_id) on delete restrict on update cascade
    -> ) engine=InnoDB;
Query OK, 0 rows affected (0.33 sec)

mysql> insert into country(name)values('china'), ('en');
Query OK, 2 rows affected (0.09 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> select * from country;
+------------+-------+
| country_id | name  |
+------------+-------+
|          1 | china |
|          2 | en    |
+------------+-------+
2 rows in set (0.00 sec)

mysql> insert into city (country_id, name)values(1, 'Beijing');
Query OK, 1 row affected (0.04 sec)

mysql> select * from city;
+---------+---------+------------+
| city_id | name    | country_id |
+---------+---------+------------+
|       1 | Beijing |          1 |
+---------+---------+------------+
1 row in set (0.00 sec)

mysql> delete from country where country_id = 1;
ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key constraint fails (`frog`.`city`, CONSTRAINT `fk_city_country` FOREIGN KEY (`country_id`) REFERENCES `country` (`country_id`) ON UPDATE CASCADE)

mysql> update country set country_id = 100 where country_id = 1;
Query OK, 1 row affected (0.07 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> select * from country;
+------------+-------+
| country_id | name  |
+------------+-------+
|          2 | en    |
|        100 | china |
+------------+-------+
2 rows in set (0.00 sec)

mysql> select * from city;
+---------+---------+------------+
| city_id | name    | country_id |
+---------+---------+------------+
|       1 | Beijing |        100 |
+---------+---------+------------+
1 row in set (0.00 sec)
```

上面建表语句中, 外键约束处有:
```sql
on delete restrict on update cascade
```

用于指定删除, 更新父表的时候, 对子表的相应操作:
* restrict : 子表有关联记录的情况下, 父表不能更新
* no action : 同上
* cascade : 父表在更新删除时, 同时更新/删除子表对应的记录
* set null : 父表在更新删除时, 同时将子表对应记录的外键设置为null

> 在执行load data和alter table操作以及忽略顺序导入数据时, 可以暂时关闭外键检查: set foreign_key_checks=0;当操作完成后, 再打开检查:set foreign_key_checks=1;

**存储方式**

* 使用共享表空间存储: 表结构保存在.frm文件中, 数据和索引保存在innodb\_data\_home\_dir和innodb\_data\_file\_path定义的表空间中, 可以是多个文件.
* 使用多表空间存储: 表结构仍保留在.frm文件中, 但是每个表的数据和索引单独保存在.ibd中. 如果是分区表, 则每个分区对应单独的.idb文件, 文件名是"表名+分区名"

> 要是用多表空间存储, 需要设置innodb\_file\_per\_table

## MEMORY

数据存放在内存中的数据库.

```sql
mysql> select * from country;
+------------+-------+
| country_id | name  |
+------------+-------+
|          2 | en    |
|        100 | china |
+------------+-------+
2 rows in set (0.11 sec)

mysql> create table demo_memory engine=memory
    -> select * from country;
Query OK, 2 rows affected (1.69 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> show tables;
+----------------+
| Tables_in_frog |
+----------------+
| autoincre_demo |
| city           |
| country        |
| datetest       |
| demo_memory    |
| myisam_vc      |
| test           |
+----------------+
7 rows in set (0.00 sec)

mysql> select * from demo_memory;
+------------+-------+
| country_id | name  |
+------------+-------+
|          2 | en    |
|        100 | china |
+------------+-------+
2 rows in set (0.00 sec)
```
