# H5 管理系统架构设计

> 状态：草案，供架构评审使用。  
> 当前阶段只定义工程骨架和约束，不包含具体业务功能实现。

## 1. 设计目标

本项目是面向移动端的 H5 管理系统，目标是建立一套能够长期扩展、边界明确且适合多人协作的前端架构。

架构需要满足：

- 支持手机浏览器运行，并为未来 App WebView 接入保留边界。
- 使用业务 Feature 组织功能，避免按技术类型堆积所有业务代码。
- 路由配置与页面实现分离，并在 Route 中统一处理 `location.state` 模式分发。
- 使用独立 Services 层管理真实后端接口、后端类型和可替换 Mock。
- 区分服务端状态、客户端状态和组件局部状态。
- 建设项目内完整的自研移动端组件库。
- 支持安装为 PWA，但不缓存业务数据，也不支持离线写入。
- 具备类型检查、自动化测试、组件文档和持续集成能力。

## 2. 技术方案

| 领域 | 选型 |
| --- | --- |
| 运行环境 | Node.js 22 |
| 包管理器 | pnpm 10 |
| 开发语言 | TypeScript / TSX，开启严格模式 |
| 前端框架 | React |
| 构建工具 | Vite |
| 路由 | React Router，Hash 路由 |
| 服务端状态 | TanStack Query |
| 客户端状态 | Zustand |
| HTTP 请求 | Axios |
| 样式 | Tailwind CSS + CSS Variables |
| SVG 组件 | vite-plugin-svgr + SVGO，使用 `?react` 显式导入 |
| UI | 项目内自研组件库 |
| 组件文档 | Storybook |
| PWA | vite-plugin-pwa + Workbox |
| 单元与组件测试 | Vitest + React Testing Library |
| 接口 Mock | Service 出口显式替换实现 |
| 端到端测试 | Playwright |
| 代码质量 | ESLint + Prettier + TypeScript |
| 持续集成 | GitHub Actions |

暂不绑定具体的认证协议、后端响应格式、WebView SDK 和监控厂商。

## 3. 顶层架构

项目采用单向依赖：

```text
main -> app -> pages -> features -> services -> shared
         |       |          |
         |       |          `--------------------> shared
         |       `-------------------------------> shared
         `---------------------------------------> shared

