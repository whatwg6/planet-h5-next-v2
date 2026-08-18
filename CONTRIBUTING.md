# 贡献指南

需要 Node.js 22 和 pnpm 10。

```bash
pnpm install
pnpm dev
pnpm verify
```

提交前运行 `pnpm verify`；组件变更还应运行 `pnpm storybook:build`，关键移动端流程应运行 `pnpm test:e2e`。文档阅读入口见 [`docs/README.md`](docs/README.md)，按任务选择对应开发指南。
