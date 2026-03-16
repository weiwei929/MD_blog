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
  const modules = import.meta.glob('../posts/**/*.md', { eager: true, as: 'raw' });
  const articles: Article[] = [];

  for (const modulePath of Object.keys(modules)) {
    try {
      const rawContent = modules[modulePath] as string;
      const { attributes, body } = fm<Frontmatter>(rawContent);
      const frontmatter = attributes;

      // 从路径获取 slug（兼容 / 和 \）
      const relativePath = modulePath.replace(/^.*[\/\\]posts[\/\\]/, '').replace(/\.md$/, '');
      const slug = relativePath.replace(/[/\\]/g, '-');

      articles.push({
        id: articles.length + 1000,
        title: frontmatter.title || '无标题',
        description: frontmatter.description || '',
        date: frontmatter.date ? new Date(frontmatter.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        category: (frontmatter.category || 'tech') as any,
        coverImage: frontmatter.coverImage || '',
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
        featured: frontmatter.featured || false,
        author: frontmatter.author || 'Admin',
        readTime: frontmatter.readTime || '5 分钟',
        slug,
        content: body,
      });
    } catch (err) {
      console.warn(`[markdownLoader] 跳过解析失败的文件: ${modulePath}`, err);
    }
  }

  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
