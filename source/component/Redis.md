---
title: redis
author: frogif
date: 2022-05-15
---

# Redis

## 概述

Redis，英文全称是Remote Dictionary Server（远程字典服务），是一个开源的使用ANSI C语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种语言的API。

与MySQL数据库不同的是，Redis的数据是存在内存中的。它的读写速度非常快，每秒可以处理超过10万次读写操作。因此redis被广泛应用于缓存，另外，Redis也经常用来做分布式锁。除此之外，Redis支持事务、持久化、LUA 脚本、LRU 驱动事件、多种集群方案。

redis底层使用RESP协议(Redis Serialization Protocol), 是专门为redis设计的一套序列化协议.

## 基本命令

* dbsize 查询库中元素个数
* select *index* 选择指定的库, 范围: 0 -- 15
* auth *password* 输入密码
* ttl *key* 查询指定key的过期时间
  * key不存在返回 -2(since 2.8), 没有指定过期时间返回 -1
* expire *key* *seconds* 指定一个key的过期时间
* exists *key* 判断一个key是否存在
  * 存在返回1, 否则返回0
* del *key1* *key2* ... 删除kv
* rename *key* *newkey* 重命名

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
* incr *key*
* decr *key*

> incr和decr只支持long类型范围内的数字, 即[-2^63, 2^63-1]

应用场景: session共享, 分布式锁, 计数器, 限流

Redis使用SDS(simple dynamic string)封装, 并且3.2以上版本, 针对不同长度定义了不同的数据结构, 3.2下版本的大致结构如下:

```c
struct sdshdr{
    unsigned int len; // 标记buf总长度
    unsigned int free;  // 标记buf中未使用的元素个数
    char buf[];
}
```

redis之所以选择sds而不是使用c语言原生```char[]```是因为sds中, 可以在O(1)时间复杂度内, 就可以获取到字符串的长度, 而```char[]```则需要O(n).

**Hash**

Hash类型是指v本身又是一个键值对(k-v)结构

常用命令:

* hset *key* *field* *value*
* hget *key* *field*
* hgetall *key* (如果使用hgetall, 当hash元素较多时, 可能会造成Redis阻塞, 可以使用hscan. 如果只是获取部分field, 建议使用hmget)
* hmget *key* *field1* *field2* ...
* hscan *key* *cursor* [match *pattern*] [count *count*] (cursor是一个数字, 初始时, 输入0, 下一次输入上一次返回的值)

应用场景: 缓存用户信息等

**List**

列表(list)类型是用来存储多个有序(按照插入顺序排序)的字符串, 一个列表最多可以存储2^32-1个元素

常用命令:

* lpush *key* *value1* *value2* ...
* lrange *key* *start* *end*
* rpush *key* *value1* *value2* ...
* lpop *key* [*count*]
* rpop *key* [*count*]

应用场景:

消息队列, 文章列表:

* 栈: lpush + lpop
* 队列: lpush + rpop
* 有限集合: lpsh + ltrim
* 消息队列: lpush + brpop

**Set**

用于保存多个的字符串元素, 不允许重复元素

常用命令:

* sadd *key* *element1* *element2* ...
* smembers *key*

应用场景: 用户标签, 生成随机数抽奖, 社交需求

> smembers, lrange, hgetall都属于较重的命令, 如果元素过多, 存在阻塞Redis的可能性, 对于smembers可以使用sscan来完成.

**zset**

已排序的字符串集合, 元素不能重复

常用命令:

* zadd *key* *score1* *member1* *score2* *member2* ...
* zrank *key* *member*

> score越小, 越靠前

应用场景: 排行榜, 社交需求(用户点赞等)

zset底层使用ziplist(压缩列表)和skiplist(跳跃表)来实现的. 默认情况下, 元素数量小于128并且每个元素长度小于64字节时, 使用ziplist, 否则使用SkipList.

**三种特殊数据类型**

* Geo: 3.2推出的, 地理位置定位, 用于存储地理位置信息, 并对存储的信息进行操作
* HyperLogLog: 用来做基数统计算法的数据结构, 如统计网站的UV
* Bitmaps: 用一个比特位来映射某个元素的状态, 在Redis中, 它的底层是基于字符串类型实现的, 可以把bitmaps看做为一个以bit为单位的数组.

## Redis速度快的原因

