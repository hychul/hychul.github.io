Oracle에서 괜히 JDK를 유료로 했다가 openJDK를 사용하게 됐는데, 지금은 다시 무료로 사용할 수 있게 철회를 했다고 하지만 아직 많은 프로젝트에서 openJDK를 사용하고 있다.

JDK의 버전 관리를 좀 편하게 하기 위해서 macOS에서 brew로 설치하고, 자바 버전을 바꿔가면서 쉽게 사용할 수 있도록 세팅한 것을 기록한다.

> **선행 작업**
>
> - brew 설치 : [링크](https://brew.sh/index_ko)를 통해서 하면 된다.
> - cask 설치 : `$ brew install cask` 커맨드를 통해서 설치할 수 있다.

# 자바 설치하기

```shell
# brew에 openjdk 레포 추가
$ brew tap adoptopenjdk/openjdk

# 설치 가능한 JDK 검색
$ brew search jdk
==> Formulae
openjdk                                       openjdk@11                                    openjdk@8
==> Casks
adoptopenjdk                      adoptopenjdk12                    adoptopenjdk14-jre                adoptopenjdk8-jre
adoptopenjdk-jre                  adoptopenjdk12-jre                adoptopenjdk14-openj9             adoptopenjdk8-openj9
adoptopenjdk-openj9               adoptopenjdk12-openj9             adoptopenjdk14-openj9-jre         adoptopenjdk8-openj9-jre
adoptopenjdk-openj9-jre           adoptopenjdk12-openj9-jre         adoptopenjdk14-openj9-jre-large   adoptopenjdk8-openj9-jre-large
adoptopenjdk-openj9-jre-large     adoptopenjdk12-openj9-jre-large   adoptopenjdk14-openj9-large       adoptopenjdk8-openj9-large
adoptopenjdk-openj9-large         adoptopenjdk12-openj9-large       adoptopenjdk15                    adoptopenjdk9
adoptopenjdk10                    adoptopenjdk13                    adoptopenjdk15-jre                jdk-mission-control
adoptopenjdk11                    adoptopenjdk13-jre                adoptopenjdk15-openj9             oracle-jdk
adoptopenjdk11-jre                adoptopenjdk13-openj9             adoptopenjdk15-openj9-jre         oracle-jdk-javadoc
adoptopenjdk11-openj9             adoptopenjdk13-openj9-jre         adoptopenjdk15-openj9-jre-large   sapmachine-jdk
adoptopenjdk11-openj9-jre         adoptopenjdk13-openj9-jre-large   adoptopenjdk15-openj9-large
adoptopenjdk11-openj9-jre-large   adoptopenjdk13-openj9-large       adoptopenjdk8
adoptopenjdk11-openj9-large       adoptopenjdk14                    adoptopenjdk8

# 원하는 버전을 설치
$ brew install --cask adoptopenjdk11
$ brew install --cask adoptopenjdk14

# 자바가 설치된 디렉토리 확인
$ /usr/libexec/java_home -V
Matching Java Virtual Machines (2):
    14.0.2 (x86_64) "AdoptOpenJDK" - "AdoptOpenJDK 14" /Library/Java/JavaVirtualMachines/adoptopenjdk-14.jdk/Contents/Home
    11.0.9.1 (x86_64) "AdoptOpenJDK" - "AdoptOpenJDK 11" /Library/Java/JavaVirtualMachines/adoptopenjdk-11.jdk/Contents/Home

# 자바 버전 확인
$ java --version
```

# 자바 버전 관리

bash 쉘을 사용하는 경우는 ~/.bash_profile, zsh쉘인 경우 ~/.zshrc 파일을 수정

> **사용중인 쉘 확인**
>
> ```shell
> $ echo $SHELL
> ```

```vi
# Java Paths
export JAVA_HOME_11=$(/usr/libexec/java_home -v11)
export JAVA_HOME_14=$(/usr/libexec/java_home -v14)

# Java 11
export JAVA_HOME=$JAVA_HOME_11

# Java 14
# 14버전을 사용하고자 하는 경우 아래 주석(#)을 해제하고 위에 11버전을 주석처리 하면된다.
# export JAVA_HOME=$JAVA_HOME_14
```

```shell
# 변경사항을 반영
# z shell
source ~/.zshrc
# bash shell
source ~/.bash_profile
```
