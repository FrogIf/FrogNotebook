# DML

## 概述

DML(Data Manipulation Language), 数据操作语言.

主要用于操作数据的增删改查:

* 增: insert
* 删: delete
* 改: update
* 查: select

## 增

**插入单条数据**
```sql
INSERT INTO tablename (field1, field2, field3, ..., fieldn) VALUES (value1, value2, value3, ... , valuen);
```

**插入多条数据**

```sql
INSERT INTO tablename (field1, field2, field3, ..., fieldn) 
VALUES 
(value1, value2, value3, ... , valuen),
(value1, value2, value3, ... , valuen),
(value1, value2, value3, ... , valuen),
...
(value1, value2, value3, ... , valuen);
```

**插入检索出的数据**

```sql
INSERT INTO tablename (field1, field2, field3, ..., fieldn)
SELECT col_name1, col_name2, ..., col_namen FROM tablename2 ...;
```

## 删

**单表删除**

```sql
DELETE FROM tablename [WHERE CONDITION];
```

**多表删除**

```sql
DELETE tablename1, tablename2 ... tablenameN
FROM tablename1, tablename2 ... tablenameN 
[WHERE CONDITION];
```

## 改

**单表修改**

```sql
UPDATE tablename SET field1=value1, field2=value2, ... fieldn=valuen [WHERE CONDITION];
```

**多表修改**

```sql
UPDATE tablename1, tablename2, ... tablenamen
SET
tablename1.field1 = expr11, tablename1.field2 = expr12, ...
tablename2.field1 = expr21, tablename2.filed2 = expr22, ...
[WHERE CONDITION];
```

## 查

查询的内容比较多.

按照查询的方式分为:

1. 单表查询
2. 多表内连接
3. 多表外连接
4. 子查询
5. 联合查询

按照查询的SQL结构, 又有如下概念(排列顺序即为在sql语句中书写顺序):

1. SELECT子句
2. FROM子句
3. WHERE子句
4. GROUP BY 子句
5. HAVING子句
6. ORDER BY子句
7. LIMIT子句

**单表查询**

```sql
SELECT col_name1, col_name2, ... col_nameN 
FROM tablename
[WHERE CONDITION]
[GROUP BY ...]
[HAVING ...]
[ORDER BY ...]
[LIMIT];
```

**多表笛卡尔积**

```sql
SELECT
t1.col_name11, t1.col_name12, ... col_name1N,
t2.col_name21, t2.col_name22, ... col_name2N,
...
tn.col_nameN1, tn.col_nameN2, ... col_nameNN
FROM 
t1, t2, ... , tN
[WHERE CONDITION]
[GROUP BY ...]
[HAVING ...]
[ORDER BY ...]
[LIMIT];
```

**多表内连接**

```sql
SELECT
t1.col_name11, t1.col_name12, ... , t2.col_name1N,
t2.col_name21, t2.col_name22, ... , t2.col_name2N,
...
tn.col_nameN1, tn.col_nameN2, ... , tn.col_nameNN
FROM 
t1
[INNER] JOIN t2 [ON CONDITION]
...
[INNER] JOIN tn [ON CONDITION]
[WHERE CONDITION]
[GROUP BY ...]
[HAVING ...]
[ORDER BY ...]
[LIMIT];
```

**多表外连接**

```sql
SELECT
t1.col_name11, t1.col_name12, ... , t2.col_name1N,
t2.col_name21, t2.col_name22, ... , t2.col_name2N,
...
tn.col_nameN1, tn.col_nameN2, ... , tn.col_nameNN
FROM 
t1
[LEFT/RIGHT] [OUTER] JOIN t2 [ON CONDITION]
...
[LEFT/RIGHT] [OUTER] JOIN tn [ON CONDITION]
[WHERE CONDITION]
[GROUP BY ...]
[HAVING ...]
[ORDER BY ...]
[LIMIT];
```

**子查询**

1. 使用子查询进行条件过滤

```sql
SELECT
col_name1, col_name2, ..., col_nameN
FROM tablename1
where col_nameX in (SELECT col_nameY FROM tablename2 ...)
```

