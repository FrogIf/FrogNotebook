# Maven使用

## Maven中引入本地jar包

1. 先将jar包放入指定的文件夹中, 例如: <projectPath>/resources/lib
2. 配置pom.xml文件如下示例:

```xml
<dependency>
	<groupId>proxool</groupId>
	<artifactId>proxool-cglib</artifactId>
	<version>0.9.1</version>
	<scope>system</scope>
	<systemPath>${project.basedir}/src/main/resources/lib/proxool-cglib-0.9.1.jar</systemPath>
</dependency>
```


如果, 使用插件打包, 需要对插件进行特殊配置, 例如:

```xml
<plugin>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-maven-plugin</artifactId>
	<configuration>
		<executable>true</executable>
		<!-- springboot插件需要配置配置includeSystemScope为true, 保证system级别的jar可以打包到可执行jar内部 -->
		<includeSystemScope>true</includeSystemScope>
	</configuration>
</plugin>
```

## maven打包命令

```
mvn clean package -Dmaven.test.skip=true  -Dbuild.encrypt=false -pl server-api -X -U
```