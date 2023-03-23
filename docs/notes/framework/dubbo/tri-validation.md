# Dubbo Triple 统一参数验证

微服务中通用入参验证可以减少很多胶水代码，java对象通常采用jsr303校验很方便。当使用triple 协议时候我们迫切需要PB
参数自动校验。

## 原理

dubbo在参数验证这里有一个扩展点。参见[dubbo验证扩展](https://cn.dubbo.apache.org/zh-cn/overview/mannual/java-sdk/reference-manual/spi/description/validation/)

## 具体实现

### 使用proto 扩展字典定义验证规则

使用[protoc-gen-validate](https://github.com/bufbuild/protoc-gen-validate)，该项目早期在envoy项目下维护，具备大公司背书。

格式demo，具体文档很清楚

```protobuf
syntax = "proto3";

package examplepb;

import "validate/validate.proto";

message Person {
  uint64 id = 1 [(validate.rules).uint64.gt = 999];

  string email = 2 [(validate.rules).string.email = true];

  string name = 3 [(validate.rules).string = {
    pattern:   "^[^[0-9]A-Za-z]+( [^[0-9]A-Za-z]+)*$",
    max_bytes: 256,
  }];

  Location home = 4 [(validate.rules).message.required = true];

  message Location {
    double lat = 1 [(validate.rules).double = {gte: -90,  lte: 90}];
    double lng = 2 [(validate.rules).double = {gte: -180, lte: 180}];
  }
}
```

### 添加依赖

运行时依赖。

```xml

<dependency>
    <groupId>build.buf.protoc-gen-validate</groupId>
    <artifactId>pgv-java-stub</artifactId>
    <version>${pgv.version}</version>
</dependency>
```

代码生成时候依赖，主要是添加protoc-java-pgv，其余是protoc+dubbo 插件。

```xml

<plugin>
    <groupId>org.xolstice.maven.plugins</groupId>
    <artifactId>protobuf-maven-plugin</artifactId>
    <version>${protobuf-maven-plugin.version}</version>
    <configuration>
        <protocArtifact>
            com.google.protobuf:protoc:${protoc.version}:exe:${os.detected.classifier}
        </protocArtifact>
        <pluginId>grpc-java</pluginId>
        <pluginArtifact>
            io.grpc:protoc-gen-grpc-java:${grpc.version}:exe:${os.detected.classifier}
        </pluginArtifact>
        <protocPlugins>
            <protocPlugin>
                <id>dubbo</id>
                <groupId>org.apache.dubbo</groupId>
                <artifactId>dubbo-compiler</artifactId>
                <version>${dubbo.version}</version>
                <mainClass>org.apache.dubbo.gen.tri.Dubbo3TripleGenerator</mainClass>
            </protocPlugin>
        </protocPlugins>
    </configuration>
    <executions>
        <execution>
            <goals>
                <goal>compile</goal>
                <goal>test-compile</goal>
                <goal>compile-custom</goal>
                <goal>test-compile-custom</goal>
            </goals>
        </execution>
        <execution>
            <id>protoc-java-pgv</id>
            <goals>
                <goal>compile-custom</goal>
            </goals>
            <configuration>
                <pluginParameter>lang=java</pluginParameter>
                <pluginId>java-pgv</pluginId>
                <pluginArtifact>
                    build.buf.protoc-gen-validate:protoc-gen-validate:${pgv.version}:exe:${os.detected.classifier}
                </pluginArtifact>
            </configuration>
        </execution>
    </executions>
</plugin>
```

### 添加dubbo扩展申明

```text
src
 |-main
    |-resources
        |-META-INF
            |-dubbo
                |-org.apache.dubbo.validation.Validation (纯文本文件，内容为：pbValidation=com.seezoon.dubbo.support.validation.PbValidation)
```

### 扩展类

```java
package com.seezoon.dubbo.support;

import org.apache.dubbo.common.URL;
import org.apache.dubbo.validation.Validation;
import org.apache.dubbo.validation.Validator;

/**
 * PB 校验
 *
 * @author dfenghuang
 * @date 2023/3/20 22:03
 */
public class PbValidation implements Validation {

    private static final Validator validator = new PbValidator();

    @Override
    public Validator getValidator(URL url) {
        return validator;
    }
}

```

```java
package com.seezoon.dubbo.support;

import io.envoyproxy.pgv.ReflectiveValidatorIndex;
import io.envoyproxy.pgv.ValidationException;
import io.envoyproxy.pgv.ValidatorIndex;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.apache.dubbo.rpc.RpcException;
import org.apache.dubbo.validation.Validator;

/**
 * PB 参数验证
 *
 * @author dfenghuang
 * @date 2023/3/20 22:14
 */
public class PbValidator implements Validator {

    private static final ValidatorIndex validatorIndex = new ReflectiveValidatorIndex();
    private static final Map<Class<?>, io.envoyproxy.pgv.Validator<Object>> validators = new ConcurrentHashMap<>();

    @Override
    public void validate(String methodName, Class<?>[] parameterTypes, Object[] arguments)
            throws Exception {
        if (parameterTypes.length == 0) {
            return;
        }
        for (int i = 0; i < parameterTypes.length; i++) {
            Object argument = arguments[i];
            if (null == argument) {
                continue;
            }
            Class<?> parameterType = parameterTypes[i];
            io.envoyproxy.pgv.Validator<Object> validator = validators.computeIfAbsent(
                    parameterType,
                    key -> validatorIndex.validatorFor(key));
            if (null == validator) {
                throw new RpcException(RpcException.VALIDATION_EXCEPTION,
                        "no validator found for " + parameterType.getName());
            }
            try {
                validator.assertValid(argument);
            } catch (ValidationException e) {
                throw new RpcException(RpcException.VALIDATION_EXCEPTION,
                        "rpc method: " + methodName + " validate failed due to "
                                + e.getField() + " " + e.getReason(), e);
            }
        }
    }
}

```

## 使用

validation参数配置pbValidation即可。

## 源码参考

[dubbo-tri](https://github.com/huangdengfeng/simples/tree/main/dubbo-tri)