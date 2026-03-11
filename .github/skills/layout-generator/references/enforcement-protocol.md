# 强制执行协议 (Mandatory Enforcement Protocol)

**此协议为最高优先级指令，Agent 在执行任务时必须严格遵守全部 19 条规则。**

---

## 一、边界与核心约束

**Rule 1 — 零业务逻辑干扰**
- **严禁**修改、移动或重构业务组件（如 `<ParkTarget>`、`<DeviceStatus>`）的内部代码。
- **仅关注**布局容器（`<Layout>`、`<Box>`、`<div class="box-main-content">`）及其属性。
- 占位模式：使用 `<div class="box-main-content"></div>` 作为占位符。

**Rule 2 — Logo 样式规范**
- Logo **严禁**设置 `font-size` 属性，字体大小由继承、CSS 变量或默认样式控制。

**Rule 3 — 全量扫描义务**
- 任何布局调整，**必须**递归检查 `src/views/**/*.vue`。

**Rule 4 — 依赖安全**
- **严禁**引入未安装的第三方库，修改后**必须**确保编译无误。

---

## 二、极简与分层原则

**Rule 5 — 极简删除**
- 用户未明确提及的布局元素，**必须**显式禁用或利用默认值关闭。

**Rule 6 — Props 分层约束**
- `index.vue` 仅负责全局框架（`header`, `footer`, `main`, `scene`）。
- 子页面负责局部内容（`aside`, `headerTool`, `footerTool`, `leftTools`, `rightTools`）。
- **严禁**在全局 `index.vue` 中开启可能遮挡导航的容器（如 `aside`）。

**Rule 7 — 交互优先协议**
- 导航组件必须位于最高交互层。
- 背景装饰图必须设置 `pointer-events: none`。

**Rule 8 — 全局宽度规范**
- 侧边栏宽度由 `src/layout/index.vue` 统一管理，**严禁**在业务页面中覆盖。

**Rule 9 — 高度分配唯一性**
- 高度**必须**直接设置在 Box 类名上（如 `.box-factory { height: 28%; }`）。
- `.content-left` 和 `.content-right` 容器**严禁**设置 `height` 属性。

**Rule 10 — 资源应用规范**
- 导航按钮动态切换：`:src="item.isActive ? require('@images/layout/navItem-bg-active.png') : require('@images/layout/navItem-bg.png')"`
- Header 应用 `top.png` 时设置 `background-size: 100% 100%`。
- 资源缺失时直接移除引用，不使用降级方案。

**Rule 11 — 导航 ID 唯一性**
- `navList` 中每个导航项**必须**拥有全局唯一的 `id`。

**Rule 12 — 路由与文件联动**
- 新增页面模块时，**必须**同步完成目录创建、文件生成、路由注册三项操作。

**Rule 13 — 导入语句唯一性**
- **严禁**在同一文件中重复导入同一个模块。
- 使用批量替换工具时，必须确保替换范围不重叠。
- 每次修改后必须检查 import 区域，确保每个模块只被导入一次。

---

## 三、流程原子化

**Rule 14 — 严格顺序执行**
- 必须按照 Step 0 → Step 1 → Step 2 → Step 4 的顺序执行，**严禁跳步**。

**Rule 15 — 组件使用前置检查**
- 使用任何业务组件前，**必须**先用 `read_file` 检查其 `props` 定义。
- 特别注意：`NavItem` 组件使用 `:item`，**严禁**传递 `:navData`。

**Rule 16 — 资源名称绝对优先** 🔴（最高优先级）
- 资源文件名是人为手动定义的，具有**绝对权威性**，优先级**绝对高于** UI 视觉识别。
- 强制映射逻辑：发现 `rightTool-bg.png` → 必须使用 `:rightTools="true"`（即使 UI 视觉上看起来像底部工具栏）。
- ✅ 发现 `leftTool-bg.png` → 必须使用 `:leftTools="true"`
- ❌ 发现 `rightTool-bg.png`，但 UI 图底部有按钮 → 错误地使用 `:footerTool="true"` **绝对禁止**
- 自检："我是否因为 UI 视觉判断而改变了资源的应用位置？"

**Rule 17 — 资源补全原则**
- 最终实现 = 资源强制映射 + UI 识别结果 + 资源补全项。
- 资源清单中存在但 UI 未识别的元素，**必须**补充到实现清单。
- ✅ 发现 `header-date.png` → 即使 UI 图模糊，也在 Header 中添加日期组件。
- ❌ 资源存在但未启用 → 错误。

**Rule 18 — UI 分析结果强制执行**
- **绝对禁止**在实现时偏离 Step 1 生成的 UI 分析结果（资源补全后）。
- 实现前逐项对照分析清单，实现后再次自检。
- 自检："我实现的每一个元素，在 UI 分析结果中都有明确提及吗？"

**Rule 19 — 严格顺序执行（流程层面）**
- 必须严格按照 [执行步骤](execution-steps.md) 的步骤顺序执行，严禁跳步或并行执行步骤。
