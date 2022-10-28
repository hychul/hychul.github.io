```java
@Data
public class User {
    private Long id;
    private String name;
    private Map<String, String> properties;
}
```

```xml
<mapper namespace="Test">
    <select id="selectTest" resultMap="testRst">
        SELECT
            user.id,
            user.name,
            user.age,
            user.gender,
            user.language
        FROM
            user user
        WHERE
            user.id =  #{id}
    </select>

    <resultMap type="com.example.hychul.User" id="userResultMap">
        <result javaType="java.lang.Long" column="id" property="id"></result>
        <result javaType="java.lang.String" column="name" property="name"></result>
        <!-- Set result map to collect properties hash map -->
        <collection property="properties" javaType="java.util.HashMap" resultMap="propertiesResultMap"></collection>
    </resultMap>

    <resultMap type="hashMap" id="propertiesResultMap">
        <result javaType="java.lang.String" column="age" property="ageKey"></result>
        <result javaType="java.lang.String" column="gender" property="genderKey"></result>
        <result javaType="java.lang.String" column="language" property="langKey"></result>
    </resultMap>
</mapper>
```
