---
title: 欧几里得算法
author: frogif
date: 2022-05-15
---

# 欧几里得算法

## 概述

欧几里得算法, 又称辗转相除法, 是用来求最大公约数的. 欧几里得算法只需要使用递归和减法:

$$
gcd(a, b) = 
    \left\{
        \begin{array}{ll}
            a \  (a = b) \\
            gcd(a - b, b) \  (b < a) \\
            gcd(a, b - a) \  (a < b)
        \end{array}
    \right.
$$

## 求最大公约数

根据上面的定义, 很容易实现:

```java
    public static int gcd(int a, int b){
        if(a == b){
            return a;
        }else if(a > b){
            return gcd(b, a - b);
        }else{
            return gcd(a, b - a);
        }
    }
```

举个例子, 假设 a = 18, b = 4, 应用上面的算法有:

```
step1: 18 > 4 --> gcd(4, 18 - 4) --> 4, 14
step2: 4 < 14 --> gcd(4, 14 - 4) --> 4, 10
step3: 4 < 10 --> gcd(4, 10 - 4) --> 4, 6
step4: 4 < 6 --> gcd(4, 6 - 4) --> 4, 2
step5: 4 > 2 --> gcd(2, 4 - 2) --> 2, 2
step6: 2 == 2 --> 2
```

从这个例子中, 可以发现一个问题, 整个计算过程, step1 -- step4 在反复的减去b=4. 这里是可以优化的. 1-4这个过程实际就是18减去4个4之后剩余2, 然后再用剩余的这个2与b=4去求最大公约数. 因此可以优化为取余运算! 代码如下:

```java
    /**
     * 最大公约数求取方法优化
     *    原始欧几里得算法中的反复相减可以用求余运算代替
     */
    private static int gcdOpt(int a, int b){
        if(b == 0){
            return a;
        }else if(a > b){
            return gcdOpt(b, a % b);
        }else{
            return gcdOpt(a, b % a);
        }
    }
```

这里还有一个问题, 我们可能会有递归调用深度过深, 栈帧创建过多, 可能导致内存消耗过大的问题, 那么, 就需要把递归方式改为循环的方式, 代码如下:

```java
    /**
     * 非递归形式的最大公约数求取算法
     */
    private static int gcdLoop(int a, int b){
        int t;
        if(b > a){   // 交换两个数, 使得a始终大于b
            t = a;
            a = b;
            b = t;
        }
        while(b > 0){
            t = a % b;
            a = b;
            b = t;
        }
        return a;
    }
```

还有没有优化空间呢? 有的, 上面程序中使用了取余运算, 实际上, 可以使用位运算来更好的实现. 当然, 为了实现通过位运算求最大公约数, 就不是欧几里得算法了, 这个算法叫Stein算法:

```
获取两个正整数的最大公约数:
1. a, b都是偶数, 则gcd(a, b) = 2 * gcd(a/2, b/2)
2. a是偶数, b是奇数, 则gcd(a, b) = gcd(a/2, b)
3. a是奇数, b是偶数, 则gcd(a, b) = gcd(a, b/2)
4. 如果a, b都是奇数, 则a - b是偶数, gcd(a, b) = gcd(|a - b|, min(a, b))
```

先给出一个易懂一点的实现:

```java
    private static int gcdStein(int a, int b){
        if(a == 0){ return b; }
        if(b == 0){ return a; }

        if(a % 2 == 0 && b % 2 == 0){
            return 2 * gcdStein(a / 2, b / 2);
        }
        if(a % 2 == 0){
            return gcdStein(a / 2, b);
        }
        if(b % 2 == 0){
            return gcdStein(a, b / 2);
        }
        if(a < b){
            int t = a;
            a = b;
            b = t;
        }
        return gcdStein(a - b, b);
    }
```

然后给出一个极简,非递归,位运算的实现:

```java
    private static int gcdBit(int a, int b){
        if(a == 0){ return b; }
        if(b == 0){ return a; }

        int k = 0;
        while((a & 1) == 0 && (b & 1) == 0){
            k++;
            a = a >> 1;
            b = b >> 1;
        }

        while(a > 0){   // 每次循环开始, a, b必然不会都是偶数, 每次循环开始b一定不为0
            while((a & 1) == 0){
                a = a >> 1;
            }

            while((b & 1) == 0){
                b = b >> 1;
            }

            if(a < b){
                b = b - a;
            }else{
                a = a - b;
            }
        }

        return b << k;
    }
```

## 扩展欧几里得算法

扩展欧几里得算法除了可以求解a, b的最大公约数g, 还能找到满足贝祖等式ax + by = g的两个整数x, y. 关于贝祖等式的定义如下:

对于任何整数a, b, m, 关于未知数x和y的线性丢番图方程:

$$
ax + by = m
$$

称为贝祖等式(也叫裴蜀等式). 当且仅当m是a和b的最大公约数g的倍数时(m % gcd(a, b) == 0), 贝祖等式有解, 且有无穷多解. 贝祖等式的解可以用扩展欧几里得算法求得.

下面, 介绍一下, 通过扩展欧几里得算法, 如何求解贝祖等式.

$$
gcd_{ex}(a, b) = 
    \left\{
        \begin{array}{ll}
            (a, 1, 0) \  (b = 0) \\
            (g, y', x' - y'\lfloor a/b \rfloor )\ (其中, (g, x', y') = gcd_{ex}(b, a\ mod\ b)) (b \neq 0)
        \end{array}
    \right.
$$

需要注意的是, 上面的等式中, $a > b$.

接下来, 我们用代码实现这个等式, 依旧先是递归形式:

```java
    private static int[] gcdEx(int a, int b){
        int t;
        if(a < b){
            t = a;
            a = b;
            b = t;
        }
        if(b > 0){
            int[] arr = gcdEx(b, a % b);
            return new int[]{ arr[0], arr[2], arr[1] - arr[2] * (a / b) };
        }else{
            return new int[]{ a, 1, 0 };
        }
    }
```

当我们输入a=35, b=14时, 输出的结构是: [7, 1, -2], 也就是: ```1 * 35 + -2 * 14 = 7```, 这就是```35x + 14y = g```的一个解, 其中7是35和14的最大公约数.

扩展欧几里得算法的非递归形式没有想出来, 下面这段代码直接将《计算机程序设计艺术-第2卷-半数值算法》4.5.2节中的内容照着步骤实现出来了:

```java
    private static int[] gcdExNoRe(int a, int b){
        if(a < b){
            a = a ^ b;
            b = a ^ b;
            a = a ^ b;
        }

        int[] u = new int[]{ a, 1, 0 };
        int[] v = new int[]{ b, 0, 1 };
        int q;
        int[] t;
        while(v[0] > 0){
            q = u[0] / v[0];
            t = new int[]{ u[0] - v[0] * q, u[1] - v[1] * q, u[2] - v[2] * q };
            u = v;
            v = t;
        }
        return u;
    }
```

扩展欧几里得算法可以解决一个有趣的问题(来源: [同构-编程中的数学](https://github.com/liuxinyu95/unplugged)).

问题是: 有两个容积不同的瓶子, 大瓶子A容积为a升, 小瓶子B容积为b升. 有以下6种操作:

1. A瓶装满水;
2. B瓶装满水;
3. A瓶中水倒掉;
4. B瓶中水倒掉;
5. 将大瓶子A中的水倒入小瓶子B中, 直至B瓶已满或者A瓶已空;
6. 将小瓶子B中的水倒入大瓶子A中, 直至A瓶已满或者B瓶已空.

现在, 我们要得到c升水, 问可不可能, 如果可能, 求出倒水步骤.

首先, 手动实验一个. A容积35升, B容积14升, 我们要取7升水, 应该如何操作? 步骤如下:

```
1. 将A中装满水 -- A 35, B 0
2. 将A中的水倒入B中 -- A 21, B 14
3. 将B中的水倒掉 -- A 21, B 0
4. 将A中的水倒入B中 -- A 7, B 14
5. 将B中的水倒掉 -- A 7, B 0
6. 结束
```

上面, 我们知道```1 * 35 + -2 * 14 = 7```, 对应这里的解决方案, 就是倒掉B两次, 装满A一次. 扩展欧几里得算法可以用来解决这个问题. 

1. 通过扩展欧几里得算法, 求得$ax + by = gcd(a, b)$的解$(g, x_0, y_0)$;
2. 判断$g$是否可以整除目标水量$t$;
3. 如果不能整除, 则无解.
4. 如果可以整除, 则A,B分别倒满/倒空的次数为$x_0 * t/g$和$y_0 * t/g$

实现代码如下:

```java
    public static void main(String[] args){
        final int ACapacity = 35; // A的容积
        final int BCapacity = 14; // B的容积
        final int targetWater = 7; // 目标水量
        int[] result = gcdEx(ACapacity, BCapacity);
        if(targetWater % result[0] > 0){
            System.out.println("无解");
        }else{
            int f = targetWater / result[0];
            int aStepCount = result[1] * f;
            int bStepCount = result[2] * f;
            step(aStepCount, bStepCount, 0, 0, ACapacity, BCapacity);
        }
    }

    private static int[] gcdEx(int a, int b){
        int t;
        if(a < b){
            t = a;
            a = b;
            b = t;
        }
        if(b > 0){
            int[] arr = gcdEx(b, a % b);
            return new int[]{ arr[0], arr[2], arr[1] - arr[2] * (a / b) };
        }else{
            return new int[]{ a, 1, 0 };
        }
    }


    private static void step(int x, int y, int a, int b, final int A, final int B){
        if(x == 0 && y == 0){
            System.out.println("finish");
            return;
        }
        if(x > 0 && a == 0){
            a = A;
            System.out.print("将A中装满水");
            x--;
        }else if(y > 0 && b == 0){
            b = B;
            System.out.print("将B中装满水");
            y--;
        }else if(x < 0 && a == A){
            a = 0;
            System.out.print("将A中的水倒掉");
            x++;
        }else if(y < 0 && b == B){
            b = 0;
            System.out.print("将B中的水倒掉");
            y++;
        }else if(y < 0){
            int moveVal = Math.min(B - b, a); // 判断B中剩余的空间和A中现有水量哪个小
            b += moveVal;
            a -= moveVal;
            System.out.print("将A中的水倒入B中");
        }else if(x < 0){
            int moveVal = Math.min(A - a, b);
            b -= moveVal;
            a += moveVal;
            System.out.print("将B中的水倒入A中");
        }else{
            throw new IllegalStateException("未知的状况, a : " + a + ", b : " + b);
        }

        System.out.println(" -- A中有" + a + "升水, B中有" + b + "升水.");

        step(x, y, a, b, A, B);
    }
```

程序执行结果为:

```
将A中装满水 -- A中有35升水, B中有0升水.
将A中的水倒入B中 -- A中有21升水, B中有14升水.
将B中的水倒掉 -- A中有21升水, B中有0升水.
将A中的水倒入B中 -- A中有7升水, B中有14升水.
将B中的水倒掉 -- A中有7升水, B中有0升水.
finish
```

但是, 这段程序所得到的方案不是最优的, 甚至有点蠢. 例如, 还是35升和14升, 这时我们要取14升水. 根据前面的贝祖等式的结果```1 * 35 + -2 * 14 = 7```, 我们对等式两边同时乘以2就可以了, 即```2 * 35 + -4 * 14 = 14```, 也就是说, 我们需要倒满A杯子2次, 倒掉B杯子4次. 下面是程序执行结果:

```
将A中装满水 -- A中有35升水, B中有0升水.
将A中的水倒入B中 -- A中有21升水, B中有14升水.
将B中的水倒掉 -- A中有21升水, B中有0升水.
将A中的水倒入B中 -- A中有7升水, B中有14升水.
将B中的水倒掉 -- A中有7升水, B中有0升水.
将A中的水倒入B中 -- A中有0升水, B中有7升水.
将A中装满水 -- A中有35升水, B中有7升水.
将A中的水倒入B中 -- A中有28升水, B中有14升水.
将B中的水倒掉 -- A中有28升水, B中有0升水.
将A中的水倒入B中 -- A中有14升水, B中有14升水.
将B中的水倒掉 -- A中有14升水, B中有0升水.
finish
```

但是, B杯子本身就是14升啊...

接下来, 对这个程序进行优化调整. 先讨论一下理论.

假设, 已知$ax + by = c$, 求该方程的通解.

首先, 对于方程$ax + by=g$, 我们可以通过扩展欧几里得算法得到一组整数解:$x_0, y_0$以及最大公约数$g$, 然后我们就知道了$c/g$. 所以我们就有了$ax + by = c$的一组特解:

$$
\left\{
    \begin{array}{ll}
        x_1 = x_0 \frac{c}{g}\\
        y_1 = y_0 \frac{c}{g}
    \end{array}
\right.
$$

然后, $ax + by = c$实际上是二元一次不定方程, 也叫丢番图方程(查了一下, 这是一个很深的问题), 其通解为:

$$
\left\{
    \begin{array}{ll}
        x = x_1 - k \frac{b}{g}\\
        y = y_1 + k \frac{a}{g}
    \end{array}
\right.
$$

其中, $k$为任意整数.

所以, 我们就有思路了. 首先, 通过扩展欧几里得算法, 可以得到特解$x_1$, $y_1$. 然后, 把$x = x_1 - k \frac{b}{g}$和$y = y_1 + k \frac{a}{g}$看做是两个一次函数, 我们要求$|x| + |y|$的最小值, 也就是两个一次函数的绝对值函数之和的最小值, 这是个分段函数, 总之, 就是能解. 可以直接基于上面的程序进行扩展. 完整代码如下:

```java
    public static void main(String[] args){
        final int ACapacity = 35; // A的容积
        final int BCapacity = 14; // B的容积
        final int targetWater = 14; // 目标水量
        int[] result = gcdEx(ACapacity, BCapacity);
        if(targetWater % result[0] > 0){
            System.out.println("无解");
            return;
        }else{
            int f = targetWater / result[0];
            int aStepCount = result[1] * f;
            int bStepCount = result[2] * f;
            step(aStepCount, bStepCount, 0, 0, ACapacity, BCapacity);
        }

        // ------最短步数方案-------
        System.out.println("----最佳方案----");
        int[] generalSolutionCoefficient = generalSolution(ACapacity, BCapacity, targetWater, result);
        int[] solution = searchMinSolution(generalSolutionCoefficient);
        step(solution[0], solution[1], 0, 0, ACapacity, BCapacity);
    }

    /**
     * 根据丢番图方程通解系数, 获取通解的最小值
     */
    private static int[] searchMinSolution(int[] gsc){
        int m = Math.max(Math.abs(gsc[0] / gsc[2]), Math.abs(gsc[1] / gsc[3])) + 1;
        int min = Integer.MAX_VALUE;
        int k = 0;
        for(int i = -m; i <= m; i++){
            int temp = Math.abs(gsc[0] - i * gsc[2]) + Math.abs(gsc[1] + i * gsc[3]);
            if(temp < min){
                min = temp;
                k = i;
            }
        }
        return new int[]{ gsc[0] - k * gsc[2], gsc[1] + k * gsc[3] };
    }

    /**
     * 根据扩展欧几里得算法得到的解, 生成通解系数
     * 返回通解系数数组:
     *      { x1, y1, b/g, a/g }
     */
    private static int[] generalSolution(int a, int b, int c, int[] gcdExResult){
        int g = gcdExResult[0];
        int x0 = gcdExResult[1];
        int y0 = gcdExResult[2];
        int x1 = x0 * c / g;
        int x2 = y0 * c / g;
        return new int[]{ x1, x2, b/g, a/g };
    }

    private static int[] gcdEx(int a, int b){
        int t;
        if(a < b){
            t = a;
            a = b;
            b = t;
        }
        if(b > 0){
            int[] arr = gcdEx(b, a % b);
            return new int[]{ arr[0], arr[2], arr[1] - arr[2] * (a / b) };
        }else{
            return new int[]{ a, 1, 0 };
        }
    }


    private static void step(int x, int y, int a, int b, final int A, final int B){
        if(x == 0 && y == 0){
            System.out.println("finish");
            return;
        }
        if(x > 0 && a == 0){
            a = A;
            System.out.print("将A中装满水");
            x--;
        }else if(y > 0 && b == 0){
            b = B;
            System.out.print("将B中装满水");
            y--;
        }else if(x < 0 && a == A){
            a = 0;
            System.out.print("将A中的水倒掉");
            x++;
        }else if(y < 0 && b == B){
            b = 0;
            System.out.print("将B中的水倒掉");
            y++;
        }else if(y < 0){
            int moveVal = Math.min(B - b, a); // 判断B中剩余的空间和A中现有水量哪个小
            b += moveVal;
            a -= moveVal;
            System.out.print("将A中的水倒入B中");
        }else if(x < 0){
            int moveVal = Math.min(A - a, b);
            b -= moveVal;
            a += moveVal;
            System.out.print("将B中的水倒入A中");
        }else{
            throw new IllegalStateException("未知的状况, a : " + a + ", b : " + b);
        }

        System.out.println(" -- A中有" + a + "升水, B中有" + b + "升水.");

        step(x, y, a, b, A, B);
    }
```

这时, 对于35升和14升, 取14升水. 就可以得到:

```
将B中装满水 -- A中有0升水, B中有14升水.
finish
```

> 上面很多内容都有省略, 丢番图方程通解相关, 两个绝对值函数之和的极值问题等等.

## Reference

* [同构-编程中的数学](https://github.com/liuxinyu95/unplugged)
* 计算机程序设计艺术-第2卷-半数值算法
* [二进制GCD算法解析](https://www.cnblogs.com/acxblog/p/7275977.html)