testing -> app / pages / features / services / shared
```

箭头表示允许发生的源码依赖。

### 3.1 app

应用装配层，负责：

- 应用启动和根组件。
- 全局 Provider 组合。
- Query Client 配置。
- 路由实例创建。
- 全局异常捕获。
- PWA 生命周期接入。

`app` 可以依赖 `pages` 和 `shared`，但业务代码不得反向依赖 `app`。

### 3.2 pages

纯路由层，负责：

- URL 路径。
- 路由参数声明。
- 默认 View 与模式 View 的懒加载。
- 基于 `location.state.routeMode` 的页面分发。
- 鉴权、权限等路由元数据。
- 汇总并导出路由表。

`pages` 不放 JSX、请求、状态、业务组件或业务规则。页面 UI 由对应 Feature 的 `views` 提供。

### 3.3 features

业务功能层。每个 Feature 表示一个具体业务域或功能模块，例如 Users、Orders、Permissions。

Feature 可以包含：

- `views`：路由级页面组件。
- `queries`：服务端数据查询。
- `mutations`：服务端数据写入。
- `components`：Feature 专用业务组件。
- `hooks`：Feature 专用 Hook。
- `store`：Feature 客户端状态。
- `types.ts`：Feature 类型。
- `index.ts`：Feature 公共出口。

Feature 可以依赖对应的 Service 公共出口和 `shared`，不得直接创建 HTTP Client。
Feature 之间如需复用业务能力，只能依赖对方的 `index.ts` 公共出口，并保持单向、无循环依赖。

### 3.4 services

后端服务层，按真实后端服务组织，负责：

- 真实 API 函数。
- 后端请求和响应类型。
- 与真实 API 保持同一函数签名的 Mock。
- 在 Service 公共出口显式导出 Mock 或真实实现，不与运行环境绑定。

Service 不使用 React、TanStack Query 或 Zustand，只能依赖 `shared`。

### 3.5 shared

无具体业务归属的公共能力，包括：

- HTTP Client。
- 鉴权和权限契约。
- 环境配置。
- 统一错误模型。
- 通用 Hooks 和工具。
- 监控适配接口。
- PWA 基础能力。
- Route Mode 创建与分发能力。
- 自研基础组件库。
- 设计令牌、全局样式和静态资源。

`shared` 不得依赖 `services`、`features`、`pages` 或 `app`。

## 4. 推荐目录结构

`users` 仅用于演示业务 Feature 的组织方式。没有实际业务时不提前创建空业务目录。

```text
planet-h5-v2/
├── .github/
│   └── workflows/
│       └── ci.yml
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── docs/
│   ├── component-guidelines.md
│   └── feature-guidelines.md
├── e2e/
│   ├── app.spec.ts
│   ├── routing.spec.ts
│   └── pwa.spec.ts
├── public/
│   ├── icons/
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── icon-maskable-512.png
│   └── favicon.svg
├── src/
│   ├── app/
│   │   ├── bootstrap/
│   │   ├── providers/
│   │   ├── router/
│   │   └── App.tsx
│   ├── pages/
│   │   ├── user/
│   │   │   ├── userListRoute.ts
│   │   │   ├── userDetailRoute.ts
│   │   │   └── index.ts
│   │   ├── system/
│   │   │   ├── homeRoute.ts
│   │   │   ├── offlineRoute.ts
│   │   │   ├── notFoundRoute.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── features/
│   │   ├── users/
│   │   │   ├── views/
│   │   │   │   ├── UserListView.tsx
│   │   │   │   ├── UserCreateView.tsx
│   │   │   │   ├── UserDetailView.tsx
│   │   │   │   ├── UserDetailEditView.tsx
│   │   │   │   └── UserPermissionView.tsx
│   │   │   ├── queries/
│   │   │   ├── mutations/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── store/
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── system/
│   │   │   ├── views/
│   │   │   └── index.ts
│   │   └── pwa/
│   │       ├── components/
│   │       ├── hooks/
│   │       └── index.ts
│   ├── services/
│   │   ├── user-service/
│   │   │   ├── api/
│   │   │   │   ├── getUserList.ts
│   │   │   │   ├── getUserDetail.ts
│   │   │   │   └── index.ts
│   │   │   ├── mocks/
│   │   │   │   ├── getUserList.mock.ts
│   │   │   │   └── index.ts
│   │   │   ├── types/
│   │   │   │   ├── user.ts
│   │   │   │   ├── userList.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   └── order-service/
│   │       ├── api/
│   │       ├── mocks/
│   │       ├── types/
│   │       └── index.ts
│   ├── shared/
│   │   ├── api/
│   │   ├── assets/
│   │   │   ├── icons/
│   │   │   ├── images/
│   │   │   └── brand/
│   │   ├── auth/
│   │   ├── config/
│   │   ├── errors/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── monitoring/
│   │   ├── pwa/
│   │   ├── router/
│   │   │   ├── createModeRoute.tsx
│   │   │   ├── createRouteModeState.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   ├── styles/
│   │   ├── types/
│   │   └── ui/
│   ├── testing/
│   │   ├── fixtures/
│   │   ├── renderWithProviders.tsx
│   │   └── setupTests.ts
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env.example
├── eslint.config.js
├── index.html
├── package.json
├── playwright.config.ts
├── pnpm-lock.yaml
├── prettier.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
├── CONTRIBUTING.md
└── README.md
```

## 5. Pages 约定

Pages 按业务域分组：

```text
pages/
  user/
    userListRoute.ts
    userDetailRoute.ts
    index.ts
  index.ts
