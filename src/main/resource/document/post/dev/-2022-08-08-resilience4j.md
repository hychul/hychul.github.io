https://happycloud-lee.tistory.com/219

# Resilience4j

<!-- https://logical-code.tistory.com/172 -->

Fault Tolerance 라이브러리

6개의 모듈

- Circuit Breaker
- Bulkhead
- RateLimiter
- Retry
- TimeLimiter
- Cache

## Circuit Breaker

- Circuit Breaker 패턴을 구현한 모듈
- 요청 중 지연된 응답이 몇 퍼센트 이상일 때 서킷의 상태를 CLOSED에서 OPEN으로 바꿀지 설정
- 서킷 상태가 OPEN일 때 CallNotPermittedException과 함께 요청 거정
- 서킷 상태가 OPEN이 되면 설정한 시간 이후에 HALF_OPEN으로 바뀌고 설정한 수만큼 요청을 허용해 서버가 사용 가능 상태인지 확인
- 서킷 상태를 바꾸는 방식(Sliding Window)에는 Count-based Cliding Winodw, Time-based Sliding Winodw 두 가지가 있음

### Count-based Sliding Winodw

N번의 요청 중 M번 실패했을 때 실패율 (Failure Rate)이 설정 값(failureRateThreshold)보다 클 경우 서킷 상태를 OPEN으로 변경시키는 방식

### Time-based Sliding Window

N번의 요청 중 요청 시간이 M 시간을 초과하는 퍼센트(Slow Call Rate)가 설정값(slowCallRateThreshold) 보다 클 경우 서킷 상태를 OPEN으로 변경시키는 방식

## Bulkhead

- 동시 실행 수를 제한

## RateLimiter

- 일정 시간 동안 요청 수를 제한

## Retry

- 요청이 실패했을 경우 재시도 정책

## TimeLimiter

- 원격 서버를 호출하는데 걸리는 시간 제한

## Cache

# Getting Start

## 1. 디펜던시 설정

### 'sping-cloud-starter-circuitbreaker-resilience4j' vs 'sping-cloud-starter-circuitbreaker-reactor-resilience4j'

reactor가 dependency에 추가되어있는 버전이 잇는데 차이점이 뭔지 모르겠네...

## 2. Feign의 circuit breaker 설정

```yaml
feign.circuitbreaker.enabled: true
```

해당 설정 이후로 feign client에서 exeption이 발생하는 경우, `HttpException`이 `NoFallbackAvailableException`에 랩핑되어 예외를 발생시킨다.

```shell
org.springframework.cloud.client.circuitbreaker.NoFallbackAvailableException: No fallback available.
...
```

## 3. Circuit Breaker Config

### 3.1 yaml 설정

### 3.2 Configuration class 설정

```java
    @Bean
    public Customizer<Resilience4JCircuitBreakerFactory> circuitBreakerFactoryCustomizer() {
        CircuitBreakerConfig cbConfig = CircuitBreakerConfig.custom()
                                                            .slidingWindowType(CircuitBreakerConfig.SlidingWindowType.COUNT_BASED)
                                                            .slidingWindowSize(5)
                                                            .failureRateThreshold(20.0f)
                                                            .waitDurationInOpenState(Duration.ofSeconds(5))
                                                            .permittedNumberOfCallsInHalfOpenState(5)
                                                            .build();

        // See FeignAutoConfiguration.DefaultCircuitBreakerNameResolver.resolveCircuitBreakerName() for default resolve id pattern
        return resilience4JCircuitBreakerFactory -> resilience4JCircuitBreakerFactory.configure(builder -> builder.circuitBreakerConfig(cbConfig), "FooFeignClient#getUser(String,boolean)");
    }
```

## 4. Circuit Breaker Fallback Method 설정

```java
@FeignClient(value = "${service-id.foo}")
public interface FooFeignClient {

    @GetMapping("foo/{fooId}?includeBar={includeBar}")
    @CircuitBreaker(name = "getFooCircuitBreaker", fallbackMethod = "getFooFallback")
    Foo getFoo(String fooId, boolean includeBar);

    default Foo getFooFallback(String fooId, boolean includeBar, Throwable t) {
        System.out.println("fallback!!!");
        return null;
    }
}
```

# 참고

https://search.maven.org/artifact/org.springframework.cloud/spring-cloud-starter-circuitbreaker-resilience4j/2.1.3/jar

https://search.maven.org/artifact/org.springframework.cloud/spring-cloud-starter-circuitbreaker-reactor-resilience4j/2.1.3/jar

Resilience4j를 Feign과 함께 사용하기  
https://resilience4j.readme.io/docs/feign  
https://arnoldgalovics.com/spring-cloud-feign-resilience4j-testing  
https://arnoldgalovics.com/spring-cloud-feign-eureka-testing

@FeignClient에서 circuit breaker name을 @BulkHead 어노테이션으로 설정할 수 있나?  
https://github.com/resilience4j/resilience4j/issues/645

@FeignClient 어노테이션과 @CircuitBreaker 어노테이션 함께 사용하기  
https://github.com/resilience4j/resilience4j/issues/559  
https://github.com/resilience4j/resilience4j/pull/579

> **References**  
> https://github.com/resilience4j/resilience4j/issues/645  
> https://resilience4j.readme.io/docs/feign
