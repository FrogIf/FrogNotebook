# Spring面试题

## Spring是什么?

Spring是一个轻量级的IoC和AOP容器框架。是为Java应用程序提供基础性服务的一套框架，目的是用于简化企业应用程序的开发，它使得开发者只需要关心业务需求。常见的配置方式有三种：基于XML的配置、基于注解的配置、基于Java的配置。

主要由以下几个模块组成:
* Spring Core : 核心类库,提供IOC服务;
* Spring Context : 提供框架式的Bean访问方式, 以及企业级功能(JNDI, 定时任务等);
* Spring AOP : AOP服务;
* Spring Jdbc : 对jdbc抽象, 简化数据访问的异常处理(jdbcTemplate);
* Spring ORM : 对现有的ORM框架的支持;
* Spring Web : 提供基本的面向web的特性, 例如文件上传;
* Spring Mvc : 提供面向Web应用的Model-View-Controllers实现.

## Spring的优点

* 低侵入, 代码污染极低;
* DI机制将对象之间的依赖关系交由框架处理, 减低组件耦合;
* Spring提供了AOP技术, 支持将一些通用的任务集中式管理, 从而提供更好的复用;
* 对主流应用框架提供了集成支持.

## Spring的AOP的理解

AOP, 一般称为面向切面编程, 作为面向对象的补充, 用于将那些与业务无关, 但却对过个对象产生影响的公共行为和逻辑, 抽象并封装为一个可重用的模块, 这个模块被命名为"切面(Aspect)", 减少系统中的重复代码, 降低了模块间的耦合度, 同时提高了系统的可维护性. 可用于权限认证, 日志, 事务处理等.

AOP实现的关键在于 代理模式, AOP代理主要分为静态代理和动态代理. 静态代理的代表为AspectJ, 动态代理则以Spring AOP为代表.

1. AspectJ是静态代理的增强, 所谓静态代理, 就是AOP框架会在编译阶段生成AOP代理类, 因此也称为编译时增强, 他会在编译阶段将AspectJ(切面)织入到Java字节码中, 运行的时候就是增强之后的AOP对象.
2. SpringAOP使用的动态代理, 所谓的动态代理就是说AOP框架不会修改字节码, 而是每次运行时, 在内存中, 临时为方法生成AOP对象, 这个AOP对象包含了目标对象的全部方法, 并且在特定的切点做了增强处理, 并回调原来对象的方法.
3. 静态代理与动态代理区别在于生成AOP代理的对象时机不同, 相对来说AspectJ的静态代理方式具有更好的性能, 但是AspectJ需要特定的编译器进行处理, 而Spring AOP则不需特定的编译器处理.

Spring AOP中动态代理的主要方式有两种, JDK动态代理和CGLIB动态代理:
1. JDK动态代理只提供接口的代理, 不支持类的代理. 核心InvocationHandler接口与和Proxy类, InvocationHandler通过invoke()方法反射来调用目标类中的代码, 动态地将横切逻辑和业务编织在一起; 接着, Proxy利用InvocationHandler动态创建建一个符合某一接口的实例, 生成目标类的代理对象.
2. 如果代理类没有实现接口, 那么SpringAOP会选择使用CGLIB来动态代理目标类. CGLIB(Code Generation Library), 是一个代码生成的类库, 可以在运行时动态的生成指定类的子类对象, 并覆盖其中特定方法, 并添加增强代码, 从而实现AOP. CGLIB是通过继承的方式做动态代理, 因此如果某个类被标记为final, 那么它是无法使用CGLIB做动态代理的.

JDK动态代理示例:

```java
        final ProxyDemo target = new ProxyDemo();
        ProxyDemoInterface proxyInstance = (ProxyDemoInterface) Proxy.newProxyInstance(ProxyDemo.class.getClassLoader(), new Class[]{ProxyDemoInterface.class}, new InvocationHandler() {
            public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                /*proxy就是proxyInstance*/
                System.out.println("before");
                method.invoke(target, args);
                System.out.println("after");
                return null;
            }
        });
        proxyInstance.test();
```

## Spring IOC的理解

