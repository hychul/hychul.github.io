# 7-1. 쿠버네티스 Service 개념과 종류!

https://www.youtube.com/watch?v=5sKkIg7k8nw  
https://kubernetes.io/ko/docs/concepts/services-networking/service/

서비스 = 쿠버네티브 네트워크

- 서비스 개념
- 서비스 타입 (4가지)
- 서비스 사용하기
- 헤드리스 서비스
- kube-proxy

1. Kubernetes Service의 개념

- 동일한 서비스를 제공하는 Pod 그룹의 단일 진입점(virtual ip)을 제공

```yaml
apiVersion: v1
kind: Service
metadata:
  # 이름 지정
  name: my-service
spec:
  # 단일 진입점 IP 지정 (일반적으론 생략)
  clusterIP: 10.96.100.100
  selector:
    # 묶을 라벨을 지정
    app: MyApp
  ports:
    - protocol: TCP
      # clusterIP's port
      port: 80
      # pod's port
      targetPort: 9376
```

2. Kubernetes Serivce Type

- ClusterIP (default)
  - Pod 그룹의 단일 진입점 (virtual IP) 생성
  - 클러스터 내부에서만 사용가능
- NodePort
  - Cluster IP 생성 후
  - 모든 worker node에 외부에서 접속 가능한 포드가 예약
- LoadBalancer
  - 클라우드 인프라(AWS, Azure, GCP 등)나 오픈스택 클라우드에 적용
  - LoadBalancer를 자동으로 프로 비전하는 기능 지원
- ExternalName
  - 클러스터 안에서 외부에 접속 시 사용할 도메인을 등록해서 사용
  - 클러스터 도메인이 실제 외부 도메인으로 치환되어 동작

> 아래쪽으로 갈 수록 확장되는 느낌  
> ClusterIP: 서비스를 클러스터-내부 IP에 노출시킨다. 이 값을 선택하면 클러스터 내에서만 서비스에 도달할 수 있다. 이것은 ServiceTypes의 기본 값이다.  
> NodePort: 고정 포트 (NodePort)로 각 노드의 IP에 서비스를 노출시킨다. NodePort 서비스가 라우팅되는 ClusterIP 서비스가 자동으로 생성된다. <NodeIP>:<NodePort>를 요청하여, 클러스터 외부에서 NodePort 서비스에 접속할 수 있다.  
> LoadBalancer: 클라우드 공급자의 로드 밸런서를 사용하여 서비스를 외부에 노출시킨다. 외부 로드 밸런서가 라우팅되는 NodePort와 ClusterIP 서비스가 자동으로 생성된다.  
> ExternalName: 값과 함께 CNAME 레코드를 리턴하여, 서비스를 externalName 필드의 콘텐츠 (예:foo.bar.example.com)에 매핑한다. 어떤 종류의 프록시도 설정되어 있지 않다.

# 7-2. 쿠버네티스 Service 4가지 종류 실습해보기

## ClusterIP

```yaml
apiVersion: v1
kind: Service
metadata:
  # 이름 지정
  name: my-service
spec:
  # 생략 시 ClusterIP(default)
  type: ClusterIP
  # 단일 진입점 IP 지정 (일반적으론 생략)
  clusterIP: 10.96.100.100
  selector:
    # 묶을 라벨을 지정
    app: MyApp
  ports:
    - protocol: TCP
      # clusterIP's port
      port: 80
      # pod's port
      targetPort: 9376
```

```shell
$ kubectl describe svc [serivce-name]
Name:               my-service
...
Port:               80/TCP
TargetPort:         10.36.0.1:9376,10.36.0.2:9376,10.36.0.3:9376
...
```

## NodePort

- default NodePort 범위 : 30000-32767

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  # NodePort 서비스 지정
  type: NodePort
  clusterIP: 10.96.100.100
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
      # 생략 가능 (생략 시 랜덤)
      nodePort: 30200
```

## LoadBalancer

- public 클라우드를 통해 외부 로드 밸런서가 각 노드에 접근하도록 구성 요청

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  # LoadBalancer 서비스 지정
  type: LoadBalancer
  clusterIP: 10.96.100.100
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
```

## ExternalName

- 클러스터 내부에서 External(외부)의 도메인을 설정
- 서비스 이름으로 호출하면 외부 도메인으로 연결

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  # ExternalName 서비스 지정
  type: ExternalName
  # 도메인 지정
  externalName: google.com
```

# 7-3. 쿠버네티스 Headless Service와 Kube Proxy 강좌

## Kubernetes 헤드리스 서비스

- ClusterIP가 없는 서비스로 단일 진입점이 필요 없을 때 사용
- Service와 연결된 Pod의 endpoint로 DNS 레코드가 k8s core에 생성됨
  - Pod들의 endpoint에 DNS resolving service 지원
- 단일 진입점은 생성되지 않지만 endpoints들을 하나의 서비스로 묶임
- resolving record가 기록된다.
- Pod의 DNS 주소 : pod-ip-addr.namespace.pod.cluster.local
- **쿠버네티스의 구현에 묶이지 않고, 헤드리스 서비스를 사용하여 다른 서비스 디스커버리 메커니즘과 인터페이스할 수 있다.**

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  type: ClusterIP
  # Headless service를 위해 명시적으로 None 지정
  clusterIP: None
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
```

## kube-proxy

- Kubernetes Service의 backend 구현
- endpoint 연결을 위한 iptables 구성
- 각 노드마다 존재
- nodoePort로의 접근과 pod 연결을 구현(iptables 구성)

mode

- userspace
  - k8s 초기버전에 잠깐 사용
- iptables
  - degault kubernetes network mode
  - kube-proxy는 service API요청 시 iptables rule 생성
  - 클라이언트 연결은 kube-proxy가 받아서 iptables 룰을 통해 연결
- IPVS
  - 리눅스 커널의 L4 로드밸런싱 기술을 이용
  - 별도의 ipvs 지원 모듈을 설정한 후 적용 가능
  - 지원 알고리즘
    - round-robin
    - least-connection
    - destination hashing
    - source hashing
    - shortest exprected delay
    - never queue

https://stackoverflow.com/questions/49888133/kubernetes-service-cluster-ip-how-is-this-internally-load-balanced-across-diffe  
https://kubernetes.io/ko/docs/concepts/services-networking/service/#%EB%9D%BC%EC%9A%B4%EB%93%9C-%EB%A1%9C%EB%B9%88-dns%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EC%A7%80-%EC%95%8A%EB%8A%94-%EC%9D%B4%EC%9C%A0
