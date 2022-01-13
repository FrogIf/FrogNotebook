# ROS安装

## 概述

基于Ubuntu20.04版本, ros基于noetic版本.

Ubuntu与ros版本兼容如下:

Ubuntu版本|ros版本
-|-
20.04|noetic
18.04|melodic
16.04|kinetic
14.04|indigo

> 如果不按照对应版本安装, 则可能会报错: Unable to locate package ros-xxxxx-desktop-full

系统要求:
指标|参数
-|-
磁盘| >= 20G
CPU| >= 2核
内存| >= 4G

## 安装

> 官方安装文档地址: http://wiki.ros.org/cn/kinetic/Installation/Ubuntu

1. 配置你的Ubuntu软件仓库（repositories）以允许使用"restricted", "universe"和"multiverse"存储库

2. 设置sources.list

```bash
sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'
```

如果下载缓慢, 可以切换镜像源:

```bash
sudo sh -c '. /etc/lsb-release && echo "deb http://mirrors.tuna.tsinghua.edu.cn/ros/ubuntu/ `lsb_release -cs` main" > /etc/apt/sources.list.d/ros-latest.list'
```

3. 设置密钥. 在Ubuntu中, 如果要下载二进制文件或者软件包, 需要再系统中添加一个安全密钥来授权软件下载. 使用此密钥进行身份验证的包被视为受信任的包.

```bash
sudo apt-key adv --keyserver 'hkp://keyserver.ubuntu.com:80' --recv-key C1CF6E31E6BADE8868B172B4F42ED6FBAB17C654
```

4. 确保Debian软件包索引是最新的

```bash
sudo apt-get update
```

5. 安装桌面完整版

```bash
sudo apt-get install ros-noetic-desktop-full
```

> 安装之后, 可以通过```apt-cache search ros-kinetic```查看可使用的包

6. 初始化rosdep, rosdep对于安装ROS包的依赖包很有用. 如果一个ROS包可能需要若干个依赖包才能正常工作, Rosdep会检查依赖包是否可用, 如果不可用, 他将自动安装这些依赖包.

```bash
sudo rosdep init

rosdep update
```

7. 配置环境. ROS自带工具链和函数库, 但是要访问这些命令, 就必须设置ROS环境变量.

如果不嫌麻烦的话, 可以每次使用:

```bash
source /opt/ros/noetic/setup.bash
```

比较方便的方式是一次性执行以下命令:

```bash
echo "source /opt/ros/noetic/setup.bash" >> ~/.bashrc
source ~/.bashrc
```

这样的话, 每新打开一个终端时, 都会自动将环境变量配置到bash会话中

8. 构建工厂依赖

到目前为止，你已经安装了运行核心 ROS 包所需的内容。为了创建和管理自己的 ROS 工作区，有各种各样的工具和需求分别分布。例如：rosinstall 是一个经常使用的命令行工具，它使你能够轻松地从一个命令下载许多 ROS 包的源树。

```bash
sudo apt-get install python-rosinstall python-rosinstall-generator python-wstool build-essential
```