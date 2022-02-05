## 概述

**特性**

* Kibana
    * 可视化分析
* Elasticsearch
* Logstash
    * 数据处理管道
        * 实时解析转换数据
        * 敏感字段排除
        * 等等...存在多个插件
* Beats
    * 轻量的数据采集器
        * FileBeat - 日志文件
        * PacketBeat - 网络数据抓包
* 日志管理
    * 1. 日志搜集
    * 2. 格式化分析
    * 3. 全文检索
    * 4. 风险告警
    * 整体流程: beats --> redis/kafka/rabbitMQ(当数据量较大时, 可以使用这些组件作为缓冲) --> logstash --> elasticsearch --> kibana
* elasticsearch&数据
    * 单独使用elasticsearch存储
    * 与数据库进行集成
        * 与现有系统集成
        * 考虑事务性
        * 数据更新频繁
* 插件
    * 分词插件
    * 其他插件
    * 手动安装

**基本概念**

* 文档
    * 可以被搜索的最小数据单元
    * 元数据
        * index_  -- 文档所属索引
        * _id -- 文档唯一id
        * _source -- 文档原始json数据
        * _score -- 在一次查询中的具体算分
* 索引
    * 一类相似文档的集合
    * index -- 逻辑概念 -- Mapping -- 文档字段定义
    * shard -- 物理概念 -- 索引中的数据被分散到多个shard上 -- setting -- 定义不同的数据分布
* 节点
* 集群
* 分片
* 倒排索引
    * 单词词典 -- 记录所有文档的单词, 记录单词到倒排列表的关联关系
    * 倒排列表 -- 倒排索引项
        * 文档id
        * 词频 -- 该单词在文档中出现的次数, 用于相关性评分
        * 位置(Position) -- 单词在文档中分词位置, 用于语句搜索
        * 偏移(Offset) -- 记录单词开始结束位置, 实现高亮显示


## doc的增删改查

* Create创建一个新的文档, 如果id存在, 会失败, 亦可以不指定id, 会自动生成id

```
PUT my_index/_create/1
{
    "user":"mine",
    "comment":"xxxx"
}
```

让系统自动生成id(注意, 这里必须是POST, 如果后面跟着id, 则可以是PUT):

```
POST my_index/_doc
{
    "user":"mine",
    "comment":"xxxx"
}
```

Index创建一个新的文档, 如果id不存在, 创建新的文档, 否则删除现有文档, 再创建新的文档, 同时版本号加1

```
PUT my_index/_doc/1
{
    "user":"mine",
    "comment":"xxxx"
}
```

* 查询一个文档, 找不到返回404

```
GET my_index/_doc/1
```

* Update文档, 文档必须已经存在, 更新志会对响应字段做增改

```
POST my_index/_update/1
{
    "doc":{
        "user":"mike",
        "comment":"you know"
    }
}
```

* Delete文档

```
DELETE my_index/_doc/1
```

```
// create document. 自动生成id
POST users/_doc
{
  "user":"Mike",
  "post_date": "2021-05-23T15:55:00",
  "message": "trying out kibana"
}

// create document. 指定id, 如果id已存在, 报错
PUT users/_doc/1?op_type=create
{
  "user":"Jack",
  "post_date": "2021-05-23T15:55:00",
  "message": "trying out ElasticSearch"
}

// 通过id获取文档
GET users/_doc/1

// index document.
PUT users/_doc/1
{
  "users":"Mike"
}

// update document
POST users/_update/1
{
  "doc":{
    "post_date": "2021-05-23T15:55:00",
    "message": "trying out ElasticSearch"
  }
}
```

* Bulk批量操作, 一次api调用对不同的索引进行操作, 支持四种类型操作: index, create, update, delete

单条失败不会影响其他操作

```
POST _bulk
{ "index": { "_index":"test","_id":"1" } }
{ "field1":"value1" }
{ "delete":{ "_index":"test", "_id":"2"} }
{ "create":{ "_index": "test2", "_id":"3" } }
{ "field1":"value3" }
{ "update":{ "_id":"1", "_index":"test" } }
{ "doc":{ "field2":"value2" } }
```

* mget批量读取

```
GET _mget
{
  "docs":[
      {
        "_index":"test",
        "_id":1
      },
      {
        "_index": "test",
        "_id":2
      }
    ]
}
```

* msearch

```
POST test/_msearch
{}
{"query":{"match_all":{}}, "size":1}
{"index":"test2"}
{"query":{"match_all":{}}}
```

## 分词

* Analysis
    * 文本分析, 把全文本转换为一系列单词的过程, 也叫分词
    * 分词器(Analyzer)
        * CharacterFilters -- 针对原始文本处理 -- 去除html等
        * Tokenizer -- 按照规则切分单词
        * TokenFilter -- 将切分的单词进行加工
            * 转小写
            * 删除stop word
            * 增加同义词
    * Analyzer实例
        * Standard Analyzer
            * Tokenizer
                * standard -- 按词切分
            * TokenFilters
                * Standard
                * LowerCase -- 小写处理
                * Stop(默认关闭) -- 停用词
        * Simple Analyzer
            * Tokenizer
                * LowerCase -- 按照非字母切分, 非字母都被去除, 小写处理
        * Whitespace Analyzer
            * Tokenizer
                * whitespace -- 按照空格切分
        * Stop Analyzer
            * Tokenizer
                * LowerCase -- 按照非字母切分, 非字母都被去除, 小写处理
            * TokenFilters
                * Stop -- 删除停用词
        * Keyword Analyzer
            * Tokenizer
                * keyword -- 不分词, 直接将输入当做term输出
        * Pattern Analyzer
            * Tokenizer
                * Pattern -- 通过正则进行分词, 默认是\w+正则
            * TokenFilters
                * LowerCase -- 小写处理
        * English Analyzer
        * ICU Analyzer

```
# 直接指定analyzer进行测试
GET /_analyze
{
  "analyzer": "standard",
  "text":"Mastering ElasticSearch, elastissearch in Action"
}

# 指定索引字段, 自动根据该字段的分词器进行测试
POST users/_analyze
{
  "field":"message",
  "text": "Mastering ElasticSearch"
}

# 自定义分词器进行测试
POST /_analyze
{
  "tokenizer": "standard",
  "filter": ["lowercase"],
  "text": "Mastering ElasticSearch"
}
```

