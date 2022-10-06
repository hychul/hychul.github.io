<!-- 해당 책에서 매그리거트<sup>Aggregate</sup>는 엔티티와 밸류의 개념을 하나로 묶은 것으로 표현하고 있다. -->

# Chapter 3 애그리거트 <sup>Aggregate</sup>

- 애그리거트
- 애그리거트 루트와 역할
- 애그리거트와 리포지터리
- ID를 이용한 애그리거트 참조

## 3.1 애그리거트

상위 수준에서 모델을 정리하면 객체 수준의 모델을 파악하기 쉽다.

도메인의 객체 모델이 복잡해지면 개별 구성요소 위주로 모델을 이해하게 되고 전반적인 구조나 큰 수준에서 도메인 간의 관계를 파악하기 어렵다.

도메인 요소 관계를 파악하기 어렵다는 것은 코드를 변경하고 확장하는 것이 어려워 진다는 것을 의미한다.

때문에 복잡한 도메인을 이해하고 관리하기 쉬운 단위로 만들려면 상위 수준에서 모델을 조망할 수 있는 방법이 필요한데, 그 방법이 애그리거트다. 수많은 객체를 애그리거트로 묶어서 바라보면 상위 수준에서 도메인 모델 간의 관계를 파악할 수 있다.

### 장점

- 모델을 이해하는데 도움을 준다.
- 일관성을 관리하는 기준이 된다.
- 복잡한 도메인을 단순한 구조로 만든어 준다.
- 복잡도가 낮아지는 만큼 도메인 기능을 확장하고 변경하는데 필요한 노력도 줄어든다.

### 특징

- 애그리거트 모델 내부에 연관된 객체들은 유사하거나 동일한 라이프 사이클을 갖는다.
- 애그리거트는 경게를 갖고 한 애그리거트에 속한 객체는 다른 애그리거트에 속하지 않는다.
- 애그리거트는 독립적인 객체 군이며 다른 애그리거트를 관리하지 않는다.

### 경계 설정

- 도메인 규칙과 요구사항을 기준으로 경계를 설정한다.
- 도메인 규칙에 따라 함께 생성되는 구성요소는 한 애그리거트에 속할 가능성이 높다.

### 주의점

- 'A가 B를 갖는다'로 설계할 수 있는 요구사항이 있다면 A와 B를 한 애그리거트로 묶어서 생각하기 쉽지만 소유관계가 같은 애그리거트에 속하는것을 의미하진 않는다.

## 3.2 애그리거트 루트

애그리거트는 여러 객체로 구성되기 때문에 도메인 규칙에 따라 모든 객체가 정상인 상태를 유지해야한다. 모든 객체가 일관된 상태를 유지하려면 애그리거트 전체를 관리할 주체가 필요한데, 이 책임을 지는 것이 바로 애그리거트 루트 엔티티이다. 애그리거트에 속한 객체는 루트 엔티티에 직접 또는 간접적으로 속하게 된다.

### 3.2.1 도메인 규칙과 일관성

애그리거트 루트의 핵심 역할은 애그리거트의 일관성이 깨지지 않도록 하는것이다. 이를 위해 애그리거트 루트는 애그리거트가 제공해야 할 도메인 기능을 구현한다.

애그리거트 외부에서 애그리거트에 속한 객체를 직접 변경하면 안된다. 이것은 루트가 장제하는 규칙을 적용할 수 없어 모델의 일관성을 깨는 원인이 된다.

```java
public class Order {

    public void changeShippinginfo(ShippingInfo shippingInfo) {
        verifyNotShipped();
        setShippingInfo(shippingInfo);
    }

    ...
}
```

```java
    ShippingInfo shippingInfo = order.getShippingInfo();
    // 이미 배송이 시작된 Order라도 verifyNotShipped()를 거치지 않기 때문에 주소 정보가 규칙과 상관없이 변경된다.
    shippingInfo.setAddress(newAddress);
```

불필요한 중복을 피하고 애그리거트 루트를 통해서만 도메인 로직을 구현하게 만들려면 도메인 모델에 대해 다음의 두 가지를 습관적으로 적용해야 한다.

- 단순히 필드를 변경하는 set 메서드를 공개(public) 범위로 만들지 않는다.
  - 단순 값을 할당하는 메서드가 아닌 의미가 더 잘 드러나는 이름의 메서드를 정의하는 빈도가 증가한다.
- 밸류 타입은 불변으로 구현한다.
  - 애그리거트 외부에서 내부의 상태를 함부로 변경하지 못하므로 일관성이 깨질 가능성이 줄어든다.

### 3.2.2 애그리거트 루트의 기능 구현

애그리거트 루트는 애그리거트 내부의 다른 객체를 조합해서 기능을 완성한다.

```java
public class Order {

    private List<OrderLine> orderLines;
    private Money totalAmounts;

    private void calculateTotalAmounts() {
        int sum = this.orderLines.stream()
                                 .mapToInt(ol -> ol.getPrice() * ol.getQuantity())
                                 .sum();
        this.totalAmounts = new Money(sum);
    }
}
```

구성요소의 상태만 참조하는 것 뿐만 아니라 기능 실행을 위임하기도 한다.

```java
public class Order {

    private OrderLines orderLines;
    private Money totalAmounts;

    private void changeOrderLines(List<OrderLine> newOrderLines) {
        this.orderLines.changeOrderLines(newOrderLines);
        this.totalAmounts = orderLines.getTotalAmounts();
    }
}
```

### 3.2.3 트랜잭션 범위

트랜잭션은 접근하려는 테이블에 락을 걸고, 락이 걸린 테이블의 수가 많아 질수록 동시에 처리할 수 있는 트랜잭션의 수는 줄어든다. 때문에 트랜잭션의 범위는 작을 수록 좋다.

이와 같은 선상에서 한개의 트랜잭션에선 한 개의 애그리거트만 수정해야 한다. 이는 애그리거트에서 다른 애그리거트를 변경하지 않는다는 것을 의미한다.

애그리거트는 최대한 서로 독립적이어야 하는데 한 애그리거트가 다른 애그리거트에 기능에 의존하기 시작하면 결합도가 높아진다. 이는 이후 수정 비용을 증가시키므로 애그리거트에서 다른 애그리거트의 상태를 변경하지 말아야 한다.

부득이하게 한 트랜잭션으로 두 개 이상의 애그리거트를 수정해야한다면 애그리거트에서 다른 애그리거트를 직접 수정하지 말고 응용 서비스에서 두 애그리거트를 수정하도록 수현한다.

다음의 경우에 한 트랜잭션에서 두 개 이상의 애그리거트를 변경하는 것을 고려할 수 있다.

- 팀 표준
- 기술 제약
- UI 구현의 편리