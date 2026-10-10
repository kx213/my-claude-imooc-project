# 口袋账本 · 前端原型（Pocket Ledger Frontend）

> 本目录是「口袋账本」V1.0.1 的前端 Web 原型实现，对齐产品 PRD
> - [001.产品PRD（V1.0.1）.md](../001.产品PRD（产品经理）/001.产品PRD（V1.0.1）.md) —— 用户系统、本地账号、数据隔离、备份恢复
> - [001.产品PRD.md](../001.产品PRD（产品经理）/001.产品PRD.md) —— 核心记账、统计、预算、多账本、导出

## 快速开始

无需 build 工具。直接双击 `pocket-ledger/index.html` 即可在浏览器中打开。

> 建议使用 Chrome / Edge / Safari 近 2 年版本打开（PBKDF2 依赖 `window.crypto.subtle`，HTTPS 或 `localhost` / `file://` 协议下均可用；file:// 下部分浏览器要求「允许访问本地文件」）。

## 目录结构

```
pocket-ledger/
├── index.html              登录 / 注册 / 忘记密码入口
├── home.html               首页：财务总览 + 记一笔 + 今日明细
├── statistics.html         统计：日/周/月/年 + 分类占比 + Top 排行 + 联动明细
├── budget.html             预算：总预算 + 分类预算 + 超支提醒 + 历史日志
├── profile.html            我的：用户卡 + 账本 + 分类 + 数据备份 + 退出登录
├── assets/
│   ├── css/
│   │   ├── tailwind.config.js   共享 Tailwind 主题（色板/字体/间距/圆角）
│   │   └── base.css             共享基础样式（reset / 滚动条 / 安全区）
│   ├── js/
│   │   ├── storage.js           localStorage 封装（ma_users / ma_records / ...）
│   │   ├── crypto.js            PBKDF2-SHA256 100000 次 + 随机 salt
│   │   ├── auth.js              注册 / 登录 / 退出 / 账号重置（PRD V1.0.1 F9-F12-B）
│   │   ├── shell.js             侧边栏 + 顶栏渲染
│   │   ├── toast.js             统一 Toast
│   │   ├── guard.js             路由守卫
│   │   ├── seed.js              默认账本 + 预设分类
│   │   ├── records.js           首页记账 / 今日明细 / 月度汇总
│   │   ├── budget.js            预算 CRUD + 80%/100% 提醒
│   │   ├── stats.js             统计页数据聚合
│   │   └── backup.js            JSON / CSV 导入导出
│   └── img/
│       └── logo.svg             项目 Logo（薄荷绿钱包 + ¥ 铜币）
└── docs/
    ├── DESIGN.md                设计 token（来自原 pocket_ledger/DESIGN.md）
    ├── PAGES.md                 页面跳转地图 + PRD 章节对照
    └── DATA_MODEL.md            localStorage 字段说明
```

## 核心模块一览

| 模块 | 文件 | 关键导出 | 说明 |
| --- | --- | --- | --- |
| 存储层 | `storage.js` | `getUsers / addRecord / getRecordsByOwner / ...` | 所有接口按 `ownerId` 过滤 |
| 加密 | `crypto.js` | `hashPassword / generateSalt` | PBKDF2-SHA256 100000 次 |
| 鉴权 | `auth.js` | `register / login / logout / resetAccount / getCooldownRemainingMs` | 5 次失败冷却 30s |
| 备份 | `backup.js` | `exportCurrentUserJson / restoreFromJsonFile` | V1.0 / V1.0.1 兼容 |

## PRD 验收对照

| PRD 章节 | 实现位置 |
| --- | --- |
| §4 F1 快速记账 | `home.html` + `records.js` |
| §4 F2 分类管理 | `profile.html` 新增分类弹窗 + `seed.js` 预置分类 |
| §4 F3 收支明细 | `home.html` 今日明细 + 详情弹窗 |
| §4 F4 统计报表 | `statistics.html` + `stats.js` |
| §4 F5 预算管理 | `budget.html` + `budget.js` |
| §4 F6 多账本 | `profile.html` 账本管理（邀请码为占位） |
| §4 F7 数据导出 | `backup.js#exportCurrentUserCsv` |
| §4 F8 记录编辑 / 删除 | `home.html` 详情弹窗删除按钮 |
| V1.0.1 §4 F9 注册 | `auth.js#register` |
| V1.0.1 §4 F10 登录 | `auth.js#login` |
| V1.0.1 §4 F11 退出登录 | `auth.js#logout` + `shell.js` 顶栏退出按钮 |
| V1.0.1 §13.2 F12-A 忘记密码入口 | `index.html` 忘记密码弹窗 |
| V1.0.1 §13.2 F12-B 账号重置 | `auth.js#resetAccount` |
| V1.0.1 §13.2 F12-C 从备份恢复 | `backup.js#restoreFromJsonFile` |
| V1.0.1 §13.2 F12-D 7 天备份提醒 | `profile.html` 顶部 banner |
| V1.0.1 §13.2 F12-E 注册后备份教育 | `index.html` `backup-edu` 浮层 |

## 已知边界

- **共享账本邀请码**：原型阶段为 UI 占位，未对接云端（PRD V1.0.1 §13.6 留到 V2.0 云端同步）。
- **跨设备同步**：依赖用户在「我的」中手动导出 / 导入 JSON（PRD V1.0.1 §13.6 留到 V2.0）。
- **找回密码**：仅支持「重置账号」+「从备份恢复」两条路径，**不提供邮箱/短信**（PRD V1.0.1 §13.1 明确）。
- **测试数据**：首次访问 `index.html` 直接进入登录/注册页，**未登录无法访问任何业务页**（PRD §5.1）。

## 旧文件清理

原 `frontend/_1/ ... _5/code.html` 与 `frontend/pocket_ledger/DESIGN.md` 已被本目录替代，可在确认无回归后删除。