```
# standard analyzer
GET _analyze
{
  "analyzer": "standard",
  "text": "2 running Quick brown-foxes leap over lazy dogs in the summer evening"
}

# simple analyzer
GET _analyze
{
  "analyzer": "simple",
  "text": "2 running Quick brown-foxes leap over lazy dogs in the summer evening"
}

# whitespace analyzer
GET _analyze
{
  "analyzer": "whitespace",
  "text": "2 running Quick brown-foxes leap over lazy dogs in the summer evening"
}


# stop analyzer 
GET _analyze
{
  "analyzer": "stop",
  "text": "2 running Quick brown-foxes leap over lazy dogs in the summer evening"
}

# keyword analyzer 
GET _analyze
{
  "analyzer": "keyword",
  "text": "2 running Quick brown-foxes leap over lazy dogs in the summer evening"
}

# pattern analyzer 
GET _analyze
{
  "analyzer": "pattern",
  "text": "2 running Quick brown-foxes leap over lazy dogs in the summer evening"
}

# english analyzer 
GET _analyze
{
  "analyzer": "english",
  "text": "2 running Quick brown-foxes leap over lazy dogs in the summer evening"
}

# standard analyzer 对中文处理
GET _analyze
{
  "analyzer": "standard",
  "text":"他说的的确在理"
}

# icu analyzer 对中文处理
GET _analyze
{
  "analyzer": "icu_analyzer",
  "text":"他说的的确在理"
}
```

```
# 去除html标签, 不分词
POST _analyze
{
  "char_filter": ["html_strip"],
  "tokenizer": "keyword",
  "text": "<b>hello world</b>"
}

# 使用character filter进行替换
POST _analyze
{
  "char_filter": [
    {
      "type": "mapping",
      "mappings": ["- => _"]
    }
  ],
  "tokenizer": "standard",
  "text": "123-456, I-test! test-900 650-234-2733"
}

# character filter表情替换
POST _analyze
{
  "char_filter": [
    {
      "type": "mapping",
      "mappings": [":) => happy", ":( => sad"]
    }
  ],
  "tokenizer": "standard",
  "text": [
    "I am felling :)",
    "Feeling :( today"
  ]
}

# 正则character filter
POST _analyze
{
  "char_filter": [
    {
      "type": "pattern_replace",
      "pattern": "http://(.*)",
      "replacement": "$1"
    }
  ],
  "tokenizer": "standard",
  "text": "http://www.elastic.com"
}

# 按照文件路径进行分词
POST _analyze
{
  "tokenizer": "path_hierarchy",
  "text": "/user/ymruan/a/b/c/d/e"
}

# 分词, 去除停用词
POST _analyze
{
  "tokenizer": "whitespace",
  "filter": ["stop"],
  "text": "The rain in Spain falls mainly on the plain."
}

# 分词, 转小写, 去除停用词
POST _analyze
{
  "tokenizer": "whitespace",
  "filter": ["lowercase", "stop"],
  "text": "The rain in Spain falls mainly on the plain."
}
```

```
# 为索引指定自定义分词
PUT my_index
{
  "settings":{
    "analysis": {
      "analyzer": {
        "my_customer_analyzer": {
          "type": "custom",
          "char_filter":[
            "emoticons"
          ],
          "tokenizer": "punctuation",
          "filter": [
            "lowercase",
            "english_stop"
          ]
        }
      },
      "tokenizer": {
        "punctuation":{
          "type": "pattern",
          "pattern": "[ .,!?]"
        }
      },
      "char_filter": {
        "emoticons": {
          "type": "mapping",
          "mappings": [
            ":) => happy",
            ":( => sad"
          ]
        }
      },
      "filter": {
        "english_stop":{
          "type": "stop",
          "stopwords": "_english_"
        }
      }
    }
  }
}

POST my_index/_analyze
{
  "analyzer": "my_customer_analyzer",
  "text": "I'm a :) person, and you?"
}
```

## Mapping

* 定义索引中字段的名称
* 定义字段的数据类型
    * 简单类型
        * Text/Keyword
        * Date
        * Integer/Floating
        * Boolean
        * IPv4/IPv6
    * 复杂类型
        * 对象类型/嵌套类型
    * 特殊类型
        * geo\_point & geo\_shape / percolator
* 字段, 倒排索引的相关配置(Analyzed or Not Analyzed, Analyzer)
* Dynamic Mapping
* 是否允许更改Mapping字段的类型
    * 新增字段
        * Dynamic设置为true时, 一旦有新增字段写入文档, Mapping也同时给更新
        * Dynamic设置为false时, Mapping不会被更新, 新增字段的数据无法被索引, 但是信息会出现在_source中
        * Dynamic设置为Strict, 文档写入失败
    * 对于已有字段, 一旦已经有数据写入, 就不在支持修改字段定义
    * 如果希望修改字段类型, 必须ReindexAPI重建索引

```
PUT mapping_test/_doc/1
{
  "firstName":"Chan",
  "lastName":"Jackie",
  "loginDate":"2021-05-24T20:43:00.103Z"
}

GET mapping_test/_mapping

DELETE mapping_test

PUT mapping_test/_doc/1
{
  "uid":"123",
  "isVip":false,
  "isAdmin":"true",
  "age":19,
  "heigh":180
}

GET mapping_test/_doc/1

GET mapping_test/_mapping

PUT dynamic_mapping_test/_doc/1
{
  "newField":"someValue"
}

POST dynamic_mapping_test/_search
{
  "query":{
    "match":{
      "newField":"someValue"
    }
  }
}

PUT dynamic_mapping_test/_mapping
{
  "dynamic":false
}

PUT dynamic_mapping_test/_doc/10
{
  "anotherField":"someValue"
}

GET dynamic_mapping_test/_mapping

PUT dynamic_mapping_test/_mapping
{
  "dynamic":"strict"
}

PUT dynamic_mapping_test/_doc/11
{
  "lastField":"value"
}

DELETE dynamic_mapping_test
```

手动指定mapping

