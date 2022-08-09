https://happycloud-lee.tistory.com/219

# 'sping-cloud-starter-circuitbreaker-resilience4j' vs 'sping-cloud-starter-circuitbreaker-reactor-resilience4j'

reactor가 dependency에 추가되어있는 버전이 잇는데 차이점이 뭔지 모르겠네...

https://search.maven.org/artifact/org.springframework.cloud/spring-cloud-starter-circuitbreaker-resilience4j/2.1.3/jar

https://search.maven.org/artifact/org.springframework.cloud/spring-cloud-starter-circuitbreaker-reactor-resilience4j/2.1.3/jar

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

> **References**  
> https://github.com/resilience4j/resilience4j/issues/645  
> https://resilience4j.readme.io/docs/feign
