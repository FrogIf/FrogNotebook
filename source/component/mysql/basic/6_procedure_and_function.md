# 存储过程和存储函数

## 6.1 概述

**权限**

* 创建: CREATE ROUTINE
* 修改/删除: ALTER ROUTINE
* 执行: EXECUTE

**存储过程与存储函数的区别**

1. 存储过程没有返回值, 存储函数有;
2. 存储过程的参数可以使用IN, OUT, INOUT类型参数, 存储函数只能使用IN类型参数.

## 6.2 创建, 修改, 删除, 查看, 调用

**创建**

```sql
CREATE PROCEDURE sp_name ([proc_parameter1, ...])
[characteristic ...]
routine_body

CREATE FUNCTION sp_name ([func_parameter1, ...])
RETURNS type
[characteristic ...]
routine_body

    pro_parameter:
        [IN|OUT|INOUT] param_name type
    
    type:
        Any valid MySQL data type
    
    characteristic:
        LANGUAGE SQL
        | [NOT] DETERMINISTIC
        | {CONTAINS SQL|NO SQL|READS SQL DATA|MODIFIES SQL DATA}
        | SQL SECURITY {DEFINER|INVOKER}
        | COMMENT 'str_comment'
```

对characteristic(特征值)部分的简单说明    
* LANGUAGE SQL: 说明routine_body使用的是SQL编写    
* [NOT] DETERMINISTIC: (不)确定的, 即指定是否只要输入参数一样则输出也一样    
* {CONSTAINS SQL | NO SQL | READ SQL DATA | MODIFIES SQL DATA}: 这些特征值只是提供给服务器用, 并没有根据这些特征值限制routine_body实际的执行行为.     
    * CONSTAINS SQL : 子程序不包含读或写数据的语句.(如果没有指定, 默认是这个)
    * NO SQL: 子程序不包含SQL语句
    * READS SQL DATA: 子程序包含读数据的语句, 但是没有写数据的语句
    * MODIFIES SQL DATA: 表示子程序包含写数据的语句.
* SQL SECURITY {DEFINER|INVOKER} : 指定routine_type中的命令是使用创建者的权限执行, 还是调用者的权限执行. 默认是DEFINER.
* COMMENT 'str_comment': 注释


**修改**

```sql
ALTER {PROCEDURE|FUNCTION} sp_name [characteristic ...];
```

**删除**

```sql
DROP {PROCEDURE|FUNCTION} [IF EXISTS] sp_name;
```

**查看**

1. 查看状态

```sql
SHOW {PROCEDURE|FUNCTION} STATUS [LIKE 'pattern'];
```

2. 查看定义

```sql
SHOW CREATE {PROCEDURE|FUNCTION} sp_name;
```

**调用**

```sql
CALL sp_name([parameter, ...])
```

**简单例程**

```sql
mysql> delimiter $$
mysql> CREATE PROCEDURE pro_demo(IN ord_id INT, OUT ord_date DATETIME)
    -> BEGIN
    ->     SELECT order_date INTO ord_date from orders WHERE order_num = ord_id;
    -> END$$
Query OK, 0 rows affected (0.00 sec)

mysql> delimiter ;
mysql> call pro_demo('20005', @a);
Query OK, 1 row affected (0.00 sec)

mysql> select @a;
+---------------------+
| @a                  |
+---------------------+
| 2005-09-01 00:00:00 |
+---------------------+
1 row in set (0.00 sec)
```

> delimiter用于修改sql结束符, 防止routine_body中的分号使得还没定义好过程就直接结束

## 6.3 routine body

routine body一般都是以begin开头, 以end结尾的:

```sql
BEGIN
    ...
END
```

routine body中可以分为几部分:
1. 声明
2. 执行

声明部分必须在routine body的最开始部分, 可以用来定义: 

* 局部变量
* 情况
* 光标
* 情况处理

