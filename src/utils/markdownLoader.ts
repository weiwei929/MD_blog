import fm from 'front-matter';
import type { Article } from '../types';

// 定义 Frontmatter 接口
interface Frontmatter {
  title: string;
  date: string;
  category: string;
  tags: string[];
  description: string;
  coverImage?: string;
  featured?: boolean;
  author?: string;
  readTime?: string;
}

export const loadArticles = (): Article[] => {
  // 使用 Vite 的 import.meta.glob 同步加载所有 .md 文件内容
  const modules = import.meta.glob('../posts/*.md', { eager: true, as: 'raw' });
  
  const articles: Article[] = Object.keys(modules).map((path, index) => {
    const rawContent = modules[path];
    // 解析 Frontmatter 和正文
    const { attributes, body } = fm<Frontmatter>(rawContent);
    const frontmatter = attributes;
    
    // 从文件名获取 slug
    const fileName = path.split('/').pop() || '';
    const slug = fileName.replace('.md', '');

    return {
      id: index + 1000, // 避免与硬编码 ID 冲突
      title: frontmatter.title || '无标题',
      description: frontmatter.description || '',
      date: frontmatter.date ? new Date(frontmatter.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      category: (frontmatter.category || 'tech') as any,
      coverImage: frontmatter.coverImage || '',
      tags: frontmatter.tags || [],
      featured: frontmatter.featured || false,
      author: frontmatter.author || 'Admin',
      readTime: frontmatter.readTime || '5 分钟',
      slug: slug,
      content: body,
    };
  });

  // 按日期降序排序
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
