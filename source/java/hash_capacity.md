# HashMap初始容量

《阿里巴巴Java开发手册》中对于HashMap有推荐用法:

```
推荐集合初始化是, 指定集合大小.
说明: HashMap使用HashMap(int initialCapacity)初始化
正例: initialCapacity = (需要存储的元素个数/负载因子) + 1. 注意, 负载因子(即loader factor)默认为0.75. 如果暂时无法确定初始大小, 请设置为16(即默认值).
```

那么HashMap是如何扩容的呢? 通过查看源码可以看出

```java
static final float DEFAULT_LOAD_FACTOR = 0.75f;

public HashMap(int initicalCapacity){
    this(initicalCapacity, DEFAULT_LOAD_FACTOR);
}

public HashMap(int initialCapacity, float loadFactor) {
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal initial capacity: " +
                                            initialCapacity);
    if (initialCapacity > MAXIMUM_CAPACITY)
        initialCapacity = MAXIMUM_CAPACITY;
    if (loadFactor <= 0 || Float.isNaN(loadFactor))
        throw new IllegalArgumentException("Illegal load factor: " +
                                            loadFactor);
    this.loadFactor = loadFactor;
    this.threshold = tableSizeFor(initialCapacity);
}

/**
 * Returns a power of two size for the given target capacity.
 */
static final int tableSizeFor(int cap) {
    int n = cap - 1;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
}
```

通过HashMap#tableSizeFor可以看出HashMap的初始容量并非initialCapacity，而是min（2^n）>initialCapacity,即大于initialCapacity的2的n次幂的最小值。而扩容条件只要HashMap的容量大于threshold*loadFactor时就需要扩容，而非初始值initialCapacity，这样可能与我们的预期不符，本意可能是在initialCapacity范围内都不需要扩容，举例如下：

initialCapacity|loadFactor|threshold|resize(threshold*loadFactor)
-|-|-|-
1|0.75|2|1
2|0.75|2|1
3|0.75|4|3
4|0.75|4|3
5|0.75|8|6
9|0.75|16|12
16|0.75|16|12
32|0.75|32|24