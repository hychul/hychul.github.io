Java 8부터 람다 관련 코드들을 잘 사용하고 있었지만 `list.filter(String::isEmpty)` 같이 메서드와 그 메서드를 정의한 클래스 명을 통한 표현 방법을 뭐라 부르는지 몰랐는데, openjdk 문서를 보다가 'Method Reference Capture'라고 불린다는 것을 알게 되었다.

> http://cr.openjdk.java.net/~briangoetz/lambda/lambda-translation.html
