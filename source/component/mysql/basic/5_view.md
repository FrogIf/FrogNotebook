# 视图

## 概述

mysql从5.0.1开始支持视图.

权限要求:
* 创建视图: CREATE VIEW, 并且对查询涉及的列有SELECT权限
* 如果使用CREATE OR REPLACE或者ALTER修改视图, 需要DROP权限

## 定义视图

```sql
创建视图:
CREATE [OR REPLACE] [ALGORITHM={UNDEFINED|MERGE|TEMPTABLE}] VIEW view_name [(column_list)] AS select_statement [WITH [CASCADED|LOCAL] CHECK OPTION];
修改视图:
ALTER [ALGORITHM={UNDEFINED|MERGE|TEMPTABLE}] VIEW view_name [(column_list)] AS select_statement [WITH [CASCADED|LOCAL] CHECK OPTION];
```

> mysql视图FROM关键字后面不能包含子查询


**可更新性**

所谓可更新是指是否可以对视图执行insert, update, delete操作

以下视图是不可更新的:

* 包含以下关键字的sql语句: 聚合函数(SUM, MAX, MIN, COUNT, AVG), DISTINCT, GROUP BY, HAVING, UNION/UNION ALL;
* 常量视图
* JOIN
* FROM一个不可更新的视图
* WHERE子句的*子查询*引用了FROM子句中的表

视图定义时的[WITH [CASCADED|LOCAL] CHECK OPTION]决定是否允许更新数据使记录不再满足视图的条件.

* LOCAL: 只要满足本视图的条件就可以更新
* CASCADED: 必须满足所有这对该视图的的所有视图条件才可以更新

> 如果只写WITH CHECK OPTION会默认使用CASCADED.

## 删除视图

```sql
DROP VIEW [IF EXISTS] view_name[, view_name2, view_name3, ...] [RESTRICT|CASCADE]
```

## 查看视图

show tables;命令会显示视图.
