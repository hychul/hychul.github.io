기본 터미널을 bash에서 zsh로 변경하고 git 명령어의 결과가 한글로 표시되게 바뀌었다. brew와 같이 기본 맥에서 사용하는 apple git이 아닌 git을 설치하는 경우에도 한글로 표시하는 경우가 있기 때문에 한글을 제외하고 재설치 하는 방법도 있지만 언어 설정으로 간단하게 영어로 다시 표시되도록 수정할 수 있다.

# Solution

## 현재 언어 설정 확인하기

아래의 명령어를 통해서 현재 언어 설정을 확인 할 수 있다.

```shell
$ echo $LANG
ko_KR.UTF-8
```

## Zsh에서 언어 설정하기

`~/.zshrc` 에 아래의 한줄을 추가하는 것으로 git 언어 설정을 바꿀 수 있다.

```shell
alias git="LANG=en_US.UTF-8 git"
```

그리고 `source ~/.zshrc`를 통해 설정을 적용한다.

위의 설정에서 알 수 있겠지만, git 뿐만 아니라 모든 프로그램에 대해서 언어 설정을 하고 싶다면 git 언어에 대해서 alias 설정하는 대신 `LANG=en_GB` 만 추가하면 된다.