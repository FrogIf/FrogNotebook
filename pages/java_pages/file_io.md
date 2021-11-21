# Java IO

这里说的IO不仅仅含有普通的文件IO流, 也会介绍socket输入输出等.

## Java基本IO流

java IO流可以分为两类:
1. 字节流: 以字节为单位(8bit), 包含两个抽象类: InputStream, OutputStream
2. 字符流: 以字符为单位(8bit), 根据码表映射字符, 包含两个抽象类: Reader, Writer

常用字节流:

![image](img/byte_io.jpg)

常用字符流:

![image](img/char_io.jpg)

从图上可以看出, 字节流的基本实现类是: FileOutputStream和FileInputStream, 其余的实现都是采用装饰者模式对其进行的增强. 这其中OutputStreamWriter/InputStreamReader是将字节流装饰为字符流.

## File

File file = new File(path);
* createNewFile()   // 创建一个新的文件
* delete()  // 删除file对象
* isFile()  // 判断是否是文件
* isDirectory()   //判断是否是文件夹
* exists()  //判断文件或文件夹是否存在
* listFiles()   //若对象代表目录, 返回该目录下所有, 文件及文件夹
* mkdir()   // 创建目录
