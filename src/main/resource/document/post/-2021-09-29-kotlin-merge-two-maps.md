
# Solution
## 1. Using groupBy() function
The idea is to get a distinct list of all mappings and froup values by the key such that we gwt a map where each group key is associated with a list of corresponding values. This would translate to a simple code velow using the `groupBy()` function:

```kotlin
fun main() {
    val first = mapOf("A" to "0", "B" to "1", "C" to "2")
    val second = mapOf("A" to "4", "C" to "2")
 
    val result = (first.asSequence() + second.asSequence()).distinct()
                    .groupBy({ it.key }, { it.value })
                    .mapValues { it.value.joinToString(",") }
 
    print(result)            // {A=0,4, B=1, C=2}
}
```

## 2. Using associateWith() function
Another good apporoach is to collect all keys present in the map and then associate each key with the set of values using the `associateWith()` function. Here's an example of its usage.

```kotlin
fun main() {
    val first = mapOf("A" to "0", "B" to "1", "C" to "2")
    val second = mapOf("A" to "4", "C" to "2")
 
    val result = (first.keys + second.keys)
                    .associateWith{ listOf(first[it], second[it]).joinToString() }
 
    print(result)            // {A=0,4, B=1, C=2}
}
```