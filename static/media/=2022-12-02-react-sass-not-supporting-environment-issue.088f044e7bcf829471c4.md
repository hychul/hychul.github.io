오랜만에 React 블로그를 업데이트 하려고 `npm run deploy` 명령어를 실행했는데 값자기 다음과 같은 에러 메세지가 나오면서 빌드에 실패했다.

```
Node Sass does not yet support your current environment: OS X Unsupported architecture (arm64) with Unsupported runtime
```

node-sass는 기존부터 사용했었고, M1 맥북에서도 계속 빌드를 했었기 때문에 의아했는데 조금 찾아보니 node-sass의 버전이 node와 맞지 않을 경우 발생하는 에러였다. node의 버전도 변경한 적이 없기 때문에 당황스러웠는데, 이럴 경우엔 그냥 node-sass를 리빌드하면 해결이 된다고 한다.

```
npm rebuild node-sass
```

조금 기다리고 나니 리빌드가 완료되었고 리액트 프로젝트의 빌드와 배포 모두 정상적으로 동작했다.