* IOC就是控制反转, 是指创建对象的控制权的转移, 以前创建对象的主动权和时机是由自己把控的, 而现在这种权力转移到Spring容器中, 并有容器根据配置文件去创建示例和管理各个实例之间的依赖关系, 对象与对象之间的松散耦合, 也利于功能的复用. DI依赖注入, 和控制反转是同一个概念的不同角度的描述, 即应用程序在运行时依赖IoC容器来动态注入对象需要的外部资源
* 最直观的表达就是, IOC让对象的创建不用去new了, 可以用spring自动生产, 使用java反射机制, 根据配置文件在运行时动态的去创建对象, 并调用对象的方法
* Spring的IOC有三种注入方式: 构造器注入, setter方法注入, 根据注解注入

> IoC让相互协作的组件保持松散的耦合, 而AOP编程允许你把遍布于应用各层的功能分离出来形成可重用的功能组件

## BeanFactory和ApplicationContext有什么区别?

BeanFactory和ApplicationContext是Sprig的两大核心接口, 都可以当做Spring的容器. 其中ApplicationContext是BeanFactory的子接口

* **BeanFactory**: 是Spring里面最底层的接口, 包含了各种Bean定义, 读取Bean配置文档, 管理bean的加载, 实例化, 控制bean的生命周期, 维护bean之间的依赖关系; **ApplicationContext**: 接口作为BeanFactory的派生, 除了提供BeanFactory所具有的功能外, 还提供了完整的框架功能:
    1. 继承MessageSource, 因此支持国际化
    2. 统一的资源文件访问方式
    3. 提供在监听器中注册bean事件
    4. 同时加载多个配置文件
    5. 载入多个(有继承关系)上下文, 使得每一个上下文都专注于一个特定的层次, 比如应用的web层
* **BeanFactory**采用延迟加载的形式注入bean, 即只有在使用到某个bean时, 才对bean进行加载实例化, 这样, 我们就不能发现一些存在的Spring配置问题, 如果Bean的某一个属性没有注入, BeanFactory加载后, 直到第一次调用getBean才会抛出异常. **ApplicationContext**它是在容器启动时, 一次性创建爱了所有的Bean, 这样, 在容器启动时, 我们就可以发现Spring中存在的配置错误, 这样有利于检查所有依赖属性是否注入. ApplicationContext启动后预载入所有的单实例Bean, 通过预载入单实例bean, 确保当你需要的时候, 不需要等待, 因为它们已经创建好了;**相对于基本的BeanFactory, ApplicationContext**唯一不足是占用内存空间. 当应用程序配置的Bean较多是, 程序启动较慢.
* BeanFactory通常已编程的方式被创建, ApplicationContext还能以声明的方式创建, 如使用ContextLoader
* BeanFactory和Application都支持BeanPostProcessor, BeanFactoryPostProcessor的使用, 但两者的使用区别是: BeanFactory需要手动注册, ApplicationContext则是自动注册

## SpringBean的生命周期

1. **实例化Bean**: 对于BeanFactory容器, 当客户向容器请求一个尚未初始化的bean时, 或者初始化bean的时候, 需要注入另一个尚未初始化的依赖是, 容器会调用createBean进行实例化. 对于ApplicationContext容器, 当容器启动结束后, 通过BeanDefinition对象中的信息, 实例化所有的Bean.
2. **设置对象属性(依赖注入)**: 实例化后的对象被封装在BeanWrapper对象中, 紧接着, Spring根据BeanDefinition中的信息, 以及通过BeanWrapper提供的设置属性的接口完成依赖注入.
3. **处理Aware接口**: 接着, Spring会检测该对象是否实现了xxxAware接口, 并将相关的xxxAware实例注入给Bean:
    * 如果这个Bean已经实现了BeanNameAware接口, 会调用它实现的setBeanName(beanId)方法, 此处beanId就是配置文件中的Bean的id值
    * 如果这个Bean实现了BeanFactoryAware接口, 会调用它实现的setBeanFactory()方法, 传递的是BeanFactory
    * 如果这个Bean已经实现了ApplicationContextAware接口, 会调用setApplicationContext()方法, 传入ApplicationContext
