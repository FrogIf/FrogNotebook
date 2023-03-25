# 抽象代数


## 1. 群

### 1.1 幺半群

> S是一个集合, *是一个运算, (S, *)表示由一个集合和这个集合上的运算构成的"结构".

* 当运算*在集合S中是封闭的, 那么称这个运算为**二元运算**
* $(S, *)$ 为**幺半群** <==> 二元运算 + 结合律 + 单位元
  * $\forall x,y,z \in S, x * (y * z) = (x * y) * z$
  * $\exist e \in S, \forall x \in S, e * x = x * e = x$
* $(S, *)$ 作为幺半群, 如果满足交换律, 则称为**交换幺半群**
* $\clubsuit$ 若 $(S, \cdot)$ 是幺半群, 则单位元是唯一的.
* **广义结合律**: $x_1 \cdot x_2 \cdots x_n = (x_1 \cdot x_2 \cdots x_{n-1}) \cdot x_n$
  * $\clubsuit$ $x_1 \cdot x_2 \cdots x_n \cdot y_1 \cdot y_2 \cdots y_n = (x_1 \cdot x_2 \cdots x_n) \cdot (y_1 \cdot y_2 \cdots y_n)$
* 对于 $(S, \cdot)$, $x\in S, m, n \in N$, 有 $x^{m+n} = x^m \cdot x^n$
* 令 $(S, \cdot)$ 是一个幺半群, 若 $T \subset S$. 称 $(T, \cdot)$ 为 $(S, \cdot)$ 的**子幺半群**, 当且仅当满足以下条件:
    1. $e \in T$
    2. $\forall x, y \in T, x \cdot y \in T$
* 假设有两个幺半群: $(S, \cdot), (T, *)$, 且 $f: S \rightarrow T$ 是一个映射, 我们称 $f$ 是一个**幺半群同态**, 当且仅当满足:
    1. $\forall x, y \in S, f(x \cdot y) = f(x) * f(y)$
    2. $f(e) = e'$, 其中 $e$ 是 $S$ 的单位元, $e'$ 是T的单位元
* 假设 $(S, \cdot)$ 是幺半群, $A \subset S$ 是一个子集. 定义**由A生成的子幺半群**, 记作 $\langle A \rangle$, 是指S中所有包含了A的子幺半群的交集. 表示为: $\langle A \rangle = \bigcap \{ T \subset S : T \supset A, T \ is\ submonoid \}$
* $\clubsuit$ $\langle A \rangle$ 是包含了A的最小子幺半群
* 假设 $(S, \cdot)$, $(T, *)$ 是两个幺半群, 且 $f: S \rightarrow T$ 是一个映射, 我们称为**幺半群同构**, 当且仅当:
    1. $f$ 是一个双射
    2. $\forall x, y \in S, f(x \cdot y) = f(x) * f(y)$
    3. $f(e) = e'$, 其中 $e$ 是 $S$ 的单位元, $e'$ 是T的单位元
* $\clubsuit$ 若 $f: (S, \cdot) \rightarrow (T, *)$ 是幺半群同构, 则 $f^{-1}: T \rightarrow S$ 是有一个幺半群同态, 则 $f^{-1}$ 是幺半群同构


> 同构是一个等价关系.
> 什么是等价关系? 满足: 1. 反身性; 2. 对称性; 3. 传递性;
> 其他的等价关系还有: 相等, 全等, 相似等.

### 1.2 群

* **逆元**: 令 $(S, \cdot)$ 是一个幺半群, $x \in S$, 我们称x是可逆的, 当且仅当: $\exist y \in S, x \cdot y = y \cdot x = e$, 其中 $y$ 被称为 $x$ 的逆元, 记作 $x^{-1}$
* $\clubsuit$ $(S, \cdot)$ 是幺半群, 若 $x \in S$ 存在逆元, 则其逆元唯一.
* **群**: 幺半群 $(G, \cdot)$ 如果所有元素都是可逆的, 则称为一个群.
* $(G, \cdot)$ 是一个群, 当且仅当:
    1. $\cdot$ 是二元运算
    2. $\forall x, y, z \in G, x \cdot (y \cdot z)  = (x \cdot y) \cdot z$
    3. $\exist e \in G, \forall x \in G, x \cdot e = e \cdot x = x$
    4. $\forall x \in G, \exist y \in G, x \cdot y = y \cdot x = e$
