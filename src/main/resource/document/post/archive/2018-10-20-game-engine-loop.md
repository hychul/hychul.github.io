게임이 다른 컨텐츠와 차이점을 가지는 특성은 상호작용에 있다. 영화, 음악 또는 소설과 같은 컨텐츠와 다르게 직접 캐릭터를 조작하고 이를 실시간으로 화면을 통해 확인할 수 있다. 실시간성을 위해 게임을 입력에 대한 빠른 피드백을 보여줘야 하는데 이를 게임 루프 구조를 통해 해결하고 있다.

유저와 상호작용하는 게임은 유저의 입력을 가지고 로직을 수행한 후 결과를 화면에 표현하는 작업을 반복한다. 게임 루프는 입력, 로직 그리고 표현이라는 세가지 요소를 반복적으로 수행하도록 하는 루프를 뜻한다.

# 텍스트 어드벤처 게임 루프

과거엔 현대의 컴퓨터와 달리 그래픽 성능이 현저하게 떨어졌기 때문에 화면에 텍스트로 설명된 상황과 묘사가 그래픽을 대체했었다. 인터렉티브 픽션이라고도 불리는 텍스트 어드벤처 게임은 텍스트를 기반으로 동작한다. 유저는 화면에 출력된 텍스트 다이얼로그를 읽고 자신이 수행할 액션을 텍스트로 입력하여 게임을 진행한다.

유저가 텍스트를 입력하기 전까진 루프가 멈추고 입력을 했을 때 입력에 대한 처리가 수행된 후 상황에 대한 묘사를 화면에 출력해 다음 입력을 요구한다. 게임이 아닌 이벤트 기반의 GUI 어플리케이션도 불필요한 화면 업데이트를 최소화하기 위해 텍스트 어드벤처 게임과 비슷한 루프을 갖는다.

