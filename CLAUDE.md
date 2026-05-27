# 项目概述

**产品名称**：灵感猎人 (Inspiration Hunter)

**产品定位**：AI 灵感捕获与思维延展系统 — 帮助用户以最低摩擦记录碎片化灵感，AI 自动补全未表达完整的思路。

**不是**笔记软件、Todo 软件、项目管理工具。

**当前目标**：MVP 第一版，验证灵感快速输入体验 + AI 自动整理能力 + AI 思维延展能力。

**MVP 范围**：
- 快速输入（text + voice 预留）
- 灵感时间流
- AI 自动总结/思维延展/关键概念提取（DeepSeek API）
- 语义搜索 + 相似灵感推荐
- PWA 安装

**明确不包含**：社交、团队协作、复杂分类、日历、工作流、AI Agent、大型自动化。

---

# 技术架构

| 层 | 技术 | 说明 |
|---|---|---|
| 前端 | React 19 + Vite 6 + TailwindCSS 3.4 + TypeScript | SPA，移动端优先 |
| 状态管理 | Zustand 5 | 轻量全局状态 |
| PWA | vite-plugin-pwa | autoUpdate 模式 |
| 后端 | Express 5 + TypeScript | REST API |
| 数据库 | SQLite (sql.js, 纯 JS 免编译) | 文件存储于 data/ |
| AI 服务 | DeepSeek API (deepseek-chat) | 真实 API，自动处理 |
| 环境变量 | dotenv | .env 文件位于项目根目录 |
| 运行 | concurrently | 前后端同时启动 |

---

# 项目目录结构

```
inspiration-hunter/
├── CLAUDE.md                    # 项目长期记忆（本文件）
├── package.json                 # 根 monorepo（workspaces + concurrently）
├── README.md
├── .env                         # API key 等敏感配置（不提交）
├── .env.example                 # 环境变量模板（提交）
├── start.bat / stop.bat         # 快捷脚本
├── data/                        # SQLite 数据库文件
│   └── inspirations.db
├── client/                      # React 前端
│   ├── public/
│   │   ├── manifest.json        # PWA manifest
│   │   └── sw.js               # Service Worker
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # AppShell（主布局）, Sidebar（侧边栏）
│   │   │   ├── input/           # ThoughtInput（核心输入组件）
│   │   │   └── thought/         # ThoughtFlow（时间流）, ThoughtBlock（单条灵感）, AIInsight（AI 延展面板）
│   │   ├── hooks/               # useAutoResize
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
    │   │   ├── inspirations.ts  # CRUD + 搜索 + 相似推荐
    │   │   └── ai.ts           # AI 端点（summarize, extend-thought, process-all）
    │   ├── services/
    │   │   ├── inspirationService.ts  # 业务逻辑 + DB 操作 + 搜索/相似匹配
    │   │   └── aiService.ts          # DeepSeek API 调用
    │   ├── db/
    │   │   ├── index.ts         # sql.js 连接 + migrate() + migration 追踪
    │   │   ├── migrate.ts       # 独立迁移脚本
    │   │   └── migrations/
    │   │       ├── 001_init.sql
    │   │       └── 002_add_embedding.sql
    │   ├── middleware/
    │   │   └── errorHandler.ts  # 统一错误处理 + 404
    │   ├── types/               # 后端类型
    │   └── index.ts             # Express 入口
    └── package.json
```

---

# 页面结构

单页面应用，三栏布局：

| 区域 | 组件 | 说明 |
|---|---|---|
| 侧边栏 | Sidebar | 灵感列表 + 语义搜索 |
| 主内容区 | ThoughtFlow | 选中的灵感详情 + AI 延展 + 相似推荐 |
| 输入区 | ThoughtInput | 底部固定，大圆角输入框 |

---

# 组件结构

| 组件 | 文件 | 职责 |
|---|---|---|
| App | App.tsx | 根组件，初始化数据 + PWA 事件 |
| AppShell | components/layout/AppShell.tsx | 三栏主布局 |
| Sidebar | components/layout/Sidebar.tsx | 灵感列表导航 + 语义搜索 |
| ThoughtInput | components/input/ThoughtInput.tsx | textarea 输入，Enter 提交 |
| ThoughtFlow | components/thought/ThoughtFlow.tsx | 灵感时间流 + 无限滚动 |
| ThoughtBlock | components/thought/ThoughtBlock.tsx | 单条灵感展示（内容/总结/AI 延展/相似推荐/删除） |
| AIInsight | components/thought/AIInsight.tsx | AI 延展思考面板（手风琴） |

---

# API 结构

