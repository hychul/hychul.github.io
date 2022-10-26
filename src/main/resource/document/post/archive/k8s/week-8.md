# 6-6 쿠버네티스 Job Controller

https://www.youtube.com/watch?v=AxplqT55Kdg  
https://kubernetes.io/ko/docs/concepts/workloads/controllers/job/

Job

- 항상 pod가 running 중인 상태로 유지
- batch 처리하는 pod는 작업이 완료되면 종료됨
- batch 처리에 적합한 컨트롤러로 pod의 성공적인 완료를 보장
  - 비정상 종료시 동일 pod에서 컨테이너 재실행
  - 정상 종료 시 완료 (pod를 지우진 않음 : 로그등을 확인 할 수 있도록 남겨둔다)

Job Definition

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi
spec:
  template:
    spec:
      containers:
        - name: pi
          image: perl
          command: ["perl", "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
  backoffLimit: 4
```

- `restartPolicy`
  - Never : 새로운 파드를 할당하여 재시도
  - OnFailure : 동일한 파드에서 재시도

> [참고](https://kubernetes.io/ko/docs/concepts/workloads/controllers/job/#%ED%8C%8C%EB%93%9C-%EB%B0%B1%EC%98%A4%ED%94%84-backoff-%EC%8B%A4%ED%8C%A8-%EC%A0%95%EC%B1%85): 만약 잡에 restartPolicy = "OnFailure" 가 있는 경우 잡 백오프 한계에 도달하면 잡을 실행 중인 파드가 종료된다. 이로 인해 잡 실행 파일의 디버깅이 더 어려워질 수 있다. 디버깅하거나 로깅 시스템을 사용해서 실패한 작업의 결과를 실수로 손실되지 않도록 하려면 restartPolicy = "Never" 로 설정하는 것을 권장한다.

## 병렬실행

### 비-병렬(Non-parallel) 잡:

- 일반적으로, 파드가 실패하지 않은 한, 하나의 파드만 시작된다.
- 파드가 성공적으로 종료하자마자 즉시 잡이 완료된다.

### 고정적(fixed)인 완료 횟수 를 가진 병렬 잡:

- .spec.completions 에 0이 아닌 양수 값을 지정한다.
- 잡은 전체 작업을 나타내며, .spec.completions 성공한 파드가 있을 때 완료된다.
- .spec.completionMode="Indexed" 를 사용할 때, 각 파드는 0에서 .spec.completions-1 범위 내의 서로 다른 인덱스를 가져온다.

### 작업 큐(queue) 가 있는 병렬 잡:

- .spec.completions 를 지정하지 않고, .spec.parallelism 를 기본으로 한다.
- 파드는 각자 또는 외부 서비스 간에 조정을 통해 각각의 작업을 결정해야 한다. 예를 들어 파드는 작업 큐에서 최대 N 개의 항목을 일괄로 가져올(fetch) 수 있다.
- 각 파드는 모든 피어들의 작업이 완료되었는지 여부를 독립적으로 판단할 수 있으며, 결과적으로 전체 잡이 완료되게 한다.
- 잡의 모든 파드가 성공적으로 종료되면, 새로운 파드는 생성되지 않는다.
- 하나 이상의 파드가 성공적으로 종료되고, 모든 파드가 종료되면 잡은 성공적으로 완료된다.
- 성공적으로 종료된 파드가 하나라도 생긴 경우, 다른 파드들은 해당 작업을 지속하지 않아야 하며 어떠한 출력도 작성하면 안 된다. 파드들은 모두 종료되는 과정에 있어야 한다.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: pi
spec:
  # 완료 횟수와 병령 실행
  completions: 5
  parallelism: 2
  template:
    spec:
      containers:
        - name: pi
          image: perl
          command: ["perl", "-Mbignum=bpi", "-wle", "print bpi(2000)"]
      restartPolicy: Never
  backoffLimit: 4
```

# 6-7. 쿠버네티스 CronJob / 컨트롤러 총정리!

## 크론잡

잡을 제어해서 원하는 시간에 잡이 실행될 수 있도록 예약하는 기능 : 크론잡은 반복 일정에 따라 잡을 만든다.

> 주의:  
> 모든 크론잡 일정: 시간은 kube-controller-manager의 시간대를 기준으로 한다.
>
> 컨트롤 플레인이 파드 또는 베어 컨테이너에서 kube-controller-manager를 실행하는 경우, kube-controller-manager 컨테이너에 설정된 시간대는 크론잡 컨트롤러가 사용하는 시간대로 결정한다.

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: hello
spec:
  schedule: "*/1 * * * *"
  # 크론잡의 spec이 잡의 템플릿을 감싼다
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: hello
              image: busybox
              imagePullPolicy: IfNotPresent
              command:
                - /bin/sh
                - -c
                - date; echo Hello from the Kubernetes cluster
          restartPolicy: OnFailure
```

## 크론 스케줄 문법

```
# ┌───────────── 분 (0 - 59)
# │ ┌───────────── 시 (0 - 23)
# │ │ ┌───────────── 일 (1 - 31)
# │ │ │ ┌───────────── 월 (1 - 12)
# │ │ │ │ ┌───────────── 요일 (0 - 6) (일요일부터 토요일까지;
# │ │ │ │ │                                   특정 시스템에서는 7도 일요일)
# │ │ │ │ │
# │ │ │ │ │
# * * * * *
```

| 항목                   | 설명                     | 상용 표현     |
| ---------------------- | ------------------------ | ------------- |
| @yearly (or @annually) | 매년 1월 1일 자정에 실행 | 0 0 1 1 \*    |
| @monthly               | 매월 1일 자정에 실행     | 0 0 1 \* \*   |
| @weekly                | 매주 일요일 자정에 실행  | 0 0 \* \* 0   |
| @daily (or @midnight)  | 매일 자정에 실행         | 0 0 \* \* \*  |
| @hourly                | 매시 0분에 시작          | 0 \* \* \* \* |

## 크론잡의 한계

크론잡은 일정의 실행시간 마다 약 한 번의 잡 오브젝트를 생성한다. "약" 이라고 하는 이유는 특정 환경에서는 두 개의 잡이 만들어지거나, 잡이 생성되지 않기도 하기 때문이다. 보통 이렇게 하지 않도록 해야겠지만, 완벽히 그럴 수는 없다. 따라서 잡은 멱등원 이 된다.

만약 startingDeadlineSeconds 가 큰 값으로 설정되거나, 설정되지 않고(디폴트 값), concurrencyPolicy 가 Allow 로 설정될 경우, 잡은 항상 적어도 한 번은 실행될 것이다.

> 주의: startingDeadlineSeconds 가 10초 미만의 값으로 설정되면, 크론잡이 스케줄되지 않을 수 있다. 이는 크론잡 컨트롤러가 10초마다 항목을 확인하기 때문이다.

모든 크론잡에 대해 크론잡 컨트롤러 는 마지막 일정부터 지금까지 얼마나 많은 일정이 누락되었는지 확인한다. 만약 100회 이상의 일정이 누락되었다면, 잡을 실행하지 않고 아래와 같은 에러 로그를 남긴다.

```shell
Cannot determine if job needs to be started. Too many missed start time (> 100). Set or decrease .spec.startingDeadlineSeconds or check clock skew.
```

중요한 것은 만약 startingDeadlineSeconds 필드가 설정이 되면(nil 이 아닌 값으로), 컨트롤러는 마지막 일정부터 지금까지 대신 startingDeadlineSeconds 값에서 몇 개의 잡이 누락되었는지 카운팅한다. 예를 들면, startingDeadlineSeconds 가 200 이면, 컨트롤러는 최근 200초 내 몇 개의 잡이 누락되었는지 카운팅한다.

크론잡은 정해진 일정에 잡 실행을 실패하면 놓쳤다고 카운팅된다. 예를 들면, concurrencyPolicy 가 Forbid 로 설정되었고, 크론잡이 이전 일정이 스케줄되어 여전히 시도하고 있을 때, 그 때 누락되었다고 판단한다.

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: hello
spec:
  schedule: "*/1 * * * *"
  # 최근 500초 동안 누락된 잡을 카운팅
  startingDeadlineSeconds: 500
  # 기본값 Allow
  concurrencyPolicy: Forbid
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: hello
              image: busybox
              imagePullPolicy: IfNotPresent
              command:
                - /bin/sh
                - -c
                - date; echo Hello from the Kubernetes cluster
          restartPolicy: OnFailure
```

크론잡은 오직 그 일정에 맞는 잡 생성에 책임이 있고, 잡은 그 잡이 대표하는 파드 관리에 책임이 있다.

## 완료된 크롭잡 pod 갯수 설정

```shell
$ kubectl get cronjobs.batch -o yaml
```

```yaml
    ...
    schedule: "*/1 * * * *"
    startingDeadlineSeconds: 500
    # 기본값 3으로 설정됨
    successfulJobsHistoryLimit: 3
```
