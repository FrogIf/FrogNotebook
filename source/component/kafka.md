---
title: kafka
date: 2022-06-08
author: frogif
---

# Kafka

## 概述

Kafka是一款开源的消息引擎. 消息引擎系统是一组规范, 企业利用这组规范在不同系统之间传递语义准确的消息, 实现松耦合的异步式数据传递. 同时, kafka也是一个分布式流处理平台.

消息引擎的作用: 1. 削峰填谷; 2. 发送方与接收方松耦合.

消息传输有两种模型:

1. 点对点模型;
2. 发布/订阅模型;

## 基本概念

* Topic
  * 发布订阅的对象
* Producer
  * 向topic发送消息的客户端应用程序称为Producer
  * 一个Producer可以向多个topic发送消息
* Consumer
  * 订阅topic中消息的客户端应用程序称为Consumer
  * 一个Consumer可以订阅多个topic上的消息
* Broker
  * kafka服务进程, 即kafka集群中的节点
* Partition
  * 将一个topic下的所有消息进行分区, 每个分区存储一部分消息(类似于es中的分片)
  * Partition使得kafka具备了水平扩展能力
* Replica
  * 在kafka集群中, 为保证高可用, 对于每一个Partition, 都会有多个副本
  * Leader Replica: 对外提供服务, 生产者总向leader replica写消息, 消费者总从leader replica读取消息
  * Follower Replica: 不会对外提供服务, 向leader replica发送请求, 保持与leader replica的同步
* Offset
  * 消息位移 - 每条消息在Partition中的位置信息(注意, 同一topic的不同Partition中offset可以是相同的)
* Consumer Offset
  * 消费者位移 - 表征消费者消费进度, 每个consumer都有自己的消费者位移
* Consumer Group
  * 多个消费者共同组成一个消费者组, 同时消费一个topic的多个分区, 以实现高吞吐.
* Rebalance
  * 重平衡, 消费者组中有实例宕机后, 其他消费者自动重新分配订阅的topic的分区的过程
  * rebalance是kafka消费者端实现高可用的重要手段
  * rebalance过程中, 所有consumer都会停止消费
* record
  * 消息, kafka中消息是以byte数组的方式 进行传输的
* Coordinator
  * 协调者, Consumer只与Coordinator所在的broker进行交互, 包括位移提交等. 然后由Coordinator负责消费者组的注册, 成员管理等元数据操作; 每个Broker启动时, 都会创建一个Coordinator, 然后通过算法, 确定为某个ConsumerGroup服务的Coordinator.

> Leader Replica和Follower Replica其实就是master和slave, 只不过美国那边master和slave是敏感词, 所以就改成leader和follower了

kafka的三层消息架构: topic --> partition --> 消息

Kafka持久化:

* Kafka使用日志来保存数据, 只存在追加写
* kafka底层将日志又分为多个日志段, 后台定期删除比较老的日志段

Zookeeper

在xxx版本之前的kafka需要使用zookeeper做分布式协调. zookeeper中会保存kafka集群的所有元信息, 例如broker列表, topic信息等.

## Kafka Broker参数配置

#### Broker级别参数

* ```log.dirs```: broker需要使用的文件路径, 多个路径使用逗号分隔
* ```zookeeper.connect```: 指定kafka集群的zookeeper信息
* ```listeners```: 配置对外开放的端口号协议类型, 同时会附带上当前主机的主机名
* ```advertised.listeners```: 与```listeners```基本一致, 用于外网访问
* ```auto.create.topics.enable```: 是否允许自动创建topic
* ```unclean.leader.election.enable```: 是否允许unclean leader选举, 如果只剩下数据滞后比较多的副本, 是否允许这些副本成为leader
* ```auto.leader.rebalance.enable```: 是否允许定期进行leader选举
* ```log.retention.{hour|minutes|ms}```: 控制一条消息数据被保存多长时间, 默认7天
* ```log.retention.bytes```: 是指定Broker为消息保存的总磁盘容量大小, 默认-1, 即不受限制
* ```message.max.bytes```: 控制Broker能够接收的最大消息大小

#### Topic级别参数

topic级别参数如果与broker级别有冲突, 优先使用topic级别.

* ```retention.ms```: topic下消息的保存时间
* ```retention.bytes```: 指定一个topic下的日志所占用的最大磁盘容量

