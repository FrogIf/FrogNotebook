---
title: IDA*算法
author: frogif
date: 2022-05-10
---

# IDA*算法

## 概述

IDA\*算法, 英文叫"Iterative deepening A\*", 即迭代加深的A\*搜索算法. 是用来搜索从指定状态到达目标状态的路径的算法. 该算法由两个算法复合而成, 分别是: ID(迭代加深)算法和A*(有启发函数的广度优先搜索).

本文是在学习魔方还原的两阶段算法时, 因为两阶段算法的最小步搜索采用的就是IDA\*, 所以才整理的这篇文章. 因此文中的所有示例都是对树进行搜索, 没有介绍图搜索, 也就没有涉及对已遍历节点(close_set)和未遍历节点(open_set)的相关介绍, 各个搜索算法的细节也没有介绍. 对于这些算法的详细内容, 可以查阅文末[Reference](#reference)

迭代加深算法本质上是深度优先搜索, 而单独的A\*算法是有启发函数的广度优先搜索. 所以本文直接把这些涉及的搜索都介绍一遍吧:

* 深度优先搜索
* 广度优先搜索
* ID-迭代加深搜索
* A\*-有启发函数的广度优先搜索
* IDA\*-有启发函数的迭代加深搜索

> 其实还有启发式搜索, 最佳优先搜索

下面的介绍中, 我主要围绕同一个问题, 尝试使用不同的算法进行解决, 随着求解规模的不断增加, 我们会看到最后只有IDA\*算法能应对所有的规模.

## 深度优先搜索

深度优先搜索算法(Depth-First-Search，DFS)是一种用于遍历或搜索树或图的算法。这个算法会尽可能深地搜索树的分支。当节点v的所在边都己被探寻过，搜索将回溯到发现节点v的那条边的起始节点。这一过程一直进行到已发现从源节点可达的所有节点为止。如果还存在未被发现的节点，则选择其中一个作为源节点并重复以上过程，整个进程反复进行直到所有节点都被访问为止.(来源[wiki百科](https://zh.wikipedia.org/zh-cn/%E6%B7%B1%E5%BA%A6%E4%BC%98%E5%85%88%E6%90%9C%E7%B4%A2))

下面直接通过代码来说明, 下面的代码解决了这样一个问题:

把正整数n分解为3个不同的正整数, 如: 6 = 1 + 2 + 3, 排在后面的数必须大于等于前面的数, 输出所有方案.(来源[OI-wiki](https://oi-wiki.org/search/dfs/))

```java
    public static void main(String[] args){
        int len = 3;
        dfsSearch(6, 0, 1, new int[len], len);
    }

    /**
     * 把正整数num分解为3个不同的正整数, 如: 6 = 1 + 2 + 3, 排在后面的数必须大于等于前面的数, 输出所有方案.
     * @param num 需要分解的正整数
     * @param min 最小值
     * @param depth 搜索深度
     * @param arr 结果数组
     * @param limit 最大深度
     */
    private static void dfsSearch(int num, int min, int depth, int[] arr, int limit){
        if(num == 0){
            System.out.println(Arrays.toString(arr));
        }else if(depth <= limit){
            for(int j = min; j <= num; j++){
                arr[depth - 1] = j;
                dfsSearch(num - j, j, depth + 1, arr, limit);
            }
        }
    }
```

## 广度优先搜索

广度优先搜索(Breadt-First-Search,BFS), 又名宽度优先搜索. 就是一层一层的遍历, 同一深度的一层遍历完成之后, 再遍历下一层. 迪杰斯特拉(Dijkstra)算法等底层都是基于广度优先搜索.

下面通过一个例子, 来说明广度优先算法. 

我们给出一串数字: 1, 7, 8, 9, 显然这串数字可以生成所有的正整数, 那么, 对于每一个生成的正整数, 最短的生成方式是由几个数字组成呢?

例如: 10 = 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1, 同时 10 = 9 + 1, 所以10最短可以由上面的2个元素生成. 下面的程序会列出1 -- 60所有的正整数的最短生成数.

```java
    public static void main(String[] args){
        int maxRange = 60;
        int[] steps = buildMinStepTable(maxRange);
        for(int num = 0; num < maxRange; num++){
            System.out.println(num + 1 + " --- " + steps[num]);
        }
    }

    private final static int[] moves = { 1, 7, 8, 9 };

    /**
     * 构建最小步表格
     * 由moves中的元素重复相加, 组成一系列数, 求出[1,maxRange]范围内, 每个数需要的最少moves元素个数
     */
    private static int[] buildMinStepTable(int maxRange){
        Queue<Integer> queue = new LinkedList<>();
        int[] steps = new int[maxRange];
        queue.offer(0);
        int depth = 0;
        while(!queue.isEmpty()){
            depth++;
            int size = queue.size();
            while(size > 0){ // 遍历当前层的所有元素, 如果等于0, 说明当前层遍历完成了, 跳出循环, 深度加1
                Integer node = queue.poll();
                size--;
                for (int move : moves) {
                    int next = node + move;
                    if(next <= maxRange){
                        if(steps[next - 1] == 0){
                            steps[next - 1] = depth;
                        }
                        queue.offer(next);  // 将下一层的元素放入队列中
                    }
                }
            }
        }
        return steps;
    }
```

程序运行结果中:

```
...
54 --- 6
55 --- 7
56 --- 7
57 --- 7
58 --- 7
59 --- 7
60 --- 7
```

例如, 上面最后一行, 60可以由{ 1, 7, 8, 9 }中的元素通过最少7次相加得到. 

> 这里只是为了说明BFS程序才这么写的, 这个程序运行速度确实有点慢, 当maxRange=100时, 等了很久也没有结果.

那么, 具体是哪7个数相加呢? 我们可以将上面这段程序修改一下, 试试:

```java
    public static void main(String[] args){
        int target = 60;
        LinkedList<Integer> path = minStepSearch(target);
        if(path != null){
            System.out.print(0);
            for (Integer m : path) {
                System.out.print(" + " + m);
            }
            System.out.println(" = " + target);
        }
    }

    private final static int[] moves = { 1, 7, 8, 9 };

    private static LinkedList<Integer> minStepSearch(int targetSum){
        Queue<Node> queue = new LinkedList<>();
        queue.offer(new Node(0, 0, 0));
        while(!queue.isEmpty()){
            Node parent = queue.poll();
            for (int move : moves) {
                int next = move + parent.value;
                Node node = new Node(move, next, parent.depth + 1);
                node.parent = parent;
                if(next == targetSum){
                    return buildPath(node);
                }else if(next < targetSum){
                    queue.offer(node);
                }
            }
        }
        return null;
    }

    private static LinkedList<Integer> buildPath(Node tail){
        LinkedList<Integer> path = new LinkedList<>();
        Node cursor = tail;
        while(cursor.parent != null){
            path.addFirst(cursor.move);
            cursor = cursor.parent;
        }
        return path;
    }

    private static class Node{
        private Node parent; // 当前节点的父节点
        private final int value; // 当前节点累加值
        private final int move; // 当前节点代表的移动步数
        private final int depth;  // 当前节点到起始节点的距离

        public Node(int move, int value, int depth) {
            this.value = value;
            this.move = move;
            this.depth = depth;
        }
    }
```

这段程序也是广度优先搜索, 虽然和上面的有些不一样. 当求60的最小步时, 很快就可以得到结果:

```
0 + 7 + 8 + 9 + 9 + 9 + 9 + 9 = 60
```

但是, 这个程序空间复杂度是很高的, 当求150的最小步时, 在我的电脑上, 这段程序直接报错:```java.lang.OutOfMemoryError: Java heap space```. 我们可计算一下, 150的解是```9 + 8 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 7 = 150```, 是17步. 广度优先搜索每一步的节点都要存储, 所以, 深度1的节点有4个, 深度2的节点有```4^2=16```个, 深度3的节点有```4^3=64```个, ..., 深度17的节点有```4^17=17179869184```, 而所有节点总数为: ```4^1+4^2+4^3+4^3+4^4+4^5+4^6+4^7+4^8+4^9+4^10+4^11+4^12+4^13+4^14+4^15+4^16+4^17=22906492308```, 这个程序的空间复杂度是指数级的!

## 迭代加深搜索

迭代加深是一种每次限制搜索深度的深度优先搜索. 它的本质还是深度优先搜索, 只不过在搜索的同时带上了一个深度d, 当d达到设定的深度时就返回, 一般用于找最优解. 如果一次搜索没有找到合法的解, 就让设定的深度加1, 重新从根开始. 迭代加深就类似于用DFS方式实现的BFS, 它的空间复杂度相对较小.

我们接着上一节的问题, 由于广度优先搜索在上面找最小步的时候, 空间复杂度是指数级的, 所以这里我们尝试用迭代加深算法进行来解决这个问题.

```java
    public static void main(String[] args){
        int origin = 0;
        int target = 150;
        LinkedList<Integer> path = IDSearch(origin, target);
        if(path != null){
            System.out.print(origin);
            for (Integer m : path) {
                System.out.print(" + " + m);
            }
            System.out.println(" = " + target);
        }
    }

    private final static int[] moves = { 1, 7, 8, 9 };

    /**
     * 搜索经过moves中的动作, 从originalState状态到达targetState状态的最短路径
     * 或者说, targetState = originalState + m1 + m2 + ..., 求这个最短的序列{m1, m2, m3, ... }
     */
    public static LinkedList<Integer> IDSearch(int originalState, int targetState){
        int maxDepth = (int) Math.ceil((targetState - originalState) / 1.0); // 1.0是moves的最小值
        int depth = 1;
        while(depth < maxDepth){
            LinkedList<Integer> path = doSearch(originalState, targetState, 0, depth);
            if(path != null){
                return path;
            }
            depth++;
        }
        return null;
    }

    public static LinkedList<Integer> doSearch(int origin, int target, int depth, int limit){
        if (depth <= limit) {
            for (int move : moves) {
                int result = origin + move;
                if (result == target) { // 如果找到
                    LinkedList<Integer> path = new LinkedList<>();
                    path.add(move);
                    return path;
                }else{
                    LinkedList<Integer> path = doSearch(result, target, depth + 1, limit);
                    if (path != null) { // 如果找到
                        path.addFirst(move);
                        return path;
                    }
                }
            }
        }
        return null;
    }
```

> 注意, 该算法可以指定起始搜索深度的, 例程中没有指定, 而是直接从深度1开始搜索.

上面例程运行结果是:

```
0 + 7 + 8 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 + 9 = 150
```

迭代加深搜索的缺点是会重复搜索, 当一个深度下没有搜索到结果, 深度加深后, 要再次从头开始搜索. 这个程序的执行效率其实也不高, 在计算150的最小路径时, 也是需要些时间的.

## A*

采用广度优先搜索策略, 在搜索过程中使用启发函数, 即有大致方向的向前进虽然目标有时候不是很明确. 经常用于有确切的目标时, 进行最短路径或者较短路径搜索.

A\*是算法通过下面这个函数来计算每个节点的优先级:

$$f(n) = g(n) + h(n)$$

其中, 

* $f(n)$ -- 从初始状态到目标状态的估测代价
* $g(n)$ -- 从初始状态到当前状态的代价(已确定)
* $h(n)$ -- 启发函数, 从当前状态到目标状态的估测代价

在A\*算法中, 每次从优先队列中选取$f(n)$最小(优先级最高)的节点作为下一个待遍历的节点.

A\*算法的关键在于启发函数, 启发函数的优劣直接影响到A\*算法的效率.

* 在极端情况下，当启发函数h(n)始终为0，则将由g(n)决定节点的优先级，此时算法就退化成了Dijkstra算法
* 如果h(n)始终小于等于节点n到终点的代价，则A\*算法保证一定能够找到最短路径。但是当h(n)的值越小，算法将遍历越多的节点，也就导致算法越慢
* 如果h(n)完全等于节点n到终点的代价，则A*算法将找到最佳路径，并且速度很快。可惜的是，并非所有场景下都能做到这一点。因为在没有达到终点之前，我们很难确切算出距离终点还有多远
* 如果h(n)的值比节点n到终点的代价要大，则A*算法不能保证找到最短路径，不过此时会很快
* 在另外一个极端情况下，如果h(n)相较于g(n)大很多，则此时只有h(n)产生效果，这也就变成了最佳优先搜索

对于网格形式的图, 有以下这些启发函数可以使用:

* 如果图形中只允许朝上下左右四个方向移动, 则可以使用曼哈顿距离(Manhattan distance)
* 如果图形中允许朝八个方向移动, 则可以使用对角距离
* 如果图形中允许朝任何方向移动, 则可以使用欧几里得距离(Euclidean distance)

这里, 我们接着上面的程序, 通过运行程序, 发现在查询150的最短路径时, 程序运行已经变得非常慢了. 接下来, 我们用A\*算法尝试解决这个问题.

```java
    public static void main(String[] args){
        int origin = 0;
        int target = 150;
        LinkedList<Integer> path = minStep(origin, target);
        if(path != null){
            System.out.print(0);
            for (Integer m : path) {
                System.out.print(" + " + m);
            }
            System.out.println(" = " + target);
        }
    }

    private static final int[] moves = { 1, 7, 8, 9 };
    private static final int MAX_MOVE = 9; // moves的最大值

    /**
     * 搜索经过moves中的动作, 从originalState状态到达targetState状态的最短路径
     * 或者说, targetState = originalState + m1 + m2 + ..., 求这个最短的序列{m1, m2, m3, ... }
     */
    private static LinkedList<Integer> minStep(int originalState, int targetState){
        PriorityQueue<Node> queue = new PriorityQueue<>((a, b) -> {
            int totalDistanceA = distanceEstimate(a.value, targetState) + a.depth;
            int totalDistanceB = distanceEstimate(b.value, targetState) + b.depth;
            return Integer.compare(totalDistanceA, totalDistanceB);
        });
        Node root = new Node(0, originalState, 0);
        queue.offer(root);
        while(!queue.isEmpty()){
            Node parent = queue.poll();
            for(int move : moves){
                int next = move + parent.value;
                Node node = new Node(move, next, parent.depth + 1);
                node.parent = parent;
                if(next == targetState){ // 找到最短路径
                    return buildPath(node);
                }else if(next < targetState){
                    queue.offer(node);
                }
            }
        }
        return null;
    }

    /**
     * 估计当前状态到目标状态的距离, 这个距离一定小于等于实际距离
     * 这个就是启发函数
     */
    private static int distanceEstimate(int originState, int targetState){
        return (targetState - originState) / MAX_MOVE;
    }

    private static LinkedList<Integer> buildPath(Node tail){
        LinkedList<Integer> path = new LinkedList<>();
        Node cursor = tail;
        while(cursor.parent != null){
            path.addFirst(cursor.move);
            cursor = cursor.parent;
        }
        return path;
    }

    private static class Node{
        private Node parent; // 当前节点的父节点
        private final int value; // 当前节点累加值
        private final int move; // 当前节点代表的移动步数
        private final int depth;  // 当前节点到起始节点的距离
        public Node(int move, int value, int currentToRootDistance) {
            this.move = move;
            this.value = value;
            this.depth = currentToRootDistance;
        }
    }
```

这段程序实现的功能和上一节的迭代加深算法一致, 但是效率要高很多. 对于150求和的最小步, 这个算法用时3ms, 而上面的迭代加深算法需要用时40717ms.

## IDA*

通过上面几种算法的介绍, 我们知道, 对于同一个问题, 这几个算法都可以解决, 但是随着规模的不断增大, 有些算法就力不从心了. 最终看到A\*算法可以很好的应对, 即使规模增大.

IDA\*算法是迭代深度加深和A\*算法的的复合, 其应用场景和A\*算法也基本一致. 两者各有优劣:

* A\*算法的缺点: 需要使用大量的空间存储中间状态;
* IDA\*算法的缺点: 就是ID(迭代加深)算法的缺点, 会重复搜索, 回溯过程中每次depth变大, 都要从头搜索.
  * 但是IDA\*算法不需要存储中间节点, 所以会节省空间
  * IDA\*算法不需要排序.

还有些情况下, 则只能使用IDA\*, 例如搜索宽度无限大(详见: [埃及分数](https://loj.ac/p/10022)).

这次, 不如我们将上面的求解规模再次增大, 我们求解100000000由{1, 7, 8, 9}相加的最短路径.

对于A\*算法, 上面的程序会运行一段时间, 然后抛出OOM.

下面使用IDA\*算法实现:

```java
    public static void main(String[] args){
        int origin = 0;
        int target = 100000000;
        LinkedList<Integer> path = minStep(origin, target);
        if(path != null){
            System.out.print(0);
            for (Integer m : path) {
                System.out.print(" + " + m);
            }
            System.out.println(" = " + target);
        }
    }

    private static final int[] moves = { 1, 7, 8, 9 };
    private static final int MAX_MOVE = 9; // moves的最大值
    private static final int MIN_MOVE = 1; // moves的最小值

    /**
     * 搜索经过moves中的动作, 从originalState状态到达targetState状态的最短路径
     * 或者说, targetState = originalState + m1 + m2 + ..., 求这个最短的序列{m1, m2, m3, ... }
     */
    private static LinkedList<Integer> minStep(int originState, int targetState){
        double maxDepth = Math.ceil((targetState - originState) * 1.0 / MIN_MOVE);
        int depth = distanceEstimate(originState, targetState) - 1; // 用启发函数直接算出深度下界
        while(depth <= maxDepth){
            LinkedList<Integer> path = dfsWithHFunction(originState, targetState, depth);
            if(path != null){
                return path;
            }
            depth++;
        }

        return null;
    }

    // 带有启发函数的深度优先
    private static LinkedList<Integer> dfsWithHFunction(int originState, int targetState, int depth){
        Stack<Node> stack = new Stack<>();
        Node start = new Node(originState, originState, 0);
        stack.push(start);
        while(!stack.isEmpty()){
            Node parent = stack.pop();
            for(int i = moves.length - 1; i >= 0; i--){
                int m = moves[i];
                int sum = parent.sum + m;
                Node node = new Node(sum, m, parent.depth + 1);
                node.parent = parent;
                if(sum == targetState){
                    return buildPath(node);
                }else if(sum < targetState && distanceEstimate(sum, targetState) + node.depth <= depth){  // 这里会进行判断, 不符合深度要求的, 直接会进行剪枝
                    stack.push(node);
                }
            }
        }
        return null;
    }

    private static LinkedList<Integer> buildPath(Node tail){
        LinkedList<Integer> path = new LinkedList<>();
        Node cursor = tail;
        while(cursor.parent != null){
            path.addFirst(cursor.move);
            cursor = cursor.parent;
        }
        return path;
    }

    /**
     * 启发函数
     */
    private static int distanceEstimate(int originState, int targetState){
        return (targetState - originState) / MAX_MOVE;
    }

    private static class Node{
        private final int sum;
        private final int move;
        private final int depth;
        private Node parent;
        public Node(int sum, int move, int depth) {
            this.sum = sum;
            this.move = move;
            this.depth = depth;
        }
    }
```

> 注意, 考虑到规模过大, 深度过深, 如果采用递归形式, 会创建大量的栈帧, 占用大量内存, 有可能造成Stack Overflow, 所以这里DFS采用的是非递归形式.

这个程序对于100000000的求解, 运行效率也很高, 本地测试需要1617ms, 主要是不会出现内存溢出.

接触到IDA\*算法, 是在学习魔方两阶段还原算法的时候, 两阶段算法中, 定义了18种不同的魔方移动(R, R', R2, U, U', U2, ...), 要求解魔方的一个打乱状态A到还原状态B的最短路径, 我们可以把它抽象为一棵树, 从A状态开始, 不断搜索, 直至找到B状态. 现在已经证明了从任意打乱状态到达阶段一的目标状态至多需要12步(阶段二最多需要), 假设12步, 那么, 这棵树的节点总数是:```18^1+18^2+18^3+18^4+18^5+18^6+...+18^12=1224880286215950=1.22e15```这个规模是相当恐怖的, IDA\*算法是解决这个问题的最佳方案.

## 关于几个数和的最短等式

关于这个问题, IDA\*算法也许也不是最优解法, 这里只是为了说明这几个算法的逻辑和特点. 我们把几个数和的最短等式抽象成了一棵树, 每一个和都是树中的一个节点, 然后采用上述几种不同的方式在这棵树中进行查找. 其实, 换一个角度, 也许可以有更好的解决这个问题的办法, 我们没有必要将其抽象为一棵树, 我的想法是也许可以用线性规划来求解:

另$S$为目标的和, $S=9x_1+8x_2+7x_3+x_4$, 则有如下不等式:

$$
9x_1+8x_2 \leq S \\
8x_2+7x_3 \leq S \\
7x_3+x_4 \leq S \\
S=9x_1+8x_2+7x_3+x_4 \\
x_1 \geq 0 \\
x_2 \geq 0 \\
x_3 \geq 0 \\
x_4 \geq 0
$$

求$x_1 + x_2 + x_3 + x_4$的最小值. 不知道行不行, 也不知道这个是不是就是最优方案.

## Reference

* https://oi-wiki.org/search/iterative/
* https://codeantenna.com/a/Sn0OKmNU4R
* https://blog.csdn.net/u013009575/article/details/17140915
* https://zh.wikipedia.org/zh-cn/%E6%B7%B1%E5%BA%A6%E4%BC%98%E5%85%88%E6%90%9C%E7%B4%A2
* https://zhuanlan.zhihu.com/p/54510444