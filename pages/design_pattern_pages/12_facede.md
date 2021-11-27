# 外观模式

## 12.1 概述

外观模式, 又叫门面模式. **外观模式定义了一个高层的功能，为子系统中的多个模块协同的完成某种功能需求提供简单的对外功能调用方式，使得这一子系统更加容易被外部使用。**

外观模式的目的不是给予子系统添加新的功能接口，而是为了让外部减少与子系统内多个模块的交互，松散耦合，从而让外部能够更简单地使用子系统。

外观模式的本质是：封装交互，简化调用

## 12.2 结构

**角色**
1. 门面角色(Facede) : 外观模式的核心。它被客户角色调用，它熟悉子系统的功能。内部根据客户角色的需求预定了几种功能的组合。
2. 子系统角色 : 实现了子系统的功能。它对客户角色和Facade时未知的。它内部可以有系统内的相互交互，也可以由供外界调用的接口。
3. 客户角色 : 通过调用Facede来完成要实现的功能

**UML类图**

![image](img/facade.png)

**代码**

```java
public class ModelA {

    public void begin(){
        System.out.println("开始 model a");
    }

    public void end(){
        System.out.println("结束 model a");
    }

}

public class ModelB {

    public void open(){
        System.out.println("打开 model b");
    }

    public void close(){
        System.out.println("关闭 model b");
    }

}

public class FacadeObject {

    private ModelA modelA;

    private ModelB modelB;

    public FacadeObject() {
        this.modelA = new ModelA();
        this.modelB = new ModelB();
    }

    public void startup(){
        modelB.open();
        modelA.begin();
    }

    public void shutdown(){
        modelA.end();
        modelB.close();
    }

}

// demo:
    public static void main(String[] args){
        FacadeObject obj = new FacadeObject();
        obj.startup();
        obj.shutdown();
    }
```

## 12.3 分析

**优点**

1. 松耦合:使得客户端和子系统之间解耦，让子系统内部的模块功能更容易扩展和维护；
2. 简单易用:客户端根本不需要知道子系统内部的实现，或者根本不需要知道子系统内部的构成，它只需要跟Facade类交互即可。
3. 更好的层次划分:有些方法是对系统外的，有些方法是系统内部相互交互的使用的。子系统把那些暴露给外部的功能集中到门面中，这样就可以实现客户端的使用，很好的隐藏了子系统内部的细节。

## 12.4 应用

javaWeb开发大量使用门面模式, Controller层, Service层, DAO层各层都是子系统, Service层又是DAO层的门面, Controller又是Service层的门面.

> Controller层还应用的中介者模式, Controller作为View, Model的中介者. 详见中介者模式.