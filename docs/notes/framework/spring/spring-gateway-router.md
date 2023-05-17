# Spring Cloud Gateway实现自定义路由
通过自定义负载均衡实现

## 自定负载均衡

### 定义LoadBalancer
```java
package com.seezoon.loadbalancer;

import com.seezoon.loadbalancer.GwLoadBalancerMetaProperties.PeerSet;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.loadbalancer.DefaultResponse;
import org.springframework.cloud.client.loadbalancer.EmptyResponse;
import org.springframework.cloud.client.loadbalancer.Request;
import org.springframework.cloud.client.loadbalancer.RequestDataContext;
import org.springframework.cloud.client.loadbalancer.Response;
import org.springframework.cloud.loadbalancer.core.NoopServiceInstanceListSupplier;
import org.springframework.cloud.loadbalancer.core.ReactorServiceInstanceLoadBalancer;
import org.springframework.cloud.loadbalancer.core.SelectedInstanceCallback;
import org.springframework.cloud.loadbalancer.core.ServiceInstanceListSupplier;
import org.springframework.http.HttpHeaders;
import org.springframework.util.CollectionUtils;
import reactor.core.publisher.Mono;

/**
 * 元数据路由 + 单元化 + 对等切换
 *
 * @author dfenghuang
 * @date 2023/4/24 22:35
 * @see org.springframework.cloud.loadbalancer.core.RoundRobinLoadBalancer
 */
@Slf4j
public class MetaLoadBalancer implements ReactorServiceInstanceLoadBalancer {


    private static final String metaPrefix = "meta.";
    private static final String metaCity = metaPrefix + "city";
    private static final String metaIdc = metaPrefix + "idc";
    private static final String metaSet = metaPrefix + "set";
    // 通过header动态路由，放set的值
    private static final String dynamicRouterHeader = "X-Router";
    private final GwLoadBalancerMetaProperties gwLoadBalancerMetaProperties;

    private final ObjectProvider<ServiceInstanceListSupplier> serviceInstanceListSupplierProvider;
    private final String serviceId;
    private final AtomicInteger position;

    public MetaLoadBalancer(GwLoadBalancerMetaProperties gwLoadBalancerMetaProperties,
            ObjectProvider<ServiceInstanceListSupplier> serviceInstanceListSupplierProvider,
            String serviceId) {
        this(gwLoadBalancerMetaProperties, serviceInstanceListSupplierProvider, serviceId, new Random().nextInt(1000));
    }

    public MetaLoadBalancer(GwLoadBalancerMetaProperties gwLoadBalancerMetaProperties,
            ObjectProvider<ServiceInstanceListSupplier> serviceInstanceListSupplierProvider, String serviceId,
            int seedPosition) {
        this.gwLoadBalancerMetaProperties = gwLoadBalancerMetaProperties;
        this.serviceInstanceListSupplierProvider = serviceInstanceListSupplierProvider;
        this.serviceId = serviceId;
        this.position = new AtomicInteger(seedPosition);
    }

    @Override
    public Mono<Response<ServiceInstance>> choose(Request request) {
        ServiceInstanceListSupplier supplier = serviceInstanceListSupplierProvider
                .getIfAvailable(NoopServiceInstanceListSupplier::new);
        String dynamicRouterHeaderValue = this.getDynamicRouterHeaderValue(request);
        return supplier.get(request).next()
                .map(serviceInstances -> processInstanceResponse(supplier, serviceInstances, dynamicRouterHeaderValue));
    }

    private String getDynamicRouterHeaderValue(Request request) {
        RequestDataContext context = (RequestDataContext) request.getContext();
        HttpHeaders headers = context.getClientRequest().getHeaders();
        List<String> dynamicRouterHeaders = headers.get(dynamicRouterHeader);
        String dynamicRouterHeaderValue =
                CollectionUtils.isEmpty(dynamicRouterHeaders) ? null : dynamicRouterHeaders.get(0);
        return dynamicRouterHeaderValue;
    }

    private Response<ServiceInstance> processInstanceResponse(ServiceInstanceListSupplier supplier,
            List<ServiceInstance> serviceInstances, String dynamicRouterHeaderValue) {
        List<ServiceInstance> metaInstances = this.getMetaInstances(serviceInstances, dynamicRouterHeaderValue);
        Response<ServiceInstance> serviceInstanceResponse = getRoundRobinInstanceResponse(metaInstances);
        if (supplier instanceof SelectedInstanceCallback && serviceInstanceResponse.hasServer()) {
            ((SelectedInstanceCallback) supplier).selectedServiceInstance(serviceInstanceResponse.getServer());
        }
        return serviceInstanceResponse;
    }

    /**
     * 根据元数据获取实例
     *
     * @param serviceInstances
     * @param dynamicRouterHeaderVlaue 动态路由
     * @return
     */
    private List<ServiceInstance> getMetaInstances(List<ServiceInstance> serviceInstances,
            String dynamicRouterHeaderVlaue) {
        if (serviceInstances.isEmpty()) {
            return Collections.emptyList();
        }
        String city = gwLoadBalancerMetaProperties.getCity();
        String idc = gwLoadBalancerMetaProperties.getIdc();
        String set = gwLoadBalancerMetaProperties.getSet();
        // 自定义的路由元数据
        Map<String, String> custom = gwLoadBalancerMetaProperties.getCustom();
        Map<String, String> metas = new HashMap<>(4);
        if (StringUtils.isNotEmpty(city)) {
            metas.put(metaCity, city);
        }
        if (StringUtils.isNotEmpty(idc)) {
            metas.put(metaIdc, idc);
        }
        if (StringUtils.isNotEmpty(set)) {
            metas.put(metaSet, set);
        }
        // 以动态路由的set为准
        if (StringUtils.isNotEmpty(dynamicRouterHeaderVlaue)) {
            metas.put(metaSet, dynamicRouterHeaderVlaue);
        }
        PeerSet peerSet = this.peerSwitch(metas.get(metaSet));
        // 有对等切换
        if (null != peerSet && StringUtils.isNotEmpty(peerSet.getTo())) {
            int rate = peerSet.getRate();
            // 1- 100
            int seed = new Random().nextInt(100) + 1;
            if (seed <= rate) {
                metas.put(metaSet, peerSet.getTo());
                log.info("serviceId:{},currentSet:{}, peer switch to:{}", serviceId, peerSet.getFrom(),
                        peerSet.getTo());
            }
        }
        metas.putAll(custom);
        if (log.isDebugEnabled()) {
            log.debug("serviceId:{},meta:{}", serviceId, metas);
        }
        List<ServiceInstance> result = new ArrayList<>(serviceInstances.size());
        for (ServiceInstance serviceInstance : serviceInstances) {
            Map<String, String> metadata = serviceInstance.getMetadata();
            boolean matched = true;
            for (Entry<String, String> entry : metas.entrySet()) {
                String key = entry.getKey();
                String value = entry.getValue();
                if (StringUtils.isEmpty(value)) {
                    continue;
                }
                if (!value.equals(metadata.get(key))) {
                    matched = false;
                    break;
                }
            }
            if (matched) {
                result.add(serviceInstance);
            }
        }
        return result;
    }

    private PeerSet peerSwitch(String currentSet) {
        if (StringUtils.isEmpty(currentSet)) {
            return null;
        }
        ArrayList<PeerSet> peerSetSwitch = gwLoadBalancerMetaProperties.getPeerSetSwitch();
        if (CollectionUtils.isEmpty(peerSetSwitch)) {
            return null;
        }
        // 避免变更时候正在遍历
        ArrayList<PeerSet> cloned = (ArrayList<PeerSet>) peerSetSwitch.clone();
        log.info("serviceId:{},currentSet:{},peerSetSwitch config:{}", serviceId, currentSet, cloned);
        Optional<PeerSet> first = cloned.stream().filter(v -> currentSet.equals(v.getFrom())).findFirst();
        return first.orElse(null);
    }

    private Response<ServiceInstance> getRoundRobinInstanceResponse(List<ServiceInstance> instances) {
        if (instances.isEmpty()) {
            if (log.isWarnEnabled()) {
                log.warn("No servers available for service: " + serviceId);
            }
            return new EmptyResponse();
        }

        // Ignore the sign bit, this allows pos to loop sequentially from 0 to
        // Integer.MAX_VALUE
        int pos = this.position.incrementAndGet() & Integer.MAX_VALUE;

        ServiceInstance instance = instances.get(pos % instances.size());

        return new DefaultResponse(instance);
    }

}

```

