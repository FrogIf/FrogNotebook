# DCL

## 概述

DCL(Data Control Language), 数据控制语言.

主要用于控制各类操作的授权.

## 增

**创建用户**

```sql
CREATE USER username IDENTIFIED BY 'password';
```

**授权**

```sql
GRANT permissionName ON dbname.tablename TO username[@hostname];

GRANT ALL PRIVILEGES ON dbname.tablename TO username[@hostname];
```

> 使用 show privileges命令, 可以查看所有可选权限.

## 删

**删除用户**

```sql
DROP USER username;
```

**取消授权**

```sql
REVOKE permissionName ON dbname.tablename FROM username[@hostname];

REVOKE ALL PRIVILEGES ON dbname.tablename FROM username[@hostname];
```

## 改

**修改用户名**

```sql
RENAME USER oldusername TO newusername;
```

**修改密码**

```sql
SET PASSWORD FOR username = PASSWORD('newpassword');
```

**修改权限**

GRANT, REVOKE配合使用

## 查

**查询用户**

```sql
mysql> use mysql
Database changed

mysql> select user from user;
+---------------+
| user          |
+---------------+
| root          |
| mysql.session |
| mysql.sys     |
+---------------+
3 rows in set (0.00 sec)
```

**查询权限**

```sql
SHOW GRANTS FOR username;
```

## 应用