```
DELETE users

# 指定mobile字段不被索引
PUT users
{
  "mappings": {
    "properties": {
      "firstName":{
        "type":"text"
      },
      "lastName":{
        "type":"text"
      },
      "mobile":{
        "type":"text",
        "index": false
      }
    }
  }
}

PUT users/_doc/1
{
  "firstName":"Ruan",
  "lastName":"Yiming",
  "mobile":"12345678"
}

POST users/_search
{
  "query": {
    "match":{
      "mobile":"12345678"
    }
  }
}

DELETE users

# 空值设置
PUT users
{
  "mappings": {
    "properties": {
      "firstName":{
        "type":"text"
      },
      "lastName":{
        "type":"text"
      },
      "mobile":{
        "type":"keyword",
        "null_value": "NULL"
      }
    }
  }
}

PUT users/_doc/1
{
  "firstName":"Ruan",
  "lastName":"Yiming",
  "mobile":null
}

POST users/_search
{
  "query": {
    "match":{
      "mobile":"NULL"
    }
  }
}

DELETE users

# copy to 
PUT users
{
  "mappings": {
    "properties": {
      "firstName":{
        "type":"text",
        "copy_to": "fullName"
      },
      "lastName":{
        "type":"text",
        "copy_to": "fullName"
      }
    }
  }
}

PUT users/_doc/1
{
  "firstName":"Ruan",
  "lastName":"Yiming"
}

POST users/_search
{
  "query":{
    "match":{
      "fullName":{
        "query":"Ruan Yiming",
        "operator": "and"
      }
    }
  }
}


# 数组类型
PUT users/_doc/1
{
  "name":"onebird",
  "insterests":"reading"
}

POST users/_search
{
  "query":{
    "match_all": {}
  }
}

PUT users/_doc/1
{
  "name":"twobirds",
  "insterests":["reading", "music"]
}

GET users/_mapping
```

## 多字段特性

可以为一个字段增加一个子字段, 默认情况下, es会为text字段增加一个keyword字段.

* ExactValue
    * 包括数字/日期/具体的一个字符串
    * 对应ES中的keyword
    * 精确匹配, 没有必要做分词处理
* FullText
    * 全文本, 非结构化的文本数据
    * 对应ES中的Text
    * 需要支持模糊查询, 需要分词

```
PUT products
{
  "mappings": {
    "properties": {
      "company":{
        "type":"text",
        "fields": {
          "keyword":{
            "type": "keyword",
            "ignore_above": 256
          }
        }
      },
      "comment":{
        "type": "text",
        "fields": {
          "english_comment":{
            "type": "text",
            "analyzer": "english",
            "search_analyzer": "english"
          }
        }
      }
    }
  }
}
```

## IndexTemplate和DynamicTemplate

* index template
    * 作用的对象是一系列索引
    * 帮助设置mappings和settings, 并按照一定的规则, 自动匹配到新创建的索引之上
    * 模板仅在一个索引被新创建时, 才会产生作用. 修改模板, 不会影响已创建的索引
    * 可以设定多个Index template, 这些设置会被merge到一起
    * 可以指定order数值, 控制merge的过程
    * 工作方式:
        1. 应用es默认的settings和mappings
        2. 应用order数值低的index template, 覆盖上述的
        3. 应用order数值高的index template, 覆盖上述的
        4. 应用创建索引时所指定的settings和mappings, 覆盖上述的

```
# 使用es默认设置
PUT ttemplate/_doc/1
{
  "someNumber": "1",
  "someDate": "2019/01/01"
}

GET ttemplate/_mapping

# 设置一个全匹配的默认template
PUT _template/template_default
{
  "index_patterns": ["*"],
  "order": 0,
  "version": 1,
  "settings":{
    "number_of_shards":1,
    "number_of_replicas": 1
  }
}

# 设置一个匹配test开头index的template, 关掉日期探测
PUT _template/template_test
{
  "index_patterns": ["test*"],
  "order": 1,
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 2
  },
  "mappings": {
    "date_detection": false,
    "numeric_detection": true
  }
}

# 查看template
GET _template/template_default
GET _template/template*.kibana_task_manager

PUT testtemplate/_doc/1
{
  "someNumber": "1",
  "someDate": "2021/06/12"
}

GET testtemplate/_mapping
GET testtemplate/_settings

# 索引中指定了settings
PUT testmy
{
  "settings": {
    "number_of_replicas": 5
  }
}

PUT testmy/_doc/1
{
  "key": "value"
}

GET testmy/_settings
```

* DynamicTemplate
    * 作用的对象是指定的索引的字段
    * 结合字段名称, 动态设定字段类型

```
DELETE my_index

# 创建索引的时候, 设置dynamic template
PUT my_index
{
  "mappings":{
    "dynamic_templates":[
      {
        "strings_as_boolean":{
          "match_mapping_type":"string",
          "match":"is*",
          "mapping":{
            "type":"boolean"
          }
        }
      },{
        "string_as_keywords":{
          "match_mapping_type":"string",
          "mapping":{
            "type":"keyword"
          }
        }
      }
    ]
  }
}

PUT my_index/_doc/1
{
  "firstName": "Frog",
  "isVIP": "true"
}

GET my_index/_mapping

DELETE my_index

# 再次演示
PUT my_index
{
  "mappings": {
    "dynamic_templates":[
      {
        "full_name": {
          "path_match": "name.*",
          "path_unmatch": "*.middle",
          "mapping": {
            "type": "text",
            "copy_to": "full_name"
          }
        }
      }
    ]
  }
}

PUT my_index/_doc/1
{
  "name": {
    "first": "John",
    "middle": "Winston",
    "last": "Lennon"
  }
}

POST my_index/_search
{
  "query":{
    "match": {
      "full_name": "John"
    }
  }
}
```

## 查询

* URI Search
* RequestBodySearch

