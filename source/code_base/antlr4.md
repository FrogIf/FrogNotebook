# ANTLRv4

## 简介

ANTLR(ANother Tool for Language Recognition)是一个强大的解析器生成器，用于构建解析器、解释器、编译器以及各种编程语言、领域特定语言或自定义文件格式的转换器。ANTLR4是其最新的主要版本，相比ANTLR3引入了显著的改进和优化。ANTLRv4用java编写, 使用自上而下的递归下降LL(*)剖析器方法. 由旧金山大学的Terence Parr博士等人于1989年开始发展.

其他类似的解析器生成器或者编译器构造工具有:

* JavaCC(Java Compiler Compiler): JavaCC是一个基于Java的语法分析器生成器，支持LL和LR语法分析器的生成。它的优点是易于学习和使用，具有良好的性能和扩展性，缺点是生成的代码较为冗长和复杂。
* YACC/Bison: YACC是最早的语法分析器生成器之一，也是很多语言工具的基础，例如C语言编译器。Bison是对YACC的增强版，支持更多的特性和扩展性。它们的优点是可靠性高，支持广泛，缺点是学习曲线陡峭，代码难以阅读和维护。
* Flex/Bison: Flex是对LEX的增强版，用于生成词法分析器；Bison是对YACC的增强版，用于生成语法分析器。它们的优点是可靠性高，支持广泛，缺点是学习曲线陡峭，代码难以阅读和维护。

> 相比较而言, ANTLR4支持LL和LR语法分析器的生成，具有更好的性能和灵活性。它的优点是易于学习和使用，支持广泛，生成的代码简洁清晰，缺点是一些高级特性需要一定的学习成本。

这里有一些ANTLR4的官方文档资料:

* antlr4开源地址: https://github.com/antlr/antlr4
* 常见语言的文法: https://github.com/antlr/grammars-v4


## 搭建环境

1. 使用ANLTRv4需要先安装. 下载地址: https://www.antlr.org/download.html, 点击"ANTLR tool itself"开始下载;
2. 下载之后, 将antlr-4.13.1-complete.jar放到一个位置.
3. 这时实际上就可以直接使用了. 例如:

```
java -jar D:\Software\antlr\antlr-4.13.1-complete.jar Hello.g4
```

或者

```
java -cp D:\Software\antlr\antlr-4.13.1-complete.jar org.antlr.v4.Tool Hello.g4
```

4. 但是这样使用很不方便, 所以需要配置环境. 首先在antlr-4.13.1-complete.jar所在目录新增两个bat脚本:

**antlr.bat**:

```bat
java -jar %~dp0antlr-4.13.1-complete.jar %*
```

> 该脚本可以对文法文件进行编译, 生成解释器代码.

**grun.bat**:

```bat
java -cp %~dp0antlr-4.13.1-complete.jar org.antlr.v4.gui.TestRig %*
```

> 该脚本方便调试使用

5. 将脚本的目录配置到环境变量`Path`中, 示例: `D:\Software\antlr`

这样就可以方便的使用了. 例如: ```antlr Hello.g4```

## 快速开始

### 文法编写

接下来编写一个简单的文法文件来快速了解ANTLR4. 下面是编写的一个`Hello.g4`文件的内容:

```g4
grammar Hello;

@header{
package sch.frog.lab.antlr.lang2;
}

program : 'Hello' NAME EOF;
NAME: [a-zA-Z]+;
WD: [ \t\r\n] -> skip;
```

* `grammar Hello;`指示这个文法叫'Hello';
* `@header{ package sch.frog.lab.antlr.lang2; }`告诉antlr生成的代码文件开头要以`package sch.frog.lab.antlr.lang2;`开头(这是java中包声明的语法);
* `program : 'Hello' NAME EOF;`: 是一个语法规则, 指示`:`左侧的非终结符的匹配规则.
* 最后两行时词法规则, ANTLR中约定词法规则以大写字母开头;
  * `WD: [ \t\r\n] -> skip;`指示遇到空白符则忽略, 其中的`skip`是antlr内置指令, 用于告诉解析器在处理输入文本时忽略（或者说跳过）匹配到的特定字符序列;

> 文法(Grammar) = 词法(Lexer Grammar) + 语法(Syntax Grammar)

