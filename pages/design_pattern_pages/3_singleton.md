# 单例模式

## 3.1 概述

实现方式 | 特点 | 推荐
---|---|---
简单懒汉式 | 支持懒加载, 线程不安全 | 不推荐使用
同步懒汉式 | 支持懒加载, 线程安全, 性能低 | 不推荐使用
饿汉式 | 不支持懒加载, 线程安全 | 推荐在不需要懒加载的情况下使用
双重校验锁 | 支持懒加载, 线程安全 | 可以使用
静态内部类 | 支持懒加载, 线程安全 | 需要懒加载时, 推荐使用
枚举 | 不支持懒加载, 线程安全 | 推荐使用, 在有序列化, 反序列化使用

上面的各种单例模式都对构造器进行了私有化, 防止外部调用构造器创建对象, 导致单例失败. 另外构造器私有化还会导致这个类不能被子类继承.

## 3.2 简单懒汉式

```java
public class SimpleLazy{
	
	private static SimpleLazy instance;
	
	private SimpleLazy() {}
	
	public static SimpleLazy getInstance() {
		if(instance == null) {
			instance = new SimpleLazy();
		}
		return instance;
	}
	
}
```

## 3.3 同步懒汉式

```java
public class SyncLazy {
	private static SyncLazy instance;
	
	private SyncLazy() {}
	
	public static synchronized SyncLazy getInstance() {
		if(instance == null) {
			instance = new SyncLazy();
		}
		return instance;
	}
}
```

## 3.4 饿汉式

```java
public class HungryObject{
	private static HungryObject instance = new HungryObject();
	
	private HungryObject() {}
	
	public static HungryObject getInstance() {
		return instance;
	}
}
```

## 3.5 双重校验锁

```java
public class DCLObject{
	private static DCLObject instance;
	
	private DCLObject() {}
	
	public static DCLObject getInstance() {
		if(instance == null) {	// check 1
			synchronized (DCLObject.class) {
				if(instance == null) {	// check 2
					instance = new DCLObject();
				}
			}
		}
		return instance;
	}
}
```

> 在JDK1.5之后，双重检查锁定才能够正常达到单例效果

## 3.6 静态内部类

```java
public class StaticInnerClassObject {
	private static class InstanceHolder{	//holder --> 持有者
		private static final StaticInnerClassObject INSTANCE = new StaticInnerClassObject();
	}
	
	private StaticInnerClassObject() {
		System.out.println("被实例化");
	}
	
	public static StaticInnerClassObject getInstance() {	// final修饰方法, 表示该方法不能被重写
		return InstanceHolder.INSTANCE;
	}
}
```

> 内部类InstanceHolder在且只在getInstance方法第一次调用的时候加载, 从而实现了延迟加载的效果.

## 3.7 枚举

```java
public enum EnumObject implements Singleton{
	INSTANCE;
	
	private EnumObject() {}
	
	public void method1() {
		// ...
	}
	
	public void method2() {
		// ...
	}
	
	public void whateverMethod() {
		// ...
	}
}

```

> JVM内部加持, 保证它永远单例, 它不仅能避免多线程同步问题，而且还能防止反序列化重新创建新的对象. Effective Java提倡的方式.


> 工厂是控制对象的创建, 单例模式更进一步, 是保证只存在一个对象!!!   
> 需要注意的是实际中会有多种单例: 线程内单例, 进程内单例, 分布式服务中实例唯一等等.
> 所以开头说的单例模式使用以及推荐, 并不绝对, 例如, 线程内单例和分布式服务中实例唯一就不能通过静态内部类的方式来实现.