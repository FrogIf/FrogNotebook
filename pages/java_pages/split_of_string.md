# split

```java
String str = ",,,1,2,,,,,";
String[] strArr = str.split(",");
for(String s : strArr){
    System.out.println(">" + s);
}
```

上面代码运行结果是:

```
>
>
>
>1
>2
```

结尾的空字符串被丢弃了!

查看源码, 代码是这样的:

```java
public String[] split(String regex){
    return split(regex, 0);
}
```

在查看一下两个参数的split方法:

```java
public String[] split(String regex, int limit);
```

通过查看注释, 可以了解limit参数的意义:

1. limit > 0: regex对应的模式至多被应用 limit ~ 1次. 返回数组的长度不会超过limit的长度. 数组最后一个元素的将包含所有超出最后一个匹配的分割符.
2. limit = 0: regex对应的模式将会被应用尽可能多的次数. 返回的数组长度不固定. 所有尾部空字符将会被丢弃.
3. limit < 0: regex对应的模式将会被应用尽可能多的次数. 返回的数组长度不固定.

> limit > 0时, 代码中才会认真对待limit的具体值, 如果limit<=0, limit具体值是多少都无所谓.


以"boo:and:foo"为例:

* 分割符':'

limit|result
-|-
2|{ "boo", "and:foo" }
5|{ "boo", "and", "foo" }
-2|{ "boo", "and", "foo" }

* 分割符'o'

limit|result
-|-
5|{ "b", "", ":and:f", "", "" }
-2|{ "b", "", ":and:f", "", "" }
0|{ "b", "", ":and:f" }

所以, 开头那段代码, 如果想保留结尾的空字符串, 只需将limit设置为小于0即可.