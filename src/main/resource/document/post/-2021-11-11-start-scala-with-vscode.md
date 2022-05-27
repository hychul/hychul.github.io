IntelliJ에서 스칼라 프로젝트를 시작하기 위해서 Scala 플러그인을 설치하려고 했는데, 내가 사용하는 버전(2021.1)이 해당 플러그인이 지원한느 버전(2020.1 or older)와 맞지 않아 제대로 설치가 되지 않았다. 지원 버전을 설치하려고 했지만 해당 플러그인 외에 사용중이던 플러그인들이 Scala를 지원하는 IDEA 버전과 맞지 않아 모두 꺠져버렸다.  
때문에 최신 버전도 지원하지 않는 Scala를 그냥 ~~그지같은~~ IntelliJ가 아닌 VSCode에서 개발하기로 했다.

![compatiable-jdk-versions](https://user-images.githubusercontent.com/18159012/141228446-1bffc174-eb4f-4d74-ae73-4db6d5ce7234.png)  
https://docs.scala-lang.org/overviews/jdk-compatibility/overview.html

Scala는 JVM위에서 돌아가는 언어이며, Scala버젼별로 JVM 버젼의 호환성이 있으므로 아래 표를 기준으로 Scala버젼을 운영해야한다. Compile은 옛날버젼으로 하되, 실제 code를 Running할때는 최신버젼의 JVM버젼을 사용하는게 일반적이다.

# Scala 설치

## Java 설치

## sbt<sup>Scala Build Tool</sup> 설치

```terminal
$ brew install sbt
$ mkdir scala-playground
$ cd scala-playground
```

## 샘플 프로젝트 생성

```terminal
$ sbt new scala/hello-world.g8
$ cd hello-world-template
```

## SBT 사용하기

```terminal
$ sbt
```

아래 명령을 실행하면 Main.scala 파일을 변경할 때 마다 run이 수행된다.

```terminal
$ ~run
```

이 상태에서 Main.scala의 내용을 수정하면 콘솔 출력을 확인할 수 있다.

## 의존성 추가

build.sbt 를 수정하면 의존성을 추가할 수있다.

스칼라 라이브러리는 https://index.scala-lang.org/ 에서 찾을 수 있다.

## 에디터 세팅하기

Vscode에서 아래의 Extension을 설치하여 Scala 하이라이팅을 사용할 수 있다.

### VS Code extention

Name: Scala Syntax (official)  
Id: scala-lang.scala  
Description: Official Scala Syntax  
Version: 0.3.9  
Publisher: scala-lang  
VS Marketplace Link: https://marketplace.visualstudio.com/items?itemName=scala-lang.scala

FunSuite를 이용한 테스트

설치

- sbt new scala/scalatest-example.g8
- ScalaTest를 의존성으로 자동으로 가짐 (build.sbt 확인)
- sbt test

> 참고자료
>
> - ScalaTest FunSuite - https://www.scalatest.org/getting_started_with_fun_suite
> - ScalaCheck - https://www.scalacheck.org/
> - Specs2 - https://etorreborre.github.io/specs2/

번역을 그지같이 해둔 글이었던듯
원글 : https://docs.scala-lang.org/getting-started/sbt-track/getting-started-with-scala-and-sbt-on-the-command-line.html

SBT 템플릿 : https://github.com/foundweekends/giter8/wiki/giter8-templates
SBT 문서 : https://www.scala-sbt.org/1.x/docs/sbt-new-and-Templates.html
