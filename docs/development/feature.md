# Feature 开发指南

Feature 表示一个真实业务能力或业务域。先确认所有权，再创建目录；不要为匹配模板预建空 Feature。

## 按需结构

```text
src/features/<feature>/
├── views/
├── queries/
├── mutations/
├── components/
├── hooks/
├── store/
├── types.ts
└── index.ts
```

只创建当前需求需要的部分：

- `views`：路由级页面组合。
- `queries`：读取服务端数据。
- `mutations`：写入服务端数据并协调缓存。
- `components`：只服务该 Feature 的业务组件。
- `hooks`：该业务域拥有的非 Query/Mutation Hook。
- `store`：跨局部组件的临时客户端状态。
- `types.ts`：前端独有的表单、Props、展示或交互类型。
- `index.ts`：其他 Feature 和 App 可使用的公共 API。

后端请求、响应和实体类型属于对应 Service，不在 Feature 中复制，也不创建 DTO 映射层只为改名。

## 内部依赖

推荐方向：

```text
views -> queries / mutations / components / hooks / store
mutations -> query keys
queries / mutations -> service public API
all feature parts -> shared
```

- View 组合页面，不创建 Axios Client。
- Query/Mutation 只能调用 Service 根出口。
- Feature 组件不得反向依赖 View。
- Store 不保存服务端响应副本。

## 公共出口

其他 Feature 使用本 Feature 能力时，必须从根出口导入：

```ts
import { useUserPermission } from "@/features/users";
```

禁止：

```ts
import { useUserPermission } from "@/features/users/hooks/useUserPermission";
```

公开最小且稳定的 API，不要把内部所有文件机械地从 `index.ts` 重导出。Feature 间依赖必须单向、无循环；出现双向依赖时重新判断业务所有权。

唯一例外是 `pages/*Route.ts` 可以直接 lazy-import 所属 Feature 的 `views/*`，详见 [route.md](route.md)。该例外不能被 Feature 间复用借用。

## Hook 归属

归属由语义决定，不由使用次数决定：

- `useDebounce`、`useMediaQuery` 等无业务概念 Hook 放 `shared/hooks`。
- `useUserPermission` 等业务 Hook 留在拥有它的 Feature。
- Query/Mutation Hook 始终留在拥有该服务端数据的 Feature。
- 其他 Feature 确需使用业务 Hook 时，从所有者根出口导入。

## 新增检查

- Feature 名称表达真实业务所有权，而不是页面外观或技术类别。
- 只创建需要的子目录。
- Route View 放在 `views`，Route 声明放在 `pages`。
- 后端类型来自 Service。
- 对外 API 足够小，依赖保持单向。
- 为新增行为补充对应层级的测试。
