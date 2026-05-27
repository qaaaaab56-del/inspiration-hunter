# 项目概述

**产品名称**：灵感猎人 (Inspiration Hunter)

**产品定位**：AI 灵感捕获与思维延展系统 — 帮助用户以最低摩擦记录碎片化灵感，AI 自动补全未表达完整的思路。

**不是**笔记软件、Todo 软件、项目管理工具。

**当前目标**：MVP 第一版，验证灵感快速输入体验 + AI 自动整理能力 + AI 思维延展能力。

**MVP 范围**：
- 快速输入（text + voice 预留）
- 灵感时间流
- AI 自动总结/标题/关键词/思维延展（当前为 stub）
- PWA 安装

**明确不包含**：社交、团队协作、复杂分类、日历、工作流、AI Agent、大型自动化。

---

# 技术架构

| 层 | 技术 | 说明 |
|---|---|---|
| 前端 | React 19 + Vite 6 + TailwindCSS 4 + TypeScript | SPA，移动端优先 |
| 状态管理 | Zustand 5 | 轻量全局状态 |
| PWA | vite-plugin-pwa | autoUpdate 模式 |
| 后端 | Express 5 + TypeScript | REST API |
| 数据库 | SQLite (better-sqlite3) | 文件存储于 data/ |
| AI 服务 | 预留（当前 stub 返回模拟数据） | 真实 API 待接入 |
| 运行 | concurrently | 前后端同时启动 |

---

# 项目目录结构

```
inspiration-hunter/
├── CLAUDE.md                    # 项目长期记忆（本文件）
├── package.json                 # 根 monorepo（workspaces + concurrently）
├── README.md
├── data/                        # SQLite 数据库文件
│   └── inspirations.db
├── client/                      # React 前端
│   ├── public/
│   │   ├── manifest.json        # PWA manifest
│   │   └── sw.js               # Service Worker
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # AppShell（主布局）, Header（顶栏）
│   │   │   ├── input/           # QuickInput（核心输入组件）
│   │   │   ├── inspiration/     # InspirationCard, InspirationList, InspirationDetail
│   │   │   ├── ai/              # AIExtend, AIKeywords, AISummary
│   │   │   └── ui/              # EmptyState, Skeleton
│   │   ├── hooks/               # useInspirations, useAutoResize
│   │   ├── services/            # api.ts（后端通信）, ai.ts（AI 专用）
│   │   ├── store/               # useInspirationStore（Zustand）
│   │   ├── types/               # TypeScript 类型定义
│   │   ├── App.tsx              # 根组件
│   │   ├── main.tsx             # 入口
│   │   └── index.css            # TailwindCSS + 自定义变量
│   ├── index.html
│   ├── vite.config.ts           # Vite 配置 + PWA 插件 + API 代理
│   └── package.json
└── server/                      # Express 后端
    ├── src/
    │   ├── routes/
    │   │   ├── inspirations.ts  # CRUD + process 路由
    │   │   └── ai.ts           # AI 端点（stub）
    │   ├── services/
    │   │   ├── inspirationService.ts  # 业务逻辑 + DB 操作
    │   │   └── aiService.ts          # AI 服务（stub，返回 mock）
    │   ├── db/
    │   │   ├── index.ts         # better-sqlite3 连接 + migrate()
    │   │   ├── migrate.ts       # 独立迁移脚本
    │   │   └── migrations/
    │   │       └── 001_init.sql # 初始建表
    │   ├── middleware/
    │   │   └── errorHandler.ts  # 统一错误处理 + 404
    │   ├── types/               # 后端类型
    │   └── index.ts             # Express 入口
    └── package.json
```

---

# 页面结构

当前为单页面应用，无路由：

| 区域 | 组件 | 说明 |
|---|---|---|
| 顶栏 | Header | 应用名 + PWA 安装按钮 |
| 输入区 | QuickInput | 始终可见，固定在内容顶部 |
| 内容区 | InspirationList | 时间流，无限滚动 |
| 空状态 | EmptyState | 无灵感时引导 |
| 加载态 | Skeleton | 骨架屏 |

