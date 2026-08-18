# ADR-0005：PWA 缓存边界

- Status: Accepted
- Date: 2026-08-18
- Supersedes: —
- Superseded by: —

## Context

项目需要提供可安装体验，但管理系统的业务数据要求实时性，离线写入还会
引入同步、冲突和安全问题。可安装能力不应被等同为离线业务能力。

## Decision

- 使用 vite-plugin-pwa 和 Workbox 提供 Manifest 与生产 Service Worker。
- Manifest 和 Workbox 构建配置归根 `vite.config.ts`；React 注册、更新
  生命周期和更新提示归 `features/pwa`，由 `app` 负责全局挂载。
- 预缓存仅包含应用构建资源和安装所需静态资源，例如 JavaScript、CSS、
  字体和图标。离线说明 View 所需代码可作为应用构建资源预缓存，但它不是
  独立静态页面。
- 所有 API 响应和业务数据都不得进入 Service Worker 缓存；显式 API
  运行时规则使用 `NetworkOnly`，未被 Service Worker 处理的请求直接走网络。
- 不实现离线写入、后台同步或冲突解决。
- 新版本可用时提示用户确认刷新，避免自动刷新导致编辑内容丢失。
- App WebView 中按普通 H5 运行，不假设支持 PWA 安装。
- 离线说明 View 不代表断网时自动重定向业务导航。

## Consequences

- 用户可以安装并加载已缓存的应用静态壳，但业务功能仍需要网络。
- API 数据不会因 Service Worker 缓存而过期，也没有离线写入一致性问题。
- 断网状态必须由页面明确展示；不能承诺离线完成管理操作。
- 版本采用确认后刷新，更新速度与编辑安全之间选择了后者。

## Alternatives considered

- **对 API 使用 Cache First 或 Stale While Revalidate**：可能向管理页面提供
  过期业务数据。
- **离线优先并后台同步写入**：需要额外的队列、身份有效期、冲突解决和
  产品规则，超出本项目的 PWA 边界。
- **完全不提供 PWA**：无法满足安装到设备的体验目标。