```

Route 文件负责路径、懒加载和 `location.state.routeMode` 模式分发，实际页面组件仍位于 Feature 的 `views`：

```ts
import { createModeRoute } from "@/shared/router";

export const userDetailRoute = createModeRoute({
  path: "/users/:userId",
  defaultView: async () => {
    const { UserDetailView } = await import(
      "@/features/users/views/UserDetailView"
    );
    return UserDetailView;
  },
  modes: {
    edit: async () => {
      const { UserDetailEditView } = await import(
        "@/features/users/views/UserDetailEditView"
      );
      return UserDetailEditView;
    },
    permission: async () => {
      const { UserPermissionView } = await import(
        "@/features/users/views/UserPermissionView"
      );
      return UserPermissionView;
    },
  },
});
```

统一分发规则：

- `location.state` 不存在或没有 `routeMode` 时渲染 `defaultView`。
- `routeMode` 命中 `modes` 时渲染对应 View。
- 未知 `routeMode` 回退到 `defaultView`，并在开发环境发出警告。
- 同路径模式切换默认通过 History Push 完成，浏览器返回可恢复上一个模式。
- `location.state` 只保存轻量导航状态，不保存接口数据或大型表单。

模式跳转统一使用：

```ts
navigate(".", {
  state: createRouteModeState("edit"),
});
```

约束：

- 文件名采用 `<pageName>Route.ts`。
- Route 文件使用 `.ts`，不使用 `.tsx`。
- Route 文件不得包含 JSX。
- Route 中可以声明默认 View、模式 View 和路由元数据，但不得发请求或实现业务规则。
- Route View 必须位于 `features/<domain>/views`。
- `pages/<domain>/index.ts` 汇总本业务域路由。
- `pages/index.ts` 是应用路由的统一出口。

## 6. Feature 约定

以 Users 为例：

```text
features/users/
├── views/
│   ├── UserListView.tsx
│   ├── UserCreateView.tsx
│   ├── UserDetailView.tsx
│   ├── UserDetailEditView.tsx
│   └── UserPermissionView.tsx
├── queries/
│   ├── userQueryKeys.ts
│   ├── useUserListQuery.ts
│   ├── useUserDetailQuery.ts
│   └── index.ts
├── mutations/
│   ├── useCreateUserMutation.ts
│   ├── useUpdateUserMutation.ts
│   ├── useDeleteUserMutation.ts
│   └── index.ts
├── components/
│   ├── UserListItem.tsx
│   ├── UserForm.tsx
│   └── index.ts
├── hooks/
│   ├── useUserPermission.ts
│   └── index.ts
├── store/
│   ├── userFilterStore.ts
│   ├── userDraftStore.ts
│   └── index.ts
├── types.ts
└── index.ts
```

Feature 内部推荐依赖方向：

```text
views
  |--> queries
  |--> mutations
  |--> components
  `--> store

mutations --> queries/userQueryKeys
queries / mutations --> services
queries / mutations / components / hooks / store --> shared
```

约束：

- `views` 负责页面组合，不直接创建 Axios 实例。
- `queries` 使用 TanStack Query 管理读取、缓存和请求状态。
- `mutations` 管理写入、乐观更新或缓存失效。
- `queries` 和 `mutations` 只能通过 Service 公共出口调用后端。
- `components` 只放本 Feature 的业务组件。
- `store` 只保存筛选条件、草稿和临时交互状态。
- 服务端返回的数据不得复制进 Zustand。
- `types.ts` 只保存前端独有的状态、表单和 Props 类型；后端类型归所属 Service。
- Feature 对外能力通过 `index.ts` 暴露。
- 禁止访问其他 Feature 的私有文件。

## 7. Hook 归属规则

Hook 的归属由语义决定，而不是由复用次数决定。

### 通用技术 Hook

不包含业务概念的 Hook 放入 `shared/hooks`：