antlr4的文法文件编写时, 使用的文法和正则表达式很像, 上面没有体现, 但是会很常用的其他一些符号如下:

* `?`: 表示`?`前面的表达式是可选的, 即可以出现0次或者1次;
* `*`: 表示`*`前面的表达式是可选的, 即可以出现0次或者多次;
* `+`: 表示`+`前面的表达式可以出现1次或者多次;
* `.`: 匹配任意单个字符，除了换行符;
* `*?`: 代表非贪婪模式的尽可能少匹配, 知道遇到下一个能成功匹配的规则;
* `()`: 使用`()`将内部的元素作为一个分组;
* `|`: 表示`|`左右两侧的匹配规则是或的关系, 即可以按照左侧的规则进行展开, 又可以按照右侧的规则进行展开, 其中左侧的优先级高于右侧;
* `:`: 产生式的推导符号, `:`左边推导右边;
* `'xxx'`: 严格匹配单引号里面的所有字符;
* `#xxx`: 为产生式加标签;
* EOF: 表示文件流结束(End of File)

antlr中约定:

* 词法: 大写字母开头
* 语法: 小写字母开头

### 生成解释器

在文法文件目录执行`antlr Hello.g4`可以生成该语言的解释器. 生成文件列表如下:

* `Hello.interp`
* `Hello.tokens`
* `HelloLexer.interp`
* `HelloLexer.tokens`
* `HelloListener`: 遍历interface, 会为每条规则定义两个方法:enterXXX(访问规则时调用), exitXXX(访问完成时调用)
* `HelloBaseListener`: `HelloListener`的默认实现
* `HelloLexer`: 词法分析器
* `HelloParser`: 语法分析器

ANTLR4提供了两种遍历语法树的方式: `listener`和`visitor`. 默认情况下生成的解释器中提供的是`listener`模式. 如果想使用`visitor`, 可以这样执行:

* `antlr -visitor Hello.g4`
* `antlr -visitor -no-listener Hello.g4` -- 生成只支持Visitor的

通过Visitor模式会生成

* `HelloVisitor.java`: 会为每条规则定义`visitorXXX`方法;
* `HelloBaseVisitor.java`: `HelloVisitor.java`的默认实现.

### 遍历抽象语法树

ANTLR在遍历抽象语法树时, 默认采用的是深度优先遍历. 但是在`visitor`模式下, 可以由使用者自己灵活的定制遍历方式(重写`visitChildren`方法).

**listener遍历**

```java
    public static void main(String[] args){
        String expression = "Hello World";
        CodePointCharStream cs = CharStreams.fromString(expression);
        HelloLexer lexer = new HelloLexer(cs);
        HelloParser parser = new HelloParser(new CommonTokenStream(lexer));
        ParseTree tree = parser.program();

        ParseTreeWalker walker = new ParseTreeWalker();
        walker.walk(new Listener(), tree);
    }

    private static class Listener extends HelloBaseListener{
        @Override
        public void enterEveryRule(ParserRuleContext ctx) {
            System.out.println("enter : " + ctx.getText());
        }

        @Override
        public void exitEveryRule(ParserRuleContext ctx) {
            System.out.println("exit : " + ctx.getText());
        }

        @Override
        public void visitTerminal(TerminalNode node) {
            System.out.println("visit : " + node.getText());
        }
    }
```

**visitor遍历**

```java
    public static void main(String[] args){
        String expression = "Hello World";
        CodePointCharStream cs = CharStreams.fromString(expression);
        HelloLexer lexer = new HelloLexer(cs);
        HelloParser parser = new HelloParser(new CommonTokenStream(lexer));
        ParseTree tree = parser.program();
        new Visitor().visit(tree);
    }

    private static class Visitor extends HelloBaseVisitor<Object>{
        @Override
        public Object visit(ParseTree tree) {
            System.out.println("tree : " + tree.getText());
            return super.visit(tree);
        }

        @Override
        public Object visitTerminal(TerminalNode node) {
            System.out.println("node : " + node.getText());
            return super.visitTerminal(node);
        }
    }
```

甚至我们可以完全不按照上面的方式, 自己实现遍历, 这里给出例程, 已经采用深度优先, 去遍历整颗树, 然后输出抽象语法树.

