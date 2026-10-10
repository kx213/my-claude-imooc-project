# 登录与注册 - 口袋账本 · UI 原型

## 📐 设计来源

- **Figma 文件**：<https://www.figma.com/design/T05rb01rItBjnGkcTsHgRb/Untitled?node-id=1-2>
- **节点 ID**：`1:2` （登录与注册 - 口袋账本）
- **画板尺寸**：1280 × 1002（桌面端）
- **还原时间**：2026-10-09
- **还原工具**：Figma MCP（`get_metadata` / `get_screenshot` / `download_assets` / `get_design_context`）

## 📁 目录结构

```
登录与注册-口袋账本/
├── README.md                       # 本说明文档
├── preview.html                    # 1:1 还原的 HTML 预览（打开即可看）
├── 登录与注册-口袋账本@1x.png       # Figma 导出的原始 PNG（1280×1002）
└── assets/                         # Figma 导出的 SVG 矢量图标
    ├── icon-logo.svg               # Logo 钱包图标（19×18）
    ├── icon-user.svg               # 用户名输入框图标（12×12）
    ├── icon-password.svg           # 密码输入框图标（12×15.75）
    ├── icon-eye.svg                # 密码可见切换图标（16.5×11.25）
    ├── icon-arrow.svg              # 登录按钮右侧箭头（12×12）
    └── icon-lock.svg               # 底部盾牌/加密图标（10.667×13.333）
```

## 🎨 设计规范

### 颜色

| 角色 | 取值 | 用途 |
|---|---|---|
| Primary（品牌主色） | `#006a63` | Logo 底色、主按钮、链接文字 |
| On Primary | `#ffffff` | 主按钮文字、Logo 图标 |
| Surface | `#f7f9ff` | 页面背景 |
| Surface Container Lowest | `#ffffff` | 卡片底、激活 Tab |
| Surface Container Low | `#edf4ff` | 输入框背景 |
| Surface Container | `#e3efff` | Tab 切换器背景 |
| On Surface | `#091d2e` | 主标题文字 |
| On Surface Variant | `#3e4947` | 表单 Label |
| Outline | `#6e7977` | 副标题、辅助文字 |
| Outline Variant | `#bdc9c6` | 输入框 placeholder |
| 装饰模糊光斑 1 | `rgba(0, 106, 99, 0.1)` | 右上 |
| 装饰模糊光斑 2 | `rgba(117, 215, 204, 0.2)` | 左下 |

### 字体

- **Font Family**：`WenQuanYi Zen Hei` / `PingFang SC` / `Microsoft YaHei`（系统中文字体优先）
- **标题**：`32px / 40px line-height / -0.8 letter-spacing / Medium`
- **副标题**：`12px / 16px / Medium`
- **Tab 文字**：`14px / 20px / Medium`
- **Label**：`12px / 16px / Medium`
- **输入框**：`14px / normal / Medium`
- **按钮文字**：`14px / 20px / Medium`
- **底部说明**：`16px / 24px / Medium`

### 圆角 & 阴影

- **卡片**：`border-radius: 12px`，阴影 `0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)`
- **Logo / 激活 Tab**：圆形 `border-radius: 9999px`，阴影 `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)`
- **输入框 / Tab 内嵌**：`border-radius: 8px`
- **按钮**：`border-radius: 8px`
- **复选框**：`border-radius: 2.5px`
- **装饰光斑**：`border-radius: 9999px` + `blur(20px)`

### 间距

- **卡片宽度**：448px（桌面最大）
- **表单宽度**：384px
- **Header 内边距**：`32px 32px 16px 32px`
- **Tabs 内边距**：`0 32px`
- **Forms 内边距**：`24px 32px`
- **Tab 内边距**：`4px`
- **Button 高度**：44px（登录按钮）、36px（Tab 按钮）
- **Input 高度**：40px

## 🧩 布局层级（与 Figma 节点 ID 一一对应）

```
1:2  登录与注册 - 口袋账本（1280×1002）
└── 1:3  Background+Shadow（448×555 卡片）
    ├── 1:4   Decorative background accent（右上模糊光斑）
    ├── 1:5   Header / Logo Area
    │   ├── 1:6  Background（圆形 Logo 底）
    │   │   ├── 1:7  Overlay+Shadow
    │   │   └── 1:8  Container → 1:9 Icon（icon-logo.svg）
    │   ├── 1:10 Heading 1 → 1:11 Text（口袋账本）
    │   └── 1:12 Container → 1:13 Text（V1.0.1 副标题）
    ├── 1:14 Tab Switcher
    │   └── 1:15 Background
    │       ├── 1:16 Button（登录）→ 1:17 Text
    │       └── 1:18 Button（注册新账号）→ 1:19 Text
    ├── 1:20 Forms Container → Form - LOGIN FORM
    │   ├── 1:21 Container（用户名）
    │   │   ├── 1:22 Label → 1:23 Text
    │   │   └── 1:24 Container（输入框）
    │   │       ├── 1:25 Input → 1:26 Container → 1:27 Text
    │   │       └── 1:28 Container → 1:29 Container → 1:30 Icon（icon-user.svg）
    │   ├── 1:31 Container（密码）
    │   │   ├── 1:32 Label → 1:33 Text
    │   │   └── 1:34 Container（输入框）
    │   │       ├── 1:35 Input → 1:36 Container → 1:37 Text
    │   │       ├── 1:38 Container → 1:39 Container → 1:40 Icon（icon-password.svg）
    │   │       └── 1:41 Button → 1:42 Container → 1:43 Icon（icon-eye.svg）
    │   ├── 1:44 Container（记住我 + 忘记密码）
    │   │   ├── 1:45 Label（记住我）
    │   │   │   ├── 1:46 Input（复选框）
    │   │   │   └── 1:47 Container → 1:48 Text
    │   │   └── 1:49 Button → 1:50 Text（忘记密码？）
    │   └── 1:51 Button（安全登录）
    │       ├── 1:52 Button:shadow
    │       ├── 1:53 Container → 1:54 Text
    │       └── 1:55 Container → 1:56 Icon（icon-arrow.svg）
    ├── 1:57 Overlay+Blur（左下模糊光斑）
    └── 1:58 Footer Security Badge
        ├── 1:59 Container → 1:60 Icon（icon-lock.svg）
        └── 1:61 Container → 1:62 Text（PBKDF2 说明）
```

## 🚀 使用方式

### 方式一：直接预览 HTML（推荐）
在浏览器中打开 `preview.html`，即可看到与 Figma 像素级一致的还原页面。所有图标使用本地 SVG，无外部依赖。

### 方式二：查看原始 PNG
直接打开 `登录与注册-口袋账本@1x.png`，这是 Figma 直接导出的位图（1280×1002）。

### 方式三：交付给前端
- **图标资源**：`assets/` 目录下的 6 个 SVG，可直接用于生产代码。
- **HTML 结构**：`preview.html` 的 DOM 结构已与 Figma 节点对应，可作为前端实现参考。
- **Tailwind 复刻**：`preview.html` 内嵌的 CSS 已 1:1 对应 Figma 中的所有 Tailwind 类，迁移至 Tailwind 项目时可直接复用。
