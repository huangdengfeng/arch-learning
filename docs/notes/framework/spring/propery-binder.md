# Spring Binder 使用

## 使用场景
通常在扩展spring 配置体系时候使用。此时spring的ConfigureProperties 未初始化完成。主动把配置映射到某个类上。

## 示例

```java
public class DemoEnvironmentPostProcessor implements EnvironmentPostProcessor, Ordered {

    private static final String NAME = "demo";
    private static final String PREFIX = "demo";

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        DemoProperties demoProperties = Binder.get(environment)
                .bindOrCreate(PREFIX, DemoProperties.class);
        Parser parser = new YamlFileParser(demoProperties.getPath());
        Map<String, Object> data = parser.parse();
        MapPropertySource mapPropertySource = new MapPropertySource(NAME, data);
        log.info("add demo:{}", data);
        environment.getPropertySources().addFirst(mapPropertySource);
    }

    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE - 5;
    }
}

```