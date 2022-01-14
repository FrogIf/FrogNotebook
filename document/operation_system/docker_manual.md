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


**Kibana单独作为客户端安装**

1. 下载Kibana镜像.
2. 启动镜像.
    ```
    docker run -d --env ELASTICSEARCH_HOSTS=http://10.128.2.95:9200 --env ELASTICSEARCH_USERNAME=tingyun --env ELASTICSEARCH_PASSWORD=nEtben@2_19 --name kb95 -p 5601:5601 docker.elastic.co/kibana/kibana:7.4.2
    ```

**Zookeeper安装**




**Grafana安装**

直接执行:
```
docker run -d --name=grafana -p 3000:3000 grafana/grafana:8.0.6-ubuntu
```



**Kafka安装**

```
docker run -d --name kafka \
-p 9092:9092 \
-e KAFKA_BROKER_ID=0 \
-e KAFKA_ZOOKEEPER_CONNECT=10.0.0.101:2181 \
-e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://10.0.0.101:9092 \
-e KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092 wurstmeister/kafka
```