---
name: layout-generator
description: B&S二开项目 Layout Agent Skills，支持解析 UI 设计图或自然语言，智能修改项目布局与导航结构。
---

# 布局生成器技能 (Layout Generator Skill)

## ⚠️ 强制执行协议 (Mandatory Enforcement Protocol)

**此文档中的所有规则、步骤和自检清单均为“硬约束”，Agent 在执行任务时必须无条件遵守：**

1.  **原子化执行**：Agent 必须按照“Step 1 -> Step 2 -> Step 3 -> Step 4 -> Step 5”的顺序执行，严禁跳步。
2.  **全量扫描义务**：任何涉及布局调整的任务，Agent **必须** 递归检查项目中所有视图文件（`src/views/**/*.vue`），确保所有页面的 `<Layout>` 配置保持同步。
3.  **极简删除原则 (Delete-by-Default)**：用户未明确提及的任何布局元素（如各种 Tools 工具栏），**必须** 在所有相关页面中通过 Props 禁用并清理对应插槽。
4.  **显式 Props 硬约束**：严禁依赖默认值。在所有页面的 `<Layout>` 组件上，**必须** 显式设置所有核心 Props（`:header`, `:footer`, `:aside`, `:main`, `:scene`, `:headerTool`, `:footerTool`, `:leftTools`, `:rightTools`）。
5.  **核心结构守护**：除非用户明确要求删除，否则 `header`, `aside-left`, `aside-right`, `scene`, `main` 被视为**必须存在**的基础结构。

---

本技能用于根据 **UI 设计图** 或 **自然语言描述**，智能修改二开项目的布局结构。适用于 B&S 二开项目，核心在于调整 UI 覆盖层（Header, Footer, Sidebars），**严禁破坏底层 3D Scene 逻辑**。

## 核心能力

### 1. 多模态输入解析

- **UI 设计图识别**：
  - **自动识别区域**：Header (顶部)、Footer (底部)、Left/Right Sidebar (左右侧边栏)、Tools (工具栏)。
  - **比例计算**：分析侧边栏内卡片（Box）的高度占比（如 30:70 或 33:33:33）。
  - **组件识别**：识别导航栏、天气、搜索框、工具栏按钮等元素位置。
  - **微观细节提取 (Micro-Detail Extraction)**：**必须** 检查 Header 和 Footer 中的文本格式（如日期格式 "YYYY/MM/DD HH:mm:ss"）、小图标（如天气 Icon）、用户信息等。**严禁** 忽略顶部状态栏的微小元素。

- **自然语言理解**：
  - 意图识别：移动（Move）、新增（Add）、删除（Remove）、调整比例（Resize）。
  - 示例：“把底部的导航移到顶部”、“左侧分三个卡片，中间的要大一点”。

### 2. 智能导航管理（Single Source of Truth）

- **原则**：页面中应当只有一个主路由导航组件生效。
- **自动互斥**：当用户要求“迁移导航位置”（如从底部移至顶部）时：
  1. **新增**：在目标位置（如 Header）添加导航组件（如 `<nav-item-header>`）。
  2. **清理**：**必须**查找旧位置（如 Footer）的导航代码，并将其**注释掉**（保留代码以备回滚，但使其失效）。

## 项目布局架构 (Layout Architecture)

项目基于 `src/layout/index.vue` 提供核心结构，采用 **绝对定位 (Absolute Positioning)** 布局。

### 1. 区域与插槽映射表

| 区域         | 插槽名              | 对应组件示例                       | 关键定位信息 (CSS)                                           |
| :----------- | :------------------ | :--------------------------------- | :----------------------------------------------------------- |
| **顶部**     | `header`            | `src/layout/header.vue`            | **Top: 0**, Z-Index: 2, 宽高比 960/47                        |
| **顶部工具** | `header-tool`       | `headerTool.vue`                   | **Top: 9%**, Left: 50% (居中), Width: 42%, Z-Index: 2        |
| **底部**     | `footer`            | `src/layout/footer.vue`            | **Bottom: 0**, Width: 100%, Padding-bottom: 4.6%, Z-Index: 2 |
| **底部工具** | `footer-tool`       | `footerTool.vue`                   | **Bottom: 8%**, Left: 50% (居中), Width: 42%, Z-Index: 2     |
| **左侧栏**   | `aside-left`        | `Box` 组件容器                     | **Left: 0**, Top: 8.5%, Width: 19%, Height: 89%, Z-Index: 1  |
| **右侧栏**   | `aside-right`       | `Box` 组件容器                     | **Right: 0**, Top: 8.5%, Width: 19%, Height: 89%, Z-Index: 1 |
| **左侧工具** | `aside-left-tools`  | `src\components\sideBarLeft.vue`   | **Left: 22%**, Bottom: 8%, Z-Index: 1 (位于左侧栏外侧)       |
| **右侧工具** | `aside-right-tools` | `src\components\splitBuilding.vue` | **Right: 22%**, Bottom: 8%, Z-Index: 1 (位于右侧栏外侧)      |
| **场景背景** | `scene`             | `src/layout/scene.vue`             | Full Screen, Z-Index: 0                                      |

## 执行流程 (Execution Procedure)

### Step 1：全量定位与深度解析 (Targeting & Deep Analysis)

1.  **多维度输入解析**：
    - **UI 图深度解析 (UI Analysis)**：
      - **布局识别**：精准识别设计稿中的 Header, Footer, Sidebar, Tools 位置。
      - **比例分析**：计算侧边栏内卡片 (Box) 的高度占比，识别组件间隙。
      - **微观元素提取**：**必须** 放大检查 Header 左右两侧的细节（日期时间格式、天气图标、Logo 文本内容），记录下具体的格式（如 `YYYY/MM/DD` vs `YYYY-MM-DD`）。
    - **自然语言解析 (Prompt Analysis)**：
      - **显式需求提取**：识别用户明确要求开启或移动的组件。
      - **隐式清理规则**：基于“极简删除原则”，识别用户未提及的所有布局元素。
    - **双向核对 (Cross-Check)**：将 UI 图识别结果与用户描述比对，若有冲突，以用户描述为准，但需在解析报告中指出。