并且这四者的定义顺序必须严格按照上面列出的顺序.

执行部分就可以写一些查询sql, 并且可以使用传统的三大编程结构了(顺序, 分支, 循环)

### 6.3.1 变量

mysql变量分为四种:
1. 局部变量: 生命周期在BEGIN...END之间
2. 用户变量: 生命周期从用户连接到用户断开
3. 会话变量: 生命周期与用户变量一样, 仅限于当前连接
4. 全局变量: 全局变量影响服务器整体操作。当服务器启动时，它将所有全局变量初始化为默认值。这些默认值可以在选项文件中或在命令行中指定的选项进行更改。要想更改全局变量，必须具有super权限。全局变量作用于server的整个生命周期，但是不能跨重启。即重启后所有设置的全局变量均失效。要想让全局变量重启后继续生效，需要更改相应的配置文件。

> 会话变量和全局变量又统称为系统变量, 系统变量使用时, 变量名前需要加两个@

> 此外, mysql中的变量是不区分大小写的

**局部变量**

变量的定义:

```sql
DECLARE var_name[, ...] type [DEFAULT value];
```

赋值:

```sql
直接赋值:
SET var_name1 = expr1, var_name2 = expr2, ...

查询结果赋值给指定变量(这种复制方式必须保证查询结果只有一行)
SELECT col_name1, col_name2, ... INTO var_name1, var_name2, ... table_expr
```

**用户变量**

不需要事先生命, 直接使用:

```sql
SET @var_name = expr;
SET @var_name := expr;
SELECT @var_name := expr ...;
```
> 强调一下, 在SELECT语句中只能使用":="为用户变量赋值

> 用户变量的类型是可变的, 赋什么值就是什么类型

**会话变量**

会话变量在每次建立一个新的连接的时候，由MySQL来初始化。MySQL会将当前所有全局变量的值复制一份。来做为会话变量。也就是说，如果在建立会话以后，没有手动更改过会话变量与全局变量的值，那所有这些变量的值都是一样的。

可以通过以下命令查看当前所有会话变量:

```sql
show session variables;
```

会话变量也不需要事先声明:

```sql
SET SESSION var_name = value;
SET @@SESSION.var_name = value;
SET var_name = value;   # 默认使用SESSION
```

查看会话变量:

```sql
SELECT @@var_name;
SELECT @@session.var_name;
SHOW SESSION VARIABLES LIKE 'pattern';
```

> 注意, 上面所有的SESSION关键字都可以使用LOCAL替换

**全局变量**

同样不需要事先声明:

```sql
SET GLOBAL var_name = value;
SET @@GLOBAL.var_name = value;
```

> 全局变量的赋值时需要有super权限的

查看全局变量:

```sql
SELECT @@GLOBAL.var_name;
SHOW GLOBAL VARIABLES LIKE 'pattern';
```

### 6.3.2 情况及处理

情况的定义:

```sql
DECLARE condition_name CONDITION FOR condition_value;

    condition_value:
        SQLSTATE [VALUE] sqlstate_value
        | mysql_error_code
```

情况的处理:

```sql
DECLARE hander_type HANDLER FOR condition_value1[, condition_value2, ...] sp_statement

    handler_type:
        CONTINUE
        |EXIT
        |UNDO
    
    condition_value:
        SQLSTATE [value] sqlstate_value
        |condition_name
        |SQLWARNING
        |NOT FOUND
        |SQLEXCEPTION
        |mysql_error_code
```

* SQLWARNING: 代表所有以01开头的SQLSTATE
* NOT FOUND: 代表所有以02开头的SQLSTATE
* SQLEXCEPTOIN: 代表所有没有被SQLWARNING和NOT FOUND包含的SQLSTATE

handler_type实际上只支持两种, CONTINUE表示继续执行下面的语句, EXIT表示执行终止, UNDO在5.0版本中暂不支持.

sp_statement参数表示要执行存储过程或函数语句.