> 关于topic参数, 可以在创建topic/修改topic时, 通过命令指定的.

#### JVM参数

* ```KAFKA_HEAP_OPTS```: 指定java堆大小
* ```KAFKA_JVM_PERFORMANCE_OPTS```: 指定GC参数

> 这两个都配置到环境变量中即可

## 生产者

生产者可以自定分区策略:

1. 轮询策略: 默认分区策略;
2. 随机策略
3. 按消息键保序策略: 通过这个策略, 可以保证具有相同特征的消息分配到同一个分区上, 从而保证了消息消费顺序

## Consumer Group

Consumer Group是Kafka提供的可扩展且具有容错性的消费者机制. kafka通过consumer group可以同时实现点对点模型和发布/订阅模型.

* Consumer Group之间彼此独立，互不影响，它们能够订阅相同的一组主题而互不干涉
* 如果所有消费者实例同属于一个group, 则它实现的是点对点模式
* 如果消费者实例属于不同的group, 则它实现的是发布/订阅模式
* 一个Partition只能由一个消费组中的一个Consumer消费

## 消息

#### 保证消息不丢失

Kafka对已提交的消息做有限度的持久化保证.

* 已提交的消息: kafka的Broker接收到一条消息, 并写入到日志文件后, 会告诉生产者这条消息已成功提交;
* 有限度的持久化: 至少有一个Broker存活.

丢失场景:

* 生产者程序丢失
  * 异步发送消息, 发送后不管, 导致实际上消息没有发送成功, 也没有返回日志
  * 解决方案: 使用带有回调通知的发送API, producer.send(msg, callback)
* 消费者程序丢失数据
  * 根本原因: 实际消费位移与提交的消费位移不一致
  * 场景一:
    * 先提交位移, 然后消费了其中一部分后终止了, 导致再次消费时, 从已提交的位移开始消费, 丢失了一部分消息
    * 解决方案: 先消费, 再提交位移
  * 场景二:
    * 自动提交位移, 导致一部分消息消费失败之后, 无法重新消费
    * 解决方案: 不使用自动提交位移, 保证消费成功之后再提交位移

最佳实践:

* Producer端
  * 使用producer.send(msg, callback)
  * 设置acks=all, 表明所有副本Broker都要接收到消息, 才算已提交
  * 设置自动重试retries为一个较大值
* Broker端
  * unclean.leader.election.enable = false, 使得非ISR副本不参与leader选举
  * replication.factor >= 3, 副本数
  * min.insync.replicas > 1, 控制消息至少被写入多少个副本才算已提交
  * replication.factor > min.insync.replicas, 如果两者相等, 只要有一个副本挂了, 整个分区就无法正常工作了
* Customer端
  * enable.auto.commit = false, 禁用自动提交, 采用手动提交位移

#### 消息交付可靠性保障

消息投递语义:

* 最多一次(at most once): 消息可能会丢失, 但绝对不会被重复发送;
* 至少一次(at least once): 消息不会丢失, 但是可能被重复发送;
* 精确一次(exactly once): 消息不会丢失, 也不会被重复发送.

kafka默认提供的可靠性语义是--至少一次. 每条消息提交成功之后, broker会返回提交成功的响应. 如果由于某种原因, Producer没有收到这个响应, 就会导致消息重复提交.

如何通过kafka做到精确一次?

* 幂等型Producer
  * props.put("enable.idempotence", true)或者props.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true), broker端自动会进行幂等校验
  * 只能保证单分区幂等
  * 只能保证单会话幂等(一旦重启, 幂等性保证就丧失了)
* 事务型Producer
  * 保证了多分区的事务原子性的写入, 保证一批消息要么全部成功, 要么全部失败
  * 配置与幂等型相同: enable.idempotence=true
  * 设置Producer端参数transactional.id为一个有意义的名字
  * 默认read\_uncommitted级别, Consumer能够读取到 Kafka 写入的任何消息，不论事务型 Producer 提交事务还是终止事务，其写入的消息都可以读取.
  * read\_committed级别, 保证多条消息原子性的写入目标分区, 保证Consumer只能看到事务成功提交的消息

事务型Producer示例:

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

#### 位移主题

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

#### 位移的提交

这里的位移指的是消费者位移, 是consumer要消费的下一条消息的位移.

