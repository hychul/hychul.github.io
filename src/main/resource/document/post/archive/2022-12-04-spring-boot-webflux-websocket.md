# Web Socket Configuration

Webflux 를 사용하기 위해 웹소켓 핸들러 어댑터를 추가해야한다.

```java
@Bean
public HandlerAdapter webSocketHandlerAdapter() {
    return new WebSocketHandlerAdapter();
}
```

해당 어댑터는 `WebSocketService`를 통해 웹 리퀘스트(웹소켓 핸드쉐이크)를, `WebSocketHandler`를 통해 웹소켓 패킷을 처리한다.

`WebSocketHandlerAdapter` 의 기본 생성자에선 `HandshakeWebSocketService`를 서비스에 할당하여 웹소켓 요청을 웹소켓 핸드쉐이크에 기반하여 처리한다.

다음으로 `HandlerMapping`을 통해 웹소켓을 연결할 url의 path를 설정해야한다.

```java
@Bean
public HandlerMapping webSocketHandlerMapping() {
    return new SimpleUrlHandlerMapping(Map.of("/socket", webSocketHandler), 1);
}
```

# Read Message

# Send Message
