# 末端哨兵

在算法技巧中有个著名的技巧叫作“哨兵”。这个技巧多用在线性搜索（从若干个数据中查找目标数据）等算法中。
假设有100个箱子，里面分别装有一个写有任意数字的纸条，箱子上面标有1～100的序号。现在要从这100个箱子当中查找是否有箱子装有写着要查找数字的纸条。

* 使用普通循环的方式:

```code
find = null;
for(int i = 0; i < boxs.length; i++){
    if(boxs[i].mark == aim){
        find = boxs[i];
        break;
    }
}

if(find != null){
    print("find it!")
}
```

虽然看起来似乎没什么问题，但是实际上含有不必要的处理——每回都要检查箱子的编号有没有到100.

*  使用哨兵的方式

```code
sentinel.mark = aim;
boxs.append(sentinel);

int i = 0;
find = null;
while(true){
    if(boxs[i].mark == aim){
        find = boxs[i];
        break;
    }
    i++;
}

if(find != null && find != sentinel){
    print("find it!")
}
```

去除了每次循环都要进行的边界检查.