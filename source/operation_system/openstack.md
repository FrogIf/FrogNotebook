# Openstack

## 问题记录

### 查看openstack日志

devstack自动化部署的日志在: `/opt/stack/logs/nova-api.log`
非devstack自动化部署的日志在: `/var/log/模块名/`

各个日志的意义:

* nova-compute.log：虚拟机实例在启动和运行中产生的日志
* nova-network.log：关于网络状态、分配、路由和安全组的日志
* nova-manage.log：运行nova-manage命令时产生的日志
* nova-scheduler.log：有关调度的，分配任务给节点以及消息队列的相关日志
* nova-objectstore.log：镜像相关的日志
* nova-api.log：用户与OpenStack交互以及OpenStack组件间交互的消息相关日志
* nova-cert.log：nova-cert过程的相关日志
* nova-console.log：关于nova-console的VNC服务的详细信息
* nova-consoleauth.log：关于nova-console服务的验证细节
* nova-dhcpbridge.log：与dhckbridge服务先关的网络信息

### 常见问题

1. CPU/内存/磁盘/ip地址等资源不足;
   * 磁盘 - `lsblk`; 
   * 内存 - `free -h`; 
   * openstack dashboard中, 登录admin, 在`管理员-计算-虚拟机管理器`中可以看到磁盘等的使用情况; 
   * ip资源 - `项目-网络-网络` 找到指定的子网, 点击进入, 选择`端口`, 将状态异常的端口删除掉;
2. 系统盘给小了, 比镜像的大小还小, 导致实例创建失败;
   * 在日志文件中可以找到相关日志, 大致提示: `flavor's disk is too small for requested image. Flavor disk is xxxxxx bytes, image is xxxxx bytes.`
3. flavor配置有错误, 导致实例创建失败. 例如非dpdk类型, flavor配置成了dpdk. 查看flavor可以在: `管理员-计算-实例类型`中查看.