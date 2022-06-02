# 8-1 Kubernetes Ingress 개념과 Ingress Controller 설치!

https://kubernetes.io/docs/concepts/services-networking/ingress/

## Ingress의 이해

- pod, controller, serivce 처럼 k8s가 지원하는 api 중 하나
- http나 https를 통해서 내부의 서비스를 외부에서 접근하는 기능을 제공한다.
- 기능
  - 서비스에 외부 url 제공
  - 트래픽을 로드밸런싱
  - SSL 인증서 처리
  - virtual hosting을 지정

## Ingress 동작방식

각각의 서비스가 존재할 때, 서비스들을 통합하여 하나의 진입점을 만들어서 제공한다.

Ingress rules을 통해서 endpoint에 따라서 각각의 서비스에 접근할 수 있도록 한다. (게이트 웨이 라우팅?)

## Ingress 설치

https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/

> nginx bare-metal

### Ingress Resource

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: minimal-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx-example
  # Ingress rule
  rules:
    - http:
        paths:
          - path: /testpath
            pathType: Prefix
            backend:
              service:
                name: test
                port:
                  number: 80
```

# 8-2 Kubernetes Ingress 실습 - 웹페이지 구현

서비스를 단일 진입점(cluster ip)로 사용하고 각각의 진입점을 Ingress를 통해서 라우팅하여 연결한다.

Kubernetes에서 HTTP(S)기반의 L7 Load Balancer 기능을 제공해주는 Ingress를 이용해 API Gateway가 해주는 상당 수의 기능을 간단하게 구현

## 로드밸런싱

https://kubernetes.io/docs/concepts/services-networking/ingress/#load-balancing

인그레스 컨트롤러는 로드 밸런싱 알고리즘, 백엔드 가중치 구성표 등 모든 인그레스에 적용되는 일부 로드 밸런싱 정책 설정으로 부트스트랩된다. 보다 진보된 로드 밸런싱 개념 (예: 지속적인 세션, 동적 가중치)은 아직 인그레스를 통해 노출되지 않는다. 대신 서비스에 사용되는 로드 밸런서를 통해 이러한 기능을 얻을 수 있다.

## 게이트웨이 라우팅

기존 게이트 웨이(SCG or Zuul)에서 제공하는 기능을 모두 커버할 수 있나..?

> 직접 운영해봐야 세부 기능에 적응을 할 것 같다..
