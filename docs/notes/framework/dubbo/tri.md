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

##  