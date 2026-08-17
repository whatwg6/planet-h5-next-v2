# Feature 开发约定

新增业务前先确认真实业务域和后端服务边界。一个 Feature 可以包含 `views`、`queries`、`mutations`、`components`、`hooks`、`store` 和前端独有类型。

依赖规则：

1. Route 放在 `pages/<domain>`，只负责路径、懒加载、元数据和 Route Mode 分发。
2. 路由级 UI 放在 `features/<domain>/views`。
3. Query/Mutation 只从所属 Service 根出口调用 API。
4. 后端数据留在 TanStack Query；Zustand 只保存客户端临时状态。
5. 跨 Feature 使用能力必须从对方 `index.ts` 导入，并维持无循环的单向依赖。