2. 使用子查询作为计算字段

```sql
SELECT col_name1, (
    SELECT ... FROM tablename2 ...
) FROM tablename1
```

**组合查询**

```sql
SELECT ...
UNION/UNION ALL
SELECT ...
UNION/UNION ALL
...;
```

> 有关查询涉及到的东西较多, 这里只是简单介绍一下

## 应用

**增**

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

mysql> use crashcourse
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
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

mysql> insert into customers(cust_name, cust_address, cust_city, cust_state, cust_zip)values('frog', 'aaa', 'bbb', '1', null);
Query OK, 1 row affected (0.29 sec)

mysql> select * from customers;
+---------+----------------+---------------------+-----------+------------+----------+--------------+--------------+---------------------+
| cust_id | cust_name      | cust_address        | cust_city | cust_state | cust_zip | cust_country | cust_contact | cust_email          |
+---------+----------------+---------------------+-----------+------------+----------+--------------+--------------+---------------------+
|   10001 | Coyote Inc.    | 200 Maple Lane      | Detroit   | MI         | 44444    | USA          | Y Lee        | ylee@coyote.com     |
|   10002 | Mouse House    | 333 Fromage Lane    | Columbus  | OH         | 43333    | USA          | Jerry Mouse  | NULL                |
|   10003 | Wascals        | 1 Sunny Place       | Muncie    | IN         | 42222    | USA          | Jim Jones    | rabbit@wascally.com |
|   10004 | Yosemite Place | 829 Riverside Drive | Phoenix   | AZ         | 88888    | USA          | Y Sam        | sam@yosemite.com    |
|   10005 | E Fudd         | 4545 53rd Street    | Chicago   | IL         | 54545    | USA          | E Fudd       | NULL                |
|   10006 | frog           | aaa                 | bbb       | 1          | NULL     | NULL         | NULL         | NULL                |
+---------+----------------+---------------------+-----------+------------+----------+--------------+--------------+---------------------+
6 rows in set (0.00 sec)

mysql> insert into customers values(10000, 'temp', 'sss', 'ccc', 'ON', '00000', 'CN', 'TM', 'dd@ww');
Query OK, 1 row affected (0.00 sec)

mysql> select * from customers;
+---------+----------------+---------------------+-----------+------------+----------+--------------+--------------+---------------------+
| cust_id | cust_name      | cust_address        | cust_city | cust_state | cust_zip | cust_country | cust_contact | cust_email          |
+---------+----------------+---------------------+-----------+------------+----------+--------------+--------------+---------------------+
|   10000 | temp           | sss                 | ccc       | ON         | 00000    | CN           | TM           | dd@ww               |
|   10001 | Coyote Inc.    | 200 Maple Lane      | Detroit   | MI         | 44444    | USA          | Y Lee        | ylee@coyote.com     |
|   10002 | Mouse House    | 333 Fromage Lane    | Columbus  | OH         | 43333    | USA          | Jerry Mouse  | NULL                |
|   10003 | Wascals        | 1 Sunny Place       | Muncie    | IN         | 42222    | USA          | Jim Jones    | rabbit@wascally.com |
|   10004 | Yosemite Place | 829 Riverside Drive | Phoenix   | AZ         | 88888    | USA          | Y Sam        | sam@yosemite.com    |
|   10005 | E Fudd         | 4545 53rd Street    | Chicago   | IL         | 54545    | USA          | E Fudd       | NULL                |
|   10006 | frog           | aaa                 | bbb       | 1          | NULL     | NULL         | NULL         | NULL                |
+---------+----------------+---------------------+-----------+------------+----------+--------------+--------------+---------------------+
7 rows in set (0.00 sec)

mysql> desc orders;
+------------+----------+------+-----+---------+----------------+
| Field      | Type     | Null | Key | Default | Extra          |
+------------+----------+------+-----+---------+----------------+
| order_num  | int(11)  | NO   | PRI | NULL    | auto_increment |
| order_date | datetime | NO   |     | NULL    |                |
| cust_id    | int(11)  | NO   | MUL | NULL    |                |
+------------+----------+------+-----+---------+----------------+
3 rows in set (0.00 sec)

