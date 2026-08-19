---
name: planet-figma-to-code
description: 将 Figma 设计高质量还原为 Planet H5 中可维护的 React 页面或组件，重点关注组件复用、Design Token、真实素材和 Playwright 浏览器视觉验证。仅当用户明确调用 $planet-figma-to-code 时使用。
---

# Planet Figma 设计还原

## 目标与边界

将 Figma 设计高质量还原为当前代码库中的生产级前端实现。

重点保证：

- 高保真还原设计。
- 优先复用现有组件和 Design System。
- 正确使用 Design Token。
- 使用真实 Figma 素材。
- 保持代码可维护、可扩展。
- 通过真实浏览器验证并迭代视觉效果。

只负责 UI 实现和视觉还原，不负责：

- API Contract 设计或 API 接入。
- 业务逻辑、权限模型和缓存策略。
- 大规模架构重构。
- 与设计还原无关的功能开发。

## 输入要求

尽可能获取：

- 带 `node-id` 的 Figma Design URL。
- 目标页面、路由或组件。
- 需要实现的设计状态。
- 目标 Viewport。
- 当前代码库。

如果 Figma URL 缺少 `node-id`，要求用户提供节点级链接，不得猜测节点。

## 工作原则

始终按照以下顺序工作：

```mermaid
flowchart TD
  A["读取设计结构和视觉参考<br/>获取素材，形成布局、状态和响应式判断"]
  B["理解代码库、现有组件<br/>Design Token 和工程规范"]
  C["完成 Token 映射<br/>决定组件复用、扩展或新建"]
  D["使用设计素材实现页面、状态和交互<br/>完成组件化复查"]
  E["Playwright 构造目标状态并截图"]
  F["Vision 对比 Figma 设计稿与浏览器截图"]
  G{"差异类型"}
  H["Playwright 再次构造目标状态并截图"]
  I{"Vision 最终对比"}
  J["建立并复跑 Playwright<br/>Browser Snapshot Baseline"]

  A --> B --> C --> D --> E --> F --> G
  G -- "局部且有视觉意义" --> D
  G -- "结构性差异" --> A
  G -- "无视觉意义的差异" --> H --> I
  I -- "局部且有视觉意义" --> D
  I -- "结构性差异" --> A
  I -- "通过：无视觉意义的差异" --> J
```

避免：

```text
只看截图
→ 猜测 CSS
→ 堆积像素补丁
```

## 1. 理解设计稿并完成设计侧分析

写代码前，先加载 `figma-design-to-code`，再调用 `get_design_context`。

不要逐层机械翻译 Figma，也不要看到一个视觉块就立即创建组件。先理解设计意图和页面结构：

- **信息层级**：识别页面主任务、阅读顺序、主要内容、辅助信息和主要操作。
- **区域关系**：识别导航、内容、操作、反馈、弹层等区域，以及它们的包含、并列和覆盖关系。
- **重复模式**：识别列表项、卡片、表单项、操作组等重复结构，判断真正的组件边界。
- **布局规则**：先推理应使用 Document Flow、Flexbox、CSS Grid、固定定位还是其他布局策略；区分固定与流式尺寸、滚动区域、吸顶区域、弹性空间和响应式约束。将 Figma Frame 宽度视为视觉验证 Viewport，不得直接推导为生产页面宽度上限。
- **状态与交互**：理解默认、选中、禁用、加载、空、错误、展开和弹层等状态之间的关系，以及触发、切换、导航和反馈流程。
- **语义角色**：判断元素是按钮、链接、输入、标签、列表项、卡片还是纯装饰，不以外观代替语义。

再从结构数据、素材、视觉参考和 Design Token 四个方面读取设计：

- **结构数据**：检查页面层级、Auto Layout、Constraints、宽高、Padding、Gap、对齐、Typography、颜色、边框、圆角、阴影、Component、Variant 和 Variable。
- **素材**：识别并获取真实 SVG、图标、图片、Logo、插画和字体信息或文件；不要要求用户提前手动导出。
- **视觉**：获取 Figma Screenshot 作为最终参考，但不得只根据截图猜测页面结构和尺寸。
- **Design Token**：提取颜色、字体、字号、行高、间距、圆角、边框和阴影的设计值与语义，待理解代码库后再完成项目 Token 映射。

