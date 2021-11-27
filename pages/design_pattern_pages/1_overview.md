## Overview

一般有 23 种设计模式。这些模式可以分为三大类：

1. **创建型模式（Creational Patterns）**
    这些设计模式提供了一种在创建对象的同时隐藏创建逻辑的方式，而不是使用 new 运算符直接实例化对象。这使得程序在判断针对某个给定实例需要创建哪些对象时更加灵活。
    * 工厂方法模式（Factory Method）
    * 抽象工厂模式（Abstract Factory）
    * 单例模式（Singleton）
    * 建造者模式（Builder）
    * 原型模式（Prototype）

2. **结构型模式（Structural Patterns）**
    这些设计模式关注类和对象的组合。继承的概念被用来组合接口和定义组合对象获得新功能的方式。
    * 适配器模式（Adapter Pattern）
    * 桥接模式（Bridge Pattern）
    * 组合模式（Composite Pattern）
    * 装饰器模式（Decorator Pattern）
    * 外观模式（Facade Pattern）
    * 享元模式（Flyweight Pattern）
    * 代理模式（Proxy Pattern）

3. **行为型模式（Behavioral Patterns）**
    这些设计模式特别关注对象之间的通信。    
    * 策略模式（Strategy Pattern）    
    * 观察者模式（Observer Pattern）
    * 责任链模式（Chain of Responsibility Pattern）
    * 命令模式（Command Pattern）
    * 解释器模式（Interpreter Pattern）
    * 迭代器模式（Iterator Pattern）
    * 中介者模式（Mediator Pattern）
    * 备忘录模式（Memento Pattern）
    * 状态模式（State Pattern）
    * 模板方法模式（Template Pattern）
    * 访问者模式（Visitor Pattern）


## 面向对象设计的原则

代码设计的目标是:
1. 可复用
2. 可扩展
3. 可维护
4. 灵活性

为了实现这一目标, 在开发过程中需要遵守以下设计原则:

0. **开闭原则**  
    设计原则的总则, 对扩展开放, 对修改关闭.我们可以通过装饰等方式扩展一个类的功能, 但不应该修改原有代码(可能牵一发而动全身)
1. **单一职责原则**  
    一个方法, 一个类, 所负责的功能应该粒度小一些. 保证只有一个引起该方法或者类修改的原因.
2. **里氏代换原则**  
    能用父类的地方, 需要保证一定也可以用子类.
3. **合成/聚合复用原则**  
    开发过程中应尽量使用合成/聚合, 而不使用继承. Effective Java对其原因进行了详细说明: 1. 继承破坏了父类的封装性; 2. 对于存在自调用的父类, 子类重写父类可继承方法会导致调用出错...
4. **迪米特法则**  
    又叫"知道最少原则", 两个对象之间尽量少的进行相互通讯. 一处是使用另一个对象的方法, 尽量只调用一次. 或者通过中介来调用.
5. **依赖倒转原则**  
    面向接口编程, 而不是具体实现.
6. **接口隔离原则**  
    类似于单一职责原则, 每一个接口内尽量含有极少的抽象.


## 学习设计模式的好处

1. 更好的理解各个框架技术的源码
2. 更好的使用各个技术的API
3. 开发出更加良好的代码

## 心得

1. 使用中间层来隔离变化, 做缓冲.