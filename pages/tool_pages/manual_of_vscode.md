# VS Code使用笔记

## 常用插件

* Angular 8 Snippets
* Angular Files
* Angular Follow Selector
* Angular Language Service
* Debugger for Chrome
* Material Icon Theme
* Prettier
* TSLint
* VSCode Simpler Icons with angular icons
* GitLens -- 可以查看每一行代码的修改等, 很强大
* Java Extension Pack -- java开发工具包
* Git History -- Git历史查看
* Markdown PDF -- markdown导出pdf和html等

## 快捷键冲突

VS code中, 如果安装了很多插件, 可能会出现快捷键冲突, 可以这样排查, 解决:

![image](./vscode/vscode_keyboard0.png)
![image](./vscode/vscode_keyboard1.png)

就可以找到冲突的快捷键了.

**快捷键修改**

* 全局搜索 - 默认ctrl + shift + f, 改成ctrl + H
* 全局保存 - 默认是ctrl + K, ctrl + S, 改成ctrl + shift + S
* 转换为大写 - 默认没有快捷键, 搜索upper, 添加, 输入 ctrl + shift + u, 同时删除原有快捷键, 防止冲突
* 转换为小写 - 默认没有快捷键, 搜索lower, 添加, 输入 ctrl + shift + l, 同时删除原有快捷键, 防止冲突
* quick fix - 就是执行小灯泡里的建议, 默认是ctrl + .  可能会有冲突, 这时可以按习惯修改

## 使用

查看某个类的源码:
```
ctrl + P
输入#
输入要查询的类
```