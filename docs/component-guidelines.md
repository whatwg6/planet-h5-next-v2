# 组件开发约定

通用、无业务语义的组件放在 `src/shared/ui`，按能力分类。每个组件目录包含实现、类型、测试、Storybook 示例和公共出口。

- 表单组件统一使用 `value/onChange`，弹层统一使用 `open/onOpenChange`。
- 使用 `src/shared/styles/tokens.css` 的语义令牌，不硬编码品牌色、阴影或层级。
- 可点击目标至少为 44 × 44 CSS 像素，并提供可访问名称和键盘行为。
- 动效必须尊重 `prefers-reduced-motion`。
- Feature 私有组件不进入 `shared/ui`。