```java
public class HelloLang {

    public static void main(String[] args) throws IOException {
        String expression = "Hello World";

        System.out.println("tokens");
        CodePointCharStream cs = CharStreams.fromString(expression);
        HelloLexer lexer = new HelloLexer(cs);
        List<? extends Token> tokens = lexer.getAllTokens();
        for (Token token : tokens) {
            System.out.println(token.getText() + ":" + HelloLexer.VOCABULARY.getSymbolicName(token.getType()));
        }


        lexer = new HelloLexer(CharStreams.fromString(expression));
        HelloParser parser = new HelloParser(new CommonTokenStream(lexer));
        ParseTree tree = parser.program();

        System.out.println("\nast:");
        String s = AstUtil.generateTree(new TreeNode(tree, parser));
        System.out.println(s);
    }

    private static List<AstUtil.TreeVisitor> getChildren(ParseTree parent, HelloParser parser){
        int childCount = parent.getChildCount();
        ArrayList<AstUtil.TreeVisitor> visitors = new ArrayList<>(childCount);
        for(int i = 0; i < childCount; i++){
            ParseTree child = parent.getChild(i);
            visitors.add(new TreeNode(child, parser));
        }
        return visitors;
    }

    private static class TreeNode implements AstUtil.TreeVisitor{
        private ParseTree node;
        private HelloParser parser;

        public TreeNode(ParseTree node, HelloParser parser) {
            this.node = node;
            this.parser = parser;
        }

        @Override
        public List<AstUtil.TreeVisitor> getChildren() {
            return HelloLang.getChildren(node, parser);
        }

        @Override
        public String toString() {
            return Trees.getNodeText(node, parser);
        }
    }
}

class AstUtil {

    /**
     * 将树转为可视化字符串形式输出
     * @param node 树根
     * @return 字符串
     */
    public static String generateTree(TreeVisitor node){
        StringBuilder sb = new StringBuilder();
        sb.append(toString(node)).append('\n');
        buildTree(node, sb, 0, new int[0]);
        return sb.toString();
    }

    /**
     * @param parent 父节点
     * @param sb stringBuilder
     * @param level 树层级
     * @param markArr 每一个int标记该层级是否有后继兄弟节点: 0 - 没有; 1 - 有
     */
    private static void buildTree(TreeVisitor parent, StringBuilder sb, int level, int[] markArr){
        List<TreeVisitor> children = parent.getChildren();
        if(children == null || children.isEmpty()){ return; }
        Iterator<TreeVisitor> itr = children.iterator();
        int[] arr = Arrays.copyOf(markArr, level + 1);
        while(itr.hasNext()){
            TreeVisitor child = itr.next();
            boolean hn = itr.hasNext(); // 是否有后继兄弟节点
            for(int i = 0; i <= level; i++){
                if(i == level){
                    if(hn){
                        sb.append("+- ");
                    }else{
                        sb.append("\\- ");
                    }
                }else{
                    if(arr[i] == 0){
                        sb.append("   ");
                    }else{
                        sb.append("|  ");
                    }
                }
            }
            if(child == null){
                sb.append("??null").append('\n');
            }else{
                sb.append(toString(child)).append('\n');
                arr[level] = hn ? 1 : 0;
                buildTree(child, sb, level + 1, arr);
            }
        }
    }
    private static String toString(TreeVisitor node){
        return node.toString();
    }
    public interface TreeVisitor{
        String toString();
        List<TreeVisitor> getChildren();
    }
}
```

## 一个计算器

### 编写文法文件

文件`Calc.g4`:

```g4
grammar Calc;

@header {
package sch.frog.lab.antlr.calc;
}

program: statements? EOF;
statements: (statement)+;
statement: expression ';';

constant_expression: NUMBER | IDENTIFIER;
expression: expression (STAR | SLASH) expression # multOrDiv
        | expression (PLUS | MINUS) expression  # addOrSub
        | <assoc = right> IDENTIFIER ASSIGN expression # assign
        | '(' expression ')'  # group
        | constant_expression  # constant
        ;

PLUS: '+';
MINUS: '-';
STAR: '*';
SLASH: '/';
ASSIGN: '=';
DECIMAL_PART: '.'  DIGIT*;
NUMBER: NO_ZERO_DIGIT DIGIT* DECIMAL_PART?
     | '0' DECIMAL_PART?;
IDENTIFIER: CHARACTER (CHARACTER | DIGIT | '_')*;
WS: [ \t\r\n]+ -> skip; // 忽略换行符等
COMMENT : '//' .*? '\n' -> skip ; // 忽略注释
NO_ZERO_DIGIT: [1-9];
DIGIT: [0-9];
CHARACTER: [a-zA-Z];
```

