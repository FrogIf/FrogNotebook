---
title: ElasticSearch学习笔记
author: frogif
date: 2022-05-23
---
# ElasticSearch学习笔记

## 概述

ElasticSearch是基于lucene的全文搜索引擎. 包括ElasticSearch在内, Elastic开发了一系列的软件包, 组成了Elastic Stack, 其中主要包括:

* 数据抓取:
  * LogStash
  * Beat
* 存储/计算:
  * ElasticSearch
* 可视化:
  * Kibana

ElasticSearch+LogStash+Kibana可以组成强大的日志管理系统, 感兴趣可以了解: [ELK](https://frogif.github.io/FrogNotebook/apm/ELK.html)

es官方文档很强大, 地址在这里[https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)

文中会用到一些数据, 数据准备相关, 参见附录: [数据准备](#数据准备)

## 基本概念

逻辑概念:

* 文档(document): 可搜索的最小数据单元, 会被序列化为json格式(示例: [document示例](#document示例))
  * _index: 文档所属的索引名
  * _id: 文档的唯一ID, 可以由ElasticSearch自动生成, 也可以手动指定
  * _source: 文档的原始JSON数据
  * _version: 文档的版本信息
  * _score: 相关性打分
* 索引(index): 文档的容器, 是一类文档的集合
  * mapping: 定义文档字段的类型(示例: [mapping示例](#mapping示例))
  * setting: 定义不同的数据分布, 即一个索引需要使用多少个分片, 多少个副本(示例: [setting示例](#setting示例))

物理概念:

* 节点: 就是集群中的节点, 一个ElasticSearch实例. 一个集群中只存在一个master节点, 它负责维护集群的状态
  * Data节点: 负责保存数据, 可以水平扩展
  * Coordinate节点: 负责接收rest client请求, 然后向其他节点分发, 最后汇集结果. 每个节点默认都是Coordinate节点
  * 冷热节点: 一般常用于日志存储(ELK), 老的数据存储在配置比较低的服务器上.
* 分片: 一个分片就是一个Lucene实例, 一个节点上可以有多个分片, 一个索引的多个分片可以分布在多个节点上
  * Primary Shard(主分片): 创建索引时指定, 后续不允许修改
  * Replica Shard(副本分片): 主分片的数据拷贝, 可以动态调整, 可以承担一部分数据查询

> 分片数过多, 会影响搜索结果相关性的打分, 影响统计结果准确性; 单个节点上有过多分片, 导致资源浪费, 影响性能

小结: 索引和文档是包含关系, 索引包含文档. 节点和分片没有关系, 是两个独立的概念, 节点是硬件单元, 分片是数据单元.

## 倒排索引

上面我们知道了数据在es中是如何进行存储的, 在使用es的时候, 数据是如何被查询出来的呢? 这里就用到了倒排索引的技术. 倒排索引是指词条到文档id的索引, 这种索引方式的索引方向与一般书的目录正好相反, 称之为倒排索引.

倒排索引的核心组成:

* 单词词典(Term Dictionary): 汇总所有文档的单词, 记录单词到倒排列表的关联关系. 单词词典一般比较大, 可以通过B+数或者哈希拉链法实现, 以满足高性能的插入和查询
* 倒排列表(Posting List): 记录每个单词到文档集合的映射. 由倒排索引项组成, 一个单词映射到多个倒排索引项
  * 倒排索引项, 包含以下信息:
    * 文档id
    * 词频TF: Term Frequency, 该单词在文档中出现的次数, 检索词在文档中出现的总次数/该文档的总词数, 用于相关性评分
    * 位置: 单词在文档中分词的位置, 用于搜索多个单词组成的语句, 这时位置信息可以体现多个单词之间的相对关系
    * 偏移: 记录单词的开始/结束位置, 用于高亮显示
  
如果不进行特殊配置, ElasticSearch会对JSON文档中的每一个字段都建立倒排索引. 可以通过配置, 指定某些字段不做索引, 这样可以节省存储空间, 但是这时这个字段就不能被搜索了.

一个倒排索引项是如何建立的呢, 这就需要分词器对原始文档进行分词, 然后在计算每个词的词频, 位置, 偏移信息了.

倒排索引的不可变性:

1. 倒排索引采用的是Immutable Design, 一旦生成, 不可修改
2. 优点: 1. 不需要考虑并发写文件的问题; 2. 读入缓存的数据不存在脏数据的情况; 3. 缓存容易生成和维护/数据可以被压缩
3. 缺点: 对文档的一些变更需要reindex.

## 分词

分词(Analysis)是文本分析, 就是把全文本转换为一系列单词(term/token). 分词通过分词器来实现.

分词器由三部分组成:

* Character Filters: 对原始文本进行处理, 例如去除html标签
* Tokenizer: 按照指定的规则切分为单词
* Token Filters: 对切分得到的单词进行处理, 例如: 转小写, 删除停用词(stopwords), 增加同义词等

ElasticSearch常见分析器:

1. Standard Analyzer: 默认分词器, 按词切分, 小写处理
2. Simple Analyzer: 按照非字母切分(非字母都会被删除), 小写处理
3. Stop Analyzer: 在Simple Analyzer基础上, 增加停用词过滤(the, a, is)
4. Whitespace Analyzer: 按照空格切分, 不转小写
5. Keyword Analyzer: 不分词, 直接将输入当做term输出
6. Pattern Analyzer: 正则表达式, 默认```\W+```(非字符分割), 小写处理
7. Language: 提供了30多种常见语言的分词器
8. Customer Analyzer: 自定义分词器

常见的中文分析器:

1. icu Analyzer: 插件安装```elasticsearch-plugin install analysis-icu```
2. IK
3. THULAC

我们可以通过es内置的character filters,tokenizer,token filters, 做一个简单的自定义分词器.

内置的character filter:

* html_strip - 去除html标签
* mapping - 字符串替换
* pattern_replace - 正则匹配替换

内置的tokenizer:

* whitespace - 以空格进行分词
* standard - 以字母的方式进行切分
* uax_url_email - 以url和email的特点进行分词
* pattern - 通过正则表达式分词
* keyword - 不做任何处理
* path_hierarchy - 将多级文件路径, 拆分成多个带有继承关系的term

内置的token filter:

* lowercase - 转小写
* stop - 停用词
* synonym - 添加近义词

> 可以在创建索引时, 自定义分词器, 不做详细介绍.

## 索引定义

再来介绍一下es中如何定义索引, ElasticSearch索引的定义可分为多个维度, 分别是:

1. setting: 定义不同的数据分布, 即一个索引需要使用多少个分片, 多少个副本
2. mapping: 类似于数据库中schema的定义, 用来描述一个索引的字段名称,字段类型,倒排索引配置等
3. template: 通过模板匹配, 设置索引的setting和mapping

#### mapping

mapping又分为mapping和dynamic mapping. dynamic mapping是指在写入文档时, 如果索引不存在, 会自动创建索引. ElasticSearch会根据文档信息, 自动推断出各个字段的类型.

es中字段类型有如下:

* 简单类型
  * text: 会被分词, 用于全文查找
  * keyword: 用于精确值匹配, 不会被分词, 整体作为一项保存到倒排索引中
  * date
  * integer/floating
  * boolean
  * IPv4/IPv6
* 复杂类型
  * 对象类型/嵌套类型
* 特殊类型
  * geo\_point & geo\_shape / percolator

```
关于这些类型的一些建议:
Text: 
1. 用于全文本字段, 文本会被分词
2. 默认不支持聚合分析及排序. 需要设置fielddata为true

keyword:
1. 用于id, 枚举及不需要分词的文本. 例如: 电话号码, email地址, 手机号, 邮政编码, 性别等
2. 适用于filter(精确匹配), sorting和aggregations

es默认情况下, 会为文本类型设置成text, 同时设置一个keyword子字段

枚举类型设置为keyword, 即使是数字, 如果是枚举类型, 也应该设置成keyword, 这样可以得到更好的性能.

如果不需要被搜索, 字段的index属性应该设置成false. 但是这时依旧支持aggregation.
如果不需要排序和聚合分析, 字段的doc_values和fielddata应该设置成false.
对于更新频繁,聚合查询频繁的keyword字段, 可以 将eager_global_ordinals设置成true, 使得可以很好的利用缓存.
从节约磁盘方面考虑, 如果是指标型的数据存储, 可以把_source的enabled设置为false, 并把每个字段的store属性设置为true, 这样就不会保存原始数据了. 但是这时无法做reindex, 无法做update.

避免一个文档中过多的字段:
1. 不容易维护
2. mapping信息保存在Cluster State中, 字段过多会对集群性能有影响
```

常用命令如下:

* ```GET <index>/_mapping```: 查看一个索引的mapping信息

定义一个索引的mapping的示例:

```
PUT frog_index
{
  "mappings":{
    "properties": {
      "age":{
        "type": "integer"
      },
      "firstName":{
        "type": "text",
        "copy_to": "fullName" // firstName和lastName会结合放入fullName中, fullName不会出现在_source中
      },
      "lastName":{
        "type": "text",
        "copy_to": "fullName"
      },
      "mobile":{
        "type":"text",
        "index": false  // 指定该字段不可以被索引, 也就不进行分词, 不存储倒排索引, 这样可以减少存储空间, 提升性能
      },
      "nickname":{
        "type": "keyword",  // keyword类型的字段不会分词, 而是将整个字段值作为一个term, 也就实现了精确值查询
        "null_value": "不知道"  // keyword字段可以配置null_value属性, 指示该值没有时, 填入的默认值, 这样可以方便搜索
      }
    }
  }
}
```

配置一个索引的dynamic mapping行为:

```
PUT frog_index/_mapping
{
  "dynamic":"false"
}
```

上面的dynamic字段可以控制一个索引是否允许dynamic mapping, 它有三个可选值.

对于新增字段:

* true - 新增字段写入文档, mapping同时被更新
* false - mapping不会被更新, 新增的字段无法被查询, 但是新增的字段信息会出现在_source中
* strict - 新增字段直接导致整个文档写入失败

全局关闭dynamic mapping的设置:

```
PUT _cluster/settings
{
  "persistent":{
    "action.auto_create_index": false
  }
}

或者设置白名单:
PUT _cluster/settings
{
  "persistent":{
    "action.auto_create_index": "logstash-*,.kibana*"
  }
}
```

对于已有字段, 一旦已经写入数据, 就不能修改字段定义. 如果希望修改字段类型, 必须通过reindex重建索引.

es的mapping提供了一种"多字段特性", 可以为任意字段增加子字段. 示例如下:

```
PUT frog_index2
{
  "mappings":{
    "properties": {
      "name":{
        "type":"text",
        "fields":{
          "name_k":{
            "type":"keyword"
          }
        }
      }
    } 
  }
}
```

这时, 我们查询时, 可以查询name字段, 也可以查询name.name_k字段.

#### setting

常用命令:

* ```GET <index>/settings```: 查询指定索引的settings.

定义一个索引的setting:

```
PUT fff_index
{
  "settings": {
    "number_of_shards": 1,
    "number_of_replicas": 1
  }
}
```

#### template

ElasticSearch中有两种template, 分别是index template和dynamic template

* index template: 可以按照一定的规则, 自动的设定mapping和setting, 应用到匹配的新索引上. 常见应用场景是: 我们使用elk时, 每天会根据日期生成一个索引, 这时候, 每天生成的索引就是通过index template生成的.
* dynamic template: 应用到字段上的template, 会对匹配到的字段进行设定.

模板只会对新创建的索引起作用, 不会修改已创建的索引. 可以创建多个索引模板, 这些设置会被合并在一起. 当多个模板之间存在冲突的设定时, 通过order来控制优先级.

查询index template: ```GET _template/<template_name>```

index template创建示例:

```
PUT _template/frog_template
{
  "index_patterns": ["frog_*"],
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
```

这个template创建好之后, 所有以```frog_```开头的索引都会使用这个template.

> order越小, 越会被先执行. 后执行的配置会覆盖新执行的.

对于dynamic template, 示例如下:

```
PUT frog_vvvv_index
{
  "mappings":{
    "dynamic_templates":[
      {
        "aaa_template":{
          "match_mapping_type":"string",
          "match":"is*",
          "mapping":{
            "type":"boolean"
          }
        }
      }
    ]
  }
}
```

这里设置了一个dynamic template, 匹配所有字符串类型, 但是字段以is开头的, 另它的类型为boolean.

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
  * 需要注意的是, 如果使用match去匹配keyword类型的字段, 后台会自动转为term query.
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

## 聚合查询

聚合(aggregation)查询, 就是在查询时进行统计计算. 聚合查询分为四种:

1. Bucket Aggregation: 类似于sql中的group by
2. Metric Aggregation: 数学运算, 类似于sql中的count,sum,max...
3. Pipeline Aggregation: 对聚合结果再聚合
4. Matrix Aggregation

下面这个示例包含Bucket Aggregation,Metric Aggregation,PipelineAggregation

```
示例, 先对员工按照职位进行分组, 然后求最大值/最小值/平均值, 最后再单独列出平均值最小的职位
POST employees/_search
{
  "size": 0,
  "aggs": {
    "jobs":{
      "terms":{ // bucket aggr
        "field":"job.keyword"
      },
      "aggs":{
        "max_salary": { // metric aggr
          "max": {
            "field": "salary"
          }
        },
        "min_salary": {
          "min": {
            "field": "salary"
          }
        },
        "avg_salary": {
          "avg": {
            "field": "salary"
          }
        }
      }
    },
    "min_salary_by_job":{ // pipeline aggr
      "min_bucket": {
        "buckets_path": "jobs>avg_salary"
      }
    }
  }
}
```

> terms不能对text字段进行聚合分析, 需要对这个text字段开启fielddata

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

## filedata与doc_values

ES默认是使用算分进行排序的, 我们通过制定排序的字段, 而不通过算分排序. 这时, 排序是针对字段的原始内容, 倒排索引无法发挥作用. 需要使用正排索引, 通过文档id和字段快速得到字段原始内容. ElasticSearch有两种正排索引的实现方式:

* filedata
* doc_values: 列式存储, 对text类型无效

\ |doc values|filed data
-|-|-
何时创建|索引时,和倒排索引以创建|搜索时动态创建
创建位置|磁盘文件|java堆
优点|避免大量内存占用|索引速度快,不占用额外的磁盘空间
缺点|降低文档写入时索引速度,占用额外的磁盘空间|文档过多时, 动态开销大, 占用过多的java堆

doc_values是默认开启的, 可以通过mapping设置来关闭, 如果需要重新打开, 则需要reindex. 关闭doc_values后, 可以增加新增文档时的索引速度, 减少磁盘空间. 但是关闭doc_values之后, 该字段就不可以用来排序了.

##  集群分布式模型

* 分布式特性
  1. 优点: 存储支持水平扩容, 支持PB级数据; 提高系统可用性, 部分节点停止不影响整个集群
  2. 不同的集群通过名字来区分, 默认"elasticsearch", 通过配置文件修改或者命令行```-E cluster.name=xxx```进行设定
* 节点
  1. 每一个节点是一个ElasticSearch实例, 本质是一个java进程;
  2. 每一个节点都可以配置名字, 通过配置文件或者启动时指定```-E node.name=xxxx```
  3. 每个节点启动后, 会分配一个uid, 保存在data目录下
* Coordinating Node
  1. 处理请求的节点称为Coordinate Node
  2. 所有节点默认都是Coordinate Node, 可以通过设置, 将```node.master,node.data,node.ingest```等都配置成false,使得一个节点成为纯粹的Coordinate Node, 它自身不会有存储数据等行为
* Data Node
  1. 可以保存数据的节点, 叫做data node
  2. 节点默认都是data node节点, 可以通过```node.data: false```禁止
  3. 职责是保存分片数据, 在数据库扩展上起到重要作用(由Master Node决定如何把分片分发到数据节点)
  4. 通过增加节点数, 可以解决数据水平扩展和数据单点问题
* Master Node
  1. 处理创建/删除索引等请求; 决定分片被分配到哪个节点; 负责索引的创建和删除;
  2. 维护更新Cluster State
  3. Master Node十分重要, 部署上需要考虑解决单点问题
  4. 为一个集群设置多个Master Node/每个节点只承担MasterNode中的单一角色
* Master Eligible Nodes
  1. 一个集群可以配置多个Master Eligible节点. 在必要的时候, 这些节点可以参与选主, 成为master节点
  2. 每个节点启动后, 默认就是Master Eligible, 可以通过设置```node.master: false```禁止
  3. 集群中第一个Master Eligible节点启动时, 会将自己选举为Master节点
* Ingest Node
  1. es5.0引入的新的节点类型, 默认配置下, 每个节点都是Ingest Node.
  2. 具有预处理数据的能力, 可拦截Index和Bulk Api请求.
  3. 对数据进行转化, 重新返回给Index或Bulk Api.
  4. 具体预处理能力有:
     * 为某个字段设置默认值;
     * 重命名某个字段的字段名; 
     * 字段值进行split操作;
     * 支持Painless脚本, 对数据进行更加复杂的加工
* 集群状态
  1. 维护了集群中的必要信息: 所有节点信息; 所有索引及mapping/setting信息; 分片路由信息.
  2. 每个节点都保存了一份集群状态信息;
  3. 只有Master Node节点才能修改集群状态信息, 并同步给其他节点
* master线下后集群选主
  1. 互相Ping对方, Node id低的会成为被选举节点
  2. 新的master节点选举成功之后, 会通过存活节点的副本数据, 补齐下线的master节点中所丢失的分片
* 脑裂问题
  1. 假如有三个节点A,B,C, 由于网络问题, A和B,C之间无法连接; 所以B,C自行选举, 将B推举为Master节点; 而A节点以为自己就是一个集群, 自己把自己推举为Master节点, 这时, 集群中就存在了两个Master节点
  2. 解决方案, 限定选举条件. 设置一个quorum(quorum = master节点数/2 + 1)值, 只有master eligible节点数大于quorum, 才进行选举. 从7.0开始, 不需要自己配置, es自动完成.


es节点是可以承担不同的角色的: Master Eligible / Data / Ingest / Coordinating, 默认情况下这几个角色都是开启的. 生产环境下, 进行角色分离会有好处.

* master节点负责集群状态管理, 可以使用低配置的CPU,RAM和磁盘;
* data节点负责数据存储和客户端请求, 可以使用高配置的CPU, RAM和磁盘;
* ingest节点负责数据处理, 使用高配置的CPU, 中等配置的RAM, 低配置的磁盘.
* 对于大的集群, 可以配置一些Coordinate Only节点(将node.master,node.ingest,node.data都设置成false), 扮演load balancers作用, 增加查询性能. 使用中高配CPU, 中高配RAM, 低配磁盘.

**Hot&Warm节点**

对较新的数据, 存在不断的文档写入, 可以放在Hot节点上; 对于较旧的数据, 索引不存在新的数据写入, 同时也不存在大量的数据查询, 可以放在Warm节点上.

配置步骤:

1. 标记节点: 
   * 在```elasticsearch.yml```配置文件中增加:```node.attr.jiao_sha_dou_xing=hotxxx```或```node.attr.jiao_sha_dou_xing=yyywarm```
2. 配置索引到Hot Node
   * 创建索引时, setting增加```"index.routing.allocation.require.jiao_sha_dou_xing":"hotxxx"```, 要求索引数据必须存储到```jiao_sha_dou_xing=hotxxx```的节点.
3. 配置索引到Warm Node
   * 当一个索引上不再有频繁的读写后, 可以修改该setting```"index.routing.allocation.require.jiao_sha_dou_xing":"yyywarm"```指定到warm节点上去

```
通过这个命令, 可以查看节点的attribute的key/value对
GET /_cat/nodeattrs?v
```

**Rack Awareness**

es的多个节点可能分布在多个机架上, 当一个机架断电后, 可能会同时丢失几个节点. 如果一个索引相同的主分片和副本分片在同一个机架上, 就会导致数据丢失. 通过Rack Awareness机制, 可以尽可能的避免将同一个索引的主副分片同时分配在一个机架的节点上.

和Hot&Warm节点配置类似, 也是通过attribute来实现的:

1. 标记节点
   * 叫啥名都行, 总之就是保证同一个机架上的属性值相同, 不同机架上的属性值不同, 通过这个属性值可以区分机架
   * ```node.attr.jijia=jijia1```, ```node.attr.jijia=jijia2```
2. 设置集群全局配置, 然后, 集群就会自动将相同的主副本分片分配到不同的机架上了:

```
PUT _cluster/settings
{
  "persistent":{
    "cluster.routing.allocation.awareness.attributes":"jijia"
  }
}
```

> 通过增加```"cluster.routing.allocation.awareness.force.jijia.values":"jijia1,jijia2"```使得只有一个机架时, 无法分配

## 分片

* 分片
  1. 分片是ES中的最小工作单元/Lucene中的一个Index
* Primary Shard(主分片)
  1. 通过主分片, 将数据分布到所有节点上, 实现存储的水平扩展
  2. 主分片在索引创建时指定, 后续不能修改, 如果非要修改, 需要reindex
  3. 主分片数设置过大, 会导致单个分片的容量很小, 单个节点上的分片个数过多, 影响性能
* Replica Shard(副本分片)
  1. 用于提高数据的可用性, 一旦主分片丢失, 副本分片可以提升为主分片
  2. 副本分片数量可以动态调整
  3. 副本分片和主分片不可以都分布在同一个节点上
  4. 一定程度上, 副本分片可以提高读取的吞吐量(副本分片是可以查询的,见[分布式查询](#分布式查询))
  5. 副本分片设置过多, 会降低集群整体的写入性能
* 文档在分片上的存储
  1. 文档到分片的路由: ```shard = hash(_routing) % number_of_primary_shards```(这也是主分片数不能修改的原因)
  2. ```_routing```默认是文档id, 可以自己指定

**分片的分配及管理**

* 当分片数>节点数: 一旦集群中有新的节点加入, 分片就自动进行分配, 实现水平扩展, 分片重新分配过程中, 系统不会有downtime
* 多分片的好处: 一个索引分布在不同的节点上, 多个节点可以并行执行
* 分片数过多: 
  * 由于每个分片都是Lucene索引, 会使用机器的资源. 过多的分片会导致额外的性能开销
  * es基于query-then-fetch, 每次搜索, 都需要从每个分片获取数据, 然后汇总
  * 分片的meta信息有master节点维护, 过多的分片会增加master节点的负担
* 日志类应用, 单个分片不要超过50GB
* 搜索类应用, 单个分片不要超过20GB
* 控制分片存储大小的目的:
  * 提高update性能
  * merge时, 减少所需的资源
  * 节点丢失后, 可以更迅速的恢复
* 副本分片的好处
  * 提高系统可用性
  * 减缓主分片的查询压力, 但同时也会消耗内存资源
* 副本分片对于性能影响:
  * 降低数据索引速度, 有几份副本, 就会有几倍的CPU资源消耗
  * 和主分片一样, 占用资源

## ES文档写入流程

* Lucene Index
  1. 在Lucene中, 单个倒排索引文件被称为Segment. Segment是自包含的, 不可变更
  2. 多个Segment汇总在一起, 就是Lucene的Index, 也就是es中的Shard
  3. 写入文档时, 会生成新的Segment
  4. 查询文档时, 同时查询所有Segment, 并对结果汇总. Lucene中有Commit Point文件, 用于记录所有Segment的信息
  5. 文档删除时, 不会立即进行物理删除, 而是将删除的文档信息, 保存在.del文件中, 在每次搜索时, 对删除的文档进行过滤.
* Index Buffer
  1. Index Buffer是内存中的一块区域;
  2. es写入文档时, 会将文档先写入Index Buffer;
  3. Index Buffer中的数据是搜索不到的.
  4. Index Buffer的大小默认是java堆的10%.
* Refresh
  1. Index Buffer中的数据会定期写入Segment中, 这个过程称为Refresh.
  2. refresh频率默认为1s, 可以通过```index.refresh_interval```配置.
  3. Refresh后的数据可以被搜索到.
  4. Index Buffer被占满时, 也会触发Refresh.
  5. 通过refresh, 数据写入segment之后, 并没有落盘, 也就是说Segment是在内存中的.
* Transaction Log
  1. 由于Refresh过程并没有落盘, 为防止这期间的数据丢失, 文档在写入Index Buffer的同时, 文档也会写入Transaction Log.
  2. Transaction Log默认落盘.
  3. 系统重新启动后, 会从Transaction Log总同步数据.
* Flush
  1. 真正的数据落盘操作, 分为几步: 1. 通过Refresh, 将Index Buffer写入内存的Segment; 2. 通过fsync, 将内存中的Segments写入磁盘; 3. 删除Transaction Log
  2. Flush默认30分钟执行一次
  3. Transaction Log写满时(512M)也会触发Flush操作
* Merge
  1. 将多个Segment合并为一个;
  2. 将.del文件中记录的删除的文档做物理删除.
  3. es会定期自动执行Merge操作.

## ES文档查询流程

* query阶段
  1. 节点收到用户发出搜索的请求, 以Coordinate的身份, 随机选取主副分片中的几个(使得这几个构成完整的索引数据), 发送查询请求
  2. 被选中的分片执行查询, 进行排序
  3. 每个分片都会返回From+Size个排序后的文档id和排序值给Coordinate(From之前的也要返回)
* fetch阶段
  1. 将query阶段得到的排序的多个id列表整体排序, 选取from 到 from+size的文档
  2. 以multi get请求的方式, 到相应分片,  获取详细的文档数据

以上过程称为Query-Then-Fetch, 这个流程存在以下问题:

1. 查询性能差: 每个分片上查询的文档数 = from + size; coordinate node需要处理的数据规模是: number_of_shard * (from + size); 如果时深度分页(from很大), 性能会很糟糕.
2. 每个分片是基于自己分片上的数据进行的相关性算分, 而不是全局的相关性算分, 所以打分会有偏离, 主分片越多, 算分越不准

解决相关性算分问题的方法:

1. 数据量不大时, 主分片设置为1
2. 数据量较大时, 保证文档均匀分布在各个分片上, 结果出现的偏差就不会太离谱
3. 搜索时, 指定```_search?search_type=dfs_query_then_fetch```, 使得Coordinate可以把每个分片把各自的TF和IDF搜集, 然后进行整体的相关性算分.
   * 这会耗费更多的CPU和内存, 性能很差, 一般不建议使用

解决分页查询性能差的问题:

1. es为了防止深度分页导致性能开销太大, es本身限制了from+size<10000. 这个配置可以修改(index.max_result_window)
2. 通过search after避免深度分页. 示例在下面.
   * 缺点: 不支持指定页数(From); 只能向下翻.
3. 通过scroll api进行遍历查询. 示例在下面.
   * 在查询时, 建立一个快照, 每次查询时, 输入上一次的scroll id(类似于redis中的hscan)
   * 缺点: 有新数据无法被查到

SearchAfter示例:

```
初次查询:
POST movies/_search
{
  "size":10,
  "query":{
    "match_all": {}
  },
  "sort":[
    {"year":"desc"},
    {"_id": "asc"}
  ]
}

可以拿到最后一条记录的sort信息:
{
  ......
        "sort" : [
          2018,
          "184015"
        ]
  ......
}

之后查询, 将上一次sort返回的结果, 放入到search_after中:
POST movies/_search
{
  "size":10,
  "query":{
    "match_all": {}
  },
  "search_after":[2018, "184015"],
  "sort":[
    {"year":"desc"},
    {"_id": "asc"}
  ]
}
```

scroll api示例
```
初次查询
POST movies/_search?scroll=5m
{
  "size":10,
  "query":{
    "match_all": {}
  }
}

返回scroll_id:
{
  "_scroll_id" : "DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAhncWOHFZd1lEWGVURU9RWEhMMDJ0S3E1UQ==",
  ... ...
}

使用scroll_id继续查询:
POST _search/scroll
{
  "scroll":"1m",
  "scroll_id": "DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAhncWOHFZd1lEWGVURU9RWEhMMDJ0S3E1UQ=="
}
```

## 并发读写文档

ES中采用乐观锁的方式进行并发控制. 首先ES中的文档是不可变更的. 更新一个文档实际上是将原有文档删除, 同时增加一个新的文档, 并将文档的version加1. ES并发控制就是通过版本号来实现的乐观锁. 并发控制需要客户端配合使用, 而不是服务端自己就能完成的.

* 内部版本控制: if_seq_no + if_primary_term
* 外部版本控制: version + version_type=external

示例如下:
```
内部版本控制:
先查出一个文档:
GET /movies/_doc/184015
{
  "_index" : "movies",
  "_type" : "_doc",
  "_id" : "184015",
  "_version" : 1,
  "_seq_no" : 9687,
  "_primary_term" : 1,
  "found" : true,
  "_source" : {
    "genre" : [
      "Comedy"
    ],
    "year" : 2018,
    "@version" : "1",
    "title" : "When We First Met",
    "id" : "184015"
  }
}

得到了_seq_no和_primary_term.
执行更新:
PUT /movies/_doc/184015?if_seq_no=9687&if_primary_term=1
{
  "title":"When We First Met-fix"
}

如果有多个线程并发的访问, 使用的相同的seq_no和primary_term, 只有一个会更新成功, 另一个会报错.

外部版本控制示例, version来源于第三方存储, 例如数据库, 这时不需要先查询es, 而是直接更新:
PUT /movies/_doc/184015?version=10&version_type=external
{
    "genre" : [
      "Comedy"
    ],
    "year" : 2018,
    "@version" : "1",
    "title" : "When We First Met",
    "id" : "184015"
}
这时, 并发更新的另一个线程如果version小于等于这个version, 则会直接报错.
```

## update by query和reindex

对索引重建有两种方式:

* update by query:
  * 在现有索引上重建
  * 只有在mapping字段增量修改的情况下才能使用
* reindex
  * 在其它索引上重建
  * 修改原有字段类型, 主分片变更等, 是不允许在原有index上进行修改的, 只能使用reindex
  * reindex要求```_source```必须是enable
  * 必须先配置好目标mapping
  * 可以在```dest```下增加```op_type```防止对目标索引中已有文档产生覆盖
  * 跨集群的reindex需要修改elasticsearch.yml文件中的配置```reindex.remote.whitelist:"host1,host2"```, 并重启

示例如下:

```
update by query示例:
POST frog_index/_update_by_query
{}

reindex示例, 先设定一个新的索引, 然后执行reindex:
PUT /employees_fff/
{
  "mappings" : {
      "properties" : {
        "age" : {
          "type" : "integer"
        },
        "gender" : {
          "type" : "keyword"
        },
        "job" : {
          "type" : "text",
          "fields" : {
            "keyword" : {
              "type" : "keyword",
              "ignore_above" : 50
            }
          }
        },
        "name" : {
          "type" : "keyword"
        },
        "salary" : {
          "type" : "integer"
        }
      }
    }
}

POST _reindex
{
  "source": {
    "index": "employees"
  },
  "dest":{
    "index": "employees_fff"
  }
}
```

## ElasticSearch生产环境常用配置清单

**JVM设置**

* JVM相关参数配置: ```config/jvm.options```
* 将Xms和Xmx设置成一样, 避免heap resize时引发停顿
* Xmx设置不超过物理内存的50%, 单个节点, 最大内存不要超过32G
* JVM使用Server模式
* 关闭JVM Swapping


* 搜索类应用, 内存磁盘配比: 1 : 16
* 日志类应用, 内存磁盘配比: 1 : 48 -- 1 : 96

## ElasticSearch集群监控及运维

```
# 获取集群级别的信息
GET _cluster/stats

# 获取节点级别的信息
GET _nodes/stats

# 索引级别的信息
GET frog_index/_stats

# 获取所有tasks
GET _tasks

# 获取挂起的task
GET _cluster/pending_tasks

# 节点线程池信息
GET _nodes/thread_pool

# 节点线程池统计信息
GET _nodes/stats/thread_pool

# hot thread
GET _nodes/hot_threads

# 可以为索引设置慢查询日志阈值
PUT frog_vvv_index/
{
  "settings": {
    "index.search.slowlog.threshold":{
      "query.warn":"10s",
      "query.info":"3s",
      "query.debug":"2s",
      "query.trace":"0s",
      "fetch.warn":"1s",
      "fetch.info":"600ms",
      "fetch.debug":"400ms",
      "fetch.trace":"0s"
    }
  }
}

# 查看集群状态
GET /_cluster/health

# 查看集群状态, 精确到索引级别
GET /_cluster/health?level=indices

# 查看集群状态, 精确到分片级别
GET /_cluster/health?level=shards

# 查看索引分配问题
GET /_cluster/allocation/explain
```

## ElasticSearch性能优化

**写入性能优化**

* 客户端
  1. 使用bulk api, 批量写入; 不要太大, 单个bulk数据量建议5-15M, 请求超时需要足够长, 建议60s以上.
  2. 观察是否有http 429状态码返回(服务器繁忙), 实现retry;
* 服务端
  1. 降低IO操作: 1. 使用es自动生成文档id(如果手动指定id, es会先执行get操作判断id是否存在); 2. 修改一些配置, 如: refresh interval.
  2. 降低CPU和存储开销: 1. 减少不必要的分词; 2. 避免不必要的doc_values; 3. 文档的字段尽量保证相同的顺序, 可以提高文档压缩率.
  3. 负载均衡, 设置合理的分片数
  4. 调整bulk线程池和队列
  5. 关闭无关的功能:
     1. 只需要聚合, 不需要搜索, index设置为false
     2. 不需要算分, norms设置成false
     3. 关闭dynamic mapping, 防止自动生成的字段过多
     4. 对于指标型数据, 某些情况下, 可以关闭_source, 减少大量的io和磁盘
  6. 牺牲可靠性: 临时将副本分片设置为0, 写入完成后, 再调整回去
  7. 牺牲搜索实时性: 增加Refresh Interval的时间, 以及调整```indices.memory.index_buffer_size```(默认10%)
  8. 牺牲可靠性: 修改Translog配置. 可以将```index.translog.durability```设置为```async```, 避免每次请求都落盘; 同时```index.translog.sync_interval```设置为60s, 这样就会每分钟落盘一次; 同时可以将```index.translog.flust_threshold_size```适当调大(默认:512M), 超过该值, translog自动触发flush.

**读取性能优化**

1. 查询时尽量避免使用script
2. 尽量使用filter, 而不是query, 避免不必要的算分
3. 严禁使用*开头的通配符terms查询
4. 聚合查询控制聚合的数量, 减少内存开销
5. 避免over sharding, 防止分片过多导致不必要的性能开销
6. 对于时序型索引, 及时的设置为readonly, 及时进行force merge, 减少segment数量

**Segment Merge性能优化**

Merge操作是一个相对较重的操作, 需要优化, 以降低对系统的影响

1. 降低分段产生的数量/频率: 将refresh_interval调整到分钟级别, 并调整indices.memory.index_buffer_size; 尽量避免文档的更新操作
2. 降低最大分段大小, 避免较大的segment参与merge.
   * index.merge.policy.segments_per_tier, 默认是10, 越小需要越多的合并操作;
   * index.merge.policy.max_merged_segment, 默认是5GB, 超出此大小后, 就不进行merge操作.
3. 当index不在有写入操作时, 手动执行force merge操作. 提升查询速度, 减少内存开销.
4. segment合并之后越少越好, 最好是1个, 但是force merge会占用大量的网络/IO/CPU.

## ES缓存

ES缓存分为三类

* Node Query Cache
  * 每个节点存在一个, 节点上所有shard共享, 只缓存了filter查询的内容
  * 采用LRU算法
  * indices.queries.cache.size: "10%"(总堆内存的10%)
  * segment合并时, 会失效
* Shard Query Cache
  * 缓存每个分片的查询结果, 只缓存Aggregations和Suggestions
  * 采用LRU算法
  * indices.request.cache.size: "1%"
  * refresh时, 会失效
* Fielddata Cache
  * indices.fielddata.cache.size
  * segment合并时, 会失效

Circuit Breaker - es内部提供多种断路器, 避免不合理操作引发的OOM, 每个断路器可以指定内存使用限制

```
查询circuit breaker统计信息, tripped大于0说明有熔断
GET /_nodes/stats/breaker
```

## Logstash

ELT工具(数据经过抽取、清洗转换之后加载到数据仓库), 数据搜集处理引擎, 支持200+插件.

概念:

* Pipeline: 包含input - filter - output三个阶段的处理流程
  * input: 数据采集
  * filter: 数据解析
  * output: 数据输出
* Event: 数据在内部流转的具体表现形式. 数据在input阶段, 被转换为Event, 在output阶段被转换为目标格式数据


## 常用命令备忘

* 列出索引列表:

```
curl -s -u username:password http://xxxxxxx/_cat/indices?v
```

* 删除指定索引

```
curl -s -u username:password -X DELETE http://xxxxxxxx/index_name
```

* 查看节点信息

```
curl -s -u usename:password http://xxxxxxxx/_cat/nodes
```

## Reference

* 极客时间-ElasticSearch核心技术与实战

## 附录

##### document示例

```json
{
  "_index": "sw_segment-20220517",
  "_type": "_doc",
  "_id": "2ce2eff1dff1413f84b9c296f7e401aa.66.16527767270910008",
  "_version": 1,
  "_score": 0,
  "_source": {
    "trace_id": "d00ffbb17be345a4b6ee0724489ec950.68.16527767270880005",
    "endpoint_name": "GET:/hello",
    "latency": 4,
    "end_time": 1652776727095,
    "endpoint_id": "RGVtb0FwcEI=.1_R0VUOi9oZWxsbw==",
    "service_instance_id": "RGVtb0FwcEI=.1_MzI2ZDBhMDBjYmEyNDk4NTk2MmQ5Yzc4YzhjOTkwNmJAMTkyLjE2OC41Ni4x",
    "version": 3,
    "tags": [
      "http.method=GET"
    ],
    "start_time": 1652776727091,
    "data_binary": "CjVkMDBmZmJiMTdiZTM0NWE0YjZlZTA3MjQ0ODllYzk1MC42OC4xNjUyNzc2NzI3MDg4MDAwNRI1MmNlMmVmZjFkZmYxNDEzZjg0YjljMjk2ZjdlNDAxYWEuNjYuMTY1Mjc3NjcyNzA5MTAwMDgaNwgBGLXkrYmNMCC15K2JjTAyIUhpa2FyaUNQL0Nvbm5lY3Rpb24vZ2V0Q29ubmVjdGlvbkACUHQaLwgCGLfkrYmNMCC35K2JjTAyGUhpa2FyaUNQL0Nvbm5lY3Rpb24vY2xvc2VAAlB0GqkCEP///////////wEYs+StiY0wILfkrYmNMCrFARI1ZDAwZmZiYjE3YmUzNDVhNGI2ZWUwNzI0NDg5ZWM5NTAuNjguMTY1Mjc3NjcyNzA4ODAwMDUaNWQwMGZmYmIxN2JlMzQ1YTRiNmVlMDcyNDQ4OWVjOTUwLjY4LjE2NTI3NzY3MjcwODgwMDA0IAEqCERlbW9BcHBBMi1iZDMyMmQxNDk4MDc0YTNmODU5Nzg2ODM5ZWZkZWY0ZUAxOTIuMTY4LjU2LjE6CkdFVDovaGVsbG9CDmxvY2FsaG9zdDo5MDkyMgpHRVQ6L2hlbGxvSANQDmIiCgN1cmwSG2h0dHA6Ly9sb2NhbGhvc3Q6OTA5Mi9oZWxsb2ISCgtodHRwLm1ldGhvZBIDR0VUIghEZW1vQXBwQiotMzI2ZDBhMDBjYmEyNDk4NTk2MmQ5Yzc4YzhjOTkwNmJAMTkyLjE2OC41Ni4x",
    "service_id": "RGVtb0FwcEI=.1",
    "statement": "GET:/hello - d00ffbb17be345a4b6ee0724489ec950.68.16527767270880005",
    "time_bucket": 20220517163847,
    "is_error": 0,
    "segment_id": "2ce2eff1dff1413f84b9c296f7e401aa.66.16527767270910008"
  }
}
```

##### mapping示例

```json
{
  "mapping": {
    "properties": {
      "data_binary": {
        "type": "binary"
      },
      "end_time": {
        "type": "long"
      },
      "endpoint_id": {
        "type": "keyword"
      },
      "endpoint_name": {
        "type": "keyword",
        "copy_to": [
          "endpoint_name_match"
        ]
      },
      "endpoint_name_match": {
        "type": "text",
        "analyzer": "oap_analyzer"
      },
      "is_error": {
        "type": "integer"
      },
      "latency": {
        "type": "integer"
      },
      "segment_id": {
        "type": "keyword"
      },
      "service_id": {
        "type": "keyword"
      },
      "service_instance_id": {
        "type": "keyword"
      },
      "start_time": {
        "type": "long"
      },
      "statement": {
        "type": "keyword"
      },
      "tags": {
        "type": "keyword"
      },
      "time_bucket": {
        "type": "long"
      },
      "trace_id": {
        "type": "keyword"
      },
      "version": {
        "type": "integer",
        "index": false
      }
    }
  }
}
```

##### setting示例

```json
{
  "settings": {
    "index": {
      "refresh_interval": "10s",
      "number_of_shards": "5",
      "provided_name": "sw_segment-20220517",
      "creation_date": "1652773059350",
      "analysis": {
        "analyzer": {
          "oap_analyzer": {
            "type": "stop"
          }
        }
      },
      "number_of_replicas": "0",
      "uuid": "9ZWSlvzATteNnObwnGhVfQ",
      "version": {
        "created": "7010099"
      }
    }
  },
  "defaults": {
    "index": {
      "max_inner_result_window": "100",
      "unassigned": {
        "node_left": {
          "delayed_timeout": "1m"
        }
      },
      "max_terms_count": "65536",
      "lifecycle": {
        "name": "",
        "rollover_alias": "",
        "indexing_complete": "false"
      },
      "routing_partition_size": "1",
      "force_memory_term_dictionary": "false",
      "max_docvalue_fields_search": "100",
      "merge": {
        "scheduler": {
          "max_thread_count": "4",
          "auto_throttle": "true",
          "max_merge_count": "9"
        },
        "policy": {
          "reclaim_deletes_weight": "2.0",
          "floor_segment": "2mb",
          "max_merge_at_once_explicit": "30",
          "max_merge_at_once": "10",
          "max_merged_segment": "5gb",
          "expunge_deletes_allowed": "10.0",
          "segments_per_tier": "10.0",
          "deletes_pct_allowed": "33.0"
        }
      },
      "max_refresh_listeners": "1000",
      "max_regex_length": "1000",
      "load_fixed_bitset_filters_eagerly": "true",
      "number_of_routing_shards": "1",
      "write": {
        "wait_for_active_shards": "1"
      },
      "mapping": {
        "coerce": "false",
        "nested_fields": {
          "limit": "50"
        },
        "nested_objects": {
          "limit": "10000"
        },
        "depth": {
          "limit": "20"
        },
        "ignore_malformed": "false",
        "total_fields": {
          "limit": "1000"
        }
      },
      "source_only": "false",
      "soft_deletes": {
        "enabled": "false",
        "retention": {
          "operations": "0"
        },
        "retention_lease": {
          "period": "12h"
        }
      },
      "max_script_fields": "32",
      "query": {
        "default_field": [
          "*"
        ],
        "parse": {
          "allow_unmapped_fields": "true"
        }
      },
      "format": "0",
      "frozen": "false",
      "sort": {
        "missing": [],
        "mode": [],
        "field": [],
        "order": []
      },
      "priority": "1",
      "codec": "default",
      "max_rescore_window": "10000",
      "max_adjacency_matrix_filters": "100",
      "analyze": {
        "max_token_count": "10000"
      },
      "gc_deletes": "60s",
      "optimize_auto_generated_id": "true",
      "max_ngram_diff": "1",
      "translog": {
        "generation_threshold_size": "64mb",
        "flush_threshold_size": "512mb",
        "sync_interval": "5s",
        "retention": {
          "size": "512mb",
          "age": "12h"
        },
        "durability": "REQUEST"
      },
      "auto_expand_replicas": "false",
      "mapper": {
        "dynamic": "true"
      },
      "requests": {
        "cache": {
          "enable": "true"
        }
      },
      "data_path": "",
      "highlight": {
        "max_analyzed_offset": "1000000"
      },
      "routing": {
        "rebalance": {
          "enable": "all"
        },
        "allocation": {
          "enable": "all",
          "total_shards_per_node": "-1"
        }
      },
      "search": {
        "slowlog": {
          "level": "TRACE",
          "threshold": {
            "fetch": {
              "warn": "-1",
              "trace": "-1",
              "debug": "-1",
              "info": "-1"
            },
            "query": {
              "warn": "-1",
              "trace": "-1",
              "debug": "-1",
              "info": "-1"
            }
          }
        },
        "idle": {
          "after": "30s"
        },
        "throttled": "false"
      },
      "fielddata": {
        "cache": "node"
      },
      "default_pipeline": "_none",
      "max_slices_per_scroll": "1024",
      "shard": {
        "check_on_startup": "false"
      },
      "xpack": {
        "watcher": {
          "template": {
            "version": ""
          }
        },
        "version": "",
        "ccr": {
          "following_index": "false"
        }
      },
      "percolator": {
        "map_unmapped_fields_as_text": "false"
      },
      "allocation": {
        "max_retries": "5"
      },
      "indexing": {
        "slowlog": {
          "reformat": "true",
          "threshold": {
            "index": {
              "warn": "-1",
              "trace": "-1",
              "debug": "-1",
              "info": "-1"
            }
          },
          "source": "1000",
          "level": "TRACE"
        }
      },
      "compound_format": "0.1",
      "blocks": {
        "metadata": "false",
        "read": "false",
        "read_only_allow_delete": "false",
        "read_only": "false",
        "write": "false"
      },
      "max_result_window": "10000",
      "store": {
        "stats_refresh_interval": "10s",
        "type": "",
        "fs": {
          "fs_lock": "native"
        },
        "preload": []
      },
      "queries": {
        "cache": {
          "enabled": "true"
        }
      },
      "warmer": {
        "enabled": "true"
      },
      "max_shingle_diff": "3",
      "query_string": {
        "lenient": "false"
      }
    }
  }
}
```


##### 数据准备

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