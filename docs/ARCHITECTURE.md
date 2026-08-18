# H5 管理系统架构

> 状态：当前生效
> 本文只记录长期有效的架构边界，不包含完整目录模板、代码教程、组件清单或阶段计划。

## 1. 文档职责

本项目是面向移动端的 H5 管理系统工程基线。架构目标是让路由、业务能力、后端接入和公共基础设施拥有清晰的归属，并允许系统在真实需求出现后逐步扩展。

本文规定新增和修改代码时必须遵守的边界。代码、配置和测试描述当前实现；某个示例目录尚不存在，不代表需要提前创建。具体做法见 [开发指南](development/README.md)，决策背景见 [架构决策记录](decisions/README.md)。

## 2. 技术基线

- React + Vite。
- 严格 TypeScript/TSX；编译选项以仓库内 `tsconfig*` 为准。
- pnpm；Node.js 与 pnpm 版本以 `package.json` 为准。
- React Router Hash Router。
- TanStack Query 管理服务端状态。
- Zustand 管理确有跨组件需要的临时客户端状态。
- Axios，由项目唯一的 HTTP Client 封装。
- Tailwind CSS + CSS Variables。
- 项目内自研 UI 组件库与 Storybook。
- Vitest、React Testing Library 和 Playwright。
- vite-plugin-pwa + Workbox，提供可安装能力。

依赖版本、脚本和 CI 步骤属于实现配置，不在本文重复维护。

## 3. 分层与依赖方向

生产代码只允许从上层指向下层。上层可以跳过中间层使用允许的下层能力，但下层不得反向依赖上层。

| 来源              | 允许依赖                                                          | 说明                       |
| ----------------- | ----------------------------------------------------------------- | -------------------------- |
| `main`            | `app`、全局样式                                                   | 只负责启动应用             |
| `app`             | `pages`、必须在 App 生命周期全局挂载的 Feature 公共出口、`shared` | 只做应用装配               |
| `pages`           | 所属 Feature 的路由 View、`shared`                                | 只做路由声明和分发         |
| `features`        | `services`、`shared`、其他 Feature 公共出口                       | Feature 间必须单向且无循环 |
| `services`        | `shared`                                                          | 不依赖 React 状态层        |
| `shared`          | `shared` 内部                                                     | 不含具体业务语义           |
| `testing` / `e2e` | 被测生产层                                                        | 生产代码不得依赖测试代码   |

允许存在 `Feature A -> Feature B/index.ts`，但依赖关系必须是有向无环图。若两个 Feature 互相依赖，应重新划分所有权或把真正无业务语义的能力下沉到 `shared`。

决策背景见 [ADR-0001](decisions/0001-layering-and-ownership.md)。

## 4. 各层职责

### 4.1 main

`src/main.tsx` 是浏览器入口，只加载全局样式并调用应用挂载能力。它不声明 Provider、路由或业务逻辑。

### 4.2 app

`app` 是应用装配层，负责：

- 根组件与挂载流程。
- 全局 Provider。
- Query Client。
- Router 实例。
- 全局和路由级异常边界。
- 需要全局挂载的能力，例如 PWA 更新提示。

`app` 使用 Feature 时必须经过该 Feature 的根公共出口，不实现具体业务规则。

### 4.3 pages

`pages` 是纯路由层，负责：

- URL Path 和参数。
- 默认 View 与 Mode View 的懒加载声明。
- 基于 `location.state.routeMode` 的 View 分发。
- 按业务域汇总并导出路由表。

Route 文件使用 `<pageName>Route.ts` 命名，不写 JSX，不请求数据，不持有 Store，不实现业务规则。实际页面 UI 位于 `features/<domain>/views`。

为保持逐 View 懒加载，Route 可以直接导入它所声明的 `features/<owner>/views/<View>`。这是 Pages 深入 Feature 子路径的唯一例外；Pages 不得直接导入 Feature 的 Query、Mutation、Component、Hook 或 Store。

### 4.4 features

`features` 按真实业务能力组织代码。一个 Feature 可按需包含：

- `views`：路由级页面组合。
- `queries`：服务端读取与缓存。
- `mutations`：服务端写入与缓存协调。
- `components`：该 Feature 私有的业务组件。
- `hooks`：该业务域拥有的 Hook。
- `store`：临时客户端状态。
- `types.ts`：前端独有的表单、展示和交互类型。
- `index.ts`：公共出口。

这些目录不是必须同时存在，不为对齐模板创建空目录。

Feature 对 Feature 的复用只能通过提供方根 `index.ts`。Hook 的归属由语义决定，而不是复用次数决定；带业务语义的 Hook 即使被多个 Feature 使用，也留在所属 Feature。

### 4.5 services

`services` 按真实后端服务边界组织，负责：

- `api`：URL、请求参数和 HTTP 调用。
- `types`：后端请求、响应和实体类型。
- `mocks`：仅针对明确需要替代的接口。
- 根 `index.ts`：Service 唯一公共出口，并显式选择真实或 Mock 实现。

Service 不使用 React、TanStack Query 或 Zustand。Feature 不得绕过 Service 直接调用 `httpClient`。后端类型直接由 Service 提供，不创建只为改名存在的 DTO 副本，也不使用 `Dto` 后缀。

没有真实后端边界时不创建占位 Service。

