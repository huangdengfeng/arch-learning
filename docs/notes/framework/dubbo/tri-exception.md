# Dubbo Triple 异常处理

从dubbo协议切换到triple最大的不适应就是异常的处理，异常都成RuntimeException。

## 社区有两种方向

- 上下文透传错误码：采用attachment透传错误码和错误消息，相当于利用http2 response header(不是trailer)
- 响应体中定义错误码

## 个人意见

针对内网微服务，错误码一定要在协议里面体现，这样才方便做错误码监控。

## 官网讨论贴

[issues-10353](https://github.com/apache/dubbo/issues/10353)
[issues-8363](https://github.com/apache/dubbo/issues/8363)
[Triple协议异常设计](https://cn.dubbo.apache.org/zh-cn/blog/2022/12/19/triple-%E5%8D%8F%E8%AE%AE%E6%94%AF%E6%8C%81-java-%E5%BC%82%E5%B8%B8%E5%9B%9E%E4%BC%A0%E7%9A%84%E8%AE%BE%E8%AE%A1%E4%B8%8E%E5%AE%9E%E7%8E%B0/)

## 实现原理

通过定义provider和consumer的异常[filter](https://cn.dubbo.apache.org/zh-cn/overview/mannual/java-sdk/reference-manual/spi/description/filter/)
来无感处理。

> 注：用户自定义 filter 默认在内置 filter 之后

**provider filter**

```java

@Activate(group = {CommonConstants.PROVIDER})
public class TripleProviderExceptionFilter implements Filter, Filter.Listener {

    @Override
    public Result invoke(Invoker<?> invoker, Invocation invocation) throws RpcException {
        return invoker.invoke(invocation);
    }

    @Override
    public void onResponse(Result appResponse, Invoker<?> invoker, Invocation invocation) {
        if (!appResponse.hasException()) {
            return;
        }
        Throwable exception = appResponse.getException();
        if (exception instanceof RpcException) {
            RpcException rpcException = (RpcException) exception;
            appResponse.setAttachment("err-code", rpcException.getCode());
            appResponse.setAttachment("err-msg", rpcException.getMessage());
        } else {
            appResponse.setAttachment("err-code", RpcException.UNKNOWN_EXCEPTION);
            appResponse.setAttachment("err-msg", exception.getMessage());
        }
    }

    @Override

    public void onError(Throwable t, Invoker<?> invoker, Invocation invocation) {
    }
}
```

**consumer filter**
这样到消费者转变成RpcException。

```java

@Activate(group = {CommonConstants.CONSUMER})
public class TripleConsumerExceptionFilter implements Filter, Filter.Listener {

    @Override
    public Result invoke(Invoker<?> invoker, Invocation invocation) throws RpcException {
        return invoker.invoke(invocation);
    }

    @Override
    public void onResponse(Result appResponse, Invoker<?> invoker, Invocation invocation) {
        if (!appResponse.hasException()) {
            return;
        }
        String code = appResponse.getAttachment("err-code");
        String msg = appResponse.getAttachment("err-msg");
        if (StringUtils.isNotEmpty(code)) {
            appResponse.setException(new RpcException(Integer.parseInt(code), msg));
        }
    }

    @Override
    public void onError(Throwable t, Invoker<?> invoker, Invocation invocation) {

    }
}
```

**添加扩展申明**

```text
src
 |-main
    |-resources
        |-META-INF
            |-dubbo
                |-org.apache.dubbo.rpc.Filter
```

org.apache.dubbo.rpc.Filter中纯文本内容

```text
tripleProviderException=com.seezoon.dubbo.support.filter.TripleProviderExceptionFilter
tripleConsumerException=com.seezoon.dubbo.support.filter.TripleConsumerExceptionFilter
```

## 扩展知识

如何做到全局异常处理呢，比如我们provider业务逻辑有参数验证错误，Sql错误等。如果能像spring提供的`@ContollerAdivce`
一样处理就方便了。

这里需要我们自定义类似异常Advice的功能，让所有错误都能变成RpcException携带我们错误码及错误信息。

```java

@DubboAdvice
public class DubboExceptionAdvice {

    @DubboExceptionHandler({IllegalArgumentException.class})
    public void illegalArgumentException(Exception e) {
        throw new RpcException(100, e.getMessage());
    }
}
```

## 核心代码

[dubbo全局异常处理](https://github.com/seezoon/seezoon-standard/tree/master/starters/dubbo-spring-boot-starter/src/main/java/com/seezoon/dubbo/advice)


