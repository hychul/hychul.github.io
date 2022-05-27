`@JsonSubTypes` 을 사용하여 Json의 타입을 분류한다면 분류 대상 프로퍼티에 대해서 각 타입 클래스에 기본 값을 넣어주어야 NPE가 발생하지 않는다.

```kotlin
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type",
)
@JsonSubTypes(
    JsonSubTypes.Type(value = TextChild::class, name = "TEXT"),
    JsonSubTypes.Type(value = ImageChild::class, name = "IMAGE"),
    JsonSubTypes.Type(value = VideoChild::class, name = "VIDEO")
)
interface Parent {
  val type: String
  ...
```

```java
data class TextChild(
    override val type: String,
    val text: String,
) : Parent

data class ImageChild(
    override val type: String,
    val imageUrl: String,
) : Parent

data class VideoChild(
    override val type: String,
    val videoUrl: String,
) : Parent
```
