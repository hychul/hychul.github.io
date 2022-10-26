서버한 한대가 뻗어서 Heap Dump를 보려고 MAT<sup>Eclipse Memory Analyzer</sup>를 설치하고 실행하려는데 에러가 발생했다.

```
An error has occurred.
See the log file...
```

이전 맥에서는 발생한 적이 없는데 애플 실리콘에서 처음 발생해서 당황스러웠다.

일단 팝업 에러 메세지에서 말하는 .log 파일을 열어서 내용을 확인해 보니 다름과 같은 로그가 남아있었고, 디렉토리 퍼미션과 같은 문제인 것 같았다.

```
!MESSAGE Application error

!STACK 1

java.lang.IllegalStateException: The platform metadata area could not be written: /private/var/folders/xx/xxxxxxxxxxxx_xxxxxxx_xxxxxxxxx/x/AppTranslocation/xxxxxxxx-xxxx–xxxx-xxxx–xxxxxxxxxxxx/x/mat.app/Contents/
MacOS/workspace/.metadata. By default the platform writes its content under the current working directory when the platform is launched. Use the -data parameter to specify a different content area for the platform.
```

# Solution

확인해보니 .dmg 파일을 연 상태에선 동작하지 않고 `~/Application` 디렉토리로 이동 시킨 후 실행해야 정상 동작하는 것을 확인했다.

https://stackoverflow.com/questions/47909239/how-to-run-eclipse-memory-analyzer-on-mac-os

<!-- https://medium.com/macoclock/how-to-run-eclipse-mat-memory-analyzer-tool-on-mac-os-c6faaead8eb6 -->
