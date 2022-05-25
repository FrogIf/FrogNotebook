---
title: ElasticSearch Restful API
author: frogif
date: 2022-05-23
---
# ElasticSearch Restful API

## 概述

本文主要介绍ElasticSearch增删改查相关的Restful API, 前期数据准备, 可以参考附录: [数据准备](#数据准备), 文中不会介绍ElasticSearch的一些概念, 这些概念, 可以在[这里](https://frogif.github.io/FrogNotebook/component/elasticsearch/ElasticSearchNote.html)了解.

## 增删改

* 增
  * ```PUT <index>/_create/<id>```: 根据指定的id, 插入一个新的文档, 如果id已存在, 则报错
  * ```POST <index>/_doc/<id>```: 根据指定的id, 插入一个新的文档, 如果id已存在, 则删除旧文档, 插入新文档, 文档版本加1
  * ```POST <index>/_doc```: 插入一个文档, 让系统自动生成id
* 删
  * ```DELETE <index>/_doc/<id>```: 删除指定id的文档
* 改
  * ```POST <index>/_update/<id>```: 修改指定id的文档, 如果不会删除原始文档, 而是对原始文档进行增量修改, 版本加1

示例如下:

```
示例1, 新增文档, id指定为1:
PUT frog/_create/1
{
  "name": "frog"
}

示例2, 新增文档, id自动生成:
POST frog/_doc
{
  "name": "frog2"
}

示例3, 删除指定id的文档:
DELETE frog/_doc/nzSF74AB-CY9KE2R-ICW

示例4, 修改指定id的文档:
POST frog/_update/1
{
  "doc":{
    "name": "frog3",
    "age": 99
  }
}
```

## 批量操作

为了减少反复多次请求的网络开销, 大多数时候, 可以使用批量操作. 批量操作分为两种: 1. 批量增删改; 2. 批量查询;

* ```POST _bulk```: 批量增删改, 其中一个操作失败不会影响其他操作
* ```GET _mget```: 批量查询
* ```POST _msearch```: 批量查询

```
示例1:
POST _bulk
{ "index": { "_index":"test","_id":"1" } }
{ "field1":"value1" }
{ "delete":{ "_index":"test", "_id":"2"} }
{ "create":{ "_index": "test2", "_id":"3" } }
{ "field1":"value3" }
{ "update":{ "_id":"1", "_index":"test" } }
{ "doc":{ "field2":"value2" } }

示例2:
GET _mget
{
  "docs":[
      {
        "_index":"frog",
        "_id":1
      },
      {
        "_index": "test",
        "_id":2
      }
    ]
}

示例3:
POST _msearch
{"index":"frog"}
{"query":{"match_all":{}}, "size":1}
{"index":"test2"}
{"query":{"match_all":{}}}
```

> 批量查询时, 也不要一次性发送过多的数据, 这样有可能适得其反

## 基本查询

首先有一种简单的查询, 通过id查询: ```GET <index>/_doc/<id>```; 然后, ElasticSearch提供了两种文本查询方式, 一种是URI Search, 一种是Request Body Search. URI Search就是在URL中使用查询参数进行查询, 功能比较局限, 这里不做介绍, 只介绍Request Body Search.

Request Body Search的使用POST请求, 除了请求体以外, 其余格式是很固定的:

1. ```POST <index>/_search```
2. ```POST <index1>,<index2>,.../_search```
3. ```POST <index_pattern>/_search```

首先, 给出一个典型的示例:

```
POST movies/_search
{
  "_source":["title", "year"],
  "query":{
    "match_all": {}
  },
  "from": 0,
  "size": 10,
  "sort":[
    {"year":"desc"}
  ]
}
```

接下来具体介绍一下通过指定的词句进行搜索.

* term: 对查询条件不做分词处理, 而是直接将条件去倒排索引中匹配(注意是去倒排索引中进行完整匹配, 而倒排索引中都是进行了分词的)
  * range query/exists query/prefix query/wildcard query都属于term查询
* match: 词匹配, 匹配一个或多个单词, 默认多个单词之间or关系
* match_phase: 词组匹配, 匹配整个词组
* query_string: 逻辑匹配, 匹配的内容不是简单的词或者词组, 而是存在与或非逻辑的语句, query_string完全可以替换match查询
* simple_query_string: query_string的简化版

一个查询的标准模板是这样的:

```
{
  "query":{
    "bool":{
      "must":[
        // 贡献算分
      ],
      "should":[
        // 贡献算分, 如果只有should没有must, 则这里的条件必须有一个满足, 如果存在must, 这里的条件可以都不满足
      ],
      "filter":[
        // 一系列的查询条件, 这里的条件不贡献算分
      ],
      "must_not":[
        // 取反的一些条件, 这里的条件不贡献算分
      ]
    }
  }
}
```

示例如下:

```
示例1, 单一匹配:
POST movies/_search
{
  "query":{
    "match": {
      "title":{
        "query":"War"
      }
    }
  }
}

示例2, 通过分词器分词后, 变为两个单词war,room, 然后进行匹配, 这时两个单词匹配之间是or关系
POST movies/_search
{
  "query":{
    "match": {
      "title":{
        "query":"War Room"
      }
    }
  }
}

示例3, 同上, 但是显示指定为and关系
POST movies/_search
{
  "query":{
    "match": {
      "title":{
        "query":"War Room",
        "operator":"AND"
      }
    }
  }
}

示例4, 词组匹配, 只查询存在"one love"这个词组的文档
POST movies/_search
{
  "query":{
    "match_phrase": {
      "title": {
        "query":"one love"
      }
    }
  }
}

示例5, 词组匹配, 通过配置slot, 允许"one love"这个词组的两个单词之间可以存在一个其他单词
POST movies/_search
{
  "query":{
    "match_phrase": {
      "title": {
        "query":"one love",
        "slop":1
      }
    }
  }
}

示例6, query_string, 这里查询的是"必须有war, 并且room和love至少有一个存在"
POST movies/_search
{
  "query":{
    "query_string": {
      "default_field": "title",
      "query": "war AND (room OR love)"
    }
  }
}

示例7, term查询:
POST movies/_search
{
  "query":{
    "term":{
      "title":"war"
    }
  }
}

示例8, 范围查询, 这里使用filter, 不会进行算分操作, 使得查询速度更快:
POST movies/_search
{
  "query":{
    "bool":{
      "filter":{
        "range":{
          "year":{ "gte": 2000, "lte": 2010 }
        }
      }
    }
  }
}

示例9, 多种查询复合:
POST movies/_search
{
  "query":{
    "bool":{
      "should":{
        "exists":{ "field":"vvv" }
      },
      "filter":{
        "range":{
          "year":{ "gte": 2000, "lte": 2010 }
        }
      }
    }
  }
}
```

> must和should是需要计算算分的, filter和must_not不需要算分, 这样会加速查询.

此外, 上面的查询是支持嵌套的, 例如这样:

```json
{
  "query":{
    "bool":{
      "should":{
        "bool":{
          "must":[
            { "match":{ "title":{ "query":"war" } } },
            { "match":{ "title":{ "query":"room" } } }
          ]
        }
      },
      "filter":{
        "range":{ "year":{ "gte": 2000, "lte": 2010 } }
      }
    }
  }
}
```

再介绍一下termsquery:

```
POST movies/_search
{
  "query":{
    "terms":{
      "title":[ "war","love" ]
    }
  }
}
```

## 相关性算分

相关性算分描述了一个文档和查询语句匹配的程度. es会对每个匹配的查询条件的结果进行算分_score. 打分的本质是排序, 把最符合用户需求的文档排在前面. es5之前, 默认的相关性算分采用TF-IDF, 现在采用BM 25.

TF-IDF算法采用的是TF和IDF两个指标, 计算得到相关性算分:

* TF -- Term Frequency, 上面介绍倒排索引项的时候, 已经介绍过了. 该单词在文档中出现的次数, 检索词在文档中出现的总次数/该文档的总词数
* IDF - Inverse Document Frequency, 逆文档频率. log(全部文档数/检索词出现过的文档总数)

而, 一般的TF-IDF算法就是: TF(词1)\*IDF(词1) + TF(词2)\*IDF(词2) + ...

在Lucene中的TF-IDF在上面的基础上又做了调整, 对于每一个查询的关键词: ```TF(词x) * IDF(词x) * boost(词x) * norm(词x)```, 这里面boost是在查询时指定的, 用于进行权重提升, 从而改变算分, norm的作用是文档越短, 相关性越高.

对于BM25算法对于经典TF-IDF算法进行了优化, 使得TF无限增加时, 算分趋于一个稳定的数值.

上面, 我们知道, must和should会贡献相关度算分, filter和must_not不会贡献相关度算分, 这里演示一下权重提升boost:

```
POST movies/_search
{
  "query":{
    "bool":{
      "must":[
        {
          "match": {
            "title": {
              "query": "war",
              "boost": 1.0
            }
          }
        },
        {
          "match": {
            "title": {
              "query": "room",
              "boost": 2.0
            }
          }
        }
      ]
    }
  }
}
```

## 聚合查询

聚合(aggregation)查询, 就是在查询时进行统计计算. 聚合查询分为四种:

1. Bucket Aggregation: 类似于sql中的group by
2. Metric Aggregation: 数学运算, 类似于sql中的count,sum,max...
3. Pipeline Aggregation
4. Matrix Aggregation












## Reference

* 极客时间-ElasticSearch核心技术与实战

## 附录

#### 数据准备

windows下的演示:

1. 下载数据集 https://grouplens.org/datasets/movielens/
2. 下载logstash https://www.elastic.co/cn/downloads/logstash
3. 在logstash的bin目录下增加文件```logstash.conf```:
```conf
input {
  file {
    path => ["D:/Download/ml-25m/movies.csv"]
    start_position => "beginning"
    sincedb_path => "D:/Download/ml-25m/www"
  }
}
filter {
  csv {
    separator => ","
    columns => ["id","content","genre"]
  }

  mutate {
    split => { "genre" => "|" }
    remove_field => ["path", "host","@timestamp","message"]
  }

  mutate {

    split => ["content", "("]
    add_field => { "title" => "%{[content][0]}"}
    add_field => { "year" => "%{[content][1]}"}
  }

  mutate {
    convert => {
      "year" => "integer"
    }
    strip => ["title"]
    remove_field => ["path", "host","@timestamp","message","content"]
  }

}
output {
   elasticsearch {
     hosts => "http://localhost:9200"
     index => "movies"
     document_id => "%{id}"
   }
  stdout {}
}
```
4. 执行命令
```
logstash.bat -f logstash.conf
```
5. 看到命令行输出从csv文件中读出的数据, 说明正在导入, 等待一会, 即可完成数据的导入.