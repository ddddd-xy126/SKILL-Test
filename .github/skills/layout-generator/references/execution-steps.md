# 执行步骤详细规范 (Execution Steps)

## Step 0：资源预检查 (Resource Pre-Check)

🔴 **最高优先级：资源名称即布局定义**

1. **调用资源技能文档**：必须先完整阅读 `layout-assets` 技能文档，理解所有资源映射规则。
2. **扫描可用资源**：使用 `list_dir` 工具检查 `src/assets/images/layout` 目录，记录所有可用文件（`top.png`, `box-bg.png`, `navItem-bg.png` 等）。
3. **资源名称强制绑定**（优先级高于 UI 视觉识别）：
   - 发现 `rightTool-bg.png` → **必须**启用 `:rightTools="true"`
   - 发现 `leftTool-bg.png` → **必须**启用 `:leftTools="true"`
   - 发现 `headerTool-bg.png` → **必须**启用 `:headerTool="true"`
   - 发现 `footerTool-bg.png` → **必须**启用 `:footerTool="true"`
   - **严禁跨位置复用**：`rightTool` 资源不得用于底部/顶部/左侧工具栏。
4. **推断布局能力**：根据已有资源建立"资源基线"，明确哪些元素可以直接应用。

---

## Step 1：UI 深度识别与结构解析（有图模式专属）

**此步骤为布局生成的核心，必须细致执行。无图模式跳过此步骤。**

### 顶层结构识别
- 识别 Header / Footer / Left/Right Sidebar / Tools。
- **关键区分**：哪些属于全局外壳（`src/views/index.vue`），哪些属于业务页面（`page_X/page_X_1/index.vue`）。

### Header 精细分析
- **⚠️ 强制约束**：Header 实现必须 100% 遵循 UI 分析结果，**严禁**擅自添加或保留分析中未提及的任何元素。
  - ❌ 反例：UI 分析说"中间显示标题，右上角显示天气"，实现时还保留了左侧区域的日期组件。
  - ✅ 正例：UI 分析说什么就实现什么，多一个少一个元素都不行。

- **标题布局规则**（根据 UI 分析结果动态调整）：
  - **居中布局**：父容器用 `justify-content: center`，其他元素用 `position: absolute` 定位，**严禁**给居中元素设置固定宽度。
  - **居左布局**：父容器用 `justify-content: space-between` 或 `flex-start`。
  - ⚠️ 常见错误：用 `space-between` 却期望"中间元素"居中（实际会靠左）。

- **左侧区域**：识别 Logo、导航栏或其他元素。
  - **日期时间实现关键**：
    - `getCurrentFormattedDateRobust()` 返回 `[年月日, 时分秒, 星期几]`
    - `date.vue` → 使用索引 `[0]` 显示年月日
    - `time.vue` → 使用索引 `[1]`，截取前 5 位（HH:MM）去掉秒数
    - **严禁**使用索引 `[2]`（会显示星期几）
  - 左侧区域需设置 `min-width`（如 `min-width: 300px`）防止内容被挤压。
  - Logo **严禁**设置 `font-size` 属性。

- **中间区域**：识别主标题、导航栏或留空。使用 `NavItem` 组件时，prop 名必须为 `:item`（**严禁**用 `:navData`）。
- **右侧区域**：识别用户信息、设置按钮等元素。
- **资源对应**：确认是否有 `top.png`、`header-weather.png`、`header-date.png`、`header-time.png`、`header-setting.png`。

### Footer 精细分析
- 识别导航按钮数量（通常 4–9 个）。
- 资源对应：确认是否有 `navItem-bg.png` 和 `navItem-bg-active.png`。

### 侧边栏精细分析
- 统计每侧 Box（卡片）数量，记录标题文字和大致高度占比。
- 资源对应：确认是否有 `box-header.png` 和 `box-bg.png`。

### 比例与定位计算
- Header 高度占比（宽高比通常为 960/47）。
- 侧边栏宽度占比（通常 19%）。
- Box 高度占比（3 个 Box: 28%，4 个 Box: 20%）。

### 输出分析结果
- 生成结构化布局清单，明确标注哪些元素有对应资源，哪些需纯 CSS 实现。

---

## Step 2：定位、生成与资源应用

### 现状扫描
- 定位 `src/views/index.vue`（全局外壳）。
- 定位所有子视图 `src/views/page_X/page_X_1/index.vue`。
- 记录当前 `<Layout>` 的 Props 状态。

### 资源匹配确认
- 将 Step 1 识别的元素与 Step 0 的资源清单一一对应，列出资源文件清单，标注缺失资源。

### 自动化布局生成
- **结构标准化**：生成的页面必须包含 `Layout` 根容器、对应插槽、`Box` 组件序列。
- **目录强制规范**：新增业务页面模块（如 `page_X/page_X_1`）时，必须同时创建：
  - `components/` 目录：存放局部业务组件。
  - `mixins/wdpapi.js` 文件：存放 3D 场景交互逻辑。
  - `index.vue` 文件：引入 mixins 并使用 Layout 和 Box 组件。
- **路由自动注册**：同步在 `src/router/index.js` 中添加路由配置。
- **代码清理**：保持极简，仅保留布局所需的引用和基础 data。

### 资源应用关键点
- `.box-header` 宽度 100%，左对齐，左内边距 10%。
- 导航按钮根据 `isActive` 动态切换背景图：
  `:src="item.isActive ? require('@images/layout/navItem-bg-active.png') : require('@images/layout/navItem-bg.png')"`
- Header 应用 `top.png` 时设置 `background-size: 100% 100%`。

---

## Step 4：自检与核对 (Verification)

每次修改后，按以下清单逐项自检：

- [ ] **资源完整性**：Step 2 识别的资源是否全部正确应用？导航按钮是否根据 `isActive` 动态切换？
- [ ] **全局外壳**：`src/views/index.vue` Props 是否为 `:header="true" :footer="true" :main="true" :scene="true"`？Header / Footer 组件是否已引入并插入对应插槽？
- [ ] **Box 规范**：`.box-header` 宽度是否为 100%？标题是否用 `<h1>` 包裹且左对齐（左内边距 10%）？外边距是否清零（`margin: 0`）？
- [ ] **高度分配**：高度是否直接设置在 Box 类名上？`.content-left` 和 `.content-right` 是否**未设置** `height`？
- [ ] **Header 左侧区域**：是否设置了 `min-width`？date / time 索引是否正确？
- [ ] **业务隔离**：是否只调整了布局容器，未触碰业务组件内部代码？
- [ ] **显式 Props**：是否遵循分层管理原则？是否仅开启了需要的 Props？
- [ ] **交互安全**：导航栏是否被其他容器遮挡？背景装饰图是否设置了 `pointer-events: none`？
- [ ] **编译检查**：运行 `get_errors` 确认无编译错误，无重复 import 语句。
