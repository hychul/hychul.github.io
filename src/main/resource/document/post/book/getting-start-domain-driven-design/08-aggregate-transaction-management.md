# Chapter 8 애그리거트 트랜잭션 관리

- 애그리거트의 트랜잭션
- 에그리거트 잠금 기법

## 8.1 애그리거트와 트랜잭션

서로 다른 유즈케이스를 갖는 스레드에서 동일한 애그리거트에 접근을 하여 상태를 변경하는 경우 타이밍에 따라 일관성이 깨지게 될 수 있다.

일관성을 잃는 문제가 발생하지 않기 위해선 다른 두 가지 중 하나를 해야한다.

- 한 스레드에서 작업하는 동안, 다른 스레드에서 수정을 못하도록 한다.
- 한 스레드에서 조회한 후 다른 스레드에서 수정이 된 경우, 이전 스레드에서 다시 조회하여 수정하도록 한다.

이는 DB에서 제공하는 트랜잭션과 더불어 애그리거트를 위한 추가적인 트랜잭션 처리 기법과 관련있다.

## 8.2 선점 잠금

먼저 애그리거트를 구한 스레드가 애그리거트 사용이 끝날 내까지 다른 스레드에서 해당 애그리거트를 수정하지 못하게 하는 방식이다.

```
Thread 1 -------+-------------------+-------------------+-----------------------------------
                |                   |                   |
         Select Aggregate   Modify Aggregate   Commit Transaction
            Lock Access                           Release Lock
Thread 2 --------+-----------------------------+------------------+---------------------+---
                 | ======== Blocking ========> |                  |                     |
       Try Select Aggregate             Select Aggregate   Modify Aggregate   Commit Transaction
         Wait Lock Release                Lock Access                            Release Lock
```

스레드 1에서 먼전 선점 잠금 방식으로 애그리거트를 구하면 스레드 1에서 해제를 할 떄까지 스레드 2에선 대기 상태가 된다. 스레드 1의 사용이 끝난 후 애그리거트의 상태를 스레드 2에서 사용 불가한 상태로 변경하는 경우, 스레드 2에선 사용 불가 에러를 발생하게 된다.

해당 방식은 DBMS가 제공하는 행단위 잠금을 사용해 구현한다.

#### JPA의 경우

`EntityManager`는 `LockModeType`을 인자로 받는 `find()` 메서드를 제공한다. `LockModeType.PESSIMISTIC_WRITE`를 값으로 전달하면 매핑된 테이블을 이용해서 선점 잠금 방식을 적용할 수 있다.

```java
Order order = entityManager.find(Order.class, orderNo, LockModeType.PESSIMISTIC_WRITE);
```

하이버네이트의 경우 `PESSIMISTIC_WRITE`를 잠금 모드로 사용하면 `for update` 쿼리를 이용해 선점 잠금을 구현한다.

#### 스프링 데이터 JPA의 경우

`@Lock` 어노테이션을 사용해서 잠금 모드를 지정한다.

```java
import org.springframework.data.jpa.repository.Lock;
import javax.persistence.LockModeType;

public interface MemberRepository extends Repository<Member, MemberId> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select m from Member m where m.id = :id")
    Optional<Member> findByIdForUpdate(@Param("id") MemberId memberId);
}
```

### 8.2.1 선점 잠금과 교착 상태

선점 잠금을 사용할 때는 잠금 순서에 따른 교착 상태가 발생하지 않도록 주의해야한다.

아래와 같은 상황에선 스레드 1은 영원히 애그리거트 B를 구할 수 없다.

```
스레드 1 : A 애그리거트를 구함
스레드 2 : B 애그리거트를 구함
스레드 1 : B 애그리거트를 구함
스레드 2 : A 애그리거트를 구함
```

이런 문제가 발생하지 않도록 하려면 잠금을 구할 때 최대 대기 시간을 지정해야 한다.

#### JPA의 경우

```java
Map<String, Object> hints = new HashMap<>();
hints.put("javax.persistence.lock.timeout", 2000);
Order order = entityManager.find(Order.class, orderNo, LockModeType.PESSIMISTIC_WRITE, hints);
```

JPA의 'javax.persistence.lock.timeout' 힌트는 밀리초 단위로 대기 시간을 지정한다. 지정 시간이 넘어가는 경우 예외를 발생시킨다.

