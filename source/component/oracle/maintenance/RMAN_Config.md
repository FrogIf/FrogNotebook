# Oracle rman configure 常用配置

备注: 转自 -- https://www.linuxidc.com/Linux/2012-10/71883.htm

1. 显示当前的配置信息: show all;

2. 保存策略 (retention policy):
configure retention policy to recovery window of 3 days;
configure retention policy to redundancy 3;
configure retention policy clear;

备份策略保持分为两个保持策略，一个是时间策略，决定至少有一个备份能恢复到指定的日期，一个冗余策略，规定至少有几个冗余的备份。

CONFIGURE RETENTION POLICY TO RECOVERY WINDOW OF 5 DAYS;
CONFIGURE RETENTION POLICY TO REDUNDANCY 5;
CONFIGURE RETENTION POLICY TO NONE;
在第一个策略中，是保证至少有一个备份能恢复到Sysdate-5 的时间点上，之前的备份将标记为Obsolete。第二个策略中说明至少需要有三个冗余的备份存在，如果多余三个备份以上的备份将标记为冗余。NONE 可以把使备份保持策略失效，Clear 将恢复默认的保持策略

3. 备份优化 backup optimization
configure backup optimization on;
configure backup optimization off;
configure backup optimization clear;

4. 默认设备 default device type
configure default device type to disk;
configure default device type to stb;
configure default device type clear;

5. 控制文件 controlfile
configure controlfile autobackup on;
configure controlfile autobackup format for device type disk to ''/cfs01/backup/conf/conf_%F'';
configure controlfile autobackup clear;
configure controlfile autobackup format for device type disk clear;
configure snapshot controlfile name to ''/cfs01/backup/snapcf/scontrofile.snp'';
configrue snapshot controlfile name clear;

6. 并行数(通道数) device type disk|stb pallelism n;
configure device type disk|stb parallelism 2;
configure device type disk|stb clear;
configure channel device type disk format ''e/:rmanback_%U'';
configure channel device type disk maxpiecesize 100m
configure channel device type disk rate 1200K
configure channel 1 device type disk format ''e/:rmanback_%U'';
configure channel 2 device type disk format ''e/:rmanback_%U'';
configure channel 1 device type disk maxpiecesize 100m

7. 生成备份副本 datafile|archivelog backup copies
configure datafile backup copies for device type disk|stb to 3;
configure archivelog backup copies for device type disk|stb to 3;
configure datafile|archivelog backup copies for device type disk|stb clear
BACKUP DEVICE TYPE DISK DATABASE
FORMAT ''/disk1/backup/%U'', ''/disk2/backup/%U'', ''/disk3/backup/%U'';

8. 排除选项 exclude
configure exclude for tablespace ''users'';
configrue exclude clear;

9. 备份集大小 maxsetsize
configure maxsetsize to 1G|1000M|1000000K|unlimited;
configure maxsetsize clear;

10. 其它选项 auxiliary
CONFIGURE AUXNAME FOR DATAFILE 1 TO ''/oracle/auxfiles/aux_1.f'';
CONFIGURE AUXNAME FOR DATAFILE 2 TO ''/oracle/auxfiles/aux_2.f'';
CONFIGURE AUXNAME FOR DATAFILE 3 TO ''/oracle/auxfiles/aux_3.f'';
CONFIGURE AUXNAME FOR DATAFILE 4 TO ''/oracle/auxfiles/aux_4.f'';
-
CONFIGURE AUXNAME FOR DATAFILE 1 CLEAR;
CONFIGURE AUXNAME FOR DATAFILE 2 CLEAR;
CONFIGURE AUXNAME FOR DATAFILE 3 CLEAR;
CONFIGURE AUXNAME FOR DATAFILE 4 CLEAR;