每个partition有自己独立的位移, 所以, 位移提交也是在分区粒度上进行的.

* 自动提交
    * enable.auto.commit = true
    * auto.commit.interval.ms - 自动提交位移的时间间隔
* 手动提交
    * enable.auto.commit = false
    * consumer.commitSync() - 调用

> 自动提交存在的问题: 如果是多个线程异步消费, 自动提交有可能造成消息丢失; 如果是同步消费, 自动提交是在poll调用时, 触发提交上一次的offset, 有时会导致重复消费
> kafka默认是采用自动提交的方式

自动提交的相关配置:

```java
Properties props = new Properties();
props.put("bootstrap.servers", "localhost:9092");
props.put("group.id", "test");
props.put("enable.auto.commit", "true");
props.put("auto.commit.interval.ms", "2000");
props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
props.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
KafkaConsumer<String, String> consumer = new KafkaConsumer<>(props);
consumer.subscribe(Arrays.asList("foo", "bar"));
while (true) {
    ConsumerRecords<String, String> records = consumer.poll(100);
    for (ConsumerRecord<String, String> record : records)
        System.out.printf("offset = %d, key = %s, value = %s%n", record.offset(), record.key(), record.value());
}
```

手动同步提交位移的代码:

```java
while (true) {
    ConsumerRecords<String, String> records = consumer.poll(Duration.ofSeconds(1));
    process(records); // 处理消息
    try {
        consumer.commitSync();
    } catch (CommitFailedException e) {
        handle(e); // 处理提交失败异常
    }
}
```

手动提交的最佳实践(伪代码):

```java
try {
           while(true) {
                        ConsumerRecords<String, String> records = 
                                    consumer.poll(Duration.ofSeconds(1));
                        process(records); // 处理消息
                        commitAysnc(); // 使用异步提交规避阻塞
            }
} catch(Exception e) {
            handle(e); // 处理异常
} finally {
            try {
                        consumer.commitSync(); // 最后一次提交使用同步阻塞式提交
  } finally {
       consumer.close();
}
}
```

#### 处理位移提交失败

当客户端位移提交失败时, 会返回:```CommitFailedException```异常.

位移提交失败的常见情况是: 消费者消费消息的时间太长, 超过了```max.poll.interval.ms```, 触发了rebalance, 导致kafka集群已经将该consumer视为下线. 解决办法是:

1. 调高```max.poll.interval.ms```值;
2. 减少```max.poll.records```, 使得每次从kafka批量获取的消息记录数小一些, 从而能尽快处理完成;
3. 通过多线程异步消费, 提高消费速度. 

## 避免意外的rebalance

那种情况属于意外的rebalance? 应用活跃中, 但是被错误的视为下线, 触发整体rebalance.

* 一个应用如何向kafka证明自己还活着?
  * 每个consumer会定期向coordinate发送心跳, 证明自己在线
  * 心跳的响应中, 如果包含```REBALANCE_NEEDED```, consumer就会开始rebalance
  * consumer端参数```session.timeout.ms```表征一个consumer发送心跳的超时时间, 默认10s, 超过这个时间没有发送心跳, 就会被视为下线
  * consumer端参数```heartbeat.interval.ms```指示consumer发送心跳的时间间隔
  * consumer端参数```max.poll.interval.ms```限定了consumer调用poll方法的时间间隔, 默认5分钟, 也就是说如果一个程序5分钟内没有消费完一条消息, consumer会自动发起离组

具体来说, 意外的触发rebalance有以下几种原因:

1. 未能及时发送心跳数据;
2. consumer消费时间过长, 触发离组.

> 有时, 客户端fullgc过于频繁, fullgc时间过长, 也会导致消费时间过长, 进而导致rebalance


> Coordinator所在的broker日志，如果经常发生rebalance，会有类似于"(Re)join group" 之类的日志


* kafka0.10.1之前: 发送心跳包和消息处理逻辑，使用的同一个线程，如果设置的max.poll.interval.ms大于session.timeout.ms，遇到一个处理时间过长的消息，会由于线程忙于处理消息，而无法发送心跳，导致kafka认为该消费者已完全死亡，进而进行Rebalance
  * 推荐设置：heartbeat.inerval.ms < max.poll.interval.ms < session.timeout.ms