```sql

mysql> use mysql
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> select user from user;
+---------------+
| user          |
+---------------+
| root          |
| mysql.session |
| mysql.sys     |
+---------------+
3 rows in set (0.00 sec)

mysql> create user frog identified by '123456';
Query OK, 0 rows affected (0.00 sec)

mysql> select user from user;
+---------------+
| user          |
+---------------+
| frog          |
| root          |
| mysql.session |
| mysql.sys     |
+---------------+
4 rows in set (0.00 sec)

mysql> show grants for frog;
+----------------------------------+
| Grants for frog@%                |
+----------------------------------+
| GRANT USAGE ON *.* TO 'frog'@'%' |
+----------------------------------+
1 row in set (0.00 sec)

mysql> show privileges;
+-------------------------+---------------------------------------+-------------------------------------------------------+
| Privilege               | Context                               | Comment                                               |
+-------------------------+---------------------------------------+-------------------------------------------------------+
| Alter                   | Tables                                | To alter the table                                    |
| Alter routine           | Functions,Procedures                  | To alter or drop stored functions/procedures          |
| Create                  | Databases,Tables,Indexes              | To create new databases and tables                    |
| Create routine          | Databases                             | To use CREATE FUNCTION/PROCEDURE                      |
| Create temporary tables | Databases                             | To use CREATE TEMPORARY TABLE                         |
| Create view             | Tables                                | To create new views                                   |
| Create user             | Server Admin                          | To create new users                                   |
| Delete                  | Tables                                | To delete existing rows                               |
| Drop                    | Databases,Tables                      | To drop databases, tables, and views                  |
| Event                   | Server Admin                          | To create, alter, drop and execute events             |
| Execute                 | Functions,Procedures                  | To execute stored routines                            |
| File                    | File access on server                 | To read and write files on the server                 |
| Grant option            | Databases,Tables,Functions,Procedures | To give to other users those privileges you possess   |
| Index                   | Tables                                | To create or drop indexes                             |
| Insert                  | Tables                                | To insert data into tables                            |
| Lock tables             | Databases                             | To use LOCK TABLES (together with SELECT privilege)   |
| Process                 | Server Admin                          | To view the plain text of currently executing queries |
| Proxy                   | Server Admin                          | To make proxy user possible                           |
| References              | Databases,Tables                      | To have references on tables                          |
| Reload                  | Server Admin                          | To reload or refresh tables, logs and privileges      |
| Replication client      | Server Admin                          | To ask where the slave or master servers are          |
| Replication slave       | Server Admin                          | To read binary log events from the master             |
| Select                  | Tables                                | To retrieve rows from table                           |
| Show databases          | Server Admin                          | To see all databases with SHOW DATABASES              |
| Show view               | Tables                                | To see views with SHOW CREATE VIEW                    |
| Shutdown                | Server Admin                          | To shut down the server                               |
| Super                   | Server Admin                          | To use KILL thread, SET GLOBAL, CHANGE MASTER, etc.   |
| Trigger                 | Tables                                | To use triggers                                       |
| Create tablespace       | Server Admin                          | To create/alter/drop tablespaces                      |
| Update                  | Tables                                | To update existing rows                               |
| Usage                   | Server Admin                          | No privileges - allow connect only                    |
+-------------------------+---------------------------------------+-------------------------------------------------------+
31 rows in set (0.00 sec)

mysql> grant all privileges on *.* to frog;
Query OK, 0 rows affected (0.00 sec)

mysql> show grants for frog;
+-------------------------------------------+
| Grants for frog@%                         |
+-------------------------------------------+
| GRANT ALL PRIVILEGES ON *.* TO 'frog'@'%' |
+-------------------------------------------+
1 row in set (0.00 sec)

mysql> revoke all privileges on *.* from frog;
Query OK, 0 rows affected (0.00 sec)

mysql> show grants for frog;
+----------------------------------+
| Grants for frog@%                |
+----------------------------------+
| GRANT USAGE ON *.* TO 'frog'@'%' |
+----------------------------------+
1 row in set (0.00 sec)

mysql> grant Select on crashcourse.* to frog@localhost;
ERROR 1133 (42000): Can't find any matching row in the user table
mysql> select Host, user from user;
+-----------+---------------+
| Host      | user          |
+-----------+---------------+
| %         | frog          |
| %         | root          |
| localhost | mysql.session |
| localhost | mysql.sys     |
+-----------+---------------+
4 rows in set (0.00 sec)

mysql> create user frog@localhost identified by '123456';
Query OK, 0 rows affected (0.00 sec)

mysql> select Host, user from user;
+-----------+---------------+
| Host      | user          |
+-----------+---------------+
| %         | frog          |
| %         | root          |
| localhost | frog          |
| localhost | mysql.session |
| localhost | mysql.sys     |
+-----------+---------------+
5 rows in set (0.00 sec)

mysql> flush privileges;
Query OK, 0 rows affected (0.00 sec)

mysql> grant Select on crashcourse.* to frog@localhost;
Query OK, 0 rows affected (0.00 sec)

mysql> show grants for frog;
+----------------------------------+
| Grants for frog@%                |
+----------------------------------+
| GRANT USAGE ON *.* TO 'frog'@'%' |
+----------------------------------+
1 row in set (0.00 sec)

mysql> show grants for frog@localhost;
+-------------------------------------------------------+
| Grants for frog@localhost                             |
+-------------------------------------------------------+
| GRANT USAGE ON *.* TO 'frog'@'localhost'              |
| GRANT SELECT ON `crashcourse`.* TO 'frog'@'localhost' |
+-------------------------------------------------------+
2 rows in set (0.00 sec)

mysql> rename user frog to fff;
Query OK, 0 rows affected (0.00 sec)

mysql> select user, host from user;
+---------------+-----------+
| user          | host      |
+---------------+-----------+
| fff           | %         |
| root          | %         |
| frog          | localhost |
| mysql.session | localhost |
| mysql.sys     | localhost |
+---------------+-----------+
5 rows in set (0.00 sec)

mysql> set password for frog@localhost = password('456789');
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> show warnings \G;
*************************** 1. row ***************************
  Level: Warning
   Code: 1287
Message: 'SET PASSWORD FOR <user> = PASSWORD('<plaintext_password>')' is deprecated and will be removed in a future release. Please use SET PASSWORD FOR <user> = '<plaintext_password>' instead
1 row in set (0.00 sec)

ERROR:
No query specified

mysql> set password for frog@localhost = '456789';
Query OK, 0 rows affected (0.00 sec)
```