```
# 查询
POST kibana_sample_data_ecommerce/_search
{
  "_source": ["customer_full_name", "day_of_week"], 
  "sort":[{"order_date":"desc"}],
  "query":{
    "match_all": {}
  },
  "from":10,
  "size":10
}

# 脚本字段
POST kibana_sample_data_ecommerce/_search
{
  "script_fields": {
    "new_field": {
      "script": {
        "lang":"painless",
        "source": "doc['order_date'].value+'_hello'"
      }
    }
  },
  "query":{
    "match_all": {}
  }
}

# match
POST movies/_search
{
  "query":{
    "match":{
      "title":{
        // or的关系
        "query":"Last Christmas"
      }
    }
  }
}

POST movies/_search
{
  "query":{
    "match":{
      "title":{
        "query":"Last Christmas",
        "operator": "and"
      }
    }
  }
}

POST movies/_search
{
  "query":{
    "match_phrase": {
      "title": {
        "query":"one love",
        "slop": 1
        // 默认严格匹配one love, 加上slop后, 允许中间存在1个其他词
      }
    }
  }
}
```

> match中terms之间是or的关系, match_phrase中terms之间是and的关系, 并且term之间位置也会影响搜索结果

**term query**
```
DELETE products

PUT products
{
  "settings": {
    "number_of_shards": 1
  }
}

PUT /products/_bulk
{ "index" : {"_id" : 1 } }
{ "productId" : "XHAR-A-1234-#EI", "desc": "iPhone"}
{ "index" : {"_id" : 2 } }
{ "productId" : "JSDK-B-2349-#OP", "desc": "iPad"}
{ "index" : {"_id" : 3 } }
{ "productId" : "QWUI-C-8907-#AK", "desc": "MBP"}

# 执行后, 可以发现, productId和desc均为text类型, 并且都存在keyword子类型
GET /products

# 查询不到任何东西, term查询, 查询条件不做任何处理, 但是, 索引的时候, 会对数据进行分词处理, 即转为小写
POST products/_search
{
  "query":{
    "term":{
      "desc":"iPhone"
    }
  }
}

# 可以查询到数据
POST products/_search
{
  "query":{
    "term":{
      "desc":"iphone"
    }
  }
}

# 什么也查不到, 因为索引数据时, 对productId进行了分词处理
POST products/_search
{
  "query":{
    "term":{
      "productId": "XHAR-A-1234-#EI"
    }
  }
}

# 可以查到数据
POST products/_search
{
  "query":{
    "term":{
      "productId": "xhar"
    }
  }
}

# 可以查询到数据
POST products/_search
{
  "query":{
    "term":{
      "productId.keyword": "XHAR-A-1234-#EI"
    }
  }
}

# 跳过算分
POST products/_search
{
  "query":{
    "constant_score": {
      "filter": {
        "term":{
          "productId.keyword": "XHAR-A-1234-#EI"
        }
      }
    }
  }
}
```

**全文本查询**

```
# 返回了包含Matrix或者reloaded的所有文档
POST movies/_search
{
  "query":{
    "match":{
      "title":{
        "query": "Matrix reloaded"
      }
    }
  }
}

# 对上面的查询进行精确的匹配, 这样就只返回一条了
POST movies/_search
{
  "query":{
    "match":{
      "title":{
        "query": "Matrix reloaded",
        "operator": "AND"
      }
    }
  }
}

# 对上面的查询进行精确的匹配, 指示至少匹配两个term
POST movies/_search
{
  "query":{
    "match":{
      "title":{
        "query": "Matrix reloaded",
        "minimum_should_match": 2
      }
    }
  }
}

# match_phrase直接就能精确查询, 因为这里默认terms之间是and
POST movies/_search
{
  "query":{
    "match_phrase": {
      "title": {
        "query": "Matrix reloaded"
      }
    }
  }
}

# 通过slop, 允许两个term之间存在一个其他词
POST movies/_search
{
  "query":{
    "match_phrase": {
      "title": {
        "query": "Matrix reloaded",
        "slop": 1
      }
    }
  }
}
```

* query string

```
PUT users/_doc/2
{
  "name":"Frog If",
  "about": "World"
}

POST users/_search
{
  "query":{
    "query_string":{
      "default_field": "name",
      "query":"Frog AND IF"
    }
  }
}

POST users/_search
{
  "query":{
    "query_string":{
      "fields": ["name", "about"],
      "query": "(Frog AND IF) OR World"
    }
  }
}

# simple query string operator默认是or
POST users/_search
{
  "query":{
    "simple_query_string":{
      "fields": ["name"],
      "query":"Frog AND HH"
    }
  }
}

POST users/_search
{
  "query":{
    "simple_query_string":{
      "fields": ["name"],
      "query":"Frog HH",
      "default_operator": "AND"
    }
  }
}
```

**结构化搜索**

```
DELETE products

POST products/_bulk
{ "index" : { "_id" : 1 }}
{ "price" : 10, "available" : true, "date" : "2018-01-01", "productId" : "AFDS-A-1234-#SJ"}
{ "index" : { "_id" : 2 }}
{ "price" : 20, "available" : true, "date" : "2019-01-01", "productId" : "KDEF-B-2345-#AK"}
{ "index" : { "_id" : 3 }}
{ "price" : 30, "available" : true, "productId" : "AKDS-C-4567-#EK"}
{ "index" : { "_id" : 4 }}
{ "price" : 40, "available" : true, "productId" : "QQPX-D-4839-#IO"}

# 发现都被索引为正确的类型: boolean, date, long, text
GET products/_mapping

# 对boolean值进行查询
POST products/_search
{
  "query":{
    "term": {
      "available" : {
        "value": "true"
      }
    }
  }
}

# 跳过算分
POST products/_search
{
  "query":{
    "constant_score": {
      "filter": {
        "term": {
          "available" : {
            "value": "true"
          }
        }
      }
    }
  }
}

# 数字的搜索 -- range
POST products/_search
{
  "query":{
    "constant_score": {
      "filter": {
        "range": {
          "price": {
            "gte": 20,
            "lte": 30
          }
        }
      }
    }
  }
}

# 日期range查询
# y - 年; M - 月; w - 周; d - 天; H/h - 小时; m - 分钟; s - 秒
POST products/_search
{
  "query":{
    "constant_score": {
      "filter": {
        "range": {
          "date": {
            "gte": "now-1y"
          }
        }
      }
    }
  }
}

# 通过exists查询包含不包含, 查询存在date字段的文档
POST products/_search
{
  "query":{
    "constant_score": {
      "filter": {
        "exists": {
          "field": "date"
        }
      }
    }
  }
}


# 处理多值字段演示数据
POST movies_kk/_bulk
{ "index" : { "_id" : 1 } }
{ "title" : "Father of the Bridge Part II", "year" : 1995, "genre" : "Comedy"}
{ "index" : { "_id" : 2 } }
{ "title" : "Dave", "year" : 1993, "genre" : ["Comedy", "Romance"]}

GET movies_kk/_mapping

POST movies_kk/_search
{
  "query":{
    "term":{
      "genre.keyword" : "Comedy"
    }
  }
}
```

