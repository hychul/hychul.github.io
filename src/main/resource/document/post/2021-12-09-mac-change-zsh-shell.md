macOS의 Catalina(10.15) 부터 기본 쉘이 bash에서 zsh로 변경되었다.

```shell
The default interactive shell is now zsh.
To update yout account to use zsh, please run 'chsh -s /bin/zsh'.
For more details. please visit https://suport.apple.com/kb/HT208050.
user~ $
```

Catalina로 업데이트를 한다고 하더라도 위의 메세지가 뜨는 경우엔 bash가 계속 기본 쉘로 사용되는 것을 의미하는데, 원래 bash를 쓰던 설정이 변경되지 않고 계속 적용되는 까닭인것 같다.

## 현재 맥에 설치된 쉘 확인하기

아래의 명령어를 통해서 현재 설치되어있는 쉘들을 확인할 수 있다.

```shell
$ cat /etc/shells
```

## 기본 쉘을 zsh로 변경하기

기본 쉘을 zsh로 변경하기 위해선 메세지에서 명시한 것 처럼 아래의 명령어를 입력하면 된다.

```shell
$ chsh -s /bin/zsh
```

위에서 chsh 는 chpass 와 동일한 것으로, 사용자의 데이터베이스 정보를 추가하거나 변경하는 ‘유틸리티’다. 옵션 -s 는 사용자의 쉘을 바꿀 때 사용한다.

해당 명령어를 입력한 후 새 터미널을 실행하면 zsh이 적용된 것을 확인 할 수 있다.
