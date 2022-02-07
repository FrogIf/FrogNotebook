# 常用函数

## 函数

**字符串函数**

函数|功能
-|-
concat(s1, s2, ...)|连接s1, s2, ...为一个字符串
insert(str, x, y, instr)|将字符串str从第x为开始, y个字符长的子串(x从1开始, 下同)
lower(str)|将str变为小写
upper(str)|将str变为大写
left(str, x)|返回str最左侧的x个字符
right(str, x)|返回str最右侧的x个字符
lpad(str, n, pad)|用字符串pad对str最左边进行填充, 直至长度达到n
rpad(str, n, pad)|用字符串pad对str最右边进行填充, 知道长度达到n
ltrim(str)|去掉字符串左侧的空格
rtrim(str)|去掉字符串右侧的空格
trim(str)|去掉字符串两侧的空格
repeat(str, x)|返回str重复x次的结果
strcmp(s1, s2)|比较字符串s1, s2的acsii码值大小
substring(str, x, y)|返回str从x起y长度的子串

**数值函数**

函数|功能
-|-
abs(x)|返回x的绝对值
ceil(x)|向上取整
floor(x)|向下取整
mod(x, y)| x % y
rand()|返回0--1内的随机数
round(x, y)|x四舍五入, 保留y为小数
truncate(x, y)|返回数字x截断为y位小数的结果

**时间日期函数**

函数|功能
-|-
curdate()|返回当前日期
curtime()|返回当前时间
new()|返回当前日期加时间
unix_timestamp(date)|返回日期date的unix时间戳(java中的new Date().getTime())
from_unixtime(utime)|返回utime的date值
week(date)|返回date是一年中的第几周
year(date)|返回日期date的年份
hour(time)|返回time的小时值
minute(time)|返回time的分钟值
monthname(date)|返回日期的月份名
date_formate(date, fmt)|格式化日期
date_add(date, INTERVAL expr type)|返回日期值加上一个时间间隔的时间值
datediff(expr1, expr2)|返回起始时间expr1和expr2之间的间隔天数

**流程函数**

函数|功能
-|-
if(value, t, f)|value是真返回t, value是假返回f
ifnull(value1, value2)|如果value1不为空, 返回value1, 否则返回value2
case when [value1] then [result1] ... else [default] end|如果value1是真, 返回result1, ..., 否则返回default
case [expr] when [value1] then [result1] ... else [default] end|如果expr等于value1, 返回result1, ..., 否则返回default

**其他函数**

函数|功能
-|-
datebase()|返回当前数据库名
version()|返回当前数据库版本
user()|返回当前登录用户
inet_aton(ip)|返回ip地址的数字表示
inet_ntoa(num)|返回数字代表的ip地址
password(str)|返回字符串str的加密版本
md5(str)|返回字符串str的md5值

**聚合函数**

聚合函数总共有5个:

函数|功能
-|-
COUNT()|总行数
MAX()|最大值
MIN()|最小值
SUM()|求和
AVG()|求平均值

> count(*)和count(1)的执行效率差别不大且很高, 效果仅仅是统计行数, 不会忽略null值.    
> count(col\_name)效率要低一些, 但是会根据指定的col\_name去统计, 会把指定col\_name值为null的去除


## 应用

**日期计算**

1. MySQL 为日期增加一个时间间隔：date\_add()

* now()       //now函数为获取当前时间
* select date\_add(now(), interval 1 day); - 加1天
* select date\_add(now(), interval 1 hour); -加1小时
* select date\_add(now(), interval 1 minute); - 加1分钟
* select date\_add(now(), interval 1 second); -加1秒
* select date\_add(now(), interval 1 microsecond);-加1毫秒
* select date\_add(now(), interval 1 week);-加1周
* select date\_add(now(), interval 1 month);-加1月
* select date\_add(now(), interval 1 quarter);-加1季
* select date\_add(now(), interval 1 year);-加1年

> MySQL adddate(), addtime()函数，可以用date_add() 来替代。

2. MySQL 为日期减去一个时间间隔：date\_sub()

MySQL date\_sub() 日期时间函数 和date\_add() 用法一致。

> MySQL 中subdate(),subtime()函数，建议，用date_sub()来替代。


```sql
mysql> select * from test;
+------+------+------+
| id_  | c    | v    |
+------+------+------+
| 0001 | a    | aa   |
| 0002 | b    | bb   |
| 0003 | c    | cc   |
+------+------+------+
3 rows in set (0.00 sec)

mysql> select if(c = 'a', 'find it', 'no!') from test;
+-------------------------------+
| if(c = 'a', 'find it', 'no!') |
+-------------------------------+
| find it                       |
| no!                           |
| no!                           |
+-------------------------------+
3 rows in set (0.00 sec)

mysql> insert into test (c, v) values(null, 'kk');
Query OK, 1 row affected (0.04 sec)

mysql> select ifnull(c, 'n/a') from test;
+------------------+
| ifnull(c, 'n/a') |
+------------------+
| a                |
| b                |
| c                |
| n/a              |
+------------------+
4 rows in set (0.00 sec)

mysql> select case c when 'a' then 'is a' when 'c' then 'is c' else 'i do not known' end from test;
+----------------------------------------------------------------------------+
| case c when 'a' then 'is a' when 'c' then 'is c' else 'i do not known' end |
+----------------------------------------------------------------------------+
| is a                                                                       |
| i do not known                                                             |
| is c                                                                       |
| i do not known                                                             |
+----------------------------------------------------------------------------+
4 rows in set (0.00 sec)
```