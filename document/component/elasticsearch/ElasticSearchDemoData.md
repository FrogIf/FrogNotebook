# 使用LogStash导入es演示数据

windows下的演示

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
5. 看到命令行输出从csv文件中读出的数据, 说明正在导入