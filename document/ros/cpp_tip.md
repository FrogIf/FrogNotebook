# C++相关知识

## HelloWorld

```c++
#include <iostream>   // 头文件, iostream包含输入输出函数, 从键盘输入或者打印一个消息到控制台;

using namespace std;  // iostream这个头文件中所包含的一个命名空间, 内有cout()/cin()函数.

int main(){ // main方法的声明, 有多种形式, 例如: int main(int argc, char** argv)
    cout << "Hello World" << endl;  // 需要说明的有点多...., endl表示换行
    return 0;   // 返回值, 一般情况下约定返回0表示正常结束, 返回-1表示非正常结束
}
```

或者, 可以这样写:

```c++
#include <iostream>

int main(){
    std::cout << "Hello World" << std::endl;
    return 0;
}
```

**程序解释**

其余见注释, 主要解释一下```cout << "Hello World" << endl;```这句. 在c++中, ```<<```和```>>```不仅代表左移和右移, 还重载为流插入和流提取. 前面这句, 就是将字符流插入到cout这个对象里边. cout可用于在计算机屏幕上显示信息.

如下, 是流提取操作:

```c++
#include <iostream>

int main(){
    std::string str;
    std::cout << "please input string :";
    std::cin >> str;
    std::cout << "input string is : " << str << std::endl;
    return 0;
}
```

命名空间是c++中的一个特性, 用于对一组实体进行分组. cout和endl都属于std命名空间中的实体, std命名空间又在iostream这个库中. 如果不在开头声明命名空间, 又要使用命名空间中的实体的话, 需要使用```::```符号.

**编译执行**

编译指定文件, 并输出到指定文件:

```bash
g++ hello_world.cpp -o hello_world
```

也可以更简单, 编译指定文件:

```bash
g++ hello_world.cpp
```

这时, 会输出到a.out文件.

## 结构体与类

类与结构体的区别: 类是增强版的结构体, 类中可以定义函数, 结构体不能.

```c++
#include <iostream>

struct DemoStruct{
    int val;
};

class DemoClass{
    public:
        void play();
        int val;
};

void DemoClass::play(){
    std::cout << "play yeah!" << std::endl;
}

int main(){
     DemoStruct ds;
     ds.val = 123;
     DemoClass dc;
     dc.val = 456;
     std::cout << "ds.val = " << ds.val << ", dc.val = " << dc.val << std::endl;

     dc.play();

     return 0;
}
```

## 指针

**指针运算符**

c++有两种指针运算符: 

1. 取地址运算符```&```
2. 间接寻址运算符```*``` 

对于```&```:

* 调用变量时, 变量前加该符号, 表示返回该变量的地址
* 声明变量时, 变量前加该符号, 表示声明一个引用变量, 有点类似于c#中的ref关键字之于基本数据类型

对于```*```

* 调用指针变量时, 指针变量前加该符号, 获取该指针变量所指向的变量(就是&的逆运算)
* 声明时, 变量前加该符号, 表示该变量是另一个变量的地址

```c++
#include <iostream>

using namespace std;

int main(){
    int var;
    int *ptr;
    int val;

    var = 3000;
    ptr = &var;   // 获取变量的地址
    val = *ptr;   // 获取地址所指向的值

    cout << "Value of var : " << var << endl; // 输出: Value of var : 3000
    cout << "Value of ptr : " << ptr << endl; // 输出: Value of ptr : 0x....(一个地址)
    cout << "Value of val : " << val << endl; // 输出: Value of val : 3000

    return 0;
}
```

**点与箭头**

c++中在获取结构体或者类中的元素时, 需要用到```->```或者```.```. 归结起来就两点:

1. 箭头左边必须是指针;
2. 点号左边必须是实体.

示例如下:

```c++
#include <iostream>

using namespace std;

struct DemoStruct{
    int val;
};

class DemoClass{
    public:
        void play();
        int val;
};

void DemoClass::play(){
    cout << "play yeah!" << endl;
}

int main(){
     DemoStruct ds;
     ds.val = 123;
     DemoStruct *dsptr = &ds;
     cout << "ds.val = " << ds.val << " also ds.val = " << (*dsptr).val << " also ds.val = " << dsptr->val << endl;

     DemoClass dc;
     dc.val = 456;
     DemoClass *dcptr = &dc;
     cout << "dc.val = " << dc.val << " also dc.val = " << (*dcptr).val << " also dc.val = " << dcptr->val << endl;

     dc.play();
     (*dcptr).play();
     dcptr->play();
     
     return 0;
}
```