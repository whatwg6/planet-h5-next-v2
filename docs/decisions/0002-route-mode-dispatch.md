# ADR-0002：Route Mode 分发

- Status: Accepted
- Date: 2026-08-18
- Supersedes: —
- Superseded by: —

## Context

移动端管理页面经常需要在同一路径内切换查看、编辑、选择等短期模式。
这些模式不一定需要独立可分享 URL，但必须有统一的默认行为，并能配合浏览器
返回操作。

## Decision

- 项目使用 Hash Router。
- 每个 `<pageName>Route.ts` 声明 Path、默认 View 和可选的 Mode View；模式
  分发发生在 Route，不发生在 View。
- `location.state` 不存在或没有 `routeMode` 时渲染默认 View。
- `routeMode` 命中 Route 声明时渲染对应 View；未知值回退默认 View，
  开发环境可以发出警告。
- 同一路径内的模式切换默认使用 History Push，使返回操作恢复上一模式。
- History State 只保存轻量、短生命周期且不要求刷新恢复的导航状态。
  需要分享、书签或刷新恢复的状态使用 Path 参数或 Search Params。
- 接口数据和大型表单不得存入 History State。

## Consequences

- 无导航 State 的入口始终有稳定的默认页面。
- 短期模式无需扩充 URL 层级，且可以进入浏览历史。
- `routeMode` 在刷新或外部直达时不可依赖；需要持久语义的模式必须进入
  URL。
- Route 需要覆盖无 State、已知 Mode 和未知 Mode 的分发测试。

## Alternatives considered

- **每个短期模式使用独立 URL**：会把仅与当前导航相关的交互状态暴露为
  可深链路由。
- **在 View 内读取 State 并自行分发**：会让每个页面重复路由规则并混合
  路由与业务职责。
- **使用全局 Store 保存当前模式**：无法自然配合浏览历史，也会让路由状态
  脱离 Route 所有权。
