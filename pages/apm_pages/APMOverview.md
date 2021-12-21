# APM

APM(Application Performance Monitoring), 即应用程序性能监控. 主要集中在三个维度对应用程序进行监控诊断分析:

* 日志(Logging)
* 链路追踪(Tracing)
* 度量(Metrics)

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

