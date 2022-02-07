## RMAN备份

### 备份策略

1. 每周日2点数据库全备
2. 每天4点备份归档

> 以下仅为备份脚本, 没有定时任务脚本

### 准备工作

查看数据库是否处于归档模式:

```sql
archive log list;
```

如果不是处于归档模式, 开启归档模式:

```sql
> shutdown immediate    # 关闭数据库
> startup mount     # 启动实例并挂载数据库
> alter database archivelog;    # 更改数据库为归档模式
> alter database open;      # 打开数据库
> alter system archive log start;   # 启用自动归档
```

> 注意需要设置归档日志大小, 并及时清理归档日志, 防止占满归档日志空间


检查AUTOBACKUP相关配置:

```rman
RMAN> show all;

使用目标数据库控制文件替代恢复目录
db_unique_name 为 ORCL 的数据库的 RMAN 配置参数为:
CONFIGURE RETENTION POLICY TO REDUNDANCY 2;
CONFIGURE BACKUP OPTIMIZATION OFF; # default
CONFIGURE DEFAULT DEVICE TYPE TO DISK;
CONFIGURE CONTROLFILE AUTOBACKUP OFF; # default
CONFIGURE CONTROLFILE AUTOBACKUP FORMAT FOR DEVICE TYPE DISK TO '%F'; # default
CONFIGURE DEVICE TYPE DISK PARALLELISM 6 BACKUP TYPE TO BACKUPSET;
CONFIGURE DATAFILE BACKUP COPIES FOR DEVICE TYPE DISK TO 1; # default
CONFIGURE ARCHIVELOG BACKUP COPIES FOR DEVICE TYPE DISK TO 1; # default
CONFIGURE MAXSETSIZE TO UNLIMITED; # default
CONFIGURE ENCRYPTION FOR DATABASE OFF; # default
CONFIGURE ENCRYPTION ALGORITHM 'AES128'; # default
CONFIGURE COMPRESSION ALGORITHM 'BASIC' AS OF RELEASE 'DEFAULT' OPTIMIZE FOR LOAD TRUE ; # default
CONFIGURE ARCHIVELOG DELETION POLICY TO NONE; # default
CONFIGURE SNAPSHOT CONTROLFILE NAME TO 'E:\APP\ADMINISTRATOR\PRODUCT\11.2.0\DBHOME_1\DATABASE\SNCFORCL.ORA'; # default
```

1. 保证controlfile处于off, controlfile format处于默认状态(如果不处于这个状态, 执行下面的脚本时, 会将controlfile备份出的文件当做冗余删除)
2. CHANNEL DEVICE TYPE DISK等也需保持默认或者不配置(否则, 执行脚本时会去配置的目录下检查冗余, 而不是在备份输出目录下检查)

上面两条恢复默认执行的命令是(详见: [Oracle rman configure 常用配置](./RMAN_Config.html)):
```rman
> configure controlfile autobackup clear;
> configure controlfile autobackup format for device type disk clear;
> configure CHANNEL DEVICE TYPE DISK clear;
```


### 全备份脚本

```rman
run {
	CONFIGURE RETENTION POLICY TO REDUNDANCY = 2;
	CONFIGURE DEVICE TYPE DISK PARALLELISM 6;
	CONFIGURE DEFAULT DEVICE TYPE TO DISK;
	backup as compressed backupset database format 'E:\OracleBackup\FULLBAK_%d_%T_%s_%p.DBFILE'; 
	backup current controlfile format 'E:\OracleBackup\%d.%s.%p.%T.CTL';
	backup spfile format 'E:\OracleBackup\%d.%s.%p.%T.SPFILE';
	crosscheck backup;
	crosscheck copy;
	sql "alter system archive log current";
	backup as COMPRESSED backupset archivelog all not backed up format 'E:\OracleBackup\%d.%s.%p.%T.ARC';
	crosscheck archivelog all;
	delete noprompt archivelog all completed before 'sysdate-3';
	delete noprompt expired backup;
	delete noprompt obsolete;
}
exit;
```

