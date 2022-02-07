# 基础语法
----------------------------------

## 使用ddl管理表

在mysql中, 操作数据有以下三个步骤:
1. 创建数据库
2. 创建表
3. crud操作

根据oracle数据库体系, 有以下步骤:
1. 创建表空间
2. 创建用户
3. 给用户赋予权限
4. 创建表
5. crud

第一步: 创建一个表空间
```
create tablespace water         --表空间名称
datafile 'c:/database/water'    --数据库文件
size 100M                       --表空间大小
autoextend on                   --打开自动增长
next 10M                        --每次增长多少
```

第二步: 创建用户
```
create user frog                --用户名
identified by frog              --密码
default tablespace water        --关联表空间
```

> 以上两步不能用分号

第三步: 给用户赋予权限
```
grant dba to frog;              --赋予用户dba权限
```

> dba是一组权限, 相当于system用户的权限, 是最高权限.
> select * from session_privs;    可以查看当前用户的所有权限

第四步: 创建表

在切换到指定的用户之后, 开始创建表:
```
create table user_tbl(
       userId number(10),
       username varchar2(20)
);
```

> create关键字可以用来创建表, 视图, 用户, 表空间等所有oracle的object

## Oracle数据类型

---数值  
number(3)   999  
number(3,2) 9.99  


---字符  
char(10)      ---定长字符   aaa    10  
varchar(10)   ---可变字符   aaa    3  
varchar2(10)  ---使用效果和varchar 一样    推荐使用varchar2 

---日期  
date  日期和时间  
timestamp  时间戳   秒后9位  

> timestamp比date更精确, date转timestamp -- CAST(date1 AS TIMESTAMP)

---大字段  
long   2G  存储的是可变长字符串  
clob   4G  它与LONG数据类型类似，只不过CLOB用于存储数据库中的大型单字节字符数据块，不支持宽度不等的字符集  
blob   4G  它用于存储数据库中的大型二进制对象  

## Oracle表的管理

和mysql一样
创建表:
```
create table user_tbl(
       userId number(10),
       username varchar2(20),
       age number(10)
);
```

修改表:
```
alter table user_tbl add sex varchar2(2);	//添加列

alter table user_tbl rename column sex to gender;	//重命名列

alter table user_tbl modify gender number(1);	//修改列

alter table user_tbl drop column age;	//删除列
```

删除表:
```
drop table user_tbl;
```

## 约束

* 主键约束 --> primary key
* 非空约束 --> not null
* 唯一约束 --> unique
* 外键约束 --> foreign key
* 检查性约束 --> check

创建表时添加约束:
方式一:
```
create table mark(
       mid number(10) primary key,
       mark_name varchar2(100) not null unique
);

create table pig(
       pid number(10) primary key,
       pname varchar2(30) not null,
       gender number(1) check(gender in (0, 1)),
       mark_id number(10),
       constraint haha foreign key(mark_id) references mark(mid)	//外键约束只能写在这, 不能写在字段定义位置
);
```

方式二:
```
create table mark(
       mid number(10),
       mark_name varchar2(100) not null,
       constraint primary key(mid),
       constraint c1 unique(mark_name)
);

create table pig(
       pid number(10),
       pname varchar2(30) not null,
       gender number(1),
       mark_id number(10),
       constraint p0 primary key (pid),
       constraint p1 check (gender in (0, 1)),
       constraint p2 foreign key(mark_id) references mark(mid)
);
```

注意事项:
如果是在创建表的时候就添加约束, 那么:
1. not null约束只能放在字段定义处;
2. foreign key约束只能使用constraint定义, 不能放在字段定义处

通过修改表添加约束:
```
create table mark(
       mid number(10),
       mark_name varchar2(100)
);

alter table mark modify mid number primary key;
alter table mark modify mark_name not null unique;


create table pig(
       pid number(10),
       pname varchar2(30),
       gender number(1),
       mark_id number(10)
);

alter table pig modify pid number(10) primary key;
alter table pig modify pname varchar2(30) not null;
alter table pig modify gender number(1) check(gender in (0, 1));

--注意外键约束的添加与上面不同
alter table pig add constraint conName foreign key(mark_id) references mark(mid);
```

> 删除外键约束:
> alter table pig drop constraint conName;

关于外键约束:
如果插入数据 需要先插入 主表 再插入从表
如果要删除数据  需要先删除从表 在删除主表

## 增删改

和mysql一样

## 事务

Oracle支持三种事务隔离级别: read commited, serializable, read only. oracle默认事务隔离级别是read commited;

oracle的事务默认是开启的, 所以需要手动提交:
commit -- 提交命令;
rollback -- 回滚命令;

1. Read uncommitted 读未提交
公司发工资了，领导把5000元打到singo的账号上，但是该事务并未提交，而singo正好去查看账户，发现工资已经到账，是5000元整，非常高兴。
可是不幸的是，领导发现发给singo的工资金额不对，是2000元，于是迅速回滚了事务，修改金额后，将事务提交，最后singo实际的工资只有2000元，
singo空欢喜一场。