4. **BeanPostProcessor**: 如果想对Bean进行一些自定义的处理, 那么可以让Bean实现了BeanPostProcessor接口, 那么将会调用postProcessBeforeInitialization(obj, s)方法
5. **InitializingBean**: 如果实现了InitializingBean, 则调用afterPropertiesSet方法
6. **与init-method**: 如果Bean在Spring配置文件中配置了init-method属性, 则会自动调用其配置的初始化方法
7. **BeanPostProcessor**: 和上面一样, 如果实现了BeanPostProcessor接口, 将会调用postProcessorAfterInitialization(obj, s)方法; 由于这个方法是在Bean初始化结束时调用的, 所以可以被应用于内存或者缓存技术.
    > 至此, 一个Bean就已经被创建完成了, 就可以使用了
8. **DisposableBean**: 当Bean不在需要时, 会经过清理阶段, 如果Bean实现了DisposableBean这个接口, 会调用其实现的destory()方法;
9. **destory-method**: 最后, 如果这个Bean的Spring配置中配置了destory-method属性, 会自动调用其配置的销毁方法.

示例代码如下(方法调用顺序与方法定义顺序一致):

```java
package sch.frog.learn.spring.app;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.stereotype.Component;

@Component
public class GlobalLifeCycleDemoBean implements BeanPostProcessor {
    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("postProcessBeforeInitialization : " + bean + ", beanName : " + beanName);
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("postProcessAfterInitialization : " + bean + ", beanName : " + beanName);
        return bean;
    }
}

//---------------分割线------------------

package sch.frog.learn.spring.app;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.*;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

@Component
public class LifeCycleDemoBean implements BeanNameAware, BeanClassLoaderAware,
        BeanFactoryAware, ApplicationContextAware,
        InitializingBean, DisposableBean {

    public LifeCycleDemoBean() {
        System.out.println("contructor");
    }

    @Override
    public void setBeanName(String s) {
        System.out.println("set bean name : " + s);
    }

    @Override
    public void setBeanClassLoader(ClassLoader classLoader) {
        System.out.println("set bean class loader : " + classLoader.toString());
    }

    @Override
    public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
        System.out.println("set bean factory : " + beanFactory);
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        System.out.println("set applicatoin context : " + applicationContext.getApplicationName());
    }

    // 执行全局的 BeanPostProcessor.postProcessBeforeInitialization

    @PostConstruct
    public void postConstructor(){
        System.out.println("PostConstruct");
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("afterPropertiesSet");
    }

    // 执行全局的 BeanPostProcessor.postProcessAfterInitialization

    @PreDestroy
    public void preDestory(){
        System.out.println("PreDestroy");
    }

    @Override
    public void destroy() throws Exception {
        System.out.println("destroy");
    }
}
```

## 解释Spring支持的几种bean的作用域

Spring容器中的bean可以分为5个范围:
* singleton: 默认, 每个容器中只有一个bean的实例, 单例的模式由BeanFactory自身来维护
* prototype: 为每一个bean请求提供一个实例
* request: 为每一个网络请求创建一个实例, 在请求完成以后, bean会失效并被垃圾回收器回收
* session: 与request范围类似, 确保每一个session中有一个bean实例, 在session过期之后, bean会随之失效
* global-session: 全局作用域, global-session和Portlet应用相关. 当你的应用部署在Portlet容器中工作时, 它包含很多portlet, 如果你想要声明让所有的portlet共用全局的存储变量的话, 那么这全局变量需要存储在global-session中, 全局作用域与Servlet中的session作用域效果相同

## Spring框架中的单例Beans是线程安全的么?

Spring框架并没有对单例bean进行任何多线程的封装处理. 关于单例bean的线程安全和并发问题需要开发者自行去搞定. 但实际上, 大部分的Spring bean并没有可变的状态(比如Serview类和DAO类), 所以在某种程度上说Spring的单例bean是线程安全的. 如果你的bean有多种状态的话(比如 View Model 对象), 就需要自行保证线程安全. 最浅显的解决办法就是将多态bean的作用域由“singleton”变更为“prototype”

## Spring如何处理线程并发问题？

在一般情况下, 只有无状态的Bean才可以在多线程环境下共享, 在Spring中, 绝大部分Bean都可以声明为singleton作用域, 因为Spring对一些Bean中非线程安全状态采用ThreadLocal进行处理, 解决线程安全问题