### 归档备份脚本

```rman
run {
	CONFIGURE RETENTION POLICY TO REDUNDANCY = 2;
	CONFIGURE DEVICE TYPE DISK PARALLELISM 6;
	CONFIGURE DEFAULT DEVICE TYPE TO DISK;
	backup current controlfile format 'E:\OracleBackup\%d.%s.%p.%T.CTL';
	backup spfile format 'E:\OracleBackup\%d.%s.%p.%T.SPFILE';
	crosscheck backup;
	crosscheck copy;
	sql "alter system archive log current";
	backup as COMPRESSED backupset archivelog all not backed up format 'E:\OracleBackup\%d.%s.%p.%T.ARC';
	crosscheck archivelog all;
	delete noprompt archivelog all completed before 'sysdate-3';
	delete noprompt expired backup;
	delete noprompt obsolete;
}
exit;
```

> 仅仅是把全库备份中的数据文件备份删掉


## RMAN异机恢复

这里模拟的场景是在另一台服务器上, 并且数据库安装目录与原安装目录不同, 但是数据库版本相同(11.2.0.4).

### 恢复步骤

将上面的备份文件复制到恢复服务器上.

1. 进入rman : 

```bat
rman target /
```

2. 关闭目标数据库:

```rman
shutdown immediate
```

3. 创建原始参数文件

任意路径均可, 下面会用到.

```ora
*.audit_file_dest='C:\app\Administrator\admin\orcl\adump'
*.audit_trail='db'
*.compatible='11.2.0.4.0'
*.control_files='C:\app\Administrator\oradata\orcl\control01.ctl','C:\app\Administrator\oradata\orcl\control02.ctl'
*.db_block_size=8192
*.db_domain=''
*.db_name='orcl'
*.diagnostic_dest='C:\app\Administrator'
*.dispatchers='(PROTOCOL=TCP) (SERVICE=orclXDB)'
*.log_archive_dest_1='LOCATION=C:\app\arch'
*.memory_target=1234173952
*.open_cursors=300
*.processes=150
*.remote_login_passwordfile='EXCLUSIVE'
*.undo_tablespace='UNDOTBS1'
```

> 注意与数据库安装路径相对应, 可以参照当前数据库的"ORACLE_HOME\admin\orcl\pfile\init.ora.xxxx"和备份的SPFILE进行编写

4. 加载参数文件

```rman
startup nomount pfile="C:\initparam\pfile.ora"
```

> 这个pfile路径就是上面的参数文件路径

5. 加载控制文件

```rman
restore controlfile from "C:\OracleBackup\ORCL.16.1.20181226.CTL";
```

6. 挂载数据库

```rman
alter database mount;
```

7. 将备份集信息重新导入到当前控制文件中

```rman
catalog start with "C:\OracleBackup\";
```

这时可能会报错:
```rman
RMAN-12010: 自动通道分配初始化失败
RMAN-06189: 当前 DBID 1010101010 与目标装载数据库 (3030303030) 不匹配
```

需要重新配置DBID

7.1 设置DBID

```rman
shutdown immediate
set dbid=3030303030
exit
```

> 注意, exit是必须的, 需要重新进入rman

7.2 重新执行之前步骤

```rman
> startup nomount pfile="C:\initparam\pfile.ora"
> alter database mount;
> catalog start with "C:\OracleBackup\";
```

8. 检查备份

```rman
crosscheck backup;
```

9. 转储文件

```rman
restore database;
```

由于数据库安装路径不同, 会导致这里报错:

