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
  - `aside-left" / "aside-right": 内部必须嵌套 `div.content-left`或`div.content-right`。
  - **Box 容器**: 业务组件必须包裹在 `Box` 组件内。
    - **delayTime**: `Box` 组件必须设置 `delayTime`
      属性，值为毫秒数，单边侧边栏从上到下延迟时间依次增加 100。
    - **标题样式**:
      - `<Box>` 组件的标题区域（box-header）**宽度必须为 100%**，与 Box 盒子容器宽度完全一致。
      - 标题文字使用 `<h1>` 标签包裹，靠左对齐，左边距为 10%。
      - 移除任何左右外边距（`margin: 0`）。
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

| 区域         | 插槽名              | 对应组件示例                         | 关键定位信息 (CSS)                                                                |
| :----------- | :------------------ | :----------------------------------- | :-------------------------------------------------------------------------------- |
| **顶部**     | `header`            | `src/layout/header.vue`              | **Top: 0**, Z-Index: 2, 宽高比 960/47                                             |
| **顶部工具** | `header-tool`       | `headerTool.vue`                     | **Top: 9%**, Left: 50% (居中), Width: 42%, Z-Index: 2                             |
| **底部**     | `footer`            | `src/layout/footer.vue`              | **Bottom: 0**, Width: 100%, Padding-bottom: 4.6%, Z-Index: 2                      |
| **底部工具** | `footer-tool`       | `footerTool.vue`                     | **Bottom: 8%**, Left: 50% (居中), Width: 42%, Z-Index: 2                          |
| **左侧栏**   | `aside-left`        | `Box` 组件容器                       | **Left: 0**, Top: 8.5%, Width: 自定义或从 UI 图自动计算, Height: 89%, Z-Index: 1  |
| **右侧栏**   | `aside-right`       | `Box` 组件容器                       | **Right: 0**, Top: 8.5%, Width: 自定义或从 UI 图自动计算, Height: 89%, Z-Index: 1 |
| **左侧工具** | `aside-left-tools`  | `src\components\toolBar\sideBar.vue` | **Left: 22%**, Bottom: 8%, Z-Index: 1 (位于左侧栏外侧)                            |
| **右侧工具** | `aside-right-tools` | `src\components\toolBar\sideBar.vue` | **Right: 22%**, Bottom: 8%, Z-Index: 1 (位于右侧栏外侧)                           |
| **场景背景** | `scene`             | `src/layout/scene.vue`               | Full Screen, Z-Index: 0                                                           |

## 执行流程 (Execution Procedure)

### Step 0: 资源预检查 (Resource Pre-Check)

1.  **调用资源技能文档**：
    - **必须**先完整阅读 `layout-assets` 技能文档，理解所有资源映射规则。
2.  **扫描可用资源**：
    - 使用 `list_dir` 工具检查 `src/assets/images/layout` 目录。
    - 记录所有可用资源文件（`top.png`, `box-bg.png`, `navItem-bg.png` 等）。
3.  **推断布局能力**：
    - 根据已有资源推断当前项目支持的布局元素（如有 `navItem-bg.png` 说明支持底部导航）。
    - 为后续 UI 分析建立"资源基线"，明确哪些元素可以直接应用，哪些需要降级处理。

### Step 1：UI 深度识别与结构解析 (UI Deep Recognition & Structure Analysis)

**此步骤为布局生成的核心，必须细致执行。**

1.  **顶层结构识别**：

    - 识别 Header (顶部)、Footer (底部)、Left/Right Sidebar (侧边栏)、Tools (工具栏)。
    - **关键区分**：哪些是全局外壳（属于 `src/views/index.vue`），哪些是业务页面（属于 `page_X/page_X_1/index.vue`）。

2.  **Header 精细分析**（如存在）：

    - **左侧区域**：识别 Logo、导航栏、或其他元素（如天气组件）。
      - **日期时间区分**：date 指年月日（如 "2024-04-01"），time 指时分秒（如 "16:00"）。
      - **宽度保护**：左侧区域需设置最小宽度（如 `min-width: 300px`）防止内容被挤压。
    - **中间区域**：识别主标题、导航栏、或留空。
    - **右侧区域**：识别用户信息、设置按钮等元素。
    - **资源对应**：根据 Step 0 的资源清单，确认是否有 `top.png`、`header-weather.png`、`header-date.png`、`header-time.png`、`header-setting.png` 等。

3.  **Footer 精细分析**（如存在）：

    - 识别导航按钮数量（通常 4-9 个）。
    - 确认是否有背景装饰图需求。
    - **资源对应**：确认是否有 `navItem-bg.png` 和 `navItem-bg-active.png`。

4.  **侧边栏精细分析**（如存在）：

    - **左侧栏**：
      - 统计卡片（Box）数量（通常 2-4 个）。
      - 记录每个卡片的标题文字和大致高度占比。
      - 识别是否有特殊元素（如"成品率"子卡片）。
    - **右侧栏**：同左侧栏分析方法。
    - **资源对应**：确认是否有 `box-header.png` 和 `box-bg.png`。

5.  **细节元素识别**：

    - **图标**：天气图标、日期图标、时间图标、设置图标等。
    - **分隔线**：Header 中的垂直分隔线等。
    - **文字标签**：如"管理员"、导航按钮文字等。

6.  **比例与定位计算**：

    - 计算 Header 高度占比（宽高比通常为 960/47）。
    - 计算侧边栏宽度占比（通常 19%）。
    - 计算每个 Box 的高度占比（3 个 Box: 28%，4 个 Box: 20%）。

7.  **输出分析结果**：
    - 生成结构化的布局清单，包含所有识别到的元素及其位置。
    - 明确标注哪些元素有对应资源，哪些需要纯 CSS 实现。

### Step 2：定位与边界识别 (Targeting & Boundary Identification)

### Step 2：定位与边界识别 (Targeting & Boundary Identification)

1.  **解析用户输入**：
    - 结合 Step 1 的 UI 分析结果。
    - **明确区分**"业务组件"（需保留/迁移）与"布局容器"（需调整）。
2.  **现状扫描**：

    - 定位 `src/views/index.vue` (全局外壳)。
    - 定位所有子视图 `src/views/page_X/page_X_1/index.vue`。
    - 记录当前 `<Layout>` 的 Props 状态。

3.  **资源匹配确认**：
    - 将 Step 1 识别的元素与 Step 0 的资源清单一一对应。
    - 列出需要应用的资源文件清单。
    - 标注缺失资源（如有）。

### Step 3：标准化配置与页面初始化 (Standardization & Initialization)

### Step 3：标准化配置与页面初始化 (Standardization & Initialization)

1.  **自动化布局生成 (Automated Layout Generation)**：

    - **零手动复制**：根据 Step 1 的分析结果，自动生成完整布局文件结构。
    - **结构标准化**：生成的页面必须包含 `Layout` 根容器、对应插槽、以及 `Box` 组件序列。
    - **目录强制规范**：新增业务页面模块时（如 `page_X/page_X_1`），必须同时创建：
      - `components/` 目录：存放局部业务组件。
      - `mixins/wdpapi.js` 文件：存放 3D 场景交互逻辑。
      - `index.vue` 文件：引入 mixins 并使用 Layout 和 Box 组件。
    - **路由自动注册**：同步在 `src/router/index.js` 中添加路由配置。
    - **代码清理**：保持极简，仅保留布局所需的引用和基础 data。

2.  **制定 Props 策略**：

    - **分层管理原则**：
      - `src/views/index.vue`：仅管理 `:header`, `:footer`, `:main`, `:scene`。
      - 子页面：管理 `:headerTool`, `:footerTool`, `:leftTools`, `:rightTools`, `:aside`, `:main`。
    - **按需开启**：默认 Props 均为 `false`，只显式设置需要的。

3.  **样式提取与高度分配**：

    - 在 `<style scoped>` 中定义 Box 容器的高度。
    - **高度分配规则**：高度**必须**直接分配给 Box 类名（如 `.box-factory`），而非嵌套的 `.box-main-content`。
    - **高度适配规则**（`margin-bottom: 14%` 时）：
      - 3 个 Box：推荐高度 `28%`。
      - 4 个 Box：推荐高度 `20%`。
    - **示例**：
      ```scss
      .box-factory {
        height: 28%;
      }
      ```

4.  **资源应用**（遵循 layout-assets 规范）：
    - 根据 Step 2 的资源匹配清单，应用对应的背景图和图标。
    - **关键点**：
      - `.box-header` 宽度 100%，左对齐，左内边距 10%。
      - 导航按钮根据 `isActive` 动态切换背景图。
      - Header 应用 `top.png` 时设置 `background-size: 100% 100%`。

### Step 4：原子化实施 (Implementation)

### Step 4：原子化实施 (Implementation)

1.  **容器调整**：

    - 使用 CSS 类名控制高度百分比。
    - **关键约束**：`.content-left` 和 `.content-right` 容器**严禁**设置 `height` 属性。

2.  **业务组件迁移**（如需要）：

    - 将业务组件（如 `<ParkTarget>`）完整移动到新的 `Box` 容器中。
    - **零干扰原则**：只移动标签位置，**不触碰**其内部属性或逻辑。

3.  **应用 Props**：
    - 按照分层原则更新视图文件。
    - 全局外壳: `<Layout :header="true" :footer="true" :main="true" :scene="true">`
    - 业务页面: `<Layout :aside="true" :main="true">`

### Step 5：自检与核对 (Verification)

**每次修改后，必须按照以下清单逐项自检：**

- [ ] **资源应用完整性**：
  - 所有 Step 2 识别的资源是否已正确应用？
  - 导航按钮背景图是否根据 `isActive` 动态切换？
- [ ] **全局外壳检查**：
  - `src/views/index.vue` 的 Props 是否正确（`:header="true" :footer="true" :main="true" :scene="true"`）？
  - Header 和 Footer 组件是否已引入、注册并插入到对应插槽？
- [ ] **Box 容器规范**：
  - `.box-header` 宽度是否为 100%？
  - 标题文字是否用 `<h1>` 包裹且左对齐（左内边距 10%）？
  - `.box-header` 外边距是否已清零（`margin: 0`）？
- [ ] \*\*直接设置在 Box 类名上（如 `.box-factory { height: 28%; }`）？
  - `.content-left` 和 `.content-right` 是否**未设置** `height` 属性？
- [ ] **Header 左侧区域**：
  - 是否设置了最小宽度（`min-width`）防止日期时间被挤压？
  - date（年月日）和 time（时分秒）是否正确分离显示
  - 高度是否设置在 `.box-main-content` 而非 `<Box>` 本身？
  - `.content-left` 和 `.content-right` 是否**未设置** `height` 属性？
- [ ] **业务隔离**：
  - 是否只调整了布局容器，未触碰业务组件内部代码？
- [ ] **显式 Props**：
  - 是否遵循分层管理原则？
  - 是否仅开启了需要的 Props（利用默认 false）？
- [ ] **交互安全**：

  - 导航栏是否被其他容器遮挡？
  - 背景装饰图是否设置了 `pointer-events: none`？

- [ ] **编译检查**：
  - 运行 `get_errors` 确认无编译错误。

## ⚠️ 强制执行协议 (Mandatory Enforcement Protocol)

**此协议为最高优先级指令，Agent 在执行任务时必须严格遵守。**

### 1. 边界与核心约束 (Boundaries & Constraints)

1.  **零业务逻辑干扰 (Zero Business Logic Interference)**：
    - **严禁** 修改、移动或重构业务组件（如 `<ParkTarget>`, `<DeviceStatus>`）的内部代码。
    - **仅关注** 布局容器（`<Layout>`, `<Box>`, `<div class="box-main-content">`）及其属性。
    - **纯布局模式**：使用 `<div class="box-main-content"></div>` 作为占位符。
2.  **Box 标题规范**（详见 layout-assets）：
    - `.box-header` 宽度 100%，`margin: 0`。
    - 标题文字用 `<h1>` 包裹，`justify-content: flex-start`，`padding-left: 10%`。
3.  **全量扫描义务**：任何布局调整，**必须**递归检查 `src/views/**/*.vue`。

4.  **依赖安全**：**严禁**引入未安装的第三方库，修改后**必须**确保编译无误。

### 2. 极简与分层原则 (Minimalism & Layering)

5.  **极简删除**：用户未明确提及的布局元素，**必须**显式禁用或利用默认值关闭。

6.  **Props 分层约束**：

    - `index.vue` 仅负责全局框架（header, footer, main, scene）。
    - 子页面负责局部内容（aside, headerTool, footerTool, leftTools, rightTools）。
    - **严禁**在全局 `index.vue` 中开启可能遮挡导航的容器（如 `aside`）。

7.  **交互优先协议**：

    - 导航组件必须位于最高交互层。
    - 背景装饰规则**：高度**必须\*\*直接设置在 Box 类名上（如 `.box-factory { height: 28%; }`），而非嵌套的 `.box-main-content`。

8.  **全局宽度规范**：侧边栏宽度由 `src/layout/index.vue` 统一管理，**严禁**在业务页面中覆盖。

9.  **Header 左侧宽度保护**：必须设置最小宽度（如 `min-width: 300px`）和适当间距（`gap`），防止日期时间内容被挤压 t` 属性。

