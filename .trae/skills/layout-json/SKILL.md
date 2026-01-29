---
name: layout-generator
description: B&S二开项目 Layout Agent Skills，支持解析 UI 设计图或自然语言，智能修改项目布局与导航结构。
---

# 布局生成器技能 (Layout Generator Skill)

## ⚠️ 强制执行协议 (Mandatory Enforcement Protocol)

**此文档中的所有规则、步骤和自检清单均为“硬约束”，Agent 在执行任务时必须无条件遵守：**

1.  **原子化执行**：Agent 必须按照“Step 1 -> Step 2 -> Step 3 -> Step 4”的顺序执行，严禁跳步。
2.  **全量扫描义务**：任何涉及“清理”或“极简原则”的任务，Agent **必须** 递归检查项目中所有视图文件（`src/views/**/*.vue`），严禁仅修改当前页面。
3.  **自检清单强制性**：Agent 在提交任务前，**必须** 在内心或输出中逐项核对“任务完成自检清单”。任何一项不符合，均视为任务失败。
4.  **指令高于一切**：若用户指令与现有代码冲突，以用户指令为准，但必须符合本 Skill 的安全边界（如不破坏 Scene）。

---

本技能用于根据 **UI 设计图** 或 **自然语言描述**，智能修改二开项目的布局结构。适用于 B&S 二开项目，核心在于调整 UI 覆盖层（Header, Footer, Sidebars），**严禁破坏底层 3D Scene 逻辑**。

## 核心能力

### 1. 多模态输入解析

- **UI 设计图识别**：

  - 自动识别区域：Header (顶部)、Footer (底部)、Left/Right Sidebar (左右侧边栏)、Tools (工具栏)。
  - **比例计算**：分析侧边栏内卡片（Box）的高度占比（如 30:70 或 33:33:33）。
  - **组件识别**：识别导航栏、天气、搜索框、工具栏按钮等元素位置。
  - **布局推断**：根据视觉重心判断是全屏大屏模式还是管理模式。

- **自然语言理解**：
  - 意图识别：移动（Move）、新增（Add）、删除（Remove）、调整比例（Resize）。
  - 示例：“把底部的导航移到顶部”、“左侧分三个卡片，中间的要大一点”。

### 2. 智能导航管理（Single Source of Truth）

- **原则**：页面中应当只有一个主路由导航组件生效。
- **自动互斥**：当用户要求“迁移导航位置”（如从底部移至顶部）时：
  1. **新增**：在目标位置（如 Header）添加导航组件（如 `<nav-item-header>`）。
  2. **清理**：**必须**查找旧位置（如 Footer）的导航代码，并将其**注释掉**（保留代码以备回滚，但使其失效）。

## 项目布局架构

项目基于 `src/layout/index.vue` 提供核心结构，主要插槽如下：

| 区域         | 插槽名              | 对应组件示例            | 备注                             |
| :----------- | :------------------ | :---------------------- | :------------------------------- |
| **顶部**     | `header`            | `src/layout/header.vue` | 通常包含标题、天气、顶部导航     |
| **顶部工具** | `header-tool`       | `headerTool.vue`        | 顶部悬浮工具栏                   |
| **底部**     | `footer`            | `src/layout/footer.vue` | 通常包含底部导航、版权及数据展示 |
| **底部工具** | `footer-tool`       | `footerTool.vue`        | 底部悬浮工具栏                   |
| **左侧栏**   | `aside-left`        | `Box` 组件容器          | 业务指标卡片，通常包含多个 Box   |
| **右侧栏**   | `aside-right`       | `Box` 组件容器          | 业务指标卡片，通常包含多个 Box   |
| **左侧工具** | `aside-left-tools`  | 侧边工具栏              | 靠左侧边栏外侧的垂直工具条       |
| **右侧工具** | `aside-right-tools` | 侧边工具栏              | 靠右侧边栏外侧的垂直工具条       |
| **场景背景** | `scene`             | `src/layout/scene.vue`  | **通常不需要修改**               |

## 执行流程 (Execution Procedure)

### Step 1：定位目标 (Targeting)

1. **确定文件**：根据用户上下文确定要修改的视图文件（通常为 `src/views/page_X/index.vue` 或 `src/layout/*.vue`）。
2. **读取现状**：读取目标文件，分析 `<Layout>` 组件当前的 Props 和 Slots 配置。

### Step 2：解析需求与映射 (Analysis & Mapping)

- **UI 图输入**：
  - 将图中识别的区域映射到上述 Slot。
  - 计算侧边栏内部 `Box` 组件的高度百分比（总和需预留间距，通常控制在 93%-95% 之间）。
