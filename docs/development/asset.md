# 资源与 SVG 指南

资源放置取决于它是否必须拥有固定 URL。不要把所有图片都放进 `public`。

## 选择位置

| 场景                                   | 位置                        | 使用方式                |
| -------------------------------------- | --------------------------- | ----------------------- |
| favicon、PWA 图标、必须固定 URL 的文件 | `public/`                   | 从站点 URL 引用         |
| 单色 UI SVG 图标                       | `src/shared/assets/icons/`  | `?react` 转为组件       |
| 普通图片和插画                         | `src/shared/assets/images/` | TypeScript 模块导入 URL |
| Logo、多色品牌图形                     | `src/shared/assets/brand/`  | 模块导入 URL，保留原色  |

`public` 文件会原样复制，不参与模块依赖分析和文件名哈希。任何可由代码导入的普通资源优先放 `src/shared/assets`。

## SVG 图标

只有显式带 `?react` 的导入才转换为 React Component：

```ts
import AddIcon from "@/shared/assets/icons/add.svg?react";
import emptyImageUrl from "@/shared/assets/images/empty.svg";
```

共享图标通过出口导出：

```ts
export { default as AddIcon } from "./add.svg?react";
```

调用方：

```tsx
import { AddIcon } from "@/shared/assets/icons";

<AddIcon aria-hidden className="size-5 text-current" />;
```

- 单色图标使用 `currentColor` 控制 `fill` 或 `stroke`。
- 单色 UI 图标使用 `?react` 导入为 React 组件，由组件调用处的 `color` 控制颜色；SVGR
  会把非 `none` 的 `fill` 和 `stroke` 转为 `currentColor`，但保留描边类型和
  `stroke-width`，避免破坏图标几何。
- 多色 SVG、Logo、品牌图形和插画不得使用 `?react` 的单色转换流程，应作为 URL 交给
  `<img>` 使用并保留原始颜色。
- 保留 `viewBox`，保证尺寸可由 CSS 控制。
- 多色插画和品牌 SVG 不强制改色，按 URL 使用。
- 不配置构建工具无差别删除全部 `fill` 或 `stroke`。
- 图标文件使用 kebab-case。

SVGR 的实际 include、SVGO 和类型声明以 `vite.config.ts`、`src/vite-env.d.ts` 为准，不在指南复制整份配置。

## 可访问性

- 纯装饰图标使用 `aria-hidden`。
- 独立传递含义的 SVG 提供可访问名称。
- 图标不能成为状态的唯一提示；同时提供文字或其他可感知线索。
- 图片根据语义提供有效 `alt`，纯装饰图片使用空 `alt`。

## 安全与维护

- `public` 中所有文件都可公开访问，禁止存放密钥、内部配置或用户数据。
- 提交前压缩过大的位图，并选择与显示尺寸匹配的格式。
- 删除资源前使用引用搜索确认没有代码、Manifest、HTML 或 CSS 依赖。
- PWA 图标同时受 [pwa.md](pwa.md) 的 Manifest 约束。
