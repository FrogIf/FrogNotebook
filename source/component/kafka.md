# Kafka

## 概述

kafka是一款开源的消息处理引擎系统, 也是分布式流处理平台

消息传输的两种方式:

* 点对点模式
* 发布订阅模式

消息引擎的作用:

* 削峰填谷: 对于短时间偶现的极端流量, 对后端服务可以起到保护作用;
* 异步解构: 在上下游没有强依赖的业务关系或针对单次请求不需要立即处理的业务;
* 冗余(副本)/可恢复性: kafka会对消息进行持久化, 保证处理数据失败的情况下, 可以重新处理.系统一部分组件失效, 不会影响整个系统. 
* 扩展性: 由于解耦了处理过程, 消息的生产者或者消费者可以很容易的扩展.

## 基本概念

* Broker: kafka中每一个服务节点称为一个broker
* Topic: kafka中, 发布订阅的对象是topic
* Partition: topic的数据分割为一个或多个partition, 每个topic至少一个partition. partition中的数据是有序的, 不同partition间的数据是无序的.
* Producer: 生产者, 通过push的方式向broker发送消息
* Consumer: 消费者, 通过pull的方式, 主动从broker中获取消息
* ConsumerGroup: 每一个消费者属于一个特定的ConsumerGroup(可以为每个Consumer指定group name, 如果不指定group name, 则属于默认的group)
    * ConsumerGroup下可以有一个或者多个Consumer实例, 这里的实例可以是一个单独的进程, 也可以是同一进程下的线程.
    * GroupId是一个字符串, 在Kafka集群中, 它标识唯一的一个ConsumerGroup
    * ConsumerGroup下所有实例订阅的主题的单个分区, 只能分配给组内的某个Consumer实例消费. 这个分区当然也可以被其他的Group消费
    * Rebalace -- 本质上是一种协议, 规定了一个ConsumerGroup下的所有的Consumer如何达成一致, 来分配订阅Topic的每个分区.
        * 触发条件:
            * 组成员数发生变更
            * 订阅主题数发生变更(一个消费者组, 可以订阅一组正则的topic)
            * 订阅主题的分区数发生变更
        * 缺点
            * Rebalance过程中, 所有Consumer都会停止消费
            * Rebalance过程中, 所有Consumer都会参与, 全部重新分配
            * Rebalance过程很慢
* Replica: Partition的副本
    * Leader: Leader副本, 生产者总向leader副本写消息, 消费者总从leader副本读取消息
    * Follower: Follower副本, 向leader副本发送请求, 保持与领导者副本的同步
    * 分区与副本: 副本是分区层级的概念, 每个分区可以配置若干个副本, 只有一个leader副本
* Coordinator: 协调者, Consumer只与Coordinator所在的broker进行交互, 包括位移提交等. 然后由Coordinator负责消费者组的注册, 成员管理等元数据操作; 每个Broker启动时, 都会创建一个Coordinator, 然后通过算法, 确定为某个ConsumerGroup服务的Coordinator.

**kafka三层消息架构**

 * 第一层 - 主题层, 每个主题可以配置M个分区, 每个分区有可以配置N个副本;
 * 第二层 - 分区层, 每个分区的N个副本中, 只有一个Leader副本, 对外提供服务, 其他N-1个是追随者副本, 只提供数据冗余;
 * 第三层 - 消息层, 分区中包含若干调消息, 每条消息的位移从0开始, 依次递增;
 * 最后, 客户端程序只能与分区的领导者副本进行交互.

**消费者与消费者组**

* 同一个topic的一条消息只能被同一个ConsumerGroup内的一个Consumer消费, 多个ConsumerGroup可同时消费这一条消息; 这一特性可以实现点对点和发布订阅两种模式;
* 消费者组内消费者的增删会触发rebalance

## 配置参数

**Broker端参数**

* log.dirs: broker使用的文件目录
* log.dir: 同上
* zookeeper.connect: zookeeper集群参数, 例如: zk1:2181,zk2:2181,zk3:2181
* listeners: 监听器, 告诉外部连接者要通过什么协议访问指定主机名和端口开放的 Kafka 服务
* advertised.listeners: 就是说这组监听器是 Broker 用于对外发布的
    * advertised.listeners主要是为外网访问用的。如果clients在内网环境访问Kafka不需要配置这个参数
    * 常见场景: Kafka Broker机器上配置了双网卡，一块网卡用于内网访问（即我们常说的内网IP）；另一个块用于外网访问。那么你可以配置listeners为内网IP，advertised.listeners为外网IP