- **文本输入**：提取关键词（"左侧" -> `aside-left`, "导航" -> `nav-item`）。

### Step 3：实施修改 (Implementation)

#### A. 布局结构调整 (Layout Props & Slots)

- 修改 `<Layout>` 的 Props（如 `:header="true"`, `:aside="true"`）以控制容器显隐。
- 重构 Slot 内容。例如，重新分配左侧边栏的卡片数量：
  ```html
  <template v-slot:aside-left>
    <div class="content-left">
      <Box class="card-a" title="卡片A">...</Box>
      <Box class="card-b" title="卡片B">...</Box>
    </div>
  </template>
  ```
- **高度控制原则**：Agent **必须** 通过 CSS 类名在 `<style>` 标签中设置高度百分比，严禁直接在 `Box` 组件上使用 `:height` 属性（除非用户明确要求）。
  ```scss
  .content-left {
    .card-a {
      height: 30%;
    }
    .card-b {
      height: 63%;
    }
  }
  ```

#### B. 导航位置迁移 (Navigation Migration)

- **场景**：用户要求“把导航放到头部”。
- **操作**：
  1. 在 `<template v-slot:header>` 中插入 `<nav-item-header>` 并绑定数据。
  2. 搜索 `<template v-slot:footer>` 或其他区域，找到 `<nav-item-footer>` 或类似导航代码。
  3. **注释旧代码**：
     ```html
     <!-- 导航已迁移至 Header
     <nav-item-footer :data="footerNavData" />
     -->
     ```
  4. 确保相关的 Data 属性（如 `footerNavData`）已被适配或复用到新的 Header 导航的数据源中。

#### C. 组件与样式 (Components & Styles)

- **组件复用**：优先使用现有组件（`src/components/`），如无法满足再新建。
- **Box 样式**：若 UI 要求改变卡片风格（如标题样式），优先通过 Props 调整。
- **工具栏位置与 Props 依赖** (Dependency Check)：
  - 当启用某一区域（尤其是 `aside-right-tools`）时，**必须**检查 `<Layout>` 标签是否有关联的 Props 开关（如 `:rightTools="true"`），否则插槽内容不会渲染。
  - 根据 UI 图识别工具栏是在“顶部中间”、“底部中间”还是“侧边悬浮”，分别放入 `header-tool`, `footer-tool`, `aside-*-tools` 插槽。

### Step 4：样式修正 (Style Correction)

- **防溢出机制**：
  - **根容器隔离**：`.layout` 必须具备 `overflow: hidden`，防止任何子组件意外撑开页面。
  - **侧边栏裁剪**：`.layout-aside-left/right` 必须具备 `overflow: hidden`，确保内部 `Box` 即使高度计算失误也不会破坏整体布局。
- **高度计算准则 (Strict Height Calculation Rule)**：
  - **核心目标**：所有 `Box` 高度百分比与 `margin-bottom` 之和 **绝对不能超过 100%**，严禁溢出导致页面出现滚动条。
  - **Margin 规范**：每个 `Box` 的 `margin-bottom` 需确保足够间距，防止盒子标题与上一个盒子内容重叠
  - **强制要求**：Agent 在调整布局时，必须在意整体布局的视觉效果。若侧边栏内容过多，必须按比例缩减 CSS 中的 `height` 百分比，确保不溢出容器。
  - **检查项**：侧边栏容器 (`.layout-aside-*`) 必须具备 `overflow: hidden`，内部 `Box` 的高度必须由其 CSS 类名控制。
- 确保新添加的组件（如 Header 中的导航）不会遮挡 `scene` 的关键交互区。

## 任务完成自检清单 (Completion Checklist)

每次修改完成后，**必须** 逐项检查：

1.  **核心结构核对 (Core Structure)**：
    - [ ] **根布局渲染**：若在 `views/index.vue` 中使用 `<Layout>`，必须确保 `:main="true"`，否则子页面 (`router-view`) 将无法显示。
    - [ ] **侧边栏可见性**：检查侧边栏是否被外层容器遮挡或未开启 `aside` 开关。注意侧边栏通常由子页面提供内容。
    - [ ] **导航可见性**：检查导航（通常位于 `footer` 插槽）是否已启用并正确加载。
2.  **极简原则核对**：
    - [ ] 是否存在用户**未明确要求**的**次要**布局元素（如 `header-tool`, `footer-tool`, `aside-*-tools` 等）？
    - [ ] **注意**：侧边栏 (`aside`) 和导航 (`nav`) 是页面核心基础，**严禁**在未要求的情况下删除。
    - [ ] 所有的 `<Layout>` Props 是否已根据需求精确开启/关闭？
