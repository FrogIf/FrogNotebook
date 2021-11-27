# 解释器模式

## 19.1 概述

所谓解释器模式就是定义语言的文法, 并且建立一个解释器来解释该语言中的句子.

解释器模式描述了如何构成一个简单的语言解释器, 主要应用在使用面向对象语言开发的编译器中. 它描述了如何为简单的语言定义一个文法, 如何在该语言中表示一个句子, 以及如何解释这些句子.

## 19.2 结构

**角色**

1. 抽象表达式（Abstract Expression）: 定义解释器的接口，约定解释器的解释操作，主要包含解释方法 interpret()
2. 终结符表达式（Terminal    Expression）角色：是抽象表达式的子类，用来实现文法中与终结符相关的操作，文法中的每一个终结符都有一个具体终结表达式与之相对应
3. 非终结符表达式（Nonterminal Expression）角色：也是抽象表达式的子类，用来实现文法中与非终结符相关的操作，文法中的每条规则都对应于一个非终结符表达式
4. 上下文（Context）角色：通常包含各个解释器需要的数据或是公共的功能，一般用来传递被所有解释器共享的数据，后面的解释器可以从这里获取这些值

**UML类图**

![image](img/explain.png)

**代码**

这是一个简易的四则运算计算器代码, 写的有点多,主要关注上面类图中所指示的方法即可.

```java
public interface Expression {
    double interpret();
    void pushLeaf(Expression expression);
    Expression getUnFull();
}

public class NumberExpression implements Expression{

    StringBuilder sb = new StringBuilder();

    public void assemble(char ch){ sb.append(ch); }

    @Override
    public double interpret() { 
        return Double.parseDouble(sb.toString()); 
    }

    @Override
    public void pushLeaf(Expression expression) {}

    @Override
    public Expression getUnFull() { return null; }
}

public abstract class AbstractMidExpression implements Expression {

    protected abstract Expression getLeft();

    protected abstract Expression getRight();

    protected abstract void setLeft(Expression expression);

    protected abstract void setRight(Expression expression);

    private boolean isComplete(){
        return getLeft() != null && getRight() != null;
    }

    @Override
    public Expression getUnFull(){
        if(!isComplete()){
            return this;
        }else{
            Expression blankExpress = getLeft().getUnFull();
            if(blankExpress != null){
                return blankExpress;
            }else{
                return getRight().getUnFull();
            }
        }
    }

    @Override
    public void pushLeaf(Expression expression){
        if(getLeft() == null){
            setLeft(expression);
        }else if(getRight() == null){
            setRight(expression);
        }else{
            if(getUnFull() != null) {
                getUnFull().pushLeaf(expression);
            }
        }
    }

}

public class AddExpression extends AbstractMidExpression {

    private Expression left;

    private Expression right;

    @Override
    public double interpret() { 
        return left.interpret() + right.interpret();
    }

    @Override
    public Expression getLeft() { return left; }

    @Override
    public void setLeft(Expression left) { this.left = left; }

    @Override
    public Expression getRight() { return right; }

    @Override
    public void setRight(Expression right) { this.right = right; }
}

public class SubExpression extends AbstractMidExpression {

    private Expression left;

    private Expression right;

    @Override
    public Expression getLeft() { return left; }

    @Override
    public void setLeft(Expression left) { this.left = left; }

    @Override
    public Expression getRight() { return right; }

    @Override
    public void setRight(Expression right) { this.right = right; }

    @Override
    public double interpret() { 
        return left.interpret() - right.interpret();
    }
}

public class MultExpression extends AbstractMidExpression {

    private Expression left;

    private Expression right;

    @Override
    public double interpret() { 
        return left.interpret() * right.interpret(); 
    }

    @Override
    public Expression getLeft() { return left; }

    @Override
    public void setLeft(Expression left) { this.left = left; }

    @Override
    public Expression getRight() { return right; }

    @Override
    public void setRight(Expression right) { this.right = right; }
}

public class DivExpression extends AbstractMidExpression {

    private Expression left;

    private Expression right;

    @Override
    public double interpret() { 
        return left.interpret() / right.interpret(); 
    }

    @Override
    public Expression getLeft() { return left; }

    @Override
    public void setLeft(Expression left) { this.left = left; }

    @Override
    public Expression getRight() { return right; }

    @Override
    public void setRight(Expression right) { this.right = right; }
}

public class Context {

    private String expression;

    public Context(String expression){
        this.expression = expression.replaceAll(" ", "");
    }

    private Expression explain(){
        char[] chars = expression.toCharArray();

        Expression root = null;

        NumberExpression number = null;
        for(int i = 0; i < chars.length; i++){
            char ch = chars[i];
            if(isNumber(ch) || isDot(ch)){
                if(number == null){
                    number = new NumberExpression();
                }
                number.assemble(ch);
                if(i == chars.length - 1){
                    root.pushLeaf(number);
                }
            }else{
                Expression operator = getExpresion(ch);

                if(root == null) {
                    root = operator;
                }else{
                    operator.pushLeaf(root);
                }

                if(number != null){
                    root.pushLeaf(number);
                }

                root = operator;
                number = null;
            }
        }

        return root;
    }

    private Expression getExpresion(char symbol){
        Expression exp = null;
        switch (symbol){
            case '+':
                exp = new AddExpression();
                break;
            case '-':
                exp = new SubExpression();
                break;
            case '*':
                exp = new MultExpression();
                break;
            case '/':
                exp = new DivExpression();
                break;
        }
        return exp;
    }


    public double calculate(){ return explain().interpret(); }

    private boolean isNumber(char ch){ return ch >= '0' && ch <= '9'; }

    private boolean isDot(char ch){ return ch == '.'; }

}
```

测试:

```java
public class InterpreterDemo {

    public static void main(String[] args){
        String expression = "1.4 + 12 * 2 / 3 / 4 * 5 - 6 + 7 * 8 / 9";

        Context context = new Context(expression);

        System.out.println(context.calculate());
    }

}
```


> 这个计算器是不区分运算符优先级的

## 19.3 分析

**优点**

1. 扩展性好。由于在解释器模式中使用类来表示语言的文法规则，因此可以通过继承等机制来改变或扩展文法。
2. 容易实现。在语法树中的每个表达式节点类都是相似的，所以实现其文法较为容易。

**缺点**

1. 执行效率较低。解释器模式中通常使用大量的循环和递归调用，当要解释的句子较复杂时，其运行速度很慢，且代码的调试过程也比较麻烦。
2. 会引起类膨胀。解释器模式中的每条规则至少需要定义一个类，当包含的文法规则很多时，类的个数将急剧增加，导致系统难以管理与维护。
3. 可应用的场景比较少。在软件开发中，需要定义语言文法的应用实例非常少，所以这种模式很少被使用到。

## 19.4 应用

1. 当语言的文法较为简单，且执行效率不是关键问题时。
2. 当问题重复出现，且可以用一种简单的语言来进行表达时。
3. 当一个语言需要解释执行，并且语言中的句子可以表示为一个抽象语法树的时候，如 XML 文档解释。

