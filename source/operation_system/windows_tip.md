# Windows使用

## 配置

1. VisualBox配置. File-References-General-Default Machine Folder默认是C盘的文件夹, 这个会占用大量磁盘空间, 修改改到别的磁盘.

## power shell 有些命令执行失败

有些命令, 在cmd中可以执行, 在power shell中执行就报错了. 例如:

```
PS C:\WINDOWS\system32> ng --version
ng : File C:\Users\frogif\AppData\Roaming\npm\ng.ps1 cannot be loaded because running scripts is disabled on this system. For more information, see about_Execution_Policies at
https:/go.microsoft.com/fwlink/?LinkID=135170.
At line:1 char:1
+ ng --version
+ ~~
    + CategoryInfo          : SecurityError: (:) [], PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccess
```

可以设置一下:

```
PS C:\WINDOWS\system32>  Set-ExecutionPolicy unrestricted

Execution Policy Change
The execution policy helps protect you from scripts that you do not trust. Changing the execution policy might expose you to the security risks described in the about_Execution_Policies help topic at
https:/go.microsoft.com/fwlink/?LinkID=135170. Do you want to change the execution policy?
[Y] Yes  [A] Yes to All  [N] No  [L] No to All  [S] Suspend  [?] Help (default is "N"): A
```

之后就可以了.

> 注意, 是在管理员权限下执行的设置.

## windows共享文件

1. 在需要共享的文件夹下右键 --> 属性 --> 共享 --> 点击共享 --> 下拉列表中选择要共享的用户 --> 点击添加 --> 点击共享
2. 回到共享属性页 --> 点击高级共享 --> 勾选共享此文件夹 --> 设置共享名并赋予访问者权限
3. 打开服务管理器 --> 依次启动:Function Discovery Resource Publication、SSDP Discovery、UPnP Device Host三个服务
4. 打开网络Internet设置 --> 点击共享选项 --> 勾选启用网络发现


访问共享文件:
这台电脑 --> 右键:映射网络驱动器 --> 浏览, 选择要访问的资源, 输入密码等...


## win + r执行相关命令

* mstsc -- 远程控制
* services.msc -- 服务

## 查看端口占用

查看8093端口被哪一个应用使用了

```
PS C:\Users\frog> netstat -ano | findstr "8093"
  TCP    0.0.0.0:8093           0.0.0.0:0              LISTENING       14760
  TCP    [::]:8093              [::]:0                 LISTENING       14760
```

发现是PID=14760的应用, 查看具体应用名

```
PS C:\Users\frog> tasklist | findstr "14760"
java.exe                     14760 Console                    1     54,708 K
```

同时, 可以根据这个pid, 在任务管理器中, 杀死这个进程.

## win10每隔2分钟自动睡眠

这是系统无人值守时睡眠时间的设定，默认是两分钟。

解决方法：
```
1.运行注册表管理器，win+r ，输入regedit.exe
2.定位到HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\238C9FA8-0AAD-41ED-83F4-97BE242C8F20\7bc4a2f9-d8fc-4469-b07b-33eb785aaca0
3.修改attributes的值为2
4.进入高级电源设置，在睡眠选项中会出现“无人参与系统睡眠超时”，将默认的2分钟修改成你想要的时间，我是改成了5分钟和10分钟。
5.大功告成，可以自己试试
```

## 远程连接失败, ..CredSSP...

1. WIN+R，然后运行 regedit 命令
2. 找到路径：：HKLM(缩写)\Software\Microsoft\Windows\CurrentVersion\Policies\System
3. 右键点击新建的Parameters文件夹，新建 DWORD（32）位值（D），文件名为 AllowEncryptionOracle ，设置其值为2
4. 现在再远程连接一下，应该就OK了！

## 屏幕分辨率设置导致屏幕发虚

设置 --> 显示设置 --> Advanced scaling setting --> custom scaling
将数值更改为100, 注销, 再设置为125
或者将数值更改为125, 注销, 再设置为100

## 关闭windows defender

