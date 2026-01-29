## 📋 项目概述
这是一个专为大屏显示设计的前端项目，采用响应式布局和模块化组件设计，支持多页面切换和丰富的图表展示功能。项目基于 Vue2 技术栈，集成了 ECharts、AntV G2 等数据可视化库。

## 🚀 技术栈
- 框架 : Vue 2.6.11
- UI组件库 : Element UI 2.15.14
- 图表库 :
  - ECharts 5.5.0 (2D/3D图表)
  - ECharts GL 2.0.9 (3D图表增强)
  - AntV G2 5.2.12 (统计图表)
- 路由 : Vue Router 3.5.2
- 状态管理 : Vuex 3.6.2
- HTTP客户端 : Axios 1.6.8
- 样式预处理 : Sass
- 构建工具 : Vue CLI 4.2.3



📁 项目结构
xxx-template/
├── public/                    # 静态资源
│   ├── config.json           # 配置文件
│   ├── index.html            # HTML模板
│   └── static/               # 静态文件
├── src/
│   ├── App.vue               # 根组件
│   ├── main.js               # 入口文件
│   ├── assets/               # 资源文件
│   │   ├── css/              # 样式文件
│   │   │   ├── main.scss     # 主样式文件
│   │   │   ├── font.scss     # 字体样式
│   │   │   ├── dialog.scss   # 弹窗样式
│   │   │   └── table.scss    # 表格样式
│   │   ├── fonts/            # 字体文件
│   │   └── images/           # 图片资源
│   ├── components/           # 公共组件
│   │   ├── antvCharts/       # AntV图表组件
│   │   ├── echarts/          # ECharts图表组件
│   │   │   └── index_3DPie.vue # 3D饼图组件
│   │   ├── header/           # 头部组件
│   │   ├── rtsp/             # 视频流组件
│   │   └── searchInput.vue   # 搜索输入组件
│   ├── layout/               # 布局组件
│   │   ├── index.vue         # 主布局组件
│   │   ├── box.vue           # 容器组件
│   │   ├── header.vue        # 头部布局
│   │   ├── footer.vue        # 底部布局
│   │   └── scene.vue         # 场景布局
│   ├── views/                # 页面组件
│   │   ├── index.vue         # 主页面
│   │   ├── page_1/           # 第一个页面模块
│   │   ├── page_2/           # 第二个页面模块
│   │   ├── page_3/           # 第三个页面模块
│   │   └── page_4/           # 第四个页面模块
│   ├── router/               # 路由配置
│   │   └── index.js          # 路由定义
│   ├── store/                # Vuex状态管理
│   │   └── index.js          # 状态定义
│   ├── utils/                # 工具函数
│   │   ├── api/              # API接口
│   │   ├── request.js        # HTTP请求封装
│   │   ├── custom.js         # 自定义工具
│   │   └── wdpapi/           # WDP API
│   ├── mixins/               # 混入
│   │   ├── echartsMixin.js   # ECharts混入
│   │   └── tableMixin.js     # 表格混入
│   ├── directives/           # 自定义指令
│   │   └── clickDebounce/    # 防抖指令
│   ├── types/                # 类型定义和默认数据
│   │   ├── defaultData.js    # 默认数据
│   │   ├── antvCharts/       # AntV图表类型
│   │   └── echarts/          # ECharts图表类型
│   └── plugins/              # 插件
│       └── jsmpegPlayer/     # 视频播放器插件
├── .env                      # 环境变量
├── .env.development          # 开发环境变量
├── .env.production           # 生产环境变量
├── vue.config.js             # Vue配置文件
├── babel.config.js           # Babel配置
└── package.json              # 项目依赖



## 🎯 核心功能
### 1. 响应式布局系统
- 基于 CSS Grid 和 Flexbox 的响应式布局
- 支持头部、底部、左右侧边栏的灵活配置
- 适配 3840x2160 4K 分辨率大屏显示
### 2. 丰富的图表组件
- ECharts图表 : 柱状图、饼图、3D饼图、折线图等
- AntV G2图表 : 统计图表、嵌套饼图等
- 自定义图表 : 支持图表交互和动画效果
### 3. 模块化页面结构
- 4个主要页面模块，每个模块包含4个子页面
- 支持页面间的平滑切换和路由导航
- 组件化的页面布局和内容管理
### 4. 数据可视化特性
- 实时数据更新和展示
- 图表交互和高亮效果
- 自定义主题和样式配置
## 🛠️ 安装和使用
### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0


## 🛠️ 安装和使用
### 环境要求
- Node.js >= 14.0.0
- npm >= 6.0.0
### 安装依赖
```
npm install
```
### 开发环境运行
```
npm run serve
```
项目将在 http://localhost:3688 启动

### 生产环境构建
```
npm run build
```
### 代码检查
```
npm run lint
```
## ⚙️ 配置说明
### 环境变量配置
- .env - 通用环境变量
- .env.development - 开发环境变量
- .env.production - 生产环境变量
### Vue配置 (vue.config.js)
- 开发服务器端口: 3688
- 静态资源目录: static
- 路径别名配置:
  - @ → src/
  - @components → src/components/
  - @assets → src/assets/
  - @images → src/assets/images/
  - @utils → src/utils/



## 🔧 开发指南
### 添加新页面
1. 在 src/views/ 下创建新的页面目录
2. 在 src/router/index.js 中添加路由配置
3. 按照现有页面结构创建组件文件
### 添加新图表
1. 在 src/components/echarts/ 或 src/components/antvCharts/ 下创建图表组件
2. 在 src/types/ 下添加对应的数据类型定义
3. 在页面中引入和使用图表组件
### 样式开发
1. 使用 SCSS 预处理器
2. 遵循 CSS 变量系统
3. 保持响应式设计原则
## 📝 注意事项
1. 分辨率适配 : 项目针对 3840x2160 分辨率优化，其他分辨率可能需要调整样式
2. 浏览器兼容 : 建议使用现代浏览器 (Chrome 80+, Firefox 75+, Safari 13+)
3. 性能优化 : 大量图表渲染时注意内存管理和组件销毁
4. 数据更新 : 实时数据更新时注意防抖和节流处理




## 📄 许可证
本项目采用 MIT 许可证 - 查看 LICENSE 文件了解详情

## 👥 作者
- Hua - 51world - 初始开发
## 🙏 致谢
- Vue.js - 渐进式 JavaScript 框架
- ECharts - 强大的数据可视化库
- Element UI - 基于 Vue 2.0 的桌面端组件库
- AntV - 蚂蚁集团数据可视化解决方案
