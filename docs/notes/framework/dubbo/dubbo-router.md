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

```text
// 优先级高
RpcContext.getContext().setAttachment(Constants.TAG_KEY,"tag1");
RpcContext.getContext().setAttachment(Constants.FORCE_USE_TAG,"true");
```

## 自定义路由

和插件扩展原理一样，创建文件META-INF/dubbo/org.apache.dubbo.rpc.cluster.router.state.StateRouterFactory
放入文本文件

```text
metaRouter=com.seezoon.dubbo.router.MetaStateRouterFactory
```

主要是继承`CacheableStateRouterFactory`

```java
/**
 * 元数据路由
 *
 * @author dfenghuang
 * @date 2023/3/27 23:40
 */
@Activate
public class MetaStateRouterFactory extends CacheableStateRouterFactory {

    @Override
    protected <T> StateRouter<T> createRouter(Class<T> interfaceClass, URL url) {
        Map<String, String> routerMetas = url.getParameters(v -> v.startsWith("router.meta"));
        RouterMeta routerMeta = new RouterMeta();
        Map<String, String> customMeta = new HashMap<>(routerMetas.size());
        routerMetas.forEach((k, v) -> {
            if (RouterMeta.CONSUMER_SET_KEY.equals(k)) {
                routerMeta.setSet(v);
            } else if (RouterMeta.CONSUMER_IDC_KEY.equals(k)) {
                routerMeta.setIdc(v);
            } else if (RouterMeta.CONSUMER_CITY_KEY.equals(k)) {
                routerMeta.setCity(v);
            } else if (RouterMeta.NEARBY_ROUTE_KEY.equals(k)) {
                routerMeta.setNearbyRoute(
                        StringUtils.isNotEmpty(v) ? Boolean.parseBoolean(v) : true);
            } else {
                customMeta.put(k.substring(RouterMeta.ROUTER_PREFIX.length()), v);
            }
        });
        routerMeta.setCustomMeta(customMeta);
        routerMeta.setNearbyMetaEmpty(StringUtils.isEmpty(routerMeta.getSet())
                && StringUtils.isEmpty(routerMeta.getIdc())
                && StringUtils.isEmpty(routerMeta.getCity()));
        routerMeta.setEmpty(routerMeta.isNearbyMetaEmpty() && customMeta.isEmpty());
        return new MetaStateRouter(routerMeta, url);
    }
}
```

主要继承`AbstractStateRouter`

```java
/**
 * 元数据路由
 * </p>
 *
 * <pre>
 * 1. 如果设置了自定义的元数据，元数据需要严格匹配；
 * 2. 如果设置了就近路由元数据，按set->idc->city的维度逐步找
 * 3. 如果关闭就近路由，就近的元数据存在的话，也需要严格匹配到
 * </pre>
 *
 * @author dfenghuang
 * @date 2023/3/27 23:42
 */
@Slf4j
public class MetaStateRouter<T> extends AbstractStateRouter<T> {

    private static final int size = 5;
    private final RouterMeta routerMeta;

    public MetaStateRouter(RouterMeta routerMeta, URL url) {
        super(url);
        this.routerMeta = routerMeta;
    }

    @Override
    protected BitList<Invoker<T>> doRoute(BitList<Invoker<T>> invokers, URL url,
            Invocation invocation,
            boolean needToPrintMessage, Holder<RouterSnapshotNode<T>> routerSnapshotNodeHolder,
            Holder<String> messageHolder) throws RpcException {
        if (routerMeta.isEmpty()) {
            return invokers;
        }
        if (log.isDebugEnabled()) {
            log.debug("consumer:{},router meta:{}", url, routerMeta);
        }
        int minSize = Math.min(size, invokers.size());
        List<Invoker<T>> result = new ArrayList<>(invokers.size());
        List<Invoker<T>> setResult = new ArrayList<>(minSize);
        List<Invoker<T>> idcResult = new ArrayList<>(minSize);
        List<Invoker<T>> cityResult = new ArrayList<>(minSize);
        String consumerSet = invocation.getAttachment(RouterMeta.CONSUMER_SET_KEY,
                routerMeta.getSet());
        String consumerIdc = invocation.getAttachment(RouterMeta.CONSUMER_IDC_KEY,
                routerMeta.getIdc());
        String consumerCity = invocation.getAttachment(RouterMeta.CONSUMER_CITY_KEY,
                routerMeta.getCity());
        for (Invoker<T> invoker : invokers) {
            Map<String, String> parameters = invoker.getUrl().getParameters();
            // 自定义的元数据必须匹配
            boolean customMetaMatched = true;
            for (Entry<String, String> entry : routerMeta.getCustomMeta().entrySet()) {
                if (!Objects.equals(entry.getValue(), parameters.get(entry.getKey()))) {
                    customMetaMatched = false;
                }
            }
            if (!customMetaMatched) {
                continue;
            }
            if (routerMeta.isNearbyMetaEmpty()) {
                continue;
            }
            String providerSet = parameters.get(RouterMeta.SET);
            String providerIdc = parameters.get(RouterMeta.IDC);
            String providerCity = parameters.get(RouterMeta.CITY);
            // 不开就近，就需要全匹配
            if (!routerMeta.isNearbyRoute()) {
                if (StringUtils.isNotEmpty(consumerSet) && !Objects.equals(consumerSet,
                        providerSet)) {
                    continue;
                }
                if (StringUtils.isNotEmpty(consumerIdc) && !Objects.equals(consumerIdc,
                        providerIdc)) {
                    continue;
                }
                if (StringUtils.isNotEmpty(consumerCity) && !Objects.equals(consumerCity,
                        providerCity)) {
                    continue;
                }
                result.add(invoker);
                continue;
            }
            if (StringUtils.isNotEmpty(consumerSet) && Objects.equals(consumerSet,
                    providerSet)) {
                setResult.add(invoker);
                continue;
            }
            if (StringUtils.isNotEmpty(consumerIdc) && Objects.equals(consumerIdc,
                    providerIdc)) {
                idcResult.add(invoker);
                continue;
            }
            if (StringUtils.isNotEmpty(consumerCity) && Objects.equals(consumerCity,
                    providerCity)) {
                cityResult.add(invoker);
            }
        }
        // 如果不开就近
        if (!routerMeta.isNearbyRoute()) {
            return new BitList<>(result);
        }
        // 或者距离标签配置则返回全量
        if (routerMeta.isNearbyMetaEmpty()) {
            return new BitList<>(result);
        }

        // 就近路由
        if (!setResult.isEmpty()) {
            log.debug("use set nearby meta:{}", consumerSet);
            return new BitList<>(setResult);
        }
        if (!idcResult.isEmpty()) {
            log.debug("use idc nearby meta:{}", consumerIdc);
            return new BitList<>(idcResult);
        }
        if (!cityResult.isEmpty()) {
            log.debug("use city nearby meta:{}", consumerCity);
            return new BitList<>(cityResult);
        }
        log.debug("can not find any nearby provider");
        return new BitList<>(result);
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

## 源代码

[dubbo自定义就近路由](https://github.com/seezoon/seezoon-standard/tree/master/starters/dubbo-spring-boot-starter/src/main/java/com/seezoon/dubbo/router)

