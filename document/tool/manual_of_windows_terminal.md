# Windows Terminal使用笔记

## 常用快捷键

* alt + shift + =   --- 垂直分屏
* alt + shift + -   --- 水平分屏
* ctrl + shift + w  --- 取消分屏
* alt + shift + d   --- 垂直分屏, 复制当前panel

但是上述分屏都是打开默认的终端, 如果想要实现将当前焦点的终端进行分屏, 需要使用下面的配置覆盖原来的快捷键操作:

```json
{
    "command": {
        "action": "splitPane",
        "split": "auto",
        "splitMode": "duplicate"
    },
    "keys": "alt+shift+d"
},
{
    "command": {
        "action": "splitPane",
        "split": "horizontal",
        "splitMode": "duplicate"
    },
    "keys": "alt+shift+-"
},
{
    "command": {
        "action": "splitPane",
        "split": "vertical",
        "splitMode": "duplicate"
    },
    "keys": "alt+shift+plus"
}
```