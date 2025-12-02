export type CategoryId = 'all' | 'tech' | 'life' | 'tutorial' | 'thoughts';

export type Category = {
  id: CategoryId;
  name: string;
  color: string;
};

// Blog 文章类型（兼容原有 Achievement）
export type Article = {
  id: number;
  title: string;
  description: string;
  date: string; // ISO 日期字符串
  category: Exclude<CategoryId, 'all'>;
  coverImage: string;
  tags: string[];
  featured: boolean;
  // Blog 新增字段
  author?: string;
  readTime?: string; // 如 "5 分钟"
  content?: string; // Markdown 内容
  slug?: string; // URL 友好的标识符
};

// 向后兼容别名
export type Achievement = Article;
