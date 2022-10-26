Kubernetes 스터디 기록을 위한 스레드

유튜브 강의 영상 : https://www.youtube.com/playlist?list=PLApuRlvrZKohaBHvXAOhUD-RxD0uQ3z0c

# 강의내용

## Part 1. 쿠버네티스 시작하기

1. 쿠버네티스 소개
2. 쿠버네티스 설치하기
3. 쿠버네티스로 컨테이너 실행하기

## Part 2. 쿠버네티스 기본 개념

4. 쿠버네티브 아키텍쳐
5. 파드
6. 컨트롤러
7. 서비스<sup>week9</sup>
8. 인그레스
9. 레이블과 애너테이션
10. 컨피그맵
11. 시크릿

## Part 3. 쿠버네이스 한 걸음 더 들어가기

12. 파드 스케줄링
13. 인증과 권한관리
14. 데이터 저장
15. 클러스터 네트워킹 구성
16. 쿠버네티스 DNS
17. 로깅과 모니터링
18. 오토스케일링
19. 사용자 정의 자원
20. 쿠버네티스 기반으로 워드프레스 앱 실행하기
21. 헬름

# Schedule

| Date | Lecture |
| --- | --- |
| 2021-12-13 | 3-1. kubectl 실습 / 실습환경 구성하기 (14:17)<br>3-2. kubectl command / pod 생성하기 (42:29) |
| 2021-12-20 | 4-1. 쿠버네티스 아키텍처 - Kubernetes 동작원리 (20:11)<br>4-2. 쿠버네티스 아키텍처 - namespace (39:26)<br>4-3. 쿠버네티스 아키텍처 - yaml템플릿과 API (10:48) |
| 2021-12-27 | 5-1-1. 쿠버네티스 Pod - Container 정리와 Single / Multi Container Pod 생성 (47:48)<br>5-1-2. 쿠버네티스 Pod - Pod 동작 flow (19:31) |
| 2022-01-03 | 5-2. Kubernetes Pod - livenessProbe를 이용해서 Self-healing Pod 만들기 (46:22)<br>5-3, 4. Kubernetes Pod - init container & infra container (22:21) |
| 2022-01-10 | 5-5 static Pod(feat. kubelet daemon) (13:33)<br>5-6 Pod에 Resource 할당하기 (cpu/memory rrequests, limits) (25:49)<br>5-7 쿠버네티스 Pod 환경변수 설정과 실행 패턴 (18:20) |
| 2022-01-17 | 6-1 Controller - ReplicationController란? (38:36)<br>6-2. ReplicaSet(ReplicationController와의 차이점은?) 쿠버네티스 pod 개수 보장 (16:57) |
| 2022-01-24 | 6-3. 쿠버네티스 RollingUpdate를 위한 Deployment (38:20)<br>6-4. 쿠버네티스 DaemonSet! + RollingUpdate (16:46)<br>6-5. 쿠버네티스 StatefulSet (14:20) |
| 2022-02-07 | 6-6. 쿠버네티스 Job Controller (23:18)<br>6-7. 쿠버네티스 CronJob / 컨트롤러 총정리! (26:21) |
| 2022-02-14 | 7-1. 쿠버네티스 Service 개념과 종류! (23:20)<br>7-2. 쿠버네티스 Service 4가지 종류 실습해보기 (41:38)<br>7-3. 쿠버네티스 Headless Service와 Kube Proxy 강좌 (23:41) |
| 2021-02-21 | 8-1 Kubernetes Ingress 개념과 Ingress Controller 설치! (24:42)<br>8-2 Kubernetes Ingress 실습 - 웹페이지 구현 (36:35) |
| 2021-02-28 | 9-1. kubernetes label 쿠버네티스 레이블 (33:37)<br>9-2. kubernetes node label (14:39)<br>9-3. kubernetes annotation (11:46)<br>9-4. kubernetes Canary Deployment (17:30) |
| 2021-03-07 | 10. Kubernetes ConfigMap (34:24)<br>11. Kubernetes Secret (22:10) |
