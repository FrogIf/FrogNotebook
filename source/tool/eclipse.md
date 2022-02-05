# Eclipse相关

## Eclipse 配置代码提示

windows ——preferences ——java ——editor —— content assist
勾选Java Prolosals 复选框

window --> preferences --> General --> Keys
搜索Word Completion, 将其快捷键置为空
搜索content Assist, 将快捷键置为Alt + /

## Eclipse中的tomcat上传文件Access deny

这是由于user.dir目录配置在了系统目录下导致的, 没有管理员权限不能写入.

找到tomcat示例, General information栏下, 点击Open launch configuration
在arguments下配置Working directory, 选择Other, 配置自己自定义的目录.