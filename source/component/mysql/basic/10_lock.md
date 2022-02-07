# 锁

## 概述

* 表锁 : 开销小, 加锁快, 不会出现死锁; 锁粒度大, 发生锁冲突的概率高, 并发度最低.
* 行锁 : 开销大, 加锁慢, 会出现死锁; 锁粒度小, 发生锁冲突的概率小, 并发度低.
* 页面锁 : 开销和加锁时间介于表锁和行锁之间; 会出现死锁; 锁粒度介于表锁和行锁之间.

## MyISAM表锁

> 虽然是MyISAM表锁, 但是Innodb表也可以加表锁

**锁争用**

```sql
mysql> show status like 'table%';
+----------------------------+-------+
| Variable_name              | Value |
+----------------------------+-------+
| Table_locks_immediate      | 99    |
| Table_locks_waited         | 0     |
| Table_open_cache_hits      | 0     |
| Table_open_cache_misses    | 0     |
| Table_open_cache_overflows | 0     |
+----------------------------+-------+
5 rows in set (0.01 sec)
```

> table\_locks\_waited 值越高, 说明锁争用越严重

**锁模式**

\*|None|读锁|写锁
-|-|-|-
读锁|是|是|否
写锁|是|否|否

> 读锁之间可以并行, 读锁和写锁, 写锁和写锁之间是串行的

**加锁**

MyISAM引擎在执行select, update, insert, detete时会自动加锁, 有些时候需要显示加锁, 因为, 可能执行多条sql, 需要保证这些sql执行时, 状态的一致性.

加锁:

```sql
LOCK TABLES tbl_name {READ|WRITE} [LOCAL];
```

> local 指示允许表尾并发插入, 注意并发插入的数据, 在锁期间, 当前session是看不到的.

释放锁:

```sql
UNLOCK TABLES;
```

需要注意的是: 
* 加锁时必须同时获得所有需要使用的表的锁, 并且不支持锁升级, 即如果加的是读锁, 则只能对该表进行读操作, 不能进行写操作.
* lock tables时不仅需要对所用到的表进行加锁, 也需要对表的别名进行加锁.

**并发插入**

MyISAM通过设置系统变量, 可以控制实现并发插入:

* concurrent\_insert = 0 : 不允许并发插入
* concurrent\_insert = 1 : 如果表中没有空洞, 允许从表尾插入记录
* concurrent\_insert = 2 : 始终允许从表尾并发插入

**锁调度**

默认情况下, 写锁的优先级是大于读锁的, 如果一个请求读锁, 一个请求写锁, 写锁会优先获得该表的锁, 即使读锁先进入请求队列.

可以通过以下措施改变这种策略:

* 指定启动参数: low-priority-updates, 使其默认给与读锁高优先级
* 设置系统变量: set low\_priority\_updates = 1, 同上
* 指定insert, update, delete语句的low\_priority属性, 降低其优先级
* 设定系统参数:max\_write\_lock\_count, 使得当写锁达到这个值之后, 优先将锁给读锁请求

## InnoDB行锁

**锁争用**

```sql
mysql> show status like 'innodb_row_lock%';
+-------------------------------+-------+
| Variable_name                 | Value |
+-------------------------------+-------+
| Innodb_row_lock_current_waits | 0     |
| Innodb_row_lock_time          | 0     |
| Innodb_row_lock_time_avg      | 0     |
| Innodb_row_lock_time_max      | 0     |
| Innodb_row_lock_waits         | 0     |
+-------------------------------+-------+
5 rows in set (0.17 sec)

```

> 英语意思都很明显... Innodb\_row\_lock\_waits就是行锁等待次数

其他手段:

* 查询information\_schema数据库中innodb\_locks表;
* 设置innodb monitors查看锁冲突

**锁模式**

* 共享锁(S) : 允许并发读, 不允许写
* 排它锁(X) : 允许获得锁的事务去读写, 不允许其他事务读写改行
* 意向共享锁(IS) : (表锁), 事务打算给数据行加共享锁, 在加共享锁之前必须获得该表的IS
* 意向排它锁(IX) : (表锁), 事务打算给数据行加排他锁, 在加排他锁之前必须获得该表的IX

&nbsp;|X|IX|S|IS
-|-|-|-|-
X|冲突|冲突|冲突|冲突
IX|冲突|兼容|冲突|兼容
S|冲突|冲突|兼容|兼容
IS|冲突|兼容|兼容|兼容

> 如果一个事务请求的锁模式与当前行的已加锁的锁模式兼容, 则可以获得锁, 否则就需要锁等待

> 另外, 意向锁不会阻塞任何请求, 除非是锁表.

**加锁**

意向锁是自动加的不需要手动干预.

对于update, delete, insert, inndb会自动为涉及的数据集加排它锁.

对于select语句默认是不加锁的. 可以手动加锁:

```sql
共享锁: SELECT * FROM table_name WHERE ... LOCK IN SHARE MODE;
排它锁: SELECT * FROM table_name WHERE ... FOR UPDATE;
```

**innodb行锁实现方式**