```text
shared/hooks/
  useDebounce.ts
  useMediaQuery.ts
  useOnlineStatus.ts
```

### 业务 Hook

属于具体业务域的 Hook 留在所属 Feature：

```text
features/users/hooks/useUserPermission.ts
```

其他 Feature 如需使用，只能通过所属 Feature 的公共出口导入，并保持单向依赖、禁止循环依赖。

### Query 和 Mutation Hook

即使被多个模块使用，也继续留在拥有该数据的 Feature 的 `queries` 或 `mutations` 中，不移动到 `shared/hooks`。

## 8. 状态管理

### URL 状态

由 React Router 管理：

- 路径参数。
- Search Params。
- 可分享、可刷新恢复的页面状态。

### History State

由每个 Route 通过 `location.state.routeMode` 管理同一 URL 下的页面模式：

- 没有 State 时进入该 Route 的默认 View。
- Edit、Preview、Select 等非深链页面可作为 Route Mode。
- 需要分享或从外部直接进入的状态不得放入 `location.state`，应使用路径参数或 Search Params。
- View 不负责分发 Mode；分发规则集中在对应 `pages/*/*Route.ts`。

### 服务端状态

由 TanStack Query 管理：

- 请求状态。
- 数据缓存。
- 重试和取消。
- 缓存失效。
- 并发请求去重。

### 客户端状态

由 Zustand 管理：

- 跨页面临时草稿。
- 筛选器编辑态。
- 与服务端无关的交互状态。

### 组件状态

仅影响单个组件或局部组件树的状态使用 React 自身状态，不进入 Zustand。

## 9. HTTP、Services 与 Mock

`shared/api/httpClient.ts` 是 Axios 的唯一直接封装位置，负责：

- Base URL。
- 超时。
- 请求取消。
- 请求标识。
- 公共请求头。
- 错误归一。

业务代码不得创建新的 Axios 实例。

统一错误类型 `AppError` 至少区分：

- Network。
- Timeout。
- Unauthorized。
- Forbidden。
- Server。
- Cancelled。
- Unknown。

Token 刷新、退出登录等行为等待真实认证协议确定后再实现，不在架构阶段推测。

### 9.1 Service 结构

每个目录对应一个真实后端服务：

```text
services/user-service/
├── api/
│   ├── getUserList.ts
│   ├── getUserDetail.ts
│   └── index.ts
├── mocks/
│   ├── getUserList.mock.ts
│   └── index.ts
├── types/
│   ├── user.ts
│   ├── userList.ts
│   └── index.ts
└── index.ts
```

职责：

- `api`：真实 URL、请求参数和 HTTP 调用。
- `mocks`：仅为明确需要 Mock 的接口提供替代实现。
- `types`：后端服务直接使用的请求、响应和实体类型，不使用 DTO 后缀。
- Service 根 `index.ts`：公共出口，并决定导出真实实现还是 Mock 实现。

Service 不使用 React、TanStack Query 或 Zustand。Feature 不得直接调用 `httpClient`。

### 9.2 Mock 选择

真实 API 与 Mock 必须共享同一个函数类型：

```ts
// services/user-service/index.ts
export { getUserDetailApi } from "./api";
export { getUserListMock as getUserListApi } from "./mocks";
export type * from "./types";
```

恢复真实实现时只调整公共出口：

```ts
// services/user-service/index.ts
export { getUserDetailApi, getUserListApi } from "./api";
export type * from "./types";
```

约束：

- 只给需要 Mock 的接口增加 `.mock.ts`。
- 没有 Mock 的接口始终使用真实后端。
- 是否使用 Mock 由 Service 公共出口显式决定，与 Dev、Test 或 Production 环境无关。
- Mock 文件不得产生模块级副作用。
- Feature 始终从 `services/<service>/index.ts` 导入，不感知当前实现。
- 真实 API 使用 `getUserListApi`，Mock 使用 `getUserListMock`；对外始终导出为 `getUserListApi`。
- React Query Hook 使用 `useUserListQuery`，避免与 Service API 混淆。

