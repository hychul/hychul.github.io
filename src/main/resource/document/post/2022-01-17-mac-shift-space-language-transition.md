맥에서 한영 입력소스 변환을 위해서 `ctrl` + `space` 혹은 최근엔 `capslock` 키를 기본적으로 사용한다. 나의 경우엔 윈도우와 동일한 위치의 키를 '한영' 키로 사용하기 위해 스페이스 오른쪽 키에 `ctrl` + `space` 매크로를 넣어서 사용하고 있는데, 키보드 자체 매크로를 사용하다 보니 윈도우에 매크로를 적용한 키보드를 연결해 사용할 땐 `shift` + `space` 조합으로 한영 전환을 해서 사용했다. 그런데 웃긴것은 한영키를 누르는 것 보다 `shift` + `space`의 조합으로 사용하는 것이 한영 전환이 더 자연스러웠다는 것이다.

아무래도 키보드를 좋아하고 생산성을 중시하는 만큼 키보드 위에서 웬만하면 손의 위치가 어긋나게 되는 것을 싫어하는데, 스페이스 오른쪽의 한영키를 누르게 되는 경우엔 손이 많이 움직이게 된다. `capslock`에 한영키를 할당하자니 생각보다 코딩을 하면서 `capslock`을 많이 사용하는 편이라 해당 키를 변경하는 것을 꺼려졌다. 때문에 맥을 사용하기 전에 익숙해진 윈도우의 한영키 위치에 매크로를 설정한 것인데 더 자연스러운 `shift` + `space` 조합으로 변경하려 하기로 하였다.

입력소스 변경 키는 Mac 설정에서 [시스템 환경 설정] - [키보드] - [단축키] - [입력 소스] 에서 변경할 수 있지만 `shift` + `space` 를 설정하려고 하면 애플 키보드를 사용하여 `fn` + `shift` + `space` 이상 적용이 되지 않는다. (Apple Silicon Mac에선 OS의 문제인지 적용되지 않는다.)

때문에 `shift` + `space` 키를 설정하기 위해선 직접 plist를 수정해야한다.

# Solution

'~/Library/Preferences/com.apple.symbolichotkeys.plist' 파일을 열어 수정하면된다.

문제는 Mac의 plist 파일이 텍스트 파일일 수도 있지만 바이너리로 작성되는 경우가 존재한다는 것인데, 바이너리 plist 파일의 경우 vim과 같은 일반 편집기로는 수정하기 힘들고 Xcode와 같은 전용 툴을 사용해야한다.

때문에 터미널을 통해 일단 위에서 언급한 디렉토리로 이동한 다음 `open .` 명령어를 통해 현재 터미널 디렉토리를 Finder에서 열도록 한다.

Xcode 와 같은 툴로 해당 파일을 열고 '60'을 찾아 세번째 integer 파라메터를 131072 으로 수정한다.

```xml
<key>60</key>
    <dict>
        <key>enabled</key>
        <true>
        <key>value</key>
        <dict>
           <key>parameters</key>
           <array>
             <integer>32</integer>
             <integer>49</integer>
             <!-- 세번째 파라메터 -->
             <integer>131072</integer>
           </array>
        </dict>
        </true>
    </dict>
```

> **plist의 각 파라메터의 의미**
>
> https://stackoverflow.com/questions/21878482/what-do-the-parameter-values-in-applesymbolichotkeys-plist-dict-represent