1. 基于内存存储
2. 高效的数据结构
   * SDS简单动态字符串
     * 字符串长度处理: 获取字符串长度的时间复杂度为O(1), 而C语言中, 需要从头开始遍历, 复杂度为O(n)
     * 空间预分配: 字符串修改越频繁, 内存分配越频繁, 就会越消耗性能, 而SDS修改和空间扩充, 会额外分配未使用的空间, 减少性能损耗
     * 惰性空间释放: SDS缩短时, 不是回收多余的内存空间, 而是free记录下多余的空间, 后续有变更, 直接使用free中记录的空间, 减少分配
     * 二进制安全: Redis可以用来存储二进制数据, 在C语言中字符串遇到'\0'会结束, 而SDS中标志字符串结束的是len属性
   * 字典: 作为k-v数据库, 所有键值都是用字典来存储, 在O(1)时间复杂的就可以获得对应的值
   * 跳跃表: zset的底层实现, 就是在链表的基础上, 增加多级索引提升查找效率
3. 合理的数据编码: Redis支持多种数据类型, 每种类型可能对多种数据结构, 什么时候使用什么编码, 是redis设计者总结优化的结果
   * String: 数字-int; 小于等于39字节-embsttr; 大于39字节-raw编码
   * List: 如果列表的元素个数小于512个, 列表每个元素的值都小于64字节(默认), 使用ziplist(压缩列表), 否则使用linkedlist
   * Hash: 哈希类型元素个数小于512个, 所有值都小于64字节, 使用ziplist,否则使用hashtable
   * Set: 如果集合中元素都是整数且个数小于512个, 使用intset编码, 否则使用hashtable
   * Zset: 当有序集合的元素个数小于128个, 每个元素的值小于64字节, 使用ziplist, 否则使用skiplist(跳跃表)
4. 合理的线程模型
   * I/O多路复用(epoll), 多个连接复用同一个线程, 让单个线程更高效的处理多个连接请求.
   * 单线程模型: redis是单线程模型, 避免了CPU不必要的上下问切换和竞争锁消耗. 但是, 如果某个命令执行过长, 会造成阻塞.
     * redis6.0引入多线程提速, 但是执行命令操作内存仍然是单线程. 只是使用多线程来处理数据读写和协议解析. 因为redis性能瓶颈在于网络IO而非CPU, 使用多线程能提升IO读写效率, 从而提升redis性能
5. 虚拟内存机制
   * redis构建了自己的VM机制, 不会像一般的系统的会调用系统函数处理, 浪费时间去移动和请求
   * 虚拟内存机制是指: 把暂时不经常访问的数据(冷数据)从内存交换到磁盘中, 从而腾出宝贵的内存空间用于其他需要访问的数据(热数据). 通过VM功能可以实现冷热数据分离, 使热数据仍在内存中, 冷数据保存在磁盘. 这样就可以避免因为内存不足而造成访问速度下降的问题.

## 缓存击穿/缓存穿透/缓存雪崩

**缓存穿透**

* 定义: 指缓存和数据库中都没有数据, 而用户不断发送请求, 如发起id为"-1"或者id为特别大不存在的数据. 这时的用户很可能是攻击者, 攻击会导致数据库压力过大
* 解决方案:
 1. 接口层增加校验, 如用户权鉴, id做基础校验, id<=0直接拦截;
 2. 从缓存取不到数据, 在数据库中也取不到, 这时可以将key-value写为key-null, 缓存有效时间可以设置短点(设置太长会导致正常情况下也没法使用). 这样就可以防止攻击用户反复用同一个id暴力攻击
 3. 使用布隆过滤器, 快速判断数据是否存在. 即一个查询请求过来时, 先通过布隆过滤器判断值是否存在, 存在才继续往下查


**缓存击穿**

* 定义: 缓存击穿是指缓存中没有但是数据库中有数据(一般是缓存时间到期), 这时由于并发用户特别多, 同时读缓存没有读到数据, 有同时去数据库取数据, 引起数据库压力瞬间增大.
* 解决方案:
  1. 设置热点数据永远不过期
  2. 加互斥锁
  3. 其中一个线程请求新值, 其余线程暂时使用旧值

**缓存雪崩**

* 定义: 缓存雪崩是指缓存中数据大批量到期, 而查询数据量巨大, 引起数据库压力过大. 和缓存击穿不同的是, 缓存击穿是指并发查询同一条数据, 缓存雪崩是不同数据都过期了, 很多数据都查询不到从而查询数据库
* 解决方案:
   1. 缓存数据的过期时间设置随机, 防止同一时间大量数据过期现象发生
   2. 如果缓存数据库是分布式部署, 将热点数据均匀分布在不同缓存数据库中
   3. 设置热点数据永远不过期

## Redis过期策略和内存淘汰策略

**Redis过期策略**

在向redis存储数据的时候, 可以给这个key设置过期时间(expire key seconds), 一旦到了过期时间, redis是如何处理的呢?

首先, 看一下常见的几种过期策略:

1. 定时过期: 每个设置过期时间的key都需要创建一个定时器, 到过期时间就会立即对key进行清除. 该策略可以立即清除过期的数据, 对内存很友好. 但是会占用大量的CPU资源去处理过期的数据, 从而影响缓存的响应时间和吞吐量.
2. 惰性过期: 只有当访问一个key时, 才会判断该key是否已经过期, 过期则清除. 该策略可以最大化的节省CPU资源. 却对内存非常不友好. 极端情况下, 可能出现大量过期key没有再次被访问, 从而不会被清除, 占用大量内存.
3. 定期过期: 每隔一段时间, 会扫描一定数量的expires字典中一定数量的key, 并清除其中已过期的key. 通过调整定时扫描的时间间隔和每扫描的限定耗时, 可以在不同情况下使得CPU和内存资源达到最优的平衡效果. expires自定会保存所有设置了过期时间的key的过期时间数据, 其中, key是指向键空间中某个键的指针, value是该键的毫秒精度的UNIX时间戳表示的过期时间. 键空间是指该Redis集群中保存的所有键.

Redis中同时使用了惰性过期和定期过期两种策略:

假设redis当前存放了30万个key, 并且都设置了过期时间, 如果你每隔100ms就去检查这全部的key, CPU负载会很高, 最后可能会挂掉. 因此, redis采用的是定期过期, 每隔100ms就随机抽取一定数量的key来检查和删除. 但是, 最后可能会有很多已经过期的key没有被删除. 这时候, redis采用惰性删除. 在你获取某个key的时候, redis会检查一下, 这个key如果设置了过期时间并且已经过期了, 此时就会删除.

**Redis内存淘汰策略**

如果定期删除漏掉了很多过期的key, 并且也没有走惰性删除. 就会有很多过期key积在内存, 导致内存爆满. 或者有时业务量太大, redis的key被大量使用, 内存直接不够用. 这时redis会采取内存淘汰策略来保护自己.

redis有多种内存淘汰策略可供选择:

* noeviction: 默认策略, 当内存不足以容纳新写入的数据时, 新写入操作会报错.
* volatile-lru: 当内存不足以容纳新写入的数据时, 从设置了过期时间的key中使用LRU(最近最少使用)算法进行淘汰;
* allkeys-lru: 当内存不足以容纳新写入的数据时, 从所有key中使用LRU(最近最少使用)算法进行淘汰
* volatile-lfu: 4.0版本新增, 当内存不足以容纳新写入的数据时, 在过期的key中, 使用LFU算法进行删除key
* allkeys-lfu: 4.0版本新增, 当内存不足以容纳新写入的数据时, 在所有key中, 使用LFU算法进行淘汰;
* volatile-random: 当内存不足以容纳新写入的数据时, 从设置了过期时间的key中, 随机淘汰数据;
* allkeys-random: 当内存不足以容纳新写入的数据时, 从所有key中随机淘汰数据;
* volatile-ttl: 当内存不足以容纳新写入的数据时, 在设置了过期时间的key中, 根据过期时间进行淘汰, 越早过期的优先被淘汰.

案例:

* redis客户端日志: Redis: OOM command not allowed when used memory > 'maxmemory'
* 原因: 内存已满, 不允许再存数据了.

可以通过redis-cli查看redis的具体信息:

```
127.0.0.1:6379> info memory
# Memory
used_memory:4294198624
used_memory_human:4.00G
used_memory_rss:4510478336
used_memory_rss_human:4.20G
used_memory_peak:4544550600
used_memory_peak_human:4.23G
used_memory_peak_perc:94.49%
used_memory_overhead:2730067120
used_memory_startup:791408
used_memory_dataset:1564131504
used_memory_dataset_perc:36.43%
allocator_allocated:4294192432
allocator_active:4417224704
allocator_resident:4516491264
total_system_memory:67385552896
total_system_memory_human:62.76G
used_memory_lua:36864
used_memory_lua_human:36.00K
used_memory_scripts:1080
used_memory_scripts_human:1.05K
number_of_cached_scripts:3
maxmemory:4294967296
maxmemory_human:4.00G
maxmemory_policy:noeviction
allocator_frag_ratio:1.03
allocator_frag_bytes:123032272
allocator_rss_ratio:1.02
allocator_rss_bytes:99266560
rss_overhead_ratio:1.00
rss_overhead_bytes:-6012928
mem_fragmentation_ratio:1.05
mem_fragmentation_bytes:216361704
mem_not_counted_for_evict:0
mem_replication_backlog:1048576
mem_clients_slaves:0
mem_clients_normal:2837536
mem_aof_buffer:0
mem_allocator:jemalloc-5.1.0
active_defrag_running:0
lazyfree_pending_objects:0
```

解决方案:

1. 增加redis内存, 修改redis.conf```maxmemory 2gb```
2. 修改redis内存淘汰策略```maxmemory-policy volatile-lru```

## Redis持久化