### 配置
```java
package com.seezoon.configuration;

import com.seezoon.loadbalancer.GwLoadBalancerMetaProperties;
import com.seezoon.loadbalancer.MetaLoadBalancer;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.loadbalancer.core.ReactorLoadBalancer;
import org.springframework.cloud.loadbalancer.core.RoundRobinLoadBalancer;
import org.springframework.cloud.loadbalancer.core.ServiceInstanceListSupplier;
import org.springframework.cloud.loadbalancer.support.LoadBalancerClientFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;

/**
 * 配置自定义的负载均衡
 *
 * @author dfenghuang
 * @date 2023/4/25 22:26
 * @see <a
 *         href="https://docs.spring.io/spring-cloud-commons/docs/current/reference/html/#switching-between-the-load-balancing-algorithms">https://docs.spring.io/spring-cloud-commons/docs/current/reference/html/#switching-between-the-load-balancing-algorithms</a>
 */
public class MetaLoadBalancerConfiguration {

    @Bean
    ReactorLoadBalancer<ServiceInstance> randomLoadBalancer(GwLoadBalancerMetaProperties gwLoadBalancerMetaProperties,
            Environment environment,
            LoadBalancerClientFactory loadBalancerClientFactory) {
        String name = environment.getProperty(LoadBalancerClientFactory.PROPERTY_NAME);
        ObjectProvider<ServiceInstanceListSupplier> lazyProvider = loadBalancerClientFactory.getLazyProvider(name,
                ServiceInstanceListSupplier.class);
        if (gwLoadBalancerMetaProperties.isEnable()) {
            return new MetaLoadBalancer(gwLoadBalancerMetaProperties,
                    lazyProvider,
                    name);
        } else {
            return new RoundRobinLoadBalancer(lazyProvider, name);
        }

    }
}

```