mysql> insert into orders (order_date, cust_id)
    -> values
    -> ('2019-01-02', '10006'),
    -> ('2019-02-02', '10006'),
    -> ('2019-05-02', '10006'),
    -> ('2019-09-02', '10006'),
    -> ('2019-09-03', '10006'),
    -> ('2019-09-04', '10006');
Query OK, 6 rows affected (0.01 sec)
Records: 6  Duplicates: 0  Warnings: 0

mysql> select * from orders;
+-----------+---------------------+---------+
| order_num | order_date          | cust_id |
+-----------+---------------------+---------+
|     20005 | 2005-09-01 00:00:00 |   10001 |
|     20006 | 2005-09-12 00:00:00 |   10003 |
|     20007 | 2005-09-30 00:00:00 |   10004 |
|     20008 | 2005-10-03 00:00:00 |   10005 |
|     20009 | 2005-10-08 00:00:00 |   10001 |
|     20010 | 2019-01-02 00:00:00 |   10006 |
|     20011 | 2019-02-02 00:00:00 |   10006 |
|     20012 | 2019-05-02 00:00:00 |   10006 |
|     20013 | 2019-09-02 00:00:00 |   10006 |
|     20014 | 2019-09-03 00:00:00 |   10006 |
|     20015 | 2019-09-04 00:00:00 |   10006 |
+-----------+---------------------+---------+
11 rows in set (0.00 sec)

mysql> create table ordersnew(
    -> order_id int not null auto_increment,
    -> order_date datetime not null,
    -> cust_id int not null,
    -> primary key (order_id)
    -> );
Query OK, 0 rows affected (0.37 sec)

mysql> insert into ordersnew (order_date, cust_id)
    -> select order_date, cust_id
    -> from orders;
Query OK, 5 rows affected (1.65 sec)
Records: 5  Duplicates: 0  Warnings: 0

mysql> select * from ordersnew;
+----------+---------------------+---------+
| order_id | order_date          | cust_id |
+----------+---------------------+---------+
|        8 | 2005-09-01 00:00:00 |   10001 |
|        9 | 2005-09-12 00:00:00 |   10003 |
|       10 | 2005-09-30 00:00:00 |   10004 |
|       11 | 2005-10-03 00:00:00 |   10005 |
|       12 | 2005-10-08 00:00:00 |   10001 |
|       13 | 2019-01-02 00:00:00 |   10006 |
|       14 | 2019-02-02 00:00:00 |   10006 |
|       15 | 2019-05-02 00:00:00 |   10006 |
|       16 | 2019-09-02 00:00:00 |   10006 |
|       17 | 2019-09-03 00:00:00 |   10006 |
|       18 | 2019-09-04 00:00:00 |   10006 |
+----------+---------------------+---------+
11 rows in set (0.00 sec)
```

**删**

```sql
mysql> delete from customers where cust_name = 'temp';
Query OK, 1 row affected (0.00 sec)

mysql> select * from customers;
+---------+----------------+---------------------+-----------+------------+----------+--------------+--------------+---------------------+
| cust_id | cust_name      | cust_address        | cust_city | cust_state | cust_zip | cust_country | cust_contact | cust_email          |
+---------+----------------+---------------------+-----------+------------+----------+--------------+--------------+---------------------+
|   10001 | Coyote Inc.    | 200 Maple Lane      | Detroit   | MI         | 44444    | USA          | Y Lee        | ylee@coyote.com     |
|   10002 | Mouse House    | 333 Fromage Lane    | Columbus  | OH         | 43333    | USA          | Jerry Mouse  | NULL                |
|   10003 | Wascals        | 1 Sunny Place       | Muncie    | IN         | 42222    | USA          | Jim Jones    | rabbit@wascally.com |
|   10004 | Yosemite Place | 829 Riverside Drive | Phoenix   | AZ         | 88888    | USA          | Y Sam        | sam@yosemite.com    |
|   10005 | E Fudd         | 4545 53rd Street    | Chicago   | IL         | 54545    | USA          | E Fudd       | NULL                |
|   10006 | frog           | aaa                 | bbb       | 1          | NULL     | NULL         | NULL         | NULL                |
+---------+----------------+---------------------+-----------+------------+----------+--------------+--------------+---------------------+
6 rows in set (0.00 sec)

