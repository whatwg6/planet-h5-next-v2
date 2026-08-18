# 开发指南索引

本目录回答“具体任务怎么做”。先查看代码，再按任务读取最少的指南；不要默认加载本目录全部文件。

## 阅读路由

| 任务                                 | 必读                         | 可能还需读取                                                               |
| ------------------------------------ | ---------------------------- | -------------------------------------------------------------------------- |
| 新增或修改路由、Route Mode           | [route.md](route.md)         | [state.md](state.md)、[ADR-0002](../decisions/0002-route-mode-dispatch.md) |
| 新增或调整业务 Feature               | [feature.md](feature.md)     | Query、State、Service 对应指南                                             |
| 接入后端接口或类型                   | [service.md](service.md)     | [mock.md](mock.md)、[query.md](query.md)                                   |
| 只替换某个接口为 Mock                | [mock.md](mock.md)           | [service.md](service.md)                                                   |
| 编写 Query 或 Mutation               | [query.md](query.md)         | [state.md](state.md)、[testing.md](testing.md)                             |
| 选择状态保存位置                     | [state.md](state.md)         | [route.md](route.md)、[query.md](query.md)                                 |
| 新增共享或业务组件                   | [component.md](component.md) | [asset.md](asset.md)、[testing.md](testing.md)                             |
| 添加图片、图标或 public 资源         | [asset.md](asset.md)         | [component.md](component.md)                                               |
| 添加或调整测试                       | [testing.md](testing.md)     | 被测能力对应指南                                                           |
| 修改 Manifest、Service Worker 或缓存 | [pwa.md](pwa.md)             | [ADR-0005](../decisions/0005-pwa-cache-boundary.md)                        |

跨越多个生产层时再读取 [架构文档](../ARCHITECTURE.md)。需要理解或改变取舍时，读取 [ADR 索引](../decisions/README.md)。

## 规范词义

- “必须 / 不得”：当前架构约束。
- “默认”：没有特殊需求时采用；偏离时应在代码或评审中说明原因。
- “可以”：允许但不要求。
- “示例”：只说明形式，不代表待开发需求或必须存在的目录。

脚本、版本和具体配置始终以 `package.json`、锁文件、测试配置和 CI 文件为准。
