# PL/SQL语言
---------------------------------

## hello world!

```
begin
  dbms_output.put_line('HelloWorld!');
end;
```

PL/SQL(Procedure Language/SQL)是oracle对SQL语言的过程化扩展, 指在sql命令语言中增加了过程处理语句(如分支, 循环等), 使SQL语言具有过程处理能力. 把SQL语言的数据操作能力与过程语言的数据处理能力结合起来, 使得PLSQL面向过程但是比过程语言简单, 高效, 灵活实用.

## PL/SQL的基本结构

```
declare
	说明部分(变量, 游标, 例外的声明)
begin
	语句...
exception
	例外处理语句...
end;
```

## 变量

该语言变量分为三种类型: 说明型变量, 引用型变量, 记录型变量

### 说明型变量

```
declare
  n number := 10;
  str varchar(20);
  is_true boolean := false;
begin
  dbms_output.put_line(n);
end;
```

说明型变量的结构: 变量名 + 数据类型 + 数据长度 最后以分号结束.

这种语言中, 使用":="表示赋值(相当于java中的"="), 使用"="表示等值判断(相当于java中的"==")

### 引用型变量

```
declare
  ename emp.ename%type := 'frog';
begin
  dbms_output.put_line(ename);
end;
```

引用型变量, 即ename的类型与emp表中ename的类型一样.

### 记录型变量

```
declare
  emp_row emp%rowtype;
begin
  select * into emp_row from emp where emp.empno = 7369;
  dbms_output.put_line(emp_row.ename || '工资为:' || emp_row.sal);
end;
```

记录型变量, emp_row变量相当于一个'记录'的容器, 这里是emp的记录的容器.

```
into是用来将表中的一个或者一条数据赋值给变量的关键字
如下所示:
declare
  str1 varchar(12);
  str2 emp.ename%type;
  re1 emp%rowtype;
begin
  select ename into str1 from emp where emp.empno = 7369;
  select ename into str2 from emp where emp.empno = 7369;
  select * into re1 from emp where emp.empno = 7369;
  dbms_output.put_line(str1);
  dbms_output.put_line(str2);
  dbms_output.put_line(re1.ename);
end;
```

## 流程控制

### 分支结构

1. 单一判断
```
if 条件 then
	语句...;
end if;
```

2. 两个分支
```
if 条件 then
	语句...;
else
	语句...;
end if;
```

3. 多个分支
```
if 条件 then
	语句...;
elsif 条件 then
	语句...;
else
	语句...;
end if;
```

例程:
```
declare
    n number(3);
begin
    n := &请输入成绩;		----相当于java中的sc.read();
    if n < 60 then
        dbms_output.put_line('不及格');
    elsif n < 80 then
        dbms_output.put_line('及格');
    elsif n < 90 then
        dbms_output.put_line('优秀');
    elsif n < 100 then
        dbms_output.put_line('unbelievable!');
    else
        dbms_output.put_line('XXXXXXX');
    end if;
end;
```

### 循环结构

该语言的循环分为三种:
1. 死循环
2. while循环
3. for循环

#### 死循环

```
loop
	语句...;
end loop;
```

例程:
```
declare
    n number(3) := 1;
begin
    loop
        dbms_output.put_line(n);
        n := n + 1;
    end loop;
end;
```

#### while循环

```
while 条件 loop
	语句...;
loop end;
```

例程:
```
declare
    n number(3) := 1;
begin
    while n <= 100 loop
        dbms_output.put_line(n);
        n := n + 1;
    end loop;
end;
```

#### for循环

```
for 变量 in 条件 loop
	语句...;
end loop;
```

例程:
```
declare
    n number(3) := 1;
begin
    for n in 1..100 loop
        dbms_output.put_line(n);
    end loop;
end;
简化版:
begin
    for n in 1..100 loop
        dbms_output.put_line(n);
    end loop;
end;
```

#### 跳出循环

使用exit关键字可以跳出循环:

```
declare
    n number(3) := 1;
begin
    loop
        if n = 101 then
            exit;
        end if;
        dbms_output.put_line(n);
        n := n + 1;
    end loop;
end;
```

可以简化为:
```
declare
    n number(3) := 1;
begin
    loop
        exit when n > 100;
        dbms_output.put_line(n);
        n := n + 1;
    end loop;
end;
```

