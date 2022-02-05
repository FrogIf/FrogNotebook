# ros基本概念

## 工作空间

工作空间是程序包存储的地方. 在工作空间中, 可以创建新的程序包, 也可以安装现有的工具包.

创建步骤:

1. 创建一个新的文件夹

```bash
>>> mkdir -p helloworld/src
```

2. 在src目录中, 初始化工作空间

```bash
>>> cd helloworld/src

>>> catkin_init_workspace
```

3. 在工作空间根目录中, 编译工作空间

```bash
>>> cd ..

>>> catkin_make
```

下面简单介绍一下, 工作空间中的文件含义:

```
build
.catkin_workspace
devel
src
```

* src目录: 代码空间, 以程序包为单元, 存储源码
* build目录: 编译空间, src目录中的源码编译过程中, 产生的中间文件及缓存文件存储于该目录
* devel目录: 开发空间, src目录中的源码编译之后, 生成的可执行文件存储的位置
* install目录: 安装空间, devel目录中的可执行文件, 通过执行```catkin_make install```, 安装到install目录中. 安装空间不是必须的.

**环境变量配置**

```catkin_make```编译完成之后, 工作空间中的程序包在系统全局中是找不到的, 如果想在系统全局去执行这个程序包, 需要配置环境变量, 以告诉系统, 目标程序包所在位置. 可以这样配置:

```bash
source devel/setup.bash
```

然后, 可以通过以下命令来检查配置是否生效:

```bash
echo $ROS_PACKAGE_PATH
```

上述方式, 配置的环境变量, 只能在当前终端中生效, 每新打开一个终端, 都需要重新配置, 如果希望在所有终端中生效, 需要在终端的配置文件中加入环境变量的设置:

```bash
echo "source /<WORKSPACEPATH>/devel/setup.bash" >> ~/.bashrc
```

## 程序包/功能包

程序包, 也可以叫做功能包. 是组织ros节点和函数库的一个代码集. 在src目录下执行命令, 以创建程序包.

```bash
catkin_create_pkg <ros_package_name> <package_dependencies>
```

举例:

```bash
catkin_create_pkg hello_one roscpp rospy std_msgs
```

这时, 在src目录下生成的文件目录:

```bash
hello_one
    |---CMakeLists.txt
    |---include
        |---hello_one
    |---package.xml
    |---src
```

* CMakeLists.txt -- 记录了c++程序编译组织策略
* package.xml -- 记录了程序包依赖的一些库以及自身一些信息
* src -- c++源码存放位置
* scripts -- python脚本存放位置
* include -- 包含了源程序的头文件以及第三方库文件

## 节点

一个程序包中, 可以包含多个节点. 多个节点的源均放在src或scripts目录下.

## ROS通信

ROS中多个节点之间通信使用的是TCP/UDP网络传输协议. 在架构上, ros主要通过ROS Master来组织多个节点之间的通讯, ros master实际上就是一个注册中心和配置中心, 所有的节点都会向ros master进行注册, 并且一些配置信息会存储在ros master上. ros1中只存在一个ros master, 不支持高可用.

如果A节点要访问B节点, 首先A会先询问ros master, 获取B节点在网络中的位置. 接下来A会直接通过这个位置, 与B进行频繁的通讯, 这个过程中, 就再也不需要master的参与了.

ros通讯有两种不同的形式:

1. 发布/订阅模式 -- 异步传输模式, 不关注返回结果
2. 服务模式 -- 同步传输模式, 需要等待返回结果

相关命令:

* 查看当前ros版本: ```rosversion -d```
* 查看当前节点列表: ```rosnode list```
* 查看当前参数列表: ```rosparam list```
* 设置指定参数的值: ```rosparam set <param_name> <value>```
* 获取指定参数的值: ```rosparam get <param_name>```

**发布订阅模式**

开发API:

* Publisher

```c++
#include "ros/ros.h"

// 初始化ROS节点
ros::init(argc, argv, "node_name");

// 创建节点句柄
ros::NodeHandle n;

// 创建一个Publisher, 指定名称的topic, 并且指定消息类型
ros::Publisher pub = n.advertise<msg_type>("topic_name", 1000/*消息队列大小, 超出消息删除策略:FIFO*/);

// 设置循环的频率, 单位是Hz, 当调用Rate::sleep()时, ROS会根据此处设置的频率, 休眠相应的时间. 以保证维持一致的时间周期. (这里是的时间实际上是: 1000ms / 10 = 100ms)
ros::Rate loop_rate(10);

while(ros::ok()){
    // 发布消息
    pub.publish(msg);

    /*
     * 循环等待回调函数
     * 如果一个节点既是发布者, 又订阅了一些topic, 而这些topic订阅是没有守护线程来维护回调的, 需要程序中自行处理 
     * 那么, 如果没有这段语句, 程序将会一直进行发布相关逻辑, 订阅消息相关回调永远不会被执行
     * 这条语句的作用, 就是停下手中的发布相关工作, 转而处理一下订阅消息的回调
     */
    ros::spinOnce();

    // 按照循环频率延时
    loop_rate.sleep();
}
```

* Subscriber

```c++
#include "ros/ros.h"

void topicCallback(const ros_message_const_pointer& pointer){
    // 获取数据
    pointer->data;
}

// ---------------------------------------------

// 初始化ros节点
ros::init(argc, argv, "node_name");

// 创建节点句柄
ros::NodeHandle n;

ros::Subscriber sub = n.subscribe("topic_name", 1000/*消息队列大小*/, topicCallback);

// 线程阻塞/自旋, 监听订阅消息
ros::spin();
```


