# Ubuntu

## 指定软件仓库的镜像源

系统中默认的镜像源可能访问不到, 需要手动修改镜像源.

1. 备份原镜像源配置文件: ```cp /etc/apt/sources.list /etc/apt/sources.list.bak```;
2. 修改镜像源配置文件: ```vi /etc/apt/sources.list```
```
# 默认注释了源码镜像以提高 apt update 速度，如有需要可自行取消注释
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-updates main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-backports main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-backports main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-security main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-security main restricted universe multiverse

# 预发布软件源，不建议启用
# deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-proposed main restricted universe multiverse
# deb-src https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-proposed main restricted universe multiverse
```
3. 更新软件中心```sudo apt-get update```(如果执行失败, 尝试把https改为http试试)
4. 更新本地软件```sudo apt-get upgrade```
5. 完成.

## java安装

1. 执行```sudo apt update```;
2. 执行```sudo apt install openjdk-11-jdk```;
3. 验证```java -version```;
4. 完成.