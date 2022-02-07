# Oracle数据相关操作

## 11g忘记sys密码怎么办

在服务器本地登录，不用打密码:
sqlplus / as sysdba
然后修改密码:
alter user 用户名 identified by 密码;

## 解锁用户

alter user 用户名 account unlock;

## Oracle数据备份

### 数据导出

```bat
exp username/password@sid file=path
exp video_linkage/video_linkage@orcl file=d:\data.dmp
```

### 数据导入

```bat
imp username/password@sid file=path
举例:
imp video_linkage/video_linkage@orcl file=d:\data.dmp
```

### 辅助命令

* ignore=n/y 忽略错误, imp时的参数
* rows=n/y 控制是否只导入/导出结构, 而不导出数据
* full=n/y 全库导出

举例:

```bat
imp video_linkage/video_linkage@10.122.70.77:7521/orcl file=d:\data.dmp ignore=y rows=y
```

### oracle空表导出

ORACLE 11G中有个新特性，当表无数据时，不分配segment，以节省空间。

```sql
select table_name from user_tables where NUM_ROWS=0;    # 查询获取空表
select 'alter table '||table_name||' allocate extent;' from user_tables where num_rows=0;   # 生成segment创建语句

例如查询出的结果:
alter table ACT_EVT_LOG allocate extent;
alter table ACT_HI_ATTACHMENT allocate extent;
则再执行这两条语句.
然后再执行exp就可以了.
```

比较简单的方法是这么写:

```sql
DECLARE sqlStr VARCHAR2 ( 100 );
BEGIN
FOR op IN (select table_name from user_tables where num_rows=0) LOOP
    sqlStr := 'alter table '||op.table_name||' allocate extent';
    execute immediate sqlStr;
END LOOP;
END;
```

## 权限授予

具体需要哪些权限需要看用户的实际需要。

系统权限分类：

* DBA: 拥有全部特权，是系统最高权限，只有DBA才可以创建数据库结构。
* RESOURCE:拥有Resource权限的用户只可以创建实体，不可以创建数据库结构。
* CONNECT:拥有Connect权限的用户只可以登录Oracle，不可以创建实体，不可以创建数据库结构。

> 对于普通用户：授予connect, resource权限。
> 对于DBA管理用户：授予connect，resource, dba权限。

系统权限授权命令：
系统权限只能由DBA用户授出：sys, system(最开始只能是这两个用户)
授权命令：

```sql
SQL> grant connect, resource, dba to 用户名1 [,用户名2]...;
```

> 注:普通用户通过授权可以具有与system相同的用户权限，但永远不能达到与sys用户相同的权限，system用户的权限也可以被回收。


## Oracle卸载

1.关闭所有的oracle相关的服务(凡是以Oracle开头的都关掉就行)

2.在安装目录下，找到 deinstall.bat 文件并执行。(一路回车就行, 卸载失败也没关系, 另外"指定在此 Oracle 主目录中配置的数据库名的列表 [ORCL]:"可能需要卡上一段时间, 不要着急.)如：
D:\app\u01\product\12.1.0\dbhome_1\deinstall \ deinstall.bat

3.window+R 输入regedit打开注册表管理器
--> 删除HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\ 下所有以Oracle开头的服务名称
--> 删除HKEY_LOCAL_MACHINE\SOFTWARE\ORACLE目录(该目录下注册着Oracle数据库的软件安装信息)
--> 删除HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\Eventlog\Application下oracle开头的所有项目(oracle事件日志)

4. 删除环境变量path中关于oracle的内容(同时删除该path对应的文件夹)

5. 重新启动操作系统

6. 重启操作系统后各种Oracle相关的进程都不会加载了。这时删除Oracle_Home下的所有数据。（Oracle_Home指Oracle程序的安装目录）

7.删除C:\Program Files下oracle目录。        （该目录视Oracle安装所在路径而定）

8.删除开始菜单下oracle项，如：      C:\Documents and Settings\All Users\「开始」菜单\程序\Oracle - Ora12c, wind10下的目录为；C:\ProgramData\Microsoft\Windows\Start Menu\Programs
不同的安装这个目录稍有不同。 （总而言之就是将菜单下的有关Oracle目录删除）

## Oracle打补丁

1. 下载当前版本可用的Opatch工具安装补丁
2. 拷贝以下补丁文件到对应服务器，并解压
3. 将oracle_home下的opatch目录备份，并将新的Opatch文件复制到原来的opatch目录中，替换原有文件（实现OPATCH工具升级）
4. 关闭数据库:shutdown immediate
5. 并停止所有oracle服务
6. 进入opatch目录，执行 : opatch apply 补丁所在文件夹\
7. 补丁成功后，启动数据库相关服务
8. 执行SQL语句进行更新补丁标识: SQL> @$ORACLE_HOME/rdbms/admin/catbundle.sql psu apply

检查Oracle补丁:
进入ORACLE_BASE/oracle/product/11.2.0/dbhome_1/Opatch目录.
执行:OPatch lsinventory

## Oracle导入导出指定表

从源数据库导出：
exp user1/pwd@server1 file=c:\temp\exp.dmp tables=(table1, table2)
导入到目标数据库：
imp user2/pwd@server2 file=c:\temp\exp.dmp tables=(table1, table2)

备注: imp时如果该表有数据, 会增量添加进去