先形成简短的设计侧结论，至少明确页面骨架、重复模式、组件及 Variant、状态与交互流程、响应式行为、布局策略、素材来源和待映射的 Token。结构无法解释时继续检查设计上下文，不要用 CSS 补丁掩盖理解缺失。

## 2. 理解代码库

修改代码前，检查：

- `AGENTS.md` 及任务直接相关的开发指南和配置。
- `src/shared/ui` 的现有组件和公开 API。
- `src/shared/styles/tokens.css` 的现有 Design Token。
- 现有布局组件、图标和素材。
- 项目的样式和响应式约定。

将第 1 节提取的设计值和语义映射到项目现有 Token。只有现有 Token 无法表达且需求确实时才考虑扩展。Token 映射和第 3 节的组件决策完成后再生成代码。

## 3. 决定组件方案

先判断语义、交互和归属，再判断视觉。稳定的通用语义、交互契约和实际复用证据共同决定是否进入 `shared/ui`；外观相似、Figma Component 身份或出现次数都不能单独决定归属。

只对复用、扩展、新建或归属存在实际选择的候选项记录简短决策；显然可直接复用的组件无需为表格而表格。

| 设计区域 | 语义与交互 | 代码库证据               | 决策与归属                     | 理由 |
| -------- | ---------- | ------------------------ | -------------------------------- | ---- |
| ...      | ...        | 已有 / 内联重复 / 不存在 | 复用 / 扩展 / 新建 / 保留；归属 | ...  |

按照以下边界决定归属：

- **已有组件**：语义、职责和交互契约一致时直接复用；只有受支持的视觉或组合差异时，通过 Token、Size、Variant、Slot 或 Composition 做向后兼容的扩展。
- **共享基础控件**：当前需求真实，职责不含业务概念，API 及焦点、禁用、加载、键盘和无障碍契约足够稳定时，可以在首次真实使用时进入 `shared/ui`；首次使用或第二次出现本身都不是抽取理由。
- **共享组合组件**：只有在语义和交互契约稳定，且有跨页面复用、可直接消除的重复实现或其他代码库证据时，才进入或扩展 `shared/ui`。Figma Component、Instance 和 Variant 只是辅助证据。
- **Feature 组件**：包含业务字段、领域术语、权限、流程或数据解释规则，或者通用 API 仍不稳定时，保留在所属 Feature。

对候选项依次检查：

1. 它解决什么用户问题，承担什么语义角色？
2. 它有哪些交互、状态和可访问性要求？
3. 现有组件的语义、职责和交互契约是否匹配？
4. 差异能否通过现有 API 或通用扩展自然表达，而不引入页面、业务专属 Props？
5. 共享归属的语义、契约和 API 是否已有足够证据且稳定？

修改公共组件前：

1. 阅读当前实现并搜索主要调用点。
2. 保留已有语义、状态、交互和可访问性契约。
3. 优先最小、向后兼容的通用扩展，不得加入单页面或业务特例。

不要因为 Figma 实例名称不同就重复创建组件，也不要因为现有组件“看起来接近”就强行复用。

如果需要 Breaking API Change、大范围修改 Design System、重构共享组件架构或大范围修改全局 Token，停止扩大任务并报告需要决策的问题。

## 4. 实现页面

按以下顺序实现：

1. **结构**：完成页面层级、组件层级、布局模型和组件复用。
2. **几何**：调整宽高、Padding、Gap、对齐和定位。
3. **视觉**：调整 Typography、颜色、边框、圆角和阴影。
4. **素材**：处理图标、图片、Logo 和插画。
5. **细节**：修复 Overflow、文案换行、响应式问题和其他可见偏差。

普通布局优先使用 Document Flow、Flexbox、CSS Grid 和项目已有布局组件。

避免大量 Absolute Position、Magic Number、Inline Style 和截图专用补丁。允许使用设计中真实存在的特殊值，但不要为了消除渲染噪声破坏合理布局。

