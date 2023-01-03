# OpenStack

## Overview

OpenStack是一个云基础架构服务. 由Rackspace和NASA共同开发的云计算平台, 是一个自由软件和开放源代码项目. OpenStack官网地址为: https://www.openstack.org

OpenStack能做什么?

* 根据指定的镜像创建虚拟机实例;
* 为实例分配资源(CPU, 内存, 磁盘存储, 网络);
* 将多个实体主机上的CPU/内存/磁盘/网络资源整合到一起, 视为一个整体进行分配; -- 对底层实现透明的通用资源控制接口;
* 我们可以通过vnc, 登录到实例内部, 对实例进行一些操作;

OpenStack有哪些核心组件:

* Nova -- 计算: 管理虚拟机资源, 包括: CPU, 内存, 磁盘, 网络接口;
* Neutron -- 网络: 提供虚拟机网络接口资源, 包括: IP寻址, 路由, 软件定义网络(SDN);
* Swift -- 对象存储: 提供可通过RESTful API访问的对象存储;
* Cinder -- 块存储: 为虚拟机提供块(传统磁盘)存储;
* Keystone -- 身份认证服务: 为OpenStack组件提供基于角色的访问控制(RBAC), 提供授权服务;
* Glance -- 镜像服务: 管理虚拟机磁盘镜像, 为虚拟机和快照(备份)服务提供镜像;
* Horizon -- 仪表盘: 为OpenStack提供基于Web的图形界面;
* Ceilometer -- 计量服务: 集中为OpenStack各个组件收集计量和监控数据;
* Heat -- 编排服务: 为OpenStack环境提供基于模板的云应用编排服务.

一些术语:

* IaaS: Infrastructure as a Service, 基础设施即服务.
  * 将计算,存储,网络打包提供, 用户不需要自己租用机房, 维护服务器和交换机.
  * 虚拟机, 服务器, 存储空间, 网络带宽...
* PaaS: Platform as a Service, 平台即服务
  * 有时也叫中间件, 不对基础设施进行直接操作, 而是提供一定的业务环境. 提供封装后的具有一定特异性的资源, 例如特定的运算逻辑, 特定的存储结构.
  * 数据库, 开发工具, Web服务器, 软件运行环境, 具体来说, 例如: Tomcat, Mysql, Kafka等...
* SaaS: Software as a Service, 软件即服务
  * 基于IaaS和PaaS的基础上, 定制化的提供某些服务.
  * CRM, 游戏...

OpenStack安装过程参见附录.

## OpenStackAPI

## 账户

## 网络

## CPU,内存,磁盘

## 编排

## 底层


## 附录

### OpenStack安装

这里只是通过DevStack进行快速安装, 用以快速感受OpenStack功能用途, 实际生产环境中安装OpenStack不能采用这种方式. 此处相关文档参考: https://docs.openstack.org/devstack/latest/

前置参数信息:

* OpenStack: OpenStack Zed
* Ubuntu: Ubuntu 20.04

**1. Ubuntu系统准备**

1. 安装Ubuntu;
2. 更新软件包

```bash
sudo apt-get update -y

sudo apt-get upgrade -y
```

3. 创建stack用户

```
sudo useradd -s /bin/bash -d /opt/stack -m stack
```

4. 对路径进行授权

```
sudo chmod +x /opt/stack
```

5. 权限配置:

```
echo "stack ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/stack

sudo -u stack -i
```


**2. 安装OpenStack**

* 提前安装```man-db```, 因为如果在devstack中安装, 有可能会卡死.

```
sudo apt-get install -y man-db
```

1. 下载devstack:

```
git clone https://opendev.org/openstack/devstack
```

> 如果下载不了, 可以去github上下载, 项目地址为: https://github.com/openstack/devstack

2. 在devstack根目录增加配置```local.conf```

```
[[local|localrc]]
ADMIN_PASSWORD=secret
DATABASE_PASSWORD=$ADMIN_PASSWORD
RABBIT_PASSWORD=$ADMIN_PASSWORD
SERVICE_PASSWORD=$ADMIN_PASSWORD

disable_service mysql
enable_service postgresql
HOST_IP=10.0.2.15

LOGFILE=$DEST/logs/stack.sh.log
LOGDAYS=2
```

> 这里没有使用mysql而是改成了postgresql, 是因为mysql安装时, 我遇到了文件夹不正确, 导致安装失败

3. 如果有些包下载失败, 可以手动放到指定的文件夹中, 例如文件夹:```/opt/stack/devstack/files```放入```etcd-v3.3.12-linux-amd64.tar.gz```
4. 安装过程中, 需要下载很多项目源码, 从官网上下载代码很容易失败, 这里修改代码地址, 直接从github上下载代码(采用ssh的方式,即使国内也很快). 需要修改devstack/stackrc文件, 修改的东西比较多, 主要是:

```
GIT_BASE=${GIT_BASE:-git@github.com:openstack}
```

然后所有使用GIT_BASE的地方, 地址都需要微调, 通过```git diff```查看, 大概是这样的:

```diff
@@ -222,7 +222,7 @@ WSGI_MODE=${WSGI_MODE:-"uwsgi"}
 # ------------

 # Base GIT Repo URL
-GIT_BASE=${GIT_BASE:-https://opendev.org}
+GIT_BASE=${GIT_BASE:-git@github.com}

 # The location of REQUIREMENTS once cloned
 REQUIREMENTS_DIR=${REQUIREMENTS_DIR:-$DEST/requirements}
@@ -252,35 +252,35 @@ DEVSTACK_SERIES="2023.1"
 ##############

 # block storage service
-CINDER_REPO=${CINDER_REPO:-${GIT_BASE}/openstack/cinder.git}
+CINDER_REPO=${CINDER_REPO:-${GIT_BASE}:openstack/cinder.git}
 CINDER_BRANCH=${CINDER_BRANCH:-$TARGET_BRANCH}

 # image catalog service
-GLANCE_REPO=${GLANCE_REPO:-${GIT_BASE}/openstack/glance.git}
+GLANCE_REPO=${GLANCE_REPO:-${GIT_BASE}:openstack/glance.git}
 GLANCE_BRANCH=${GLANCE_BRANCH:-$TARGET_BRANCH}

 # django powered web control panel for openstack
-HORIZON_REPO=${HORIZON_REPO:-${GIT_BASE}/openstack/horizon.git}
+HORIZON_REPO=${HORIZON_REPO:-${GIT_BASE}:openstack/horizon.git}
 HORIZON_BRANCH=${HORIZON_BRANCH:-$TARGET_BRANCH}
```

5. 在devstack文件夹中执行命令, 开始安装:

```
./stack.sh
```

6. 卸载与清理. 很可能一次安装不会成功, 这时直接卸载重装就可以了, 有以下两个命令:

```
./unstack.sh

./clean.sh
```

> 这两个命令不会清楚已经下载好的安装包, 所以, 一些由于网络原因导致安装失败的情况, 重新安装时, 不必再次下载已存在的安装包了