이 힌트를 사용할 때 주의할 점은 DBMS에 따라 해당 힌트를 지원하지 않을 수 있다는 점이다. 때문에 사용하는 DBMS가 해당 기능을 지원하는지 확인해야 한다.

#### 스프링 데이터 JPA의 경우

`@QueryHints` 어노테이션을 통해 힌트를 지정할 수 있다.

```java
import org.springframework.data.jpa.repository.QeuryHints;
import javax.persistence.QueryHint;

public interface MemberRepository extends Repository<Member, MemberId> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints({
        @QueryHint(name = "javax.persistence.lock.timeout", value = "2000")
    })
    @Query("select m from Member m where m.id = :id")
    Optional<Member> findByIdForUpdate(@Param("id") MemberId memberId);
}
```

## 8.3 비선점 잠금

선점 잠금으로 해결이 안되는 경우가 존재한다.

```
스레드 1-1 : A 애그리거트를 조회
스레드 2-1 : A 애그리거트를 조회
스레드 2-2 : A 애그리거트를 수정
스레드 1-2 : A 애그리거트를 수정
```

여기서 문제는 애그리거트를 조회한 후 조회한 정보를 토대로 수정하려고 할때 다른 스레드(사용자)에 의해서 상태가 변경되어 잘못된 정보를 사용자가 사용할 수 있다는 것이다.

이렇게 동시의 접근을 제한하는 선점 잠금으로 해결 할 수 없는 상황에선, 변경한 데이터를 DBMS에 반영하는 시점에 변경 가능 여부를 확인하는 비선점 잠금을 통해 해결 할 수 있다.

비선점 잠금 방식을 구현하려면 애그리거트에 버전으로 사용할 숫자 타입 프로퍼티를 추가해야한다. 애그리거트를 수정할 때 마다 버전으로 사용할 프로퍼티 값이 1씩 증가하는데 다음과 같은 쿼리를 사용한다.

```sql
UPDATE aggtable SET version = verion + 1, colx = ?, coly = ? WHERE aggid = ? and version = {current version}
```

해당 쿼리는 수정할 애그리거트와 매핑되는 테이블의 버전이 동일할 때만 동작한다. 그리고 수정에 성공하면 버전을 1 증가시킨다.

#### JPA의 경우

JPA는 버전을 이용한 비선점 잠금을 제공한다. `@Version` 어노테이션을 붙이고 매핑되는 테이블에 버전을 저장할 컬럼을 추가하면 된다.

```java
@Entity
@Table(name = "purchase_order)
@Access(AccessType.FIELD)
public class Order {
    @EmbeddedId
    private OrderId orderId;

    @Version
    private long version;

    ...
}
```

엔티티가 변경되어 UPDATE 쿼리가 실행될 때 `@Version` 어노테이션에 명시한 필드를 이용하여 비선점 잠금 쿼리를 실행한다.

즉, 버전이 10인경우 다음과 같은 쿼리를 사용하여 버전이 일치하는 경우에만 UPDATE 문이 반영된다.

```sql
UPDATE purchase_order SET ..., version = version + 1 WHERE number = ? and version = 10
```

#### 스프링 데이터 JPA의 경우

`@Transactional` 어노테이션을 통해서 트랜잭션 범위를 지정하고 충돌하는 경우 `OptimisticLockingFailureException`이 발생한다.

```java
public class ChangeShippingService {
    ...
    @Transactional
    public void changeShipping(ChangeShippingRequest changeReq) {
        Order order = orderRepository.findById(new OrderNo(changeReq.getNumber()));
        checkNoOrder(order);
        order.changeShippingInfo(changeReq.getShippingInfo());
    }
    ...
}
```

비선점 잠금을 위한 쿼리를 실행할 때 쿼리 실행 결과로 수정된 행의 개수가 0이면 이미 누군가 데이터를 수정한 것이다. (버전이 변경) 이런 경우 트랜잭션 충돌이 발생하고 예외가 발생한다.

표현 영역 코드는 이 예외가 발생했는지에 따라 트랜잭션 충돌이 일어났는지 확인할 수 있다.

