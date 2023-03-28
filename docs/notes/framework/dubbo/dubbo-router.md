# Dubbo 路由

Dubbo 提供了丰富的流量管控策略:

- 地址发现与负载均衡，地址发现支持服务实例动态上下线，负载均衡确保流量均匀的分布到每个实例上。
- 基于路由规则的流量管控，路由规则对每次请求进行条件匹配，并将符合条件的请求路由到特定的地址子集。

服务发现保证调用方看到最新的提供方实例地址，服务发现机制依赖注册中心 (Zookeeper、Nacos、Istio 等)
实现。在消费端，Dubbo 提供了多种负载均衡策略，如随机负载均衡策略、一致性哈希负载、基于权重的轮询、最小活跃度优先、P2C
等。

Dubbo
的流量管控规则可以基于应用、服务、方法、参数等粒度精准的控制流量走向，根据请求的目标服务、方法以及请求体中的其他附加参数进行匹配，符合匹配条件的流量会进一步的按照特定规则转发到一个地址子集。流量管控规则有以下几种：

- 条件路由规则
- 标签路由规则
- 脚本路由规则
- 动态配置规则

## 说明

由于体验dubbo admin，当前对不具备生产使用的能力。线上误操作容易错。本章节对其成熟稳定的功能进行测试。

- 标签路由：静态打标的方式
- 自定义路由：日常我们所需的就近路由。

## 静态标签路由

provider配置标签，只能有一个。默认场景下会自动找到按标签匹配。
> 原理逻辑在`TagStateRouter`，如果未找到默认会找不携带 tag 的provider.

```yaml
dubbo:
  provider:
    tag: tag-1
```

consumer配置

```yaml
dubbo:
  consumer:
    tag: tag-1
```

实际作为消费者有时候需要强制路由到对应tag。可以添加`dubbo.tag.force: true`的parameters参数。
> 按dubbo parameters参数设计，可以放到application ，consumer，reference 节点。

```yaml
dubbo:
  application:
    name: ${spring.application.name}
    # wait ms
    shut-wait: 30000
  registry:
    address: nacos://localhost:8848
    parameters:
      # 纯消费者时候可以注册上去
      register-consumer-url: true
  consumer:
    # ms
    timeout: 2000
    retries: 0
    # 优先级比parameters高，但实际使用通常针对单个provider设置
    tag: tag-1
  reference:
    com.seezoon.protocol.user.server.domain.UserService:
      # 直连使用url
      #url: tri://192.168.1.28:9000
      parameters:
        dubbo.tag: tagxxx
        dubbo.force.tag: true
```

consumer也可以通过编程方式设置tag

```java
// 优先级高
RpcContext.getContext().setAttachment(Constants.TAG_KEY,"tag1");
        RpcContext.getContext().setAttachment(Constants.FORCE_USE_TAG,"true");
```

## 自定义路由

和插件扩展原理一样，创建文件META-INF/dubbo/org.apache.dubbo.rpc.cluster.router.state.StateRouterFactory
放入文本文件

```text
meta=com.seezoon.user.infrastructure.router.MetaStateRouterFactory
```

主要是继承`CacheableStateRouterFactory`

```java
/**
 * 元数据路由
 */
@Activate
public class MetaStateRouterFactory extends CacheableStateRouterFactory {

    @Override
    protected <T> StateRouter<T> createRouter(Class<T> interfaceClass, URL url) {
        return new MetaStateRouter(url);
    }
}

```

主要继承`AbstractStateRouter`

```java
public class MetaStateRouter<T> extends AbstractStateRouter<T> {

    public MetaStateRouter(URL url) {
        super(url);
    }

    @Override
    protected BitList<Invoker<T>> doRoute(BitList<Invoker<T>> invokers, URL url,
            Invocation invocation,
            boolean needToPrintMessage, Holder<RouterSnapshotNode<T>> routerSnapshotNodeHolder,
            Holder<String> messageHolder) throws RpcException {
        // 模拟要匹配consumer idc 参数
        invokers.removeIf(
                v -> Objects.equals(url.getParameter("idc"), v.getUrl().getParameter("idc")));
        return invokers;
    }

    @Override
    public void stop() {
        super.stop();
    }

    @Override
    public boolean isRuntime() {
        return false;
    }

    @Override
    public boolean isForce() {
        return true;
    }
}
```

