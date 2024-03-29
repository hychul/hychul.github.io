Git을 사용할때 프로젝트의 기능, 스펙 등에 따라 브랜치를 나눠서 작업합니다. 때문에 브랜치 명은 명로하게 설정하는게 좋지만, 한 두개의 단어만으론 설명이 부족한 경우가 있어 브랜치의 설명을 보여줄 수 있으면 좋겠다는 생각을 했다.

다행히 Git에서는 브랜치의 설명을 추가하기 위한 `git branch --edit-description` 이라는 옵션을 지원합니다. vim으로 브랜치 설명을 수정할 수 있다. 커맨드 라인에서 한줄 짜리 브랜치 설명을 수정하려고 할 땐 `git config branch.<branch name>.description "branch description"` 명령어를 사용할 수 있다.

수정한 설명을 보기 위해선 `git config branch.<branch name>.dexcription` 명령어를 사용하면 된다.

한가지 아쉬운 점은 `git branch` 명령어에서 어떠한 옵션으로도 브랜치 명과 설명을 동시에 보여주지 않는다는 것입니다. 때문에 간단히 alias에 함수를 추가해서 브랜치 명과 설명을 동시에 보여줄 수 있는 간단한 코드를 작성했다.

# Bash Shell

```shell
function gitbranch() {
    if [[ $# -eq 0 ]]; then
        branches=`git branch --list --sort=committerdate`
        item=""
        while read -r item; do
            branch=${item//\*\ /}
            description=`git config branch.$branch.description`
            if [[ $description != "" ]]; then
                description=": $description"
            fi

            if [[ "$item" =~ "*" ]]; then
                printf "* \e[0;32m%-15s %s\e[m\n" "$branch" "$description"
            else
                printf "  %-15s %s\n" "$branch" "$description"
            fi
        done <<< "$branches"
    elif [[ $# -eq 1 ]]; then
        branch=$1
        git config branch.${branch}.description
    elif [[ $# -eq 2 ]]; then
        opt=$1
        if [[ $opt == "-m" ]]; then
           branch_name=`git branch | grep \* | cut -d ' ' -f2`
            desc=$2
            git config branch.${branch_name}.description "${desc}"
        fi
    elif [[ $# -eq 3 ]]; then
        opt=$1
        if [[ $opt == "-b" ]]; then
            branch_name=$2
            desc=$3
            git config branch.${branch_name}.description "${desc}"
        fi
    fi
}

```

위 코드를 alias 파일(~/.bash_profile)에 추가하는 것으로 `git-branch` 명령어를 통해 브랜치 명과 설명이 동시에 보여질 수 있다. 또한 추가적으로 해당 명령어에 브랜치명 아규먼트를 추가하여 브랜치에 설명을 추가하거나 설명을 출력할 수 있다.

해당 기능을 git 커맨드를 통해 사용하기 위해 git config 파일(~/.gitconfig)에 추가하면 다른 git alias들과 같이 편하게 사용이 가능하다.

```shell
[alias]
        br = "!f() { \
                if [[ $# -eq 0 ]]; then \
                    source $HOME/.bash_profile && gitbranch; \
                elif [[ $# -eq 1 ]]; then \
                    source $HOME/.bash_profile && gitbranch \"$1\"; \
                elif [[ $# -eq 2 ]]; then \
                    source $HOME/.bash_profile && gitbranch \"$1\" \"$2\"; \
                elif [[ $# -eq 3 ]]; then \
                    source $HOME/.bash_profile && gitbranch \"$1\" \"$2\" \"$3\"; \
                fi; \
              }; f"
```

# Zshell

```shell
gitbranch() {
    if [[ $# -eq 0 ]]; then
        branchs=$(git branch --list --sort=commiterdate)
        item=""
        while read -r item; do
            branch=${item//\*\ /}
            description=$(git config branch.$branch.description)
            if [[ -n $description ]]; then
                description=": $description"
            fi

            if [[ "$item" == *"*"* ]]; then
                printf "* \e[0;32m%-15s %s\e[m\n" "$branch" "$description"
            else
                printf "  %-15s %s\n" "$branch" "$description"
            fi
        done <<< "$branches"
    elif [[ $# -eq 1 ]]; then
        branch=$1
        git config branch.${branch}.description
    elif [[ $# -eq 2 ]]; then
        opt=$1
        if [[ $opt == "-m" ]]; then
           branch_name=`git branch | grep \* | cut -d ' ' -f2`
            desc=$2
            git config branch.${branch_name}.description "${desc}"
        fi
    elif [[ $# -eq 3 ]]; then
        opt=$1
        if [[ $opt == "-b" ]]; then
            branch_name=$2
            desc=$3
            git config branch.${branch_name}.description "${desc}"
        fi
    fi
}
```

```shell
[alias]
        br = "!f() { zsh -i -c 'gitbranch \"$@\"' -- \"$@\"; }; f"
```

# Usage

```terminal
$ git br -m "Test 1"
$ git br
* develop : Test 1
  master
$
$ git br -b develop "Test 2"
$ git br
* develop Test 2
  master
$
$ git br develop
Test 2
$
```