2.  **全量现状扫描**：
    - 定位 `src/views/index.vue` (全局控制层) 和所有子视图 `src/views/page_X/page_X_1/index.vue` (局部控制层)。
    - 列出当前所有页面的 `<Layout>` Props 和 Slots 现状。

3.  **制定变更清单**：
    - **全局变更 (Global)**：Header/Footer 的内容、显隐及全局导航逻辑。
    - **局部变更 (Local)**：侧边栏卡片内容、Tools 显隐、布局比例。
    - **组件化重构 (Componentization)**：对于复杂的侧边栏内容，**必须** 规划创建独立的 Vue 子组件（如 `ClimateProfile.vue`, `WeatherChart.vue`），严禁在 `index.vue` 中堆砌大量 HTML 代码。
    - **清理清单 (Cleanup)**：UI 图和描述中均未提及的插槽。

### Step 2：Props 责任分配与标准化 (Responsibility & Props Standard)

1.  **分层控制原则 (Tiered Control)**：
    - **全局层 (`src/views/index.vue`)**：
      - 负责控制 `header`, `footer`, `scene`, `main` 的全局显隐。
      - **必须显式设置**：`:header="true"`, `:footer="true"` (或根据需求设置)。
    - **局部层 (`src/views/page_X/.../index.vue`)**：
      - 负责控制 `aside`, `headerTool`, `footerTool`, `leftTools`, `rightTools` 等页面特有元素。

2.  **点击安全保障 (Click Safety)**：
    - **原理**：由于采用绝对定位布局，容器必须设置 `pointer-events: none` 且内容设置 `pointer-events: auto`，以防止透明容器遮挡底层交互。
    - **检查项**：确保 `src/layout/index.vue` 中的容器样式遵循此模式。

### Step 3：实施修改 (Implementation)

#### A. 组件化开发 (Component Development)

- **优先创建子组件**：针对 UI 图中的每个独立卡片，创建专门的 `.vue` 组件。
- **样式内聚**：使用 Scoped CSS 确保样式不污染全局，利用 Flexbox/Grid 实现组件内部的精细布局（如四季天气的 4 个 Badge）。

#### B. 布局结构调整 (Layout Props & Slots)

- **全量同步修改**：**必须** 依次修改所有扫描到的视图文件。
- **显式 Props 设置**：
  ```vue
  <Layout
    :header="true"
    :footer="false"
    :aside="true"
    :main="true"
    :scene="true"
    :headerTool="false"
    :footerTool="false"
    :leftTools="false"
    :rightTools="true"
  >
  ```
- **插槽清理**：物理删除或注释掉清理清单中的所有插槽代码。
- **高度控制原则**：Agent **必须** 通过 CSS 类名在 `<style>` 标签中设置高度百分比，严禁直接在 `Box` 组件上使用 `:height` 属性。

#### C. 导航位置迁移与细节修正

- **细节对齐**：根据 Step 1 提取的微观细节，修改 `src/layout/header.vue` 或创建新的 Status 组件，确保日期格式、图标位置与 UI 图 **完全一致**。
- **导航迁移**：在目标插槽插入新导航并绑定数据，注释掉旧代码。

### Step 4：样式修正 (Style Correction)

- **防溢出机制**：`.layout` 和 `.layout-aside-*` 必须具备 `overflow: hidden`。
- **高度计算准则**：所有 `Box` 高度百分比与 `margin-bottom` 之和 **绝对不能超过 100%**。

### Step 5：任务核对 (Verification)

每次修改完成后，**必须** 按照以下清单逐项自检，并在回复中确认：

1.  **核心结构核对 (Core Structure)**：
    - [ ] **根布局渲染**：`src/views/index.vue` 中必须保持 `:main="true"`。
    - [ ] **侧边栏可见性**：检查侧边栏是否被外层容器遮挡或未开启 `aside` 开关。
    - [ ] **导航可见性**：检查导航是否已启用并正确加载，且 `z-index` 足够高。
2.  **极简原则与显式 Props 核对**：
    - [ ] **未要求即删除**：是否已清理所有未提及的 `Tools` 区域插槽？
    - [ ] **全量显式设置**：所有页面的 `<Layout>` 是否都显式设置了 9 个核心 Props 开关？
    - [ ] **多文件同步**：是否检查并修改了项目中所有使用 `<Layout>` 的视图文件？
3.  **高度与布局核对 (Height & Layout)**：
    - [ ] **严禁溢出**：侧边栏容器和根布局是否设置了 `overflow: hidden`？
    - [ ] **高度分配验证**：侧边栏内部所有 `Box` 的高度与间距之和是否 **≤ 100%**？
4.  **微观细节核对 (Micro-Details)**：
    - [ ] **Header 细节**：日期格式、时间显示、天气图标是否与 UI 图一致？
    - [ ] **组件完整性**：是否遗漏了任何小图标或状态文字？

## 关键原则 (Critical Rules)

1.  **未提及即清理**：这是本 Skill 的核心，用户没说的可选功能全部干掉。
2.  **显式 Props 准则**：不留任何模糊地带，所有开关必须明示。
3.  **多页面同步**：布局修改是全局性的，严禁只改一个页面。
4.  **组件化优先**：拒绝面条代码，每个卡片都是独立的组件。
5.  **见微知著**：Header/Footer 的任何文字和图标细节都不能放过。
