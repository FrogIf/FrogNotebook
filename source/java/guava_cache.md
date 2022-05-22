---
title: Guava Cache
author: frogif
date: 2022-05-22
---

# Guava Cache

## 概述

本地缓存工具, 性能很好. 应该是caffeine性能更好一些, 但是使用方式和guava几乎一致.

## 例程

maven引用:

```
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>31.0-jre</version>
</dependency>
```

* 例程1: 简单一点的, 这个相当于一个CurrentHashMap:

```java
    private static final Cache<String, String> cache = CacheBuilder.newBuilder()
            .initialCapacity(1000)
            .maximumSize(2000)
            .expireAfterWrite(5, TimeUnit.MINUTES)
            .build();

    public static void main(String[] args){
        cache.put("aaa", "bbb");
        System.out.println(cache.getIfPresent("aaa"));
        System.out.println(cache.getIfPresent("ccc"));
    }
```

* 例程2: 复杂一点的, 这个一般用于需要查询redis或者mysql的场景:

```java
    private static final LoadingCache<String, String> loadCache = CacheBuilder.newBuilder()
            .initialCapacity(1000)
            .maximumSize(2000)
            .expireAfterWrite(5, TimeUnit.MINUTES)
            .refreshAfterWrite(3, TimeUnit.SECONDS)
            .build(new CacheLoader<String, String>() {
                @Override
                public String load(String s) throws Exception {
                    // 假装这里是一个查询数据库
                    return String.valueOf(s.hashCode());
                }

                @Override
                public ListenableFuture<String> reload(String key, String oldValue) throws Exception {
                    try{
                        return super.reload(key, oldValue);
                    }catch (Exception e){
                        return Futures.immediateFuture(oldValue);
                    }
                }
            });

    public static void main(String[] args) throws ExecutionException {
        System.out.println(loadCache.get("vvv"));
    }
```

## 参数配置

* ```initialCapacity``` -- 设置缓存的初始容量, 合理设置, 避免反复扩容
* ```maximumSize``` -- 设置最大存储容量, 防止内部存储的对象过多, 导致OOM
  * 当超出最大容量时, guava的缓存淘汰策略采用的是LRU


## 缓存过期

缓存过期策略:

* ```expireAfterWrite``` -- 缓存写入后, 超出指定时间, 则过期
* ```expireAfterAccess``` -- 某个key指定时间没有访问, 则过期, 一旦有效期内访问某个key, 就会自动续期
* ```refreshAfterWrite``` -- 这个必须结合CacheLoader使用, 指定缓存写入多久之后, 触发更新缓存值

上面的缓存清除策略都是惰性过期. 

当一个key超出指定时间后, guava cache并不会主动清除这个key, 而是新的查询的时候, 如果查询到的key已经过期, 会触发全局检查, 清除过期key. 这个过期检查和清除都是在当前查询线程上进行的, 而不是异步执行的. 在这里, 三种配置方式行为略有差别:

* ```expireAfterWrite``` -- 限制一个查询线程去请求新值, 其余线程阻塞
* ```expireAfterAccess``` -- 限制一个查询线程去请求新值, 其余线程阻塞
* ```refreshAfterWrite``` -- 限制一个查询线程去请求新值, 其余线程返回旧值


很多情况下, ```refreshAfterWrite```是和另两种配置配合使用的, ```refreshAfterWrite```的值设置的比```expireAfterWrite/expireAfterAccess```小一些. 这是处于这样的目的: 由于```refreshAfterWrite```是惰性过期, 而且过期后, 并发访问, 其余线程返回的是旧值, 那么, 如果单独使用```refreshAfterWrite```, 就存在这样一种情况, 假设```refreshAfterWrite```设置了10分钟, 但是程序2个小时都没有访问这个key, 这时, 缓存中的旧值已经是2个小时之前的了, 有可能和真实值差距巨大, 然后, 突然多个线程并发查询这个key, 其中一个线程去加载新值, 其他线程则返回了一个2个小时之前的旧值, 这是不可接受的.

假设和```expireAfterWrite```配合使用, ```expireAfterWrite```设置20分钟, 那么, 在2个小时后, 旧值过期, 所有线程都会阻塞, 等待新值.

## 最佳实践

上面例程中的例程2是实际中, 是比较常见的用法.

CacheLoader接口实现了load和reload方法, reload不是必须的, ```expireAfterWrite/expireAfterAccess```过期后, 会调用load方法, ```refreshAfterWrite```过期后会调用reload方法.

上面例程2的reload方法, 实现的效果是, 一旦加载新值失败, 则返回旧值. 这种实现reload是出于这样一种考虑. 

1. 假如缓存来源于数据库, 突然某个时刻数据库压力过大, 导致出现很多查询超时. 同时, 本地Guava缓存中的key过期了, 需要通过reload重新加载, 结果加载失败了, 如果没有重新实现reload方法, 就会导致Guava认为缓存中存储的数据不对, 每次查询这个key时, 都会向数据库请求, 进而数据库压力更大, 就会有更多加载失败, 最终形成恶性循环. 当然, 如果对数据一致性要求高, 数据库压力大时, 应用程序也快速失败是明智的.
2. 有时候, 我们缓存的数据基本不会改变. 那么, 当数据库不可用时, 如果没有实现reload, 数据库的不可用, 就会直接影响到应用程序. 而如果这时, 我们捕获这个异常, 并返回旧值, 就隔离了数据库的异常.

## Reference

* [Guava cache使用总结](https://www.cnblogs.com/rickiyang/p/11074159.html)
* [guava cache过期方案实践](https://segmentfault.com/a/1190000041072880)