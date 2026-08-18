# 组件开发指南

先按语义决定组件属于共享 UI 还是业务 Feature，再确定 API、样式、测试和出口。

## 归属

- 无具体业务语义、可独立复用的基础组件放 `src/shared/ui`。
- 包含业务字段、权限、流程或领域术语的组件放 `features/<owner>/components`。
- 路由级页面组合放 `features/<owner>/views`。
- 不因为两个 Feature 使用就自动把业务组件下沉到 `shared/ui`；先确认它是否真的失去业务语义。

## Shared UI 结构

按能力分类，并为每个组件建立独立目录：

```text
shared/ui/<category>/<Name>/
├── <Name>.tsx
├── <Name>.test.tsx
├── <Name>.stories.tsx
├── types.ts
└── index.ts
```

每个组件通过自身 `index.ts` 导出，并由 `shared/ui/index.ts` 公开稳定 API。分类组件较多时可以增加分类出口，但不是必需。调用方不要深导入实现文件。

这是一种文件组织形式，不是要求所有组件立即拥有占位文件；测试、Story 和独立类型文件按组件复杂度建立，但对外行为必须有相称验证。

## API 约定

- 受控表单组件使用 `value` / `onChange`。
- 弹层组件使用 `open` / `onOpenChange`。
- Props 扩展合适的原生元素属性，并正确转发 `className`、事件和可访问属性。
- Loading、Disabled、Error 等状态语义明确，不用相互矛盾的布尔组合。
- 不在组件内部硬编码具体业务文案、权限或导航。

## 样式与移动端

- 使用 Tailwind 组合布局和状态样式。
- 品牌颜色、圆角、阴影和层级优先引用语义 CSS Variables。
- 不在业务调用处重复实现组件的核心视觉状态。
- 可点击目标至少为 44 × 44 CSS 像素。
- 页面容器考虑 `100dvh` 与 `env(safe-area-inset-*)`。
- 动效尊重 `prefers-reduced-motion`。

## 无障碍

- 优先使用语义化 HTML，不用 `div` 模拟原生按钮或输入框。
- 所有交互能力支持键盘操作和可见焦点。
- 图标按钮提供可访问名称。
- 装饰 SVG 使用 `aria-hidden`；独立表达含义的图标提供名称。
- Loading、Error、Dialog 等动态状态使用合适的 ARIA 语义，并验证焦点行为。

## Storybook 与测试

Storybook 展示有价值的状态矩阵，例如 Default、Disabled、Loading、Error 和边界内容；它不是业务页面的替代实现。

React Testing Library 从用户可见行为验证：

- 点击、键盘和表单交互。
- Disabled / Loading 行为。
- 可访问名称与角色。
- 回调参数和受控状态。
- 错误、空数据和长文本等边界。

不要断言 Tailwind 类名来替代行为验证。视觉变化需结合 Storybook 构建和必要的人工检查。

资源用法见 [asset.md](asset.md)，测试命令见 [testing.md](testing.md)。组件范围由真实需求或单独 backlog 管理，不在架构文档维护“完整组件清单”。
