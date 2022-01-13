# OpenTelemetry

## 概述

官网描述:

OpenTelemetry is a collection of tools, APIs, and SDKs. Use it to instrument, generate, collect, and export telemetry data (metrics, logs, and traces) to help you analyze your software’s performance and behavior.

OpenTelemetry将OpenTracing和OpenMetrics集成在了一块. 提供了多个维度的应用程序监控.

## 安装使用

这里只介绍java应用. 使用OpenTelemetry来监控应用的方式有两种:

1. 采用sdk, 这种方式控制灵活, 但是侵入性强;
2. 采用java探针的方式, 侵入小;

这里只介绍采用java agent的方式来安装:

1. [下载探针](https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/)
2. 启动应用时, 命令中加入