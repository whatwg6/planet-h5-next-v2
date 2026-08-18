# Service Mock 开发指南

Mock 用于替代一个明确的 Service API，而不是把整个应用切换到“Mock 模式”。选择 Mock 与 Dev、Test 或 Production 环境无关。

## 只 Mock 需要的接口

为单个接口增加同级实现：

```text
services/user-service/
├── api/getUserList.ts
├── mocks/getUserList.mock.ts
├── types/
└── index.ts
```

Mock 与真实 API 必须保持同一函数类型：

```ts
import type { getUserListApi } from "../api/getUserList";

export const getUserListMock: typeof getUserListApi = async (params, options) => {
  options?.signal?.throwIfAborted();
  return {
    items: [],
    total: 0,
    page: params.page,
  };
};
```

示例数据必须满足真实 Service 类型。需要延迟或错误场景时，由函数参数或明确的测试装配控制，避免隐藏的全局状态。

## 显式选择出口

仅替换列表接口时，Service 根出口写成：

```ts
export { getUserDetailApi } from "./api";
export { getUserListMock as getUserListApi } from "./mocks";
export type * from "./types";
```

恢复真实接口时只改根出口：

```ts
export { getUserDetailApi, getUserListApi } from "./api";
export type * from "./types";
```

Feature 始终调用 `getUserListApi`，不感知当前由真实实现还是 Mock 实现提供。

## 禁止项

- 不使用 `import.meta.env.DEV`、`NODE_ENV` 或全局开关自动选择 Mock。
- 不因为一个页面需要 Mock 就替换整个 Service。
- 不建立顶层 `mocks` 目录或 MSW 请求拦截层。
- Mock 文件不注册拦截器、不修改全局对象、不在模块加载时启动定时器。
- 不从 Feature 直接导入 `getUserListMock`。
- 不让 Mock 返回比真实类型更宽松的结构。

## 测试中的 Mock

Service 出口显式替换用于开发中的固定替代实现。单元测试仍可使用 Vitest 对 Service 公共模块做用例级替换，并在每个用例后恢复，避免状态泄漏。

可复用 `services/*/mocks` 的确定性数据，但测试不能依赖模块级调用顺序。验证要求见 [testing.md](testing.md)，决策背景见 [ADR-0003](../decisions/0003-service-and-explicit-mock-export.md)。