mysql> delete orders from orders, customers where orders.cust_id = customers.cust_id and customers.cust_name = 'frog' and orders.order_date < '2019-09-01';
Query OK, 3 rows affected (0.01 sec)

mysql> select * from orders;
+-----------+---------------------+---------+
| order_num | order_date          | cust_id |
+-----------+---------------------+---------+
|     20005 | 2005-09-01 00:00:00 |   10001 |
|     20006 | 2005-09-12 00:00:00 |   10003 |
|     20007 | 2005-09-30 00:00:00 |   10004 |
|     20008 | 2005-10-03 00:00:00 |   10005 |
|     20009 | 2005-10-08 00:00:00 |   10001 |
|     20013 | 2019-09-02 00:00:00 |   10006 |
|     20014 | 2019-09-03 00:00:00 |   10006 |
|     20015 | 2019-09-04 00:00:00 |   10006 |
+-----------+---------------------+---------+
8 rows in set (0.00 sec)

mysql> delete from orders where orders.cust_id in (select cust_id from customers where cust_name = 'frog');
Query OK, 3 rows affected (0.02 sec)

mysql> select * from orders;
+-----------+---------------------+---------+
| order_num | order_date          | cust_id |
+-----------+---------------------+---------+
|     20005 | 2005-09-01 00:00:00 |   10001 |
|     20006 | 2005-09-12 00:00:00 |   10003 |
|     20007 | 2005-09-30 00:00:00 |   10004 |
|     20008 | 2005-10-03 00:00:00 |   10005 |
|     20009 | 2005-10-08 00:00:00 |   10001 |
+-----------+---------------------+---------+
5 rows in set (0.00 sec)

```

**改**

```sql
mysql> update customers set cust_state = 'ON' where cust_name = 'frog';
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> select * from customers where cust_name = 'frog';
+---------+-----------+--------------+-----------+------------+----------+--------------+--------------+------------+
| cust_id | cust_name | cust_address | cust_city | cust_state | cust_zip | cust_country | cust_contact | cust_email |
+---------+-----------+--------------+-----------+------------+----------+--------------+--------------+------------+
|   10006 | frog      | aaa          | bbb       | ON         | NULL     | NULL         | NULL         | NULL       |
+---------+-----------+--------------+-----------+------------+----------+--------------+--------------+------------+
1 row in set (0.01 sec)

mysql> update ordersnew o, customers c set o.order_date = '2019-06-16' where o.cust_id = c.cust_id and c.cust_name = 'frog';
Query OK, 6 rows affected (0.29 sec)
Rows matched: 6  Changed: 6  Warnings: 0

mysql> select * from ordersnew;
+----------+---------------------+---------+
| order_id | order_date          | cust_id |
+----------+---------------------+---------+
|        8 | 2005-09-01 00:00:00 |   10001 |
|        9 | 2005-09-12 00:00:00 |   10003 |
|       10 | 2005-09-30 00:00:00 |   10004 |
|       11 | 2005-10-03 00:00:00 |   10005 |
|       12 | 2005-10-08 00:00:00 |   10001 |
|       13 | 2019-06-16 00:00:00 |   10006 |
|       14 | 2019-06-16 00:00:00 |   10006 |
|       15 | 2019-06-16 00:00:00 |   10006 |
|       16 | 2019-06-16 00:00:00 |   10006 |
|       17 | 2019-06-16 00:00:00 |   10006 |
|       18 | 2019-06-16 00:00:00 |   10006 |
+----------+---------------------+---------+
11 rows in set (0.00 sec)

mysql> update ordersnew set order_date = '2019-06-01' where cust_id = (select cust_id from customers where cust_name = 'frog');
Query OK, 6 rows affected (0.00 sec)
Rows matched: 6  Changed: 6  Warnings: 0

