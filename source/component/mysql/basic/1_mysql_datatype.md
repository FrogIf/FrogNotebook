# 基本数据类型

## 概述

<table border="1">
    <tr>
        <th>分类</th>
        <th colspan="4">描述</th>
    </tr>
    <tr>
        <th rowspan="13">数值类型</th>
        <th>整数类型</th>
        <th>字节</th>
        <th>最小值</th>
        <th>最大值</th>
    </tr>
    <tr>
        <td>TINYINT</td>
        <td>1</td>
        <td>有符号:-2^7<br/>无符号:0</td>
        <td>有符号:2^7-1<br/>无符号:2^8-1=255</td>
    </tr>
    <tr>
        <td>SMALLINT</td>
        <td>2</td>
        <td>有符号:-2^15<br/>无符号:0</td>
        <td>有符号:2^15-1<br/>无符号:2^16-1=65535</td>
    </tr>
    <tr>
        <td>MEDIUMINT</td>
        <td>3</td>
        <td>有符号:-2^23<br/>无符号:0</td>
        <td>有符号:2^23-1<br/>无符号:2^24-1</td>
    </tr>
    <tr>
        <td>INT, INTEGER</td>
        <td>4</td>
        <td>有符号:-2^31<br/>无符号:0</td>
        <td>有符号:2^31-1<br/>无符号:2^32</td>
    </tr>
    <tr>
        <td>BIGINT</td>
        <td>8</td>
        <td>有符号:-2^63<br/>无符号:0</td>
        <td>有符号:2^63-1<br/>无符号:2^64</td>
    </tr>
    <tr>
        <th>浮点数类型</th>
        <th>字节</th>
        <th>最小值</th>
        <th>最大值</th>
    </tr>
    <tr>
        <td>FLOAT</td>
        <td>4</td>
        <td>IEEE754标准:-2^128</td>
        <td>IEEE754标准:+2^128</td>
    </tr>
    <tr>
        <td>DOUBLE</td>
        <td>8</td>
        <td>IEEE754标准:-2^1024</td>
        <td>IEEE754标准:2^1024</td>
    </tr>
    <tr>
        <th>定点数</th>
        <th>字节</th>
        <th colspan="2">描述</th>
    </tr>
    <tr>
        <td>DEC(M,D)<br/>DECIMAL(M,D)</td>
        <td>M+2</td>
        <td colspan="2">最大值取值范围与DOUBLE相同, 给定DECIMAL有效值范围由M和D决定</td>
    </tr>
    <tr>
        <th>位类型</th>
        <th>字节</th>
        <th>最小值</th>
        <th>最大值</th>
    </tr>
    <tr>
        <td>BIT(M)</td>
        <td>1 -- 8</td>
        <td>BIT(1)</td>
        <td>BIT(64)</td>
    </tr>
    <tr>
        <th rowspan="6">日期时间类型</th>
        <th>类型</th>
        <th>字节</th>
        <th>最小值</th>
        <th>最大值</th>
    </tr>
    <tr>
        <td>DATE</td>
        <td>4</td>
        <td>1000-01-01</td>
        <td>9999-12-31</td>
    </tr>
    <tr>
        <td>DATETIME</td>
        <td>8</td>
        <td>1000-01-01 00:00:00</td>
        <td>9999-12-31 23:59:59</td>
    </tr>
    <tr>
        <td>TIMESTAMP</td>
        <td>4</td>
        <td>19700101080001</td>
        <td>2038年的某个时刻</td>
    </tr>
    <tr>
        <td>TIME</td>
        <td>3</td>
        <td>-838:59:59</td>
        <td>838:59:59</td>
    </tr>
    <tr>
        <td>YEAR</td>
        <td>1</td>
        <td>1901</td>
        <td>2155</td>
    </tr>
    <tr>
        <th rowspan="14">字符串类型</th>
        <th>类型</th>
        <th>字节</th>
        <th colspan="2">描述及存储需求</th>
    </tr>
    <tr>
        <td>CHAR(M)</td>
        <td>M</td>
        <td colspan="2">M为0 - 255之间的整数</td>
    </tr>
    <tr>
        <td>VARCHAR(M)</td>
        <td>M</td>
        <td colspan="2">M为0 - 65535之间的整数</td>
    </tr>
    <tr>
        <td>TINYBLOB</td>
        <td></td>
        <td colspan="2">允许长度0 - 255字节, 值的长度+1个字节</td>
    </tr>
    <tr>
        <td>BLOB</td>
        <td></td>
        <td colspan="2">允许长度0 - 65535字节, 值的长度+2个字节</td>
    </tr>
    <tr>
        <td>MEDIUMBLOB</td>
        <td></td>
        <td colspan="2">允许长度0 - 2^24 - 1字节, 值的长度+3个字节</td>
    </tr>
    <tr>
        <td>MEDIUMBLOB</td>
        <td></td>
        <td colspan="2">允许长度0 - 2^24 - 1字节, 值的长度+3个字节</td>
    </tr>
    <tr>
        <td>LONGBLOB</td>
        <td></td>
        <td colspan="2">允许长度0 - 2^32 - 1字节, 值的长度+4个字节</td>
    </tr>
    <tr>
        <td>TINYTEXT</td>
        <td></td>
        <td colspan="2">允许长度0 - 255字节, 值的长度+2个字节</td>
    </tr>
    <tr>
        <td>TEXT</td>
        <td></td>
        <td colspan="2">允许长度0 - 65535字节, 值的长度+2个字节</td>
    </tr>
    <tr>
        <td>MEDIUMTEXT</td>
        <td></td>
        <td colspan="2">允许长度0 - 2^24 - 1字节, 值的长度+3个字节</td>
    </tr>
    <tr>
        <td>LONGTEXT</td>
        <td></td>
        <td colspan="2">允许长度0 - 2^32 - 1字节, 值的长度+4个字节</td>
    </tr>
    <tr>
        <td>VARBINARY(M)</td>
        <td>M</td>
        <td colspan="2">允许长度0 - M个字节的变长字节字符串, 值的长度+1个字节</td>
    </tr>
    <tr>
        <td>BINARY(M)</td>
        <td>M</td>
        <td colspan="2">允许长度0 - M个字节的变长字节字符串</td>
    </tr>
