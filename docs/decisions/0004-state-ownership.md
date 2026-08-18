# ADR-0004：状态所有权

- Status: Accepted
- Date: 2026-08-18
- Supersedes: —
- Superseded by: —

## Context

路由、远端数据、跨组件交互和局部交互具有不同的生命周期与恢复要求。
若统一放入全局 Store，会复制缓存、模糊所有权，并增加状态同步问题。

## Decision

状态按语义和生命周期分配给唯一所有者：

| 状态                       | 所有者         | 用途                                 |
| -------------------------- | -------------- | ------------------------------------ |
| Path 参数、Search Params   | React Router   | 可分享、可书签、刷新可恢复的状态     |
| `location.state.routeMode` | 对应 Route     | 短期且不要求刷新恢复的导航模式       |
| 服务端状态                 | TanStack Query | 请求、响应缓存、重试、失效和并发协调 |
| 客户端共享状态             | Zustand        | 临时草稿、筛选编辑态和纯交互状态     |
| 局部状态                   | React          | 单个组件或局部组件树的交互状态       |

Query 和 Mutation 归数据所属 Feature。即使被多个 Feature 使用，也通过
所有者 Feature 的根公共出口复用，不移入 `shared/hooks`。服务端响应不得
为了展示或跨组件访问而复制进 Zustand。

## Consequences

- 每类状态拥有与其生命周期匹配的恢复、缓存和更新机制。
- 服务端数据只有一份缓存来源，避免 Query Cache 与 Zustand 双向同步。
- 状态从局部扩大为共享时需要重新判断语义，而不是默认升级为全局 Store。
- History State 天然不能作为刷新恢复或外部深链的依据。

## Alternatives considered

- **全部使用 Zustand**：会重复服务端缓存和路由状态，并引入同步问题。
- **全部编码到 URL**：不适合大型草稿和纯局部交互，也会产生噪声 URL。
- **把复用的业务 Query 放入 `shared/hooks`**：复用次数不能消除其业务
  所有权。