**聚合分析**

* 分类
    * BucketAggregation - 一些列满足特定条件的文档集合
        * SQL查询是, Group By xxx, 这里的xxx就可以理解为一个bucket
    * MetricAggregation - 一些数学运算, 可以对文档字段进行统计分析
        * 基于数据集计算结果, 支持在字段上进行计算, 支持脚本计算
        * 输出单一值: min/max/avg/sum/cardinality
        * 输出多值: stats/percentiles/percentile_ranks
    * PipelineAggregation - 对其他的聚合结果进行二次分析
    * MatrixAggregation - 支持对多个字段的操作并提供结果矩阵


## 搜索相关性和相关性算分

相关性(Relevance) - 描述一个文档和查询语句匹配的程度. ES会对每个匹配查询条件的结果进行算分(_score); 打分的本质是排序, 需要把最符合用户需求的文档排在前面. ES5之前采用IF-IDF算法进行算分, 现在, 采用BM25算法.

* TF(Term Frequency) - 词频, 检索词在一篇文档中出现的频率
    * 检索词出现的次数除以文档的总字数
* 度量一条查询和结果文档相关性的简单方法: 假设有多个查询条件, 简单的将每个条件的词频相加
* stop word, 类似'的'之类的词, 应该作为停用词, 不计入算分
* DF(Document Frequency) - 检索词在所有文档中出现的频率
* IDF(Inverse Document Frequency) - 通俗地说 = log(全部文档数/检索词出现过的文档总数), 检索词出现的次数越少, 越稀有, 如果匹配到, 则它在算分时权重越大
* 基本的TF-IDF算法: ```TF(检索词1)*IDF(检索词1)+TF(检索词2)*IDF(检索词2)+...```
* lucene中的TF-IDF: 很复杂, 大概是这样: ```TF(检索词1)*IDF(检索词1)*boost(检索词1)*norm(检索词1)+TF(检索词2)*IDF(检索词2)*boost(检索词2)*norm(检索词2)+...```
    * boost - 手动指定的值, 用于自定义算分提升
    * norm - 文档越短, 相关性越高
* BM25算法 - 解决了TF-IDF的一个问题 - 当TF无限增加时, _score会无限增长

```
PUT testscore/_bulk
{ "index": {"_id":1}}
{ "content" : "we use Elasticsearch to power the search" }
{ "index": {"_id":2}}
{ "content" : "we like elasticsearch" }
{ "index": {"_id":3}}
{ "content" : "The scoring of documents is caculated by the socring formula" }
{ "index": {"_id":4}}
{ "content" : "you know, for search" }

# 加入explain, 可以显示查询过程中的算分, 这里文档2短, 所以文档2算分高
POST testscore/_search
{
  "explain": true,
  "query":{
    "match":{
      "content" : "elasticsearch"
    }
  }
}

# 通过boost影响算分结果, 由于存在like, 原来应该分数更高的doc反倒降低了
POST testscore/_search
{
  "query":{
    "boosting": {
      "positive": {
        "term":{
          "content": "elasticsearch"
        }
      },
      "negative": {
        "term":{
          "content": "like"
        }
      },
      "negative_boost": 0.2
    }
  }
}
```


**多字段查询**

* bool查询
    * 支持四种子句:
        * must: 必须匹配, 贡献算分
        * should: 选择性匹配, 贡献算分
        * must_not: 必须不包含, 不贡献算分
        * filter: 必须匹配, 不贡献算分

