# 6-3. 쿠버네티스 RollingUpdate를 위한 Deployment

## Deployment

https://kubernetes.io/ko/docs/concepts/workloads/controllers/deployment/

replica set과 흡사하지만, replica set을 제어해주는 역할을 하여 rolling update를 위해서 만들어짐

- ReplicaSet을 컨트롤해서 Pod 수를 조절
- Rolling Update & Rolling Back을 지원한다.

> **Rolling Update**  
> 파드 인스턴스를 점진적으로 새로운 것으로 업데이트 하여 티플로이먼트 업데이트가 서비스 중단 없이 이루어 질 수 있도록하는 것.  
> 새로운 파드는 가용한 자원을 보유한 노드로 스케줄 된다.

Deployment -> ReplicaSet -> Pod 를 관리하므로 하위를 삭제 하더라도 동일한 수의 파드가 보장된다.

## Rolling Update

```shell
$ kubectl set image deployment <deploy_name> <container_name>=<new_version_image>
```

새로운 ReplicaSet 을 생성하고 새로운 Pod가 생성시키고 이전의 ReplicaSet 의 Pod를 삭제하는 식으로 진행된다.

### Example

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.14.2
          ports:
            - containerPort: 80
```

- metadata.name 필드에 따라 nginx-deployment 이름으로 디플로이먼트가 생성된다.
- spec.replicas 필드에 따라 디플로이먼트는 3개의 레플리카 파드를 생성한다.
- spec.selector 필드는 디플로이먼트가 관리할 파드를 찾는 방법을 정의한다. 이 사례에서는 파드 템플릿에 정의된 레이블(app: nginx)을 선택한다. 그러나 파드 템플릿 자체의 규칙이 만족되는 한, 보다 정교한 선택 규칙의 적용이 가능하다.
- template 필드에는 다음 하위 필드가 포함되어 있다.
  - 파드는 .metadata.labels 필드를 사용해서 app: nginx 라는 레이블을 붙인다.
  - 파드 템플릿의 사양 또는 .template.spec 필드는 파드가 도커 허브의 nginx 1.14.2 버전 이미지를 실행하는 nginx 컨테이너 1개를 실행하는 것을 나타낸다.
  - 컨테이너 1개를 생성하고, .spec.template.spec.containers[0].name 필드를 사용해서 nginx 이름을 붙인다.

```shell
$ kubectl apply -f https://k8s.io/examples/controllers/nginx-deployment.yaml

# 생성중
$ kubectl get deployments
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   0/3     0            0           1s

# Rollout  상태 확인
Waiting for rollout to finish: 2 out of 3 new replicas have been updated...
...
deployment "nginx-deployment" successfully rolled out

# 생성후
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   3/3     3            3           18s

# ReplicaSet 확인
$ kubectl get rs
NAME                          DESIRED   CURRENT   READY   AGE
nginx-deployment-75675f5897   3         3         3       18s
```

## Rollback

```shell
$ kubectl rollout history deployment <deploy_name>
$ kubectl rollout undo deployment <deploy_name>
```

### Example

```shell
# 히스토리 확인
$ kubectl rollout undo deployment/nginx-deployment
deployments "nginx-deployment"
REVISION    CHANGE-CAUSE
1           kubectl apply --filename=https://k8s.io/examples/controllers/nginx-deployment.yaml
2           kubectl set image deployment/nginx-deployment nginx=nginx:1.16.1
3           kubectl set image deployment/nginx-deployment nginx=nginx:1.161

# 이전 Revision으로 롤백
$ kubectl rollout undo deployment/nginx-deployment

# Revision 2로 롤백
$ kubectl rollout undo deployment nginx-deployment --to-torevision=2
```

yml의 `metadata.annotations.kubernetes.io/change-cause`을 설정<sup>[ref](https://kubernetes.io/ko/docs/concepts/workloads/controllers/deployment/#%EB%94%94%ED%94%8C%EB%A1%9C%EC%9D%B4%EB%A8%BC%ED%8A%B8%EC%9D%98-%EB%A1%A4%EC%95%84%EC%9B%83-%EA%B8%B0%EB%A1%9D-%ED%99%95%EC%9D%B8)</sup>해서 롤링 업데이트를 진행하는 경우 `CHANGE-CAUSE` 항목을 설정 된 값으로 표시할 수 있어 쉽게 비교할 수 있다.

# 6-4. 쿠버네티스 DaemonSet! + RollingUpdate

## Demonset

https://kubernetes.io/ko/docs/concepts/workloads/controllers/daemonset/

- 전체 노드에서 Pod가 한 개씩 실행되도록 보장
- 용도
  - 모든 노드에서 클러스터 스토리지 데몬 실행
  - 모든 노드에서 로그 수집 데몬 실행
  - 모든 노드에서 노드 모니터링 데몬 실행

### Example

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: fluentd-elasticsearch
  namespace: kube-system
  labels:
    k8s-app: fluentd-logging
spec:
  # replicas 갯수를 지정하지 않는다 : 모든 노드에서 실행하기 때문에
  selector:
    matchLabels:
      name: fluentd-elasticsearch
  template:
    metadata:
      labels:
        name: fluentd-elasticsearch
    spec:
      tolerations:
        # this toleration is to have the daemonset runnable on master nodes
        # remove it if your masters can't run pods
        - key: node-role.kubernetes.io/master
          operator: Exists
          effect: NoSchedule
      containers:
        - name: fluentd-elasticsearch
          image: quay.io/fluentd_elasticsearch/fluentd:v2.5.2
          resources:
            limits:
              memory: 200Mi
            requests:
              cpu: 100m
              memory: 200Mi
          volumeMounts:
            - name: varlog
              mountPath: /var/log
            - name: varlibdockercontainers
              mountPath: /var/lib/docker/containers
              readOnly: true
      terminationGracePeriodSeconds: 30
      volumes:
        - name: varlog
          hostPath:
            path: /var/log
        - name: varlibdockercontainers
          hostPath:
            path: /var/lib/docker/containers
```