```java
package com.seezoon;

import com.seezoon.configuration.MetaLoadBalancerConfiguration;
import com.seezoon.loadbalancer.GwLoadBalancerMetaProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.cloud.loadbalancer.annotation.LoadBalancerClients;

@SpringBootApplication
@LoadBalancerClients(defaultConfiguration = MetaLoadBalancerConfiguration.class)
@EnableConfigurationProperties(GwLoadBalancerMetaProperties.class)
public class MainApplication {

    public static void main(String[] args) {
        // for nacos
        System.setProperty("project.name", "external-gateway");
        SpringApplication.run(MainApplication.class, args);
    }
}
```

```java
package com.seezoon.loadbalancer;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/**
 * 网关元素路由配置，通常是为了实现单元化及单元化对等切换使用
 *
 * @author dfenghuang
 * @date 2023/4/24 22:42
 */
@Validated
@ConfigurationProperties(prefix = "spring.cloud.loadbalancer.meta")
@Getter
@Setter
public class GwLoadBalancerMetaProperties {

    private boolean enable = true;
    /**
     * set 标签，根据请求中的数据计算set 属性则高于该值
     */
    private String set;
    private String idc;
    private String city;

    /**
     * 自定义负载均衡元数据
     */
    private Map<String, String> custom = Collections.emptyMap();

    /**
     * 对等切换，可以使用配置中心动态下发
     */
    private ArrayList<PeerSet> peerSetSwitch;

    /**
     * 对等切换
     */
    @Getter
    @Setter
    public static class PeerSet {

        private String from;
        private String to;
        /**
         * 0-100
         */
        private int rate;

        @Override
        public String toString() {
            return "PeerSet{" +
                    "from='" + from + '\'' +
                    ", to='" + to + '\'' +
                    ", rate=" + rate +
                    '}';
        }
    }

}

```
```yaml
spring:
  profiles:
    # 环境标识，本机开发环境有意义,如果觉得污染,可以IDEA 传入--spring.profiles.active=local
    active: local
  lifecycle:
    timeout-per-shutdown-phase: 30s
  application:
    name: external-gateway
  cloud:
    nacos:
      discovery:
        server-addr: ${nacos.address}
        metadata:
          # 注册的标签
          meta.set: set1
    gateway:
      discovery:
        locator:
          # 可以直接访问微服务 不用加路由，如/user-server-app/xxxx，自动转发到app应用的xxx http 接口
          enabled: true
      routes:
        - id: user-server-app
          #uri: http://127.0.0.1:8090
          uri: lb://user-server-app
          predicates:
            - Path=/user/**
          filters:
            - StripPrefix=1
            - PreserveHostHeader
    loadbalancer:
      # 自定义的路由及对等切换
      meta:
        enable: false
        set: set1
        idc: idc1
        city: city1
        custom:
          meta.tenant: tenant1
        peer-set-switch:
          - from: set1
            to: set2
            rate: 0
      httpclient:
        #https://docs.spring.io/spring-cloud-gateway/docs/3.1.6/reference/html/#http-timeouts-configuration
        connect-timeout: 1000
        response-timeout: 10s
server:
  port: 9100
  http2:
    # 转发grpc
    enabled: true
  ssl:
    enabled: false


```
