# 群

**半群**

1. 二元运算
2. 结合律

**幺元**

* $\forall a \in S, e_1 \circ a = a$, $e_1$称为左幺元, $\forall a \in S, a \circ e_2 = a$, $e_2$称为右幺元
* 若$e = e_1 = e_2$, 称$e$为幺元/单位元

幺半群 = 幺元 + 半群

> 幺半群中的幺元是惟一的

**逆元**

* 若$a_1 \circ a = e$, $a_1$称为左逆元; 若$a \circ a_2 = e$, $a_2$称为右逆元
* 若$b = a_1 = a_2$, 称$b = a ^ {-1}$为逆元

**群**

1. 运算封闭
2. 结合律
3. 幺元
4. 逆元

交换群(阿贝尔群) = 交换律 + 群

性质:

1. 消去律: $\forall a, b, c \in G, ab = ac \Rightarrow b = c$
2. 群中任意元素的逆元唯一
3. $\forall a,b \in G$, $ax = b$和$xa = b$的解均存在且唯一

群 = 性质3 + 半群
群 = 有限半群 + 消去律(性质1)

**重复运算**

第一种表达:

* $\begin{matrix} n \\ \overbrace{aa \cdots a} \end{matrix} = a^n$
* $a^{-n} = (a^{-1})^n$
* $a^0 = e$

第二种表达:

* $\begin{matrix} n \\ \overbrace{aa \cdots a} \end{matrix} = na$
* $-na = n (-a)$
* $0a = 0$

**群的阶**

定义: 群$G$中所含元素个数$|G|$称为群$G$的阶

如下概念:
* $|G|$有限 --> 有限群; $|G|$无限 --> 无限群
* 群表: 对于有限群, 可以列出所有元素与所有元素的运算结果, 构成一张表

**群中元素的阶**

定义: 群$G$中元素$a$, 若$\exists k \in N, a^k = e$, 则$min \{ k \in N | a^k = e \}$称为$a$的阶

* 若$\forall k \in N, a^k \neq e$, 则元素$a$的阶为无穷

如下性质:

* $a$的阶是无穷 $\Longleftrightarrow$ $m, n \in Z, \forall m \neq n, a^m \neq a^n$
* $\forall h \in Z, a^h = e \Longleftrightarrow d|h$
* $\forall m,n \in Z, a^m = a^n \Longleftrightarrow d|(m - n) \Longleftrightarrow m \equiv n(mod a)$
* $k \in N$, $a^k$的阶为$d/(d, k)$, 这里$(d,k)$为$d$和$k$的最大公约数
* $k \in N$, $a^k$的阶为$d$ $\Longleftrightarrow$ $(d,k) = 1$

> $a|b$表示a可以被b整除, 即$b\, mod \, a = 0$

另一个关于阶的定义:

$a$, $b$是群$G$中的元素, 若满足以下条件:

1. $a$的阶是$m$, $b$的阶是$n$
2. $ab = ba$
3. $(m,n) = 1$

则, $ab$的阶为$mn$