# Query 与 Mutation 开发指南

TanStack Query 持有服务端状态。Query 和 Mutation 按数据所有权放在对应 Feature，不放入 Service，也不因跨 Feature 使用而移入 `shared/hooks`。

## 文件归属与命名

```text
features/users/
├── queries/
│   ├── userQueryKeys.ts
│   ├── useUserListQuery.ts
│   └── index.ts
└── mutations/
    ├── useUpdateUserMutation.ts
    └── index.ts
```

- 读取 Hook 使用 `use<Name>Query`。
- 写入 Hook 使用 `use<Action>Mutation`。
- Service 函数使用 `<action>Api`，三者名称保持可区分。
- Query Key 集中在所属 Feature 的 key factory 中，禁止在多个组件散写数组字面量。

## Query

Query Function 只能调用 Service 根公共出口：

```ts
import { useQuery } from "@tanstack/react-query";
import { getUserListApi, type UserListParams } from "@/services/user-service";
import { userQueryKeys } from "./userQueryKeys";

export function useUserListQuery(params: UserListParams) {
  return useQuery({
    queryKey: userQueryKeys.list(params),
    queryFn: ({ signal }) => getUserListApi(params, { signal }),
  });
}
```

参数中影响响应的值必须进入 Query Key。Query Function 必须把 TanStack Query 提供的 `signal` 传给支持取消的 Service API。缓存时间、重试和重取策略优先使用 App 的默认配置，只有业务语义确有差异时在 Hook 中覆盖并说明原因。

## Mutation

Mutation 负责：

- 调用 Service 写接口。
- 成功后使准确的 Query Key 失效或更新缓存。
- 仅在收益明确且具备回滚路径时做乐观更新。
- 把错误交给调用方或统一错误 UI，不重复创造错误模型。

缓存失效应引用同一 key factory，不能用与 Query 无关的字符串猜测键。

## 跨 Feature 使用

若另一个 Feature 需要用户数据能力，仍由 Users Feature 拥有 Query Hook，并从 Users 根 `index.ts` 暴露必要能力。调用方不得深导入 `queries/*`，也不得复制一份相同 Query。

## 状态边界

- 请求中、错误、响应和缓存失效状态属于 TanStack Query。
- 不把 Query Data 同步进 Zustand。
- 纯表单编辑状态可留在 React；确需跨页面的临时草稿才进入 Zustand。
- URL 决定的筛选条件保留在 Search Params，并作为 Query 参数和 Key 的来源。

## 测试

- 用隔离的 Query Client 渲染 Hook 或调用组件。
- 替换 Service 公共出口，不访问真实后端。
- 验证参数、成功/错误状态和精确的缓存失效。
- 每个测试使用新的缓存或在结束后清理，避免跨用例污染。

状态选择见 [state.md](state.md)，通用测试约定见 [testing.md](testing.md)。