ThreadLocal和线程同步机制都是为了解决多线程中相同变量的访问冲突问题. 同步机制采用了“时间换空间”的方式, 仅提供一份变量, 不同的线程在访问前需要获取锁, 没获得锁的线程则需要排队. 而ThreadLocal采用了“空间换时间”的方式

ThreadLocal会为每一个线程提供一个独立的变量副本, 从而隔离了多个线程对数据的访问冲突. 因为每一个线程都拥有自己的变量副本, 从而也就没有必要对该变量进行同步了. ThreadLocal提供了线程安全的共享对象, 在编写多线程代码时, 可以把不安全的变量封装进ThreadLocal

> 个人想法: 如果是springmvc应用, 不同的request可用复用一个线程时, 需要推敲使用threadLocal是否合适

## Spring 框架中都用到了哪些设计模式?

* 工厂模式: BeanFactory就是一个简单的工厂模式的体现, 用来创建对象的实例.
* 单例模式: Bean默认为单例模式.
* 代理模式: Spring的AOP功能用到了JDK的动态代理和CGLIB字节码生成技术.
* 模板方法模式: 用来解决代码重复的问题. restTemplate, jdbcTemplate
* 观察者模式: 定义对象间一种一对多的依赖关系, 当一个对象的状态发生改变时, 所有依赖它的对象都会得到通知被动更新, 例如SpringListener的实现--ApplicationListener

ApplicationListener演示:

```java
@Component
public class EventBean implements ApplicationListener<ContextRefreshedEvent> {
    @Override
    public void onApplicationEvent(ContextRefreshedEvent contextRefreshedEvent) {
        // do something
    }
}
```

## Spring事务

**Spring事务种类**

* 编程式事务: 使用transactionTemplate
* 声明式事务: 建立在AOP之上, 本质就是通过AOP对方法进行around

> 声明式事务的优点: 使用@Transactional注解, 侵入低, 不污染代码
> 声明式事务的缺点: 粒度只能到方法级别, 无法做到代码块级别

声明式事务演示:

```java
@Transactional(propagation = Propagation.REQUIRED, isolation = Isolation.DEFAULT, timeout = 30 /*秒*/, readOnly = false, rollbackFor = Exception.class)
```

**Spring 事务传播行为**

spring事务的传播行为说的是, 当多个事务同时存在的时候, spring如何处理这些事务的行为

* PROPAGATION\_REQUIRED: 如果当前没有事务, 就创建一个新事务, 如果当前存在事务, 就加入该事务
* PROPAGATION\_SUPPORTS: 支持当前事务, 如果当前存在事务, 就加入该事务, 如果当前不存在事务, 就以非事务执行
* PROPAGATION\_MANDATORY: 支持当前事务, 如果当前存在事务, 就加入该事务, 如果当前不存在事务, 就抛出异常
* PROPAGATION\_REQUIRES\_NEW: 创建新事务, 无论当前存不存在事务, 都创建新事务(独立于原来的事务, 两个事务互不影响)
* PROPAGATION\_NOT\_SUPPORTED: 以非事务方式执行操作, 如果当前存在事务, 就把当前事务挂起
* PROPAGATION\_NEVER: 以非事务方式执行, 如果当前存在事务, 则抛出异常
* PROPAGATION\_NESTED: 如果当前存在事务, 则在嵌套事务内执行. 如果当前没有事务, 则按REQUIRED属性执行(里面事务回滚不会影响到外面, 外面事务回滚, 里面一同回滚)

**Spring中的隔离级别**

* ISOLATION\_DEFAULT: 这是个 PlatfromTransactionManager 默认的隔离级别, 使用数据库默认的事务隔离级别
* ISOLATION\_READ\_UNCOMMITTED: 读未提交, 允许另外一个事务可以看到这个事务未提交的数据
* ISOLATION\_READ\_COMMITTED: 读已提交, 保证一个事务修改的数据提交后才能被另一事务读取, 而且能看到该事务对已有记录的更新
* ISOLATION\_REPEATABLE\_READ: 可重复读, 保证一个事务修改的数据提交后才能被另一事务读取, 但是不能看到该事务对已有记录的更新
* ISOLATION\_SERIALIZABLE: 一个事务在执行的过程中完全看不到其他事务对数据库所做的更新

