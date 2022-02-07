# 常用函数

## 单行函数

* 字符函数
	* concat(str1, str2)	连接字符串
	* length(str)	计算字符串的长度
	* replace(str, str1, str2)	将str中的str1替换为str2
	* lower(str)	将str全部转换为小写
	* upper(str)	将str全部转换为大写

* 数值函数
	* round(num, len)	将num保留len位小数四舍五入, len可选,不写相当于了len=0
	* trunc(num, len)	将num按len截断, len可选, 同上
	* mod(num1, num2)	取模

* 日期函数
	* months_between(date1, date2)	计算两个日期之间的月份间隔
	* add_months(date1, mon)	计算mon个月后的日期

> 两个日期相减返回值为天数
> 获取当前日期:sysdate

* 转换函数
	* to_char()
		* 对日期进行转换:to_char(date, 'format_model');
		* 对数字进行转换:to_char(number, 'format_model')
	* to_number(str, 'format_model')	将字符串转换为数字
	* to_date(str, 'format_model')		将字符串转换为日期

* 通用函数
	* nvl(arg1, arg2)	空值处理

## 多行函数

就是聚合函数: avg() count() max() min() sum()

## 日期计算

oracle数据库中有多种对日期加减的计算分三种情况:

1. **直接加减**

(1)求当前时间及一天后:

```
select sysdate,sysdate + 1 from dual;
```

输出为：
	2018-1-24 14:05:19	2018-1-25 14:05:19

(2)求当前时间及一小时后:

```
select sysdate,sysdate + 1/24 from dual;
```

输出为：
    2018-1-24 14:07:45	2018-1-24 15:07:45

求分钟及秒只要做相应除法即可。
不过此种方法不能做月的加减，因为每月的天数不一样。

2. **用函数add_months**

(1)求当前时间及一年后：

```
select sysdate,add_months(sysdate,1*12) from dual;
```

输出为：
	2018-1-24 14:11:03	2019-1-24 14:11:03

(2)求当前时间及一月后:

```
select sysdate,add_months(sysdate,1) from dual;
```

输出为：
	2018-1-24 14:11:03	2018-2-24 14:11:03

同样，此方法不能做天及更小的时间加减，因为每月天数不一样的原因。

3. **使用numtoyminterval（发音：num to Y M interval）或numtodsinterval（发音：num to D S interval）函数**

(1)求当前时间及一年后

```
select sysdate,sysdate + numtoyminterval(1,'year') from dual;
```

输出为：
	2018-1-24 14:32:34	2019-1-24 14:32:34

(2)求当前时间及一月后

```
select sysdate,sysdate + numtoyminterval(1,'month') from dual;
```

输出为：
	2018-1-24 14:33:49	2018-2-24 14:33:49

(3)求当前时间及一天后

```
select sysdate,sysdate + numtodsinterval(1,'day') from dual;
```

输出为：
	2018-1-24 14:34:52	2018-1-25 14:34:52

(4)求当前时间及一小时后

```
select sysdate,sysdate + numtodsinterval(1,'hour') from dual;
```

输出为：
	2018-1-24 14:35:47	2018-1-24 15:35:47

(5) 求当前时间及一分钟后

```
select sysdate,sysdate + numtodsinterval(1,'minute') from dual;
```

(6) 求当前时间及一秒后：

```
select sysdate,sysdate + numtodsinterval(1,'second') from dual;
```

相比而言，第三种函数功能还是比较强大的，但是拼写字母太多，用的比较少，毕竟前两种已经够用了。

## Trunc

英文原译: 将数字截尾取整

TRUNC()：类似截取函数，按指定的格式截取输入的数据。
1.【trunc(for dates)】TRUNC()函数处理日期
    语法格式：TRUNC（date[,fmt]）
    其中：date 一个日期值；fmt 日期格式。
    该日期将按指定的日期格式截取；忽略它则由最近的日期截取。
   示例：
   select trunc(sysdate) from dual;--2017/2/13,返回当前时间
   select trunc(sysdate,'yy') from dual;--2017/1/1,返回当年第一天
   select trunc(sysdate,'mm') from dual;--2017/2/1,返回当月的第一天
   select trunc(sysdate,'d') from dual;--2017/2/12,返回当前星期的第一天，即星期天
   select trunc(sysdate,'dd') from dual;--2017/2/13,返回当前日期,今天是2017/2/13
   select trunc(sysdate ,'HH24') from dual;--2017/2/13 15:00:00,返回本小时的开始时间
   select trunc(sysdate ,'MI') from dual;--2017/2/13 15:13:00,返回本分钟的开始时间
2.【TRUNC(for number)】TRUNC()函数处理number型数字
    语法格式：TRUNC（number[,decimals]）
    其中： number 待做截取处理的数值；decimals 指明需保留小数点后面的位数，可选项，忽略它则截去所有的小数部分。
    注意：截取时并不对数据进行四舍五入。
    示例：
    select trunc(123.567,2) from dual;--123.56,将小数点右边指定位数后面的截去;
    select trunc(123.567,-2) from dual;--100,第二个参数可以为负数，表示将小数点左边指定位数后面的部分截去，即均以0记;
    select trunc(123.567) from dual;--123,默认截去小数点后面的部分;

