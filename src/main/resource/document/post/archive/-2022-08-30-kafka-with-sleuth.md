https://stackoverflow.com/questions/29025627/adding-custom-headers-in-kafka-message

Kafka support custom header sinse v0.11.0.0

Spring Cloud Sleuth (boot v2.6.0)

```java
    @Autowired
    private Tracer tracer;

    public void foo() {
        Span span = tracer.currentSpan();
        if (span != null) {
            log.info("Trace ID : {}", span.context().traceIdString());
            log.info("Span ID : {}", span.context().spanIdString());
        } else {
            log.info("NO Span");
        }
    }
```

# Sleuth 에서 배치 리스너에 대해서 트레이싱을 지원하지 않는다.

https://github.com/spring-cloud/spring-cloud-sleuth/issues/1721