</table>

## 数值类型

**整型**

表中整型只是存储范围和存储方式不同, 使用起来都是一样的. 这里以int为例.

```sql
col_name int(M)
```

> 对于整型的括号中的M指示显示宽度, 显示宽度与存储大小或类型包含的值得范围无关. 但是不论显示宽度设定多少, 只要存的值在int指定的范围内, 就可以存储进去.
> 如果指定显示宽度, 默认的显示宽度是11.

整型的属性:

* zerofill : 数值长度不够足显示长度时, 使用0填充
* unsigned : 指定为无符号整型(当使用zerofill时, 会自动设置该列为无符号整型)
* auto\_increment : 设定该整型列的值自增, 需要注意的是一个表只能有一个auto\_increment列, 并且该列必须满足: 1. not null; 2. primary key/unique.


**浮点数和定点数**

```sql
col_name float(M, D)
col_name double(M, D)
col_name decimal(M, D)
```

* M 精度: 表示该值小数位+整数位的最大长度
* D 标度: 表示该值小数部分有多少位

> 浮点数, 不指定精度和标度时, 会按照实际精度去存储(这个由操作系统决定)
> 定点数, 不指定精度和标度时, 会按照decimal(10, 0)

对于浮点数, 数值超过精度标度时, 如果不是传统sqlmode, 则会四舍五入, 不会报错. 对于定点数, 如果数据超越了精度和标度, 系统直接报错.

**BIT**

```sql
col_name bit(M)
```

对于bit类型, 用于存放为字段值, bit(M)可以用来存放多为二进制数, M范围从1--64, 如果不写, 默认为1. 对于位字段, 直接使用select将不会看到结果. 可以使用bin()(显示为二进制格式)或者hex()(显示为十六进制格式)函数进行读取.

> 如果插入的值位数大于M会报错.

## 日期和时间

略

## 字符串类型

**CHAR和VARCHAR和TEXT**

```
char(M)
varchar(M)
TEXT(M)
```

可存储的最大长度:
* CHAR : 255个**字符**
* VARCHAR: 65535个**字节**
* TEXT : 65535个**字节**

M的含义:
* 三个数据类型中, M都是表示字符
* 对于TEXT, M作用不大, 在字符长度超过M时依然可以存储

关于char:
* char为固定长度列, 每插入一个值, 都是分配固定的字节空间来存储, 不管是否浪费
* 虽然char是固定长度, 但是不足时, ***并不会采用空格来填充***
* 保存char值时, 如果该字符串尾部有空格, 会自动取消

关于varchar
* varhcar可存储的最大长度时65535**字节**
* M的的取值范围受字符集编码限制, 在utf8下, M取值范围为:0-21844(utf8中每个字符占用3个字节)