```
POST products/_search
{
  "query":{
    "bool": {
      "must":[
        {
          "term":{
            "price": "30"
          }
        }
      ],
      "filter":[
        {
          "term":{
            "available": "true"
          }
        }
      ],
      "must_not":[
        {
          "range":{
            "price":{
              "lte": 10
            }
          }
        }
      ],
      "should": [
        { 
          "term" : { 
            "productId.keyword": "AKDS-C-4567-#EK"
          } 
        },
        {
          "term" : {
            "productId.keyword": "sfjkasjflsjklfj"
          }
        }
      ]
    }
  }
}


POST newmovies/_bulk
{ "index": { "_id" : 1 } }
{ "title": "Father of the Bridge Part II", "year" : 1995, "genre" : "Comedy", "genre_count" : 1 }
{ "index": { "_id" : 2 } }
{ "title": "Dave", "year" : 1993, "genre" : ["Comedy", "Romance"], "genre_count" : 2 }

# 精确查询只有Comedy的
POST newmovies/_search
{
  "query":{
    "bool":{
      "must":[
        {
          "term" : {
            "genre.keyword" : "Comedy"
          }
        },{
          "term" : {
            "genre_count" : 1
          }
        }
      ]
    }
  }
}

# 同上, 同时不算分
POST newmovies/_search
{
  "query":{
    "bool":{
      "filter":[
        {
          "term" : {
            "genre.keyword" : "Comedy"
          }
        },{
          "term" : {
            "genre_count" : 1
          }
        }
      ]
    }
  }
}

# bool嵌套
POST products/_search
{
  "query":{
    "bool": {
      "must":{
        "term":{
          "price" : 30
        }
      },
      "should": [
        {
          "bool": {
            "must_not": [
              {
                "term": {
                  "available": {
                    "value": "false"
                  }
                }
              }
            ]
          }
        }
      ]
    }
  }
}

# 嵌套中, 同一级具有相同的权重, 通过嵌套bool, 可以改变算分的结果
POST animals/_bulk
{ "index" : { "_id" : 1 } }
{ "text" : "there are a red dog, run very fast."}
{ "index" : { "_id" : 2 } }
{ "text" : "there are a brown dog, run very slow."}
{ "index" : { "_id" : 3 } }
{ "text" : "there are a brown cat."}

POST animals/_search
{
  "query":{
    "bool": {
      "should": [
        { "term" : { "text": "brown" } },
        { "term" : { "text": "red" } },
        { "term" : { "text": "fast" } },
        { "term" : { "text": "dog" } }
      ]
    }
  }
}

POST animals/_search
{
  "query":{
    "bool": {
      "should": [
        { "term" : { "text": "fast" } },
        { "term" : { "text": "dog" } },
        {
          "bool": {
            "should": [
                { "term" : { "text": "brown" } },
                { "term" : { "text": "red" } }
            ]
          }
        }
      ]
    }
  }
}

# 通过boost影响算分的演示
POST blogs/_bulk
{ "index" : { "_id" : 1 } }
{ "title" : "Apple iPad", "content" : "Apple iPad, Apple iPad" }
{ "index" : { "_id" : 2 } }
{ "title" : "Apple iPad, Apple iPad", "content" : "Apple iPad" }

POST blogs/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "title": {
              "query": "apple, ipad",
              "boost": 1.1
            }
          }
        },
        {
          "match": {
            "content": {
              "query" : "apple, ipad",
              "boost": 1
            }
          }
        }
      ]
    }
  }
}

POST blogs/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "match": {
            "title": {
              "query": "apple, ipad",
              "boost": 1.1
            }
          }
        },
        {
          "match": {
            "content": {
              "query" : "apple, ipad",
              "boost": 2
            }
          }
        }
      ]
    }
  }
}

# 查询, 要求苹果公司的产品优先
POST news/_bulk
{ "index" : { "_id" : 1 } }
{ "content" : "Apple Mac" }
{ "index" : { "_id" : 2 } }
{ "content" : "Apple iPad" }
{ "index" : { "_id" : 3 } }
{ "content" : "Apple Employee like Apple Pie and Apple Juice" }

POST news/_search
{
  "query":{
    "match": {
      "content": "apple"
    }
  }
}

POST news/_search
{
  "query":{
    "bool": {
      "must": [
        {
          "match": {
            "content": "apple"
          }
        }
      ],
      "must_not": [
        {
          "match": {
            "content": "pie"
          }
        }
      ]
    }
  }
}

# pie依旧能查询出来, 但是排在最后
POST news/_search
{
  "query":{
    "boosting": {
      "positive": {
        "match": {
          "content": "apple"
        }
      },
      "negative": {
        "match": {
          "content": "pie"
        }
      },
      "negative_boost": 0.5
    }
  }
}
```

**单字符串多字段查询**

* Disjunction Max Query

```
PUT blogs/_bulk
{ "index" : { "_id" : 1 } }
{ "title" : "Quick brown rabbits", "body" : "Brown rabbits are commonly seen." }
{ "index" : { "_id" : 2} }
{ "title" : "Keeping pets healthy", "body" : "My quick brown fox eats rabbits on a regular basis." }

# 这样查询出来的, 1算分更高, 但是显然2更符合需求, 这是因为should查询, 会将多个子查询的算分结果相加, 导致算分不符合预期
POST blogs/_search
{
  "query": {
    "bool":{
      "should": [
        {
          "match": {
            "title": "Brown fox"
          }
        },
        {
          "match": {
            "body": "Brown fox"
          }
        }
      ]
    }
  }
}

# 使用disjunction max query, 采用字段上算分的最大值作为最终评分, 而不是加和
POST blogs/_search
{
  "query": {
    "dis_max":{
      "queries": [
        {
          "match": {
            "title": "Brown fox"
          }
        },
        {
          "match": {
            "body": "Brown fox"
          }
        }
      ]
    }
  }
}

# 执行结果中, 两篇文档的算分相同, 虽然文档2中既有pets又有quick
POST blogs/_search
{
  "query": {
    "dis_max":{
      "queries": [
        {
          "match": {
            "title": "quick pets"
          }
        },
        {
          "match": {
            "body": "quick pets"
          }
        }
      ]
    }
  }
}

# tie_breaker的作用: max(_score) + _other_score * tie_breaker, 最终使得文档2的算分更高
POST blogs/_search
{
  "query": {
    "dis_max":{
      "queries": [
        {
          "match": {
            "title": "quick pets"
          }
        },
        {
          "match": {
            "body": "quick pets"
          }
        }
      ],
      "tie_breaker": 0.1
    }
  }
}
```

**Multi Match**

单字符串多字段搜索的三种场景:

 * 最佳字段(Best Fields): 字段之间互相竞争, 有互相关联. 评分来自最高分字段.
 * 多数字段(Most Fields): 匹配的字段越多越好
 * 混合字段(Cross Field): 单字段作为整体的一部分, 希望在任何这些列出的字段中, 找到尽可能多的词
 
```
# 用multi match实现dis_max相同的功能
POST blogs/_search
{
  "query":{
    "multi_match": {
      "type": "best_fields", 
      "query": "quick pets",
      "fields": ["title", "body"],
      "tie_breaker": 0.2,
      "minimum_should_match": "20%"
    }
  }
}

PUT titles
{
  "mappings": {
    "properties": {
      "title":{
        "type": "text",
        "analyzer": "english"
      }
    }
  }
}

POST titles/_bulk
{ "index" : { "_id" : 1 } }
{ "title" : "My dogs barks" }
{ "index" : { "_id" : 2 } }
{ "title" : "I see a lot of barking dogs on the road." }

# 预期第二篇文档的算分更高, 实际结果是第一篇文档算分更高, 这是因为第一个文档更短, 权重更高, 算分也就更高
POST titles/_search
{
  "query" : {
    "match": {
      "title": "barking dogs"
    }
  }
}

DELETE titles

# english分词器, 会对单词进行处理, 比如时态, 单数复数等, standard分词器, 不会做这些处理
PUT titles
{
  "mappings": {
    "properties": {
      "title":{
        "type": "text",
        "analyzer": "english",
        "fields": {
          "std" : {
            "type" : "text",
            "analyzer" : "standard"
          }
        }
      }
    }
  }
}

POST _analyze
{
  "analyzer": "english",
  "text": [
    "My dogs barks",
    "I see a lot of barking dogs on the road."
  ]
}

POST titles/_bulk
{ "index" : { "_id" : 1 } }
{ "title" : "My dogs barks" }
{ "index" : { "_id" : 2 } }
{ "title" : "I see a lot of barking dogs on the road." }


# 匹配尽可能多的字段, 这时, 记录2的算分高于1
POST titles/_search
{
  "query":{
    "multi_match": {
      "query": "barking dogs",
      "fields": ["title", "title.std"],
      "type": "most_fields"
    }
  }
}

PUT address/_doc/1
{
  "street": "5 Poland Street",
  "city" : "London",
  "country" : "United Kingdom",
  "postcode" : "M1V 3DG"
}

# 当要求查询的term全部都需要出现在这几个字段上时, 这样搜索是搜不到的
POST address/_search
{
  "query":{
    "multi_match": {
      "query": "Poland Street M1V",
      "fields": ["street", "city", "country", "postcode"],
      "type": "most_fields",
      "operator": "and"
    }
  }
}

# 使用cross fields就可以了
POST address/_search
{
  "query":{
    "multi_match": {
      "query": "Poland Street M1V",
      "fields": ["street", "city", "country", "postcode"],
      "type": "cross_fields",
      "operator": "and"
    }
  }
}
```