> 上面的文法中, 使用`# multOrDiv`为规则增加标签, 这样的好处是antlr4会生成`visitMultOrDiv`方法或者`enterMultOrDiv/exitMultOrDiv`方法, 方便后续进行求值时进行特殊处理.

### 生成解释器

这里我们采用visitor模式, 这样能更灵活的控制对抽象语法树的遍历. 执行命令:

```
antlr -visitor -no-listener Calc.g4
```

### 求值

通过visitor方式, 遍历抽象语法树, 进行表达式求值, 代码如下:

```java
package sch.frog.lab.antlr;

import org.antlr.v4.runtime.CharStreams;
import org.antlr.v4.runtime.CodePointCharStream;
import org.antlr.v4.runtime.CommonTokenStream;
import org.antlr.v4.runtime.tree.ParseTree;
import org.antlr.v4.runtime.tree.TerminalNode;
import org.antlr.v4.runtime.tree.Trees;
import sch.frog.lab.antlr.calc.CalcBaseVisitor;
import sch.frog.lab.antlr.calc.CalcLexer;
import sch.frog.lab.antlr.calc.CalcParser;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class Calculator {

    public static void main(String[] args){
        HashMap<String, BigDecimal> variables = new HashMap<>();
        Scanner sc = new Scanner(System.in);
        while(true){
            String content = sc.nextLine();
            if("exit".equals(content)){
                System.out.println("exit...");
                break;
            }

            try{
                CodePointCharStream cs = CharStreams.fromString(content);
                CalcLexer lexer = new CalcLexer(cs);
                CalcParser parser = new CalcParser(new CommonTokenStream(lexer));
                ParseTree tree = parser.program();

                Value value = new Visitor(parser, variables).visit(tree);
                System.out.println("result : " + value.evaluate(variables) + "\n");
            }catch (Exception e){
                e.printStackTrace();
            }
        }
    }

    private static class Visitor extends CalcBaseVisitor<Value>{

        private final CalcParser parser;

        private final Map<String, BigDecimal> variables;

        public Visitor(CalcParser parser, Map<String, BigDecimal> variables) {
            this.parser = parser;
            this.variables = variables;
        }

        @Override
        public Value visitMultOrDiv(CalcParser.MultOrDivContext ctx) {
            return infixEvaluate(ctx);
        }

        @Override
        public Value visitTerminal(TerminalNode node) {
            int type = node.getSymbol().getType();
            if(type == CalcLexer.NUMBER){
                return new Value(new BigDecimal(node.getSymbol().getText()));
            }else if(type == CalcLexer.IDENTIFIER){
                return new Value(node.getSymbol().getText());
            }
            return super.visitTerminal(node);
        }

        @Override
        public Value visitAddOrSub(CalcParser.AddOrSubContext ctx) {
            return infixEvaluate(ctx);
        }

        @Override
        public Value visitAssign(CalcParser.AssignContext ctx) {
            Value name = ctx.getChild(0).accept(this);
            if(name.identifier == null){
                throw new IllegalStateException("assign left is unrecognized");
            }
            Value val = ctx.getChild(2).accept(this);
            variables.put(name.identifier, val.evaluate(variables));
            return val;
        }

        private Value infixEvaluate(CalcParser.ExpressionContext ctx){
            BigDecimal left = ctx.getChild(0).accept(this).evaluate(variables);
            BigDecimal right = ctx.getChild(2).accept(this).evaluate(variables);
            String operator = Trees.getNodeText(ctx.getChild(1), parser);
            if("*".equals(operator)){
                return new Value(left.multiply(right));
            }else if("/".equals(operator)){
                return new Value(left.divide(right, 10, RoundingMode.HALF_UP));
            }else if("+".equals(operator)){
                return new Value(left.add(right));
            }else if("-".equals(operator)){
                return new Value(left.subtract(right));
            }
            throw new IllegalArgumentException("operator : " + operator + " unsupported");
        }

        @Override
        protected Value aggregateResult(Value aggregate, Value nextResult) {
            if(nextResult == null){ return aggregate; }
            else { return nextResult; }
        }
    }

    private static class Value{
        private BigDecimal number;
        private String identifier;
        public Value(BigDecimal number) {
            this.number = number;
        }
        public Value(String identifier) {
            this.identifier = identifier;
        }
        private BigDecimal evaluate(Map<String, BigDecimal> variables){
            if(number != null){ return number; }
            else if(variables.containsKey(identifier)){ return variables.get(identifier); }
            else{
                throw new IllegalStateException(identifier + " is undefined");
            }
        }
    }
}
```

