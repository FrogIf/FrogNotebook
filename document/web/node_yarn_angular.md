# Angular环境搭建

## Node环境搭建

下载node [下载地址](https://nodejs.org/en/about/releases/)

然后安装, 即可.

## yarn安装

下载yarn, 安装即可.

或者使用命令安装:

```
npm install yarn -g
```


**项目中经常用到的指令**

* 安装项目的全部依赖:

```
yarn
```

```
yarn install
```

* 初始化新项目

```
yarn init
```

* 添加依赖包

```
yarn add [package]
yarn add [package]@[version]
yarn add [package]@[tag]
```

* 将依赖项添加到不同依赖项类别

```
yarn add [package] --dev
yarn add [package] --peer
yarn add [package] --optional
```

* 升级依赖包

```
yarn upgrade [package]
yarn upgrade [package]@[version]
yarn upgrade [package]@[tag]
```

* 移除依赖包

```
yarn remove [package]
```

* 查看版本信息

```
yarn --version
```

## Angular环境搭建

* 卸载

```
npm uninstall -g @angular/cli
```

* 清理缓存, 保证卸载干净

```
npm cache clean --force
```

* 检查是否卸载干净

```
ng -v
```

> 若显示command not found则卸载干净

* 安装
    - 安装制定版本:
        ```
            npm install -g @angular/cli@1.6.3
        ```
    - 安装最新版
        ```
            npm install -g @angular/cli@latest
        ```
    - 普通安装
        ```
            npm install -g @angular/cli
        ```

* 检查版本号

```
ng --version
```


* 提示: An unhandled exception occurred: Cannot find module '@angular-devkit/build-angular/package.json'

```
npm install -save-dev @angular-devkit/build-angular
```

* 创建一个新的Angular程序

```
ng new xxxx
```

* 启动程序

```
ng serve --open
```

