# DDL

## 概述

DDL(Data Definition Language), 数据库定义语言.

用于控制数据库, 表等的增删改查.

* 增: create
* 删: drop
* 改: alter
* 查: show

> 以下只介绍数据库, 表, 列的DDL语句, 至于视图, 存储过程等的DDL单独介绍.

## 增

**创建数据库**

```sql
CREATE DATABASE dbname;
```

**创建表**

```sql
CREATE TABLE tablename(
    column_name_1 column_type_1 constraints,
    column_name_2 column_type_2 constraints,
    ...
    column_name_n column_type_n  constraints
);
```

为了理解创建表的sql语句, 需要简单了解表与列的结构:

表的属性:

1. 表名
2. 列
3. 存储引擎
4. 字符集
5. 校对

列的属性:

1. 列名
2. 类型
3. 是否可以为空
4. 键类型
5. 默认值
6. 额外约束
7. 字符集
8. 校对

> 当然还有很多, 就不详细介绍了

**创建列**

见下面修改列里面的sql语句.

## 删

**删除数据库**

```sql
DROP DATABASE dbname;
```

**删除表**

```sql
DROP TABLE tablename;
```

**删除列**

见下面修改列里面的sql语句.

## 改

**修改表**

```sql
ALTER TABLE tablename RENAME [TO] new_tablename;
```

**修改列**

```sql
# 增加表字段
ALTER TABLE tablename ADD [COLUMN] column_definition [FIRST/AFTER col_name];

# 删除表字段
ALTER TABLE tablename DROP [COLUMN] col_name;

# 修改表字段定义
ALTER TABLE tablename MODIFY [COLUMN] column_definition [FIRST/AFTER col_name];

# 修改表字段名称
ALTER TABLE tablename CHANGE [COLUMN] old_col_name column_definition [FIRST/AFTER col_name];
```

> 关于change和modify, change是大的修改, modify是小的修改.

## 查

**查看数据库**

```sql
SHOW DATABASES;
```

**查看表**

```sql
SHOW TABLES;

SHOW CREATE TABLE tablename;
```

**查看列**

```sql
SHOW COLUMNS FROM tablename;

DESC tablename;
```

## 应用

