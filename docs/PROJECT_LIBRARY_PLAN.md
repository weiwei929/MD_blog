# 个人项目库 — 技术方案文档（方案 A）

> **状态**: 待实施  
> **创建日期**: 2026-03-16  
> **方案**: 手动维护配置

---

## 一、方案概述

在博客中新增「个人项目库」板块，通过**手动维护的配置文件**展示个人开发项目。数据与 `D:\workspace` 解耦，完全可控，可展示任意来源的项目（含外部仓库、非 workspace 项目）。

### 核心特点

- **完全可控**：展示哪些项目、顺序、分类、是否精选，均由配置决定
- **实现简单**：与现有「每周复盘」架构一致，无需构建时扫描外部目录
- **部署友好**：不依赖 workspace 路径，GitHub Actions 无需额外配置
- **易扩展**：后续可接入 GitHub API、自动抓 star 等

---

## 二、数据结构设计

### 2.1 项目类型定义

```typescript
// src/types.ts 中新增或扩展

export type ProjectCategory = 'ai' | 'product' | 'tool' | 'experiment' | 'other';

export type Project = {
  id: string;                    // 唯一标识，如 'openclaw'
  name: string;                  // 展示名称
  description: string;           // 简短描述（1-2 句）
  category: ProjectCategory;     // 分类
  tags: string[];               // 标签，如 ['AI', 'Telegram', 'Go']
  repo?: string;                // GitHub 仓库 URL
  demo?: string;                // 在线演示 URL
  docs?: string;                // 文档链接
  path?: string;                // workspace 路径（可选，仅作展示用）
  featured?: boolean;           // 是否精选展示
  createdAt?: string;           // 创建/首次展示日期（YYYY-MM-DD）
  updatedAt?: string;           // 最后更新日期
};
```

### 2.2 分类配置

```typescript
// 与 categories 类似，可复用或扩展

export const projectCategories: { id: ProjectCategory; name: string; color: string }[] = [
  { id: 'ai', name: 'AI 工具', color: 'bg-violet-600' },
  { id: 'product', name: '核心产品', color: 'bg-emerald-600' },
  { id: 'tool', name: '效率工具', color: 'bg-amber-600' },
  { id: 'experiment', name: '实验原型', color: 'bg-sky-600' },
  { id: 'other', name: '其他', color: 'bg-zinc-600' },
];
```

---

## 三、文件结构

```
src/
├── data/
│   ├── projects.ts          # 项目列表（新增）
│   └── ...
├── components/
│   ├── ProjectCard.tsx     # 项目卡片（新增）
│   ├── ProjectLibrary.tsx  # 项目库页面（新增）
│   └── ...
├── types.ts                # 扩展 Project 类型
└── ...
```

---

## 四、数据文件示例

### 4.1 `src/data/projects.ts`

```typescript
import type { Project } from '../types';

export const projects: Project[] = [
  {
    id: 'openclaw',
    name: 'OpenClaw',
    description: 'AI 驱动的个人助手，支持 Telegram、Notion、WebUI，多部署方式（Go/npm/Docker）。',
    category: 'ai',
    tags: ['AI', 'Telegram', 'Go', 'Docker'],
    repo: 'https://github.com/weiwei929/openclaw-all',
    docs: 'https://github.com/weiwei929/openclaw-all#readme',
    path: 'ai-tools/openclaw-all',
    featured: true,
    updatedAt: '2026-03-11',
  },
  {
    id: 'cliproxyapi',
    name: 'CLIProxyAPI',
    description: 'OpenAI/Gemini/Claude 兼容的 API 代理，支持 CLI 多账号负载均衡。',
    category: 'ai',
    tags: ['AI', 'API', 'Proxy'],
    repo: 'https://github.com/weiwei929/CLIProxyAPI',
    featured: true,
    updatedAt: '2026-01-01',
  },
  {
    id: 'pdl',
    name: 'PDL 个人数字生命体',
    description: 'Agent 驱动的数字身份与品牌展示平台，非传统博客。',
    category: 'product',
    tags: ['Agent', '数字身份', 'Brand'],
    path: 'GeminiMVP',
    featured: true,
    updatedAt: '2026-01-01',
  },
  {
    id: 'crush-event',
    name: 'Travel Crush',
    description: '境外游客智能导航助手，扫码即用、用后即焚的 Crush 范式展示。',
    category: 'experiment',
    tags: ['Hackathon', 'Travel', 'AI'],
    path: 'crush-event-mvp',
    featured: false,
    updatedAt: '2026-01-01',
  },
  {
    id: 'vps-manager',
    name: 'VPS Manager',
    description: '个人 VPS 管理系统，远端采集 + 本地分析，生成汇总报告与看板。',
    category: 'tool',
    tags: ['DevOps', 'VPS', 'Python'],
    repo: 'https://github.com/weiwei929/vps-manager',
    path: 'vps-manager',
    featured: false,
    updatedAt: '2026-01-01',
  },
  {
    id: 'md-blog',
    name: 'Pennfly Blog',
    description: '本博客，React + TypeScript + Vite + Tailwind，Markdown 优先。',
    category: 'product',
    tags: ['React', 'Vite', 'Blog'],
    repo: 'https://github.com/weiwei929/MD_blog',
    path: 'content/blogs/md-blog',
    featured: true,
    updatedAt: '2026-03-16',
  },
  // 按需添加更多项目...
];
```