3.  **高度与布局核对 (Height & Layout)**：
    - [ ] **严禁溢出**：侧边栏容器 (`.layout-aside-*`) 必须设置 `overflow: hidden`，且根布局 `.layout` 也必须设置 `overflow: hidden`，严禁页面出现全局滚动条。
    - [ ] **高度分配验证**：侧边栏内部所有 `Box` 的高度百分比与 `margin-bottom` (3% \* N) 之和 **绝对不能超过 100%**。必须确保侧边栏无滚动条，且盒子之间间距充足。
    - [ ] **Box 显式高度**：检查所有 `Box` 的高度是否通过 CSS 类名设置了百分比，严禁直接使用 `:height` 属性（除非特殊业务需求）。
    - [ ] Header 高度是否过高（建议 45px-60px）？
4.  **导航核对**：
    - [ ] 是否存在两套导航？（必须注释掉旧导航）
    - [ ] 导航位置是否与需求一致？
5.  **Scene 完整性**：
    - [ ] 是否误改了 `scene` 插槽内容？

## 关键原则 (Critical Rules)

1.  **Scene 免打扰**：除非用户明确要求修改 3D 场景逻辑，否则**严禁**修改 `<template v-slot:scene>` 内容。
2.  **单一导航源**：修改导航位置时，必须“立新破旧”，不能让屏幕上出现两套主导航。
3.  **高度硬约束**：侧边栏内所有 `Box` 的高度百分比与 `margin-bottom` (默认 3%) 之和 **绝对不能超过 100%**。Agent 必须确保布局不溢出，不产生滚动条。
4.  **极简原则 (Minimalist Principle)**：
    - **核心保护**：侧边栏 (`aside`) 和导航 (`nav`) 是页面的核心基础，必须保持存在。
    - **全量清理**：**严禁**显示用户未明确要求的次要布局元素（如 `header-tool`, `footer-tool`, `aside-*-tools`, `footer` 等）。
    - **作用域**：此原则不仅适用于全局布局，**必须** 检查并修改所有相关的视图文件（如 `src/views/**/*.vue`），将未要求的 Props 开关设为 `false` 或从 `<Layout>` 标签中移除。
5.  **根布局守则 (Root Layout Rule)**：在 `src/views/index.vue` 中配置 `<Layout>` 时，**必须** 保持 `:main="true"`。如果将其设为 `false`，整个路由视图 (`router-view`) 将会被销毁，导致所有子页面内容（包括侧边栏和工具栏）全部消失。
6.  **全局观**：若用户要求“全局修改”，需检查 `src/layout/index.vue` 及相关公共组件，并**同步清理**所有 View 页面中的冗余 Props；若只改“当前页面”，则只改对应的 Views 文件。
7.  **布局灵活性与坑点预防 (Layout Flexibility & Pitfall Prevention)**：
    - **Header 布局**：顶部 Header 默认采用 `justify-content: space-between`，但应根据用户描述动态调整。
    - **组件排列**：左侧通常为 Logo，右侧为工具/信息。若用户要求“导航移至顶部”，则应在 Header 中间插入导航组件，并确保左右间距平衡。
    - **样式定制**：支持通过 CSS 变量或直接样式修改字体大小、边距、背景（如移除背景图）等。
    - **CSS 选择器规范**：在 Layout 或公共组件中修改样式时，**严禁**使用过于宽泛的选择器（如直接在 `.nav` 下使用 `div`）。必须使用子代选择器 `& > div` 或具体的类名，防止破坏子组件内部结构导致渲染异常（如导航消失）。
    - **高度管理**：Header 高度应精简（建议 `45px` - `60px`），确保不遮挡 3D 场景交互区，且文字比例协调。
    - **结构完整性**：在修改 Template 时，**必须**确保目标容器（如 `.nav`）及其内部组件（如 `NavItem`）已正确插入，严禁仅修改 CSS 而遗漏 Template 结构。
8.  **导航迁移规则 (Navigation Migration Rules)**：
    - **立新**：在目标插槽（如 `header`）添加导航组件并绑定数据。
    - **破旧**：在旧位置（如 `footer`）**注释掉**导航代码。
    - **数据源核对**：确保迁移后的导航组件引用的数据变量（如 `navList`）在目标文件中已定义并正确初始化。
    - **清理**：确保页面中只有一个主导航生效，避免 UI 混乱。
