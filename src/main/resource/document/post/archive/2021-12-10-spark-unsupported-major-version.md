Spark로 작업하는 프로젝트를 개발하는데, 조인된 `DataFrame`으로 어떤 작업을 하려고만 하면 아래와 같은 에러가 발생하면서 제대로 동작을 하지 않았다.

```shell
java.lang.IllegalArgumentException: Unsupported class file major version 58
    at org.apache.xbean.asm6.ClassReader.<init>(ClassReader.java:166)
    at org.apache.xbean.asm6.ClassReader.<init>(ClassReader.java:148)
    ...
```

별다른 에러 메세지 없이 major version이 안맞다고 뜨니까 벙쪘는데, 찾아보니 에러 로그에서 말하는 major version은 JRE와 클래스의 호환성을 의미하는 것이었다. major version이 의미하는 것은 아래와 같다.

```
Java SE 17  = 61,
Java SE 16  = 60,
Java SE 15  = 59,
Java SE 14  = 58,
Java SE 13  = 57,
Java SE 12  = 56,
Java SE 11  = 55,
Java SE 10  = 54,
Java SE 9   = 53,
Java SE 8   = 52,
Java SE 7   = 51,
Java SE 6.0 = 50,
Java SE 5.0 = 49,
JDK 1.4     = 48,
JDK 1.3     = 47,
JDK 1.2     = 46,
JDK 1.1     = 45
```

# Solution

터미널로 실행중이라면 `java -version`과 같은 명령어를 통해 현재 실행중인 환경의 자바 버전을 확인해보고 프로젝트에 맞게 수정하거나, 클래스 파일을 호환성을 위해 Java 14 라면 `javac -target 14 HelloWorld.java` 와 같은 명령어를 통해 생성하면 된다.

IDEA를 사용중이라면 실행 설정에서 프로젝트에 맞는 JDK 버전을 지정해주면 된다.
