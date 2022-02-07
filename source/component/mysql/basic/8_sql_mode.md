# SQL mode

## 概述

sql mode定义了mysql应支持的sql语法, 数据校验等. 这样可以更容易的在不同的环境中使用mysql.

* 通过设置sql mode, 可以完成不同严格程度的数据校验, 有效的保障数据准确性.
* 通过设置sql mode为ansi模式, 来保证大多数sql符合标准的sql语法, 这样应用在不同数据之间进行迁移时, 不需要对业务sql进行较大的修改.
* 在不同数据库之间进行数据迁移之前, 通过设置sql mode可以使mysql上的数据更方便地迁移到目标数据库.


## 使用

查看当前sql mode

```sql
mysql> select @@sql_mode;
+-------------------------------------------------------------------------------------------------------------------------------------------+
| @@sql_mode                                                                                                                                |
+-------------------------------------------------------------------------------------------------------------------------------------------+
| ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION |
+-------------------------------------------------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)
```

> 就是查询当前会话变量.

一些常见的sql mode的一些特性

* NO\_BACKSLASH\_ESCAPES : 使反斜线成为普通字符. 在导入数据时, 如果数据中含有反斜线, 启用该模式可以保证数据的正确性.
* PIPES\_AS\_CONCAT : 将"||"视为字符串连接操作符
* STRICT\_TRANS\_TABLES : 严格模式, 不允许非法日期, 不允许字符串长度超过字段长度, 对于不正确插入直接报错
* ANSI : 等同于REAL\_AS\_FLOAT, PIPES\_AS\_CONCAT, ANSI\_QUOTES, IGNORE\_SPACE和ANSI组合模式, 这种模式语法和行为更符合标准sql
* TRADITIONAL : 等同于STRICT\_TRANS\_TABLES, STRICT\_ALL\_TABLES, NO\_ZERO\_IN\_DATE, NO\_ZERO\_DATE, ERROR\_FOR\_DIVISION\_BY\_ZERO, TRADITIONAL和NO\_AUTO\_CREATE\_USER组合模式, 是严格模式, 对于不正确的值直接报错. 可以应用在事务和非事务表, 用在事务表时, 只要出现错误会立即回滚.

在ANSI模式下, 插入超长字符串会自动截断, 而不会报错; 插入非法日期("2019-04-32"), 插入值会变为'0000-00-00 00:00:00',执行MOD(x, 0)返回结果null. 在TRADITIONAL模式下则以上问题全都会报错.

> 数据在异构数据库之间迁移时可以通过sql mode来完成, mysql提供了许多数据库组合模式名称, 例如:"ORACLE", "DB2"