Redis是基于内存的非关系型K-V数据库, 但是也提供了持久化支持. redis持久化机制有两种:

* RDB
  * 如果redis在指定的时间间隔内, 执行了指定次数的写操作. 会触发将内存中的数据集快照写入磁盘中, 它是redis的默认持久化方式. 执行完操作后, 在指定目录下会生成一个dump.rdb文件, Redis重启的时候, 通过加载dump.rdb文件来恢复数据. RDB触发机制主要有以下几种:
    1. 手动触发: save -- 同步, 会阻塞redis服务器; bgsave -- 异步, redis进程执行fork操作创建子进程
    2. 自动触发: save m n -- m秒内数据集存在n次修改时, 自动触发bgsave
  * 优点: 适合大规模的数据恢复场景, 如备份, 全量复制等
  * 缺点: 1. 没办法做到实时持久化/秒级持久化; 2. 新老版本存在RDB格式兼容问题
* AOF
  * append only file, 采用日志的形式来记录每个写操作, 追加到文件中, 重启时在重新执行AOF文件中的命令来恢复数据. 主要解决了持久化的实时性问题. 默认是不开启的.
  * 优点: 数据的一致性和完整性更高
  * 缺点: 记录的内容越多, 文件越大, 数据恢复变慢

## Redis高可用

redis实现高可用有三种部署方式:

1. 主从模式
2. 哨兵模式
3. 集群模式

**主从模式**

主从模式中, redis部署了多台机器, 主节点负责读写操作, 从节点只负责读操作. 从节点的数据来自于主节点, 实现原理就是主从复制.

主从复制分为两种:

一种是全量复制, 一般当slave第一次连接master时, 就采用全量复制.具体流程如下:

1. slave发送sync命令到master;
2. master接收到sync之后, 执行bgsave命令生成RDB全量文件;
3. master使用缓冲区, 记录RDB快照生成期间的所有写命令;
4. master执行完bgsave后, 向所有slave发送RDB快照文件;
5. slave收到RDB快照文件后, 载入, 解析收到的快照;
6. master使用缓冲区, 记录RDB同步期间生成的所有写的命令;
7. master快照发送完毕后, 开始向slave发送缓冲区中的写命令;
8. slave接收命令请求, 并执行来自master缓冲区的写命令.

另一种是增量复制, 在全量复制之后, 如果再次发生更新, 就会触发增量复制. 具体逻辑如下: master节点在接收用户执行命令的请求后, 会判断用户执行的命令是否有数据更新, 如果有更新, 并且slave节点不为空, 就会执行```replicationFeedSalves```函数, 把用户执行的命令发送到所有的slave节点, 让slave节点执行.

主从模式中, 一旦主节点出现故障不再提供服务, 需要人工将从节点晋升为主节点, 同时还要通知应用方更新主节点地址. 显然, 多数业务场景都不能接受这种故障处理方式.

**哨兵模式**

哨兵模式有一个或多个Sentinel实例组成Sentinel系统, 它可以监视所有Redis主节点和从节点, 并在被监视的主节点进入下线状态时, 自动将下线的主服务器属下的某个从节点升级为新的主节点. 如果只有一个哨兵进程对redis节点进行监控, 可能会出现单点问题(就是这一个哨兵挂了, 就全完了), 因此, 可以使用多个哨兵来进行监控redis节点, 并且各个哨兵之间还会进行监控.

哨兵就三个作用:

1. 发送命令, 等待redis服务器(包括主服务器和从服务器)返回响应;
2. 哨兵检测到主节点宕机, 会自动将从节点切换成主节点, 然后通过发布订阅模式通知其他的从节点, 修改配置文件, 让它们切换主机;
3. 哨兵之间还会相互监控, 从而达到高可用.

故障切换过程:

当主服务器宕机后, 哨兵1检测到结果, 系统并不会马上进行failover(故障转移)过程, 仅仅是哨兵1主观的认为主服务器不可用, 这种现象称为主观下线. 当后面的哨兵也检测到主服务器不可用, 并且达到一定数量时, 哨兵之间就会进行一次投票, 投票结果由一个哨兵发起, 进行failover操作. 切换成功之后, 会通过发布订阅模式, 让各个哨兵把自己监控的从服务器主机切换, 这个过程称为客观下线. 对于客户端而言, 一切都是透明的. 具体流程如下:

1. 每个Sentinel以每秒一次的频率向它所知的master, slave以及其他Sentinel实例发送一个PING命令;
2. 如果一个实例距离最后一次有效回复PING命令的时间超过down-after-milliseconds选项所指定的值, 则这个实例被Sentinel标记为主管下线;
3. 如果一个master被标记为主观下线, 则正在监视这个master的所有Sentinel要以每秒一次的频率确认master的确进入了主观下线状态;
4. 当有足够多的Sentinel(大于等于配置文件中指定的值)在指定时间范围内确认master的确进入了主观下线状态, 则master会被标记为客观下线;
5. 在一般情况下, 每个Sentinel会以每10秒一次的频率向它已知的所有master和slave发送INFO命令;
6. 当master被Sentinel标记为客观下线时, Sentinel向下线的master的所有slave发送INFO命令的频率会从10秒一次改为每秒一次;
7. 若没有足够数量的Sentinel同意master已经下线, Master的客观下线状态就会被移除; 若master重新向Sentinel的PING命令返回有效回复, master的主观下线状态就会被移除.

java jedis Sentinel模式客户端配置代码如下:

```java
String masterName = xxx;
HashSet<String> sentinels = new HashSet<String>();
GenericObjectPoolConfig poolConfig = ...;
JedisSentinelPool pool = new JedisSentinelPool(masterName, sentinels, poolConfig, 
    1000/*timeout*/, "xxxxx"/*password*/, 0/*database*/);
```

**集群模式**

哨兵模式基于主从模式, 实现读写分离, 还可以自动切换, 系统可用性高. 但是它每个节点存储的数据时一样的, 浪费内存, 并且不好在线扩容. 这时就需要使用Cluster集群模式, 该模式在redis3.0加入的, 实现了redis的分布式存储. 对数据进行分片, 也就是说每台Redis节点上存储不同的内容, 来解决在线扩容的问题. 并且, 它也提供复制和故障转移的功能.

**Redis集群中各个节点之间通过Gossip协议进行通信**. 节点之间不断交换信息, 交换的信息内容包含节点出现故障, 新节点加入, 主从节点变更信息, slot信息等等. 常用的Gossip消息分为四种:

* meet: 通知新节点加入. 消息发送者通知接收者加入到当前集群, meet消息通信正常完成后, 接收节点会加入到集群中并进行周期性的ping, pong消息交换;
* ping: 集群内交换最频繁的消息, 集群内每个节点每秒向多个其他节点发送ping消息, 用于检测节点是否在线和交换彼此状态信息;
* pong: 当接收到ping/meet消息时, 作为响应消息回复给发送方确认消息正常通信. pong消息内部封装了自身状态数据. 节点也可以向集群内广播自身pong消息来通知整个集群对自身状态进行更新;
* fail: 当节点判定集群内另一个节点下线时, 会向集群内广播一个fail消息, 其他节点接收到fail消息之后, 把对应节点更新为下线状态.

特别地, 每个节点是通过集群总线(Cluster Bus)与其他节点进行通信的. 通信时, 使用特殊的端口号, 即对外服务端口号加10000. 例如如果某个节点的端口号是6379, 那么它与其他node通信的端口号是16379. nodes之间采用特殊的二进制协议.

**Hash Slot插槽算法**: Cluster集群使用的分布式存储算法**并不是一致性Hash**而是**Hash Slot插槽算法**, 该算法把整个数据库分为16384个slot, 每个计入redis的键值对根据key进行散列, 分配到16384个插槽中的一个. 使用的Hash映射也比较简单, 用CRC16算法计算出一个16位的值, 再对16384取模. 数据库中每一个键都属于这16384个槽中的一个, 集群中的每个节点都可以处理这16384个槽, 集群中每个节点负责一部分的hash槽.

> 为什么使用Hash槽算法而不是一致性Hash? 
> 1. 当发生扩容时, Redis可配置映射表的方式, 让哈希槽更灵活, 更方面组织映射到新增的server上面的slot数;
> 2. 数据迁移时, 一致性Hash需要重新计算key在新增节点的数据, 然后迁移这部分数据, 哈希槽则直接将一个slot对应的数据全部迁移, 实现更简单;
> 3. 可以灵活的分配槽位, 比如性能更好的节点分配更多的槽位, 性能相对较差的节点可以分配较少的槽位.

**Redis Cluster集群**中, 需要确保16384个槽对应的node都正常工作, 如果某个node出现故障, 它负责的slot也会失效, 整个集群将不能工作.

为了保证高可用, 引入了主从复制, 一个主节点对应一个或者多个从节点. 当其他主节点ping一个主节点A时, 如果半数以上的节点与A通信超时, 那么认为主节点A宕机了. 如果主节点宕机, 就会启用从节点.

redis每个节点上都有两个东西:1. 插槽; 2. cluster(可以理解为集群管理插件). 当我们存取key到达时, redis使用CRC16算法得出一个16bit的值, 然后把结果对16384取模, 然后找到对应的插槽所对应的节点, 然后直接跳转到这个节点上进行存取操作.

