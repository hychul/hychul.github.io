# H2 Console

`springboot-starter-web`을 사용하면 h2-console 설정만으로 h2-console을 실행할수 있었지만, `springboot-starter-webflux`는 별도로 콘솔을 띄워주는 코드를 작성해야한다.

```gradle
<!-- build.gradle -->
dependencies {
    ...
	implementation 'org.springframework.boot:spring-boot-starter-data-r2dbc'

	implementation 'io.r2dbc:r2dbc-h2'
    ...
```

> ### Spring initializr 를 사용하여 webflux + h2 database + R2DBC를 구성한 경우
>
> `org.h2.tools.Server`를 사용해 콘솔을 실행하기 위해 아래와 같이 수정한다.
>
> `runtimeOnly 'com.h2database:h2'` 삭제  
> `runtimeOnly 'io.r2dbc:r2dbc-h2'` -> `implementation 'io.r2dbc:r2dbc-h2'`

## Console Server

먼저 앞에서 말한대로 `org.h2.tools.Server`를 사용하여 콜솔 서버를 띄어준다.

```java
// H2ServerConfig
package com.hychul.quiz.config;

import lombok.extern.slf4j.Slf4j;
import org.h2.tools.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;

import java.sql.SQLException;

@Slf4j
@Profile("h2")
@Configuration
public class H2ServerConfig {
    private Server webServer;

    @Value("${h2-console-port:8081}")
    Integer h2ConsolePort;

    @EventListener(ContextRefreshedEvent.class)
    public void start() throws SQLException {
        log.info("starting h2 console at port {}", h2ConsolePort);
        this.webServer = Server.createWebServer("-webPort", h2ConsolePort.toString());
        this.webServer.start();
    }

    @EventListener(ContextClosedEvent.class)
    public void stop() {
        log.info("stopping h2 console at port {}", h2ConsolePort);
        this.webServer.stop();
    }
}
```

## R2DBC Config

다음으로는 R2DBC 설정한다.

```java
// R2dbcConfig
package com.hychul.quiz.config;

import io.r2dbc.spi.ConnectionFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.r2dbc.config.AbstractR2dbcConfiguration;
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;
import org.springframework.r2dbc.connection.init.ConnectionFactoryInitializer;
import org.springframework.r2dbc.connection.init.ResourceDatabasePopulator;

@Profile("h2")
@Configuration
@EnableR2dbcRepositories
public class R2dbcConfig extends AbstractR2dbcConfiguration {

    @Override
    public ConnectionFactory connectionFactory() {
        // Using yaml property configuration
        return null;
    }

    @Bean
    ConnectionFactoryInitializer initializer(ConnectionFactory connectionFactory) {

        ConnectionFactoryInitializer initializer = new ConnectionFactoryInitializer();
        initializer.setConnectionFactory(connectionFactory);
        initializer.setDatabasePopulator(new ResourceDatabasePopulator(new ClassPathResource("schema-h2.sql")));

        return initializer;
    }
}

```

R2DBC의 컨피크 클래스를 오버라이딩하여 `ConnectionFactory`을 `H2ConnectionFactory`으로 반환할 수 있지만, 위의 예시에선 `null`을 리턴하도록 해서 yaml 프로퍼티 파일을 통해 설정된 `ConnectionFactory`를 사용하도록 했다

`ConnectionFactory`를 코드상에서 설정하는 경우 yaml 파일을 통해서 지정되는 설정이 다른 부분들과 충돌을 하는 것인지 제대로 설정되지 않아 yaml 파일을 통해서 설정해야지 데이터베이스 이름이나, 인메모리 이외의 파일로 H2 데이터베이스를 사용하는 등의 설정이 가능했다.

```yaml
spring:
  r2dbc:
    # url: r2dbc:h2:mem:///testdb
    url: r2dbc:h2:file:///./testdb
    username: sa
    password:
  jpa:
    defer-datasource-initialization: true
```

위의 설정파일을 읽으면 대략적으로 유추할 수 있겠지만, 서버가 종료 되더라도 데이터를 유지하기 위해 file DB 설정을 사용했다. 인메모리 H2 DB를 사용하기 위해서 주석 처리된 설정을 사용하면 된다.

R2DBC 설정 이외의 jpa와 관련된 설정이 보이는데, 해당 설정은 Spring Boot 2.5 버전 이상부터 하이버네이트 초기화보다 .sql 파일이 먼저 실행되는 오류가 있다고 하여 적용하였다. (Spring Boot 3.0에서 해당 이슈가 발생하지 않는 것 같다)

## 데이터 초기화

`R2dbcConfig` 클래스에서 설정한 것과 같이 프로젝트가 실행될 때 지정한 'schema-h2.sql' 파일의 SQL이 실행 되도록 'resources` 디렉토리 하위에 해당 파일을 추가해야 한다.

```sql
create table if not exists "user" (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_no VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(50) NOT NULL,
    created_ts timestamp NOT NULL,
    updated_ts timestamp NOT NULL
);

INSERT INTO "user" (name, employee_no, created_ts, updated_ts)
SELECT * FROM values ('administrator', 'hychl', now(), now())
WHERE NOT EXISTS (
    SELECT * FROM "user" QUALIFY employee_no = 'administrator'
);
```

DB의 내용을 H2 파일 데이터베이스에 저장하기 떄문에 무작정 데이터를 insert 하는 경우엔 duplicated unique key 에러가 발생하기 때문에 insert 절에서 동일한 키를 가진 데이터가 있는지 확인하는 조건을 추가했다.

## Repository

```java
package com.hychul.quiz.domain.model;

import lombok.Data;
import lombok.experimental.Accessors;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.Instant;

@Table(name="\"user\"")
@Data
@Accessors(chain = true)
public class User {
    @Id
    private String id;

    private String employeeNo;

    private String name;

    private Instant createdTs;
    private Instant updatedTs;
}
```

설계한 테이블과 맵핑되는 형태로 구성한 엔티티 클래스를 생성해준다. 보통은 테이블 이름과 클래스명이 같은 경우 `@Table` 어노테이션 없이 클래스 명을 통해서 테이블과 맵핑되지만, H2의 경우 'user' 테이블을 예약어로 사용하고 있어서 \" 를 사용하여 명시해주었다.

```java
package com.hychul.quiz.adapter.persistence;

import com.hychul.quiz.domain.model.User;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;

public interface UserRepository extends ReactiveCrudRepository<User, String> {
}
```

리포지토리는 기존 Spring Data JPA에서 사용하던 것과 같이 인터페이스 형태로 사용할 수 있다. 차이점이라면 `ReactiveCrudRepository`를 상속하고, 해당 리포지토리의 리턴 타입이 `Mono`와 `Flux`라는 것이다.

## 실행

컨피크 클래스에서 "h2" profile을 사용할 떄 동작하도록 설정했기 때문에 프로젝트를 실행할때 "h2" 프로파일을 설정한 후 실행해야 H2 DB 설정과 함께 실행시킬 수 있다.
