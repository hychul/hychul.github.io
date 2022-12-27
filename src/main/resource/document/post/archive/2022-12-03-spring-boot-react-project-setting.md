# React 프로젝트 생성

스프링 부트 프로젝트를 생성한 후 'src/main' 아래에 리액트 프로젝트를 생성한다.

```
$ cd src/main
$ npx create-react-app react
```

# React 와 Spring Boot 간 api 연동

## Proxy 설정

CORS를 위한 프록시를 설정해야한다. 리액트 프로젝트 디렉토리에서 다음의 명령어로 'http-proxy-middleware'를 프로젝트에 적용한다.

```
$ npm install http-proxy-middleware --save
```

설치 후 리액트 프로젝트 디렉토리 내부 'src' 디렉토리 안에 'setupProxy.js' 파일을 생성한다. <sup>[react-proxy-document](https://create-react-app.dev/docs/proxying-api-requests-in-development/#configuring-the-proxy-manually)</sup>

```javascript
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware(["/api"], {
      target: "http://localhost:8080",
      changeOrigin: true,
    })
  );
};
```

위의 설정으로 인해, 프론트엔드에서 '/api' path를 통해 api를 호출하는 경우 8080 포트를 사용하는 백엔드로 프록시 된 요청이 전달된다.

## Axios를 통한 api 호출

웹 통신을 위해 axios 라이브러리를 리액트 프로젝트에 추가한다.

```
$ npm install axios --save
```

axios를 사용하면 간단하게 다음과 같이 사용할 수 있다.

```javascript
import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    axios
      .get("/api/health")
      .then((response) => setResponse(response.data))
      .catch((error) => console.log(error));
  }, []);

  return <div>Response : {response}</div>;
}

export default App;
```

# 빌드 설정

Spring Boot 프로젝트가 빌드될 때 React 프로젝트를 먼저 빌드시켜, React 빌드 결과를 Boot 프로젝트 빌드 결과물에 포함시킨다.

```gradle
def reactDir = "$projectDir/src/main/react"

sourceSets {
	main {
		resources { srcDirs = ["$projectDir/src/main/resources"]
		}
	}
}

processResources { dependsOn "moveReactBuildFiles" }

task installReact(type: Exec) {
	workingDir "$reactDir"
	inputs.dir "$reactDir"
	group = BasePlugin.BUILD_GROUP
	if (System.getProperty('os.name').toLowerCase(Locale.ROOT).contains('windows')) {
		commandLine "npm.cmd", "audit", "fix"
		commandLine 'npm.cmd', 'install' }
	else {
		commandLine "npm", "audit", "fix" commandLine 'npm', 'install'
	}
}

task buildReact(type: Exec) {
	dependsOn "installReact"
	workingDir "$reactDir"
	inputs.dir "$reactDir"
	group = BasePlugin.BUILD_GROUP
	if (System.getProperty('os.name').toLowerCase(Locale.ROOT).contains('windows')) {
		commandLine "npm.cmd", "run-script", "build"
	} else {
		commandLine "npm", "run-script", "build"
	}
}

task moveReactBuildFiles() {
	dependsOn "buildReact"
	doLast {
		ant.move file: "$frontendDir/build",
				todir: "$projectDir/src/main/resources/static"
	}
}
```

## 빌드

프로젝트 디렉토리에서 Gradle 빌드 명령어로 빌드하면 작성한 task가 동작한다.

```
$ ./gradlew build
```

빌드된 jar를 실행한 후 localhost로 접속하면 React 페이지가 노출되는 것을 확인 할 수 있다.

```
$ java -jar build/libs/spring-boot-react-0.0.1-SNAPSHOT.jar
```

> Reference  
> [Gradle Move Files](https://docs.gradle.org/current/userguide/working_with_files.html#sec:moving_files_example)