* $\clubsuit$ $(G, \cdot)$ 是群, 令 $x \in G$, 则 $(x^{-1})^{-1}=x$
* $\clubsuit$ $(G, \cdot)$ 是群, 令 $x, y \in G$, 则 $(x \cdot y)^{-1} = y^{-1} \cdot x^{-1}$
* 若 $(G, \cdot)$ 是一个群, 当满足交换律时, 称它为**阿贝尔群**或**交换群**
* $\clubsuit$ 令 $(S, \cdot)$ 是一个幺半群, 令 $G$ 是所有可逆元素构成的子集, 则 $(G, \cdot)$ 是群
* **n阶一般线性群**: 所有 $n*n$ 可逆实矩阵构成的乘法群, 称为(实数上的)一般线性群, 记作: $(GL(n,\mathbb{R}), \cdot)$, 其中集合表示为: $GL(n, \mathbb{R}) = \{A \in M(n, \mathbb{R}) : det(A) \ne 0\}$
* **n阶特殊线性群**: 行列式为1的 $n*n$ 可逆实矩阵构成的乘法群, 称为(实数上的)特殊线性群, 记作: $(SL(n, \mathbb{R}), \cdot)$, 其中集合表示为: $SL(n, \mathbb{R}) = \{A \in M(n, \mathbb{R}) : det(A) = 1\}$
* 令 $(G, \cdot)$ 是一个群, 且 $H \subset G$. 称H是G的**子群**, 记作 $H < G$, 当且仅当:
    1. $e \in H$
    2. $\forall x, y \in H, x \cdot y \in H$
    3. $\forall x \in H, x^{-1} \in H$
* 上面子群的判定条件可以简化为:
    1. $e \in H$
    2. $\forall x, y \in H, x \cdot y^{-1} \in H$
