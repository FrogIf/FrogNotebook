# instantclient安装

1. 下载instantclient
instantclient-basic-windows.x64-12.2.0.1.0.zip -- 基础包
instantclient-sqlplus-windows.x64-12.2.0.1.0.zip -- sqlplus命令使用
instantclient-tools-windows.x64-12.2.0.1.0.zip -- exp, imp命令使用

2. 解压, 将需要的压缩文件解压到同一个文件夹中

3. 配置环境变量
ORACLE_HOME -- 解压的目录
path -- 添加%ORACLE_HOME%

4. 启动测试
可能报错提示缺 msvcr120.dll, 是因为缺少C++运行库.https://www.microsoft.com/en-gb/download/details.aspx?id=40784下载(或者百度搜索vcredist)

5. exp测试
导出时可以导出, 但是提示: Export done in US7ASCII character set and AL16UTF16 NCHAR character set server uses ZHS16GBK character set (possible charset conversion)
并且:EXP-00091: Exporting questionable statistics.

引起此问题的原因是数据库字符集和操作系统的NLS_LANG不一致导致
SQL> select userenv('language') from dual;

USERENV('LANGUAGE')
----------------------------------------------------
AMERICAN_AMERICA.ZHS16GBK

配置环境变量:NLS_LANG=AMERICAN_AMERICA.ZHS16GBK

注: 有时候, 配置环境变量之后, 不一定生效, 可以再控制台输入%NLS_LANG%看一下是否已经生效, 或者重新注销再登录系统试一下.