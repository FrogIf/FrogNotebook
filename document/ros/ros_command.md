# ros常用命令

**启动**

* 启动ros节点管理器(ROS master)

```bash
roscore
```

* 运行ros节点

```bash
rosrun <程序包名称> <节点名称>
```

* 通过启动文件启动

```bash
roslaunch <程序包名称> <launch文件名>
```

launch.xml文件示例:

```xml
<launch>
    <node name="node_name" pkg="package_name" type="listener" output="screen" />
</launch>
```