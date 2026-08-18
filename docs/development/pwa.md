# PWA 开发指南

PWA 只提供安装、应用壳缓存和受控更新，不承担业务离线能力。

## 产品边界

- 生产构建生成 Manifest 和 Service Worker。
- Manifest 使用相对 Scope，并以 Hash 路由入口启动。
- 显示模式为 Standalone。
- 新版本采用 Prompt 更新策略，由用户确认后刷新。
- 开发环境默认不启用 Service Worker，避免缓存干扰日常调试。
- WebView 内按普通 H5 运行，不假设具备安装、Service Worker 或原生 Bridge 能力。

## 所有权

- Manifest、Workbox 和 Service Worker 生成配置位于根 `vite.config.ts`。
- React 注册、更新状态和更新提示属于 `features/pwa`。
- `app` 只从 PWA Feature 根出口挂载全局更新 UI。
- `shared` 只承载不含 PWA 产品语义的通用浏览器能力，例如通用在线状态 Hook。

## 缓存矩阵

| 请求或资源                           | 策略                                                  |
| ------------------------------------ | ----------------------------------------------------- |
| 构建产物、安装所需图标等应用静态资源 | 可预缓存                                              |
| API GET 与业务数据                   | 不进入 Service Worker 缓存；显式规则使用 Network Only |
| POST / PUT / PATCH / DELETE          | 不进入 Service Worker 缓存                            |
| 离线写入队列                         | 不提供                                                |
| 后台同步与冲突解决                   | 不提供                                                |

修改 `vite.config.ts` 的 Workbox 规则时，不得引入会保存业务响应的运行时缓存。当前显式 Network Only 规则匹配 `/api/` GET；若后端 API 使用其他路径或域名，接入时必须同步检查匹配范围。没有显式规则的 API 请求应继续走网络，不得增加缓存处理器。

## 更新体验

- 检测到新版本时显示非强制更新提示。
- 文案提醒用户先保存正在编辑的内容。
- 用户确认后调用更新能力并刷新。
- 不在有未保存表单时静默刷新页面。

更新 UI 属于 PWA Feature；Service Worker 注册和底层能力不应散落到业务 View。

## 离线说明页

项目可以提供 `/offline` 说明 Route，但这不表示网络断开时会自动跳转。若未来需要自动导航，必须单独定义触发条件、返回行为和测试，仍不得缓存业务数据。

## Manifest 与资源

- 图标等需要固定 URL 的安装资源放 `public`。
- `start_url`、`scope` 和构建 `base` 必须兼容实际部署子路径与 Hash Router。
- 图标尺寸、类型和 maskable purpose 与实际文件保持一致。
- 具体配置以 `vite.config.ts` 和部署工作流为准。

## 验证

- 生产构建成功生成 Manifest 和 Service Worker。
- 部署子路径下的 Manifest、图标和入口 URL 可访问。
- API 请求未出现在 Cache Storage 的业务缓存中。
- 更新提示允许稍后处理和用户确认刷新。
- 移动 Chromium/WebKit 的基础 Hash 路由行为正常。

开发环境无法完整代表生产 Service Worker 行为；需要验证缓存或更新时使用生产构建和隔离浏览器上下文。决策背景见 [ADR-0005](../decisions/0005-pwa-cache-boundary.md)。
