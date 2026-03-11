# 项目布局架构参考 (Layout Architecture Reference)

## 核心能力 (Core Capabilities)

### 多模态输入解析
- **UI 设计图识别**：自动识别 Header / Footer / Left/Right Sidebar / Tools 各区域；识别比例、导航栏、天气、搜索框等组件。**严禁**在 UI 未体现时显示时间/日期组件。
- **自然语言理解**：意图识别——移动（Move）、新增（Add）、删除（Remove）、调整比例（Resize）。

### 智能导航管理
- **原则**：页面中应当只有一个主路由导航组件生效。
- **自动互斥**：迁移导航位置时，**必须**在新位置新增，并注释掉旧位置代码。

---

## 布局分层架构

项目基于 `src/layout/index.vue`，采用**绝对定位**布局，分为两层：

### 1. 全局外壳 (`src/views/index.vue`)

负责顶部、底部、场景背景和路由入口。

- **Props**：`:header="true" :footer="true" :main="true" :scene="true"`
- **导航模式**：推荐"独步中间"模式——在 Header 组件中央展示主路由导航。

```vue
<template>
  <Layout :header="true" :footer="true" :main="true" :scene="true">
    <template v-slot:header><Header /></template>
    <router-view />
    <template v-slot:scene><Scene /></template>
    <template v-slot:footer><Footer /></template>
  </Layout>
</template>
```

### 2. 业务页面 (`src/views/page_X/page_X_1/index.vue`)

负责侧边栏卡片和局部工具栏。

- **Props**：`:aside="true" :main="true"`（按需开启 `headerTool` 等）
- `aside-left` / `aside-right` 插槽内部必须嵌套 `div.content-left` 或 `div.content-right`。
- 业务组件必须包裹在 `Box` 组件内，且必须设置 `delayTime`（单边侧边栏从上到下依次增加 100ms）。

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

---

## 区域与插槽映射表

| 区域 | 插槽名 | 对应组件示例 | 关键定位信息 (CSS) |
|:---|:---|:---|:---|
| **顶部** | `header` | `src/layout/header.vue` | Top: 0, Z-Index: 2, 宽高比 960/47 |
| **底部** | `footer` | `src/layout/footer.vue` | Bottom: 0, Width: 100%, Padding-bottom: 4.6%, Z-Index: 2 |
| **左侧栏** | `aside-left` | `Box` 组件容器 | Left: 0, Top: 8.5%, Width: 自定义, Height: 89%, Z-Index: 1 |
| **右侧栏** | `aside-right` | `Box` 组件容器 | Right: 0, Top: 8.5%, Width: 自定义, Height: 89%, Z-Index: 1 |
| **顶部工具** | `header-tool` | `headerTool.vue` | Top: 9%, Left: 50%（居中）, Width: 42%, Z-Index: 2 |
| **底部工具** | `footer-tool` | `footerTool.vue` | Bottom: 8%, Left: 50%（居中）, Width: 42%, Z-Index: 2 |
| **左侧工具** | `aside-left-tools` | `sideBarTool.vue` | Left: 22%, Bottom: 8%, Z-Index: 1（左侧栏外侧） |
| **右侧工具** | `aside-right-tools` | `sideBarTool.vue` | Right: 22%, Bottom: 8%, Z-Index: 1（右侧栏外侧） |
| **场景背景** | `scene` | `src/layout/scene.vue` | Full Screen, Z-Index: 0 |

---

## Props 分层管理原则

| 文件 | 管理的 Props |
|:---|:---|
| `src/views/index.vue` | `:header` `:footer` `:main` `:scene` |
| 子页面 `page_X/page_X_1/index.vue` | `:aside` `:main` `:headerTool` `:footerTool` `:leftTools` `:rightTools` |

- **按需开启**：默认 Props 均为 `false`，只显式设置需要的。
- **严禁**在全局 `index.vue` 中开启可能遮挡导航的容器（如 `aside`）。
