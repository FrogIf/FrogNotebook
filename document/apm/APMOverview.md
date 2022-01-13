# APM

APM(Application Performance Monitoring), 即应用程序性能监控. 主要集中在三个维度对应用程序进行监控诊断分析:

* 日志(Logging): 用于记录离散的事件. 例如, 应用程序的调试信息或错误信息. 它是我们诊断问题的依据.
* 链路追踪(Tracing): 用于记录请求范围内的信息. 例如, 一次远程方法调用的执行过程和耗时. 它是我们排查系统性能问题的利器
* 度量(Metrics): 于记录可聚合的数据. 例如, 队列的当前深度可被定义为一个度量值, 在元素入队或出队时被更新; HTTP 请求个数可被定义为一个计数器, 新请求到来时进行累加

![三个维度](img/log_trace_metric.png)

这三个方向的监控系统有:

* 日志:
  * ElasticSearch + Logstash + Kibana
* 链路追踪:
  * Skywalking
  * Jaeger
  * OpenTracing
* 度量:
  * Prometheus
  * Grafana
  * OpenMetrics

> 还有很多其他的, 其中OpenTracing + OpenMetrics = OpenTelemetry