mysql> select * from ordersnew where cust_id = (select cust_id from customers where cust_name = 'frog');
+----------+---------------------+---------+
| order_id | order_date          | cust_id |
+----------+---------------------+---------+
|       13 | 2019-06-01 00:00:00 |   10006 |
|       14 | 2019-06-01 00:00:00 |   10006 |
|       15 | 2019-06-01 00:00:00 |   10006 |
|       16 | 2019-06-01 00:00:00 |   10006 |
|       17 | 2019-06-01 00:00:00 |   10006 |
|       18 | 2019-06-01 00:00:00 |   10006 |
+----------+---------------------+---------+
6 rows in set (0.00 sec)

```

**查**

```sql
mysql> select count(cust_id) from ordersnew group by cust_id;
+----------------+
| count(cust_id) |
+----------------+
|              2 |
|              1 |
|              1 |
|              1 |
|              6 |
+----------------+
5 rows in set (0.00 sec)

mysql> select count(cust_id) from ordersnew group by cust_id having count(cust_id) > 1;
+----------------+
| count(cust_id) |
+----------------+
|              2 |
|              6 |
+----------------+
2 rows in set (0.00 sec)

mysql> select * from ordersnew order by order_date desc;
+----------+---------------------+---------+
| order_id | order_date          | cust_id |
+----------+---------------------+---------+
|       13 | 2019-06-01 00:00:00 |   10006 |
|       14 | 2019-06-01 00:00:00 |   10006 |
|       15 | 2019-06-01 00:00:00 |   10006 |
|       16 | 2019-06-01 00:00:00 |   10006 |
|       17 | 2019-06-01 00:00:00 |   10006 |
|       18 | 2019-06-01 00:00:00 |   10006 |
|       12 | 2005-10-08 00:00:00 |   10001 |
|       11 | 2005-10-03 00:00:00 |   10005 |
|       10 | 2005-09-30 00:00:00 |   10004 |
|        9 | 2005-09-12 00:00:00 |   10003 |
|        8 | 2005-09-01 00:00:00 |   10001 |
+----------+---------------------+---------+
11 rows in set (0.00 sec)

mysql> select * from ordersnew order by order_date desc limit 5;
+----------+---------------------+---------+
| order_id | order_date          | cust_id |
+----------+---------------------+---------+
|       14 | 2019-06-01 00:00:00 |   10006 |
|       15 | 2019-06-01 00:00:00 |   10006 |
|       16 | 2019-06-01 00:00:00 |   10006 |
|       17 | 2019-06-01 00:00:00 |   10006 |
|       18 | 2019-06-01 00:00:00 |   10006 |
+----------+---------------------+---------+
5 rows in set (0.00 sec)

mysql> select * from ordersnew order by order_date desc limit 5, 5;
+----------+---------------------+---------+
| order_id | order_date          | cust_id |
+----------+---------------------+---------+
|       18 | 2019-06-01 00:00:00 |   10006 |
|       12 | 2005-10-08 00:00:00 |   10001 |
|       11 | 2005-10-03 00:00:00 |   10005 |
|       10 | 2005-09-30 00:00:00 |   10004 |
|        9 | 2005-09-12 00:00:00 |   10003 |
+----------+---------------------+---------+
5 rows in set (0.00 sec)

mysql> select * from ordersnew order by order_date desc limit 10, 5;
+----------+---------------------+---------+
| order_id | order_date          | cust_id |
+----------+---------------------+---------+
|        8 | 2005-09-01 00:00:00 |   10001 |
+----------+---------------------+---------+
1 row in set (0.00 sec)