相关命令:

* 查看当前topic列表: ```rostopic list```
* 输出指定话题中的数据: ```rostopic echo <topic_name>```
* 向话题发送数据: ```rostopic pub <topic_name> <msg_type> <data>```
* 查看指定topic中的数据类型: ```rostopic type <topic_name>```
* 查看指定消息的定义: ```rosmsg show <msg_type>```

**服务模式**

开发API:

* Server

```c++
#include "ros/ros.h"

bool callbackMethod(MessageType::Request &req, MessageType::Response &resp){
    // do something
}

// 初始化节点
ros::init(argc, argv, "node_name");

// 创建节点句柄
ros::NodeHandle n;

// 创建指定名称的服务, 注册回调函数
ros::ServiceServer service = n.advertiseService("service_name", callbackMethod);

// 阻塞线程, 等待回调
ros::spin();
```

* Client

```c++
// 初始化节点
ros::init(argc, argv, "node_name");

// 创建节点句柄
ros::NodeHandle n;

// 创建一个client
ros::ServiceClient client = n.serviceClient<MessageType>("service_name");

MessageType param;
param.request.field1 = xxx;
// ...

if(client.call(param)){
    // 执行成功回调
}else{
    // 执行失败回调
}
```

相关命令:

* 查看当前service列表: ```rosservice list```
* 调用指定的服务: ```rosservice call <service_name> <data>```

## 自定义话题消息

演示如下:

1. 在msg目录下, 新建一个文件```Person.msg```:

```
string name
uint8 sex
uint8 age

uint8 unkonwn = 0
uint8 male    = 1
uint8 female  = 2
```

> 后三行是sex的枚举值

> 为什么要在msg目录下, 别的目录不行吗? 不行, 在CMakeLists.txt文件中, 有描述:"Generate messages in the 'msg' folder"

2. 手动修改package.xml文件, 添加依赖

构建依赖:

```xml
<build_depend>message_generation</build_depend>
```

运行时依赖:

```xml
<exec_depend>message_runtime</exec_depend>
```

3. CMakeLists.txt文件中添加相关编译选项

```
find_package(catkin REQUIRED COMPONENTS
...
  message_generation
...
)

add_message_files(
   FILES
   Person.msg
...
)

generate_messages(
  DEPENDENCIES
  std_msgs
)

catkin_package(
...
   CATKIN_DEPENDS roscpp std_msgs message_runtime
...
)
```

> **注意**: CMakeLists.txt中的配置是有顺序的, 需要根据文件中的注释, 进行修改, 不能随便放在一个位置

4. 在工作空间根目录执行编译操作, 即可得到相关的头文件

编译结束后, 在```<workspace>/devel/include/<package_name>/```目录下, 可以找到对应消息的头文件. 并且, 这时, 执行```rosmsg show Person```可以查看消息的定义.

```
frogif@frogif-VirtualBox:~/FrogRos/custom_message/devel/include$ rosmsg show Person
[person_msg/Person]:
uint8 unkonwn=0
uint8 male=1
uint8 female=2
string name
uint8 sex
uint8 age
```

**自定义消息使用**

通过查看devel下的头文件, 可以知道这个消息的namespace以及结构体内部结构, 就知道怎么用了.

关键几点如下:

Publisher:

```c++
#include "person_msg/Person.h"

        person_msg::Person p;
        p.name = "frog";
        p.age = 12;
        p.sex = person_msg::Person::male;
```

Subscriber:

```c++
#include "person_msg/Person.h"

void callback(const person_msg::Person::ConstPtr& person){
    // ...
}
```

## 自定义服务数据

与自定义话题消息差不多.

1. 在srv目录下, 定义相关消息文件:

```
int64 a
int64 b
---
int64 sum
```

这里```---```上边是request部分, 下边是```response```部分.

2. 添加依赖, package.xml中依赖项与自定义话题完全一致.
3. CMakeLists.txt文件中添加相关编译选项, 与自定义话题基本一致, 只是add_message_files改为add_service_files

```
add_service_files(
    FILES
    AddTwoInts.srv
)
```

4. 执行```catkin_make```操作, 就可以把定义的服务数据转为c++头文件了, 依旧是在```<workspace>/devel/include/<package_name>/```目录下, 可以看到:

```
-rw-rw-r-- 1 frogif frogif 2665 12月 28 23:16 AddTwoInts.h
-rw-rw-r-- 1 frogif frogif 5038 12月 28 23:16 AddTwoIntsRequest.h
-rw-rw-r-- 1 frogif frogif 4904 12月 28 23:16 AddTwoIntsResponse.h
```

同样, 可以通过```rossrv show <service_name>```命令查看:

```
frogif@frogif-VirtualBox:~/FrogRos/custom_message/src/person_msg/src$ rossrv show person_msg/AddTwoInts
int64 a
int64 b
---
int64 sum
```

**自定义服务的使用**

通过查看devel下的头文件, 可以知道这个消息的namespace以及结构体内部结构, 就知道怎么用了.

关键的几点如下:

客户端:

```c++
#include "person_msg/AddTwoInts.h"
ros::ServiceClient client = n.serviceClient<person_msg::AddTwoInts>("add_two_ints");
```

服务端:

```c++
#include "person_msg/AddTwoInts.h"

bool add(person_msg::AddTwoInts::Request &req, person_msg::AddTwoInts::Response &resp){
    // ...
}
```