# Postman

## 安装

安装10.13.6或者这之前的版本吧, 这个版本之后, 都需要登录了, 不好用.

## 旧版本安装报错

使用旧版本可能会报错: `version mismatch detected`, 需要如下处理:

1. 将`C:\Users\XXX\AppData\Roaming\Postman`重命名为`C:\Users\XXX\AppData\Roaming\Postman1`
2. 卸载原来的postman
3. 安装旧版本
4. 删除升级文件`C:\Users\XXX\AppData\Local\Postman`中的`update.exe`, 防止它自动更新

## 启动白屏

环境变量中添加一个新的系统变量: `POSTMAN_DISABLE_GPU=true`

## 消耗资源过大

占用了大量的内存, CPU或者磁盘, 导致卡顿.

1. 到Postman历史页, 清除所有历史.
2. `Save Responses`禁用掉
3. 重命名:`C:\Users\<user>\AppData\Roaming\Postman\IndexedDB`