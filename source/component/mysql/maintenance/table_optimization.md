# 两个常用的表优化

## 分析和检查表

```sql
ANALYZE [LOCAL|NO_WRITE_TO_BINLOG] TABLE tbl_name[,tbl_name2, ...];
```

这条语句用于存储和分析表的关键字分布, 分析结果将使得系统得到准确的统计信息, 使得sql能生成正确的执行计划. 如果感觉实际执行计划和预期的执行计划不一致, 可以执行这条命令.

```sql
CHECK TABLE tbl_name[, tbl_name2, ...]
```

检查一个表或者多个表是否存在错误

## 优化表

```sql
OPTIMIZE [LOCAL|NO_WRITE_TO_BINLOG] TABLE tbl_name[, tbl_name2, ...]
```

如果删除表中大部分数据, 或者如果已经对含有可变长度行的表(varchar, blob, text)进行了很多更改, 则使用optimize table命令进行优化表. 该命令可以将表中的空间碎片进行合并, 并且消除由于删除或者更新造成的空间浪费.