mysql> select c.cust_name, c.cust_address, c.cust_city, o.order_date from customers c, ordersnew o where c.cust_id = o.cust_id;
+----------------+---------------------+-----------+---------------------+
| cust_name      | cust_address        | cust_city | order_date          |
+----------------+---------------------+-----------+---------------------+
| Coyote Inc.    | 200 Maple Lane      | Detroit   | 2005-09-01 00:00:00 |
| Wascals        | 1 Sunny Place       | Muncie    | 2005-09-12 00:00:00 |
| Yosemite Place | 829 Riverside Drive | Phoenix   | 2005-09-30 00:00:00 |
| E Fudd         | 4545 53rd Street    | Chicago   | 2005-10-03 00:00:00 |
| Coyote Inc.    | 200 Maple Lane      | Detroit   | 2005-10-08 00:00:00 |
| frog           | aaa                 | bbb       | 2019-06-01 00:00:00 |
| frog           | aaa                 | bbb       | 2019-06-01 00:00:00 |
| frog           | aaa                 | bbb       | 2019-06-01 00:00:00 |
| frog           | aaa                 | bbb       | 2019-06-01 00:00:00 |
| frog           | aaa                 | bbb       | 2019-06-01 00:00:00 |
| frog           | aaa                 | bbb       | 2019-06-01 00:00:00 |
+----------------+---------------------+-----------+---------------------+
11 rows in set (0.00 sec)

mysql> select c.cust_name, c.cust_address, c.cust_city, o.order_date from customers c inner join ordersnew o on c.cust_id = o.cust_id;
+----------------+---------------------+-----------+---------------------+
| cust_name      | cust_address        | cust_city | order_date          |
+----------------+---------------------+-----------+---------------------+
| Coyote Inc.    | 200 Maple Lane      | Detroit   | 2005-09-01 00:00:00 |
| Wascals        | 1 Sunny Place       | Muncie    | 2005-09-12 00:00:00 |
| Yosemite Place | 829 Riverside Drive | Phoenix   | 2005-09-30 00:00:00 |
| E Fudd         | 4545 53rd Street    | Chicago   | 2005-10-03 00:00:00 |
| Coyote Inc.    | 200 Maple Lane      | Detroit   | 2005-10-08 00:00:00 |
| frog           | aaa                 | bbb       | 2019-06-01 00:00:00 |
| frog           | aaa                 | bbb       | 2019-06-01 00:00:00 |
| frog           | aaa                 | bbb       | 2019-06-01 00:00:00 |
| frog           | aaa                 | bbb       | 2019-06-01 00:00:00 |
| frog           | aaa                 | bbb       | 2019-06-01 00:00:00 |
| frog           | aaa                 | bbb       | 2019-06-01 00:00:00 |
+----------------+---------------------+-----------+---------------------+
11 rows in set (0.00 sec)

mysql> select c.cust_name, c.cust_address, c.cust_city, o.order_date from customers c left join ordersnew o on c.cust_id = o.cust_id;
+----------------+---------------------+-----------+---------------------+
| cust_name      | cust_address        | cust_city | order_date          |
+----------------+---------------------+-----------+---------------------+
| Coyote Inc.    | 200 Maple Lane      | Detroit   | 2005-09-01 00:00:00 |
| Wascals        | 1 Sunny Place       | Muncie    | 2005-09-12 00:00:00 |
| Yosemite Place | 829 Riverside Drive | Phoenix   | 2005-09-30 00:00:00 |
| E Fudd         | 4545 53rd Street    | Chicago   | 2005-10-03 00:00:00 |
| Coyote Inc.    | 200 Maple Lane      | Detroit   | 2005-10-08 00:00:00 |
| frog           | aaa                 | bbb       | 2019-06-01 00:00:00 |
| frog           | aaa                 | bbb       | 2019-06-01 00:00:00 |
| frog           | aaa                 | bbb       | 2019-06-01 00:00:00 |
| frog           | aaa                 | bbb       | 2019-06-01 00:00:00 |
| frog           | aaa                 | bbb       | 2019-06-01 00:00:00 |
| frog           | aaa                 | bbb       | 2019-06-01 00:00:00 |
| Mouse House    | 333 Fromage Lane    | Columbus  | NULL                |
+----------------+---------------------+-----------+---------------------+
12 rows in set (0.00 sec)

