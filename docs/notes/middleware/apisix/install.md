# Apache APISIX

Apache APISIX 是 Apache 软件基金会下的云原生 API 网关，它兼具动态、实时、高性能等特点，提供了负载均衡、动态上游、灰度发布（金丝雀发布）、服务熔断、身份认证、可观测性等丰富的流量管理功能。我们可以使用 Apache APISIX 来处理传统的南北向流量，也可以处理服务间的东西向流量。同时，它也支持作为 K8s Ingress Controller 来使用。

## 使用Docker安装

> mac下不要使用命令，直接用UI.host 网络无法访问.且容器内部`1270.0.0.1` 要替换为`docker.for.mac.host.internal`

**apisix server [安装](https://hub.docker.com/r/apache/apisix)**

```shell
# 二进制
./etcd --advertise-client-urls 'http://0.0.0.0:2379' --listen-client-urls 'http://0.0.0.0:2379'
```
```shell
# mac 下使用ETCD_ADVERTISE_CLIENT_URLS=http://docker.for.mac.host.internal:2379
docker run -d \
  --name etcd \
  --network host \
  -e ALLOW_NONE_AUTHENTICATION=yes \
  -e ETCD_ADVERTISE_CLIENT_URLS=http://127.0.0.1:2379 \
  bitnami/etcd:latest
```


host 模式下直接用到容器内部声明的端口9080
支持[nacos](https://apisix.apache.org/zh/docs/apisix/discovery/nacos/#nacos-%E9%85%8D%E7%BD%AE)
```shell
docker run -d --name apache-apisix \
  --network host \
  -v <CONFIG_FILE>:/usr/local/apisix/conf/config.yaml \
  apache/apisix
#https://github.com/apache/apisix/blob/master/conf/config.yaml
```
```yaml
deployment:
  role: traditional
  role_traditional:
    config_provider: etcd
  admin:
    allow_admin:
      - 0.0.0.0/0  # Please set it to the subnet address you obtained.
                  # If not set, by default all IP access is allowed.
  etcd:
    host:
      - "http://etcd:2379"
    prefix: "/apisix"
    timeout: 30
```

**apisix dashboard [安装](https://github.com/apache/apisix-dashboard/blob/master/docs/en/latest/install.md)**
host 模式下直接用到容器内部声明的端口9000

```shell
docker run -d --name apisix-dashboard \
            --network host \
           -v <CONFIG_FILE>:/usr/local/apisix-dashboard/conf/conf.yaml \
           apache/apisix-dashboard
# CONFIG_FILE 换成主机路径方便修改
# https://github.com/apache/apisix-dashboard/blob/master/api/conf/conf.yaml
```

访问`http://127.0.0.1:9000/` admin/admin