虽然数据是分开存储在不同节点上的, 但是对客户端来说, 整个集群Cluster, 被看做一个整体. 客户端连接任意一个node, 看起来和操作单实例redis一样. 当客户端从操作的key没有被分配到当前访问的节点时, redis会返回转向指令, 最后执行正确的node, 这就像浏览器页面的302重定向一样.

**故障转移**是redis集群实现高可用的手段. 某个节点认为另一个节点不可用, 即下线状态, 此时该节点被标记为主观下线. 当集群中半数以上节点都认为该节点不可用, 从而达成共识, 如果是持有槽的主节点故障, 则需要进行故障转移, 此时该节点被标记为客观下线.

**故障恢复**: 故障发现后, 如果下线的节点是主节点, 则需要在从节点中选择一个替换它, 以保证集群高可用. 流程分如下:

1. 资格检查: 检查从节点是否具备替换故障主节点的条件;
2. 准备选举时间: 资格检查通过后, 更新触发故障选举时间;
3. 发起选举: 到了故障选举时间, 进行选举;
4. 选举投票: 只有持有槽的主节点才有票, 从节点收集到足够的选票(大于一半), 触发替换主节点的操作.

java客户端代码示例:

```java
	public static void main(String[] args){
		//创建节点集合
		Set<HostAndPort> nodes = new HashSet<HostAndPort>();
		
		nodes.add(new HostAndPort("192.168.37.128", 7001));
		nodes.add(new HostAndPort("192.168.37.128", 7002));
		nodes.add(new HostAndPort("192.168.37.128", 7003));
		nodes.add(new HostAndPort("192.168.37.128", 7004));
		nodes.add(new HostAndPort("192.168.37.128", 7005));
		nodes.add(new HostAndPort("192.168.37.128", 7006));
		
		//连接集群
		JedisCluster jedisCluster = new JedisCluster(nodes);
		
		//向集群中存入值
		String result = jedisCluster.set("data1", "value1");
		System.out.println(result);
		
		//从集群中获取值
		String value = jedisCluster.get("data1");
		System.out.println(value);
		
		//关闭jedisCluster连接(在程序执行完之后,才能关闭,他的内部已经封装了连接池)
		jedisCluster.close();
	}
```

## Redis分布式锁

分布式锁就是用来控制同一时刻, 只有一个进程中的一个线程可以访问被保护的的资源.

分布式锁应该满足的特性:

1. 互斥 -- 任何给定时刻, 只有一个客户端可以持有锁
2. 无死锁 -- 任何都有可能获得锁, 即使持有锁的客户端崩溃
3. 容错 -- 只要大多数redis节点都已经启动, 客户端就可以获取和释放锁

Redisson非常完备的实现了分布式锁, 以下是其中一些细节:

1. 执行加锁/解锁操作原子性, 防止加锁/解锁过程中出现异常状态
   * 保证加锁和设置超时操作是原子性的, 防止执行了加锁后, 没有机会执行设置超时命令, 导致锁无法释放, 所以redisson最终采用lua脚本, 使得原子性得到保障
2. 锁超时, 防止锁持有者挂掉导致锁无法释放, 出现死锁
   * 向redis设置kv时, 指定key的时间, 如果没有过期时间, 加锁的主机宕机后, 其持有的锁一直存在, 导致死锁
3. 守护线程对锁持有进行续期, 防止持有者还没有执行完成, 锁过期失效
   * key有了过期时间后, 有会导致一段时间后, key自动过期, 锁失效, 此时, 有可能持有锁的线程还没有执行完, 这就需要守护线程来完成锁的续期
4. 防止非锁持有者释放锁
   * 只有删除锁的客户端"签名"与锁中保存的value一致时, 才能删除它
5. 可重入
   * redisson通过redis hash实现可重入, 加锁后, 持有者线程再次尝试加锁时, 直接将加锁次数加1, 释放时减1, 只有加锁次数为0时, 才会真正释放锁.

redisson中的锁在redis中存储的内容, 采用hash类型存储:

```
key field(uuid签名) val(加锁次数)
```

加锁的lua脚本实现:

```lua
---- 1 代表 true
---- 0 代表 false
if (redis.call('exists', KEYS[1]) == 0) then
    redis.call('hincrby', KEYS[1], ARGV[2], 1);
    redis.call('pexpire', KEYS[1], ARGV[1]);
    return 1;
end ;
if (redis.call('hexists', KEYS[1], ARGV[2]) == 1) then
    redis.call('hincrby', KEYS[1], ARGV[2], 1);
    redis.call('pexpire', KEYS[1], ARGV[1]);
    return 1;
end ;
return 0;
```

解锁的lua脚本:

```lua
-- 判断 hash set 可重入 key 的值是否等于 0
-- 如果为 0 代表 该可重入 key 不存在
if (redis.call('hexists', KEYS[1], ARGV[1]) == 0) then
    return nil;
end ;
-- 计算当前可重入次数
local counter = redis.call('hincrby', KEYS[1], ARGV[1], -1);
-- 小于等于 0 代表可以解锁
if (counter > 0) then
    return 0;
else
    redis.call('del', KEYS[1]);
    return 1;
end ;
return nil;
```

**Redisson实际开发中遇到的问题**

下面这段代码, 当非锁持有线程尝试释放锁时, 将会报错, 最终导致定时任务直接终止.

```java
private void initSchedule(){
    ScheduledExecutorService scheduleExecutor = Executors.newSingleThreadScheduledExecutor(r -> new Thread(r, "ScheduleLockTestThread"));
    scheduleExecutor.scheduleWithFixedDelay(this::scheduleTask, 5, 5, TimeUnit.SECONDS);
}

private void scheduleTask(){
    // 这个方法代码块应该整体用try...catch...包起来, 防止定时任务意外终止
    
    RLock lock = null;
    try {
        lock = redissonClient.getLock("TestLock");
        if(lock.tryLock(5, TimeUnit.SECONDS)){
            logger.info("mark : {} get lock success, do something", mark);
            Thread.sleep(new Random().nextInt(10) + 5000L);
        }else{
            logger.info("mark : {} failed to get lock.", mark);
        }
    } catch (InterruptedException e) {
        logger.error("scheduleTask interrupted exception, msg : {}", e.getMessage(), e);
        Thread.interrupted();
    } catch (Throwable t){
        logger.error("scheduleTask execute exception, msg : {}", t.getMessage(), t);
    } finally{
        if(lock != null){
            // 如果锁不是当前线程持有, 该解锁操作将报错
            lock.unlock();
        }
        // 这段代码才是正确的锁释放逻辑
        // if(lock != null && lock.isLocked() && lock.isHeldByCurrentThread()){
        //     lock.unlock();
        // }
    }
}
```

**RedLock**

redis集群高可用架构中, 通常都有主从架构. redis主从复制默认是异步的. 这就会存在一个问题. 客户端A在master节点上获取锁成功, 还没有把锁同步给slave时, master宕机. 这样会导致slave被选举为新master, 这时没有客户端A获取锁的数据. 客户端B就能成功获得客户端A持有的锁, 违背了分布式锁定义的互斥.

红锁是为了解决主从架构中当主从切换导致多个客户端持有同一个锁而提出的一个算法, 目前还存在争议. 首先需要在不同的机器上部署5个redis主节点, 节点完全独立, 使用多个节点是为了容错. 具体细节略.

## Redis双写一致性

使用redis作为缓存时, 需要保证redis中的数据和数据库中的数据保持双写一致, 有以下三种方案:

* 缓存延时双删: 先删除缓存, 再更新数据库, 再删除一次缓存;
* 删除缓存重试机制: 先更新数据库, 再删除缓存, 删除失败重试;
* 读取数据库binlog异步删除缓存

> 为什么不更新而是删除: 1. 更新缓存动作操作复杂容易出错; 2. 并发更新下, 更新操作有可能导致数据不一致; 

**延时双删**

1. 先删除缓存
2. 更新数据库
3. 休眠一会, 再次删除缓存

这个方案在休眠的时候, 可能会存在脏数据, 一般业务可以接受. 但是如果第二次删除缓存失败, 缓存和数据库就可能会不一致.

**删除缓存重试**

1. 更新数据库
2. 删除缓存
3. 把删除失败的缓存放到消息队列
4. 获取消息队列中的key, 重新执行删除操作

**读取binlog异步删除缓存**

删除重试机制对业务代码入侵较多, 可以通过数据库binlog来异步淘汰key. 通过将binlog发送至消息队列, 然后异步删除这个key, 保证数据缓存一致性.

## Redis常见应用场景

1. 缓存 - 不多赘述, 需要关注双写一致性问题;
2. 排行榜 - 销量排行榜等等, 通过zset数据类型实现复杂的排行榜, 通常会用到下面这些命令:
   * 排行榜新加入一个候选人: ```zadd category candidate score```
   * 排行榜中一个候选人加1分: ```zincrby category candidate 1```
   * 从排行榜中淘汰一个候选人: ```zrem category candidate```
   * 查询排行榜中排名前三的候选人: ```zrevrangebyrank category 0 2```
3. 计数器功能 - 实时展示播放量等, 主要使用的命令: ```incr key```, ```incrby key number```, ```decr key```, ```decrby key number```
4. 分布式ID - 全局自增计数器, 实现全局唯一id;
5. session共享
6. 分布式锁
7. 布隆过滤器
8. 分布式限流 - 
9. 消息队列(不推荐) - redis提供了发布/订阅及阻塞队列功能, 可以实现一个简单的消息队列系统, 常用命令有: ```subscribe channel```, ```psubscribe channel*```, ```publish channel content```

