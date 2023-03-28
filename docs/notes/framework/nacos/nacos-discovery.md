# Nacos & Dubbo 服务注册

使用nacos作为服务注册中心。

## 详细使用文档

[Dubbo Registry With Nacos](https://cn.dubbo.apache.org/zh-cn/overview/what/ecosystem/registry/nacos/)

## 服务隔离

注册中心namespcae、group配置服务会隔离不互通

## 安装文档

日常开发使用单机版本即可。

[单机版安装手册](https://nacos.io/zh-cn/docs/quick-start.html)

安装完启动后访问：
http://localhost:8848/nacos  
账号：nacos  
密码：nacos

## dubbo配置

```yaml
dubbo:
  registry:
    address: nacos://localhost:8848
    # 实例级别注册，默认是实例和接口
    register-mode: instance
```
