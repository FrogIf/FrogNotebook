---
title: curl使用
author: frogif
date: 2022-11-10
---

# curl使用

* 普通请求: ```curl https://127.0.0.1/web/resource/resource-manage```
* 请求ipv6: ```curl -v -g -k https://[8001::33:127]/web/resource/resource-manage```
  * ```I``` - 显示响应头, 但是不显示响应内容
  * ```i``` - 显示响应头和响应体
  * ```v``` - 显示请求和响应的详细信息
  * ```g``` - ipv6支持(否则不能识别ip上的两个方括号)
  * ```k``` - https支持
* 加上请求头: ```curl -H 'Cookie: PHPSESSID=pjoe7lo74tblfdmud3vfkad423' -H 'Content-Type: application/x-www-form-urlencoded' https://192.168.102.248:443/home/index/logout/?userMark=naogbyw&token=FEc3f2d70BC54A16```
  * ```H``` - 请求头
* POST请求: ```curl -d 'name=jiefeng&code=orHX&password=MCFVwP4bc3uzvGry5rPgGJr5WM8Ln8CBgNGJ7v%2B%2Fe24%3D&pwdlen=20' -H 'Content-Type: application/x-www-form-urlencoded' -H 'Cookie: PHPSESSID=pjoe7lo74tblfdmud3vfkad423' -H 'Referer: https://192.168.102.248:443/html/webui/home.html?userMark=' -X POST -i -k --tlsv1 https://192.168.102.248:443/home/login```
  * ```d```: 请求体, 后面接请求参数, 同```--data```
  * ```X```: 指定请求方法