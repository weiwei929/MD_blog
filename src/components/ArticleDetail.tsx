import { useEffect, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { motion } from 'framer-motion';
import { articles, categories } from '../data';
import { siteConfig } from '../siteConfig';
import 'highlight.js/styles/github-dark.css';

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const article = articles.find(a => a.slug === slug || a.id.toString() === slug);
  const [imageError, setImageError] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    if (article) {
      document.title = `${article.title} - ${siteConfig.siteName}`;
    }
    return () => {
      document.title = siteConfig.siteName;
    };
  }, [slug, article]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">文章未找到</h1>
          <button
            onClick={() => navigate('/')}
            className="text-gray-900 hover:text-gray-700 underline"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const category = categories.find(cat => cat.id === article.category);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 pt-24 pb-16"
    >
      <div className="max-w-4xl mx-auto px-4">
        {/* 返回按钮 */}
        <button
          onClick={() => navigate('/articles')}
          className="mb-6 text-gray-600 hover:text-gray-900 flex items-center gap-2"
        >
          ← 返回文章列表
        </button>

        {/* 文章头部 */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`${category?.color} text-white text-sm font-bold px-3 py-1 rounded-full`}>
              {category?.name}
            </span>
            {article.featured && (
              <span className="bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                精选
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm mb-6">
            {article.author && <span>作者：{article.author}</span>}
            <span>发布于：{article.date}</span>
            {article.readTime && <span>阅读时长：{article.readTime}</span>}
          </div>

          <p className="text-xl text-gray-600 mb-6">{article.description}</p>

          {/* 封面图 */}
          {article.coverImage && (
            <div className="rounded-xl overflow-hidden mb-8 bg-gray-100 relative">
              {!imageError ? (
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-auto"
                  loading="eager"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-64 flex flex-col items-center justify-center text-gray-400 bg-gray-50 border border-gray-100">
                  <ImageIcon size={48} className="mb-3 opacity-50" />
                  <span className="text-sm font-medium">暂无封面</span>
                </div>
              )}
            </div>
          )}
        </header>

        {/* 文章内容 */}
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          <div className="prose prose-lg prose-slate max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-a:text-gray-900 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-code:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-gray-900 prose-pre:text-gray-100
            prose-img:rounded-lg prose-img:shadow-md
            prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic
            prose-ul:list-disc prose-ol:list-decimal
            prose-li:text-gray-700
            prose-table:border-collapse prose-th:border prose-th:border-gray-300 prose-td:border prose-td:border-gray-300
            prose-video:rounded-lg prose-video:shadow-md"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
              components={{
                // 自定义图片渲染，支持懒加载
                img: ({ src, alt }) => (
                  <img src={src} alt={alt} loading="lazy" className="w-full h-auto" />
                ),
                // 自定义视频渲染
                video: ({ src, children, ...props }) => (
                  <video controls className="w-full rounded-lg" {...props}>
                    {children}
                  </video>
                ),
              }}
            >
              {article.content || '暂无内容'}
            </ReactMarkdown>
          </div>
        </div>

        {/* 标签 */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">相关标签</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default ArticleDetail;