Innodb行锁是通过给表上的索引项加锁来实现的. 如果没有索引, Innodb将通过隐藏的聚簇索引来对记录加锁. 这种行锁实现导致一个问题: **如果不通过索引条件检索数据, 那么Innodb表将对表中所有记录加锁, 即达到了表锁的效果!(需要显示加锁!默认select是不加锁的)**

> 我的理解是: 最终是加载了主键索引或者聚簇索引上(Innodb存储方式是索引组织表)

由于行锁的特点需要注意的问题:

* 不通过索引条件进行带锁查询时, 会锁定表中所有记录
* 由于是对索引键加锁, 有时候即使访问的是不同的记录, 但是使用的是相同的索引键也会出现锁冲突
* 当表有多个索引的时候, 不同事物可以使用不同的索引项锁定不同的行, 不论是主键索引, 唯一索引, 普通索引, Innodb都会使用行锁来对数据加锁.
* 即使检索条件中存在索引, 也有可能不走索引(优化器来决定的), 这时也会锁全表.

行锁分为三种情况:

1. record lock : 对索引项加锁
2. gap lock : 对索引项间的空隙, 第一条记录前的间隙或最后一条记录后的及间隙加锁
3. next-key lock : 上面两个的组合, 对记录及前面的间隙加锁. 有些键值符合条件但是不存在的行称为"间隙", 当给这些不存在的行加锁时, 这些间隙也会被加锁. 使用Next-Key lock加锁的目的: 1. 防止幻读; 2. 满足复制和恢复的需要. Next-Key Lock会导致并发插入出现严重的所等待, 需要注意.


**死锁**

死锁举例:

两个事务都获取到同一行的共享锁, 然后都去请求该行的排它锁. 这时两个事务都会处于锁等待状态, 故死锁. 解决方法 -> 最开始直接获取该行的排他锁而不是共享锁.

如何避免死锁以及减少所冲突:

* 尽量使用较低的数据隔离级别
* 精心设计索引, 并尽量使用索引访问数据
* 控制事务的大小, 小事务锁冲突的概率小
* 记录显示加锁时, 要一次性申请到足够级别的锁
* 不同session访问一组表时, 尽量约定使用相同的顺序访问
* 对于一张表, 尽量使用固定的顺序存取表中的行
* 尽量使用相等条件访问数据, 这样可以避免Next-Key lock引起的锁冲突
* 不要申请超过实际需求的锁级别, 除非必要, 否则不要为select显示加锁
* 对于一些特定的事务, 可以使用表锁来提高处理速度或者减少发生死锁的几率

**使用表锁**

Innodb引擎是可以使用表锁的.

* 表锁不是在引擎级进行管理的, 而是在Server层. 
    * 仅当autocommit=0, innodb\_table\_locks=1(默认)时, Innodb才会监测Server层的表锁, 并且Server层才能监测Innodb加的行锁. 也只有这时Innodb才会去处理涉及Server层表锁的死锁.
* lock tables时对Innodb表加锁时要将autocommit设置为0, 否则Server不会给表加锁; 
* 事务结束前不要使用UNLOCK TABLES是否表锁, 因为UNLOCK TABLES会隐含事务提交;
* COMMIT 或者ROLLBACK并不能释放LOCK TABLES的表锁, 必须使用UNLOCK TABLES释放.

正确Innodb表锁使用姿势:

```sql
SET AUTOCOMMIT=0;
LOCK TABLES t1 write, t2 read, ...;
// do something...
COMMIT;
UNLOCK TABLES;
```

**锁, 恢复与复制, 不确定SQL**

Mysql通过binlog实现数据恢复以及主从同步, 这种实现方式与Innodb锁机制之间存在一点不兼容, 为了消除这个问题, 有些时候, 锁的行为显得奇怪:

存在两个并行的事务, 其中一个事务使用```insert into .... select;```将一张表中的数据复制到另一张表中, 另一个事务更新源表中的数据, 并且当前数据隔离级别是默认的Read Committed. 按照预想的是insert使用多版本可一致性读来获取源表的数据来进行插入, update使用排它锁进行更新, 不会出现锁冲突(因为insert没有锁源表). 但是实际上Mysql在执行insert语句时会对源表加共享锁, 这样就导致了锁冲突! 为什么呢?

这时为了考虑到数据恢复以及复制的正确性. 因为如果不加共享锁, binlog会记录这两个操作(binlog是按照事务的提交顺序记录的, 而不会交替的记录两个事务的执行逻辑), 不妨假设update操作的事务先提交, 在恢复时, 读取binlog, 就会先更新表中的数据, 然后再执行insert语句, 这样会导致insert插入的数据实际上是更新之后的数据! 

当按照Mysql实际的执行方式加上共享锁:
* insert如果先获得该表的锁, 那么update只有等到insert提交之后才会执行, 这样binlog中insert语句就会出现在update之前
* update如果先获得该表的锁, 那么insert之后等到update提交之后才会执行, 由于是Read Committed, 所以insert事务可以读取到最新的数据并插入到目标表中; binlog恢复时恢复的结果也是这样的.

