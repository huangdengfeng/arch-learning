# Spring ObjectProvider 使用

## 使用场景
注入多个同类型的bean，通常在预留bean扩展使用；比`BeanPostProcessor`更偏应用层。

## 示例
```java
public class RestTemplateAutoConfiguration {
    @Bean
    @Lazy
    @ConditionalOnMissingBean
    public RestTemplateBuilderConfigurer restTemplateBuilderConfigurer(ObjectProvider<HttpMessageConverters> messageConverters, ObjectProvider<RestTemplateCustomizer> restTemplateCustomizers, ObjectProvider<RestTemplateRequestCustomizer<?>> restTemplateRequestCustomizers) {
        RestTemplateBuilderConfigurer configurer = new RestTemplateBuilderConfigurer();
        configurer.setHttpMessageConverters((HttpMessageConverters)messageConverters.getIfUnique());
        configurer.setRestTemplateCustomizers((List)restTemplateCustomizers.orderedStream().collect(Collectors.toList()));
        configurer.setRestTemplateRequestCustomizers((List)restTemplateRequestCustomizers.orderedStream().collect(Collectors.toList()));
        return configurer;
    }
}
```