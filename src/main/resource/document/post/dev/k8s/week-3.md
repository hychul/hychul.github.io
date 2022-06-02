# 5-1-1 Container 정리와 Single / Multi Container Pod 생성

https://youtu.be/0rYt3PcggzA

## Pod의 개념 및 사용하기

### Contianer

하나의 Container = 하나의 어플리케이션

### Pod

- Container를 표현하는 K8s API의 최소단위
  => K8s에선 컨테이너를 직접 실행할 수 없고 Pod 단위로만 실행 가능
- Pod에는 하나 또는 여러 개의 컨테이너(multi-container Pod)가 포함될 수 있음
  - 하나의 Pod는 하나의 동일한 IP를 사용

## Pod 생성

- CLI : `$ kubectl run [Pod name] [container image]`

```shell
$ kubectl run webserver --image-nginx:1.14
```

- Yaml

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: webserver
spec:
  containers:
    - name: nginx-container
      image: nginx:1.14
      imagePullPlicy: Always
      ports:
        - contianerPort: 80
          protocol: TCP
    ...
```

```shell
$ kubectl create -f pod-nginx.yaml
```

## Pod 동작 확인

동작중인 Pod를 원하는 포맷으로 확인할 수 있다.

```shell
$ kubetcl get pods
default namespace의 모든 Pod 확인

$ kubetcl get pods -o [Format:wide|yaml|json]
포맷 지정

$ kubetcl get pods [Pod name] -o wide
특정 Pod 확인

$ kubetcl exec [Pod name] -c [Container name ] -it -- [command]
multi-container Pod의 특정 컨테이너 접근
```

# 5-1-2 Pod 동작 flow

https://youtu.be/nvBKnFfiy7M

## Pod 동작 flow

https://kubernetes.io/ko/docs/concepts/workloads/pods/pod-lifecycle/

## Pod 관리하기

### 동작중인 파드 정보 보기

```shell
$ kubetcl get pods
$ kubetcl get pods --all-namespaces
$ kubetcl get pods -o [Format]
$ kubetcl describe pod [Pod name]
```

### 동작중인 파드 수정

```shell
$ kubetcl edit pod [Pod name]
```

### 동작중인 파드 삭제

```shell
$ kubetcl delete pod [Pod name]
$ kubetcl delete pod --all
```

## CLI를 총해 Yaml 파일 생성

--dry-run 옵션을 통해서 파드를 실행하지 않고 실행 확인을 할 수 있다.

-o 옵션을 통해 yaml 템플릿을 생성할 수 있다.

```shell
$ kubetcl run [Pod name] [container image] --dry-run
$ kubetcl run [Pod name] [container image] --dry-run -o yaml
$ kubetcl run [Pod name] [container image] --dry-run -o yaml > [yaml name].yaml
```
