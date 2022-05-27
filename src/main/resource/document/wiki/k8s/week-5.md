# 5-5 static Pod(feat. kubelet daemon)

https://youtu.be/qEu_znIYCz0

## static Pod 만들기

- 기존 Pod과 동작 방식과 달리 API에게 요청을 보내지 않는다.
- 특정 노드에 있는 kubelet 데몬에 의해 직접 관리된다.
  - 노드의 `statisPodPath` (일반적으로 '/etc/kublernetes/manifests/')에 k8s yaml를 저장하면 Pod이 실행되고, yaml을 삭제하면 Pod도 삭제된다.
  - > 스케줄러에 의해서 실행되지 않고 해당 노드에서만 실행된다.
  - > `statisPodPath`는 config.yaml을 통해 변경할 수 있다.

> **기존 Pod 동작방식**  
> API를 통해 etcd 정보를 가져가 스케줄러를 거쳐 적절한 노드를 선택해 Pod를 실행한다.

# 5-6 Pod에 Resource 할당하기 (cpu/memory requests, limits)

https://youtu.be/lxCtyWPsb-0

## Pod에 리소스 (cpu, memory) 할당하기

각각의 노드는 cpu, memory 등의 리소스 제약이 존재한다.  
Pod의 리소스 제한을 하지 않으면 한 노드에 여러 Pod가 뜰때, 한 Pod이 모든 리소스를 사용하여 다른 Pod들이 영향을 받을 수 있다.

Pod를 실행할 때 Request와 Limit을 지정하여 리소스를 관리할 수 있다.

### Resource Requests

- Pod를 실행하기 위한 최소의 리소스 양을 요청

### Resource Limits

- Pod가 사용할 수 있는 최대 리소스 양을 제한
- Memory Limit을 초과해서 사용되는 파드는 종료(OOM Kill)되며 다시 스케줄링 된다.

> https://kubernetes.io/docs/tasks/configure-pod-container/assign-cpu-resource/

## yaml 설정

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cpu-demo
  namespace: cpu-example
spec:
  containers:
    - name: cpu-demo-ctr
      image: vish/stress
      # 리소스
      resources:
        limits:
          cpu: "1"
        requests:
          cpu: "0.5"
      args:
        - -cpus
        - "2"
```

- 각 컨테이너 별로 리소스를 설정한다.
- cpu
  - cpu는 코어 갯수를 기준으로 한다.
  - 한개의 코어를 밀리코어로 나타내면 '1000m'과 같다.
- memory
  - 휴먼 리드를 사용하는 MB<sup>megabytes</sup>와 MiB<sup>mebibytes</sup>를 구분한다.
    - 1MB = 1000KB, 1MiB = 1024KiB
  - 표기할 땐 바이트(B) 표기를 따로 하지 않는다.

## 실행

모든 노드에서 실행할 수 없는 리소스를 Request 하는 경우 Pending 상태로 대기하게 된다.  
Limit만 건 경우 Request가 Limit 값과 동일하게 API를 호출한다.

# 5-7 쿠버네티스 Pod 환경변수 설정과 실행 패턴

https://youtu.be/Uc-VnK19T7w

## Pod의 환경변수 설정하기

### 환경변수

- Pod 내의 컨테이너가 실행될 때 필요로 하는 변수
- 컨테이너 제작 시 미리 정의
- Pod 실행 시 미리 정의된 컨테이너 환경변수를 추가/변경할 수 있다.

> https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/

### yaml 설정

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: envar-demo
  labels:
    purpose: demonstrate-envars
spec:
  containers:
    - name: envar-demo-container
      image: gcr.io/google-samples/node-hello:1.0
      # 환경변수
      env:
        - name: DEMO_GREETING
          value: "Hello from the environment"
        - name: DEMO_FAREWELL
          value: "Such a sweet sorrow"
```

## Pod 구성 패턴의 종류

> https://matthewpalmer.net/kubernetes-app-developer/articles/multi-container-pod-design-patterns.html

Multi-container Pod에서 사용되는 컨테이너들이 구성되는 패턴

![](https://matthewpalmer.net/kubernetes-app-developer/multi-container-pod-design.png)

### Sidecar

한 컨테이너에서 로그를 생성하고 다른 컨테이너에서 생성된 로그를 사용하는 등의 경우

### Adapter

시스템 상태등 모니터 정보를 한 컨테이너에서 받아서 서비스 컨테이너에 전달하는 등의 경우

### Ambassador

서비스 서버 컨테이너가 로드 밸런서 컨테이너를 통해 내부 서비스로 연경되는 등의 경우
