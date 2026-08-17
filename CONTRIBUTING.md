# 贡献指南

需要 Node.js 22 和 pnpm 10。

```bash
pnpm install
pnpm dev
pnpm verify
```

提交前运行 `pnpm verify`；组件变更还应运行 `pnpm storybook:build`，关键移动端流程应运行 `pnpm test:e2e`。架构边界与目录职责见 `docs/ARCHITECTURE.md`。