总结：出现上述情况，即我们所说的脏读，两个并发的事务，“事务A：领导给singo发工资”、“事务B：singo查询工资账户”，事务B读取了事务A尚未提交的数据。

当隔离级别设置为Read uncommitted时，就可能出现脏读，如何避免脏读，请看下一个隔离级别。


2. Read committed 读提已交
singo拿着工资卡去消费，系统读取到卡里确实有2000元，而此时她的老婆也正好在网上转账，把singo工资卡的2000元转到另一账户，
并在singo之前提交了事务，当singo扣款时，系统检查到singo的工资卡已经没有钱，扣款失败，singo十分纳闷，明明卡里有钱，为何......

总结：出现上述情况，即我们所说的不可重复读，两个并发的事务，“事务A：singo消费”、“事务B：singo的老婆网上转账”，事务A事先读取了数据，事务B紧接了更新了数据，并提交了事务，而事务A再次读取该数据时，数据已经发生了改变。

当隔离级别设置为Read committed时，避免了脏读，但是可能会造成不可重复读。

大多数数据库的默认级别就是Read committed，比如Sql Server , Oracle。如何解决不可重复读这一问题，请看下一个隔离级别。


3. Repeatable read 重复读

singo的老婆工作在银行部门，她时常通过银行内部系统查看singo的信用卡消费记录。
有一天，她正在查询到singo当月信用卡的总消费金额（select sum(amount) from transaction where month = 本月）为80元，
而singo此时正好在外面胡吃海塞后在收银台买单，消费1000元，即新增了一条1000元的消费记录（insert transaction ... ），
并提交了事务，随后singo的老婆将singo当月信用卡消费的明细打印到A4纸上，却发现消费总额为1080元，singo的老婆很诧异，
以为出现了幻觉，幻读就这样产生了。

总结：当隔离级别设置为Repeatable read时，可以避免不可重复读。当singo拿着工资卡去消费时，一旦系统开始读取工资卡信息（即事务开始），singo的老婆就不可能对该记录进行修改，也就是singo的老婆不能在此时转账。

虽然Repeatable read避免了不可重复读，但还有可能出现幻读。


4. Serializable 序列化

Serializable是最高的事务隔离级别，同时代价也花费最高，性能很低，一般很少使用，在该级别下，事务顺序执行，不仅可以避免脏读、不可重复读，还避免了幻像读。	


√: 可能出现    ×: 不会出现

|脏读|不可重复读|幻读|
|-|-|-|
|Read uncommitted|√|√|√|
|Read committed|×|√|√|
|Repeatable read|×|×|√|
|Serializable|×|×|×|

## 视图

视图就是封装了一条复杂查询语句的对象. 视图是一张虚表. 最大的特点是简化复杂的查询.

视图的使用场景:
1. 简化复杂查询
2. 隐藏敏感信息

创建视图:
```
create view 视图名称 as SQL语句
```
创建视图之后可以将视图作为表使用:
```
select * from 视图;
```
也可以对视图进行增删改, 但有时候需要屏蔽掉这些需求, 这时应该给视图只读.
```
create view v4 as select * from v_emp with read only;
```

## 索引

索引是用于加速数据存取的数据对象. 合理的使用索引可以大大降低i/o次数, 从而提高数据访问性能.
索引是对需要生成索引的列生成一个hashtable, 提高查询速度.

1. 单列索引
```
create index 索引名 on 表名(列名);
```
2. 复合索引
将两列或者多列生成单一索引.
```
create index 索引名 on 表名(列1, 列2);
```

> 一个表可以有多个索引, 但是列的组合必须不同.
> 索引会影响插入, 修改, 删除的效率;
> 创建索引的前提:
> 1. 表查询的概率远高于增删改的概率
> 2. 经常出现在where 条件后的字段
> 3. 唯一性较强的字段

为什么in, like, or关键字的查询效率较低. 因为他们不走索引.  
----in  or   like  '%%'   字段*xxx   不走索引  
----like  'M%'  ----走索引  

对于复合索引:  
select * from 表  where  列1=xxx and 列2=xxx；----效率高  走索引  
select * from 表  where  列2=xxx and 列1=xxx；-----效率低  不走索引  

> 主键约束, 唯一约束会自动创建索引

## 序列

mysql中主键可以设置自动增长(Auto_increment), 但是oracle中没有这个功能, 这时就需要依靠序列完成.

序列就是一个计数器对象, 通过手动将计数器对象的值作为主键字段的值实现自动增长.
```
--创建测试表
create table se_test(
       ti number(10) primary key,
       tm varchar(20)
);

--创建序列
create sequence seq;

--手动将序列作为主键字段的值
insert into se_test values(seq.nextval, 'frog');
```

```sql
------获取队列的下一个值---
select seq.nextval from dual;
-----获取队列的当前值----
select seq.currval from dual;
```

## 同义词

同义词的用处:
1. 可以很方便的访问其他用户的数据库对象
2. 缩短了对象名字的长度

创建同义词:
create synonym sp for scott.emp;
相当于给scott.emp起了一个别名.


> 复制表: create table emp as select * from scott.emp;