## 10. 自研组件库

自研组件位于 `shared/ui`，按能力分类：

```text
shared/ui/
├── base/
├── layout/
├── navigation/
├── form/
├── display/
├── feedback/
├── overlay/
├── interaction/
└── index.ts
```

计划覆盖：

- 基础：Icon、Divider、Portal。
- 布局：Page、SafeArea、Card、Cell、List、Collapse。
- 导航：NavBar、Tabs、TabBar。
- 表单：Button、Input、Textarea、SearchInput、FormField、Checkbox、Radio、Switch、Stepper、Select、Picker、Cascader、DatePicker、Uploader。
- 展示：Badge、Tag、Avatar、Tree、Progress。
- 反馈：Loading、Skeleton、EmptyState、ErrorState、Result、Toast。
- 弹层：Popup、Dialog、ActionSheet、Drawer、Popover、ImagePreview。
- 交互：InfiniteScroll、PullRefresh、SwipeAction。

每个组件使用统一结构：

```text
Button/
  Button.tsx
  Button.test.tsx
  Button.stories.tsx
  types.ts
  index.ts
```

组件约束：

- 表单组件采用 `value/onChange`。
- 弹层组件采用 `open/onOpenChange`。
- 视觉值来自语义化 CSS Variables。
- 不直接硬编码品牌色、阴影和层级。
- 支持必要的 ARIA 属性和键盘操作。
- 最小触控区域为 44 × 44 CSS 像素。
- 支持 `prefers-reduced-motion`。
- 不引入第三方 UI 组件库。

Storybook 用于组件示例、状态矩阵、交互测试、无障碍检查和视觉快照。

## 11. 样式与移动端适配

- 使用 Tailwind CSS 编写布局和组件样式。
- 使用 CSS Variables 定义颜色、字号、间距、圆角、阴影和层级。
- 首版只提供一套亮色主题，但令牌允许整体替换。
- 使用 CSS 像素和响应式布局，不做全局 rem/vw 等比缩放。
- 使用 `100dvh` 处理动态视口高度。
- 使用 `env(safe-area-inset-*)` 适配安全区域。
- 只面向最新主流 iOS 和 Android 浏览器。

## 12. public、assets 与 SVG

`public` 存放必须保持固定文件名和 URL 的资源，例如：

- PWA 图标。
- Maskable 图标。
- favicon。

这些文件不经过 Vite 的模块处理，会被原样复制到构建产物。

普通业务资源放在 `src/shared/assets`，通过 TypeScript 导入，使其参与压缩、哈希和依赖分析：

```text
shared/assets/
├── icons/       # 单色、可跟随文本颜色的 SVG 图标
│   ├── add.svg
│   └── index.ts
├── images/      # 插画和普通图片
└── brand/       # Logo 等需要保留自身颜色的品牌资源
```

### 12.1 SVG React Component

使用 `vite-plugin-svgr` 将 SVG 显式转换成 React Component。只有带 `?react` 的导入才转换，普通 `.svg` 导入仍返回资源 URL：

```ts
import AddIcon from "@/shared/assets/icons/add.svg?react";
import emptyImageUrl from "@/shared/assets/images/empty.svg";
```

图标目录通过公共出口统一导出：

```ts
// shared/assets/icons/index.ts
export { default as AddIcon } from "./add.svg?react";
```

```tsx
import { AddIcon } from "@/shared/assets/icons";

<AddIcon aria-hidden className="size-5 text-current" />;
```

TypeScript 在 `vite-env.d.ts` 中加载插件声明：

```ts
/// <reference types="vite-plugin-svgr/client" />
```

Vite 配置只处理带 `?react` 的 SVG，并保留 `viewBox`：

