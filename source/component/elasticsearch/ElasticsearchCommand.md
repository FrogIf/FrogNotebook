# ElasticSearch常用命令

* 列出索引列表:

```
curl -s -u username:password http://xxxxxxx/_cat/indices?v
```

* 删除指定索引

```
curl -s -u username:password -X DELETE http://xxxxxxxx/index_name
```