![img](https://lh4.googleusercontent.com/0kL3qmNekSKe_rDZXupAlBzoHjMdLEziC7MClErq9Nn2VhiPYApJaghLE3-YiAS3gJvRvoBQOEoGlHDujFF6Q3cL_7j0iR5PTIeM9leT04_DRxYW-ff9oNftGcHas-BKks5NYmXd)

<center>인풋이 없으면 게임 로직은 동작하지 않고 기다린다.</center><br>

GUI 애플리케이션 역시 문자 입력 대신 마우스나 키보드 입력 이벤트를 기다린다는 점 외에는 기본적으로 사용자 입력을 받을 때까지 멈춰 있는 옛날 텍스트 어드벤처와 동작 방식에서 별 차이가 없다.

# 현대 게임 루프

텍스트 기반 게임 루프로 게임이 만들어진다면 유저가 입력을 할 때까지 게임 속 세계가 멈추게 된다. 하지만 현대의 게임은 입력을 하지 않더라도 게임 세계가 멈추지 않고 계속해서 동작한다. 유저가 아무것도 하지 않은 채로 화면만 보고 있다고 해도 게임 속 세계는 시간이 흐르고 NPC들이 움직인다.

이를 위해 현대의 게임 루프는 입력을 마냥 기다리지 않고 입력이 있으면 처리하고 없다면 넘어가게 된다.

![img](https://lh6.googleusercontent.com/GqWzYdejwwuspSeTnKAiJyLphcK6Cpc5gpf5R-cw9SCdEN6hEXCYCaLPMrGWlksHCKQPQYKYqBIG5a9ZgKnBLpIO-RtUb6t9Ly7ICaZ-OzRLlsn9lHJ81yPQA6n1vqvSPLQ-ACj6)

<center>인풋의 유무와 상관없이 게임 로직은 계속 동작한다.</center><br />

입력을 기다리지 않기 때문에 입력, 로직, 출력의 세가지 동작이 계속해서 반복된다. 그리고 이 세가지 동작을 하나로 묶은 것을 프레임이라고 한다. 그리고 일반적으로 이 프레임이 초당 몇번 수행되는지에 대한 단위인 FPS로 성능을 나타낸다.

![img](https://user-images.githubusercontent.com/18159012/46985243-5f23a700-d124-11e8-9ab1-3d9cceb30a93.gif)

 <center>FPS가 높을 수록 유저는 화면이 자연스러워 보인다.</center>

## FPS 제한

FPS는 높을 수록 좋지만 모니터의 주사율보다 높을 필요는 없다. FPS가 모니터의 주사율 보다 높다면 모니터 주사율 만큼의 프레임들 이외에의 이외의 프레임들은 출력이 되지 않고 버려지게 된다. 그리고 버려지는 프레임을 계산하기 위한 불필요한 연산으로 인해 전력도 낭비되게 된다.

![img](https://lh5.googleusercontent.com/L5o14uKIN1vjefgWt76e2z2fVRPWlz9eLXLY8R-RUt1kkIAXfRYBIci7MawE30MrRU0zDV2FuFU8c1hVANITth9VFducfbg-AJzofPCCdEu0WYC_-05PSluu0Shdje6CYt-6CYC3)

<center>어두운 회색으로 표시한 게임 프레임은 모니터에 출력되지 못한다.</center><br />

불필요한 연산을 없애고 효율적으로 게임 루프가 동작하게 하기 위해 모니터 주사율에 맞춰 초당 존재하는 프레임 수를 제한해야한다. 모니터의 주사율이 60Hz일 경우 1초에 60개의 프레임만 필요하다. 때문에 1초를 60프레임으로 나누면 모니터가 주사하는 시간 간격을 구할 수 있다.

```
60Hz 모니터 주사 시간 간격 = 1s / 60 = 0.016s = 16ms
```

게임 루프의 프레임들이 이 모니터 주사 시간 간격 마다 존재하게 하면 프레임 수를 적절히 제한할 수 있다. 하지만 게임 루프에 16ms의 시간 텀을 적용하면 FPS가 60보다 떨어지게된다. 그 이유는 한 프레임을 위한 연산 시간이 존재하기 때문이다. 그래서 게임 루프에서 다음 프레임까지의 적절한 시간 텀을 구하기 위해선 프레임 연산 시간을 빼야한다.

```
다음 프레임까지 기다려야하는 시간 간격 = 모니터 기준 프레임간 시간 간격 - 프레임 연산 시간
```

![img](https://lh5.googleusercontent.com/eQS94akkKipVA3lLo6UuQNdEU-JVyBPlwIggmQ6IWN5kY1o7suJgruI7X4qA4JtyufLfY5L1bfBDR8bRZiXH7MIQqK92mORxC5He59HB73rbEblgXc8qRdgxDA0Al6TR8pdHjMhM)

<center>게임 프레임의 시작점이 일정한 간격을 유지한다.</center><br />

## FPS 드랍

초당 존재하는 프레임의 수를 모니터 주사율에 맞춰 제한했기 때문에 FPS가 일정할 것 같지만, 한 프레임의 연산이 걸리는 시간이 모니터 주사율의 시간 간격보다 길어지게 되면 FPS가 떨어지게 된다. 이렇게 되면 게임 로직이 불리는 시간이 일정하지 않게되기 때문에 이전 프레임과의 시간 간격을 현재 프레임에 알려주어야한다.

![img](https://lh4.googleusercontent.com/YylHOkmHFJu2huil_jaQX-eDDNcGhLA7xMRwK4tWXy8w-SZYsotHD86Kfs13nkI6sWqr_pPqQOfG0Orl2dcy9tvNegYLzpVGHY1DYjBPlOq38_V26a540WcWN0nLNLIMeYB2KsMT)

<center>2번 게임 프레임이 길어져 1번 프레임이 두번 출력되었다.</center><br />

게임 로직은 매 프레임마다 수행되기 때문에 프레임 간의 시간 간격을 잘 이용해야한다. 예를 들어, 오브젝트를 움직이게 하기 위해 move(x, y) 메서드를 사용한다고 가정해보자.

```csharp
public void update(double deltaTime) {
    gameObject.move(1, 0); // 매 프레임 마다 오른쪽으로 1씩 이동
}
```

위와 같이 프레임 간의 시간 간격을 사용하지 않고 코드를 작성한다면 60FPS의 시스템에선 1초에 60만큼 이동하고 30FPS의 시스템에서 1초에 30만큼 이동할 것이다. 시간 당 이동하는 거리, 즉 속도가 FPS와 상관없이 같아야 하는데 달라지는 문제가 생기게 된다. 때문에 프레임 간의 시간 간격을 사용하여 다음과 같이 나타내야한다.

```csharp
public void update(double deltaTime) {
    gameObject.move(60 * deltaTime, 0); // 프레임에 상관없이 1초에 60씩 이동
}
```

예시로 든 이동뿐만 아니라 시간당 일정한 수의 작업을 하기 위해선 프레임 간의 시간 간격을 사용해야한다.

> ### 연관글
>
> 코딩 없는 게임 엔진 이야기 1 - 게임 루프  
> [코딩 없는 게임 엔진 이야기 2 - 멀티코어 게임 루프](https://hychul.github.io/posts/2018-11-27-game-engine-multicore-game-loop)  
> [코딩 없는 게임 엔진 이야기 3 - 효율적인 렌더링](https://hychul.github.io/posts/2018-11-29-game-engine-rendering-optimization)
