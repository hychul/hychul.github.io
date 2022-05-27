Git을 터미널로 사용하는데, 팀에서 사용하는 커밋 룰 중에 현재 브랜치(Jira 티켓 번호)를 커밋 맨 앞에 명시하도록 하는 게 있다. 일반적으로 IntelliJ와 같은 환경에서 IDEA 자체에서 상태 표시줄 등으로 현재 브랜치를 알려주지만 매번 눈을 터미널에서 상태 표시줄로 가져가는게 귀찮았고, 작업을 막 하다가 나중에 커밋 메세지를 작성할떄야 다른 브랜치인 것을 확인하고 절망한 경우도 있었다.

그래서 윈도우 bash에서 기본으로 설정되던 터미널에 현재 브랜치를 표시하는 기능을 설정하려고 한다.

# Solution (Bash)

빠르게 말하자면 `~/.bash_profile`에 아래의 코드를 추가하면 된다.

```shell
# Git branch in prompt.
parse_git_branch() {
git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ (\1)/'
}
export PS1="\u@\h \W\[\033[01;33m\]\$(parse_git_branch)\[\033[00m\] $ "
```

## 브랜치의 텍스트 색과 효과를 수정하기

위에서 설정한 브랜치의 표시는 `[\033[01;33m\]`를 사용하여 볼드체와 노란색으로 표시한다.

텍스트의 색과 효과는 ';'를 구분문자로 사용하며, 앞에 나오는 텍스트 효과에 normal `00`, bold `01`, underline`04` 를 사용할 수 있다.

텍스트의 색을 설정하고 싶다면 아래의 색중에서 고를 수 있다.

```
Regular colours:
\[\033[00;30m\] – Black
\[\033[00;31m\] – Red
\[\033[00;32m\] – Green
\[\033[00;33m\] – Yellow
\[\033[00;34m\] – Blue
\[\033[00;35m\] – Purple
\[\033[00;36m\] – Cyan
\[\033[00;37m\] – White

High intensity:
\[\033[00;90m\] – Black
\[\033[00;91m\] – Red
\[\033[00;92m\] – Green
\[\033[00;93m\] – Yellow
\[\033[00;94m\] – Blue
\[\033[00;95m\] – Purple
\[\033[00;96m\] – Cyan
\[\033[00;97m\] – White

Background:
\[\033[40m\] – Black
\[\033[41m\] – Red
\[\033[42m\] – Green
\[\033[43m\] – Yellow
\[\033[44m\] – Blue
\[\033[45m\] – Purple
\[\033[46m\] – Cyan
\[\033[47m\] – White

Backgrounds with high intensity:
\[\033[00;100m\] – Black
\[\033[00;101m\] – Red
\[\033[00;102m\] – Green
\[\033[00;103m\] – Yellow
\[\033[00;104m\] – Blue
\[\033[10;95m\] – Purple
\[\033[00;106m\] – Cyan
\[\033[00;107m\] – White
```

# Solution (Zsh)

MacOS가 Catalina 이후로 Bash 대신 Zsh를 기본 쉘로 사용하면서 앞의 설정이 제대로 동작하지 않을 수 있다. 현재 사용하는 쉘의 종류를 확인하고 Zsh인 경우, `~/.zprofile` 혹은 `~/.zshrc` 에 아래의 코드를 추가한다. (존재하지 않는다면 생성한다.)

```shell
# Git branch in prompt.
function parse_git_branch() {
    git branch 2> /dev/null | sed -n -e 's/^\* \(.*\)/(\1)/p'
}

COLOR_DEF=$'\e[0m'
COLOR_USR=$'\e[38;5;243m'
COLOR_DIR=$'\e[38;5;197m'
COLOR_GIT=$'\e[38;5;39m'
setopt PROMPT_SUBST
export PROMPT='${COLOR_USR}%n ${COLOR_DIR}%~ ${COLOR_GIT}$(parse_git_branch)${COLOR_DEF} $ '
```

그후 파일에 따라서 `source ~/.zshrc` 혹은 `source ~/.zprofile` 명령어를 통해 적용한다.

## zprofile 과 zshrc 의 차이점

모든 대화형 세션에서 필요한 것은 '~.zshrc'로 설정해야 한다. 스크립트를 포함하여 모든 zsh 세션에서 필요한 모든 내용은 '~.zshenv'에서 설정해야 한다.

source: https://serverfault.com/a/901476/943175

## Change Color

<!-- http://egloos.zum.com/astrodoo/v/6390834 -->

예제 코드에서 알 수 있듯이 `[38;5;0m` 포맷에서 'm' 바로 앞의 문자를 수정하여 텍스트의 색깔을 설정할 수 있다. 설정할 수 있는 색은 다음 표와 같다.

![256_colors_forground](https://user-images.githubusercontent.com/18159012/145166735-00fda9f4-02df-4124-bd6a-b8b74facce87.png)
