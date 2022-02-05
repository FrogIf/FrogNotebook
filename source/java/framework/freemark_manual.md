# Freemark使用

## java代码

```java
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;

import freemarker.template.Configuration;
import freemarker.template.Template;

public class FreemarkerDemo {
	
	public static void main(String[] args) throws Exception {
		// 获取数据
		Map<String, Object> dataModel = new HashMap<String, Object>();
		dataModel.put("name", "frog");
		
		String path = FreemarkerDemo.class.getResource("/").getPath();	// 获取类加载的根路径, 基本就是所有java代码编译之后存储的路径classes
		
		// 配置freemarker
		Configuration config = new Configuration(Configuration.VERSION_2_3_28);
		config.setDefaultEncoding("utf-8");
		config.setDirectoryForTemplateLoading(new File(path));	// 设置模板所在目录
		Template template = config.getTemplate("template.ftl");	// 加载模板文件
		
		// 指定输出文件, 创建输出流
		File outFile = new File("test.txt");	// 输出到test.txt文件
		Writer out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(outFile)));

		// 交给freemarker进行组装, 并生成文件
		template.process(dataModel, out);	// 如果文件存在, 直接覆盖
		
		out.close();
	}

}
```


## 插值

```
${name}
#{name}

<#-- 如果为空, 就以!后面的值进行填充 -->
${name!'无名氏'}

<#-- value=12.2, 最终显示的12.20 -->
${value?string('0.00')}

<#-- dateValue=new Date(), 显示2019-02-22 16:56:51 China Standard Time-->
${dateValue?string('yyyy-MM-dd HH:mm:ss zzzz')}
```

## 定义变量

```
<#assign aaaa='sdf'/>
```

## 分支

* **if**
```
<#if (name)??>
    不为空
<#else>
    为空
</#if>

<#assign age=23>
<#if (age>60)>
    老年
<#elseif (age>40)>
    中年
<#elseif (age>20)>
    青年
<#else> 
    少年
</#if> 
```

* **switch**
```
<#switch value>
<#case refValue>
    ...
<#break>
<#case refValue>
    ...
<#break>
<#default>
    ...
</#switch>
```

## 循环

遍历list
```
<#list hobbys as hobby>
${hobby}
</#list> 
```

遍历map
```
<#list maps as m>
${m['gValue']}
</#list>
```

## 嵌入页面

```
<#include filename [options]>
```

## 完整例程

模板文件:
```
<#--加个感叹号可以解决为空的问题-->
${name!"无名氏"}

${value?string('0.00')}

${dateValue?string('yyyy-MM-dd HH:mm:ss zzzz')}

<#if (age>60)>
    老年
<#elseif (age>40)>
    中年
<#elseif (age>20)>
    青年
<#else> 
    少年
</#if> 


<#switch sex>
<#case '1'>男<#break>
<#case '0'>女<#break>
<#default>未指定
</#switch>

<#assign index = 0/>
<#list hobbys as hobby>
<#assign index = index + 1/>
爱好${index}:${hobby}
</#list>

<#list ks as k>
${k.aValue}
${k['aValue']}
</#list>

<#list maps as m>
${m['gValue']}
</#list>
```

java代码:

```java
package sch.frog.freemarker;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import freemarker.template.Configuration;
import freemarker.template.Template;

public class FreemarkerDemo {
	
	public static void main(String[] args) throws Exception {
		// 获取数据
		Map<String, Object> dataModel = new HashMap<String, Object>();
		
		dataModel.put("name", "frog");
		dataModel.put("value", 12.2);
		dataModel.put("dateValue", new Date());
		dataModel.put("age", 12);
		dataModel.put("sex", "1");
		
		List<String> hobbys = new ArrayList<String>();
		hobbys.add("动漫");
		hobbys.add("读书");
		dataModel.put("hobbys", hobbys);
		
		KK k1 = new KK("aaa", "bbb");
		KK k2 = new KK("ccc", "ddd");
		List<KK> ks = new ArrayList<KK>();
		ks.add(k1);
		ks.add(k2);
		dataModel.put("ks", ks);
		
		List<Map<String, String>> maps = new ArrayList<Map<String, String>>();
		Map<String, String> map1 = new HashMap<String, String>();
		map1.put("gValue", "123");
		Map<String, String> map2 = new HashMap<String, String>();
		map2.put("gValue", "sdf");
		Map<String, String> map3 = new HashMap<String, String>();
		map3.put("gValue", "ert");
		maps.add(map1);
		maps.add(map2);
		maps.add(map3);
		dataModel.put("maps", maps);
		
		String path = FreemarkerDemo.class.getResource("/").getPath();	// 获取类加载的根路径, 基本就是所有java代码编译之后存储的路径classes
		
		// 配置freemarker
		Configuration config = new Configuration(Configuration.VERSION_2_3_28);
		config.setDefaultEncoding("utf-8");
		config.setDirectoryForTemplateLoading(new File(path));	// 设置模板所在目录
		Template template = config.getTemplate("template.ftl");	// 加载模板文件
		
		// 指定输出文件, 创建输出流
		File outFile = new File("test.txt");	// 输出到test.txt文件
		Writer out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(outFile)));

		// 交给freemarker进行组装, 并生成文件
		template.process(dataModel, out);	// 如果文件存在, 直接覆盖
		
		out.close();
	}
	
	public static class KK{
		private String aValue;
		private String bValue;
		public String getaValue() {
			return aValue;
		}
		public void setaValue(String aValue) {
			this.aValue = aValue;
		}
		public String getbValue() {
			return bValue;
		}
		public void setbValue(String bValue) {
			this.bValue = bValue;
		}
		public KK(String aValue, String bValue) {
			super();
			this.aValue = aValue;
			this.bValue = bValue;
		}
	}

}
```