```sql
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

mysql> create database frog;
Query OK, 1 row affected (0.34 sec)

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| crashcourse        |
| frog               |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
6 rows in set (0.00 sec)

mysql> use frog
Database changed

mysql> create table tb_test(
    -> id_ int not null auto_increment,
    -> name varchar(20) not null,
    -> age int null,
    -> sex char(1) null,
    -> primary key (id_)
    -> )engine=innodb;
Query OK, 0 rows affected (0.15 sec)

mysql> show tables;
+----------------+
| Tables_in_frog |
+----------------+
| tb_test        |
+----------------+
1 row in set (0.00 sec)

mysql> show columns from tb_test;
+-------+-------------+------+-----+---------+----------------+
| Field | Type        | Null | Key | Default | Extra          |
+-------+-------------+------+-----+---------+----------------+
| id_   | int(11)     | NO   | PRI | NULL    | auto_increment |
| name  | varchar(20) | NO   |     | NULL    |                |
| age   | int(11)     | YES  |     | NULL    |                |
| sex   | char(1)     | YES  |     | NULL    |                |
+-------+-------------+------+-----+---------+----------------+
4 rows in set (0.00 sec)

mysql> desc tb_test;
+-------+-------------+------+-----+---------+----------------+
| Field | Type        | Null | Key | Default | Extra          |
+-------+-------------+------+-----+---------+----------------+
| id_   | int(11)     | NO   | PRI | NULL    | auto_increment |
| name  | varchar(20) | NO   |     | NULL    |                |
| age   | int(11)     | YES  |     | NULL    |                |
| sex   | char(1)     | YES  |     | NULL    |                |
+-------+-------------+------+-----+---------+----------------+
4 rows in set (0.00 sec)

mysql> show create table tb_test;
+---------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Table   | Create Table                                                                                                                                                                                                                                                                                                |
+---------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| tb_test | CREATE TABLE `tb_test` (
  `id_` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `age` int(11) DEFAULT NULL,
  `sex` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci |
+---------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)

mysql> show create table tb_test \G;
*************************** 1. row ***************************
       Table: tb_test
Create Table: CREATE TABLE `tb_test` (
  `id_` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `age` int(11) DEFAULT NULL,
  `sex` char(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
1 row in set (0.00 sec)

ERROR:
No query specified

mysql> alter table tb_test rename tb_test_test;
Query OK, 0 rows affected (0.01 sec)

mysql> show tables;
+----------------+
| Tables_in_frog |
+----------------+
| tb_test_test   |
+----------------+
1 row in set (0.00 sec)

mysql> alter table tb_test_test add remark varchar(1000) after sex;
Query OK, 0 rows affected (0.39 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> desc tb_test_test;
+--------+---------------+------+-----+---------+----------------+
| Field  | Type          | Null | Key | Default | Extra          |
+--------+---------------+------+-----+---------+----------------+
| id_    | int(11)       | NO   | PRI | NULL    | auto_increment |
| name   | varchar(20)   | NO   |     | NULL    |                |
| age    | int(11)       | YES  |     | NULL    |                |
| sex    | char(1)       | YES  |     | NULL    |                |
| remark | varchar(1000) | YES  |     | NULL    |                |
+--------+---------------+------+-----+---------+----------------+
5 rows in set (0.00 sec)

mysql> alter table tb_test_test modify remark varchar(2000);
Query OK, 0 rows affected (0.00 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> desc tb_test_test;
+--------+---------------+------+-----+---------+----------------+
| Field  | Type          | Null | Key | Default | Extra          |
+--------+---------------+------+-----+---------+----------------+
| id_    | int(11)       | NO   | PRI | NULL    | auto_increment |
| name   | varchar(20)   | NO   |     | NULL    |                |
| age    | int(11)       | YES  |     | NULL    |                |
| sex    | char(1)       | YES  |     | NULL    |                |
| remark | varchar(2000) | YES  |     | NULL    |                |
+--------+---------------+------+-----+---------+----------------+
5 rows in set (0.00 sec)

mysql> alter table tb_test_test change remark remark_m varchar(2000);
Query OK, 0 rows affected (0.00 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> desc tb_test_test;
+----------+---------------+------+-----+---------+----------------+
| Field    | Type          | Null | Key | Default | Extra          |
+----------+---------------+------+-----+---------+----------------+
| id_      | int(11)       | NO   | PRI | NULL    | auto_increment |
| name     | varchar(20)   | NO   |     | NULL    |                |
| age      | int(11)       | YES  |     | NULL    |                |
| sex      | char(1)       | YES  |     | NULL    |                |
| remark_m | varchar(2000) | YES  |     | NULL    |                |
+----------+---------------+------+-----+---------+----------------+
5 rows in set (0.00 sec)

mysql> alter table tb_test_test drop remark_m;
Query OK, 0 rows affected (0.14 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> desc tb_test_test;
+-------+-------------+------+-----+---------+----------------+
| Field | Type        | Null | Key | Default | Extra          |
+-------+-------------+------+-----+---------+----------------+
| id_   | int(11)     | NO   | PRI | NULL    | auto_increment |
| name  | varchar(20) | NO   |     | NULL    |                |
| age   | int(11)     | YES  |     | NULL    |                |
| sex   | char(1)     | YES  |     | NULL    |                |
+-------+-------------+------+-----+---------+----------------+
4 rows in set (0.00 sec)

mysql> drop table tb_test_test;
Query OK, 0 rows affected (0.00 sec)

mysql> show tables;
Empty set (0.00 sec)

mysql> drop database frog;
Query OK, 0 rows affected (0.11 sec)

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