1. 打开注册表regedit
2. 找到HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\SecurityHealthService
3. 然后在窗口右边找到“Start”并右键点击，然后选择“修改”
4. 将“数值数据”处的2修改成3，然后点击确定，然后关闭注册表
5. 然后，我们Ctrl+Alt+Delete打开任务管理器，点击启动
6. 然后右键点击“Windows Defender notification icon”将其禁用
7. 重新启动电脑

## windows启用网络发现

无法开启网络发现主要原因是“网络发现”所依赖的服务没有启用，或者被禁用；“网络发现”所依赖的服务如下：

* Function Discovery Resource Publication
* SSDP Discovery
* UPnP Device Host

win + r 输入services.msc进入服务, 开启上述三个服务.

win + r 输入control进入控制面板, 控制面板\网络和 Internet\网络和共享中心\高级共享设置 即可开启网络发现.

## PowerShell环境变量

查看环境变量:

```
$Env:JAVA_HOME
```

临时修改环境变量:

```
$Env:JAVA_HOME="C:\Program Files\Java\jdk1.8.0_291"
```

分行显示```PATH```环境变量:

```
PS C:\Users\frogif> (type env:PATH) -split ';'
C:\Program Files\PowerShell\7
C:\Windows\system32
C:\Windows
C:\Windows\System32\Wbem
C:\Windows\System32\WindowsPowerShell\v1.0\
C:\Windows\System32\OpenSSH\
C:\Program Files\Intel\WiFi\bin\
C:\Program Files\Common Files\Intel\WirelessCommon\
C:\Program Files (x86)\NVIDIA Corporation\PhysX\Common
C:\Program Files\Java\jdk-11.0.13\bin
C:\Program Files\Java\jdk-11.0.13\jre\bin
D:\DevelopSoftware\apache-maven-3.3.3\bin
C:\Users\frogif\.gradle\wrapper\dists\gradle-4.6-all\bcst21l2brirad8k2ben1letg\gradle-4.6\bin
D:\Program Files\Python27
D:\Program Files\Python27\Scripts\
D:\Program Files\Python3\
D:\Program Files\Python3\Scripts\
C:\Program Files\Git\cmd
C:\ProgramData\chocolatey\bin
C:\Program Files (x86)\Prince\engine\bin
C:\Program Files\nodejs\
C:\Program Files\Docker\Docker\resources\bin
C:\ProgramData\DockerDesktop\version-bin
C:\Program Files\dotnet\
D:\Program Files\OpenCASCADE-7.6.0-vc14-64\ffmpeg-3.3.4-64\bin
D:\Program Files\OpenCASCADE-7.6.0-vc14-64\opencascade-7.6.0\win64\vc14\bin
D:\Program Files\OpenCASCADE-7.6.0-vc14-64\tbb_2017.0.100\bin\intel64\vc14
D:\Program Files\OpenCASCADE-7.6.0-vc14-64\freeimage-3.17.0-vc14-64\bin
D:\Program Files\OpenCASCADE-7.6.0-vc14-64\openvr-1.14.15-64\bin\win64
D:\Program Files\Microsoft Visual Studio\2022\Community\VC\Tools\MSVC\14.30.30705\bin\Hostx64\x64
D:\DevelopSoftware\Qt\5.15.2\msvc2019_64\bin
D:\DevelopSoftware\jvm_lib
%GRADLE_HOME%\bin
D:\DevelopSoftware\Vagrant\bin
C:\Program Files\PowerShell\7\
C:\Users\frogif\AppData\Local\Programs\Python\Python37\Scripts\
C:\Users\frogif\AppData\Local\Programs\Python\Python37\
C:\Users\frogif\AppData\Local\Microsoft\WindowsApps
C:\Users\frogif\AppData\Local\BypassRuntm
C:\Users\frogif\AppData\Local\Microsoft\WindowsApps
D:\DevelopSoftware\Microsoft VS Code\bin
C:\Users\frogif\AppData\Roaming\npm
C:\Users\frogif\.dotnet\tools
C:\Users\frogif\AppData\Local\JetBrains\Toolbox\scripts
```