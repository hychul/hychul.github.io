# 정의

<!-- http://channy.creation.net/articles/microservices-by-james_lewes-martin_fowler -->

따로 정확한 정의는 없지만 일반적인 특징을 나열하면 다음과 같다. (다음의 특징들도 모든 마이크로 서비스가 갖는 특성은 아니다.)

- 서비스를 통한 컴포넌트화
- 비즈니스 수행에 따른 구성
- 프로젝트가 아닌 제품
- 똑똑한 엔드 포인트와 멍청한 파이프
- 분산화 거버넌스
- 분산화된 데이터 관리
- 인프라 자동화
- 장애 방지 설계
- 진화하는 설계

## Microservice Application

## SOA<sup>Service-Oriented Architecture</sup>

## MSA<sup>Micro Service Architecture</sup>

# 팀을 나누는 단위

## 기능적 분리

## 서비스적 분리

# 비유

## 한개의 기능이 여러개의

# 실제

## 독립적 배포

---

# 소프트웨어 아키텍처란?

## 개발적 해석

<!-- https://en.wikipedia.org/wiki/Software_architecture -->

Software architecture refers to the fundamental structures of a software system and the discipline of creating such structures and systems.

## 서비스 개발

비즈니스 룰을 컴퓨터가 이해할 수 있는 코드를 통해 구현한 것 : 비즈니스 로직

아키텍처는 퀄리티에 관한 것이지만 블랙박스로 구성되어 외부에선 보이지 않음

## 비개발 언어적 해석

<!-- https://www.youtube.com/watch?v=4E1BHTvhB7Y -->

개발자들의 서비스 구현을 위한 아이디어들 + 나중에 바꾸기 어려운 것 -> 무엇인가 중요한 것

# 소프트웨어 아키텍처

블랙박스로 구성되어있다면 왜 중요할까?

## 장기적인 관점에서의 아키텍처

![](https://martinfowler.com/bliki/images/designStaminaGraph.gif)

# Monolithic 과 MSA<sup>Micro Service Architecture</sup>의 차이점

## Monolithic

어플리케이션 안에 모든 비즈니스 로직이 다 들어가 있는 구조 Monolithic 이름은 애플리케이션 전체의 코드가 하나의 배포에 구현되기 때문

## MSA

서비스를 비즈니스 경계에 맞게 세분화 하고, 서비스 간의 통신은 네트워크 호출을 통해 진행하여 확장 가능하고 회복적이며 유연한 어플리케이션을 구성하는 것

> **6개 핵심 개념**
>
> 1. 독립적 배포  
>    다른 마이크로 서비스를 배포하지 않고 변경/배포/출시 할 수 있음
> 2. 비즈니스 도메인을 중심으로 모델링  
>    도메인을 기준으로 서비스의 경계를 정의
> 3. 자신의 상태를 가짐  
>    마이크로 서비스는 DB를 공유하지 말아야함
> 4. 크기  
>    "A microservice should be as big as my head" - James Lewis  
>    크기보다는 팀이 감당 가능한 마이크로서비스의 갯수와 그 경계에 집중할 것
> 5. 유연함  
>    확장 가능성을 비용을 들이는 투자에 가까움  
>    점진적으로 마이크로서비스로 확장하는 것을 권장
> 6. 아키텍처와 조직을 맞춤  
>    콘레이의 법칙 : 조직구조가 아키텍처에 영향을 미침  
>    비즈니즈 도메인이 시스템 아키텍처를 주도하는 원동력이 되도록 수정

<!-- https://www.redhat.com/ko/topics/cloud-native-apps/what-is-service-oriented-architecture -->

> **서비스 지향 아키텍처<sup>SOA</sup>**
>
> SOA에서는 요청을 보내거나 데이터에 액세스할 때 SOAP, JSON, ActiveMQ, Apache Thrift와 같은 표준 네트워크 프로토콜을 사용하여 서비스를 공개하므로 개발자가 처음부터 새로 통합할 필요가 없습니다. 그 대신 엔터프라이즈 서비스 버스(ESB)라는 패턴을 사용하면 됩니다. ESB는 중앙화된 구성 요소와 백엔드 시스템을 통합한 다음 이를 서비스 인터페이스의 형태로 제공합니다. 따라서 개발자는 기능을 다시 만드는 대신에 기존 기능을 재사용할 수 있습니다.
>
> 서비스 지향 아키텍처 스타일인 경우 서비스는 "느슨한 결합" 시스템을 사용하여 통신합니다. 이런 식으로 어떤 시스템 또는 네트워크 내의 여러 구성 요소("요소")를 서로 연결하면 상호 종속성을 줄이면서도 정보를 전달하거나 비즈니스 프로세스를 조율할 수 있습니다. 이로 인해 결과적으로 새로운 애플리케이션이 생성됩니다.
>
> <hr style="visibility:hidden;" />
>
> **서비스 지향 아키텍처 vs. 마이크로서비스**
>
> 서비스 지향 아키텍처에서 처음 선보인 서비스의 개념이 오늘날 클라우드 컴퓨팅 및 가상화(미들웨어, 마이크로서비스 등)의 주요 구성 요소로 발전했습니다.
>
> SOA와 마이크로서비스 아키텍처는 그 유사성 때문에 혼동하기 쉽습니다. 이 둘의 근본적인 차이점은 범위에 있습니다. SOA가 전사적인 아키텍처 접근 방식이라면 마이크로서비스는 애플리케이션 개발 팀 내의 구현 전략입니다.
>
> 그리고 각각의 구성 요소와 통신하는 방법도 다릅니다. SOA는 ESB를 사용하는 반면, 마이크로서비스끼리는 언어의 제약이 없는 API를 통해 스테이트리스(stateless) 방식으로 통신합니다. 마이크로서비스의 API에는 언어의 제약이 없기 때문에 개발 팀에서 사용하고 싶은 툴을 선택할 수 있습니다. 따라서 마이크로서비스의 내결함성과 유연성이 더 우수할 수 있습니다.

# MSA를 사용하는 이유

Monolithic에서 발생하는 문제점들을 보완하기 때문

> 여러 기능이 뭉쳐 강하게 결합된 것에서 발생하는 문제들
>
> - 개발 유연성의 한계
> - 요구사항 대처 시간 소요
> - 장애 격리 / 신뢰성
> - 배포 / 롤백 리스크
> - 리소스 낭비

## 새로운 기능 추가 및 업데이트에 어려움

하나의 어플리케이션 안에서 필요한 변경이 필요한 부분을 모두 검색하고 수정해야됨

## 특정 부분에 문제가 발생 시, 큰 장애로 이어짐

fallback 등을 통해 장애 전파를 막음

## Scale-Out 시 필요없는 자원이 함께 증가됨

필요없는 비즈니스 기능에 대한 리소스도 함께 증가

## 민첩하고 손쉬운 배포 및 업데이트

잘못된 부분만 수정

# MSA 고려사항 / 단점

## 충분히 복잡할때

"Don't evene consider microservice unleass you have a system that's too complex to manage as a monolith." - Martin Fowler

## 컨테이너 수 증가

## 만능은 아니다

## Requirement

![](https://developers.redhat.com/sites/default/files/blog/2016/12/screen-shot-2016-12-06-at-10-30-08.png)

<!-- https://www.youtube.com/watch?v=8d4h7K_Fq-0 -->
