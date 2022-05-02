# FrogNotebook

## Overview

a notebook. record something.

## 计划

* 算法-树状数组, 康托展开树状数组实现

## 本地部署

1. 安装nginx;
2. 修改nginx配置文件:

```
    server {
        listen       80;
        server_name  localhost;

        ...

        ...


        location /FrogNotebook/ { # 末尾必须要有/
            alias   <项目路径>/FrogNotebook/docs/; # 末尾必须要有/
        }
```

3. 重启nginx.

## Online

线上访问地址: [online](https://frogif.github.io/FrogNotebook/)

## Reference

* [minima](https://github.com/jekyll/minima)