简单测试一下:

```
1+2*(3+4);
result : 15

a = 12;
result : 12

b = c = 2.3;
result : 2.3

c;
result : 2.3

a + b * c;
result : 17.29
```

这里需要注意一点, 我们在上面的讲述中, 从来没有提及对于一段字符流, 从那个文法规则开始进行匹配分析. 实际上, 我们可以从任意文法规则开始, 我们在程序中是指定了的: `ParseTree tree = parser.program();`, 这段代码指定了从`program`这个非终结符开始进行分析. 如果想从`statement`开始, 可以写成: `ParseTree tree = parser.statement();`

### 优先级

文法表达式在文件中的顺序代表优先级. 在前面的会优先匹配.

对于表达式: ```1 + 2 * 3```

文法文件局部为:

```g4
expression: expression (PLUS | MINUS) expression
        | expression (STAR | SLASH) expression
        | NUMBER;
```

得到的抽象语法树是(已简化):

```
expression
+- expression
|  +- expression
|  |  \- 1
|  +- +
|  \- expression
|     \- 2
+- *
\- expression
   \- 3
```

从抽象语法树可以看到会先执行`1 + 2`, 再执行`* 3`

需要调整两个文法的顺序:

```g4
expression: expression (STAR | SLASH) expression
        | expression (PLUS | MINUS) expression
        | NUMBER;
```

调整后生成的抽象语法树是(已简化):

```
expression
+- expression
|  \- 1
+- +
\- expression
   +- expression
   |  \- 2
   +- *
   \- expression
      \- 3
```

这样就可以了.

### 歧义

歧义问题在词法分析器和语法分析器中都会发生，ANTLR的解决方案使得对规则的解析能够正常进行。在词法分析器中，ANTLR解决歧义问题的方法是：匹配在语法定义中最靠前的那条词法规则。

表达式为: ```let a = 12```;

文法文件局部为:

```g4
IDENTIFIER: [a-zA-Z] ([a-zA-Z] | [0-9] | '_')*;
LOCAL_DECLARE: 'let';
```

结果, 词法分析得到的结果是:

```
let:IDENTIFIER
a:IDENTIFIER
=:ASSIGN
12:NUMBER
```

可以看到, `let`被当做了`IDENTIFIER`, 实际上我们想让他被识别为`LOCAL_DECLARE`, 这时, 我们需要调整这两个文法的顺序:

```g4
LOCAL_DECLARE: 'let';
IDENTIFIER: [a-zA-Z] ([a-zA-Z] | [0-9] | '_')*;
```

### 结合性

结合性决定了当一个运算符在表达式中出现多次且没有明确使用括号改变优先级时，这些运算符如何分组或者说如何确定计算顺序。例如, `1+2+3`显然是先算左边, 即`1+2`, 再算右边`+3`, 顺序是从左至右的, 所以是左结合. antlr4默认就是左结合的. 在编程语言中, 常见的右结合是`=`, 例如: `a = b = c = 1`

文法文件局部为:

```g4
expression: expression (STAR | SLASH) expression
        | expression (PLUS | MINUS) expression
        | <assoc = right> IDENTIFIER ASSIGN expression
        | NUMBER;
```

生成的抽象语法树是:

```
expression
+- expression
|  \- a
+- =
\- expression
   +- expression
   |  \- b
   +- =
   \- expression
      +- expression
      |  \- c
      +- =
      \- expression
         \- 1
```

可以看出是从右向左执行的, 属于右结合.

## 其他

### 递归下降算法

ANTLR采用的是递归下降算法. 递归下降算法是一种自顶向下的语法分析方法，常用于编译器或解释器的设计中，用来解析程序语言的源代码，确定输入串是否符合某种给定的语法规则（即文法）。该算法通过递归调用函数或过程来模拟文法的规则，每条文法规则对应程序中的一个函数，这些函数负责识别并处理相应的语法结构。

