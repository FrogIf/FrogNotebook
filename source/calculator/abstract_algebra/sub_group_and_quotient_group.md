# 子群与商群

**子群**

H是群G的非空子集, 若H对G的运算也构成群, 称H为G的子群, 记为H<G.

平凡子群:

* H = {e}
* H = G

除去上面两个群, 都是非平凡子群.

* H是群G的非空子集, 下面条件是等价的:
  1. H < G
  2. $a, b \in H \Longrightarrow ab \in H, a^{-1} \in H$
  3. $a, b \in H \Longrightarrow ab^{-1} \in H$
* H是G的非空**有限**子集, 则$H < G \Longleftrightarrow H对G中的运算封闭$
* $H_1 < G, H_2 < G \Longrightarrow H_1 \cap H_2 < G$

**陪集**

若$H < G, a \in G$:
* 左陪集: $aH = \{ah | h \in H\}$
* 右陪集: $Ha = \{ha | h \in H\}$

**一个重要的关系**

若H < G, 则关系:
$$a R b \Longleftrightarrow a^{-1}b \in H$$
是一个等价关系, 且$\overline{a} = aH$

* H的全体左陪集集合是G的一个分类.
* $H < G, a, b \in G; aH = bH \Longleftrightarrow a^{-1}b \in H$
* 商集合G/R又称为G对H的左陪集空间, 也记作$G/H$
* G/H的基数|G/H|称为H在G中的指数, 记为$[G:H]$

> 集合中所含元素个数 -- 基数; 群中所含元素个数 -- 阶

**Lagrange定理**

G有限群, H < G, 则有:

$$|G| = [G:H] \cdot H$$

* G有限群, K < G, H < K, 则$[G:H] = [G:K] \cdot |H|$

**正规子群**

H < G, 若$ghg^{-1} \in H, \forall g \in G, \forall h \in H$, 则称H为正规子群, 记为$H \lhd G$

* H < G, 下面条件等价:
  1. $H \lhd G$
  2. $gh = Hg, \forall g \in G$
  3. $g_1 H \cdot g_2 H = g_1 g_2 H, \forall g_1, g_2 \in G$

**商群**

$H < G, a R b \Longleftrightarrow a^{-1}b \in H$, 则
$$R是G中的同余关系 \Longleftrightarrow H \lhd G$$
此时, G/R对于同余关系R的导出运算也构成群, 称为G对H的商群.

**剩余类加群**

整数加群$\{Z; +\}$是可交换群, 其任意子群$mZ$是$Z$的正规子群, 所以有商群$Z/mZ$, 这个群一般称为模m的剩余类加群, 记为$Z_m$.

显然这个剩余类加群中是这样的:
$$
Z/mZ = \{\overline{0}, \overline{1}, \cdots, \overline{(m-1)} \}
$$
这个群中的运算一般也记为加法, 就有$\overline{r_1} + \overline{r_2} = \overline{(r_1 + r_2)} = \overline{r}$, 其中$r_1 + r_2 = qm + r, 0 \leq r < m$