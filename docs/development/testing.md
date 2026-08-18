# 测试与验证指南

测试与改动风险匹配。先验证最小相关范围，再在跨层或交付前运行完整工程检查。

## 测试层级

| 被测能力                    | 工具                                  | 关注点                            |
| --------------------------- | ------------------------------------- | --------------------------------- |
| 纯函数、配置、错误、Store   | Vitest                                | 输入输出、边界和清理              |
| React 组件与 Hook           | React Testing Library + Vitest        | 用户可见行为和可访问性            |
| Service API                 | Vitest 替换 `httpClient`              | URL、Method、参数、响应与错误     |
| Query / Mutation            | 隔离 Query Client + 替换 Service 出口 | 请求状态、参数、缓存失效          |
| Route / Route Mode          | Router 测试或 Playwright              | 默认 View、Mode、回退与 History   |
| 关键浏览器流程与 PWA 元数据 | Playwright                            | Hash 路由、移动端浏览器、Manifest |

测试当前行为，不把历史计划中的覆盖清单当成已经实现的测试。

## 单元和组件测试

- 测试放在实现附近，测试基础设施放 `src/testing`。
- 每个测试独立创建 Query Client、Store 或 Router 状态。
- 使用用户可见的 Role、Label 和文本查找元素。
- 优先验证行为，不锁定内部函数、组件层级或 Tailwind 类名。
- 使用 Fake Timer 或模块 Mock 后必须恢复，避免污染后续用例。

## Service、Mock 与 Query

- Service 测试替换 `shared/api` 的 `httpClient`，不访问真实网络。
- Feature Query/Mutation 测试替换 Service 根公共出口，不深导入 Service 私有实现。
- `services/*/mocks` 可提供确定性数据，但不能依赖模块级可变状态。
- 测试结束后恢复所有 Mock，并清理 Query Cache。
- 显式 Service Mock 出口是开发装配选择，不等同于测试框架的用例级 Mock。

## E2E

只把跨层且浏览器行为重要的流程放入 E2E，例如：

- 应用可启动。
- Hash URL 可直接进入并在刷新后恢复。
- 404 与路由错误边界。
- 关键 Route Mode 的 History 行为。
- Manifest 和需要真实浏览器环境的 PWA 行为。

用例必须能在隔离环境重复执行，不依赖个人账号、不可控线上数据或执行顺序。

## 当前工程命令

具体定义以 `package.json` 为准：

| 命令                   | 用途                                      |
| ---------------------- | ----------------------------------------- |
| `pnpm typecheck`       | TypeScript 检查                           |
| `pnpm lint`            | ESLint                                    |
| `pnpm format:check`    | 格式检查                                  |
| `pnpm test`            | 单元与组件测试                            |
| `pnpm build`           | 类型检查和生产构建                        |
| `pnpm storybook:build` | Storybook 构建                            |
| `pnpm test:e2e`        | Playwright E2E                            |
| `pnpm verify`          | Typecheck、Lint、格式、单元测试和应用构建 |

`pnpm verify` 当前不包含 Storybook 构建和 E2E；CI 会额外执行它们。脚本若发生变化，应更新本表或改为只链接 `package.json`。

## 完成标准

- 新行为有与风险相称的自动化测试。
- 受影响的最小测试已通过。
- 跨层变更运行 `pnpm verify`。
- 组件公共 API 变化验证 Storybook 构建。
- Route、部署路径或 PWA 变化运行相关 E2E。
- 无法执行的检查在交付说明中明确列出原因，不宣称已通过。
