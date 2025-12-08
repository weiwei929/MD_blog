import type { Article, Category } from './types';
import { loadArticles } from './utils/markdownLoader';

// 加载本地 Markdown 文章
const localArticles = loadArticles();

export const articles: Article[] = [
  ...localArticles,
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
