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

### mysql

```
docker pull mysql:5.7.17
docker run --name mysql -d -p 3306:3306 -v /docker-data/mysql:/var/lib/mysql -e MYSQL_DATABASE=springbucks -e MYSQL_USER=springbucks -e MYSQL_PASSWORD=springbucks -e MYSQL_ROOT_PASSWORD=root_password mysql:5.7.17
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
Client {
    org.apache.kafka.common.security.plain.PlainLoginModule required
    username="kafka"
    password="456456";
};
```

准备```docker-compose.yaml```文件:

```yaml
version: '2'
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
            KAFKA_ADVERTISED_LISTENERS: SASL_PLAINTEXT://192.168.77.77:9093
            KAFKA_ZOOKEEPER_CONNECT: '192.168.77.77:2181'
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

接下来开始修改用户密码:

2. 进入容器: ```docker exec -it clickhouse-server /bin/bash```
3. 生成加密后的密码: ```PASSWORD=$(base64 < /dev/urandom | head -c8); echo "你的密码"; echo -n "你的密码" | sha256sum | tr -d '-'```
4. 修改配置文件: ```vim /etc/clickhouse-server/users.xml```

> 第四步可能需要提前安装vim, 1. ```apt-get update```; 2. ```apt-get install vim -y```;

5. 将配置文件中```<password></password>```替换为上面生成的密文```<password_sha256_hex>密文</password_sha256_hex>```;
6. 保存, 不需要重启, 即刻生效. 可以使用下面的命令测试一下: ```clickhouse-client -h 127.0.0.1 -d default -m -u default --password '明文密码'```
7. 上面修改密码修改的是default用户的密码, 这里再新增一个用户. 依旧是: ```vim /etc/clickhouse-server/users.xml```
8. 在```<users></users>```标签下新增一个用户配置, 例如:

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
9. 保存, 不需要重启, 直接生效. ```clickhouse-client -h 127.0.0.1 -d default -m -u frog --password '123123'```

其他操作:

* 新建数据库: ```CREATE DATABASE aaa;```