```error
通道 ORA_DISK_1: ORA-19870: 还原备份片段 C:\ORACLEBACKUP\FULLBAK_ORCL_20181226_4_1.DBFILE 时出错
ORA-19504: 无法创建文件"E:\APP\ADMINISTRATOR\ORADATA\ORCL\UNDOTBS01.DBF"
ORA-27040: 文件创建错误, 无法创建文件
OSD-04002: 无法打开文件
O/S-Error: (OS 3) 系统找不到指定的路径。

通道 ORA_DISK_2: ORA-19870: 还原备份片段 C:\ORACLEBACKUP\FULLBAK_ORCL_20181226_5_1.DBFILE 时出错
ORA-19504: 无法创建文件"E:\APP\ADMINISTRATOR\ORADATA\ORCL\EXAMPLE01.DBF"
ORA-27040: 文件创建错误, 无法创建文件
OSD-04002: 无法打开文件
O/S-Error: (OS 3) 系统找不到指定的路径。

通道 ORA_DISK_3: ORA-19870: 还原备份片段 C:\ORACLEBACKUP\FULLBAK_ORCL_20181226_1_1.DBFILE 时出错
ORA-19504: 无法创建文件"E:\APP\ADMINISTRATOR\ORADATA\ORCL\SYSAUX01.DBF"
ORA-27040: 文件创建错误, 无法创建文件
OSD-04002: 无法打开文件
O/S-Error: (OS 3) 系统找不到指定的路径。

通道 ORA_DISK_4: ORA-19870: 还原备份片段 C:\ORACLEBACKUP\FULLBAK_ORCL_20181226_3_1.DBFILE 时出错
ORA-19504: 无法创建文件"E:\APP\ADMINISTRATOR\ORADATA\ORCL\SYSTEM01.DBF"
ORA-27040: 文件创建错误, 无法创建文件
OSD-04002: 无法打开文件
O/S-Error: (OS 3) 系统找不到指定的路径。

通道 ORA_DISK_5: ORA-19870: 还原备份片段 C:\ORACLEBACKUP\FULLBAK_ORCL_20181226_2_1.DBFILE 时出错
ORA-19504: 无法创建文件"E:\APP\ADMINISTRATOR\ORADATA\ORCL\USERS01.DBF"
ORA-27040: 文件创建错误, 无法创建文件
OSD-04002: 无法打开文件
O/S-Error: (OS 3) 系统找不到指定的路径。

故障转移到上一个备份

RMAN-00571: ===========================================================
RMAN-00569: =============== ERROR MESSAGE STACK FOLLOWS ===============
RMAN-00571: ===========================================================
RMAN-03002: restore 命令 (在 12/26/2018 11:04:38 上) 失败
RMAN-06026: 有些目标没有找到 - 终止还原
RMAN-06023: 没有找到数据文件5的副本来还原
RMAN-06023: 没有找到数据文件4的副本来还原
RMAN-06023: 没有找到数据文件3的副本来还原
RMAN-06023: 没有找到数据文件2的副本来还原
RMAN-06023: 没有找到数据文件1的副本来还原
```

这时需要在restore之前制定新的位置(根据报错的路径编辑下面指令):

```rman
 run{
	allocate channel a1 type disk;
　　allocate channel a2 type disk;
　　set until sequence=4631 thread=1;
	set newname for datafile 'E:\APP\ADMINISTRATOR\ORADATA\ORCL\UNDOTBS01.DBF' to 'C:\APP\ADMINISTRATOR\ORADATA\ORCL\UNDOTBS01.DBF';
	set newname for datafile "E:\APP\ADMINISTRATOR\ORADATA\ORCL\EXAMPLE01.DBF" to "C:\APP\ADMINISTRATOR\ORADATA\ORCL\EXAMPLE01.DBF";
	set newname for datafile "E:\APP\ADMINISTRATOR\ORADATA\ORCL\SYSTEM01.DBF" to "C:\APP\ADMINISTRATOR\ORADATA\ORCL\SYSTEM01.DBF";
	set newname for datafile "E:\APP\ADMINISTRATOR\ORADATA\ORCL\SYSAUX01.DBF" to "C:\APP\ADMINISTRATOR\ORADATA\ORCL\SYSAUX01.DBF";
	set newname for datafile "E:\APP\ADMINISTRATOR\ORADATA\ORCL\USERS01.DBF" to "C:\APP\ADMINISTRATOR\ORADATA\ORCL\USERS01.DBF";
	restore database;
	switch datafile all;
　　release channel a1;
	release channel a2;
 }
```

