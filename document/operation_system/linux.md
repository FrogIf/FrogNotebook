# linux



## tip

* 查看是否有系统主动杀掉进程的问题:

```
egrep -i -r 'killed process' /var/log
```

> 需要有权限, 才能查看

* setsid命令

让进程运行在新的会话里, 从而成为不属于此终端的子进程. 从而实现进程后台运行.