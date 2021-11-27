# 浮点型数据的比较

由于浮点型数据存储特点, 所以浮点型数据判断是否相等时, 不能直接使用等于进行比较, 而是应该限定在一定的误差范围内, 都视为相等.

```java
double b = 2.6 + 2.7;
double a = 5.3;
System.out.println(a == b);
System.out.println(Math.abs(b - a) < 1e-7);
```

输出的结果:

```
false
true
```