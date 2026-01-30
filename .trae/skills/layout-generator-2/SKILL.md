---
name: layout-generator
description: B&S二开项目 Layout Agent Skills，支持解析 UI 设计图或自然语言，智能修改项目布局与导航结构。
---

# 布局生成器技能 (Layout Generator Skill)

## 核心能力 (Core Capabilities)

### 1. 多模态输入解析

- **UI 设计图识别**：
  - **自动识别区域**：Header (顶部)、Footer (底部)、Left/Right Sidebar (左右侧边栏)、Tools (工具栏)。
  - **比例计算**：分析侧边栏内卡片（Box）的高度占比。
  - **组件识别**：识别导航栏、天气、搜索框等布局元素。
- **自然语言理解**：
  - 意图识别：移动（Move）、新增（Add）、删除（Remove）、调整比例（Resize）。

### 2. 智能导航管理

- **原则**：页面中应当只有一个主路由导航组件生效。
- **自动互斥**：当迁移导航位置时，**必须**在新位置新增并注释掉旧位置代码。

## 项目布局架构 (Layout Architecture)

项目基于 `src/layout/index.vue` 提供核心结构，采用 **绝对定位 (Absolute Positioning)** 布局。

### 区域与插槽映射表

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

### Step 1：定位与边界识别 (Targeting & Boundary Identification)

1.  **解析输入**：
    - 识别 UI 图/文本中的 Header, Footer, Sidebar 结构。
    - **关键：** 明确区分“业务组件”（需保留/迁移）与“布局容器”（需调整）。
2.  **现状扫描**：
    - 定位 `src/views/index.vue` (全局) 和所有子视图 `src/views/page_X/page_X_1/index.vue`。
    - 记录当前 `<Layout>` 的 Props 状态。

### Step 2：标准化配置 (Standardization)

1.  **制定 Props 策略**：
    - 根据需求决定 9 大 Props 的 `true/false`。
    - **分层原则**：`src/views/index.vue` 控制全局结构，子页面控制局部工具。
2.  **清理清单**：
    - 列出需要移除的插槽内容（基于极简原则）。

### Step 3：原子化实施 (Implementation)

1.  **容器调整**：
    - 使用 CSS 类名控制高度百分比，**严禁**直接在 `Box` 组件上使用 `:height` 属性。
    - 调整 `Box` 容器结构以适配 UI 比例。
2.  **业务组件迁移**：
    - 将业务组件（如 `<ParkTarget>`）完整移动到新的 `Box` 容器中。
    - **注意**：只移动标签位置，**不触碰**其内部属性或逻辑。
3.  **应用 Props**：
    - 批量更新所有视图文件的 `<Layout>` 标签，确保 9 个 Props 全部显式设置。
    - ```vue
      <Layout
        :header="true" :footer="false" :aside="true" :main="true" :scene="true"
        :headerTool="false" :footerTool="false" :leftTools="false" :rightTools="true"
      >
      ```

### Step 4：自检与核对 (Verification)

**每次修改后，必须按照以下清单逐项自检，并在回复中确认：**

- [ ] **业务隔离 (Business Isolation)**：
  - 确认没有修改任何 `<ParkTarget>` 等业务组件的内部代码？
  - 确认只调整了外部的 `Box` 和 `div` 容器？
- [ ] **全量同步 (Global Sync)**：
  - 是否检查了项目下**所有**的 `src/views/**/*.vue` 文件？
- [ ] **显式 Props (Explicit Props)**：
  - 所有页面的 `<Layout>` 是否都显式设置了 9 个核心 Props？
- [ ] **极简清理 (Minimalism)**：
  - 用户未提及的工具栏/插槽是否已全部移除？
- [ ] **高度安全 (Height Safety)**：
  - 侧边栏内容高度之和是否 <= 100%？
  - 是否使用了 CSS 类名而非行内样式控制高度？

## ⚠️ 强制执行协议 (Mandatory Enforcement Protocol)

**此协议为最高优先级指令，Agent 在执行任务时必须严格遵守。**

### 1. 边界与核心约束 (Boundaries & Constraints)

1.  **零业务逻辑干扰 (Zero Business Logic Interference)**：
    - **严禁** 修改、移动或重构页面内部的具体业务组件（如 `<ParkTarget>`, `<DeviceStatus>` 等）及其逻辑。
    - **仅关注** 布局容器（`<Layout>`, `<Box>`, `<div class="box-main-content">`）及其属性。
    - 将所有业务组件视为**黑盒**，仅调整其外部容器的大小、位置和插槽归属。
2.  **全量扫描义务 (Global Scan)**：任何布局调整，**必须** 递归检查 `src/views/**/*.vue`，确保所有页面的 `<Layout>` 配置保持一致。
3.  **依赖安全 (Dependency Safety)**：**严禁** 引入未安装的第三方库。修改后**必须**确保编译无误。

### 2. 极简与显式原则 (Minimalism & Explicit Props)

4.  **极简删除 (Delete-by-Default)**：用户未明确提及的布局元素（如 Tools 工具栏），**必须** 在所有页面中显式禁用并清理插槽。
5.  **显式 Props 硬约束 (Explicit Props)**：在 `<Layout>` 组件上，**必须** 显式设置所有 9 个核心 Props，严禁依赖默认值：
    - `:header`, `:footer`, `:aside`, `:main`, `:scene`
    - `:headerTool`, `:footerTool`, `:leftTools`, `:rightTools`

### 3. 流程原子化 (Atomic Workflow)

6.  **严格顺序执行**：必须严格按照 [Execution Procedure] 的步骤顺序执行，严禁跳步。

---

## 关键原则 (Critical Rules)

1.  **未提及即清理**：用户没说的可选功能全部干掉。
2.  **显式 Props 准则**：不留任何模糊地带，所有开关必须明示。
3.  **布局与业务分离**：Agent 这里的上帝视角仅限于“排版”，绝不插手“业务”。
4.  **组件化优先**：拒绝面条代码，每个卡片都是独立的组件。