* kafka0.10.1之后: session.timeout.ms 和 max.poll.interval.ms 解耦了，拆成了两个线程，不用再担心它们之间的依赖关系
  * 推荐设置：heartbeat.interval.ms < session.timeout.ms

> 上述参数都是consumer端参数, 一旦超时, consumer client会主动向coordinator发起LeaveGroup请求, 触发rebalance

## 其他

#### 拦截器

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

#### 消费进度监控

* lag: 滞后程度, 指消费者当前落后于生产者的速度. lag的单位是消息数, 在kafka中是针对每一个分区的指标.
  * 这个值变大, 说明消费端的消费能力不够, 赶不上生产端的生产能力了
* lead: 消费者最新消费的位移与分区当前第一条消息的位移的差值.
  * 由于消息留存时间, 这个值变小, 说明删除速度快追上生产速度了, 有可能会导致一部分没有消费的消息直接被删除, 造成消息丢失

> JMX指标中的records-lag-avg和records-lead-avg指标

#### 副本

In-sync Replicas, ISR, 同步副本. 如果一个副本, 滞后的时间小于```replica.lag.time.max.ms```, 则被视为ISR.

一般副本的作用有: 1. 提供数据冗余; 2. 提供高伸缩性; 3. 改善数据局部性.

kafka只能提供 数据冗余, 对于后两者, 不能支持.

#### 控制器

控制器组件是kafka的核心组件, 作用是在zookeeper的帮助下, 协同管理整个kafka集群. 集群中任意一个broker都可以当做控制器, 集群中只能存在一个控制器.

> 控制器, 和ElasticSearch中的master节点功能类似. 但是人家es的master都不需要依赖zookeeper, 哎!

第一个在zookeeper中创建```/controller```节点的broker会成为控制器节点. 控制器的具体作用如下:

1. 主题管理（创建、删除、增加分区）
2. 分区重分配
3. Preferred 领导者选举
4. 集群成员管理（新增 Broker、Broker 主动关闭、Broker 宕机）
5. 数据服务

控制器中保存了所有主题的信息, 所有broker的信息, 分区信息等.

#### 高水位

kafka中的高水位是用来表征消息的位移的, 高水位以下的消息是已提交的消息, 高水位以高水位以上的消息是未提交的消息. 主要有两个作用:

1. 定义消息可见性，即用来标识分区下的哪些消息是可以被消费者消费的
2. 帮助Kafka完成副本同步

## 常用命令

* 消费数据

```
bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test-topic --from-beginning --consumer.config aaa.properties
```

* 查看消费组的消费情况

```
bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group test-group --describe --command-config aaa.properties
```

* 查看消费组列表

```
bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --list --command-config aaa.properties
```

* 查看topic明细

```
bin/kafka-topics.sh --describe --bootstrap-server node1:9092,node2:9092,node3:9092 --topic topicName --command-config aaa.properties
```

查询结果示例如下:

```
  Topic:topicName PartitionCount:3 ReplicationFactor:2 Configs:
      Topic: topicName Partition: 0 Leader: 0 Replicas: 0,1 Isr: 0,1
      Topic: topicName Partition: 1 Leader: 1 Replicas: 1,2 Isr: 1,2
      Topic: topicName Partition: 2 Leader: 2 Replicas: 2,0 Isr: 2,0
```

PartitionCount：partition 个数。
ReplicationFactor：副本个数。
Partition：partition 编号，从 0 开始递增。
Leader：当前 partition 起作用的 breaker.id。
Replicas: 当前副本数据所在的 breaker.id，是一个列表，排在最前面的其作用。
Isr：当前 kakfa 集群中可用的 breaker.id 列表。

* 查看topic列表

```
bin/kafka-topics.sh --bootstrap-server localhost:9092 --list --command-config aaa.properties
```

* 创建/删除topic

```
bin/kafka-topics.sh --create --topic topicname --replication-factor 1 --partitions 8 --bootstrap-server 127.0.0.1:9093 --command-config  config/consumer.properties

bin/kafka-topics.sh --bootstrap-server 127.0.0.1:9093 --delete --topic topicname
```

* 一般上面的配置文件中这样配置:

```properties
bootstrap.servers=localhost:9093
group.id=test-consumer-group
security.protocol=SASL_PLAINTEXT
sasl.mechanism=PLAIN
```