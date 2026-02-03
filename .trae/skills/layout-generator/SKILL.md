---
name: layout-generator
description: B&S二开项目 Layout Agent Skills，支持解析 UI 设计图或自然语言，智能生成项目布局与导航结构。
---

# 布局生成器技能 (Layout Generator Skill)

## 核心能力 (Core Capabilities)

### 1. 多模态输入解析

- **UI 设计图识别**：
  - **自动识别区域**：Header (顶部)、Footer (底部)、Left/Right Sidebar (左右侧边栏)、Tools (工具栏)。
  - **严格识别顶部元素**：必须识别并区分 Logo (左侧)、主路由导航栏 (中间)、天气组件 (右侧)。**严禁**在 UI 未体现时显示时间/日期组件。
  - **比例计算**：分析侧边栏内卡片（Box）的高度占比。
  - **组件识别**：识别导航栏、天气、搜索框等布局元素。
- **自然语言理解**：
  - 意图识别：移动（Move）、新增（Add）、删除（Remove）、调整比例（Resize）。

### 2. 智能导航管理

- **原则**：页面中应当只有一个主路由导航组件生效。
- **自动互斥**：当迁移导航位置时，**必须**在新位置新增并注释掉旧位置代码。

## 项目布局架构 (Layout Architecture)

项目基于 `src/layout/index.vue` 提供核心结构，采用 **绝对定位 (Absolute Positioning)** 布局。布局分为 **全局外壳 (Global Shell)** 和 **业务页面 (Business Page)** 两层。

### 1. 全局外壳 (src/views/index.vue)

负责应用的基础框架，包括顶部、底部、场景背景和路由入口。

- **Props**: `:header="true" :footer="true" :main="true" :scene="true"`
- **导航模式**：推荐采用“独步中间”模式，即在 `Header` 组件中央展示主路由导航。
- **关键结构**:
  ```vue
  <template>
    <Layout :header="true" :footer="true" :main="true" :scene="true">
      <template v-slot:header><Header /></template>
      <router-view />
      <!-- 业务页面注入点 -->
      <template v-slot:scene><Scene /></template>
      <template v-slot:footer><Footer /></template>
    </Layout>
  </template>
  ```

### 2. 业务页面 (src/views/page_X/page_X_1/index.vue)

负责具体的侧边栏卡片和局部工具栏。

