Sprign Boot 3.0의 GA 버전이 얼마전에 출시됐다. [link](https://spring.io/blog/2022/11/24/spring-boot-3-0-goes-ga)

자바 17을 베이스 라인으로 제공한다던데, 새로운 것을 바로 프로젝트에 반영하기엔 위험부담이 크기 때문에 이번 광고팀 연말행사의 퀴즈 이벤트에 쓰일 프로젝트에 적용해보기로 했다.

Spring Initializer를 통해 Spring Boot 3.0으로 프로젝트를 생성한 후 IDE를 통해 프로젝트를 열었더니 뜬금 없이 Gradle 쪽에서 다음과 같은 에러 메세지가 출력됐다.

```terminal
A problem occurred configuring root project '2022-year-end-event'.
> Could not resolve all files for configuration ':classpath'.
   > Could not resolve org.springframework.boot:spring-boot-gradle-plugin:3.0.0.
     Required by:
         project : > org.springframework.boot:org.springframework.boot.gradle.plugin:3.0.0
      > No matching variant of org.springframework.boot:spring-boot-gradle-plugin:3.0.0 was found. The consumer was configured to find a runtime of a library compatible with Java 11, packaged as a jar, and its dependencies declared externally, as well as attribute 'org.gradle.plugin.api-version' with value '7.5.1' but:
          - Variant 'apiElements' capability org.springframework.boot:spring-boot-gradle-plugin:3.0.0 declares a library, packaged as a jar, and its dependencies declared externally:
              - Incompatible because this component declares an API of a component compatible with Java 17 and the consumer needed a runtime of a component compatible with Java 11
              - Other compatible attribute:
                  - Doesn't say anything about org.gradle.plugin.api-version (required '7.5.1')
```

기존 프로젝트가 JDK11 버전을 사용하고 있었어서 문제인 것 같아, JDK17(corretto-17.0.5)을 IDE(IntelliJ)에서 다운받아 [Preferences]-[Build, Execution, Deployment]-[Build Tools]-Gradle]의 Gradle JVM 에 설정했는데, 처음에 프로젝트 인덱싱이 잘 걸리는 듯 하다가 IDE에서 에러 알림이 나왔다.

<img width="423" alt="2022-12-02-spring-boot-3 0-gradle-issue-01" src="https://user-images.githubusercontent.com/18159012/205230029-eae6aee6-ec37-42af-9b50-b663d2280a08.png">

대충 찾아보니 IntelliJ의 known-issue로 등롥이 되어있던데, IDE에서 여러 JDK를 지원하지 못하는 것 같았다. 그래서 그냥 brew로 JDK17을 받아 환경변수에 추가한 후에 해당 JDK를 다시 설정했더니 프로젝트 설정이 제대로 동작했다.
