# 索引

## 概述

* 索引是提高SELECT操作性能的最佳途径.
* MyISAM和InnoDB存储引擎默认创建的都是Btree索引. MEMORY默认使用hash索引.
* MySQL目前不支持函数索引

索引分类:

 * B-Tree索引 : 常用索引, 大部分引擎都支持的索引
 * Hash索引 : 只有Memory引擎支持, 使用场景简单
 * R-Tree索引 : 空间索引, MyISAM的特殊索引类型, 主要用于地理空间数据类型
 * Full-Text索引 : 全文索引

> btree索引和hash索引    
> 
> 关于hash索引:    
> 1. 只用于使用=和<=>的比较(不支持范围查询)    
> 2. hash索引不能加速Order by    
> 3. 只能使用整个关键字来搜索一行    
> 4. 通过hash索引, 查询更迅速    
> 
> 关于btree索引:    
>  使用>, <, >=, <=, BETWEEN, != 或者 <> 或者 like 'pattern'都可以使用相关列上的索引.


> Innodb表是根据主键顺序以索引的形式存放, 这种方式称为索引组织表.

## 索引的创建删除

```sql
CREATE [UNIQUE|FULLTEXT|SPATIAL] INDEX index_name [USING index_type] ON tbl_name(index_col_name, ...);

index_col_name:
    col_name[(length)] [ASC|DESC]
```

通过上面这个索引创建语句可以看到很多信息:

* [UNIQUE|FULLTEXT|SPATIAL] : 可选值, 不选则创建的是普通索引, 这三个关键字分别代表: 唯一索引, 全文索引, 空间索引
* [USING index_type] : 可选值, 指定索引是btree索引还是hash索引, MyISAM和InnoDB默认是btree索引
* index\_col\_name, ... : 可以指定单列索引, 也可以指定多列索引
* [(length)]: 可选值, 如果不写, 则是对该列值得全部进行索引, 如果指定长度, 则是前缀索引
* [ASC|DESC]: 索引排序, mysql8.0之后才有效

**说明:**

* 全文索引 : mysql5.0中只有MyISAM支持全文索引, 并且使用全文索引的字段必须是CHAR, VARCHAR, TEXT. 全文索引与前缀索引不兼容.
* 前缀索引 : myisam引擎前缀索引最长长度为1000字节, InnoDB引擎前缀索引最长为767字节
* 组合索引 : SELECT如果想使用组合索引, 必须满足最左前缀原则

**ALTER TABLE 建立索引**

```sql
ALTER TABLE table_name ADD [UNIQUE|SPATIAL|FULLTEXT] INDEX index_name(index_col_name, ...) [USING index_type];

ALTER TABLE table_name ADD {PRIMARY KEY|UNIQUE|SPATIAL|FULLTEXT} (index_col_name, ...)

index_col_name:
    col_name[(length)] [ASC|DESC]
```

**删除索引**

```sql
DROP INDEX index_name ON table_name;

ALTER TABLE table_name DROP PRIMARY KEY;
```

**查看索引**

```sql
SHOW INDEX FROM table_name
```

## 索引设计原则

* 经常搜索的列可以建立索引, 其余列不要建立索引, 会影响增删速度
* 使用重复值少的列建立索引, 如果索引列重复值较多, 不管搜索那个值, 都会得出一堆记录
* 使用短索引, 可以减少索引占用的空间, 加快查询速度
* 利用最左前缀
* 不要过度索引
* InnoDB引擎表中, 记录会按照一定顺序保存, 如果有主键, 则按照主键顺序存储, 没有主键, 则按照唯一索引顺序存储, 如果都没有, 会自动生成一个内部列, 按照这个顺序存储. 所以InnoDB尽量自己指定主键, 并尽量选择经常查询的列作为主键, innodb表中普通索引都会保存主键的键值, 所以主键要选择较短的数据类型, 减少索引的磁盘引用.


## 使用索引

以下采用的是B-Tree索引

1. 全值匹配
2. 范围查询
3. 最左前缀匹配
4. 对索引进行查询(覆盖索引)
5. column\_name IS NULL
6. 索引下推

存在索引, 但不能使用索引的情况:

1. 以%开头的like查询
2. 数据类型出现隐式类型转换
3. 不满足最左前缀原则
4. 有些情况下会评估出使用索引比全表扫描更慢, 这时不走索引(例如:查询"S"开头的标题, 如果需要返回的记录比例较大, Mysql觉得查索引还不如全表扫描快, 就直接全表扫描了)
5. 被or分割开的条件, 如果两侧的条件有一侧没有索引, 则不会使用索引(如果两侧都有索引, 则可以使用索引)

关于上面第四条, 我认为, 查询列的索引首先不是主键索引, 如果走索引, 需要先通过索引找到所有主键, 在通过主键回表, 再查询结果集数据量较大时, 这样的效率不如直接全表扫描更快.

## 查看索引使用情况

一条命令:

```sql
mysql> show status like 'Handler_read%';
+-----------------------+-------+
| Variable_name         | Value |
+-----------------------+-------+
| Handler_read_first    | 0     |
| Handler_read_key      | 0     |
| Handler_read_last     | 0     |
| Handler_read_next     | 0     |
| Handler_read_prev     | 0     |
| Handler_read_rnd      | 0     |
| Handler_read_rnd_next | 0     |
+-----------------------+-------+
7 rows in set (0.11 sec)
```

* Handler\_read\_key : 如果索引正在工作, 这个值会很高; 这个值表示一行被索引读的次数, 如果很低, 表示索引不经常使用.
* Handler\_read\_rnd\_next : 该值过高表示查询效率低, 应该建立索引补救. 这个值表示在数据文件中读取下一行的请求数. 如果进行大量表扫描, 则该值会很高, 说明索引不正确或者没有利用索引.