**SearchTemplate**

用于解耦程序和DSL

```
# 定义一个search template搜索模板
POST _scripts/tmdb
{
  "script":{
      "lang": "mustache",
      "source": {
        "_source":[ "title^2", "overview" ],
        "size": 20,
        "query": {
          "multi_match": {
            "query": "{{q}}",
            "fields": ["title", "overview"]
          }
        }
      }
  }
}

GET _scripts/tmdb

# 使用search template
POST tmdb/_search/template
{
  "id": "tmdb",
  "params": {
    "q": "basketball with cartoon aliens"
  }
}
```

**Index Alias**

索引的别名

```
PUT movies-2019/_doc/1
{
  "name":"the matrix",
  "rating":5
}

PUT movies-2019/_doc/2
{
  "name":"Speed",
  "rating":3
}

# 对索引起别名
POST _aliases
{
  "actions": [
    {
      "add": {
        "index": "movies-2019",
        "alias": "movies-latest"
      }
    }
  ]
}

POST movies-latest/_search
{
  "query": {
    "match_all": {}
  }
}

# 定义新的别名, 只返回rating大于4的数据
POST _aliases
{
  "actions": [
    {
      "add": {
        "index": "movies-2019",
        "alias": "movies-latest-highrate",
        "filter": {
          "range": {
            "rating": {
              "gte": 4
            }
          }
        }
      }
    }
  ]
}

POST movies-latest-highrate/_search
{
  "query": {
    "match_all": {}
  }
}
```

**Function Score Query**

在查询结束后, 对每一个匹配的文档进行一系列的重新算分, 根据新生成的分数进行排序.

提供的几种默认的计算分值的函数:

* Weight: 为每篇文档设置一个简单而不被规范化的权重
* Field Value Factor: 使用该数值来修改_score, 例如将"热度"和"点赞数"作为算分的参考因素
* Random Score: 为每一个用户使用不同的, 随机算分结果
* 衰减函数: 以某个字段的值为标准, 距离某个值越近, 得分越高
* Script Score: 自定义脚本完全控制所需逻辑

使用Boost Mode

* Multiply: 算分与函数值的乘积
* Sum: 算分与函数的和
* Min/Max: 算分与函数取 最小/最大值
* Replace: 使用函数值取代算分

Max Boost可以将算分控制在一个最大值

一致性随机函数: 每个用户可以看到不同的随机排名, 但是希望同一个用户访问时, 顺序保持不变

```
DELETE blogs
PUT /blogs/_doc/1
{
  "title":   "About popularity",
  "content": "In this post we will talk about...",
  "votes":   0
}

PUT /blogs/_doc/2
{
  "title":   "About popularity",
  "content": "In this post we will talk about...",
  "votes":   100
}

PUT /blogs/_doc/3
{
  "title":   "About popularity",
  "content": "In this post we will talk about...",
  "votes":   1000000
}

# 新的算分 = 老的算分 * 投票数
POST /blogs/_search
{
  "query": {
    "function_score": {
      "query": {
        "multi_match": {
          "query": "popularity",
          "fields": ["title", "content"]
        }
      },
      "field_value_factor": {
        "field": "votes"
      }
    }
  }
}

# 新的算分 = 老的算分 * log(1 + 投票数)
POST /blogs/_search
{
  "query": {
    "function_score": {
      "query": {
        "multi_match": {
          "query": "popularity",
          "fields": ["title", "content"]
        }
      },
      "field_value_factor": {
        "field": "votes",
        "modifier": "log1p"
      }
    }
  }
}

# 新的算分 = 老的算分 * log(1 + factor * 投票数)
POST /blogs/_search
{
  "query": {
    "function_score": {
      "query": {
        "multi_match": {
          "query": "popularity",
          "fields": ["title", "content"]
        }
      },
      "field_value_factor": {
        "field": "votes",
        "modifier": "log1p",
        "factor": 0.1
      }
    }
  }
}

# 新的算分 = 老的算分 + log(1 + factor * 投票数)
# boost_mode默认是multiply, 就是上面的结果
POST /blogs/_search
{
  "query": {
    "function_score": {
      "query": {
        "multi_match": {
          "query": "popularity",
          "fields": ["title", "content"]
        }
      },
      "field_value_factor": {
        "field": "votes",
        "modifier": "log1p",
        "factor": 0.1
      },
      "boost_mode": "sum",
      "max_boost": 3
    }
  }
}

# 一致性随机函数
POST /blogs/_search
{
  "query":{
    "function_score": {
      "random_score":{
        "seed": 314159265359
      }
    }
  }
}
```

**ElasticSearch Suggest API**

ElasticSearch提供的联想词功能, 原理: 将输入的文本分解为token, 然后在索引中找到相似的term返回

共分为四种:
* Term Suggester
* Phrase Suggester
* Complete Suggester
* Context Suggester

* Term Suggester(算法: 编辑距离)
    * 几种suggest mode
        * missing - 如果索引已经存在, 就不提供建议
        * popular - 推荐出现频率更加高的词
        * always - 无论是否存在, 都提供建议
