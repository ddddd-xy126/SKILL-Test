---
name: layout-assets-generator
description: B&S二开项目布局资源管理技能，支持根据固定规范自动应用布局背景图与图标。
---

# 布局资源管理技能 (Layout Assets Skill)

## 核心原则 (Core Principles)

### 1. 资源路径规范

所有布局相关的核心资源必须存放于 `src/assets/images/layout` 目录下。

### 2. 资源命名与映射

| 资源名称             | 映射位置                                      | 关键用途                     |
| :------------------- | :-------------------------------------------- | :--------------------------- |
| `top.png`            | `src/layout/header.vue`                       | 顶部 Header 整体背景图       |
| `box-bg.png`         | `src/layout/box.vue`                          | `.box-main` 区域背景图       |
| `box-header.png`     | `src/layout/box.vue`                          | `.box-header` 标题区域背景图 |
| `nav-bg.png`         | `src/components/header/navItem-header.vue`    | 导航按钮背景图               |
| `header-weather.png` | `src/components/header/setting/weather.vue`   | 顶部天气模块图标             |
| `header-setting.png` | `src/components/header/setting/selection.vue` | 顶部设置模块图标             |
| `mask.png`           | `src/layout/index.vue`                        | 遮罩图                       |

### 3. 条件应用机制 (Conditional Application)

- **存在即应用**：在生成或调整布局代码时，必须首先确认 `src/assets/images/layout` 目录下是否存在对应资源。
- **不存在即移除**：若目录下无对应命名的资源，**严禁**在代码中出现任何形式的引用（包括 CSS `url()`、HTML `<img>` 或 JS `require/import`）。
- **静态分析优先**：**严禁**使用 `try...catch` 等运行时逻辑来规避资源缺失问题。Webpack/Vite 会在编译阶段进行静态分析，任何不存在的资源引用都会导致构建失败。
- **强制校验流程**：在编写任何资源引用代码前，必须先通过 `LS` 工具确认资源文件确实存在。

## 执行指南 (Execution Guidelines)

### 1. Header 样式应用

在 `header.vue` 中应用 `top.png`：

- **比例调整**：`src/layout/index.vue` 中的 Header 宽高比必须设置为 `960 / 47`。
- **拉伸控制**：`top.png` 不应设置 `background-size: 100% 100%` 以防变形。

```scss
.header {
  background-image: url("~@images/layout/top.png");
  background-size: 100% 100%;
}
```

### 2. Box 样式应用

在 `box.vue` 中应用 `box-header.png` 和 `box-bg.png`：

- **宽度修正**：Box 标题栏宽度必须设置为 100% 以匹配下方的 Box 容器，且需移除左右外边距。
- **背景移除**：应用背景图时，必须显式移除原有的 `background-color`。

```scss
.box-header {
  width: 100%; // 强制全宽
  margin: 0; // 清除边距
  background-image: url("~@images/layout/box-header.png");
  background-size: 100% 100%;
  justify-content: flex-start; // 标题文本靠左
  padding-left: 10%; // 距离左侧 10%
}
.box-main {
  background-image: url("~@images/layout/box-bg.png");
  background-size: 100% 100%;
  // background-color: ...; // 必须移除背景色
}
```

### 3. 导航样式应用

在 `navItem-header.vue` 中应用 `nav-bg.png`：

```vue
<img class="bgImg" src="@images/layout/nav-bg.png" alt="" />
```

### 4. 天气图标应用

在 `weather.vue` 中应用 `header-weather.png`：

```vue
<img src="@images/layout/header-weather.png" alt="">
```

## ⚠️ 强制约束

- **严禁重复定义**：若资源已应用，确保不会与其他背景图样式冲突。
- **路径准确性**：统一使用别名路径（如 `@images/layout/...` 或 `~@images/layout/...`）。
- **零干扰原则**：应用资源时不应修改组件原有的业务逻辑或 Props。
