# 同态与同构

**定义**

有两个群: $\{G_1, \cdot\}$ 和 $\{G_2, \times \}$, 并且有$G_1 \stackrel{f}{\longrightarrow} G_2$. 若$f(a \cdot b) = f(a) \times f(b)$, 则称f是$G_1$到$G_2$的同态映射, 简称同态.
1. 自同态: $G_1 = G_2$
2. 单同态: f是单射
3. 满同态: f是满射
    * 此时称$G_1$和$G_2$是同态的, 记作$G_1 \sim G_2$
4. 同构: f是双射(单同态+满同态)
   * 记作:$G_1 \simeq G_2$

**自然同态**

$H \lhd G$, $\pi$是G到$G/H$的映射: $\pi(g) = gH, \forall g \in G$称为自然同态.显然$\pi$是满同态.

**一些定理**

1. $f$是群$G_1$到群$G_2$的同态, g是群$G_2$到$G_3$的同态, 则:
   1. $gf$是$G_1$到$G_3$的同态
   2. 若$f$,$g$都是满(单)同态, 则$gf$也是满(单)同态
   3. 若$f$,$g$都是同构, 则$gf$也是同构
   4. 若$f$是同构, $f^{-1}$也是同构
2. $f$是群$G_1$到群$G_2$的同态, $e_1$, $e_2$分别是$G_1$, $G_2$的幺元, 则$f(e_1) = e_2$且$\forall a \in G, f(a^{-1}) = f(a)^{-1}$
3. $f$是群$G_1$到群$G_2$的同态, H < G, 则$f(H) < G_2$, 特别地: $f(G_1) < G_2$

**同态映射$f$的核**

$f$是群$G_1$到群$G_2$的同态, 则$G_2$的幺元$e_2$的完全原像$\{a \in G_1 | f(a) = e_2\}$称为同态映射$f$的核, 记为$kerf$

$f$是群$G_1$到群$G_2$的同态:
1. $kerf \lhd G_1$
2. $f$是单同态 $\Longleftrightarrow$ $kerf = {e_1}$

**同态基本定理**

$f$是群$G_1$到群$G_2$的**满**同态, 则$G_1/kerf \simeq G_2$, 可以直接符号表述为:
$$G_1 \sim G_2 \Longrightarrow G_1/kerf \simeq G_2$$

设G为群, $f$是G到另一个群的同态映射, 则$f(G) \simeq G/kerf$, 反之, G的任一商群都可以看做G的同态象

**其他定理**

* $f$使得$G_1 \sim G_2$, $N = kerf$:
  1. $f$建立了$G_1$中包含N的子群与$G_2$中子群间的双射
  2. 上述双射把正规子群对应到正规子群
  3. 若$H \lhd G_1, H \subseteq H$, 则$G_1 / H \simeq G_2/f(H)$
* $N \lhd G, \pi: G \sim G/N$
  1. $\pi$建立了$G$中包含N的子群与$G/N$的子群之间的双射
  2. 上述双射把正规子群对应到正规子群
  3. 若$H \lhd G, N \subseteq H$, 则$G / H \simeq (G/N) / (H/N)$
* $N \lhd G, \pi: G \sim G/N, H < G$
  1. $HN$是G中包含N的子群, 且$HN = \pi^{-1}(\pi(H))$, 即$HN$是$H$在$\pi$映射下的象的集合$\pi(H)$的完全原象$\pi^{-1}(\pi(H))$
  2. $(H \cap N) \lhd H$, 且$ker(\pi |_H) = H \cap N$
  3. $HN/N \simeq H/(H \cap N)$