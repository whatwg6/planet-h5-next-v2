# 架构决策记录

本目录保存已经接受的架构决策及其背景。当前生效的长期边界以
[ARCHITECTURE.md](../ARCHITECTURE.md) 为准，具体实现方法见
[开发指南](../development/README.md)。

## 决策索引

| ADR                                                  | 决策                         | 状态     |
| ---------------------------------------------------- | ---------------------------- | -------- |
| [ADR-0001](0001-layering-and-ownership.md)           | 分层、所有权与公开入口       | Accepted |
| [ADR-0002](0002-route-mode-dispatch.md)              | Route Mode 分发              | Accepted |
| [ADR-0003](0003-service-and-explicit-mock-export.md) | Service 边界与显式 Mock 导出 | Accepted |
| [ADR-0004](0004-state-ownership.md)                  | 状态所有权                   | Accepted |
| [ADR-0005](0005-pwa-cache-boundary.md)               | PWA 缓存边界                 | Accepted |

## 维护规则

- ADR 解释为什么作出决策，不承担代码教程或执行计划的职责。
- Accepted ADR 的结论不直接改写。决策改变时新增 ADR，并更新双方的
  `Supersedes` 和 `Superseded by`。
- ADR 与当前架构不一致时，先把差异视为架构漂移并明确处理，不使用
  `docs/archive` 中的历史内容仲裁。
