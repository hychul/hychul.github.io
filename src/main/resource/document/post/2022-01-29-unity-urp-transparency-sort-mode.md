Unity의 기본 렌더링 파이프 라인이 기존 스크립트 쉐이더를 사용하던 스탠다드에서 URP로 전환되면서 2D 렌더링 파이프라인이 아닌 경우 Transparency Sort Mode 설정이 [Edit] - [Project Setting] - [Graphics] 에서 사라졌다.

문제는 해당 옵션이 사라지면서 2D Sprite를 사용하면 y-axis를 사용해서 정렬되는 것이었는데, 스프라이트와 그림자를 동시에 사용하면서 z-axis를 기준으로 정렬하기 위해서 2D 랜더링 파이프라인을 사용할 수 없었다. (현재 lighting과 그림자를 지원하지 않음)

> **Menu를 사용해서 설정하기**  
> [Edit] - [Project Setting] - [Graphics]에서 파이프라인을 none으로 설정한 후 `Transparency Sort Mode`를 설정 후에 다시 파이프라인을 설정하라고 설명하는 글이 있는데, 왠지 제대로 동작하지 않았다.

# Solution

다음의 스크립트를 통해서 코드를 통해 `GraphicsSettings`을 설정하면 된다.

한번 에디터 혹은 게임에서 로드되면 설정이 반영되기 때문에 설정 변경 후엔 해당 스크립트를 삭제해도 무방하다.

```c#
using UnityEngine;
using UnityEngine.Rendering;
#if UNITY_EDITOR
using UnityEditor;
#endif

#if UNITY_EDITOR
[InitializeOnLoad]
#endif
class TransparencySortModeConfig
{
    static TransparencySortModeConfig()
    {
        OnLoad();
    }

    [RuntimeInitializeOnLoadMethod]
    static void OnLoad()
    {
        GraphicsSettings.transparencySortMode = TransparencySortMode.CustomAxis;
        GraphicsSettings.transparencySortAxis = new Vector3(0.0f, 0.0f, 1.0f);
    }
}

```
