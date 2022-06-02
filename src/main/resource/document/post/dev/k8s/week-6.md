# 6-1 Controller - ReplicationController란?

https://youtu.be/5X3t6VJH2vQ?list=PLApuRlvrZKohaBHvXAOhUD-RxD0uQ3z0c

## 5장 학습내용 정리

- 컨테이너를 실행하는 K8s의 최소 API Pod
- Pod 동작, livenessProbe를 사용한 self-healing Pod
- init container, infra container(pause) 이해하기
- static Pod 만들기, Pod에 resource 할당하기
- 환경변수를 이용해 컨테이너에 데이터 전달하기, pod 구성 패턴의 종류

> **워크로드**
>
> 워크로드는 쿠버네티스에서 구동되는 애플리케이션이다. 워크로드가 단일 컴포넌트이거나 함께 작동하는 여러 컴포넌트이든 관계없이, 쿠버네티스에서는 워크로드를 일련의 파드 집합 내에서 실행한다. 쿠버네티스에서 Pod 는 클러스터에서 실행 중인 컨테이너 집합을 나타낸다.
>
> 쿠버네티스는 다음과 같이 여러 가지 빌트인(built-in) 워크로드 리소스를 제공한다.
>
> - Deployment 및 ReplicaSet (레거시 리소스 레플리케이션컨트롤러(ReplicationController)를 대체). Deployment 는 Deployment 의 모든 Pod 가 필요 시 교체 또는 상호 교체 가능한 경우, 클러스터의 스테이트리스 애플리케이션 워크로드를 관리하기에 적합하다.
> - StatefulSet는 어떻게든 스테이트(state)를 추적하는 하나 이상의 파드를 동작하게 해준다. 예를 들면, 워크로드가 데이터를 지속적으로 기록하는 경우, 사용자는 Pod 와 PersistentVolume을 연계하는 StatefulSet 을 실행할 수 있다. 전체적인 회복력 향상을 위해서, StatefulSet 의 Pods 에서 동작 중인 코드는 동일한 StatefulSet 의 다른 Pods 로 데이터를 복제할 수 있다.
> - DaemonSet은 노드-로컬 기능(node-local facilities)을 제공하는 Pods 를 정의한다. 이러한 기능들은 클러스터를 운용하는 데 기본적인 것일 것이다. 예를 들면, 네트워킹 지원 도구 또는 add-on 등이 있다. DaemonSet 의 명세에 맞는 노드를 클러스터에 추가할 때마다, 컨트롤 플레인은 해당 신규 노드에 DaemonSet 을 위한 Pod 를 스케줄한다.
> - Job 및 CronJob은 실행 완료 후 중단되는 작업을 정의한다. CronJobs 이 스케줄에 따라 반복되는 반면, 잡은 단 한 번의 작업을 나타낸다.

## Controller란

Pod의 개수를 보장

API, etcd, Scheduler, Controller 가 서로 협업하면서 Pod의 개수를 보장한다.

## Controller 종류

https://kubernetes.io/ko/docs/concepts/workloads/controllers/

![k8s-week-6-0](https://user-images.githubusercontent.com/18159012/149648116-bb7ca010-8e22-443d-82a5-a0c42ca039a8.png)

다음과 같이 Daemon Set, Deployment, stateful sets, Job등이 있으며, 각기 다른 특징을 가집니다.

- Daemont Set : 디플로이먼트와 유사하게 파드를 생성하고 관리. 디플로이먼트는 롤링 업데이트나 배포 일시 중지, 재개 등 배포 작업을 좀 더 세분화하여 조작하였다면, 데몬셋은 특정 노드 또는 모든 노드에 항상 실행되어야 할 특정 파드를 관리한다.
- Deployment : 레플리카셋의 상위 개념으로 볼 수도 있다. 레플리카셋을 생성하는 디플로이먼트를 정의할 수 있고, 배포 작업을 좀 더 세분화(롤링 업데이트 등) 하여 조작할 수 있는 기능을 제공한다.
- ReplicaSet : 실행되는 파드 개수에 대한 가용성을 보증 하며 지정한 파드 개수만큼 항상 실행될 수 있도록 관리한다.
  - ReplicationController에서 필요한 기능을 추가로 구현한 컨트롤러
- Stateful Set : 디플로이먼트와 유사하며 동일한 컨테이너 스펙을 기반으로 둔 파드들을 관리한다. 다만, 스테이트풀셋은 각 파드의 독자성을 유지하는 지속적인 식별자를 가진다. (교체 불가)
- CronJob : 크론잡은 지정한 일정에 특정 파드를 실행하는 잡을 실행할 수 있다.
- Job : 잡은 하나 이상의 파드를 지정하고 지정된 수의 파드를 성공적으로 실행하도록 하는 설정, 노드의 H/W 장애나 재부팅 등으로 인해 파드가 정상 실행이 되지 않았을 경우 job은 새로운 파드를 시작하도록 할 수 있다.
- Replication Controller : 레플리케이션컨트롤러 는 언제든지 지정된 수의 파드 레플리카가 실행 중임을 보장한다. 즉, 레플리케이션 컨트롤러는 파드 또는 동일 종류의 파드의 셋이 항상 기동되고 사용 가능한지 확인할 수 있다.
  - K8s 1.0 에서 만들어 졌으며 가장 기본적인 구조

### ReplicationController

https://kubernetes.io/ko/docs/concepts/workloads/controllers/replicationcontroller/

- 요구하는 Pod의 개수를 보장하며 파드 집합의 실행을 항상 안정적으로 유지하는 것을 목표
- 기본 구성
  - selector
  - replicas
  - template
- 라벨 selector를 통해 replicas 수를 확인하고 항상 동일한 개수를 유지하기 위해 삭제 혹은 template으로 '생성'한다.

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: nginx
spec:
  # replication count
  replicas: 3
  # <key>: <value>
  selector:
    app: nginx
  # template to create Pod
  template:
    metadata:
      name: nginx
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx
          ports:
            - containerPort: 80
```

```shell
# replication controller 정보 확인
$ kubectl get replcationcontrollers
NAME    DESIRED     CURRENT     READY   AGE
nginx   3           3           3       96s

$ kubectl get rc
NAME    DESIRED     CURRENT     READY   AGE
nginx   3           3           3       96s

# replication controller 의 nginx에 대한 자세한 정보 확인
$ kubectl describe rc nginx
Name:       ningx
Namespace:  default
Selector:   app: nginx
...

# replication controller를 통한 scale out 혹은 `kubectl edit`
$ kubectl rc nginx --replicas=<num>
```

controller은 selector만 보기 때문에 `kubectl edit`을 통해 버전을 수정하더라도 영향을 주지 않는다.