### 响应式宽度

- Figma Frame 的宽度是视觉验证 Viewport，不是生产页面的 `max-width`。例如 393px Frame 只表示应在 393px Viewport 检查几何和还原度。
- 页面根容器默认使用 `width: 100%` 或等价的流式布局。不得仅因为参考 Frame 为 393px 就写入 `width: 393px`、`max-width: 393px` 或对应的固定工具类。
- 只有产品明确要求居中限宽、代码库已有壳层约束，或设计结构与多个 Viewport 的证据明确存在最大内容宽度时，才允许设置 `max-width`。使用前说明依据，不得从单个 Frame 宽度猜测。
- 内部布局优先使用 `flex`、`grid`、`min-width: 0`、`gap`、`minmax()`、`clamp()` 等关系式约束。不要把某一 Frame 宽度下的子区域尺寸机械转写为固定 `width` 或 `max-width`。
- 需要在 Figma Frame 对应的 Viewport 保持特定几何时，使用可扩展的间距、弹性比例和尺寸边界表达关系；同时保证更宽或更窄的移动 Viewport 能合理伸缩、换行，且不产生横向 Overflow。

### 组件化复查

页面结构完成后、开始像素级视觉调整前，必须复查本次新增和修改的代码：

1. 搜索新增的原生表单和交互元素。
2. 检查是否复制了其他页面已有的导航栏、输入框、开关、选择器或列表模式。
3. 检查同一控件的核心状态样式和无障碍行为是否散落在业务调用处。
4. 检查共享组件 Props 是否含页面或业务专属概念。
5. 发现达到抽取门槛的能力时，先完成组件沉淀，再继续视觉调整。

## 5. 处理素材

如果设计中存在真实素材：

- 优先从 Figma 获取。
- 不使用 Placeholder 或 Emoji 代替图标。
- 不自行绘制近似 SVG。
- 不随意替换成不同图片。
- 不根据名称相似就替换成图标库资源。

完成前，将素材保存到项目规定目录并使用稳定引用。最终代码不得依赖临时 Figma Asset URL。

### SVG React 与图片决策

先判断素材是否单色、是否需要随状态或主题变色，以及它是 UI 控件还是品牌/内容素材，再选择使用方式。不得把所有 Figma SVG 一律作为 `<img>`，也不得把所有 SVG 一律转成 React Component。

- **单色 UI Glyph/Icon**：下载真实 Figma SVG，使用显式 `?react` 导入为 React Component；通过 `className` 控制尺寸，并通过 `currentColor` 继承语义颜色。
- **多色 SVG、Logo、品牌图形和插画**：保留原始颜色，以 URL 导入并使用 `<img>`。
- **照片和其他位图**：以 URL 导入并使用 `<img>`，根据语义提供 `alt`。

不要为了复用单色图标流程而破坏品牌色、内容色或插画内部色彩关系。

### `currentColor` 与 SVGO 安全配置

只对显式 `?react` 的单色图标应用强制 `currentColor` 转换。不得使用 `removeAttrs` 删除 `fill`、`stroke` 或 `stroke-width`；删除 `stroke` 或 `stroke-width` 会破坏搜索、箭头等描边图标的几何。

推荐在 SVGO 配置中使用：

```js
{
  name: "convertColors",
  params: { currentColor: true },
}
```

该配置会把非 `none` 的 `fill` 和 `stroke` 颜色转为 `currentColor`，同时保留原本的填充/描边模型与 `stroke-width`。保留 `viewBox`，让尺寸由 CSS 控制。

如果颜色透明度由 Design Token 或调用处的 Class 控制，可以额外删除 `fill-opacity` 和 `stroke-opacity`；调用处必须补上对应的语义颜色与透明度。不要在没有调用方补偿的情况下丢弃透明度信息。

如果 Vite 与 Vitest 使用独立配置，必须抽取并复用同一份 SVGR/SVGO 配置。否则测试环境可能把 `?react` SVG 当成 URL 或 Data URI，而不是 React Component。

## 6. 视觉迭代闭环

