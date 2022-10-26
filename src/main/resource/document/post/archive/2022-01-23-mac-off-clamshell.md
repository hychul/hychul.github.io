일을 할때 맥북을 사용하고 있는데, 재택 환경을 만들어 놓다보니 자연스럽게 외장 모니터를 사용하고 있다. 그리고 개인용으로 사용하는 맥미니가 있기 때문에 모니터와 키보드, 마우스 등을 KVM 스위치를 통해서 공유해서 사용하고 있는데, 퇴근을 하고 맥북 모니터를 덮을 때 자연스럽게 모니터도 함께 꺼지면 좋을텐데, 클램쉘 모드로 동작하였다.

시에라 이전의 맥북에선 간단한 명령어로 가능했지만 시에라로 오면서 별도의 어플리케이션(스크립트)를 통해서 이를 설정해야 한다.

> ### macOS 10.10 (요세미티)에서 클램쉘 모드 설정
>
> **클램쉘 모드 끄기**
>
> ```shell
> $ sudo nvram boot-args=iog=0x0
> ```
>
> **클램쉘 모드 켜기**
>
> ```shell
> $ sudo nvram boot-args
> ```

# Solution

macOS 시에라 이상에서는 위 방법이 안된다. 보안문제로 터미널에서 nvram 명령어를 막았다고 한다.

이를 우회해서 클램쉘을 끄기 위해서 누군가 pmset 으로 전원관리세팅을 조정하도록 스크립트를 짜 놓은것을 발견했다.

https://github.com/pirj/noclamshell

설치는 homebrew를 통해서 가능하다.

## noclamshell 설치

아래 명령어를 한 문장씩 터미널에 복사해서 붙여 넣고 엔터친다.

```shell
$ brew install pirj/homebrew-noclamshell/noclamshell
```

## 클램쉘 모드 끄기

설치한 noclamshell을 실행하면 클램쉘 모드를 끌 수 있다.

```
$ brew services start noclamshell
```

## 다시 클램쉘 모드 사용하기

noclamshell 로 클램쉘모드를 끈 후에 다시 클램쉘 모드를 사용하려면 다음과 같이 터미널에서 실행하면 된다.

```shell
$ brew services stop noclamshell
$ brew uninstall pirj/homebrew-noclamshell/noclamshell
```
