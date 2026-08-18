# ADR-0003：Service 边界与显式 Mock 导出

- Status: Accepted
- Date: 2026-08-18
- Supersedes: —
- Superseded by: —

## Context

后端接口、后端类型和开发期替代数据需要稳定边界。开发时只可能需要替换
少量接口；若按环境整体切换 Mock，会隐藏实际依赖并阻止真实接口与 Mock
接口同时使用。重复声明一套 DTO 类型也会产生无意义的同步成本。

## Decision

- 每个 Service 对应一个真实后端服务边界，按需包含 `api`、`types`、
  `mocks` 和根 `index.ts`。
- `shared/api/httpClient.ts` 是唯一 Axios 实例和公共传输层封装。Service
  不使用 React、TanStack Query 或 Zustand。
- Feature 只能通过 Service 根 `index.ts` 调用后端。
- Service 直接提供后端请求、响应和实体类型。不创建只为改名存在的 DTO
  副本，也不使用 `Dto` 后缀；前端独有的表单、展示和交互类型归 Feature。
- 只为明确需要替代的接口创建 `.mock.ts`。真实实现与 Mock 保持同一函数
  签名，Mock 不产生模块级副作用。
- 根出口逐接口显式选择实现。选择 Mock 时使用别名保持对外 API 不变：

  ```ts
  export { getUserListMock as getUserListApi } from "./mocks";
  ```

  恢复真实实现时改为：

  ```ts
  export { getUserListApi } from "./api";
  ```

- Mock 选择与 Dev、Test 或 Production 环境无关，不设置全局 Mock 开关，
  不增加顶层 `mocks` 目录或 MSW 层。

## Consequences

- 真实接口和 Mock 接口可以在同一构建中按接口混合使用，调用方无需感知。
- Mock 切换形成明确、可审查的源码变更，不会由运行环境隐式改变。
- 后端契约变化直接反馈到调用处，避免 DTO 副本静默漂移。
- 根出口若误选 Mock 会影响所有调用方，因此切换实现必须进入代码审查和
  相应验证。

## Alternatives considered

- **根据 `import.meta.env.DEV` 自动切换**：环境不能表达具体哪个接口需要
  Mock，也会把开发环境与 Mock 强绑定。
- **全局 Mock 服务或 MSW 层**：对当前逐接口替换需求增加了不必要的配置和
  运行时分支。
- **为后端响应复制 DTO 类型**：只改名不产生业务价值，并引入双份契约。
