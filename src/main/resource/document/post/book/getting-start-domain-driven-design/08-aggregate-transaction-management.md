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
        @QueryHint(name = javax.persistence.lock.timeout", value = "2000")
    })
    @Query("select m from Member m where m.id = :id")
    Optional<Member> findByIdForUpdate(@Param("id") MemberId memberId);
}
```

## 8.3 비선점 잠금

## 8.4 오프라인 선점 잠금