递归下降算法的工作原理可以简化描述如下：
1. 文法规则对应函数：对于文法中的每个非终结符（代表语言结构的符号），我们定义一个函数。这些函数通常以自顶向下的方式递归调用自身或其他函数来解析输入串中的语法结构。
2. 递归解析：当函数被调用时，它尝试将输入串匹配到对应的文法规则。如果规则由更小的部分组成（比如表达式可以由项和表达式相加构成），函数会递归调用代表这些更小组件的函数。
3. 基础情况：递归的终止条件是遇到文法中的终结符（直接代表实际字符或符号的规则），这时直接检查输入流中的下一个符号是否匹配，如果匹配则消耗它并返回成功。
4. 回溯与选择：如果当前的规则尝试不成功，递归下降算法可能会通过回溯到上一层调用并尝试另一个可能的规则分支来实现选择（这在处理有多个可选项的文法规则时尤为关键）。
5. 错误处理：当输入不符合预期的文法规则时，递归下降解析器通常能够提供较为精确的错误位置和描述，因为解析过程紧密跟随文法规则。

递归下降算法的优点在于其简单直观，易于理解和实现，特别是对于那些没有左递归且具有明确层次结构的文法。然而，它对某些复杂的文法结构（如左递归文法）处理起来不够直接，可能需要额外的技术（如消除左递归）来适应。

> 以上关于递归下降算法的解释来源于通义千问.

### 左递归

左递归是编译原理和形式语言理论中的一个概念，特别是在上下文无关文法（Context-Free Grammar, CFG）的范畴内讨论时。当一个非终结符（即文法符号，代表语言结构的抽象单元，通常用大写字母表示，如 A、B）可以通过一条或多条产生式直接或间接地推导出以自己为开头的句型（即符号串，包括终结符和非终结符的组合），我们就说这个非终结符存在左递归。

具体来说，左递归分为两种类型：

1. 直接左递归：如果一个非终结符A的某个产生式形如 A → Aα，其中α是终结符或非终结符的任意组合（可能为空），那么A直接左递归。
2. 间接左递归：如果通过一系列产生式可以追溯到一个非终结符直接或间接地以自己为开始的情况，例如，若存在非终结符A和B，且有A → Bβ 和 B → Aγ 或其他形式使得可以从A出发经过若干步推导回到A，那么A存在间接左递归。

左递归在编写编译器的语法分析器时是个问题，因为它可能导致解析器陷入无限循环。因此，在实现语法分析时，通常需要先消除文法中的左递归，常见的方法包括转换产生式来避免这种自我引用的形式，保证算法的收敛性和效率。消除左递归后，解析器才能有效地解析输入串，确定其是否符合文法规则。

> 以上关于左递归的解释来源于通义千问.

> ANTLR4可以自动将直接左递归重写成了等价的非左递归形式, 对于间接左递归是无法处理的. 对于重写可以举个例子:
> 例如: `a: a '+' a | NUM;`是左递归的, 可以重写成`a: NUM ax?; ax: '+' NUM ax;`

### LLK

LLK文法是编译原理中的一个概念，其中“LLK”通常指的是LL(k)文法，这里的LL是指一种自上而下的解析策略，而(k)表示解析时向前查看的符号数量。在编译器设计中，文法是用来描述编程语言或形式语言的规则系统，而LL(k)文法是一种上下文无关文法（Context-Free Grammar, CFG），其特点是可以使用一个左递归的解析器来解析，同时在做出每个归约步骤的决策时，需要查看输入符号流中接下来的k个符号来决定如何进行。

具体来说：
- “L”表示解析器是采用从左到右扫描输入符号串的策略。
- 第二个“L”意味着在解析过程中使用的是左递归的语法，即产生式的左部至少有一个非终结符可以推导出自身加上一些其他符号的规则。实际应用中，为了效率和避免无限循环，通常会对原始文法进行改造以消除直接左递归。
- “K”是一个自然数，表示解析器在决定下一个动作之前能查看输入中的多少个符号。这决定了解析器的确定性，较大的k值可以使解析器处理更复杂的语言结构，但也会增加实现的复杂性和解析时间。

> 以上关于LLK的解释来源于通义千问.