10. **高度分配唯一性**：高度**仅允许**设置在 `.box-main-content` 上。

11. **全局宽度规范**：侧边栏宽度由 `src/layout/index.vue` 统一管理，**严禁**在业务页面中覆盖。

12. **资源应用规范**（详见 layout-assets）：

    - 导航按钮动态切换：`:src="item.isActive ? require('@images/layout/navItem-bg-active.png') : require('@images/layout/navItem-bg.png')"`
    - Header 应用 `top.png` 时设置 `background-size: 100% 100%`。
    - 资源缺失时直接移除引用，不使用降级方案。

13. **导航 ID 唯一性**：`navList` 中每个导航项**必须**拥有全局唯一的 `id`。

14. **路由与文件联动**：新增页面模块时，**必须**同步完成目录创建、文件生成、路由注册三项操作。

### 3. 流程原子化 (Atomic Workflow)

14. **严格顺序执行**：必须严格按照 [Execution Procedure] 的步骤顺序执行，严禁跳步。

---

## 关键原则 (Critical Rules)

1.  **未提及即清理**：用户没说的可选功能全部干掉。
2.  **显式 Props 准则**：不留任何模糊地带，所有开关必须明示。
3.  **布局与业务分离**：Agent 这里的上帝视角仅限于“排版”，绝不插手“业务”。
4.  **组件化优先**：拒绝面条代码，每个卡片都是独立的组件。
5.  **风格一致性**：项目中所有页面的布局风格（间距、比例、阴影、标题格式等）必须保持高度一致。
