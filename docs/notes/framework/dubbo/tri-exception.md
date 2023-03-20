# dubbo Triple 异常处理

从dubbo协议切换最大的不适应就是异常的处理，异常都成RuntimeException。

## 社区有两种方向

- 采用attachment透传错误码和错误消息，相当于利用http2 response header(不是trailer)
- 响应体中定义code和msg

## 个人意见

针对内网微服务，错误码一定要在协议里面体现，这样才方便做错误码监控。

## 官网讨论贴

[issues-10353](https://github.com/apache/dubbo/issues/10353)
[issues-8363](https://github.com/apache/dubbo/issues/8363)
[Triple协议异常设计](https://cn.dubbo.apache.org/zh-cn/blog/2022/12/19/triple-%E5%8D%8F%E8%AE%AE%E6%94%AF%E6%8C%81-java-%E5%BC%82%E5%B8%B8%E5%9B%9E%E4%BC%A0%E7%9A%84%E8%AE%BE%E8%AE%A1%E4%B8%8E%E5%AE%9E%E7%8E%B0/)

## 实现原理