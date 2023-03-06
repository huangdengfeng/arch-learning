# dubbo Triple 协议

Triple协议为dubbo3主推协议，如果选dubbo做为底层RPC框架的，优先选择此协议。

## 说明

根据 Triple 设计的目标，Triple 协议有以下优势:

- 具备跨语言交互的能力，传统的多语言多 SDK 模式和 Mesh 化跨语言模式都需要一种更通用易扩展的数据传输协议。
- 提供更完善的请求模型，除了支持传统的 Request/Response 模型（Unary 单向通信），还支持 Stream（流式通信）
  和Bidirectional（双向通信）。
- 易扩展、穿透性高，包括但不限于 Tracing / Monitoring 等支持，也应该能被各层设备识别，网关设施等可以识别数据报文，对
  Service Mesh 部署友好，降低用户理解难度。
- 完全兼容 grpc，客户端/服务端可以与原生grpc客户端打通。
- 可以复用现有 grpc 生态下的组件, 满足云原生场景下的跨语言、跨环境、跨平台的互通需求。

## 定义通信协议

```protobuf
syntax = "proto3";

option java_multiple_files = true;
option java_package = "com.demo.stub";
option java_outer_classname = "HelloWorldProto";

package com.demo.helloworld;

message HelloReq {
  string name = 1;
}

message HelloResp {
  string message = 1;
}
service Greeter{
  rpc greet(HelloReq) returns (HelloResp);
}
```

## 代码生成

通过grpc插件和dubbo插件生成，协议代码.
proto路径：src/main/proto下
默认生成代码路径：target/generated-sources/protobuf

```xml

<extensions>
    <extension>
        <groupId>kr.motd.maven</groupId>
        <artifactId>os-maven-plugin</artifactId>
        <version>${os-maven-plugin.version}</version>
    </extension>
</extensions>
<plugins>
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
    </executions>
</plugin>
</plugins>

```

## 编写服务

```java
package com.demo.interfaces;

import com.demo.stub.Greeter;
import com.demo.stub.HelloReq;
import com.demo.stub.HelloResp;
import org.apache.dubbo.config.annotation.DubboService;

/**
 * 暴露服务
 */
@DubboService
public class GreeterImpl implements Greeter {

    @Override
    public HelloResp greet(HelloReq request) {
        return HelloResp.newBuilder().setMessage("hello world," + request.getName()).build();
    }
}

```

## 编写测试客户端

```java
package com.demo.interfaces;

import com.demo.stub.Greeter;
import com.demo.stub.HelloReq;
import com.demo.stub.HelloResp;
import org.apache.dubbo.config.annotation.DubboReference;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * 测试消费者
 */
@SpringBootTest
class GreeterImplTest {

    @DubboReference
    private Greeter greeter;

    @Test
    void greet() {
        HelloResp resp = greeter.greet(HelloReq.newBuilder().setName("zhangsan").build());
        System.out.println(resp.getMessage());
    }
}
```

## 配置项

- [配置项手册](https://cn.dubbo.apache.org/zh-cn/overview/mannual/java-sdk/reference-manual/config/properties/)
- [配置约定](https://cn.dubbo.apache.org/zh-cn/overview/mannual/java-sdk/reference-manual/config/principle/#1-%E9%85%8D%E7%BD%AE%E6%A0%BC%E5%BC%8F)

```yaml
spring:
  application:
    name: dubbo-tri
dubbo:
  application:
    name: ${spring.application.name}
  protocol:
    port: 9000
    # triple 协议
    name: tri
  # 消费者默认参数
  consumer:
    # ms
    timeout: 2000
    retries: 0
  reference:
    com.demo.stub.Greeter:
      # 直连
      url: tri://192.168.1.28:9000
```

## 源代码

[dubbo-tri](https://github.com/huangdengfeng/simples/tree/main/dubbo-tri)