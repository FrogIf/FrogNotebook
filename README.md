# FrogNotebook

## 计划

* GuavaCache, CoffieCache
* jvm问题排查

## 本地部署

1. 安装nginx;
2. 修改nginx配置文件:

```
    server {
        listen       80;
        server_name  localhost;

        ...

        ...


        location / {
            root   <项目根据路径>;
        }
```

3. 重启nginx.