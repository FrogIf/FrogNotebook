# 自动拆箱注意事项

```java
Integer a = null;
if(a == 2){
    System.out.println("ok");
}
```

上面这段代码执行会抛出空指针异常.

原因在于自动拆箱语法糖, 可以将上面代码生成的class文件反编译看到:

```java
Integer a = null;
if(a.intValue() == 2){
    System.out.println("ok");
}
```

显然, 如果a为null, 则会抛出NullPointerException.

特别的, 对于有些场景下的比较, 有一些最佳实践:

```java
static final Integer MARK = 2;
if(MARK.equals(a))
...
```

```java
if(Boolean.TRUE.equals(arg))
...
```

