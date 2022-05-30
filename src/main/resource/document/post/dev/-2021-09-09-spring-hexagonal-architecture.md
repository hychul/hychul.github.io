스프링 5.0이 나오면서 MVC와 Webflux의 두 형태로 나눠지게 되었지만 현재까지도 Controller - Service - Repository의 레이어로 나눠서 사용한다. 

일반적으로 이런 방식의 구성은 테이블 하나당 엔티티 하나를 매칭하여 관리하는 방식이 일반적이다.

-----

- 레포지토리를 서비스 로직의 엔테티의 단위로 나누면 나아질 수 있을 것 같다.
- JPA를 사용하는 경우 

ref : https://reflectoring.io/spring-hexagonal/