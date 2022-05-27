<!-- https://jjeong.tistory.com/1489 -->

```yml
spring:
  cloud:
    config:
      allowOverride: true
      overrideNone: true
      overrideSystemProperties: false
```

오버라이드 컨피크 -->

```yml
spring:
  application:
    name: base-config
  cloud:
    config:
      server:
        git:
          uri: [base-config-git-url]
          search-paths: "configuration/common,configuration/common/connection,configuration/{application}"
```
