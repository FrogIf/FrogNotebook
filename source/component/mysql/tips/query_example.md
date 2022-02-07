# 查询实例

## 带序号查询

```
mysql> create table test(id_ int(4) zerofill not null primary key auto_increment, c char(4), v varchar(4));
Query OK, 0 rows affected (0.31 sec)

mysql> insert into test (c, v) values('a', 'aa'), ('b', 'bb'), ('c', 'cc');
Query OK, 3 rows affected (0.08 sec)
Records: 3  Duplicates: 0  Warnings: 0

mysql> select * from test;
+------+------+------+
| id_  | c    | v    |
+------+------+------+
| 0001 | a    | aa   |
| 0002 | b    | bb   |
| 0003 | c    | cc   |
+------+------+------+
3 rows in set (0.00 sec)

mysql> select @n := @n + 1 as n, t.* from test t, (select @n := 0) k;
+------+------+------+------+
| n    | id_  | c    | v    |
+------+------+------+------+
|    1 | 0001 | a    | aa   |
|    2 | 0002 | b    | bb   |
|    3 | 0003 | c    | cc   |
+------+------+------+------+
3 rows in set (0.00 sec)
```