初版实现达到可验证状态后，加载 `playwright` skill，并使用 Playwright CLI 在真实浏览器中构造目标状态、交互和截图。迭代阶段不要改用手工截图，也不要为了截图编写临时 Playwright 测试文件。

工具职责不可混用：

- **Playwright**：负责真实浏览器渲染、交互、状态构造和截图。
- **Vision**：负责对比 Figma 设计稿与浏览器截图，识别差异并判断差异是否具有视觉意义。

先确认 `npx` 可用，再使用 Playwright skill 提供的包装脚本：

```bash
command -v npx >/dev/null 2>&1
export PLANET_PWCLI="${CODEX_HOME:-$HOME/.codex}/skills/playwright/scripts/playwright_cli.sh"
```

将截图和其他临时产物放在 `output/playwright/<任务名称>/`，不要新增其他顶层产物目录。

按照以下顺序操作：

1. 启动项目并确认目标 URL。
2. 使用 `"$PLANET_PWCLI" open <URL> --headed` 打开页面。
3. 使用 `"$PLANET_PWCLI" resize <width> <height>` 设置为 Figma Frame 对应的 Viewport。
4. 使用 `"$PLANET_PWCLI" snapshot` 获取当前页面结构和稳定元素引用。
5. 使用最新 Snapshot 中的引用执行 Click、Fill、Hover 或 Press，进入设计对应状态。
6. 页面发生导航、弹层开关或明显 DOM 变化后重新 Snapshot。
7. 页面稳定后使用 `"$PLANET_PWCLI" screenshot` 截图。

先在 Figma Frame 对应的 Viewport 检查视觉还原，再额外验证代表性的更窄和更宽移动 Viewport，重点检查流式伸缩、文案换行和横向 Overflow。例如参考 Frame 为 393px 时，430px 可以作为更宽 Viewport，但它不是固定要求；应根据目标设备范围选择验证宽度。

元素引用失效时重新 Snapshot，不得绕过引用直接猜测选择器。只有 Playwright CLI 的显式命令无法完成等待或状态准备时，才使用 `run-code`。

截图前确保：

- 字体和图片加载完成。
- 页面数据已经稳定。
- Animation 和 Transition 不影响截图。
- Modal、Dropdown、Selected、Expanded 等状态正确。
- Playwright Console 中没有新增错误。

完成一次目标状态截图后，使用 Vision 与 Figma Screenshot 对比，重点检查：

1. 整体布局和页面层级。
2. 元素尺寸、对齐和间距。
3. Typography 和颜色。
4. Border、Radius 和 Shadow。
5. 图标、图片和其他素材。
6. Overflow、换行和响应式问题。

根据 Vision 识别的主要差异修改实现，然后重新用 Playwright 构造同一状态并截图。重复这一闭环直到不再存在有视觉意义的主要差异；3～5 轮是常见迭代区间，不是最低轮数、通过条件或硬性上限。每轮优先处理：

```text
Layout
→ Size
→ Spacing
→ Alignment
→ Typography
→ Color
→ Border 和 Shadow
→ Minor Polish
```

如果 Vision 发现某个区域不正确，再使用 Figma 结构化尺寸、DOM Bounding Box、Computed Style 或浏览器测量结果确认原因，不要依赖 Vision 猜测精确像素，也不需要建立完整的 Figma Node 与 DOM Node 映射。

一旦 Vision 和结构数据表明差异来自错误的页面层级、组件边界或布局模型，或连续微调未能缩小主要差异，立即结束当前微调循环并回到分析阶段；修正理解并重新实现后，再进入新的验证循环，不要继续堆叠 CSS 补丁。

## 7. 最终验收与 Snapshot Baseline

完成主要迭代且不存在已知结构性差异后，必须再次由 Playwright 构造目标状态并截图，再由 Vision 与设计稿做独立的最终对比：

- 存在有视觉意义的差异：回到第 6 节的迭代闭环，修改后重新进入最终验收。
- 仅存在抗锯齿、阴影、SVG 栅格化、子像素等渲染噪声：可以忽略。
- 仍存在结构性差异：回到设计、组件和布局分析阶段，不得判定通过。