```ts
import svgr from "vite-plugin-svgr";

svgr({
  include: "**/*.svg?react",
  svgrOptions: {
    icon: true,
    plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
    svgoConfig: {
      plugins: [
        {
          name: "preset-default",
          params: {
            overrides: {
              removeViewBox: false,
            },
          },
        },
      ],
    },
  },
});
```

工程依赖需包含 `vite-plugin-svgr`、`@svgr/plugin-svgo` 和 `@svgr/plugin-jsx`。

SVG 约束：

- `shared/assets/icons` 只放单色图标，源码使用 `currentColor` 控制 `fill` 或 `stroke`。
- 多色插画和品牌图形不得强制改写颜色，放在 `images` 或 `brand` 并按 URL 使用。
- 图标文件使用 kebab-case 命名。
- 不在构建阶段无差别删除所有 `fill`、`stroke`，避免破坏描边图标和多色资源。
- 纯装饰图标使用 `aria-hidden`；表达独立含义的图标必须提供可访问名称。

`public` 中的文件会被直接公开，禁止存放密钥或其他敏感信息。

## 13. PWA 策略

项目支持安装为 PWA，但不是离线业务应用。

- 使用 `vite-plugin-pwa` 和 Workbox。
- Manifest 使用相对 Scope 和 Hash 启动地址。
- 使用 Standalone 显示模式。
- 预缓存应用壳、构建资源、字体、图标和离线页面。
- API 请求和业务数据使用 Network Only。
- 不缓存写请求。
- 不设计离线写入、后台同步和冲突解决。
- 新版本可用时提示用户确认刷新，避免丢失编辑内容。
- Service Worker 默认只在生产构建启用。
- App WebView 内仍按普通 H5 运行，不假设 WebView 支持 PWA 安装。

## 14. 测试策略

### 单元测试

使用 Vitest，覆盖：

- 通用函数。
- 配置校验。
- 错误归一。
- 权限判断。
- Store 行为。

### 组件测试

使用 React Testing Library，覆盖：

- 用户可见行为。
- 交互状态。
- 表单状态。
- 异常和空状态。
- 无障碍属性。

### Service 测试与 Mock

- 真实 Service API 使用 Vitest Mock 替换 `httpClient`，验证 URL、参数和错误传递。
- Feature Query/Mutation 测试使用 Vitest 替换 Service 公共出口，不访问真实后端。
- `services/*/mocks` 可以复用于需要固定数据的组件和页面测试。
- 测试结束后必须恢复所有 Mock，避免用例之间共享状态。

### 端到端测试

使用 Playwright 的移动端 Chromium 和 WebKit 配置，验证：

- 应用启动。
- Hash 路由和刷新。
- 页面懒加载。
- 404 和全局异常。
- PWA Manifest 和 Service Worker。
- 离线应用壳。
- 版本更新提示。

## 15. 工程脚本

项目至少提供：

```text
pnpm dev
pnpm build
pnpm typecheck
pnpm lint
pnpm format
pnpm format:check
pnpm test
pnpm test:e2e
pnpm storybook
pnpm storybook:build
pnpm verify
```

`verify` 应组合类型检查、Lint、格式检查、单元测试和生产构建。

## 16. CI

GitHub Actions 在 Pull Request 和主分支提交时执行：

1. 使用锁定的 Node.js 和 pnpm 版本。
2. `pnpm install --frozen-lockfile`。
3. TypeScript 类型检查。
4. ESLint 和格式检查。
5. 单元与组件测试。
6. 应用生产构建。
7. Storybook 构建。
8. Playwright 冒烟测试。

## 17. 明确不在当前阶段实现的内容

- 具体业务模块。
- 真实后端接口。
- 认证和 Token 刷新协议。
- WebView Bridge 或厂商 SDK。
- 监控厂商接入。
- SSR 和 SEO。
- 暗色主题和多品牌主题。
- 业务数据离线缓存。
- 离线写入、后台同步和冲突处理。

以上能力在需求和真实协议明确后，通过既有边界逐步接入，不在基础架构中提前推测。
