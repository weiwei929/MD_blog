---
id: 5
title: 实战记录：如何优化一个 React + TypeScript 博客项目
date: 2025-12-08
description: 记录了一次对 MD_Blog 项目的全面优化过程，涵盖代码规范、数据管理、SEO 及用户体验提升。
category: tech
tags: [React, TypeScript, Refactoring, Optimization]
featured: true
author: Pennfly
coverImage: /images/blog-optimization.png
readTime: 10 分钟
---

# 实战记录：如何优化一个 React + TypeScript 博客项目

最近，我对我的个人博客项目（MD_Blog）进行了一次深度的代码审计与优化。这个项目基于 React、TypeScript 和 Vite 构建。在审查过程中，我发现了一些典型的“开发期遗留问题”，并针对性地进行了修复。这篇文章将分享我的优化思路和具体实现。

## 1. 拒绝硬编码：统一配置管理

在代码审计中，最早发现的问题是散落在各个组件中的硬编码字符串。例如，在 `ContactModal.tsx` 和 `App.tsx` 中，我的邮箱、GitHub 地址等信息都是直接写死的字符串。

这样做的问题显而易见：一旦我需要更改邮箱，就必须遍历多个文件，既麻烦又容易出错。

### 解决方案

我创建了一个统一的配置文件 `src/siteConfig.ts`：

```typescript
export const siteConfig = {
  author: 'Pennfly',
  siteName: 'Pennfly 创新实验室',
  social: {
    email: 'pennfly2008@gmail.com',
    x: 'https://x.com/pennfly',
    github: 'https://github.com/pennfly',
    // ...其他社交链接
  },
  contact: {
    email: 'pennfly2008@gmail.com',
    // ...
  }
};
```

然后在组件中引用：

```tsx
// src/components/ContactModal.tsx
import { siteConfig } from '../siteConfig';

// 使用配置
link: `mailto:${siteConfig.social.email}`
```

这遵循了 **SSOT (Single Source of Truth)** 原则，让维护变得极其简单。

## 2. 数据源净化：移除样例数据

在 `data.ts` 中，我发现除了动态加载本地 Markdown 的逻辑外，还残留了一些开发初期用于测试 UI 的硬编码“样例文章”（如 React 18 介绍等）。

这会导致：
1.  **ID 冲突**：硬编码的 ID 可能与动态生成的 ID 重复。
2.  **内容混淆**：用户的文章夹杂着测试数据。
3.  **删除失效**：前端的文件删除逻辑显然无法删除这些硬编码在 JS 中的数据。

### 解决方案

这一步最简单也最关键：**直接删除硬编码数组**。

```typescript
// src/data.ts
const localArticles = loadArticles();

export const articles: Article[] = [
  ...localArticles, 
  // 移除所有硬编码的对象
];
```

现在，`src/posts` 目录成为了内容的唯一来源。

## 3. 用户体验微调：删除与导航

### 更诚实的删除提示

由于这是一个纯静态博客（无后端数据库），前端所谓的“删除”其实是依赖浏览器实验性的 File System Access API 来操作本地文件。这有很大局限性：
- 并不是所有浏览器都支持。
- 即使操作成功，Vite 的热重载或浏览器缓存有时会让文件“起死回生”。

为了不误导用户，我没有选择移除功能，而是优化了文案，明确告知风险和兜底方案：

> **⚠️ 注意事项：**
> *   此操作将尝试通过浏览器 API 删除本地文件。
> *   由于缓存或权限原因，**刷新页面后文章可能会重新出现**。
> *   **彻底删除方法：**如本功能无效，请直接在项目目录 `src/posts` 中手动删除对应的 `.md` 文件。

### 更加符合直觉的导航

在文章详情页，左上角的“返回”按钮原本导向首页 (`/`)。这在体验上不仅突兀（不仅丢失了列表页的滚动位置，还要重新看一遍 Hero 动画），而且不符合用户“返回上一级”的预期。

我将其修改为导向文章列表页：

```tsx
<button onClick={() => navigate('/articles')}>
  ← 返回文章列表
</button>
```

## 4. SEO 优化：动态标题

单页应用 (SPA) 的一个常见痛点是浏览器标题一直是固定的（例如 "My Blog"）。这对于用户在多标签页切换时不友好，对 SEO 也没帮助。

我在 `ArticleDetail.tsx` 中加入了一个简单的 `useEffect` 钩子来实现动态标题：

```tsx
useEffect(() => {
  // 进入文章时设置：文章标题 - 站点名称
  if (article) {
    document.title = `${article.title} - ${siteConfig.siteName}`;
  }
  
  // 离开（卸载）组件时还原
  return () => {
    document.title = siteConfig.siteName;
  };
}, [slug, article]);
```

## 5. TypeScript 进阶：告别 @ts-ignore

在处理 File System Access API 时，为了图省事，原代码使用了 `@ts-ignore` 来通过编译。

```typescript
// ❌ Bad practice
// @ts-ignore
const dirHandle = await window.showDirectoryPicker(...)
```

虽然解决了报错，但这放弃了类型检查的保护。我创建了 `src/types/file-system.d.ts`，补全了相关类型定义：

```typescript
// src/types/file-system.d.ts
interface Window {
  showDirectoryPicker(options?: {...}): Promise<FileSystemDirectoryHandle>;
}
// ... 其他接口定义
```

移除 `@ts-ignore` 后，代码不仅看着清爽，而且 IDE 还能提供智能提示，开发体验和代码质量双赢。

## 6. 开发反思：AI 协作的新范式

这是一个我借助 Gemini Antigravity 从零开始搭建的轻量级博客项目。在开发过程中，我并没有完全依赖单一的 AI，而是探索出了一套**“多模型协作”**的高效工作流。

具体来说，在进行这次大规模优化前，我先将项目文件交给 **Cursor** 进行全量审计。我特别强调：“只检查，不改代码”。Cursor 生成了一份详细的《检查项目 MD_Blog，勿改代码.md》报告。随后，我将这份报告交给 **Antigravity**，由它来进行二次评估和最终的修复执行。

这次“左右互搏”的操作带给我三点深刻的感悟：

1.  **兼听则明，偏听则暗**：不同的 AI 产品有不同的知识盲区和特性。借助不同 AI 工具（一个负责审计，一个负责执行），可以有效地规避单一工具的盲点，让问题暴露得更彻底。
2.  **保持开发的“稳定性”**：在 AI 辅助开发中，最忌讳的是多个 AI 同时修改代码，这往往会导致风格冲突甚至逻辑崩溃。我采用“Cursor 审计 -> Antigravity 执行”的模式，确保了对代码修改权的收敛，保持了代码风格的一致性。
3.  **基础架构的重要性**：虽然 AI 能力强大，但我们仍需对基础保持敬畏。打好地基（统一配置、类型规范、数据结构）比急于看到功能更重要。既要充分信任 AI 的执行力，又要对其输出保持警惕，不厌其烦地进行验证。

这或许是比代码优化本身更大的收获。

## 总结

通过这次优化，MD_Blog 从一个“能跑的 Demo”变成了一个更加**规范、健壮、易维护**的个人产品。

技术债就像房间里的灰尘，定期打扫才能保持清爽。希望这些优化经验能对你有所启发！
