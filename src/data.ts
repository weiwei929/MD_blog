import type { Article, Category } from './types';

import { loadArticles } from './utils/markdownLoader';

// 加载本地 Markdown 文章
const localArticles = loadArticles();

export const articles: Article[] = [
  ...localArticles,
  {
    id: 1,
    title: 'React 18 新特性深度解析',
    description: '深入探讨 React 18 的并发特性、自动批处理和 Suspense 改进',
    date: '2023-10-15',
    category: 'tech',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    tags: ['React', '前端', 'JavaScript'],
    featured: true,
    author: '张三',
    readTime: '8 分钟',
    slug: 'react-18-deep-dive',
    content: `# React 18 新特性深度解析

React 18 带来了革命性的并发渲染特性，让我们深入了解这些改进。

## 并发渲染

并发渲染是 React 18 最重要的更新之一，它允许 React 同时准备多个版本的 UI。

\`\`\`jsx
import { startTransition } from 'react';

function App() {
  const [isPending, startTransition] = useTransition();
  
  const handleClick = () => {
    startTransition(() => {
      setSearchQuery(input);
    });
  };
}
\`\`\`

## 自动批处理

React 18 会自动批处理所有状态更新，无论它们来自哪里。

![React 18 架构图](https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3)

> 这是一个革命性的更新，大幅提升了性能。

## 总结

React 18 为现代 Web 应用开发带来了更强大的工具。`,
  },
  {
    id: 2,
    title: '如何用 Vite 构建现代化前端项目',
    description: 'Vite 作为新一代构建工具，提供了极速的开发体验',
    date: '2023-09-20',
    category: 'tutorial',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    tags: ['Vite', '构建工具', '工程化'],
    featured: true,
    author: '李四',
    readTime: '10 分钟',
    slug: 'vite-modern-frontend',
    content: `# Vite 项目搭建指南

## 快速开始

\`\`\`bash
npm create vite@latest my-project -- --template react-ts
cd my-project
npm install
npm run dev
\`\`\`

## 配置优化

<video controls width="100%">
  <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
</video>

### 路径别名

\`\`\`ts
// vite.config.ts
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
});
\`\`\``,
  },
  {
    id: 3,
    title: '我的编程之路：从零到全栈',
    description: '分享我从编程小白到全栈工程师的成长历程',
    date: '2023-11-05',
    category: 'life',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    tags: ['个人成长', '经验分享', '全栈'],
    featured: false,
    author: '王五',
    readTime: '15 分钟',
    slug: 'my-coding-journey',
    content: `# 我的编程之路

这是我的编程成长故事...

## 第一阶段：HTML/CSS 入门

学习前端基础知识是非常重要的第一步。

## 第二阶段：JavaScript 深入

掌握 JavaScript 让我的技能上了一个台阶。`,
  },
  {
    id: 4,
    title: 'TypeScript 高级类型技巧',
    description: '掌握这些高级类型技巧，让你的 TypeScript 代码更优雅',
    date: '2023-08-30',
    category: 'tech',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    tags: ['TypeScript', '类型系统', '进阶'],
    featured: false,
    author: '赵六',
    readTime: '12 分钟',
    slug: 'typescript-advanced-types',
    content: `# TypeScript 高级类型

## 条件类型

\`\`\`typescript
type IsString<T> = T extends string ? true : false;
\`\`\`

## 映射类型

通过映射类型可以创建强大的类型转换。`,
  },
];

// 向后兼容
export const achievements = articles;

export const categories: Category[] = [
  { id: 'all', name: '全部', color: 'bg-zinc-600' },
  { id: 'tech', name: '技术博客', color: 'bg-stone-600' },
  { id: 'tutorial', name: '教程指南', color: 'bg-neutral-600' },
  { id: 'life', name: '生活随笔', color: 'bg-slate-600' },
  { id: 'thoughts', name: '思考感悟', color: 'bg-gray-600' },
];