**Spring框架中有哪些不同类型的事件**

Spring 提供了以下5种标准的事件:

* 上下文更新事件(ContextRefreshedEvent): 在调用ConfigurableApplicationContext 接口中的refresh()方法时被触发
* 上下文开始事件(ContextStartedEvent): 当容器调用ConfigurableApplicationContext的Start()方法开始/重新开始容器时触发该事件
* 上下文停止事件(ContextStoppedEvent): 当容器调用ConfigurableApplicationContext的Stop()方法停止容器时触发该事件
* 上下文关闭事件(ContextClosedEvent): 当ApplicationContext被关闭时触发该事件. 容器被关闭时, 其管理的所有单例Bean都被销毁
* 请求处理事件(RequestHandledEvent): 在Web应用中, 当一个http请求(request)结束触发该事件

> 如果一个bean实现了ApplicationListener接口, 当一个ApplicationEvent被发布以后, bean会自动被通知


## 解释一下Spring AOP里面的几个名词

* 切面(Aspect): 被抽取的公共模块, 可能会横切多个对象. 在Spring AOP中, 切面可以使用通用类(基于模式的风格)或者在普通类中以@AspectJ 注解来实现
* 连接点(JoinPoint): 指target方法, 在SpringAOP中, 一个连接点总是代表一个方法的执行
* 通知(Advice): 在切面的某个特定的连接点(Join Point)上执行的动作. 通知有各种类型: "around", "before", "after"等通知.
* 切入点(Pointcut): 切入点是指 我们要对哪些Join point进行拦截的定义. 过切入点表达式，指定拦截的方法，比如指定拦截add\*, search\*
* 引入(Introduction): 声明额外的方法或者某个类型的字段. Spring允许引入新的接口(以及一个对应的实现)到任何被代理的对象. 例如, 你可以使用一个引入来使bean实现 IsModified 接口, 以便简化缓存机制
* 目标对象(Target Object): 被一个或者多个切面(aspect)所通知(advise)的对象. 也有人把它叫做被通知(adviced)对象. 既然Spring AOP是通过运行时代理实现的, 这个对象永远是一个被代理(proxied)对象
* 织入(Weaving): 指把增强应用到目标对象来创建新的代理对象的过程. Spring是在运行时完成织入

> 切入点(pointcut)和连接点(join point)匹配的概念是AOP的关键, 这使得AOP不同于其它仅仅提供拦截功能的旧技术. 切入点使得定位通知(advice)可独立于OO层次. 例如, 一个提供声明式事务管理的around通知可以被应用到一组横跨多个对象中的方法上

## Spring通知类型

* 前置通知(Before advice): 在某连接点(join point)之前执行的通知, 但这个通知不能阻止连接点前的执行(除非它抛出一个异常)
* 返回后通知(After returning advice): 在某连接点(join point)正常完成后执行的通知. 例如: 一个方法没有抛出任何异常, 正常返回
* 抛出异常后通知(After throwing advice): 在方法抛出异常退出时执行的通知
* 后通知(After (finally) advice): 当某连接点退出的时候执行的通知(不论是正常返回还是异常退出)
* 环绕通知(Around Advice): 包围一个连接点(join point)通知, 如方法调用.

## SpringMVC工作原理

1. 客户端请求, 进入DispatchServlet, 访问dispatchServlet的doService方法
2. DispatchServlet根据请求信息调用HandlerMapping, 解析请求对应的Handler
3. 开始执行匹配的拦截器
4. 根据解析到的handler, 交由HandlerAdapter处理
5. 处理完成, 返回ModelAndView, Model是返回的数据对象, View是逻辑视图
6. ViewResolver会根据逻辑View查找实际的View
7. DispatcherServlet把返回的Model传给View(视图渲染)
8. 把View返回给请求者

## Spring容器访问性

父容器不能访问子容器
子容器可以访问父容器

如果Spring与spring MVC是分开进行包扫描的, 那么SpringMVC是子容器, 子容器里面的bean可以访问父容器, 父容器里面的Bean不能访问子容器.

## Reference

* [Spring常见面试题总结(超详细回答)](https://blog.csdn.net/a745233700/article/details/80959716)

