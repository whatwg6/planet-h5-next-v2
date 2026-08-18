# ADR-0001：分层、所有权与公开入口

- Status: Accepted
- Date: 2026-08-18
- Supersedes: —
- Superseded by: —

## Context

路由、业务实现、后端接入和公共基础设施需要各自稳定的所有者。同时，
应用装配需要使用少量必须全局挂载的能力，Route 需要保持逐 View 懒加载，业务
Feature 之间也可能复用有明确业务归属的能力。单纯要求所有调用都经过同一
层级根出口，无法同时准确表达这些需求。

## Decision

生产代码采用 `main`、`app`、`pages`、`features`、`services`、`shared`
分层，依赖只从上层指向允许的下层：

- `app` 可以依赖 `pages`、`shared` 和必须在 App 生命周期全局挂载的
  Feature，但使用 Feature 时必须经过该 Feature 的根公共出口。
- `pages` 只声明和分发路由。为保持逐 View 懒加载，Route 可以直接导入
  它所声明的所属 Feature View。这是 Pages 深入 Feature 子路径的唯一
  例外；Query、Mutation、Component、Hook 和 Store 均不可深导入。
- Feature 复用另一个 Feature 的业务能力时，只能通过提供方的根
  `index.ts`。Feature 间依赖必须构成有向无环图。
- Feature 通过 Service 根出口访问后端；Service 只能依赖 `shared`。
- `shared` 不包含具体业务语义，也不依赖任何上层。
- 测试代码可以依赖被测生产层，生产代码不得依赖测试代码。

目录按真实需要创建，不为匹配模板提前创建空层或空 Feature。

## Consequences

- 每项能力都有明确所有者，跨域复用不会把业务语义扩散到 `shared`。
- Pages 的狭窄例外保留明确的逐 View 动态导入边界，同时不开放 Feature
  的其他内部模块。
- Feature 公共出口成为需要维护的契约；新增跨 Feature 依赖前必须检查
  方向和循环。
- 出现双向 Feature 依赖时，必须重新划分所有权或提取真正无业务语义的
  公共能力。

## Alternatives considered

- **所有 Feature 子模块都经根 Barrel 导出**：可能把多个路由入口聚合到
  同一动态模块，不采用为 Pages 的唯一规则。
- **完全禁止 Feature 间依赖**：会迫使有明确所有者的业务能力被复制或
  错误下沉到 `shared`。
- **由 Pages 承载页面实现**：会混合路由声明和业务实现。