Figma 设计图只用于 Figma ↔ Browser 验收，不是长期 Playwright Baseline，也不使用严格 Pixel Equality 作为通过标准。

只有最终 Vision 验收通过后，才为验收状态建立 Playwright 视觉回归用例：使用稳定步骤重建相同的 Browser、Viewport、数据和页面状态，并通过 `expect(page).toHaveScreenshot(...)` 记录对应 Playwright Project 的 Browser Snapshot Baseline。先更新 Snapshot，再正常运行同一用例确认 Browser ↔ Browser 比较通过。

不得把 Figma Screenshot 复制或转换为 Baseline，不得手工把迭代期 CLI Screenshot 塞入 Snapshot 目录，也不得在设计验收前更新 Baseline 来消除失败。多个 Playwright Project 需要各自渲染和验收自己的 Baseline。

## 8. 完成检查

完成前确认：

### 设计还原

- 页面层级和主要布局正确。
- 尺寸、间距和对齐没有明显问题。
- Typography、颜色、边框、圆角和阴影合理。
- 使用了正确素材且没有遗漏主要 UI。
- Figma Frame 对应的 Viewport、代表性的更窄和更宽移动 Viewport，以及关键页面状态已在浏览器中验证；至少包含一个非 Figma Frame 宽度的 Viewport。
- Playwright 截图与 Figma 设计稿的 Vision 对比已收敛，并通过独立的最终验收；已忽略的差异仅为无视觉意义的渲染噪声。
- 不存在未解决的结构性差异；若曾回到分析阶段，修正后的实现已重新走完视觉闭环。
- Playwright 视觉回归用例可以稳定重建验收状态；Baseline 由验收后的 Browser 渲染生成，正常运行时 Browser ↔ Browser 比较通过。
- 没有明显 Overflow 或 Layout Shift。

### 工程质量

- 优先复用了已有组件和 Design Token。
- 已检查本次新增的 `button`、`input`、`select`、`textarea` 和自定义 ARIA 控件。
- 原生控件基础能力已复用或沉淀到 `shared/ui`，未重复实现核心状态和无障碍行为。
- 与现有页面重复的通用组合模式已复用、扩展或下沉。
- 保留在 Feature 中的组件具有明确业务语义，或尚未达到通用组合组件的抽取门槛。
- 没有复制已有公共组件或污染公共组件 API。
- 没有大量 Absolute Position 或截图补丁。
- 页面不存在从 Figma Frame 宽度机械生成的固定 `width` 或 `max-width`；允许的限宽均有产品、现有壳层或设计证据。
- 内部布局使用可扩展的关系式约束，在非 Figma 宽度下能合理伸缩和换行。
- 单色图标使用 React SVG 与 `currentColor`；多色、品牌和内容素材继续使用 `<img>` 并保留原色。
- SVGO 没有删除 `stroke` 或 `stroke-width`，描边图标的线宽与几何未被破坏。
- Vite 与 Vitest 存在独立配置时复用了同一份 SVGR/SVGO 配置。
- TypeScript 类型正确且没有新增 Console Error。
- `pnpm verify` 执行成功。

## 9. 完成报告

返回简洁报告：

```text
设计还原结果

修改文件：
- ...

复用组件：
- ...

组件审计：
- 发现的已有实现：
- 发现的跨页面重复模式：
- 保留为 Feature 组件的原因：

扩展组件：
- ...

新增组件：
- ...

未抽取的组件候选：
- ...

新增素材：
- ...

浏览器验证：
- Figma Frame 对应的 Viewport：
- 额外移动 Viewport：
- 页面状态：
- Vision 迭代轮次与主要修正：
- 最终对比结论：
- Playwright Snapshot Baseline：

剩余视觉差异：
- ...

需要上层决策的问题：
- ...
```

没有需要升级的问题时，明确写“需要上层决策的问题：无”。不得只回复“完成”。

## 最终原则

目标不是让浏览器截图和 Figma PNG 的每个像素完全相同，而是同时满足：

```text
设计意图
+ 现有工程体系
+ 正确组件抽象
+ 高视觉还原度
+ 可维护代码
```
