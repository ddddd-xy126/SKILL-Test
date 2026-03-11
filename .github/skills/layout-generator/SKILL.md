---
name: layout-generator
description: B&S二开项目 Layout Agent Skills，支持解析 UI 设计图或自然语言，智能生成项目布局与导航结构。
---

# 布局生成器技能 (Layout Generator Skill)

## 用户输入约束 (User Input Constraints)

为了保证布局生成器准确运行，**必须**在执行任何布局生成步骤之前，使用 `ask_questions` 工具向用户收集以下关键信息。

### 强制提问流程 (Mandatory Question Flow)

**🔴 最高优先级**：调用本技能时，第一步必须调用 `ask_questions` 工具，按以下规格提问，**严禁**跳过或合并省略。

#### 问题 1  一级路由
- **问题文本**：是否存在一级路由？请按格式填写（多个用逗号分隔）：`page_1:概览, page_2:监控, page_3:管理`。若无一级路由，请留空跳过。
- **输入类型**：`allowFreeformInput: true`，无预设选项。

#### 问题 2  二级路由
- **问题文本**：是否存在二级路由？请按格式填写：`page_1  page_1_1:数据总览, page_1_2:趋势分析`。若无二级路由，请留空跳过。
- **输入类型**：`allowFreeformInput: true`，无预设选项。

#### 问题 3  工具栏配置
- **问题文本**：默认已包含 `header` / `footer` / `aside-left` / `aside-right`。以下工具栏默认**不启用**，请勾选需要额外启用的工具栏：
- **输入类型**：`multiSelect: true`，选项如下：

  | 选项标签 | 描述 |
  |---|---|
  | `顶部工具栏 (header-tool)` | 叠加在顶部导航上方的交互工具区 |
  | `底部工具栏 (footer-tool)` | 叠加在底部导航上方的交互工具区 |
  | `左侧工具栏 (aside-left-tools)` | 位于左侧面板外侧的垂直工具条 |
  | `右侧工具栏 (aside-right-tools)` | 位于右侧面板外侧的垂直工具条 |

#### 问题 4  UI 设计图
- **问题文本**：请上传 UI 设计图（支持截图粘贴或图片文件拖入）。若暂无设计图，请留空跳过，技能将仅根据路由和工具栏配置生成基础布局骨架。
- **输入类型**：`allowFreeformInput: true`，无预设选项。
- **用途说明**：UI 图将用于 Step 1 的深度识别，提取 Header/Footer/侧边栏的精确布局、比例、组件细节及资源对应关系。

### 输入处理规则

1. **路由结构**：一级 `page_X:中文名`；二级 `page_X  page_X_Y:子页名`，必须明确归属父级；用户留空 = 该层级路由不存在。
2. **工具栏配置**：`header` / `footer` / `aside-left` / `aside-right` 默认存在（props 一律 `true`）；用户未勾选的工具栏 props 一律设为 `false`。
3. **UI 设计图**：有图模式  执行完整 Step 1（识别结果覆盖冲突项，资源名称优先级最高）；无图模式  跳过 Step 1，仅生成基础骨架。

在收集完以上所有输入之后，技能才会继续执行后续步骤（Step 0 起）。

---

## 执行流程概览 (Execution Overview)

严格按顺序执行，禁止跳步。详细规范见 [references/execution-steps.md](references/execution-steps.md)。

| 步骤 | 名称 | 触发条件 |
|------|------|----------|
| **Step 0** | 资源预检查 | 始终执行，读取 `layout-assets` 技能并扫描 `src/assets/images/layout` |
| **Step 1** | UI 深度识别 | 仅有图模式执行；无图模式跳过 |
| **Step 2** | 定位、生成与资源应用 | 始终执行 |
| **Step 4** | 自检与核对 | 每次修改后执行 |

> **布局架构参考**：执行前先阅读 [references/layout-architecture.md](references/layout-architecture.md)，了解全局外壳与业务页面的分层结构和插槽映射表。

> **强制执行协议**：所有操作必须遵守 [references/enforcement-protocol.md](references/enforcement-protocol.md) 中的 19 条规则。执行前**必须**先读取该文件。

---

## 关键原则 (Critical Rules)

1. **未提及即清理**：用户没说的可选功能全部干掉。
2. **显式 Props 准则**：不留任何模糊地带，所有开关必须明示。
3. **布局与业务分离**：Agent 的职责仅限于排版，绝不插手业务。
4. **组件化优先**：拒绝面条代码，每个卡片都是独立的组件。
5. **风格一致性**：项目中所有页面的布局风格（间距、比例、阴影、标题格式等）必须保持高度一致。