Base: `http://localhost:3001/api`

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | /inspirations | 创建灵感（自动触发 AI 处理，同步返回结果） |
| GET | /inspirations | 列表（?limit&offset） |
| GET | /inspirations/search?q=xxx | 语义搜索（匹配 embedding_keywords） |
| GET | /inspirations/:id | 单条详情 |
| GET | /inspirations/:id/similar | 相似灵感推荐（基于关键概念重叠） |
| DELETE | /inspirations/:id | 删除灵感 |
| POST | /ai/summarize | AI 总结（1-2 句） |
| POST | /ai/extend-thought | AI 延展（3 个思考方向） |
| POST | /ai/process-all | 一键全处理 + 入库 |
| GET | /health | 健康检查 |

---

# 数据库结构

### inspirations 表

```sql
CREATE TABLE inspirations (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  title TEXT,
  summary TEXT,
  keywords TEXT,              -- JSON array string（已废弃，不再使用）
  embedding_keywords TEXT,    -- 关键概念，逗号分隔（用于搜索和相似匹配）
  extended_thoughts TEXT,     -- JSON array of {direction, content}
  source TEXT DEFAULT 'text',
  ai_status TEXT DEFAULT 'idle',  -- idle | processing | done | error
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

### _migrations 表（内部追踪）

```sql
CREATE TABLE IF NOT EXISTS _migrations (
  name TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL
);
```

---

# AI 工作流

**当前状态**：已接入 DeepSeek API，生产可用

**模型**：`deepseek-chat`，Base URL：`https://api.deepseek.com/v1`

**API Key 配置**：在项目根目录创建 `.env` 文件：
```
DEEPSEEK_API_KEY=sk-your-key-here
DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
```

**AI 处理流程**：
1. 用户创建灵感 → 后端同步调用 3 个 AI 函数（并行）
2. `summarize`：生成 1-2 句中文总结
3. `extendThought`：生成 3 个思考方向（JSON 数组）
4. `generateEmbeddingKeywords`：提取 5-10 个关键概念（逗号分隔）
5. 全部入库 → ai_status = 'done' → 返回完整数据给前端
6. 如果任何一步失败 → ai_status = 'error'（前端显示重试按钮）

**Embedding 实现**：基于关键概念关键词的文本匹配（非向量 embedding）：
- 创建灵感时 DeepSeek 提取关键概念存入 `embedding_keywords`
- 搜索：将查询词与所有灵感的 embedding_keywords 做包含匹配，按匹配度排序
- 相似推荐：找到与当前灵感 embedding_keywords 有重叠的其他灵感

---

# 修改日志

| 日期 | 内容 | 文件 |
|---|---|---|
| 2026-05-27 | MVP Phase 1-5 全部初始创建 | 全部 41 个文件 |
| 2026-05-27 | 修复: better-sqlite3→sql.js, TailwindCSS v4→v3, 版本修正 | client/package.json, server/package.json, server/src/db/*, server/src/services/inspirationService.ts |
| 2026-05-27 | 添加快捷脚本 start.bat / stop.bat | start.bat, stop.bat |
| 2026-05-27 | PWA 图标 + 手机安装支持 + share.bat 隧道 | public/icons/, share.bat |
| 2026-05-27 | UI 全面重设计: 侧边栏 + 极简主区域 + 浮动输入框 | client/src/components/*, client/src/index.css |
| 2026-05-27 | 接入真实 DeepSeek API，删除 stub，简化 AI 端点 | server/src/services/aiService.ts, server/src/routes/ai.ts |
| 2026-05-27 | 新增 embedding_keywords + 语义搜索 + 相似灵感推荐 | server/src/db/migrations/002_add_embedding.sql, server/src/services/inspirationService.ts, server/src/routes/inspirations.ts |
| 2026-05-27 | Migration 追踪系统（_migrations 表），避免重复迁移 | server/src/db/index.ts |
| 2026-05-27 | 环境变量管理: .env / .env.example / dotenv | .env, .env.example, server/src/services/aiService.ts |

---

# 当前待办

- [ ] 生成 PWA 图标文件（client/public/icons/icon-192.png, icon-512.png）
- [ ] 语音输入功能
- [ ] 灵感编辑功能

---

# 开发要点

- **快捷启动**：双击 `start.bat`（自动安装依赖 + 迁移 + 启动前后端）
- **快捷停止**：双击 `stop.bat`（关闭端口 5173 和 3001 的进程）
- **命令行启动**：`npm run dev`
- **数据库位置**：`data/inspirations.db`（sql.js 纯 JS 实现，免编译）
- **.env 文件**：必须在项目根目录创建（参照 .env.example），不会被 git 提交
- **每次修改后必须更新本文件**
