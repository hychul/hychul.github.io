회사에서 새로 지급 받은 Silicon Mac으로 kotlin으로 작성된 프로젝트 실행시에 kapt와 관련하여 다음과 같은 빌드 에러가 발생했다.

```shell
Execution failed for task ':kaptKotlin'.
> A failure occurred while executing org.jetbrains.kotlin.gradle.internal.KaptWithoutKotlincTask$KaptExecutionWorkAction
   > java.lang.reflect.InvocationTargetException (no error message)
...
```

원인에 대한 내용은 하나도 없이 위와같이 그냥 실행에 실패했다는 것인데, 처음 사용하는 Silicon Mac 이었기 때문에 프로세서의 문제인지 찾아봤다.

> **찾아본 링크들**  
> 특정 라이브러리에서 Apple Silicon을 지원하지 않는 문제 : https://whyprogrammer.tistory.com/590  
> IntelliJ와 로컬의 환경설정이 달라서 발생한 문제 : https://www.inflearn.com/questions/196235

# Solution

결과적으론 찾아본 문제들과는 달리 문제는 JDK에 있었다.

지급 받은 맥북에 기본적으로 설치된 JDK버전이 16이었고 해당 JDK에서 kapt를 제대로 지원하지 않는것이 문제였다. 인텔 맥을 사용할 때 JDK을 항상 최신으로 유지했고, 일반적으로 JDK가 하위 버전을 지원하기 때문에 별 생각이 없었는데 새로 JDK를 설치하고 프로젝트 SDK 버전을 수정한 후에는 정상적으로 빌드되었다.

Project Language Level은 동일하게 11인데도 위와같은 에러가 발생하는게 이상하긴 한데, JDK16에서 kapt가 제대로 동작하지 않는 것 같다. ([링크](https://stackoverflow.com/questions/67509099/kapt-is-not-working-properly-with-openjdk-16))
