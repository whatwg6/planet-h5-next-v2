# Planet H5

面向移动端的 H5 管理系统工程基线。项目使用 React、TypeScript、Vite、Hash Router、TanStack Query、Zustand、Tailwind CSS 和项目内组件库。

## 开始使用

```bash
pnpm install
pnpm dev
```

Node.js 版本要求为 22，包管理器为 pnpm 10。

## 常用命令

- `pnpm verify`：类型、Lint、格式、单元测试与生产构建
- `pnpm storybook`：组件文档
- `pnpm test:e2e`：移动端 Chromium 与 WebKit 端到端测试

## GitHub Pages 部署

推送到 `main` 后，GitHub Actions 会构建并发布站点。首次部署前，请在仓库的
**Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。

部署地址：<https://whatwg6.github.io/planet-h5-next-v2/>

工作流会根据仓库名称设置 Vite 的资源基础路径；本地开发仍使用 `/`。如需在其他
子路径构建，可设置 `VITE_BASE_PATH`：

```bash
VITE_BASE_PATH=/planet-h5-next-v2/ pnpm build
```

文档入口见 [docs/README.md](docs/README.md)：架构边界、按任务拆分的开发指南、架构决策记录和历史归档分别维护，开发时只需读取与当前任务相关的部分。