## 其他

### Redis事务

redis通过multi, exec, watch等一组指令来实现事务机制. 事务支持一次执行多个命令, 一个事务中所有命令都会被序列化. 在事务执行过程中, 会按照顺序串行化执行队列中的命令, 其他客户端提交的命令请求不会插入到事务执行命令序列中. 简而言之, redis事务就是顺序性, 一次性, 排他性的执行一个命令序列中的一系列命令. 

redis执行事务的流程如下:

1. 开始事务(multi)
2. 命令入队
3. 执行事务(exec), 撤销事务(discard)

命令|描述
-|-
exec|执行所有事务块内的命令
discard|取消事务, 放弃执行事务块内的所有命令
multi|标记一个事务块的开始
watch|监视key, 如果事务执行之前, 该key被其他命令所改动, 那么事务将被打断
unwatch|取消watch命令对所有key的监视

> Redis的事务主要是保障多个命令原子性执行, 不会被打断, 它是不支持回滚的, 执行过程中如果执行报错, 会继续执行剩余指令.

### Hash冲突

redis使用一张全局hash来保存所有的键值对. 这张hash表有多个hash桶, hash桶中的entry元素保存了key和value的指针, 其中key指针指向了实际的键, value指针指向了实际的值.

不同的key, hash值可能相同, 这就会导致hash冲突. redis为了解决hash冲突, 采用的是链式hash. 这种结构与java.util.HashMap中的类似. 但是这样, 有可能导致冲突链表过长, 影响性能, 因此, redis会对hash表做rehash, 来增加hash桶, 减少冲突. 为了rehash更高效, redis还默认使用了两个全局hash表,  一个用于当前使用, 称为主hash表, 一个用于扩容, 称为备用hash表.

### 热Key问题

访问频率高的key称为热key. 如果某一热点key的请求到redis服务器主机时, 请求量特别大, 可能会导致redis资源不足, 甚至宕机. 

产生原因:

 * 用户消费的数据远大于生产的数据, 如秒杀, 热点新闻等;
 * 请求分片集中, 超过单redis服务器的性能, 比如, 固定名称的key, hash落入同一台服务器, 瞬间访问量极大, 超过机器瓶颈.

如何识别热点key:

* 根据经验判断
* 客户端统计
* 服务代理统计

解决方案:

* redis集群扩容: 增加分片副本, 均衡读流量;
* 将热点key分散到不同服务器中;
* 使用二级缓存, 及jvm本地缓存, 减少redis读请求.
* 限流

### 大Key问题

某个key对应的value占用的内存过大, 称之为大key问题. 大key的影响:

1. 影响性能: 读取速度慢;
2. 占用内存大;
3. 内存空间不均匀: 集群环境下, 如果摸个节点存储了大key, 导致节点内存不均匀;
4. 影响redis备份和恢复: 需要大量时间, 甚至无法恢复;
5. 搜索困难;
6. 迁移困难;
7. 过期执行耗时;

> 对于大key的界定是没有规范的, 一般String超过5M算作, Set/List元素超过10000, Hash元素超过1000, 则视为大key

通过执行`redis-cli -bigkeys`, 可以将结果输出到本地文件中;

问题解决:

1. 有选择的删除BigKey
2. 设置合理的TTL;
3. 拆分到多个key中;
4. 存到单独的数据库中;

### 通信协议

Redis客户端和服务端之间采用的通信协议是自己设计的-- RESP(REdis Serialization Protocol), 这是应用层的协议, 传输层使用的是TCP. 该协议的结构大致如下:

请求:

```
*<参数个数>\r\n
$<参数1长度>\r\n
<参数1数据>\r\n
$<参数2长度>\r\n
<参数2数据>\r\n
...
```

响应略, 也是基于`\r\n`来分割的

### Redis使用注意事项

* 避免使用`KEYS`命令获取所有key, 因为该命令会遍历所有key, 阻塞redis主线程;
* 避免`FLUSHALL`或`FLUSHDB`命令清空Redis数据库, 因为会清空所有数据库, 不止当前数据库;
* 避免大key;
* 合理设置过期时间;
* 写入操作频繁的数据, 考虑使用Redis的持久化;
* 避免使用Lua脚本无限循环;
* 对于需要频繁更新的数据, 建议使用Hash结构, 支持部分更新;
* 避免运行复杂的计算;

### SETNX+SETEX

* `SETNX`: 只有键不存在的时候设置;
* `SETEX`: 设置并指定过期时间;
* `SET xxxxkey xxxxvalue NX EX xxxttl`: 上两者同时配置;