# 原型模式

## 5.1 概述

原型模式就是用原型实例指定创建对象的种类，并且通过复制这些原型创建新的对象。


**原型模式应用举例:**  
Struts2中广泛采用原型模式. 正常情况下, Spring容器根据配置文件或者注解会在容器里生成类的唯一实例, 但是Struts2作为控制层, 对象中存在多个成员变量, 在并发请求时, 如果访问的都是同一个对象, 会导致多个线程对成员变量的并发访问, 存在线程安全问题. 为解决这一问题, 需要保证每一次请求时, 从Spring容器中取出的控制层对象都是不同的对象, 这时就用到了原型模式. Spring创建bean的配置中有一个属性scope, 这个属性默认为"single", 在使用Struts时应该改为"prototype", 即原型. 这样就确保了, 对象的线程隔离, 也就不存在线程安全问题了.

## 5.2 模式结构

代码如下:

```java
public class ObjectA implements Cloneable{

    private int a;

    private int b;

    public ObjectA() {
    }

    public int getA() {
        return a;
    }

    public void setA(int a) {
        this.a = a;
    }

    public int getB() {
        return b;
    }

    public void setB(int b) {
        this.b = b;
    }

    @Override
    public String toString() {
        return "ObjectA{" +
                "a=" + a +
                ", b=" + b +
                '}';
    }

    @Override
    public ObjectA clone(){ // since jdk1.5, 协变返回值类型
        try {
            return (ObjectA) super.clone();
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
            return null;
        }
    }

}
```

测试

```java
    public static void main(String[] args){
        ObjectA a = new ObjectA();
        a.setA(1);
        a.setB(2);
        ObjectA b = a.clone();
        System.out.println(a.clone());
        System.out.println(a == b);
        System.out.println(a.equals(b));
    }
```

输出:

```
ObjectA{a=1, b=2}
false
false
```

> 需要注意的是, 上面的ObjectA类必须实现Cloneable接口(或者如果它有父类, 它的父类实现也可以), 虽然该接口内没有任何方法, 但是如果不实现该接口, 执行clone方法时就会报错:CloneNotSupportedException. 在Effective Java中认为这是java语言一处很不好的设计.

## 5.3 克隆, 深克隆与浅克隆

Java的clone()方法:

1. clone方法将对象复制了一份并返回给调用者。一般而言，clone（）方法满足
2. 对任何的对象x，都有x.clone() !=x  因为克隆对象与原对象不是同一个对象
3. 对任何的对象x，都有x.clone().getClass()= =x.getClass()//克隆对象与原对象的类型一样
4. 如果对象x的equals()方法定义恰当，那么x.clone().equals(x)应该成立

Java中对象的克隆

1. 为了获取对象的一份拷贝，我们可以利用Object类的clone()方法
2. 在派生类中覆盖基类的clone()方法，并声明为public
3. 在派生类的clone()方法中，调用super.clone()
4. 在派生类中实现Cloneable接口

1. 浅复制（浅克隆）

被复制对象的所有变量都含有与原来的对象相同的值，而所有的对其他对象的引用仍然指向原来的对象。换言之，浅复制仅仅复制所考虑的对象，而不复制它所引用的对象。

2. 深复制（深克隆）

被复制对象的所有变量都含有与原来的对象相同的值，除去那些引用其他对象的变量。那些引用其他对象的变量将指向被复制过的新对象，而不再是原有的那些被引用的对象。换言之，深复制把要复制的对象所引用的对象都复制了一遍。

通过代码演示深克隆与浅克隆:

实体类

```java
public class ObjA implements Cloneable{

    private int a;

    public int getA() {
        return a;
    }

    public void setA(int a) {
        this.a = a;
    }

    @Override
    public String toString() {
        return "ObjA{" +
                "a=" + a +
                '}';
    }

    @Override
    public ObjA clone(){
        try {
            return (ObjA) super.clone();
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
            return null;
        }
    }


}

public class ObjB implements Cloneable{

    private ObjA objA;

    private int b;

    public ObjA getObjA() {
        return objA;
    }

    public void setObjA(ObjA objA) {
        this.objA = objA;
    }

    public int getB() {
        return b;
    }

    public void setB(int b) {
        this.b = b;
    }

    @Override
    public String toString() {
        return "ObjB{" +
                "objB=" + objA.toString() +
                ", b=" + b +
                '}';
    }

    @Override
    public ObjB clone(){    // 浅克隆
        try {
            return (ObjB) super.clone();
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
            return null;
        }
    }
}


public class ObjC implements Cloneable{

    private int c;

    private ObjA objA;

    public int getC() {
        return c;
    }

    public void setC(int c) {
        this.c = c;
    }

    public ObjA getObjA() {
        return objA;
    }

    public void setObjA(ObjA objA) {
        this.objA = objA;
    }

    @Override
    public String toString() {
        return "ObjC{" +
                "c=" + c +
                ", objA=" + objA +
                '}';
    }

    @Override
    public ObjC clone(){
        try {
            ObjC c = (ObjC) super.clone();
            c.setObjA(this.objA.clone());
            return c;
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
            return null;
        }
    }
}


```


```java
    public static void main(String[] args){
        ObjB b = new ObjB();
        b.setObjA(new ObjA());
        ObjB bb = b.clone();
        System.out.println(b == bb);
        System.out.println(b.getObjA() == bb.getObjA());


        ObjC c = new ObjC();
        c.setObjA(new ObjA());
        ObjC cc = c.clone();
        System.out.println(c == cc);
        System.out.println(c.getObjA() == cc.getObjA());
    }
```

输出结果:
```
false
true
false
false
```

> 并不是原型模式就是clone. clone只不过是原型模式的一种实现方式, 况且EffectiveJava推荐谨慎的使用clone. 原型模式是指, 依照某一个实例对象为原型, 去创建其他实例对象.