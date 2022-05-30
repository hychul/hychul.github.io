이전에 65% 키보드에서 '~'을 shift와 esc키의 조합으로 사용하기 위한 카라비너 설정 [글](https://hychul.github.io/#/posts/2021-06-18-karabiner-shift-esc-as-tilde)을 업로드한 적이 있다. 해당 설정 이후 잘 쓰고 있었는데, 이후 키보드를 깜빡하거나, 잠깐 맥북 키보드를 사용할 때 한영 전환이 키보드 설정 (right command > control + space)와 달라 자꾸 헷깔려 카라비너에 해당 설정을 추가했다.

# 카라비너에서 키조합 설정하기

설정 방법은 이전의 tilbe.json과 마찬가지로 json을 생성후 '~/.config/karabiner/assets/complex_modifications/' 디렉토리 안에 json 형식의 파일을 추가하고 카라비너를 통해 해당 키조합을 활성화하면 된다.

```json
{
  "title": "language transition",
  "rules": [
    {
      "description": "right command = control + space",
      "manipulators": [
        {
          "type": "basic",
          "conditions": [
            {
              "type": "frontmost_application_unless",
              "bundle_identifiers": [
                "com.parallels.desktop",
                "com.parallels.vm",
                "com.parallels.desktop.console",
                "com.parallels.winapp.",
                "com.microsoft.rdc.macos"
              ]
            }
          ],
          "from": {
            "key_code": "right_command",
            "modifiers": { "optional": ["caps_lock"] }
          },
          "to": [
            {
              "key_code": "spacebar",
              "modifiers": ["left_control"]
            }
          ]
        }
      ]
    }
  ]
}
```

## 주의사항

맥에서 한영 전환을 f18과 같이 잘 사용하지 않는 키에 지정하고 karabiner에서 right command에 f18 키를 할당할 수도 있지만, 키보드의 설정과 맥의 설정을 통일하고 웬만하면 기본 맥 설정을 건드리기 싫기 대문에 복합키 지정을 통해 구현한다.
때문에 해당 키조합을 사용하기 위해선 맥 키보드 설정에서 언어 변경을 'control + space'로 지정하고 사용해야한다.
