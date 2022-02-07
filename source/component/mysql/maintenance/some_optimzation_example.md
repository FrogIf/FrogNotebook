# 常用SQL优化

## 目录

1. 大批量插入数据
2. 优化insert语句
3. 优化order by语句
4. 优化group by语句
5. 优化嵌套查询
6. 优化or条件
7. 优化分页查询
8. 使用SQL提示

## 大批量插入数据

对于MyISAM表:

导入之前关闭非唯一索引更新, 导入之后开启非唯一索引更新.

```sql
ALTER TABLE tbl_name DISABLE KEYS;
LOADING DATA ...;
ALTER TABLE tbl_name ENABLE KEYS;
```

对于InnoDB表:

1. 因为Innodb表是按照主键顺序保存的, 导入数据按照顺序排序后导入较快.
2. 在导入之前关闭唯一校验, 导入之后重新打开唯一校验.
    ```sql
    SET UNIQUE_CHECKS = 0;
    SET UNIQUE_CHECKS = 1;
    ```
3. 导入之前关闭自动提交, 导入之后重新打开自动提交.
    ```sql
    SET AUTOCOMMIT = 0;
    SET AUTOCOMMIT = 1;
    ```

## 优化INSERT语句

* 同时插入很多行时, 尽量使用一条insert语句直接插入多行.
* 使用insert delayed, 该语句使insert立即执行, 数据直接放在内存中, 然后就返回插入成功. 如果没有delayed, insert语句会等待其他用户对表的读写完成之后再插入.
* 将索引与数据文件放在不同的磁盘上.
* 对于MyISAM表, 增加bulk\_insert\_buffer\_size的值, 提高速度
* 当从文本中装载一个表时, 使用load data infile比insert快很多.

## order by优化

排序有两种方式:

1. using index : 表中的索引都是有序的, 如果order by的字段是索引字段, 就不需要排序, 直接按照索引顺序返回就可以了.
2. using filesort : SERVER对存储引擎返回的数据进行排序. filesort是通过相应的算法, 将获取到的数据在sort\_buffer\_size系统变量设置的内存中进行排序. 如果内存装不下, 将会使用磁盘进行数据分块, 在对各块数据进行排序之后合并. sort\_buffer\_size设置的排序区是每个线程独占的, 所以同一时刻. 可以有多个sort buffer.

**避免filesort**

尽量减少额外的排序, 通过索引直接返回有序数据.

**对filesort优化**

有些情况下filesort无法避免, 这时就要优化他.

filesort排序有两种排序算法:

1. 两次扫描排序: 根据条件取出排序字段和行指针, 之后再sort buffer中排序, 如果sort buffer不够用, 在临时表中存储排序结果. 完成排序之后, 根据行指针返回排序结果.
    第一次获取排序字段和行指针, 第二次根据行指针获取记录. 尤其第二次会导致大量IO操作, 优点是排序时使用的内存空间小.
2. 一次扫描排序: 直接返回所有符合条件的数据, 然后再sort buffer中根据指定字段进行排序. 内存开销大, 效率高.

mysql根据系统变量max\_length\_for\_sort\_data设定切换两种排序的阈值, 通过Query语句返回的字段大小来判断使用哪种算法.max\_length\_for\_sort\_data大, 就会更容易采用第二种算法.

但是max\_length\_for\_sort\_data设置过大, 会造成CPU使用率低磁盘IO高, 并有可能导致mysql使用内存过大, 导致系统SWAP严重.

所以, 也需要注意不要使用select *, 减少返回数据的大小.

## group by优化

mysql在执行group by时会隐含对group by后的所有字段进行排序, 如果想避免这种排序, 可以指定order by null, 来禁止排序.

## 优化嵌套查询

使用join来替代子查询. 之所以这样更快, 是因为join不需要在内存中创建临时表来完成这个逻辑上需要两步的查询工作.

## 优化or条件

方法就是在or两侧都建立索引.

这样, 会对or两侧的字段各自使用索引进行查询, 最后在union到一起.

需要注意的是, 对复合索引如果分布在or两侧是不会走索引的(因为其中一侧不满足最左前缀原则)

## 优化分页查询

**思路一**

在索引上完成排序分页的操作, 然后根据主键回表查询所需要的列.

例如:

```sql
select film_id, description from film order by title limit 50, 5;
```

会排序, 全表扫描找到第50个记录开始的5条记录

```sql
select a.film_id, a.decription from film a inner join (select film_id from film order by title limit 50, 5) b on a.film_id = b.film_id;
```

这样会对title索引进行全部扫描, 然后再回表取出满足条件的数据.

**思路二**

将limit查询转化为位置查询.

假设一个表里有1 0000 0000条数据, 现在要取limit 99999995, 5:

```sql
select col1 from tableA order by p_key limit 99999995, 5;
```

这样效率极低, 但是, 加入这次查询可以依赖上次查询结果, 那么效率将会很高.

```sql
select col1 from tableA where p_key > 上次查询最大主键值 order by p_key limit 5;
```

因为这样, 会根据值直接定位到分页的起始位置.

## 使用SQL提示

SQL hint是优化的一个重要手段, 就是通过在SQL语句中加入一些人为指定的提示来达到优化.

**sql\_buffer\_results**

```sql
select sql_buffer_results * from ...;
```

sql\_buffer\_results强制mysql生成一个临时的结果集. 只要结果集生成, 所有相关表上的锁均会被释放. 在遇到表锁或者需要很长时间才能将数据返回给客户端时, 会有所帮助, 因为可以及时释放锁.


**use index**

```sql
select count(*) from rental use index(idx_rental_date);
```

建议mysql使用指定的索引列表中的索引进行查询, 而不再考虑其他索引.

**ignore index**

```sql
select count(*) from rental ignore index(idx_rental_date);
```

建议mysql不要使用指定索引列表中的索引进行查询.

**force index**

```sql
select count(*) from rental force index(idx_rental_date);
```

强制mysql使用指定的索引进行查询, 即使mysql评估出使用该索引查询效率可能很低.