* auto.create.topics.enable: 是否允许自动创建 Topic, 建议false
* unclean.leader.election.enable: 是否允许 Unclean Leader 选举, 建议false
* auto.leader.rebalance.enable: 是否允许定期进行 Leader 选举, 建议false
* log.retention.{hours|minutes|ms}：这是个“三兄弟”，都是控制一条消息数据被保存多长时间。从优先级上来说 ms 设置最高、minutes 次之、hours 最低
* log.retention.bytes：这是指定 Broker 为消息保存的总磁盘容量大小
* message.max.bytes：控制 Broker 能够接收的最大消息大小

**Topic级别参数**

> Topic级别参数的优先级高于Broker级别

* retention.ms：规定了该 Topic 消息被保存的时长。默认是 7 天，即该 Topic 只保存最近 7 天的消息。一旦设置了这个值，它会覆盖掉 Broker 端的全局参数值
* retention.bytes：规定了要为该 Topic 预留多大的磁盘空间。和全局参数作用相似，这个值通常在多租户的 Kafka 集群中会有用武之地。当前默认值是 -1，表示可以无限使用磁盘空间
* max.message.bytes: 控制topic的最大消息大小

> max.message.bytes设置之后, 需要注意修改Broker的replica.fetch.max.bytes保证复制正常, 消费还要修改配置 fetch.message.max.bytes

topic级别参数设置方式:

1. 创建topic时进行设置
```
bin/kafka-topics.sh --bootstrap-server localhost:9092 --create --topic <topic_name> --partitions 1 --replication-factor 1 --config retention.ms=15552000000 --config max.message.bytes=5242880
```
2. 修改topic时进行设置(推荐)
```
bin/kafka-configs.sh --zookeeper localhost:2181 --entity-type topics --entity-name <topic_name> --alter --add-config max.message.bytes=10485760
```

**JVM参数**

* KAFKA\_HEAP\_OPTS: 指定堆大小, 推荐6G
* KAFKA\_JVM\_PERFORMANCE\_OPTS: 指定GC参数

```
$> export KAFKA_HEAP_OPTS=--Xms6g  --Xmx6g
$> export KAFKA_JVM_PERFORMANCE_OPTS= -server -XX:+UseG1GC -XX:MaxGCPauseMillis=20 -XX:InitiatingHeapOccupancyPercent=35 -XX:+ExplicitGCInvokesConcurrent -Djava.awt.headless=true
$> bin/kafka-server-start.sh config/server.properties
```

**操作系统参数**

* 文件描述符限制
* 文件系统限制
* Swappiness
* 提交时间

## 分区

* 作用: 负载均衡
* 分区策略(决定生产者将消息发送到哪一个分区): 
    * 自定义分区策略:
        * 生产者端
            * 实现org.apache.kafka.clients.producer.Partitioner接口的partition方法
            * 配置partitioner.class为自定义分区策略类的全限定名
    * 轮询策略(推荐)
    * 随机策略
    * 按消息键保存策略: 为每条消息定义消息键(Key), 不同的key按照一定的规则分配到不同的分区中, 每个分区内的消息是有序的 
    * 默认分区策略: 制定了key, 则采用按消息键保存策略, 没有指定key, 使用轮询策略

## 消息

**消息丢失**

kafka只对**已提交**的消息, 做有限度的持久化保证.

* 已提交的消息: kafka的Broker接收到一条消息, 并写入到日志文件后, 会告诉生产者这条消息已成功提交;
* 有限度的持久化: 至少有一个Broker存活.

* 丢失场景
    * 生产者程序丢失数据
        * 异步发送, 发送后不管, 导致实际上消息没有发送成功, 也没有返回日志
        * 解决方案: 使用带有回调通知的发送API, producer.send(msg, callback)
    * 消费者程序丢失数据
        * 根本原因: 实际消费位移与提交的消费位移不一致
        * 场景一:
            * 先提交位移, 然后消费了其中一部分后终止了, 导致再次消费时, 从已提交的位移开始消费, 丢失了一部分消息
            * 解决方案: 先消费, 再提交位移
        * 场景二:
            * 自动提交位移, 导致一部分消息消费失败之后, 无法重新消费
            * 解决方案: 不使用自动提交位移, 保证消费成功之后再提交位移
* 最佳实践
    * Producer端
        * 使用producer.send(msg, callback)
        * 设置acks=all, 表明所有副本Broker都要接收到消息, 才算已提交
        * 设置自动重试retries为一个较大值
    * Broker端
        * unclean.leader.election.enable = false, 使得非ISR副本不参与leader选举
        * replication.factor >= 3, 副本数
        * min.insync.replicas > 1, 控制消息至少被写入多少个副本才算已提交
        * replication.factor > min.insync.replicas, 如果两者相等, 只要有一个副本挂了, 整个分区就无法正常工作了
    * Customer
        * enable.auto.commit = false, 禁用自动提交, 采用手动提交位移

