# GIT使用笔记

## 概述

git本地仓库有三种不同的状态:

1. 已修改(modified)
2. 已暂存(staged)
3. 已提交(committed)

这三种状态对应git的三个本地区域, 分别是:工作区, 暂存区, git本地仓库

> 其实很好理解, 就是在工作区和仓库之间加了一个暂存区, 作为提交的缓冲.

## 命令备忘

1. git init // 创建一个本地仓库
2. git add // 将工作区的指定的文件同步至暂存区
    ```txt
        以下是针对git2.0以上版本的解释:
        git add 文件名 // 将指定文件同步至暂存区
        git add .   //将所有文件同步至暂存区(新增, 修改, 删除)
        git add -A  //同上
        git add --ignore-removal.   //将新增和修改的文件同步至暂存区(不暂存删除)
        git add -u  // 将修改和删除的文件同步至暂存区(不暂存新增)
    ```
3. git commit // 将暂存区的内容提交至本地仓库
    ```txt
        git commit // 将暂存区内容同步至本地仓库, 会使用vim打开一个编辑器, 要求加入提交描述信息
        git commit -m "描述信息" // 带着描述信息同步至暂存区的内容
        git commit -a -m "描述信息" // 直接将工作区的文件同步至本地仓库(-a可以理解为git add, 需要注意的是该命令只能将被修改和被删除同步上去, 不会提交新增)
        git commit --amend // 修改上次同步时输入的描述信息(进入vim编辑器界面)
    ```
4. git diff *文件名*  // 比较指定文件在工作区和暂存区的区别
5. git diff --cached // 比较暂存区和已提交的区别
6. git status   // 查看当前git仓库的状态, 包括当前所在分支, 同步次数, 工作区文件, 暂存区文件等的状态
7. git log  // 显示提交日志(注意, 只会显示提交日志)
    ```txt
        git log --pretty=oneline    // 只显示commit id和提交版本时的描述信息
    ```
8. git reflog   // 显示HEAD指向日志, 会显示每一次提交, 回退信息, 以及提交的版本号
9. git checkout *文件名*   // 将指定文件恢复至和暂存区一致(如果暂存区没有, 再跟仓库中同步)
10. git reset    // 将已提交至本地仓库的文件恢复至指定版本
    ```txt
        git reset --hard 版本号 //将工作区, 暂存区, 本地仓库均回退至指定版本
        git reset --soft 版本号 //只将本地仓库回退至指定版本, 工作区和暂存区不变
        git reset --mixed 版本号    // 将本地仓库和暂存区回退至指定版本, 工作区不变, 这个是默认, 直接输入git reset 版本号与其一样, 另外该指令后面可以指定文件名
        关于版本号的获取:
            HEAD //表示当前版本号
            HEAD^ //表示上一版本的版本号
            HEAD^^ // 表示上上个版本号
            HEAD^^^, HEAD^^^^ ....
            HEAD~100 //向上返回100个版本
            另外通过git reflog可以找到每一次同步之后的版本号
        * 如果我们希望彻底丢掉本地修改但是又不希望更改branch所指向的commit，则执行git reset --hard = git reset --hard HEAD
        * 如果一个文件已经提交至暂存区, 但是还没有提交至本地仓库, 可以使用git reset HEAD 文件名  丢弃所有更改
    ```
11. git revert *commitId* // 将指定的提交撤回
    ```txt
        git revert <commitId> -m <n> // 撤销某次合并, 并恢复至合并之前的其中一个上游, n为上游的编号, 一般都是1
    ```
12. git checkout *分支名* // 切换至指定分支
    ```
        git checkout -b ***分支名***    // 创建一个分支, 并切换至改分支
        git checkout -b ***本地分支名*** ***远程仓库名***/***远程分支名***   // 从远程仓库检出一个分支
    ```
13. git branch  // 查看所有本地分支
    ```txt
        git branch -a // 查看所有分支, 包括本地分支和远程分支
    ```
