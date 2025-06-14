# Docker使用

## 常用命令

* docker pull <image-name>  -- 拉取指定镜像
* docker pull <image-name>:version  -- 拉取指定版本镜像
* docker ps -- 获取运行中的docker容器
* docker ps -a -- 获取运行中的docker以及历史运行docker容器
* docker info -- 查看docker详细信息
* docker [start|stop|restart] <containerID|containerName> -- 管理容器生命周期
* docker inspect [containerID|imageID] -- 查看容器详细信息
* docker exec -it <containerID|containerName> /bin/sh -- 进入容器
* docker rm -f <containerID|containerName> -- 删除容器
* docker rmi -f <imageID|imageName:tag> -- 删除镜像
* docker stats <containerID|containerName> -- 查看正在运行的容器资源使用情况
* docker top <containerID|containerName> -- 显示容器中正在运行的进程
* docker images -- 查看所有镜像
* docker logs -f -t --tail <行数> <容器名> -- 查看容器启动日志
* docker volume ls -- 查看数据卷

其他命令:

* docker stop $(docker ps -aq) -- 停止所有docker容器

设置环境变量:

* docker run --env VAR1=value1 --env VAR2=value2 xxxx

## 使用实例

### mongo

```
docker pull mongo
docker run --name mongo -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=admin -d mongo
```

连接:

```
docker exec -it mongo bash
mongo -u admin -p admin
```

创建仓库:

```
use springbucks;
db.createUser({user:"springbucks", pwd:"springbucks", roles:[{role:"readWrite", db:"springbucks"}]})
```

### redis

```
docker pull redis
docker run --name redis -d -p 6379:6379 redis
docker exec -it <containerId> redis-cli
```

> 如果设置密码: docker run --name redis -d -p 6379:6379 redis --requirepass 123456

### mysql

```
docker pull mysql:5.7.17
docker run --name mysql -d -p 3306:3306 -e MYSQL_DATABASE=springbucks -e MYSQL_USER=springbucks -e MYSQL_PASSWORD=springbucks -e MYSQL_ROOT_PASSWORD=root_password mysql:5.7.17
```

> 可能需要执行:set @@Global.sql_mode = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION';

### zookeeper

```
docker pull zookeeper:3.5
docker run --name zookeeper -p 2181:2181 -d zookeeper:3.5
```

使用:

```
>>> docker exec -it zookeeper bash
>>> cd bin
>>> ./zkCli.sh
>>> ls /
>>> ls /services
>>> ls /services/frog-coffee
...

```

### consul

```
docker pull consul
docker run --name consul -d -p 8500:8500 -p 8600:8600/udp consul
```

> 用户界面: http://192.168.99.100:8500

### nacos

```
docker pull nacos/nacos-server
docker run --name nacos -d -p 8848:8848 -e MODE=standalone nacos/nacos-server
```

> 用户名密码为:nacos
> 用户界面:http://192.168.99.100:8848/nacos

### rabbitMq

```
docker pull rabbitmq:3.7-management
docker run --name rabbitmq -d -p 5672:5672 -p 15672:15672 -e RABBITMQ_DEFAULT_USER=spring -e RABBITMQ_DEFAULT_PASS=spring rabbitmq:3.7-management
```

### ElasticSearch


ElasticSearch单节点启动:

```
docker pull elasticsearch:7.17.21
docker run -d --name elasticsearch -e "discovery.type=single-node" -e "xpack.security.enabled=true" -e "ELASTIC_PASSWORD=frog1234" -p 8200:9200 elasticsearch:7.17.21
```

> 这里指定了单节点启动, 并开启`xpack.security.enabled=true`使得可以自由创建新的账号密码, 同时这里指定了ELASTIC_PASSWORD=frog1234, 即默认账号`elastic`的密码
> 自定义账号需要这样做:
> ```
> curl -X POST "http://localhost:9200/_security/user/<username>" \
> -H "Content-Type: application/json" \
> -u elastic:<password> \
> -d '{
>   "password": "<new_password>",
>   "roles": ["superuser"]
> }'
> ```



