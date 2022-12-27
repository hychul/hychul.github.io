

# Solution
`@JsonTypeInfo` 라는 어노테이션이 존재한다.

## @JsonTypeInfo(use = JsonTypeInto.If.CLASS)

## @JsonTypeInfo(use = JsonTypeInto.If.NAME, include = JsonTypeInfo.As.PROPERTY, property = "type")

## 

## @JsonSubTypes
```kotlin
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.PROPERTY,
    property = "type",
    defaultImpl = A::class
)
@JsonSubTypes(
    JsonSubTypes.Type(value = B::class, name = "B"),
    JsonSubTypes.Type(value = C::class, name = "C")
)
abstract class A(
    open val id: Long,
    open var type: String?) {
}

data class B(
    override val id: Long,
    override var type: String?,
    val text: String
) : A(id, type)

data class C(
    override val id: Long,
    override var type: String?,
    val hash: String
) : A(id, type)
```

```kotlin
    @PostMapping("/temp")
    fun temp(@RequestBody a: A) {
        when (a) {
            is B -> {
                System.out.println("B")
            }
            is C -> {
                System.out.println("C")
            }
            else -> {
                System.out.println("A")
            }
        }
    }
```