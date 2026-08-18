# Service 开发指南

Service 是前端与真实后端服务之间的边界。只有后端边界和接口明确后才创建，不使用占位 Service 表达未来可能性。

## 目录结构

```text
src/services/<service>/
├── api/
│   ├── getUserList.ts
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

- 一个 Service 目录对应一个真实后端服务边界，而不是一个页面。
- `api` 保存真实 URL、参数组装和 HTTP 调用。
- `types` 保存后端请求、响应和实体类型。
- `mocks` 只在某个接口明确需要替代实现时创建。
- 根 `index.ts` 是 Feature 唯一允许导入的入口。

没有 Mock 时不需要创建 `mocks` 目录。

## API 约定

- 真实函数使用动作名称加 `Api`，例如 `getUserListApi`。
- 参数与返回值必须有明确的 Service 类型。
- 使用 `shared/api` 导出的唯一 `httpClient`，不得创建新的 Axios 实例。
- 让统一错误归一逻辑继续向调用方传递，不在每个 API 中重复包装同类错误。
- 可取消的 API 接收可选 `AbortSignal`，并传给 HTTP Client，不另建并行传输层。

```ts
import { httpClient } from "@/shared/api";
import type { UserListParams, UserListResponse } from "../types";

export async function getUserListApi(
  params: UserListParams,
  options: { signal?: AbortSignal } = {},
): Promise<UserListResponse> {
  const response = await httpClient.get<UserListResponse>("/users", {
    params,
    signal: options.signal,
  });
  return response.data;
}
```

响应包裹格式、认证头和刷新协议必须来自真实后端契约，不在 Service 模板中猜测。

## 类型边界

- 后端类型由所属 Service 直接导出给 Feature 使用。
- 不为相同字段再创建 `UserDto`、`UserVO` 等镜像类型。
- 若 UI 确实需要不同形态，它是 Feature 的展示或表单类型，并由明确的转换函数产生。
- 类型名表达语义，例如 `UserListParams`、`UserListResponse`、`User`，不使用 `Dto` 后缀。

## 公共出口

真实实现的默认出口：

```ts
export { getUserListApi } from "./api";
export type * from "./types";
```

Feature 只从 Service 根目录导入：

```ts
import { getUserListApi, type UserListParams } from "@/services/user-service";
```

Service 不导入 React、TanStack Query、Zustand、Feature 或 Page。Query/Mutation 包装属于 Feature，详见 [query.md](query.md)。特定接口替换方式见 [mock.md](mock.md)。

## 验证清单

- 测试 URL、Method、参数和响应提取。
- 测试错误原样经过统一归一边界传递。
- 根出口只暴露调用方需要的 API 与类型。
- 没有环境变量驱动的 Mock 自动选择。