总之, 这样就保证了这两个事务的串行, 保证了事务执行顺序与binlog中记录的顺序是一致的.

可以通过设置```innodb_locks_unsafe_for_binlog```值为on, 使上面执行insert时不对表加共享锁.

insert...select...和create table ... select ...被称为不确定sql, 属于"Unsafe SQL", 在默认配置下会影响性能, 不推荐使用. 

如果一定要使用, 可以采用以下手段:

* 设置```innodb_locks_unsafe_for_binlog```值为on, 不推荐, 因为会影响恢复与复制
* 使用```select ... into outfile;```和```load data infile```间接实现, 这种方式不会给源表加锁
* 使用基于行的binlog格式和基于行的数据复制

## 附录

InnoDB引擎不同sql在不同事务隔离级别下使用的锁:

> 表中Consisten read表示使用的是"多版本数据一致性读"

<table border="1">
    <tr>
        <th colspan="2" width="25%"></th>
        <th>Read Uncommited</th>
        <th>read Commited</th>
        <th>Repeatable Read</th>
        <th>Serializable</th>
    </tr>
    <tr>
        <td rowspan="2">select</td>
        <td>相等</td>
        <td>None locks</td>
        <td>Consisten read/None locks</td>
        <td>Consisten read/None locks</td>
        <td>Share locks</td>
    </tr>
    <tr>
        <td>范围</td>
        <td>None locks</td>
        <td>Consisten read/None locks</td>
        <td>Consisten read/None locks</td>
        <td>Share Next-Key</td>
    </tr>
    <tr>
        <td rowspan="2">update</td>
        <td>相等</td>
        <td>exclusive locks</td>
        <td>exclusive locks</td>
        <td>exclusive locks</td>
        <td>exclusive locks</td>
    </tr>
    <tr>
        <td>范围</td>
        <td>exclusive next-key</td>
        <td>exclusive next-key</td>
        <td>exclusive next-key</td>
        <td>exclusive next-key</td>
    </tr>
    <tr>
        <td>insert</td>
        <td>N/A</td>
        <td>exclusive locks</td>
        <td>exclusive locks</td>
        <td>exclusive locks</td>
        <td>exclusive locks</td>
    </tr>
    <tr>
        <td rowspan="2">replace</td>
        <td>无键冲突</td>
        <td>exclusive locks</td>
        <td>exclusive locks</td>
        <td>exclusive locks</td>
        <td>exclusive locks</td>
    </tr>
    <tr>
        <td>键冲突</td>
        <td>exclusive next-key</td>
        <td>exclusive next-key</td>
        <td>exclusive next-key</td>
        <td>exclusive next-key</td>
    </tr>
    <tr>
        <td rowspan="2">delete</td>
        <td>相等</td>
        <td>exclusive locks</td>
        <td>exclusive locks</td>
        <td>exclusive locks</td>
        <td>exclusive locks</td>
    </tr>
    <tr>
        <td>范围</td>
        <td>exclusive next-key</td>
        <td>exclusive next-key</td>
        <td>exclusive next-key</td>
        <td>exclusive next-key</td>
    </tr>
    <tr>
        <td rowspan="2">select lock in share mode</td>
        <td>相等</td>
        <td>share locks</td>
        <td>share locks</td>
        <td>share locks</td>
        <td>share locks</td>
    </tr>
    <tr>
        <td>范围</td>
        <td>share locks</td>
        <td>share locks</td>
        <td>share next-key</td>
        <td>share next-key</td>
    </tr>
    <tr>
        <td rowspan="2">select for update</td>
        <td>相等</td>
        <td>exclusive locks</td>
        <td>exclusive locks</td>
        <td>exclusive locks</td>
        <td>exclusive locks</td>
    </tr>
    <tr>
        <td>范围</td>
        <td>exclusive locks</td>
        <td>share locks</td>
        <td>exclusive next-key</td>
        <td>exclusive next-key</td>
    </tr>
    <tr>
        <td rowspan="2">insert into .. select...<br />(指源表锁)</td>
        <td>innodb_locks_unsafe_for_binlog=off</td>
        <td>share next-key</td>
        <td>share next-key</td>
        <td>share next-key</td>
        <td>share next-key</td>
    </tr>
    <tr>
        <td>innodb_locks_unsafe_for_binlog=on</td>
        <td>None locks</td>
        <td>Consisten read/None locks</td>
        <td>Consisten read/None locks</td>
        <td>Share next-key</td>
    </tr>
    <tr>
        <td rowspan="2">create table ... select...<br />(指源表锁)</td>
        <td>innodb_locks_unsafe_for_binlog=off</td>
        <td>share next-key</td>
        <td>share next-key</td>
        <td>share next-key</td>
        <td>share next-key</td>
    </tr>
    <tr>
        <td>innodb_locks_unsafe_for_binlog=on</td>
        <td>None locks</td>
        <td>Consisten read/None locks</td>
        <td>Consisten read/None locks</td>
        <td>Share next-key</td>
    </tr>
</table>