14. git merge *分支名*  // 将指定分支合并到当前分支
15. git branch -d *分支名* // 删除指定的分支
16. git pull *远程仓库名* // 将远程分支变更同步至本地
17. git push *远程仓库名* // 将本地变更推送至远程仓库
18. git push -u *远程仓库名* *远程分支名* // 把本地仓库推送至远程仓库, 没有指定远程分支名, 表示推送至同名分支, 如果没有则创建, -u表示将本地分支与远程分支关联起来, 可以简化以后推送命令
    ```
        git push origin master  // 把本地仓库推送至远程仓库, 远程分支是与本地分支存在关联关系的分支, 一般先执行第一条命令, 这样就将本地分支与远程分支建立了联系, 然后每次都可以使用第二条命令了
    ```
19. git checkout -b *分支名* *tag名* // 基于指定的tag建立分支
20. git remote -v // 查看远程仓库地址
21. git remote add *远程仓库名* *远程仓库的地址* // 本地仓库与远程仓库关联, 远程仓库名随便起的, 一般叫origin
    ```
        这是因为远程仓库的某些文件不在本地仓库中, 执行git pull --rebase origin master即可.
    ```
22.  git clone *远程仓库的地址* // 克隆远程仓库地址


## SSH传输

1. 生成秘钥
    git远程传输采用SSH加密传输, 首先确认是否存在C:\Users\.ssh目录以及该目录下是否有id_rsa和id_rsa.pub两个文件, 如果没有, 执行:
    ```sh  
        ssh-keygen -t rsa -C "电子邮箱"
    ```
    也可以指定文件名.
    ```sh
        ssh-keygen -t rsa -C "邮箱地址" -f 密钥文件名
    ```
    这里一般指定为:
    ```sh
    ssh-keygen -t rsa -C '公司邮箱地址' -f ~/.ssh/私钥文件名
    ```

2. 将公钥告诉接收方(远程仓库)
    登录github或者码云等, 在账户设置里, 添加公钥, 将id_rsa.pub中的内容复制粘贴至key中.

    > github和码云中公共代码都是可以大家看到的, 但是别人不具有修改权限, 如果把别人的key也放到账户秘钥中或者项目秘钥管理中, 那么那个人也可以操作这个账户的项目或者某一个项目

    ```txt
    SSH公钥和私钥实现免密登录:
    不是随便一个人都可以把代码提交至指定的远程仓库中, 只有通过身份验证的人才可以. 这里采用SSH免密登录的方式进行身份验证.
    首先, 需要了解RSA非对称加密:
    1. 使用公钥加密的密文只能通过私钥来解密
    2. 使用私钥加密的密文只能通过公钥来解密
    3. 加密速度慢
    在提交代码之后, 服务器会使用铭文发送一段随机码给客户端; 客户端使用私钥进行加密, 然后返回给服务器端; 服务器端使用公钥进行解密, 得到解密后的随机码, 与发送过去的随机码进行匹配, 如果相同则认证通过.
    ```


为兼容多个不同的项目, 分布在多个不同的远程仓库中的情况(github, gitee, gitlab...), 需要在密钥生成目录, 创建config文件, 手动指定映射关系:

```
# 第一个
Host gitee.com  # 网址
HostName gitee.com
PreferredAuthentications publickey #写死定值
IdentityFile ~/.ssh/gitee_id_rsa  #对应的私钥文件名

# 第二个...
```

## submodule

1. 创建一个submodule

```
git submodule add git@github.com:apache/skywalking-data-collect-protocol.git raw-data-viewer/skywalking-protocal
```

> 后面为指定路径, 也可以不指定, 这会直接生成在当前目录

2. 初始化

```
git submodule init
```

3. 更新代码

```
git submodule update
```

**删除指定的submodule**

1. 删除子目录```rm -rf 子模块目录```
2. ```vi .gitmodules```修改, 删除指定的submodule记录
3. ```vi .git/config```修改, 删除指定的submodule配置
4. ```rm .git/module/xxxx```, 删除指定的目录
5. 完成

> 有时候需要再执行一下```git add .gitmodules```
> 有时候需要再执行一下```git rm --cached 子模块名称```

## 其他

* 更新远程分支列表: ```git remote update origin --prune```