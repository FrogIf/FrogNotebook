# Redis

## 概述

Redis，英文全称是Remote Dictionary Server（远程字典服务），是一个开源的使用ANSI C语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种语言的API。

与MySQL数据库不同的是，Redis的数据是存在内存中的。它的读写速度非常快，每秒可以处理超过10万次读写操作。因此redis被广泛应用于缓存，另外，Redis也经常用来做分布式锁。除此之外，Redis支持事务、持久化、LUA 脚本、LRU 驱动事件、多种集群方案。

## Redis中的数据类型

* 5种基本数据类型
  * String
  * Hash
  * List
  * Set
  * zset(有序集合)
* 3种特殊的数据类型
  * Geospatial
  * Hyperloglog
  * Bitmap

**String**

特点:

* 二进制安全, 可以存储图片或者序列化对象
* 值最大存储为512M

常用命令:

* set *key* *value*
* get *key*

应用场景: session共享, 分布式锁, 计数器, 限流

内部编码有三种:

* int(8字节长整形)
* embstr(小于等于39字节字符串)
* ram(大于39字节字符串)

Redis使用SDS(simple dynamic string)封装, sds源码如下:

```c
struct sdshdr{
    unsigned int len; // 标记buf总长度
    unsigned int free;  // 标记buf中未使用的元素个数
    char buf[];
}
```

https://www.cnblogs.com/-wenli/p/13055314.html

## 基本命令

dbsize
select *index*
auth *password*
ttl *key*
expire *key*