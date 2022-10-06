# Chapter 9 도메인 모델과 바운디드 컨텍스트

- 바운디드 컨텍스트
- 바운디드 컨텍스트 간 통합과 관계

## 9.1 도메인 모델과 경계

처음 도메인 모델을 만들 때 빠지기 쉬운 함정은 단일 모델로 도메인의 모두 표현하려는 것이다. 1장에서 말한대로 한 도메인은 다시 여러 하위 도메인으로 구분되기 때문에 한개의 모델로 모두 표현하려고 하면 오히려 도메인에 맞지 않는 모델을 만들게 된다.

논리적으로 같은 존재처럼 보이지만 하위 도메인에 따라 다른 용어를 사용하는 경우도 있다.

### 용어가 같지만 대상(의미)이 다른 경우

커머스 도메인에서 상품이라는 모델은, 카탈로그, 상품, 재고 관리, 주문, 배송에서 각각 의미하는 바가 다르다.

카탈로그의 상품은 상품 정보를 표현하는 항목들의 집합을 의미하지만 재고 관리에선 실존하는 개별 개체를 추적하기 위한 대상으로 사용되기 때문에, 카탈로그에서 한개만 존재하는 상품이 재고 관리에선 여러개 존재할 수 있다.

### 용어가 다르지만 대상(의미)이 같은 경우

커머스 도메인에서 사용자를 회원 도메인에선 회원, 주문 도메인에선 주문자, 배송 도메인에선 보내는 사람 등으로 부를 수 있다.

```
+--------+    +----------+    +-------+
| Member |    | Delivery |    | Order |
+--------+    +----------+    +-------+
    | member       | sender       | orderer
    +--------------+--------------+
                   O
                  /|\
                  / \
```

### 하위 도메인 별 모델

이렇게 하위 도메인 별로 같은 용어라도 의미가 다르거나, 같은 대상이라도 용어가 다를 수 있기 때문에 한 개의 모델로 모든 하위 도메인을 표현하려는 시도는 올바른 방법이 아니다.

때문에 올바른 모델을 개발하려면 하위 도메인 마다 모델을 만들고 명시적으로 구분되는 경계를 가지고 섞이지 않도록 해야한다.

모델은 특정한 컨텍스트 하에서 와전한 의미를 갖는다. 이렇게 구분되는 경계를 갖는 컨텍스트를 DDD에선 바운디드 컨텍스트라고 부른다.

## 9.2 바운디드 컨텍스트

바운디드 컨텍스트는 모델의 경계를 결정하며 한 개의 바운디드 컨텍스트는 논리적으로 한 개의 모델을 갖는다.

이상적으로 하위 도메인과 바운디드 컨텍스트가 일대일 관계를 가지면 좋겠지만 현실에선 그렇지 못할 때가 있다. 팀 조직 구조에 따라 바운디드 컨텍스트가 정해지기도 하기 때문에 여러 하위 도메인을 하나의 바운디드 컨텍스트에서 개발하게 될 수 있다.

```
+-----------------------------+    +--------------+  +------------------------+
|             Order           |    |  Catalogue   |  |  Inventory Management  |
|           Sub Domain        |    |  Sub Domain  |  |       Sub Domain       |
| +-------------------------+ |    | +--------------------------------------+ |
| |  Order Bounded Context  | |    | |                                      | |
| +-------------------------+ |    | |                Product               | |
| +-------------------------+ |    | |           Bounded Context            | |
| | Payment Bounded Context | |    | |                                      | |
| +-------------------------+ |    | +--------------------------------------+ |
+-----------------------------+    +--------------+  +------------------------+
```

이때 주의할 점은 하위 도메인의 모델이 섞이지 않도록 하는 것이다. 내부적으로 패키지 등을 사용하여 구분하면 하위 도메인을 위한 모델이 서로 섞이지 않고 하위 도메인마다 바운디드 컨텍스트를 갖는 효과를 낼 수 있다.

```
+--------------------------------------------+
|               Comerce Domain               |
| +---------+  +----------+  +---------+     |
| |  Order  |  | Category |  | Member  |     |
| | Bounded |  | Bounded  |  | Bounded | ... |
| | Context |  | Context  |  | Context |     |
| +---------+  +----------+  +---------+     |
+--------------------------------------------+
```

바운디드 컨텍스트는 도메인 모델을 구분하는 경계가 되기 때문에 바운디드 컨텍스트는 구현하는 하위 도메인에 알맞은 모델을 포함한다.

같은 사용자라고 하더라도 회원 바운디드 컨텍스트에선 애그리거트 루트이지만, 주문 바운디드 컨텍스트에선 밸류가 된다.

같은 상품이라도 카탈로그 바운디드 컨텍스트에선 상품이 속하는 카테고리와 연관을 갖지만, 재고 관리 바운디드 컨텍스트에선 카테고리와 연관을 맺지 않는다.

```
+------------------------+       +-----------------------+
| Member Bounded Context |       | Order Bounded Context |
|    +--------------+    |       |     +-----------+     |
|    | <<Agg Root>> |    |       |     | <<Value>> |     |
|    |    Member    |    |       |     |  Orderer  |     |
|    +--------------+    |       |     +-----------+     |
+------------------------+       +-----------------------+

+---------------------------+    +--------------------------------------+
| Catalogue Bounded Context |    | Inventory Management Bounded Context |
|     +---------------+     |    | +--------------+    +--------------+ |
|     | <<Agg Root>>  |     |    | | <<Agg Root>> | -> | <<Agg Root>> | |
|     |    Product    |     |    | |    Product   |    |   Category   | |
|     +---------------+     |    | +--------------+    +--------------+ |
+---------------------------+    +--------------------------------------+
```

## 9.3 바운디드 컨텍스트 구현

## 9.4 바운디드 컨텍스트 간 통합

## 9.5 바운디드 컨텍스트 간 관계

## 9.6 컨텍스트 맵