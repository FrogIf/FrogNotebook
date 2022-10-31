# gradle

* gradle展示依赖树: ```gradlew dependencies```

* gradle排查依赖:

```
configurations.all {
    exclude group: 'org.springframework.boot', module: 'spring-boot-starter-logging'
}
```