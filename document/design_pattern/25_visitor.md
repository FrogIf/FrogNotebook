# 访问者模式

## 25.1 概述

公园中存在多个景点，也存在多个游客，不同的游客对同一个景点的评价可能不同；医院医生开的处方单中包含多种药元素，査看它的划价员和药房工作人员对它的处理方式也不同，划价员根据处方单上面的药品名和数量进行划价，药房工作人员根据处方单的内容进行抓药。

这些被处理的数据元素相对稳定而访问方式多种多样的数据结构，如果用“访问者模式”来处理比较方便。

**访问者（Visitor）模式的定义**：将作用于某种数据结构中的各元素的操作分离出来封装成独立的类，使其在不改变数据结构的前提下可以添加作用于这些元素的新的操作，为数据结构中的每个元素提供多种访问方式。它将对数据的操作与数据结构进行分离，是行为类模式中最复杂的一种模式。

**访问者模式基本上主要应用于实现动态绑定**

## 25.2 结构

**角色**

* 抽象访问者(Visitor): 定义一个访问具体元素的接口，为每个具体元素类对应一个访问操作 visit() ，该操作中的参数类型标识了被访问的具体元素。
* 具体访问者(ConcreteVisitor): 实现抽象访问者角色中声明的各个访问操作，确定访问者访问一个元素时该做什么
* 抽象元素(Element): 声明一个包含接受操作 accept() 的接口, 被接受的访问者对象作为 accept() 方法的参数
* 具体元素(ConcreteElement): 实现抽象元素角色提供的 accept() 操作，其方法体通常都是 visitor.visit(this) ，另外具体元素中可能还包含本身业务逻辑的相关操作
* 对象结构(ObjectStruct): 是一个包含元素角色的容器，提供让访问者对象遍历容器中的所有元素的方法，通常由 List、Set、Map 等聚合类实现。

**UML**

![image](img/visitor.png)

**代码**

```java
public interface IElement {

    void accept(IVisitor visitor);

}
public interface IVisitor {

    void visit(ConcreteElementA element);

    void visit(ConcreteElementB element);

}
public class ConcreteElementA implements IElement {

    private IVisitor visitor;

    @Override
    public void accept(IVisitor visitor) {
        this.visitor = visitor;
    }

    public void methodK(){
        this.visitor.visit(this);
    }
}
public class ConcreteElementB implements IElement {

    private IVisitor visitor;

    @Override
    public void accept(IVisitor visitor) {
        this.visitor = visitor;
    }

    public void methodQ(){
        this.visitor.visit(this);
    }
}
public class VisitorA implements IVisitor {
    @Override
    public void visit(ConcreteElementA element) {
        System.out.println("visitor A do something for elementA" + element.toString());
    }

    @Override
    public void visit(ConcreteElementB element) {
        System.out.println("visitor A do something for elementB" + element.toString());
    }
}
public class VisitorB implements IVisitor {
    @Override
    public void visit(ConcreteElementA element) {
        System.out.println("visitor B do something for element A." + element.toString());
    }

    @Override
    public void visit(ConcreteElementB element) {
        System.out.println("visitor B do something for element B." + element.toString());
    }
}
public class ObjectStruct {

    List<IElement> elements = new ArrayList<>();

    public void add(IElement element){
        elements.add(element);
    }

    public void remove(IElement element){
        elements.remove(element);
    }

    public void pushVisitor(IVisitor visitor){
        for (IElement element : elements){
            element.accept(visitor);
        }
    }

}
```

client

```java
    public static void main(String[] args){
        IElement elementA = new ConcreteElementA();
        IElement elementB = new ConcreteElementB();

        ObjectStruct os = new ObjectStruct();
        os.add(elementA);
        os.add(elementB);

        os.pushVisitor(new VisitorA());

        ((ConcreteElementB) elementB).methodQ();

        os.pushVisitor(new VisitorB());
        ((ConcreteElementA) elementA).methodK();

    }
```

## 25.3 分析

**优点**

* 扩展性好。能够在不修改对象结构中的元素的情况下，为对象结构中的元素添加新的功能。
* 复用性好。可以通过访问者来定义整个对象结构通用的功能，从而提高系统的复用程度。
* 灵活性好。访问者模式将数据结构与作用于结构上的操作解耦，使得操作集合可相对自由地演化而不影响系统的数据结构。
* 符合单一职责原则。访问者模式把相关的行为封装在一起，构成一个访问者，使每一个访问者的功能都比较单一。

**缺点**

* 增加新的元素类很困难。在访问者模式中，每增加一个新的元素类，都要在每一个具体访问者类中增加相应的具体操作，这违背了“开闭原则”。
* 破坏封装。访问者模式中具体元素对访问者公布细节，这破坏了对象的封装性。
* 违反了依赖倒置原则。访问者模式依赖了具体类，而没有依赖抽象类。

## 静态绑定与动态绑定

java只支持静态绑定

```java
public class TypeA extends IType{
    // something...
} 

public class TypeB extends IType{
    // something...
}

public class AClass{
    public void run(TypeA a){
        // do something.
    }
    public void run(TypeB b){
        // do something.
    }
}
```

常规使用AClass的重载时, 是这么用的:

```java
public static void main(String[] args){
    AClass ac = new AClass();
    TypeA a = new TypeA();
    ac.run(a);
}
```

这是静态绑定, 在编译截断, 就已经确定下来调用的run方法是哪一个了. 但是有些场景下, 这种不能满足:

```java
public void execute(IType type){
    AClass ac = new AClass();
    ac.run(type);
}
```

这样就遇到了一个很尴尬的局面, 首先入参由于多态可以是多种类型, 所以, 无法完成静态绑定, 编译期就会报错. 但是可以使用访问者模式解决这个问题:

```java
public abstract class IType{
    protected abstract void visit(AClass ac);
    public void execute(AClass ac){
        visit(ac);
    }
} 

public class TypeA extends IType{
    protected void visit(AClass ac){
        ac.run(this);
    }
} 

public class TypeB extends IType{
    protected void visit(AClass ac){
        ac.run(this);
    }
}
```

然后就可以这样使用了:

```java
public void execute(IType type){
    AClass ac = new AClass();
    type.execute(ac);
}
```

这就实现了动态绑定!