既然varchar和text都是存储65535个字节, 那么这两者应用上有什么区别吗? 一下是stackoverflow上给出了一些答案:
```txt
首先, 对于非innodb引擎:
text和blob是offline存储, 记录内只存储数据的指针. varhcar是行内存储.
对于innodb引擎, text和blob还有varchar都是行内存储.

行内存储有以下优缺点:
优点:
1. 检索快

缺点:
1. 频繁增删会产生大量数据空洞
2. mysql对每条记录的大小是有限制的, 如果其中一个字段占据很大的尺寸, 就会导致每行存储的列表变少

因此Innodb引擎下, 使用text还是varchar都是无所谓的, 其余引擎下需要根据需求来取舍.
```

```txt
TEXT and BLOB is stored off the table with the table just having a pointer to the location of the actual storage.
VARCHAR is stored inline with the table. VARCHAR is faster when the size is reasonable, the tradeoff of which would be faster depends upon your data and your hardware, you'd want to benchmark a realworld scenario with your data.
Whether VARCHAR or TEXT is stored inline, or off-record depends on data size, columns size, row_format, and MySQL version. It does not depend on "text" vs "varchar".
总结一下就是:
text和blob类型不是存储在行内的, 每一行数据中只存在一个该数据的指针. varchar是将数据直接存储在行内的.
所以采用text还是varchar需要考虑这个数据是否是经常增删的(如果经常增删则考虑使用text, 否则容易产生数据碎片), 是否是注重查询效率的(如果注重查询效率, 则使用varchar, 因为他是行内存储容易检索, 减少IO次数)
```

## 使用帮助

```sql
mysql> ? data types
You asked for help about help category: "Data Types"
For more information, type 'help <item>', where <item> is one of the following
topics:
   AUTO_INCREMENT
   BIGINT
   BINARY
   BIT
   BLOB
   BLOB DATA TYPE
   BOOLEAN
   CHAR
   CHAR BYTE
   DATE
   DATETIME
   DEC
   DECIMAL
   DOUBLE
   DOUBLE PRECISION
   ENUM
   FLOAT
   INT
   INTEGER
   LONGBLOB
   LONGTEXT
   MEDIUMBLOB
   MEDIUMINT
   MEDIUMTEXT
   SET DATA TYPE
   SMALLINT
   TEXT
   TIME
   TIMESTAMP
   TINYBLOB
   TINYINT
   TINYTEXT
   VARBINARY
   VARCHAR
   YEAR DATA TYPE

mysql> ? int
Name: 'INT'
Description:
INT[(M)] [UNSIGNED] [ZEROFILL]

A normal-size integer. The signed range is -2147483648 to 2147483647.
The unsigned range is 0 to 4294967295.

URL: http://dev.mysql.com/doc/refman/5.7/en/numeric-type-overview.html


mysql> ? varchar
Name: 'VARCHAR'
Description:
[NATIONAL] VARCHAR(M) [CHARACTER SET charset_name] [COLLATE
collation_name]

A variable-length string. M represents the maximum column length in
characters. The range of M is 0 to 65,535. The effective maximum length
of a VARCHAR is subject to the maximum row size (65,535 bytes, which is
shared among all columns) and the character set used. For example, utf8
characters can require up to three bytes per character, so a VARCHAR
column that uses the utf8 character set can be declared to be a maximum
of 21,844 characters. See
http://dev.mysql.com/doc/refman/5.7/en/column-count-limit.html.

MySQL stores VARCHAR values as a 1-byte or 2-byte length prefix plus
data. The length prefix indicates the number of bytes in the value. A
VARCHAR column uses one length byte if values require no more than 255
bytes, two length bytes if values may require more than 255 bytes.

*Note*:

MySQL follows the standard SQL specification, and does not remove
trailing spaces from VARCHAR values.

VARCHAR is shorthand for CHARACTER VARYING. NATIONAL VARCHAR is the
standard SQL way to define that a VARCHAR column should use some
predefined character set. MySQL uses utf8 as this predefined character
set. http://dev.mysql.com/doc/refman/5.7/en/charset-national.html.
NVARCHAR is shorthand for NATIONAL VARCHAR.

URL: http://dev.mysql.com/doc/refman/5.7/en/string-type-overview.html
```

通过上面的帮助可以知道mysql所支持的所有数据类型, 并且知道了INT类型的取值范围.

得知VARCHAR类型可以容纳65535个字节(2^16 - 1), 但是在定义varchar(m)时, m的值并不是字节, 而是字符, 所以, 不同字符编码下, m的最大值不同, 在utf-8下, m的最大值为21844.