10. 指定恢复时间点

```rman
> sql "alter session set nls_date_format=''yyyy-mm-dd hh24:mi:ss''";
> recover database until time '2018-12-26 11:00:00';
```

> 这里可能会报错, 属于正常现象, 不需要处理

11. 启动数据库

首先推出rman, 进入sqlplus

```bat
sqlplus / as sysdba
```

先只读打开确认数据是否符合要求

```sql
alter database open read only; 
```

确认没问题后, 关闭数据库并重新打开:

```sql
> shutdown immediate
> create spfile from pfile='C:\initparam\pfile.ora';
> startup mount
> alter database open resetlogs;
```

在最后打开数据库时可能会报错:

```rman
alter database open resetlogs
*
第 1 行出现错误:
ORA-00344: 无法重新创建联机日志 'E:\APP\ADMINISTRATOR\ORADATA\ORCL\REDO01.LOG'
ORA-27040: 文件创建错误, 无法创建文件
OSD-04002: 无法打开文件
O/S-Error: (OS 3) 系统找不到指定的路径。
```

依然是由于异机恢复安装路径不一致导致的.

首先查看当前系统redo log路径:
```sql
> select * from v$logfile;
```

会发现很多路径都不正确, 需要修改:
```sql
 alter database rename file 'E:\APP\ADMINISTRATOR\ORADATA\ORCL\REDO01.LOG' to 'C:\APP\ADMINISTRATOR\ORADATA\ORCL\REDO01.LOG';
 alter database rename file 'E:\APP\ADMINISTRATOR\ORADATA\ORCL\REDO02.LOG' to 'C:\APP\ADMINISTRATOR\ORADATA\ORCL\REDO02.LOG';
 alter database rename file 'E:\APP\ADMINISTRATOR\ORADATA\ORCL\REDO03.LOG' to 'C:\APP\ADMINISTRATOR\ORADATA\ORCL\REDO03.LOG';
```

再次执行打开数据库命令, 还可能出错:
```sql
SQL> alter database open resetlogs;
alter database open resetlogs
*
第 1 行出现错误:
ORA-00392: 日志 1 (用于线程 1) 正被清除, 不允许操作
ORA-00312: 联机日志 1 线程 1: 'C:\APP\ADMINISTRATOR\ORADATA\ORCL\REDO01.LOG'
```

查看日志文件状态:

```sql
SQL> select group#,bytes/1024/1024||'M',status from v$log;

    GROUP# BYTES/1024/1024||'M'                      STATUS
---------- ----------------------------------------- ----------------
         1 50M                                       CLEARING_CURRENT
         3 50M                                       CLEARING
         2 50M                                       CLEARING
```

修复:

```sql
SQL> ALTER DATABASE CLEAR LOGFILE GROUP 1;

数据库已更改。

SQL> ALTER DATABASE CLEAR LOGFILE GROUP 2;

数据库已更改。

SQL> ALTER DATABASE CLEAR LOGFILE GROUP 3;

数据库已更改。
```

再打开就可以了.

> 网上的例子, alter之后依旧不能打开, 由于oracle版本不一致导致的. 里面给出的解决办法是退出重新进入sqlplus, 并执行startup upgrade;然后执行升级脚本:@$ORACLE_HOME/rdbms/admin/catupgrd.sql;即可.



到此, 数据库异机恢复成功!

## 参考文章

* [RMAN备份策略与异机恢复一例](http://www.cnblogs.com/jyzhao/p/9200714.html)
* [Oracle异机恢复](https://www.cnblogs.com/wn1m/p/5704255.html)
* [ORA-00344: unable to re-create online log](http://blog.itpub.net/205377/viewspace-1767221/)
* [ORA-00392 ORA-00312 日志正在清除故障](https://blog.csdn.net/leshami/article/details/50913867)