## 游标(java中的数组或集合)

java程序中有集合的概念, 在pl/sql中使用游标来存储查询返回的多条数据.

声明一个游标:
cursor 游标名 [(参数名 数据类型, 参数名 数据类型)] is sql查询语句;

例程:
```
declare
    cursor free is select * from emp where deptno = 10;
    rowInfo emp%rowtype;
begin
    open free; --打开游标
    loop
         fetch free into rowInfo;	取出游标中的一条记录, 并赋值给rowInfo
         exit when free%notfound;	如果游标为空, 终止循环
         dbms_output.put_line(rowInfo.ename || '--' || rowInfo.sal);
    end loop;
    close free; --关闭游标
end;
```
遍历游标:
```
declare
    cursor free is select * from emp where deptno = 10;
    rowInfo emp%rowtype;
begin
    for rowInfo in free loop
        dbms_output.put_line(rowInfo.ename || '--' || rowInfo.sal);
    end loop;
end;
```
> 不用open游标, 也不用close游标, 就像java使用增强for时不需要创建迭代器一样.

上面的游标都不带参数, 根据上面的格式还有带参数的游标.
```
declare
    cursor free(dno number) is select * from emp where deptno = dno;	--为游标添加形参, 注意形参不能写数据长度
    row_info emp%rowtype;
begin
    open free(10);	--给游标传入实参
    loop
         fetch free into row_info;
         exit when free%notfound;
         dbms_output.put_line(row_info.ename || '--' || row_info.sal);
    end loop;
    close free;
end;
```

## 例外(异常)

### 系统例外

系统例外:
1. no_date_found	没有找到数据
2. too_many_rows	select...into语句匹配到多行
3. zero_divide		除0异常
4. value_error		算数或者转换错误
5. timeout_on_resource	在等待资源时发生超时
6. others		所有例外的总和(包括上面5种), 相当于java中的Exception 

```
declare
    n number(3) := 12;
begin
    n := n / 0;
exception
    when zero_divide then dbms_output.put_line('抛出除0异常');
end;
```

### 自定义例外

直接上代码:

```
declare
    score number(3);
    ex_score exception;
begin
    score := &请输入成绩;
    if score > 100 then
       raise ex_score;	----抛出异常
    end if;
    if score < 60 then
        dbms_output.put_line('不及格');
    elsif score < 80 then
        dbms_output.put_line('及格');
    elsif score < 90 then
        dbms_output.put_line('优秀');
    else
        dbms_output.put_line('unbelievable!');
    end if;
exception
    when ex_score then dbms_output.put_line('成绩输入不正确!');
end;
```

## 存储过程

存储过程(Stored Procedure)是在大型数据库系统中, 一组为了完成特定功能的SQL语句集, 经编译后存储在数据库中, 用户通过指定存储过程的名字并给出参数(如果该存储过程带有参数)来执行它. 存储过程是数据库中的一个重要对象, 任何一个设计良好的数据库应用程序到应该用到存储过程.

语法:
```
create [or replace] procedure 过程名[(参数名 in/out 数据类型)] as/is
	变量声明
begin
	PLSQL子程序
end;
```

例程
```
-----创建一个存储过程------
create procedure process_sal(eno in number, sal_value out number) is
begin
       select sal * 12 + nvl(comm, 0) into sal_value from emp where empno = eno;
end;
```
```
------使用这个存储过程------------
declare
       sal number(10);
       eno number(4) := 7369;
begin
       process_sal(eno, sal);
       dbms_output.put_line(sal);
end;
```

调用方法二:
```
call process_sal(7369, sal);
这种方式begin和end都不用写, 但是sal怎么声明?
所以只能调用无返回值的存储过程.
不怎么用.
```

## 存储函数

和存储过程很像.
语法:
```
create [or replace] procedure 过程名[(参数名 in/out 数据类型)] return 数据类型 as/is
	变量声明
begin
	PLSQL子程序
	return 结果变量;
end;
```

```
------创建存储过程--------
create function get_year_sal(eno in number) return number is
       sal_value number(10);
begin
       select sal * 12 + nvl(comm, 0) into sal_value from emp where empno = eno;
       return sal_value;
end;
```
```
-----使用存储过程--------
begin
       dbms_output.put_line(get_year_sal(7369));
end;
```