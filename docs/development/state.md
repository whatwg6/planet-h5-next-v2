# 状态归属指南

先按生命周期、可恢复性和所有权选择状态容器，不以“多个组件会用”作为进入全局 Store 的充分理由。

## 选择表

| 问题                                  | 放置位置                   | 示例                        |
| ------------------------------------- | -------------------------- | --------------------------- |
| 需要分享、收藏或刷新恢复吗？          | Path 参数或 Search Params  | 资源 ID、分页、稳定筛选条件 |
| 只是同一路径下的短期页面模式吗？      | `location.state.routeMode` | edit、preview、select       |
| 来源是后端吗？                        | TanStack Query             | 列表、详情、请求状态        |
| 与后端无关且确需跨页面/组件树共享吗？ | Zustand                    | 临时草稿、筛选器编辑态      |
| 只影响当前组件或局部组件树吗？        | React State / Reducer      | 展开、输入、局部步骤        |

## URL State

Path 参数用于资源身份和层级；Search Params 用于可分享的排序、分页、筛选和视图选项。

- URL 是可恢复状态的来源，不再复制一份“当前筛选”到 Zustand。
- 解析 URL 时提供类型校验和安全默认值。
- 敏感信息不得出现在 URL。

## History State 与 Route Mode

`location.state` 只用于当前浏览历史条目携带的轻量导航上下文。

- 缺少 `routeMode` 时 Route 必须进入默认 View。
- View 不负责判断 Mode；分发留在 `pages/*Route.ts`。
- 刷新、直接输入 URL 或外部入口可能丢失 State，因此需要深链的状态不能放这里。
- 不保存接口响应、大型表单、文件或敏感凭据。

使用方式和验证见 [route.md](route.md)。

## 服务端状态

以下内容全部由 TanStack Query 所有：

- Loading、Error 和成功状态。
- 响应数据与缓存。
- 重试、取消和请求去重。
- 缓存更新与失效。

Zustand 不保存服务端数据副本，也不承担 Query 缓存的持久化职责。

## Zustand

只有状态超出合理的局部组件树，并且不属于 URL 或服务端状态时才建立 Store。

- Store 放在拥有该状态的 Feature 的 `store`。
- State 与 Action 类型明确，选择器尽量只订阅所需切片。
- 定义清理时机；离开流程后不应长期保留过期草稿。
- 不默认持久化到 Local Storage。需要持久化时先确认安全、版本迁移和退出清理策略。

## React 局部状态

表单输入、弹层开关、局部步骤、短期派生交互优先留在组件或最近的共同父级。可从 Props 或其他状态计算出的值不重复存储。

## 常见反模式

- Query 成功后用 Effect 把响应复制到 Zustand。
- 同一个筛选条件同时存在 URL、Store 和局部 State。
- 用 Route Mode 表达必须刷新恢复的页面。
- 为避免 Props 传递一两层就建立全局 Store。
- 在模块顶层保存可变单例状态，导致测试和会话泄漏。

决策背景见 [ADR-0004](../decisions/0004-state-ownership.md)。
