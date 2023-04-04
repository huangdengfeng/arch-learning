# Mybatis动态sql 语句

## 符号`#` vs `$`
在 MyBatis 中，SQL 参数的写法有两种：# 和 $。两者的区别在于：

- `#`会将参数占位符替换成 JDBC 预编译语句中的问号 ?，然后将预处理语句发送给数据库，因此可以有效地防止 SQL 注入攻击，但是需要注意使用正确的类型处理器。
- `$`不会将参数占位符替换成问号 ?，而是直接将参数值插入到 SQL 语句中，因此容易受到 SQL 注入攻击，一般不建议使用。

## 使用常量

**sql中**

```sql
select * from table where t.status = ${@com.xxxx.constants.DbStatusConstant@STATUS_NORMAL}
```

**指令或者标签中**

```xml
 <if test="status == @com.xxxx.constants.DbStatusConstant@STATUS_NORMAL">
</if>
```

## 数组或者集合
- 如果参数中未使用`@Param("名字")`，如果传数组则`collection="array"`，如果传集合则`collection="list"`
- 如果使用`@Param("名字")`，或者在对象中，则添实际的命名
```sql
  select * from table t 
  <where>
    <if test="array != null and array.length > 0">
   t.status in
    <foreach item="item" collection="array" separator="," open="(" close=")">
        #{item}
    </foreach>
    </if>
  </where>
```

```sql
  select * from table t 
  <where>
    <if test="list != null and list.size() > 0">
   t.status in
    <foreach item="item" collection="list" separator="," open="(" close=")">
        #{item}
    </foreach>
    </if>
  </where>
```

## 转义

```sql
 <![CDATA[
 and (t.create_time > #{createDate} and t.create_time < date_add(#{createDate}, interval 1 day))
]]>
```