---

## 五、组件设计

### 5.1 ProjectCard 组件

- **职责**：展示单个项目卡片
- **Props**：`project: Project`, `onClick?: () => void`
- **UI**：卡片布局，含名称、描述、标签、链接图标（可选）
- **交互**：点击可跳转详情页或外链

### 5.2 ProjectLibrary 页面

- **职责**：项目库主页面
- **功能**：
  - 分类筛选（全部 / AI 工具 / 核心产品 / …）
  - 搜索（名称、描述、标签）
  - 卡片网格展示
  - 精选项目置顶或单独展示

### 5.3 路由

- 路径：`/projects`
- 导航：在 Header 中新增「项目库」入口

---

## 六、实现步骤

### Step 1：扩展类型与数据

1. 在 `src/types.ts` 中新增 `Project`、`ProjectCategory` 类型
2. 创建 `src/data/projects.ts`，填入初始项目数据

### Step 2：创建 ProjectCard 组件

1. 新建 `src/components/ProjectCard.tsx`
2. 参考 `AchievementCard` 的卡片布局与样式
3. 支持展示 repo、demo、docs 等链接图标

### Step 3：创建 ProjectLibrary 页面

1. 新建 `src/components/ProjectLibrary.tsx`
2. 参考 `HomePage` 的筛选、搜索逻辑
3. 引入 `CategoryFilter` 或实现类似筛选

### Step 4：路由与导航

1. 在 `App.tsx` 中新增 `/projects` 路由
2. 在 Header 的 `navItems` 中新增「项目库」

### Step 5：首页展示（可选）

- 在 HeroSection 下方增加「精选项目」区块，展示 `featured: true` 的项目

---

## 七、UI 参考

### 卡片布局示意

```
┌─────────────────────────────────────┐
│ [分类标签]              [精选]       │
│                                     │
│ 项目名称                             │
│ 简短描述，一行或两行...               │
│                                     │
│ #tag1  #tag2  #tag3                  │
│                                     │
│ 2026-03-11    [GitHub] [Demo] [→]   │
└─────────────────────────────────────┘
```

### 页面布局

- 顶部：标题「个人项目库」+ 简短说明
- 中部：搜索框 + 分类筛选
- 主体：响应式卡片网格（1/2/3 列）

---

## 八、与现有架构的衔接

| 现有模块 | 衔接方式 |
|----------|----------|
| `siteConfig` | 可复用社交链接、品牌信息 |
| `categories` | 项目分类可独立，也可复用配色体系 |
| `AchievementCard` | ProjectCard 可参考其样式与布局 |
| `HomePage` | ProjectLibrary 可参考筛选、搜索逻辑 |
| `Footer` | 项目库页面使用 `Footer simple` |

---

## 九、后续扩展

- **GitHub API**：自动抓取 star、fork、latest release
- **详情页**：`/project/:id` 展示完整介绍、截图、技术栈
- **与博客联动**：项目卡片可关联相关博客文章

---

## 十、注意事项

1. **path 字段**：仅作展示或调试用，不参与构建或部署逻辑
2. **私有项目**：不写入 `projects.ts` 即可不展示
3. **外部项目**：可添加任意 GitHub/外部链接，无需在 workspace 中存在

---

## 附录：workspace 项目速查

| 路径 | 项目名 | 建议分类 |
|------|--------|----------|
| ai-tools/openclaw-all | OpenClaw | ai |
| ai-tools/CLIProxyAPI | CLIProxyAPI | ai |
| ai-tools/sub2api | sub2api | ai |
| GeminiMVP | PDL 个人数字生命体 | product |
| crush-event-mvp | Travel Crush | experiment |
| vps-manager | VPS Manager | tool |
| content/blogs/md-blog | Pennfly Blog | product |
| devops/* | 运维工具 | tool（按需） |
| network/* | 网络工具 | tool（按需） |

---

*文档结束。择机按上述步骤实施即可。*