* Phrase Suggester
    * 和term suggester类似
* Complete Suggester
    * 自动完成, 速度较上两种要快, 将analyze数据编码成FST和索引放在一起, 整个加载进内存
    * 只适用于前缀查找
* Context Suggester
    * 对Complete Suggester的扩展
    * 根据上下文进行搜索(Context)
    * 两种Context
        * Category - 任意字符串
        * Geo - 地理位置

精准度和召回率:
* 精准度: completion > phrase > term
* 召回率: term > phrase > completion
* 性能: completion > phrase > term

```
DELETE articles

POST articles/_bulk
{ "index" : {} }
{ "body" : "lucene is very cool" }
{ "index" : {} }
{ "body" : "ElasticSearch build on top of lucene" }
{ "index" : {} }
{ "body" : "elastic is the company behind ELK stack" }
{ "index" : {} }
{ "body" : "ELK stack rocks" }
{ "index" : {} }
{ "body" : "elasticsearch is rock solid" }

# 使用搜索建议, 只能查出lucene的推荐, 没有rock的推荐, 这是因为mode为missing, 只有不存在, 才会提供推荐
POST /articles/_search
{
  "query":{
    "match": {
      "body": "lucen rock"
    }
  },
  "suggest": {
    "term-suggestion": {
      "text": "lucen rock",
      "term": {
        "suggest_mode": "missing",
        "field": "body"
      }
    }
  }
}

# prefix_length只是匹配的前缀长度, 默认是1, 设置为0就可以匹配出rock了
POST /articles/_search
{
  "suggest": {
    "term-suggestion": {
      "text": "lucen hock",
      "term": {
        "suggest_mode": "always",
        "field": "body",
        "sort": "frequency",
        "prefix_length": 0
      }
    }
  }
} 

POST articles/_search
{
  "suggest": {
    "my-suggestion": {
      "text": "lucne and elasticsear rock hello world",
      "phrase": {
        "field": "body",
        "max_errors": 2,
        "confidence": 0,
        "direct_generator":[
          {
            "field": "body",
            "suggest_mode": "always"
          }
        ],
        "highlight": {
          "pre_tag": "<em>",
          "post_tag": "</em>"
        }
      }
    }
  }
}
```

自动补全:

```
DELETE articles

PUT articles
{
  "mappings": {
    "properties": {
      "title_completion":{
        "type": "completion"
      }
    }
  }
}

POST articles/_bulk
{ "index" : { } }
{ "title_completion" : "lucene is very cool" }
{ "index" : { } }
{ "title_completion" : "Elasticsearch builds on top of lucene" }
{ "index" : { } }
{ "title_completion" : "Elasticsearch rocks" }
{ "index" : { } }
{ "title_completion" : "elastic is the company behind ELK stack" }
{ "index" : { } }
{ "title_completion" : "ELK stack rocks" }

POST articles/_search?pretty
{
  "size": 0,
  "suggest": {
    "article-suggester": {
      "prefix": "elk",
      "completion": {
        "field": "title_completion"
      }
    }
  }
}


PUT comments
PUT comments/_mapping
{
 "properties": {
   "comment_autocomplete":{
     "type": "completion",
     "contexts":[
       {
         "type": "category",
         "name": "comment_category"
       }
    ]
   }
 }
}

POST comments/_doc
{
  "comment" : "I love the star war movies",
  "comment_autocomplete": {
    "input" : ["star wars"],
    "contexts":{
      "comment_category": "movies"
    }
  }
}


POST comments/_doc
{
  "comment" : "Where can I find a Starbucks",
  "comment_autocomplete": {
    "input": ["starbucks"],
    "contexts" : {
      "comment_category": "coffee"
    }
  }
}

POST comments/_search
{
  "suggest": {
    "YOUR_SUGGESTION": {
      "prefix": "sta",
      "completion": {
        "field": "comment_autocomplete",
        "contexts":{
          "comment_category": "movies"
        }
      }
    }
  }
}
```

## 多语言及中文分词

* HanLp分词器:

```
./elasticsearch-plugin install https://github.com/KennFalcon/elasticsearch-analysis-hanlp/releases/download/v7.1.0/elasticsearch-analysis-hanlp-7.1.0.zip
```

* IK分词器

```
./elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v7.1.0/elasticsearch-analysis-ik-7.1.0.zip
```

* Pinyin

```
./elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-pinyin/releases/download/v7.1.0/elasticsearch-analysis-pinyin-7.1.0.zip
```

* ICU

```
./elasticsearch-plugin install https://github.com/elastic/elasticsearch-analysis-icu/archive/refs/tags/v2.7.0.zip
```

> 通过./bin/elasticsearch-plugin list查看已安装的分词器, 分词器安装完成之后, 需要重启生效

```
# hanlp: hanlp默认分词器
# hanlp_standard: 标准分词器
# hanlp_index: 索引分词器
# hanlp_nlp: NLP分词器
# hanlp_n_short: N-最短路径分词器
# hanlp_dijkstra: 最短路径分词器
# hanlp_crf: CRF分词器(1.6.6之后已弃用)
# hanlp_speed: 极速分词器
POST _analyze
{
  "analyzer": "hanlp_nlp",
  "text": "剑桥分析公司多位高管对卧底记者说, 他们确保了唐纳德·特朗普在总统大选中获胜"
}

# Pinyin
PUT /artists/
{
  "settings": {
    "analysis": {
      "analyzer": {
        "user_name_analyzer":{
          "tokenizer": "whitespace",
          "filter": "pinyin_first_letter_and_full_pinyin_filter"
        }
      },
      "filter": {
        "pinyin_first_letter_and_full_pinyin_filter":{
          "type": "pinyin",
          "keep_first_letter": true,
          "keep_full_pinyin": false,
          "keep_original": true,
          "keep_none_chinese": true,
          "limit_first_letter_length": 16,
          "lowercase": true,
          "trim_whitespace": true,
          "keep_none_chinese_in_first_letter": true
        }
      }
    }
  }
}

GET /artists/_analyze
{
  "text": ["刘德华 张学友 郭富城 黎明 四大天王"],
  "analyzer": "user_name_analyzer"
}
```

