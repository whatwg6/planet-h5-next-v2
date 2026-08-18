# Route 开发指南

Route 负责 URL 与 View 的映射，也负责同一路径下基于 `location.state.routeMode` 的页面分发。页面实现属于 Feature。

## 文件归属

```text
src/pages/<domain>/
├── <pageName>Route.ts
└── index.ts
```

- 文件名必须以 `Route.ts` 结尾。
- Route 文件使用 `.ts`，不得写 JSX。
- `pages/<domain>/index.ts` 汇总该域 Route；`pages/index.ts` 汇总应用路由表。
- Route 可以声明 Path、参数、懒加载 View 和 Mode。
- Route 不得请求数据、访问 Store、实现表单或承载业务规则。

## 声明默认 View 和 Mode View

使用 `shared/router` 的 `createModeRoute`：

```ts
import { createModeRoute } from "@/shared/router";

export const userDetailRoute = createModeRoute({
  path: "/users/:userId",
  defaultView: async () => {
    const { UserDetailView } = await import("@/features/users/views/UserDetailView");
    return UserDetailView;
  },
  modes: {
    edit: async () => {
      const { UserDetailEditView } = await import("@/features/users/views/UserDetailEditView");
      return UserDetailEditView;
    },
  },
});
```

Route 可以直接 lazy-import 它所声明的 `features/<owner>/views/<View>`，以保持逐 View 拆包。这是 Pages 深入 Feature 子路径的唯一例外。不得从 Route 直接导入该 Feature 的 Query、Mutation、Component、Hook 或 Store。

View 文件因此是公开的路由入口，但不会自动成为普通业务复用入口；Feature 间复用仍须经过提供方根 `index.ts`。

## 分发规则

- 没有 `location.state` 或没有 `routeMode` 时，进入 `defaultView`。
- `routeMode` 命中 `modes` 时，进入对应 View。
- 未知 Mode 回退 `defaultView`；当前基础能力会在开发环境输出警告。
- View 负责页面组合，不再二次判断 Mode。

同一路径内切换使用统一 State 创建函数：

```ts
import { createRouteModeState } from "@/shared/router";

navigate(".", {
  state: createRouteModeState("edit"),
});
```

默认使用 History Push。只有明确希望替换当前历史记录时才传 `replace: true`。

## 什么时候不用 Route Mode

以下状态必须使用 Path 参数或 Search Params，而不是 `location.state`：

- 需要复制链接或分享。
- 刷新后必须恢复。
- 外部入口需要直接到达。
- 会影响服务端查询身份或长期筛选结果。

接口响应、大型表单和敏感数据不得放入 History State。

## 验证清单

- 无 State 时渲染默认 View。
- 每个已声明 Mode 都能渲染对应 View。
- 未知 Mode 安全回退。
- 浏览器返回能恢复上一模式。
- 刷新行为符合该状态是否需要持久化的产品语义。
- 新 Route 已加入业务域出口和应用路由表。

涉及 Mode 所有权时同时阅读 [state.md](state.md)；决策背景见 [ADR-0002](../decisions/0002-route-mode-dispatch.md)。