ElasticSearch全家桶安装:

找一个文件夹, 新建文件:```docker-compose.yaml```

内部添加内容:

```yaml
version: '2.2'
services:
  cerebro:
    image: lmenezes/cerebro:0.8.3
    container_name: cerebro
    ports:
      - "9000:9000"
    command:
      - -Dhosts.0.host=http://elasticsearch:9200
    networks:
      - es7net
  kibana:
    image: kibana:7.1.0
    container_name: kibana7
    environment:
      - I18N_LOCALE=zh-CN
      - XPACK_GRAPH_ENABLED=true
      - TIMELION_ENABLED=true
      - XPACK_MONITORING_COLLECTION_ENABLED="true"
    ports:
      - "5601:5601"
    networks:
      - es7net
  elasticsearch:
    image: elasticsearch:7.1.0
    container_name: es7_01
    environment:
      - cluster.name=geektime
      - node.name=es7_01
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - discovery.seed_hosts=es7_01,es7_02
      - cluster.initial_master_nodes=es7_01,es7_02
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - es7data1:/usr/share/elasticsearch/data
    ports:
      - 9200:9200
    networks:
      - es7net
  elasticsearch2:
    image: elasticsearch:7.1.0
    container_name: es7_02
    environment:
      - cluster.name=geektime
      - node.name=es7_02
      - bootstrap.memory_lock=true
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - discovery.seed_hosts=es7_01,es7_02
      - cluster.initial_master_nodes=es7_01,es7_02
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - es7data2:/usr/share/elasticsearch/data
    networks:
      - es7net


volumes:
  es7data1:
    driver: local
  es7data2:
    driver: local

networks:
  es7net:
    driver: bridge
```

然后, 在该文件夹中, 执行:

```
docker-compose up
```

其余可能用到的命令:

```
#启动
docker-compose up

#停止容器
docker-compose down

#停止容器并且移除数据
docker-compose down -v

#一些docker 命令
docker ps
docker stop Name/ContainerId
docker start Name/ContainerId

#删除单个容器
$docker rm Name/ID
-f, –force=false; -l, –link=false Remove the specified link and not the underlying container; -v, –volumes=false Remove the volumes associated to the container

#删除所有容器
$docker rm `docker ps -a -q`  
停止、启动、杀死、重启一个容器
$docker stop Name/ID  
$docker start Name/ID  
$docker kill Name/ID  
$docker restart name/ID
```

之后, 就成了. 但是, es启动可能报错, 运行elasticsearch需要```vm.max_map_count```至少需要262144内存:

```
在宿主机上, 切换到root用户修改配置sysctl.conf
vi /etc/sysctl.conf
在尾行添加以下内容   
vm.max_map_count=262144
并执行命令
sysctl -p
```


## Kibana单独作为客户端安装

1. 下载Kibana镜像.
2. 启动镜像.
    ```
    docker run -d --env ELASTICSEARCH_HOSTS=http://10.128.2.95:9200 --env ELASTICSEARCH_USERNAME=frog --env ELASTICSEARCH_PASSWORD=frog --name kb95 -p 5601:5601 docker.elastic.co/kibana/kibana:7.4.2
    ```

## Grafana安装

直接执行:
```
docker run -d --name=grafana -p 3000:3000 grafana/grafana:8.0.6-ubuntu
```


## Kafka&Zookeeper安装

这里采用docker-compose进行安装. 并且kafka增加授权, zookeeper不加授权.

首先准备授权文件```kafka_server_jaas.conf```:

```conf
KafkaServer {
    org.apache.kafka.common.security.plain.PlainLoginModule required
    username="admin"
    password="123123"
    user_admin="123123"
    user_kafka="456456";
};
KafkaClient {
    org.apache.kafka.common.security.plain.PlainLoginModule required
    username="kafka"
    password="456456";
};
```

新建环境变量文件```.env```:

```env
IP_ADDRESS=192.168.1.5
```


准备```docker-compose.yaml```文件:

```yaml
version: '2'

include:
  - env_file: ./.env

services:
    zookeeper:
        image: wurstmeister/zookeeper
        hostname: zookeeper
        restart: always
        ports:
            - 2181:2181
        environment:
            ZOOKEEPER_CLIENT_PORT: 2181
            ZOOKEEPER_TICK_TIME: 2000
            ZOOKEEPER_SASL_ENABLED: "false"
    kafka:
        image: wurstmeister/kafka
        hostname: broker
        container_name: kafka
        depends_on:
            - zookeeper
        ports:
            - 9093:9093
        environment:
            KAFKA_LISTENERS: SASL_PLAINTEXT://0.0.0.0:9093
            KAFKA_ADVERTISED_LISTENERS: SASL_PLAINTEXT://${IP_ADDRESS}:9093
            KAFKA_ZOOKEEPER_CONNECT: '${IP_ADDRESS}:2181'
            ZOOKEEPER_SASL_ENABLED: "false"
            KAFKA_OPTS: -Djava.security.auth.login.config=/etc/kafka/secrets/kafka_server_jaas.conf
            KAFKA_INTER_BROKER_LISTENER_NAME: SASL_PLAINTEXT
            KAFKA_SASL_ENABLED_MECHANISMS: PLAIN
            KAFKA_SASL_MECHANISM_INTER_BROKER_PROTOCOL: PLAIN
            KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
            KAFKA_AUTO_CREATE_TOPICS_ENABLE: "true"
        volumes:
            - /mnt/d/docker/kafka:/etc/kafka/secrets
```

启动```docker-compose up -d```

> 上面的示例中, 将这两个文件都放在了```D:/docker/kafka```目录下, 这个docker-compose只能在wsl内部执行, 不能在windows中执行.
> 这里面使用kafka端口是9093

## clickhouse

1. 下载并启动容器: ```docker run -d --name ch-server --ulimit nofile=262144:262144 -p 8123:8123 -p 9000:9000 -p 9009:9009 yandex/clickhouse-server```

接下来开始修改用户密码, 有两种方式:

* 方式1:
  1. 进入容器: ```docker exec -it clickhouse-server /bin/bash```
  2. 生成加密后的密码: ```PASSWORD=$(base64 < /dev/urandom | head -c8); echo "你的密码"; echo -n "你的密码" | sha256sum | tr -d '-'```
  3. 修改配置文件: ```vim /etc/clickhouse-server/users.xml``` (可能需要提前安装vim, 1. ```apt-get update```; 2. ```apt-get install vim -y```);
  4. 将配置文件中```<password></password>```替换为上面生成的密文```<password_sha256_hex>密文</password_sha256_hex>```;
  5. 保存, 不需要重启, 即刻生效. 可以使用下面的命令测试一下: ```clickhouse-client -h 127.0.0.1 -d default -m -u default --password '明文密码'```
  6. 上面修改密码修改的是default用户的密码, 这里再新增一个用户. 依旧是: ```vim /etc/clickhouse-server/users.xml```
  7. 在```<users></users>```标签下新增一个用户配置, 例如:

```xml
<users>
    <frog>    <!--用户登录名-->
        <password>123123</password>    <!--用户登录密码, 如果是密文, 还和上面一样的操作-->
        <networks>
           <ip>::/0</ip>
        </networks>   <!--允许登录的网络地址-->
        <profile>default</profile>  <!--用户使用的profile配置-->
        <quota>default</quota>      <!--用户能够使用的资源限额/熔断机制-->
    </frog>
<users>
```
  8. 保存, 不需要重启, 直接生效. 


* 方式2:
  1. 准备一个完整的users.xml配置文件:
```xml
<?xml version="1.0"?>
<clickhouse>
    <profiles>
        <default>
            <max_memory_usage>10000000000</max_memory_usage>
            <load_balancing>random</load_balancing>
        </default>
        <readonly>
            <readonly>1</readonly>
        </readonly>
    </profiles>
    <users>
        <frog>
            <password_sha256_hex>xxxx</password_sha256_hex>    <!--用户登录密码, 如果是密文, 还和上面一样的操作-->
            <networks>
            <ip>::/0</ip>
            </networks>   <!--允许登录的网络地址-->
            <profile>default</profile>  <!--用户使用的profile配置-->
            <quota>default</quota>      <!--用户能够使用的资源限额/熔断机制-->
        </frog>
        <default>
            <password></password>
            <networks>
                <ip>::/0</ip>
            </networks>
            <profile>default</profile>
            <quota>default</quota>
        </default>
    </users>
    <quotas>
        <default>
            <interval>
                <duration>3600</duration>
                <queries>0</queries>
                <errors>0</errors>
                <result_rows>0</result_rows>
                <read_rows>0</read_rows>
                <execution_time>0</execution_time>
            </interval>
        </default>
    </quotas>
</clickhouse>
```
  2. 复制到docker容器里面去:  ```docker cp /mnt/d/docker/clickhouse/users.xml 容器id:/etc/clickhouse-server/users.xml```
  3. 不需要重启, 直接生效

其他操作:

* 连接数据库: ```clickhouse-client -h 127.0.0.1 -d default -m -u frog --password '123123'```
* 新建数据库: ```CREATE DATABASE aaa;```

## RocketMQ

* docker-compose.yaml:

```yaml
version: '3.5'
services:
  rmqnamesrv:
    image: foxiswho/rocketmq:server
    container_name: rmqnamesrv
    ports:
      - 9876:9876
    volumes:
      - /mnt/d/docker/rocketmq/data/logs:/opt/logs
      - /mnt/d/docker/rocketmq/data/logs:/opt/store
    networks:
        rmq:
          aliases:
            - rmqnamesrv
 
  rmqbroker:
    image: foxiswho/rocketmq:broker
    container_name: rmqbroker
    ports:
      - 10909:10909
      - 10911:10911
    volumes:
      - /mnt/d/docker/rocketmq/data/logs:/opt/logs
      - /mnt/d/docker/rocketmq/data/store:/opt/store
      - /mnt/d/docker/rocketmq/compose/broker.conf:/etc/rocketmq/broker.conf
      - /mnt/d/docker/rocketmq/compose/plain_acl.conf:/etc/rocketmq/plain_acl.conf
    environment:
        NAMESRV_ADDR: "rmqnamesrv:9876"
        JAVA_OPTS: " -Duser.home=/opt"
        JAVA_OPT_EXT: "-server -Xms128m -Xmx128m -Xmn128m"
    command: mqbroker -c /etc/rocketmq/broker.conf
    depends_on:
      - rmqnamesrv
    networks:
      rmq:
        aliases:
          - rmqbroker
 
  rmqconsole:
    image: styletang/rocketmq-console-ng
    container_name: rmqconsole
    ports:
      - 18080:8080
    environment:
        JAVA_OPTS: "-Drocketmq.namesrv.addr=rmqnamesrv:9876 -Dcom.rocketmq.sendMessageWithVIPChannel=false"
    depends_on:
      - rmqnamesrv
    networks:
      rmq:
        aliases:
          - rmqconsole
 
networks:
  rmq:
    name: rmq
    driver: bridge
```

* broker.conf:

```conf
# 所属集群名字
brokerClusterName=DefaultCluster
 
# broker 名字，注意此处不同的配置文件填写的不一样，如果在 broker-a.properties 使用: broker-a,
# 在 broker-b.properties 使用: broker-b
brokerName=broker-a
 
# 0 表示 Master，> 0 表示 Slave
brokerId=0
 
# nameServer地址，分号分割
# namesrvAddr=rocketmq-nameserver1:9876;rocketmq-nameserver2:9876
 
# 启动IP,如果 docker 报 com.alibaba.rocketmq.remoting.exception.RemotingConnectException: connect to <192.168.0.120:10909> failed
# 解决方式1 加上一句 producer.setVipChannelEnabled(false);，解决方式2 brokerIP1 设置宿主机IP，不要使用docker 内部IP
# 在WSL中, ifconfig获取ip, 然后填入这里
brokerIP1=172.27.160.1
 
# 在发送消息时，自动创建服务器不存在的topic，默认创建的队列数
defaultTopicQueueNums=4
 
# 是否允许 Broker 自动创建 Topic，建议线下开启，线上关闭 ！！！这里仔细看是 false，false，false
autoCreateTopicEnable=true
 
# 是否允许 Broker 自动创建订阅组，建议线下开启，线上关闭
autoCreateSubscriptionGroup=true
 
# Broker 对外服务的监听端口
listenPort=10911
 
# 删除文件时间点，默认凌晨4点
deleteWhen=04
 
# 文件保留时间，默认48小时
fileReservedTime=120
 
# commitLog 每个文件的大小默认1G
mapedFileSizeCommitLog=1073741824
 
# ConsumeQueue 每个文件默认存 30W 条，根据业务情况调整
mapedFileSizeConsumeQueue=300000
 
# destroyMapedFileIntervalForcibly=120000
# redeleteHangedFileInterval=120000
# 检测物理文件磁盘空间
diskMaxUsedSpaceRatio=88
# 存储路径
# storePathRootDir=/home/ztztdata/rocketmq-all-4.1.0-incubating/store
# commitLog 存储路径
# storePathCommitLog=/home/ztztdata/rocketmq-all-4.1.0-incubating/store/commitlog
# 消费队列存储
# storePathConsumeQueue=/home/ztztdata/rocketmq-all-4.1.0-incubating/store/consumequeue
# 消息索引存储路径
# storePathIndex=/home/ztztdata/rocketmq-all-4.1.0-incubating/store/index
# checkpoint 文件存储路径
# storeCheckpoint=/home/ztztdata/rocketmq-all-4.1.0-incubating/store/checkpoint
# abort 文件存储路径
# abortFile=/home/ztztdata/rocketmq-all-4.1.0-incubating/store/abort
# 限制的消息大小
maxMessageSize=65536
 
# flushCommitLogLeastPages=4
# flushConsumeQueueLeastPages=2
# flushCommitLogThoroughInterval=10000
# flushConsumeQueueThoroughInterval=60000
 
# Broker 的角色
# - ASYNC_MASTER 异步复制Master
# - SYNC_MASTER 同步双写Master
# - SLAVE
brokerRole=ASYNC_MASTER
 
# 刷盘方式
# - ASYNC_FLUSH 异步刷盘
# - SYNC_FLUSH 同步刷盘
flushDiskType=ASYNC_FLUSH
 
# 发消息线程池数量
# sendMessageThreadPoolNums=128
# 拉消息线程池数量
# pullMessageThreadPoolNums=128

#此参数控制是否开启密码
aclEnable=false
```

* plain_acl.conf(如果需要配置密码, 则需要这个文件, 否则不需要):

```conf
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.

accounts:
- accessKey: RocketMQ
  secretKey: 12345678
  whiteRemoteAddress:
  admin: false
  defaultTopicPerm: DENY
  defaultGroupPerm: SUB
  topicPerms:
  - topicA=DENY
  - topicB=PUB|SUB
  - topicC=SUB
  groupPerms:
  # the group should convert to retry topic
  - groupA=DENY
  - groupB=PUB|SUB
  - groupC=SUB

- accessKey: rocketmq2
  secretKey: 12345678
  # if it is admin, it could access all resources
  admin: true
```

## CentOS7 docker安装

1. 更新yum包, 防止安装过程中出现问题`yum update`;
2. 安装依赖软件包, `yum install -y yum-utils device-mapper-persistent-data lvm2`;
3. 想yum中添加docker仓库: `yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo`;
4. 浏览当前发布的docker版本: `yum list docker-ce --showduplicates | sort -r`;
5. 选择一个版本进行安装: `yum install docker-ce-18.06.3.ce-3.el7`;
6. 启动docker: `systemctl start docker`
7. 加入开机自启项: `systemctl enable docker`
8. 验证是否安装成功: `docker version`

卸载: `yum remove docker docker-common docker-selinux docker-engine`