- **Props**: `:aside="true" :main="true"` (按需开启 `headerTool` 等)
- **标准插槽结构**:
  - `aside-left" / "aside-right": 内部必须嵌套 `div.content-left` 或 `div.content-right`。
  - **Box 容器**: 业务组件必须包裹在 `Box` 组件内。
    - **delayTime**: `Box` 组件必须设置 `delayTime`
      属性，值为毫秒数，单边侧边栏从上到下延迟时间依次增加 100。
    - **标题样式**: `<Box>` 组件的标题区域必须为 100% 宽度，且标题文字必须靠左对齐，左边距为 10%。
- **关键结构**:
  ```vue
  <template>
    <Layout :aside="true" :main="true">
      <template v-slot:aside-left>
        <div class="content-left">
          <Box class="custom-class" position="left" :delayTime="200">
            <template v-slot:header><h1>标题</h1></template>
            <div class="box-main-content"><!-- 占位或业务组件 --></div>
          </Box>
        </div>
      </template>
    </Layout>
  </template>
  ```

### 区域与插槽映射表

| 区域         | 插槽名              | 对应组件示例                       | 关键定位信息 (CSS)                                           |
| :----------- | :------------------ | :--------------------------------- | :----------------------------------------------------------- |
| **顶部**     | `header`            | `src/layout/header.vue`            | **Top: 0**, Z-Index: 2, 宽高比 960/47                        |
| **顶部工具** | `header-tool`       | `headerTool.vue`                   | **Top: 9%**, Left: 50% (居中), Width: 42%, Z-Index: 2        |
| **底部**     | `footer`            | `src/layout/footer.vue`            | **Bottom: 0**, Width: 100%, Padding-bottom: 4.6%, Z-Index: 2 |
| **底部工具** | `footer-tool`       | `footerTool.vue`                   | **Bottom: 8%**, Left: 50% (居中), Width: 42%, Z-Index: 2     |
| **左侧栏**   | `aside-left`        | `Box` 组件容器                     | **Left: 0**, Top: 8.5%, Width: 25%, Height: 89%, Z-Index: 1  |
| **右侧栏**   | `aside-right`       | `Box` 组件容器                     | **Right: 0**, Top: 8.5%, Width: 25%, Height: 89%, Z-Index: 1 |
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

### Step 2：标准化配置与页面初始化 (Standardization & Initialization)

1.  **自动化布局生成 (Automated Layout Generation)**：
    - **零手动复制**：新增页面时，Agent 必须根据用户需求自动生成符合 `src/views/page_X/page_X_1/index.vue` 规范的完整布局文件结构，严禁要求用户手动复制粘贴。
    - **结构标准化**：生成的页面必须包含 `Layout` 根容器、`aside-left/right` 插槽、以及内部的 `Box` 组件序列。
    - **目录强制规范**：新增业务页面模块时（如 `page_X/page_X_1`），必须同时创建以下目录和文件：
      - `components/` 目录：用于存放该页面的局部业务组件。
      - `mixins/wdpapi.js` 文件：用于存放该页面的 3D 场景交互逻辑。
      - `index.vue` 文件：必须引入 `mixins/wdpapi.js` 并使用 `Layout` 和 `Box` 组件。
    - **路由自动注册**：在生成文件后，必须同步在 `src/router/index.js` 中添加对应的路由配置。
    - **代码清理**：生成的 `index.vue` 必须保持极简，仅保留布局所需的 `components` 引用和基础 `data`，严禁携带其他页面的业务逻辑。
2.  **制定 Props 策略**：
    - **分层管理原则**：
      - `src/views/index.vue`：仅管理全局核心 Props (`:header`, `:footer`, `:main`, `:scene`)。
      - 子页面 (如 `src/views/page_X/.../index.vue`)：管理工具栏和局部内容 Props (`:headerTool`, `:footerTool`, `:leftTools`, `:rightTools`, `:aside`, `:main`)。
    - **按需开启**：由于 `Layout.vue` 默认 Props 均为 `false`，只需显式设置需要为 `true` 的 Props。
3.  **样式提取**：
    - 在 `<style scoped>` 中定义 `.box-main-content` 的高度（如 `height: 22rem`），严禁直接在组件或外层 Box 上写高度。
    - **高度分配原则**：高度**必须**分配给 `.box-main-content` 容器，而非 `<Box>` 组件本身，以确保卡片阴影和边框渲染正常。
4.  **清理清单**：
    - 列出需要移除的插槽内容（基于极简原则）。

### Step 3：原子化实施 (Implementation)

1.  **容器调整**：
    - 使用 CSS 类名控制高度百分比。
    - **高度适配规则**：当 `Box` 组件默认 `margin-bottom` 为 `14%` 时：
      - 3 个 Box 布局：推荐高度为 `28%`。
      - 4 个 Box 布局：推荐高度为 `20%`。
    - **关键约束**：`.content-left` 和 `.content-right` 容器**严禁**设置 `height` 属性。
2.  **业务组件迁移**：
    - 将业务组件（如 `<ParkTarget>`）完整移动到新的 `Box` 容器中。
    - **注意**：只移动标签位置，**不触碰**其内部属性或逻辑。
3.  **应用 Props**：
    - 按照分层原则更新视图文件。
    - 示例：
      - `index.vue`: `<Layout :header="true" :main="true" :scene="true">`
      - 子页面: `<Layout :aside="true" :main="true">`

### Step 4：自检与核对 (Verification)

**每次修改后，必须按照以下清单逐项自检，并在回复中确认：**

- [ ] **高度安全 (Height Safety)**：
  - 侧边栏内容高度之和 + 默认间距是否 <= 100%？
  - 是否使用了 CSS 类名而非行内样式控制高度？
- [ ] **业务隔离 (Business Isolation)**：
  - 确认没有修改任何 `<ParkTarget>` 等业务组件的内部代码？
  - 确认只调整了外部的 `Box` 和 `div` 容器？
- [ ] **全量同步 (Global Sync)**：
  - 是否检查了项目下**所有**的 `src/views/**/*.vue` 文件？
- [ ] **显式 Props (Explicit Props)**：
  - 是否遵循分层管理原则设置了 Props？
  - 是否仅开启了需要的 Props（利用默认 false）？
- [ ] **交互安全 (Interactive Safety)**：
  - 导航栏等高频交互区域是否被 `aside` 或 `main` 容器遮挡？
  - 关键点击区域是否设置了 `pointer-events: auto` 且其背景图为 `none`？
- [ ] **极简清理 (Minimalism)**：
  - 用户未提及的工具栏/插槽是否已全部移除？
- [ ] **高度安全 (Height Safety)**：
  - 侧边栏内容高度之和是否 <= 100%？
  - 是否使用了 CSS 类名而非行内样式控制高度？
  - **确认 `.content-left` 和 `.content-right` 容器没有设置 `height` 属性？**

## ⚠️ 强制执行协议 (Mandatory Enforcement Protocol)

**此协议为最高优先级指令，Agent 在执行任务时必须严格遵守。**

### 1. 边界与核心约束 (Boundaries & Constraints)

1.  **零业务逻辑干扰 (Zero Business Logic Interference)**：
    - **严禁** 修改、移动或重构页面内部的具体业务组件（如 `<ParkTarget>`, `<DeviceStatus>` 等）及其逻辑。
    - **仅关注** 布局容器（`<Layout>`, `<Box>`, `<div class="box-main-content">`）及其属性。
    - **纯布局模式**：在生成或调整布局阶段，应使用 `<div class="box-main-content"></div>` 作为占位符，而非直接引入业务组件，以确保布局的纯粹性和高度可控性。
    - **标题规范**：`<Box>` 组件的 `header` 插槽内容**必须**使用 `<h1>` 标签包裹标题文字。
2.  **全量扫描义务 (Global Scan)**：任何布局调整，**必须** 递归检查 `src/views/**/*.vue`，确保所有页面的 `<Layout>` 配置保持一致。
3.  **依赖安全 (Dependency Safety)**：**严禁** 引入未安装的第三方库。修改后**必须**确保编译无误。

### 2. 极简与分层原则 (Minimalism & Layering)

4.  **极简删除 (Delete-by-Default)**：用户未明确提及的布局元素，**必须** 显式禁用或利用默认值关闭。
5.  **Props 分层约束 (Layered Props Constraint)**：
    - `index.vue` 仅负责外层大框架显影。
    - 子页面负责具体工具栏及局部内容。
    - **严禁** 在全局 `index.vue` 中开启可能遮挡导航的透明容器（如 `aside`）。
6.  **交互优先协议 (Interactive Priority)**：
    - 导航组件必须位于最高交互层。
    - 背景装饰图必须设置 `pointer-events: none` 以防拦截点击事件。
7.  **容器高度禁令**：严禁在 `.content-left` 和 `.content-right` 容器上设置任何高度属性（包括 `height: 100%`）。
8.  **高度分配唯一性**：业务页面的高度属性**仅允许**设置在 `.box-main-content` 容器上，严禁作用于 `<Box>` 或其父级 `div`。
9.  **全局宽度规范**：侧边栏宽度由 `src/layout/index.vue` 统一管理，**严禁**在业务页面中使用 `::v-deep` 或行内样式覆盖全局侧边栏宽度。
10. **Logo 样式禁令**：Header 中的 `.logo` 标题**严禁**重新设置 `font-size`（如 `font-size: var(--font-size-X)`），必须保持全局样式一致。
11. **Header 背景规范**：Header 容器应用 `top.png` 背景时，**严禁**设置 `background-repeat`、`background-position` 或 `background-size: 100% 100%` 属性。
12. **导航 ID 唯一性**：`navList` 中的每个导航项**必须**拥有全局唯一的 `id`。严禁重复使用 ID，以防点击时触发多个导航项的激活状态。
13. **资源缺失处理**：若 `layout` 目录下缺失对应资源，**严禁**使用降级方案，直接移除相关背景图或图片引用。对于动态资源，必须在 JS 中进行存在性校验。
14. **Header 布局精确定位**：
    - **Logo**：左对齐，宽度约 32%，字号 `3.2rem`，带文字阴影。
    - **导航**：居中对齐，内边距 `0 5%`，项间距 `2%`，文字 `1.8rem`。
    - **天气**：右对齐，保留 `1%` 右内边距。
15. **路由与文件联动**：新增页面模块时，**必须**同步完成“目录创建”、“index.vue 文件生成”及“`src/router/index.js` 路由注册”三项操作，严禁出现有路由无文件或有文件无路由的情况。

### 3. 流程原子化 (Atomic Workflow)

6.  **严格顺序执行**：必须严格按照 [Execution Procedure] 的步骤顺序执行，严禁跳步。

---

## 关键原则 (Critical Rules)

1.  **未提及即清理**：用户没说的可选功能全部干掉。
2.  **显式 Props 准则**：不留任何模糊地带，所有开关必须明示。
3.  **布局与业务分离**：Agent 这里的上帝视角仅限于“排版”，绝不插手“业务”。
4.  **组件化优先**：拒绝面条代码，每个卡片都是独立的组件。
5.  **风格一致性**：项目中所有页面的布局风格（间距、比例、阴影、标题格式等）必须保持高度一致。
