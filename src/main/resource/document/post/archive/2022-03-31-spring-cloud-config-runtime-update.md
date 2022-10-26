# Cloud Config 변경시 Application 에서 이 부분을 반영하는 방법

1. Spring 서버 재시작
2. `@RefreshScope`를 사용하기 (With Actuator)
3. Spring Cloud Bus 활용
4. Git Webhook을 이용한 자동 갱신

<!-- https://madplay.github.io/post/introduction-to-spring-cloud-config -->

# Spring 서버 재시작

그냥 서비스를 다시 시작하면 다시 읽어온다.

# `@RefreshScope`를 사용하기 (With Actuator)

Actuator에서 제공하는 `/actuator/refresh` 엔드포인트를 사용하여 컨피크를 다시 읽고, `@RefreshScope` 어노테이션을 사용하는 컴포넌트를 다시 실행하여 생성자가 실행된다.

![spring-cloud-config-refresh](https://user-images.githubusercontent.com/18159012/161964938-1590e1bd-438e-4f7c-b0cc-3acbd4d06e4c.jpg)

## 적용

적용 전 Spring Actuator가 먼저 추가되어 있어야 한다. 만약 없다면 아래의 의존성을 추가해 준다.

```gradle
implementation 'org.springframework.boot:spring-boot-starter-actuator'
```

### Config 영향을 받는 부분에 `@RefreshScope` 추가하기

Config server의 내용을 사용하는 로직 (예를 들면 `@Value` 등)의 Class 상단에 `@RefreshScope`를 추가한다.

### Config client의 설정 파일(bootstrap.yml) 추가

Client의 설정 파일에 아래의 내용을 추가해준다. 아래의 내용은 yml 기준이다.

```yml
# 리프래시를 위해 추가
management:
  endpoints:
    web:
      exposure:
        include: "refresh"
```

### Post Url 호출하기

해당 서버로 Http Post method 로 해당 URL을 호출한다.

- Spring boot 2.0 이상 : http://[service_url]/actuator/refresh
- Spring boot 2.0 이하 : http://[service_url]/refresh

여기서 service_url은 자신의 프로젝트에 맞는 url (개발용인 경우 localhost)을 적어준다.

## refresh시에 `@PostConstruct` 사용하기

refresh시에 `@PostConstructor`를 사용할 경우 `@EventListener(RefreshScopeRefreshedEvent.class)`를 사용하는 콜백 메서드를 추가하면 이벤트를 받을 때 컴포넌트가 재실행 된다.

## 한계

`@Component`에서 `@ConfigurationProperties` 혹은 `@Value` 어노테이션을 사용하는 경우 해당 bean이 동적으로 리프레시 되지만, `@Bean`을 사용하여 설정 '값'을 사용한 bean은 리프레시 되지 않는다.

```java
    @Bean(name="stringBean")
    @ConditionalOnProperty(name = {"msg.hello", "msg.world"})
    public String getStringBean(@Value("${msg.hello}") String hello, @Value("${msg.world}") String world) {
        return hello + world;
    }
```

위와 같은 코드를 작성한 경우 해당 설정 파일의 값을 사용한 bean인 `stringBean`은 리프레시 되지 않기 때문에 임의로 빈을 재생성해야한다.

> ### Bean re-initailization
>
> 1. Create a method in a bean which will reload its properties.
> 2. Delete and register bean in registry
>
> ```java
> DefaultSingletonBeanRegistry registry = (DefaultSingletonBeanRegistry) context.getBeanFactory();
> registry.destroySingleton({yourbean}) //destroys the bean object
> registry.registerSingleton({yourbeanname}, {newbeanobject}) //add to singleton beans cache
> ```
>
> <br>

# Spring Cloud Bus 활용<sup>[link](https://cloud.spring.io/spring-cloud-bus/reference/html/)</sup>

Spring Cloud Bus는 분산 시스템에서 경량 메세지 브로커의 역할을 한다. 모든 서버에 대해 refresh를 호출하는 것이 아닌 단 한 개의 클라이언트에만 '/actuator/busrefresh' api를 호출하면 모든 클라이언트가 갱신되도록 하기 위해 브로커를 통해 변경 상태를 브로드캐스팅할 수 있다.

![spring-cloud-config-bus](https://user-images.githubusercontent.com/18159012/161964467-28831ea6-cd43-44d4-9c37-14c059f29aef.jpg)

## RabbitMQ

```gradle
implementation 'org.springframework.cloud:spring-cloud-starter-bus-amqp'
```

```yaml
server:
  port: 8089
spring:
  rabbitmq: # RabbitMQ 관련 설정
    host: localhost
    port: 5672
    username: admin
    password: admin

management:
  endpoints:
    web:
      exposure:
        include: busrefresh
```

## Kafka

```gradle
implementation 'org.springframework.cloud:spring-cloud-starter-bus-kafka'
```

```yaml
server:
  port: 8089
spring:
  kafka: # Kafka 관련 설정
    bootstrap-servers: localhost:29092

management:
  endpoints:
    web:
      exposure:
        include:
          - busrefresh
```

# Git Webhook을 이용한 자동 갱신

Spring Cloud Bus를 사용하더라도 refresh 호출 자체를 잊어버린 경우에는 설정 파일의 갱신이 이루어지지 않는다.

자동화를 위해 Git에서 제공하는 `webhook`을 사용하여 Git 저장소에 `push`가 될 때 어플리케이션에 이벤트를 전달 할 수 있다.

Git 저장소에서 Config 서버에 `webhook`을 전달하고 Config 서버에서 다시 Spring Cloud Bus에 refresh 이벤트를 전달하면 모든 클라이언트에 refresh 이벤트가 자동으로 전파될 수 있다.

![spring-cloud-config-webhook](https://user-images.githubusercontent.com/18159012/161964383-6c1c060b-b838-4cf2-8ba1-eae000c72a3b.jpg)

## 적용

spring-cloud-config-monitor 의존성을 통해 Git 저장소에서 push 등으로 변경사항이 발생될 때마다 config 서버가 이벤트를 받을 수 있도록 `/monitor`라는 스프링 엔드 포인트를 노출한다. 해당 엔드 포인트를 사용하기 위해서 `spring.cloud.bus` 설정을 `true`로 활성화 해야한다.

```gradle
implementation 'org.springframework.cloud:spring-cloud-config-monitor'
```

```yaml
spring:
  bus:
    enabled: true
```

이후 해당 엔드포인트(`/monitor`)에 대한 webhook을 Git repo에 추가하면 된다.

# Actuator 없이 갱신

모든 예제들이 Actuator로 구성되어있어서 이부분을 좀 더 살펴 보았다.

## Spring Cloud refresh endpoint 구현<sup>[link](https://github.com/spring-cloud/spring-cloud-commons/blob/main/spring-cloud-context/src/main/java/org/springframework/cloud/endpoint/RefreshEndpoint.java)</sup>

엔드포인트의 구현을 살펴보면 실제적으로 Actuator가 관여하는 부분은 없다.

### 주요 메서드 호출

- `ContextRefresher.refresh()`<sup>[link](https://github.com/spring-cloud/spring-cloud-commons/blob/main/spring-cloud-context/src/main/java/org/springframework/cloud/endpoint/RefreshEndpoint.java#L41)</sup>
- `refreshEnvironment()`<sup>[link](https://github.com/spring-cloud/spring-cloud-commons/blob/b818e72dc11b27ebfb613bdde1bbfaae1aec2019/spring-cloud-context/src/main/java/org/springframework/cloud/context/refresh/ContextRefresher.java#L94)</sup>

```java
public synchronized Set<String> refreshEnvironment() {
  // 먼저 before 변수로 기존 프로퍼티를 가져온다.
  Map<String, Object> before = extract(this.context.getEnvironment().getPropertySources());
  // cloud-config로 부터 다시 property를 가져와서 세팅한다.
  updateEnvironment();
  // 변경된 key들에 대한 EnvironmentChangeEvent 를 발생시킨다.
  Set<String> keys = changes(before, extract(this.context.getEnvironment().getPropertySources())).keySet();
  this.context.publishEvent(new EnvironmentChangeEvent(this.context, keys));
  return keys;
}
```

## 응용

`ContextRefresher`의 `refresh()` 메서드만 호출하면 새롭게 컨피그를 읽어와 `RefreshScopeRefreshedEvent`를 발생시키기 때문에 해당 빈을 가져와 메서드만 호출하면 간단히 컨피그를 업데이트 할 수 있다.

```java
@RestController
@RequestMapping("/refresh")
@RequiredArgsConstructor
public class RefreshController {

    private final ContextRefresher contextRefresher;

    @PostMapping
    public void refreshConfig() {
        contextRefresher.refresh();
    }
}
```

## 응용2

Eureka를 사용하는 MSA 환경에서 현재 UP 상태의 Eureka Client에 api 호출을 하면 어떨까?

> Eureka Client API 목록  
> | HTTP API | 설명 |  
> | --- | --- |  
> | POST /eureka/apps/appID | 레지스트리에 새로운 서비스 인스턴스를 등록 |  
> | DELETE /eureka/apps/appID/instanceID | 레지스트리에서 서비스 인스턴스를 제거 |  
> | PUT /eureka/apps/appID/instanceID | 서버에 하트비트를 전송 |  
> | GET /eureka/apps | 등록된 모든 서비스 인스턴스의 상세 정보를 조회 |  
> | GET /eureka/apps/appID | 특정 서비스의 모든 인스턴스의 상세 정보를 조회 |  
> | GET /eureka/apps/appID/instanceID | 특정 서비스의 특정 인스턴스의 상세 정보를 조회 |  
> | GET /eureka/apps/appID/instanceID/metadata?key=value | 메타 정보 입력값을 갱신 |  
> | GET /eureka/instances/instanceID | 특정 ID를 사용하는 모든 등록된 인스턴스의 상세 정보를 조회 |  
> | PUT /eureka/apps/appID/instanceID/status?value=DOWN | 인스턴스의 상태를 갱신 | </br> e.g

<br>

![spring-cloud-config-webhook-eureka](https://user-images.githubusercontent.com/18159012/162145100-81b51713-11c4-4863-a030-acb380a787c5.jpg)

> ### Reference
>
> Sprintg Cloud Bus : https://cloud.spring.io/spring-cloud-bus/reference/html/  
> Example : https://github.com/hychul/spring-cloud-config