mysql> select c.cust_name, c.cust_address, c.cust_city, o.order_date from customers c right join ordersnew o on c.cust_id = o.cust_id;
+----------------+---------------------+-----------+---------------------+
| cust_name      | cust_address        | cust_city | order_date          |
+----------------+---------------------+-----------+---------------------+
| Coyote Inc.    | 200 Maple Lane      | Detroit   | 2005-09-01 00:00:00 |
| Wascals        | 1 Sunny Place       | Muncie    | 2005-09-12 00:00:00 |
| Yosemite Place | 829 Riverside Drive | Phoenix   | 2005-09-30 00:00:00 |
| E Fudd         | 4545 53rd Street    | Chicago   | 2005-10-03 00:00:00 |
| Coyote Inc.    | 200 Maple Lane      | Detroit   | 2005-10-08 00:00:00 |
| frog           | aaa                 | bbb       | 2019-06-01 00:00:00 |
| frog           | aaa                 | bbb       | 2019-06-01 00:00:00 |
| frog           | aaa                 | bbb       | 2019-06-01 00:00:00 |
| frog           | aaa                 | bbb       | 2019-06-01 00:00:00 |
| frog           | aaa                 | bbb       | 2019-06-01 00:00:00 |
| frog           | aaa                 | bbb       | 2019-06-01 00:00:00 |
+----------------+---------------------+-----------+---------------------+
11 rows in set (0.00 sec)

mysql> select cust_name, (select count(order_id) from ordersnew where ordersnew.cust_id = customers.cust_id) as total from customers where cust_id in (select cust_id from ordersnew where order_date > '2019-05-30');
+-----------+-------+
| cust_name | total |
+-----------+-------+
| frog      |     6 |
+-----------+-------+
1 row in set (0.00 sec)

mysql> update ordersnew, orders set ordersnew.order_id = orders.order_num where ordersnew.order_date = orders.order_date and ordersnew.cust_id = orders.cust_id;
Query OK, 5 rows affected (0.36 sec)
Rows matched: 5  Changed: 5  Warnings: 0

mysql> select * from orders union select * from ordersnew;
+-----------+---------------------+---------+
| order_num | order_date          | cust_id |
+-----------+---------------------+---------+
|     20005 | 2005-09-01 00:00:00 |   10001 |
|     20006 | 2005-09-12 00:00:00 |   10003 |
|     20007 | 2005-09-30 00:00:00 |   10004 |
|     20008 | 2005-10-03 00:00:00 |   10005 |
|     20009 | 2005-10-08 00:00:00 |   10001 |
|        13 | 2019-06-01 00:00:00 |   10006 |
|        14 | 2019-06-01 00:00:00 |   10006 |
|        15 | 2019-06-01 00:00:00 |   10006 |
|        16 | 2019-06-01 00:00:00 |   10006 |
|        17 | 2019-06-01 00:00:00 |   10006 |
|        18 | 2019-06-01 00:00:00 |   10006 |
+-----------+---------------------+---------+
11 rows in set (0.00 sec)

mysql> select * from orders union all select * from ordersnew;
+-----------+---------------------+---------+
| order_num | order_date          | cust_id |
+-----------+---------------------+---------+
|     20005 | 2005-09-01 00:00:00 |   10001 |
|     20006 | 2005-09-12 00:00:00 |   10003 |
|     20007 | 2005-09-30 00:00:00 |   10004 |
|     20008 | 2005-10-03 00:00:00 |   10005 |
|     20009 | 2005-10-08 00:00:00 |   10001 |
|        13 | 2019-06-01 00:00:00 |   10006 |
|        14 | 2019-06-01 00:00:00 |   10006 |
|        15 | 2019-06-01 00:00:00 |   10006 |
|        16 | 2019-06-01 00:00:00 |   10006 |
|        17 | 2019-06-01 00:00:00 |   10006 |
|        18 | 2019-06-01 00:00:00 |   10006 |
|     20005 | 2005-09-01 00:00:00 |   10001 |
|     20006 | 2005-09-12 00:00:00 |   10003 |
|     20007 | 2005-09-30 00:00:00 |   10004 |
|     20008 | 2005-10-03 00:00:00 |   10005 |
|     20009 | 2005-10-08 00:00:00 |   10001 |
+-----------+---------------------+---------+
16 rows in set (0.00 sec)
```