### 4.6 shared

`shared` 只承载无具体业务归属的公共能力，例如：

- HTTP Client、统一错误、环境配置。
- 认证和权限契约、监控适配接口。
- 通用 Hook 和工具。
- Router 基础能力。
- 基础 UI、样式令牌和静态资源。

`shared` 不得依赖 `services`、`features`、`pages` 或 `app`。不能仅因为两个 Feature 都使用某段业务逻辑，就把它移入 `shared`。

## 5. 路由模式

项目使用 Hash Router。每个 Route 由自己的 Route 文件声明默认 View 和可选 Mode View，分发发生在 Route 中，不发生在 View 中。

- `location.state` 不存在或没有 `routeMode`：渲染默认 View。
- `routeMode` 命中 Route 声明的模式：渲染对应 View。
- 未知 `routeMode`：回退默认 View；开发环境可发出警告。
- 同一路径内切换 Mode 默认使用 History Push，使浏览器返回可恢复上一模式。

`location.state` 只保存轻量、短生命周期且不要求刷新恢复的导航状态。需要分享、书签或刷新恢复的状态必须使用 Path 参数或 Search Params；接口数据和大型表单不得放入 History State。

详见 [Route 开发指南](development/route.md) 和 [ADR-0002](decisions/0002-route-mode-dispatch.md)。

## 6. 数据与状态所有权

| 状态           | 唯一所有者     | 典型内容                             |
| -------------- | -------------- | ------------------------------------ |
| URL            | React Router   | Path 参数、Search Params、可分享状态 |
| History State  | 对应 Route     | `routeMode` 等短期导航状态           |
| 服务端状态     | TanStack Query | 请求状态、响应缓存、失效与重试       |
| 客户端共享状态 | Zustand        | 临时草稿、筛选编辑态、纯交互状态     |
| 局部状态       | React          | 单个组件或局部组件树状态             |

服务端响应不得为了展示或跨组件访问而复制进 Zustand。Query 和 Mutation 属于数据所属 Feature；即使被多个调用方使用，也不移入 `shared/hooks`。

详见 [状态指南](development/state.md)、[Query 指南](development/query.md) 和 [ADR-0004](decisions/0004-state-ownership.md)。

## 7. HTTP、Service 与 Mock

`shared/api/httpClient.ts` 是 Axios 的唯一实例和公共传输层封装位置。它负责公共配置、请求标识和错误归一，并保留标准取消能力。认证刷新等协议只在真实协议明确后接入。

Feature 只能调用 Service 根出口。真实 API 与 Mock 必须保持同一函数签名；是否使用 Mock 由 Service 根 `index.ts` 的显式别名导出决定，与 Dev、Test 或 Production 环境无关。

只为明确需要 Mock 的接口创建 `.mock.ts`，不得建立全局 Mock 开关、顶层 `mocks` 目录或 MSW 层。Mock 不得产生模块级副作用。

详见 [Service 指南](development/service.md)、[Mock 指南](development/mock.md) 和 [ADR-0003](decisions/0003-service-and-explicit-mock-export.md)。

## 8. UI、样式与资源

- 无业务语义的基础组件位于 `shared/ui`；业务组件位于所属 Feature 的 `components`。
- 通用组件通过公共出口使用，API 和无障碍要求见 [组件指南](development/component.md)。
- 布局使用 Tailwind CSS，视觉值优先来自语义化 CSS Variables。
- H5 布局使用动态视口和安全区能力；交互目标至少为 44 × 44 CSS 像素，并尊重 `prefers-reduced-motion`。
- `public` 只存放必须保留固定 URL 的文件，例如 favicon 和 PWA 图标。
- 普通资源位于 `src/shared/assets`，通过模块导入参与哈希和依赖分析。
- 单色 SVG 图标使用 `currentColor` 并以 `?react` 显式转换；多色插画和品牌资源按 URL 使用。

详见 [资源指南](development/asset.md)。

## 9. PWA 边界

项目提供可安装 PWA，但不是离线业务应用。

- Manifest 与 Workbox 构建配置归根 `vite.config.ts`。
- React 注册、更新生命周期和更新提示归 `features/pwa`；`app` 只负责全局挂载。
- 只有不含 PWA 产品语义的通用浏览器 Hook 才进入 `shared`。
- 生产构建可预缓存应用构建资源和安装所需静态资源。
- API 和业务数据不得进入 Service Worker 缓存；显式 API 规则使用 Network Only。
- 不实现离线写入、后台同步或冲突解决。
- 新版本由用户确认后刷新，避免丢失编辑内容。
- App WebView 中按普通 H5 运行，不假设支持 PWA 安装。

离线说明页面不等同于自动断网跳转。具体缓存和验证要求见 [PWA 指南](development/pwa.md) 与 [ADR-0005](decisions/0005-pwa-cache-boundary.md)。

## 10. 架构演进

- 新增代码前先确认业务所有者和依赖方向，不从历史目录模板复制空结构。
- 只改变实现方法时，更新对应开发指南。
- 改变本文的不变量时，同步更新本文并新增 ADR；已接受 ADR 不直接改写结论。
- 发现实现与本文冲突时，明确记录差异并决定修复实现或更新决策，不得以归档内容代替判断。
- `docs/archive` 是不可变历史快照，不参与当前规则维护。