* 令 $(G, \cdot), (G', *)$ 是群, 且 $f: G \rightarrow G'$ 是一个映射. 我们称 $f$ 是一个**群同态**, 当且仅当 $\forall x,y \in G, f(x \cdot y) = f(x) * f(y)$
  * *与幺半群同态不一样, 幺半群同态还需要满足单位元映射之后还是单位元. 而群同态自然就满足了这个要求.*
* $\clubsuit$ 若 $f: (G, \cdot) \rightarrow (G', *)$ 是一个群同态, 则 $f(e) = e', f(x^{-1})=f(x)^{-1}$
* $\clubsuit$ $det: GL(n, \mathbb{R}) \rightarrow (\mathbb{R}^{\times}, \cdot)$ 是一个乘法群同态
* 令 $f: (G, \cdot) \rightarrow (G', *)$ 是一个群同态, 则定义 $f$ 的**核**与**像**, 记作 $ker(f), im(f)$, 分别为:
  * $ker(f)=\{x \in G: f(x) = e'\} \subset G$
  * $im(f) = \{y \in G' : \exist x \in G, y = f(x)\}=\{f(x): x \in G\} \subset G'$

<img src="img/ker_im.png" height="200" />

* $\clubsuit$ 令 $f: (G, \cdot) \rightarrow (G', *)$ 是一个群同态, 则核是定义域的子群, 像是陪域的子群, 即: $ker(f) < G, im(f) < G'$
* 令 $f: (G, \cdot) \rightarrow (G', *)$ 是一个群同态, 我们称 $f$ 是一个**满同态**当 $f$ 是满的, 称 $f$ 是一个**单同态**当 $f$ 是单的.
* $\clubsuit$ 令 $f: (G, \cdot) \rightarrow (G', *)$ 是一个群同态, 则 $f$ 是一个单同态当且仅当 $ker(f)=\{e\}$
* 令 $f: (G, \cdot) \rightarrow (G', *)$ 是一个映射, 我们称 $f$ 是一个**群同构**, 当 $f$ 即是一个双射, 又是一个群同态. 简单来说, 同构就是双射的同态.
* $\clubsuit$ 若 $f: (G, \cdot) \rightarrow (G', *)$ 是一个群同构, 则 $f^{-1}$ 也是群同构.
* $A, B$ 是两个集合, 则称 $A \times B = \{(a, b) | a \in A, b \in B\}$ 为集合A与B的**直积**
* 令 $(G, \cdot_1), (G', \cdot_2)$ 是两个群, 则这两个**群的直积**记为: $(G \times G', *)$. 具体的, 对于 $(x, y), (x', y') \in G \times G'$, 其群的直积为 $(x, y) * (x', y') = (x \cdot_1 x', y \cdot_2 y')$
* $\clubsuit$ 若 $(G, \cdot_1), (G', \cdot_2)$ 是两个群, 则它们的直积 $(G \times G', *)$ 也是群.

### 1.3 有限群

* 如果群 $(G, \cdot)$ 中元素个数是有限的, 称为**有限群**
* 若 $x \in G$, 则 $x$ (在G中)的**阶**, 记作 $|x|$. 定义为: 最小的正整数 $n \in N^*$, 使得 $x^n = e$. 若这样的 $n$ 不存在, 则记 $|x|= \infty$
* $\clubsuit$ 若 $(G, \cdot)$ 是有限群, 且 $x \in G$, 则 $|x| < \infty$. 换言之, 有限群的每一个元素通过自乘有限多次, 都可以得到单位元.
* 令 $(G, \cdot)$ 是一个群, 且 $x \in G$. 若 $n \in N^*$, 我们定义 $x^{-n} = (x^{-1})^n$, 另外 $x^0=e$
* $\clubsuit$ 令 $(G, \cdot)$ 是一个群, 任取 $a \in G$. 则 $f: (Z, +) \rightarrow (G, \cdot)$, 定义为 $f(x) = a^x$, 则 $f$ 是一个群同态.
* 令 $(G, \cdot)$ 是一个群, 且 $x \in G$. 令 $m, n \in Z$, 则 $x^{mn} = (x^m)^n$
* 令 $(G, \cdot)$ 是一个群, 且 $x \in G$, 则 $\langle x \rangle$ 被称为由 $x$ **生成的群**, 定义为: $\langle x \rangle = \{x^n: n \in Z\}$
* 令 $(G, \cdot)$ 是一个群, 且 $S \subset G$. 则由 $S$ 生成的群, 记作: $\langle S \rangle$, 定义为: $\langle S \rangle = \bigcap\{H\subset G: H \supset S, H < G\}$
* 令 $(G, \cdot)$ 是一个群, 若 $\exist x \in G$, 使得 $G = \langle x \rangle$, 则G被称为一个**循环群**, 而 $x$ 被称为 $G$ 的一个生成元.

有限循环群:
<img src="img/cgroup.png" height="200" />

无限循环群:
<img src="img/cugroup.png" height="100" />

* 令 $G= \langle x \rangle$ 是有限循环群, 假设 $|x|=n$ (*x的阶*), 则 $G = \{e, x, x^2, \cdots , x^{n-1}\}$, 其中枚举法中的这些元素是两两不同的. 我们称这样的有限循环群的阶是 $n$.
* 对于任意 $n \in N^*$, 所有n阶循环群都是相互同构的.
* 令 $G=\langle x \rangle$ 是无限循环群, 则 $x^n (n \in Z)$ 是两两不同的, 且 $G$ 只有两个生成元, 分别是 $x, x^{-1}$
* 所有无限循环群是彼此同构的.