다른 모든 쿠버네티스 설정과 마찬가지로 데몬셋에는 apiVersion, kind 그리고 metadata 필드가 필요하다.

```shell
$ kubectl apply -f https://k8s.io/examples/controllers/daemonset.yaml
```

## Demonset Rolling Update

https://kubernetes.io/ko/docs/tasks/manage-daemon/update-daemon-set/

데몬셋도 롤링 업데이트를 지원한다.  
Deployment와 다르게 순서가 먼저 pod를 terminating 시키고 새로운 pod를 생성한다.<sup>[link](https://kubernetes.io/ko/docs/tasks/manage-daemon/update-daemon-set/#%EB%8D%B0%EB%AA%AC%EC%85%8B-%EC%97%85%EB%8D%B0%EC%9D%B4%ED%8A%B8-%EC%A0%84%EB%9E%B5)</sup>

# 6-5. 쿠버네티스 StatefulSet

## StatefulSet

https://kubernetes.io/ko/docs/concepts/workloads/controllers/statefulset/

- Pod의 상태를 유지해주는 컨트롤러
  - Pod 이름
  - Pod의 볼륨 (스토리지)
- 용도
  - 안정된, 고유한 네트워크 식별자<sup>[link](https://kubernetes.io/ko/docs/concepts/workloads/controllers/statefulset/#%EC%95%88%EC%A0%95%EC%A0%81%EC%9D%B8-%EB%84%A4%ED%8A%B8%EC%9B%8C%ED%81%AC-%EC%8B%A0%EC%9B%90)</sup>.
  - 안정된, 지속성을 갖는 스토리지<sup>[link](https://kubernetes.io/ko/docs/concepts/workloads/controllers/statefulset/#%EC%95%88%EC%A0%95%EB%90%9C-%EC%8A%A4%ED%86%A0%EB%A6%AC%EC%A7%80)</sup>.
  - 순차적인, 정상 배포(graceful deployment)와 스케일링.
  - 순차적인, 자동 롤링 업데이트.
- 파드신원
  - 스테이트풀셋 파드는 순서, 안정적인 네트워크 신원 그리고 안정적인 스토리지로 구성되는 고유한 신원을 가진다. 신원은 파드가 어떤 노드에 있고, (재)스케줄과도 상관없이 파드에 붙어있다.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  ports:
    - port: 80
      name: web
  clusterIP: None
  selector:
    app: nginx
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  selector:
    matchLabels:
      app: nginx # has to match .spec.template.metadata.labels
  # 서비스 이름을 하지고 이름을 유지한다.
  serviceName: "nginx"
  replicas: 3 # by default is 1
  template:
    metadata:
      labels:
        app: nginx # has to match .spec.selector.matchLabels
    spec:
      terminationGracePeriodSeconds: 10
      containers:
        - name: nginx
          image: k8s.gcr.io/nginx-slim:0.8
          ports:
            - containerPort: 80
              name: web
          volumeMounts:
            - name: www
              mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
    - metadata:
        name: www
      spec:
        accessModes: ["ReadWriteOnce"]
        storageClassName: "my-storage-class"
        resources:
          requests:
            storage: 1Gi
```

특정 Pod가 삭제된 경우 삭제가 완료 될 떄까지 대기했다가 해당 Pod의 이름으로 새로 생성한다.

> **디플로이먼트와 스케일링 보증**  
> N개의 레플리카가 있는 스테이트풀셋이 파드를 배포할 때 연속해서 {0..N-1}의 순서로 생성한다.  
> 파드가 삭제될 때는 {N-1..0}의 순서인 역순으로 종료된다.  
> 파드에 스케일링 작업을 적용하기 전에 모든 선행 파드가 Running 및 Ready 상태여야 한다.  
> 파드가 종료되기 전에 모든 후속 파드가 완전히 종료 되어야 한다.

> Deployment 같은데선 로드 밸런싱 어떻게 하지?  
> https://kubernetes.io/ko/docs/tutorials/stateless-application/expose-external-ip-address/
