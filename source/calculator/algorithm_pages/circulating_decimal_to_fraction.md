# 循环小数转分数

## 1. 原理

先是纯循环小数, 例如: $0.\dot{3}$:

显然:

$$
0.\dot{3} \cdot 10 - 0.\dot{3} = 3.\dot{3} - 0.\dot{3} = 3
$$

即:

$$
10x - x = 3
$$

所以:

$$
0.\dot{3} = 1/3
$$

在, 比如混循环小数, 例如$1.23\dot{5}\dot{6}$

显然:

$$
1.23\dot{5}\dot{6} \cdot 10000 - 1.23\dot{5}\dot{6} \cdot 100 = 12356.\dot{5}\dot{6} - 123.\dot{5}\dot{6} = 12233
$$

即:

$$
10000x - 100x = 12233
$$

所以:

$$
1.23\dot{5}\dot{6} = 12233/9900
$$

## 2. 规律总结与公式

首先, 可以这样描述一个循环小数(以下均在十进制中进行描述):

* 整数部分为$a$
* 小数不循环部分为$b$
* 小数循环部分为$c$
* 小数不循环部分位数为$n_1$
* 循环部分位数为$n_2$

假设这个循环小数为x, 则一定有:

$$
x \cdot 10 ^ {n_1 + n_2} - x \cdot 10 ^ {n_1} = a \cdot 10 ^ {n_1 + n_2} + b \cdot 10 ^ {n_2} + c - (a \cdot 10 ^ {n_1} + b)
$$

求解可得:

$$
x = \frac{a \cdot 10 ^ {n_1 + n_2} + b \cdot 10 ^ {n_2} + c - (a \cdot 10 ^ {n_1} + b)}{10 ^ {n_1 + n_2} - 10 ^ {n_1}}
$$

> Tip: 普通的非无限小数可以, 可以视作$c = 0$, $n_2=1$, 然后应用该公式.

## 代码实现

* [小数转分数](https://github.com/FrogIf/calculator-algorithm/blob/main/src/sch/frog/calculator/algorithm/DecimalToFraction.java)
* [有理数类](https://github.com/FrogIf/Calculator/blob/master/src/frog/calculator/math/number/RationalNumber.java)