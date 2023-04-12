git에서 다른 브랜치의 파일을 가져오기 위해서는 다음과 같은 명령어를 사용할 수 있다.

```bash
git checkout <branch-name> -- <file>
```

예를 들어, master 브랜치에서 develop 브랜치의 index.html 파일을 가져오려면 다음과 같이 입력하면 된다.

```bash
git checkout develop -- index.html
```

위 명령어는 develop 브랜치에서 index.html 파일을 가져와서 현재 작업 중인 브랜치에 덮어쓴다.  
이때, git status 명령어를 사용하여 작업 트리 상태를 확인하고, 변경 내용을 스테이지에 추가하고 커밋하는 등의 작업을 수행할 수 있다.