---

# 组件结构

| 组件 | 文件 | 职责 |
|---|---|---|
| App | App.tsx | 根组件，初始化数据 + PWA 事件 |
| AppShell | components/layout/AppShell.tsx | 主布局（header + main） |
| Header | components/layout/Header.tsx | 极简顶栏 |
| QuickInput | components/input/QuickInput.tsx | textarea 输入，Enter 提交，字数提示 |
| InspirationList | components/inspiration/InspirationList.tsx | 列表容器，无限滚动 |
| InspirationCard | components/inspiration/InspirationCard.tsx | 单条卡片，折叠/展开，删除确认 |
| InspirationDetail | components/inspiration/InspirationDetail.tsx | 展开详情，AI 延展面板 |
| AIExtend | components/ai/AIExtend.tsx | AI 延展思考（手风琴） |
| AIKeywords | components/ai/AIKeywords.tsx | 关键词标签组 |
| AISummary | components/ai/AISummary.tsx | AI 总结文案 |
| EmptyState | components/ui/EmptyState.tsx | 空状态引导 |
| Skeleton | components/ui/Skeleton.tsx | 加载骨架屏 |

---

# API 结构

Base: `http://localhost:3001/api`

| 方法 | 路径 | 说明 | AI 状态 |
|---|---|---|---|
| POST | /inspirations | 创建灵感 | — |
| GET | /inspirations | 列表（?limit&offset） | — |
| GET | /inspirations/:id | 单条详情 | — |
| DELETE | /inspirations/:id | 删除灵感 | — |
| POST | /inspirations/:id/process | 标记处理中 | 触发 |
| POST | /ai/summarize | AI 总结 | stub |
| POST | /ai/generate-title | AI 标题 | stub |
| POST | /ai/extract-keywords | AI 关键词 | stub |
| POST | /ai/extend-thought | AI 延展 | stub |
| POST | /ai/process-all | 一键全处理 + 入库 | stub |
| GET | /health | 健康检查 | — |

---

# 数据库结构

### inspirations 表

```sql
CREATE TABLE inspirations (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  title TEXT,
  summary TEXT,
  keywords TEXT,           -- JSON array string
  extended_thoughts TEXT,  -- JSON array of {direction, content}
  source TEXT DEFAULT 'text',
  ai_status TEXT DEFAULT 'idle',  -- idle | processing | done | error
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

---

# AI 工作流

**当前状态**：Stub（模拟数据）

**AI 处理流程**：
1. 用户创建灵感 → ai_status = 'idle'
2. 用户点击「AI 理解」→ ai_status = 'processing'
3. 调用 POST /api/ai/process-all → 依次执行 title/summary/keywords/extend
4. 入库 → ai_status = 'done'
5. 前端实时更新 card 展示

**替换方式**：修改 `server/src/services/aiService.ts` 中的各函数，替换 fakeDelay + mock data 为真实 API 调用。

**Stub 规则**：
- 关键词基于 content 中文字匹配（树→数据结构，笔记→知识管理...）
- 标题组合前两个关键词
- 延展固定返回 3 个方向

---

# 修改日志

| 日期 | 内容 | 文件 |
|---|---|---|
| 2026-05-27 | MVP Phase 1-5 全部初始创建 | 全部 41 个文件 |

---

# 当前待办

- [ ] 生成 PWA 图标文件（client/public/icons/icon-192.png, icon-512.png）
- [ ] 接入真实 AI API
- [ ] 语音输入功能
- [ ] 灵感搜索/筛选
- [ ] 灵感编辑功能

---

# 开发要点

- **运行**：`npm run setup && npm run dev`（setup 安装依赖 + 运行迁移）
- **独立迁移**：`npm run migrate -w server`
- **前端端口**：5173，**后端端口**：3001
- **API 代理**：Vite 自动代理 /api → localhost:3001
- **数据库位置**：data/inspirations.db（自动创建）
- **每次修改后必须更新本文件**
