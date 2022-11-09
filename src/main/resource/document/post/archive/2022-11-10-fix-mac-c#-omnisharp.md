Unity 프로젝트를 VSCode를 통해서 C# 스크립팅하는 도중 다음과 같은 알림이 뜨면서 VSCode의 C# Extension인 Omnisharp이 제대로 로딩되지 않아 IDE가 제대로 동작하지 않았다.

<img width="365" alt="2022-11-10-fix-mac-c#-omnisharp-0" src="https://user-images.githubusercontent.com/18159012/200888017-aeec57fc-68fa-40e7-ac1a-f1d27c84bffb.png">

아마도 VSCode의 Extension을 자동으로 업데이트하는 옵션으로 인해 업데이트 된 이후 최신버전에서 제대로 호환이 되지 않는 것 같다.

해당 알림 모달에서 설명하는대로 하면 될까 싶어서 최신 Visaul Studio 지원 Mono도 다시 설치해봤지만 소용이 없었다. 어쩔 수 없이 지원하는 Omnisharp 버전을 새로 받아야 했다.

# Solution

## 1. Uninstall C# Extension

적절한 버전의 Omnisharp을 설치하기 위해 VSCode에서 사용중인 `C# Extension`을 uninstall한다.

## 2. Install Stable Version of C# Extension (Omnisharp)

관련 OmniSharp-VSCode Github에 등록된 이슈를 통해서 해당 이슈가 v1.25.1 부터 발생했다는 것을 알게되어 v1.25.0 버전을 설치하여 해결하도록 한다.

VSCode의 extension들은 '.vxis' 확장자 파일을 통해 제공하기 때문에 v1.25.0 버전의 OS와 환경에 맞는 파일을 다음 링크에서 다운받아 사용하면 된다. https://github.com/OmniSharp/omnisharp-vscode/releases/tag/v1.25.0

다운로드 후 VSCode의 extension 탭에서 vxis를 통한 설치를 하면 문제는 해결되게 된다.

<img width="500" alt="2022-11-10-fix-mac-c#-omnisharp-1" src="https://user-images.githubusercontent.com/18159012/200888032-cde849a6-d21a-483e-a693-8667d5b09457.png">