### 6.3.3 游标

游标的作用是在存储过程和存储函数中对结果集进行循环处理.

游标的使用包含四部分:

1. 声明
    ```sql
    DECLARE cursor_name CURSOR FOR select_statement;
    ```
2. OPEN
    ```sql
    OPEN cursor_name;
    ```
3. FETCH
    ```sql
    FETCH cursor_name INTO var_name [, var_name] ...
    ```
4. CLOSE
    ```sql
    CLOSE cursor_name;
    ```

> 游标一般配合循环一起使用

### 6.3.4 流程控制

mysql中的流程控制分为以下几个:
1. 分支: IF, CASE
2. 循环: LOOP, REPEAT, WHILE
3. 其他: LEAVE, ITERATE

**IF**

```SQL
IF search_condition THEN statement_list
[ELSEIF search_condition THEN statement_list]
[ELSE statement_list]
END IF
```

**CASE**

```sql
CASE case_value
WHEN when_value then statement_list
[WHEN when_value then statement_list]
[WHEN when_value then statement_list]
...
[ELSE statement_list]
END CASE
```

**LOOP**

```SQL
[begin_label:] LOOP
    statement_list
END LOOP [end_label]
```
> LOOP需要显式指定退出语句, 否则是死循环

**WHILE**

```sql
[begin_label:] WHILE search_condition DO
    statement_list
END WHILE [end_label]
```

**REPEAT**

```sql
[begin_label:] REPEAT
    statement_list
UNTIL search_condition
END REPEAT [end_label]
```

> REPEAT相当于java中的do...while();

**LEAVE和ITERATE**

LEAVE可以用在BEGIN...END或者循环中, 在BEGIN...END中, 相当于"return;", 在循环中相当于break
ITERATE只能用于循环中, 相当于continue

这两个关键字后面都必须加label_name, 用于指定跳出哪一个循环:

```sql
LEAVE lable_name;
ITERATE lable_name;
```

## 6.4 应用

```sql
mysql> delimiter $$
mysql> create procedure pro_test()
    -> begin
    ->     declare k int default 0;
	->     declare done int default 0;
	->     declare donec CONDITION FOR SQLSTATE '02000';
    ->     declare cs cursor for select order_num from orders;
	->     declare CONTINUE HANDLER FOR donec set done = 1;
    ->
    ->     set @x = 0;
    ->     open cs;
    ->
    ->     fr: loop
    ->         fetch cs into k;
	->         if done then 
	->              leave fr;
    ->         end if;
    ->         set @x = @x + 1;
    ->     end loop;
    ->
    ->     close cs;
    -> end$$
Query OK, 0 rows affected (0.00 sec)
mysql> delimiter ;
mysql> select count(*) from orders;
+----------+
| count(*) |
+----------+
|        9 |
+----------+
1 row in set (0.00 sec)

mysql> call pro_test();
Query OK, 0 rows affected (0.00 sec)

mysql> select @x;
+------+
| @x   |
+------+
|    9 |
+------+
1 row in set (0.00 sec)

mysql> delimiter $$
mysql> create function fun_test() returns int
    -> begin
    ->     declare tempv int default 0;
    ->     declare c int default 0;
    ->     declare done int default 0;
    ->     declare order_cs cursor for select order_num from orders;
    ->     declare CONTINUE HANDLER FOR NOT FOUND set done = 1;
    ->
    ->     open order_cs;
    ->     fr: loop
    ->         fetch order_cs into tempv;
    ->         if done then
    ->              leave fr;
    ->         end if;
    ->         set c = c + 1;
    ->     end loop;
    ->
    ->     close order_cs;
    ->
    ->     return c;
    -> end$$
Query OK, 0 rows affected (0.00 sec)

mysql> delimiter ;
mysql> select fun_test();
+------------+
| fun_test() |
+------------+
|          9 |
+------------+
1 row in set (0.00 sec)


```