**消息交付可靠性保障**

消息投递语义:

* 最多一次(at most once): 消息可能会丢失, 但绝不会被重复发送;
* 至少一次(at least once): 消息不会丢失, 但是可能被重复发送;
* 精确一次(exactly once): 消息不会丢失, 也不会被重复发送.

kafka默认提供的可靠性保证为第二种.

* 消息重复提交: 每条消息提交成功之后, broker会返回提交成功的响应. 如果由于某种原因, Producer没有收到这个响应, 就会导致消息重复提交.

如何通过kafka做到精确一次?

* 幂等型Producer
    * props.put("enable.idempotence", true)或者props.put(ProducerConfig.ENABLE\_IDEMPOTENCE\_CONFIG, true), broker端自动会进行幂等校验
    * 只能保证单分区幂等
    * 只能保证单会话幂等(一旦重启, 幂等性保证就丧失了)
* 事务型Producer
    * read committed级别, 保证多条消息原子性的写入目标分区, 保证Consumer只能看到事务成功提交的消息
    * 保证了多分区的事务原子性的写入, 保证一批消息要么全部成功, 要么全部失败
    * 配置与幂等型相同: enable.idempotence=true
    * 设置Producer端参数transactional.id为一个有意义的名字
    * 代码调整:
```java
producer.initTransactions();
try{
    producer.beginTransaction();
    producer.send(record1);
    producer.send(record2);
    producer.commitTransaction();
}catch(KafkaException e){
    producer.abortTransaction();
}
```

## 位移

* 位移主题
    * \_\_consumer\_offsets被称作位移主题
    * 用处
        * 保存kafka消费者的位移信息;
        * 保存ConsumerGroup信息;
        * 保存用于删除Group过期位移甚至删除Group的消息. 此时消息体为空
    * 配置
        * offsets.topic.num.partitions - 位移主题的分区数, 默认50
        * offsets.topic.replication.factor - 位移主题的副本数, 默认是3
    * 过期消息的删除
        * kafka后台有专门的线程(LogCleaner), 定期巡检位移主题, 如果发现同一个key存在多条消息, 只保留最后一条, 删除其余消息
* 位移的提交
    * 自动提交
        * enable.auto.commit = true
        * auto.commit.interval.ms - 自动提交位移的时间间隔
    * 手动提交
        * enable.auto.commit = false
        * consumer.commitSync() - 调用


## 拦截器

* Producer端拦截器 - org.apache.kafka.clients.producer.ProducerInterceptor
    * onSend: 该方法会在消息发送之前被调用, 可以对消息进行加工
    * onAcknowledgement: 该方法会在消息成功提交或发送失败之后, callback方法执行前调用. 需要注意线程安全问题, 并且不要加入过重的逻辑.
* Consumer端拦截器 - org.apache.kafka.clients.consumer.ConsumerInterceptor
    * onConsume: 消息被consumer处理之前被调用
    * onCommit: Consumer 在提交位移之后调用该方法
* 使用场景: 监控, 审计等

使用示例:

```
Properties props = new Properties();
List<String> interceptors = new ArrayList<>();
interceptors.add("com.yourcompany.kafkaproject.interceptors.AddTimestampInterceptor"); // 拦截器1
interceptors.add("com.yourcompany.kafkaproject.interceptors.UpdateCounterInterceptor"); // 拦截器2
props.put(ProducerConfig.INTERCEPTOR_CLASSES_CONFIG, interceptors);
……
```

## TCP连接

Kafka所有通信都是基于tcp协议.

生产者:

```
Properties props = new Properties ();
props.put(“参数1”, “参数1的值”)；
props.put(“参数2”, “参数2的值”)；
……
try (Producer<String, String> producer = new KafkaProducer<>(props)) {
            producer.send(new ProducerRecord<String, String>(……), callback);
  ……
}
```

* 创建TCP连接的时机
    * 创建KafkaProducer时, 会创建bootstrap.servers中指定的broker的连接.
    * 更新元数据后, 如果不存在与某个broker之间的连接
    * 消息发送时, 如果不存在与某个broker之间的连接
* 关闭TCP连接的时机
    * 调用producer.close()关闭连接
    * kafka自动关闭连接, 通过connections.max.idle.ms控制连接空闲时间, 超出时间自动关闭