```java
@Controller
public class OrderController {

    private ChangeShippingService changeShippingService;

    @PostMapping("/changeShipping")
    public String changeShipping(ChangeShippingRequest changeReq) {
        try {
            changeShippingService.changeShipping(changeReq);
            return "changeShippingSuccess";
        } catch (OOptimisticLockingFailureException e) {
            return "changeShippingTxConflict";
        }
    }
}
```

비선점 잠금을 위와같이 확장하여, 시스템은 사용자에게 수정 폼을 제공할 때 버전을 함께 제공하고, 폼을 서버로 전송할 때 버전을 함께 전송하여 버전이 동일한 경우에만 애그리거트 수정 기능을 수행하여 트랜잭션 충돌 문제를 해소할 수 있다.

HTML 폼을 생성하는 경우 버전 값을 갖는 hidden 타입 `<input>` 태그를 통해 폼 전송 시 버전 값이 서버에 함께 전송되도록 한다.

```html
<!-- 애그리거트 정보를 보여줄 때 뷰 코드는 버전 값을 함께 전송한다 -->
<form th:action="@{/startShipping}" method="post">
  <input type="hidden" name="version" th:value="${orderDto.version}" />
  <input type="hidden" name="orderNumber" th:value="${orderDto.orderNo}" />
  ...
  <input type="submit" name="배송 상태로 변경" />
</form>
```

응용 서비스는 전달받은 버전 값을 이용해서 애그리거트 버전과 일치하는지 확인하고, 일치하는 경우에만 기능을 수행한다.

```java
public class StartShippingService {

    @PreAuthorize("ADMIN")
    @Transactional
    public void startShipping(StartShippingRequest req) {
        Order order = orderRepository.findById(new OrderNo(req.getOrderNumber()));
        checkOrder(order);
        if (order.matchVersion(req.getVersion())) {
            throw new VersionConflictException();
        }
        order.startShipping();
    }
}
```

응용 서비스는 버전이 충돌하는 경우 예외를 통해 표현 계층에 이를 알린다.

표현 계층은 버전 충돌 예외가 발생하는 경우 사용자에게 알려 사용자가 알맞은 후속 처리를 할 수 있도록 한다.

```java
@Controller
public class OrderAdminController {
    private StartShippingService startShippingService;

    @PostMapping("/startShipping")
    public String startShipping(StartShippingRequest req) {
        try {
            startShippingService.startShipping(req);
            return "startShipping";
        } catch (OptimisticLockFailureException | VersionConflictException e) {
            return "startShippingTxConflict";
        }
    }
}
```

`OptimisticLockFailureException`와 `VersionConflictException`의 타입에 따라서 트랜잭션 충돌이 발생한 시점을 확인할 수도 있다.

### 8.3.1 강제 버전 증가

애그리거트에 애그리거트 루트 이외의 엔티티에서 변경이 발생하는 경우, JPA는 루트 엔티티의 버전 값을 증가 시키지 않는다. 이런 JPA의 특징은 애그리거트 관점에서 보면 문제가 된다.

루트 엔티티는 변경이 없더라도 하위의 엔티티의 변경은 애그리거트 구성 요소가 변경되는 경우 애그리거트는 논리적으로 바뀐 것이기 때문이다. 때문에 애그리거트 내에 어떤 구성요소의 상태가 바뀌면 루트 애그리거트의 버전의 값이 증가해야 한다.

#### JPA의 경우

`EntityManager#find()` 메서드로 엔티티를 구할 때 강제로 버전 값을 증가시키는 잠금 모드인 `LockModeType.OPTIMISTIC_FORCE_INCREMENT`를 제공한다.

```java
@Repository
public class JpaOrderRepository implements OrderRepository {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Order findByIdOptimisticLockMode(OrderNo id) {
        return entiryManager.find(Order.class, id, LockModeType.OPTIMISTIC_FORCE_INCREMENT);
    }
}
```

`LockModeType.OPTIMISTIC_FORCE_INCREMENT` 모드를 사용하면 엔티티 상태의 변경과 관계 없이 트랜잭션 종료 시점에 버전 값 증가 처리를 수행한다.

#### 스프링 데이터 JPA의 경우

`@Lock` 어노테이션을 사용하여 모드를 지정할 수 있다.

## 8.4 오프라인 선점 잠금
